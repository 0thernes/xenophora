import { FULLSCREEN_VS } from '../shaders/common.glsl.js';
import { PDE_INIT_FS, PDE_STEP_FS, PDE_VIS_FS } from '../shaders/pde.glsl.js';
import { buildRaymarchFS, buildRaypickFS } from '../shaders/raymarch.glsl.js';
import {
  ACCUM_FS,
  BLOOM_PREFILTER_FS,
  BLOOM_DOWN_FS,
  BLOOM_UP_FS,
  COMPOSITE_FS,
} from '../shaders/post.glsl.js';

const PDE_SIZE = 256;
const PDE_VIS_SIZE = 108;

export class XenophoraRenderer {
  constructor(canvas, pdePreviewCanvas) {
    this.canvas = canvas;
    this.pdePreviewCanvas = pdePreviewCanvas;
    this.pdePreviewCtx = pdePreviewCanvas ? pdePreviewCanvas.getContext('2d') : null;
    this.pdePixels = new Uint8Array(PDE_VIS_SIZE * PDE_VIS_SIZE * 4);
    this.pdeImageData = this.pdePreviewCtx
      ? this.pdePreviewCtx.createImageData(PDE_VIS_SIZE, PDE_VIS_SIZE)
      : null;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true, // Enables crisp PNG capture
      powerPreference: 'high-performance',
    });
    if (!gl) {
      throw new Error('WebGL2 is required for XENOPHORA.');
    }
    this.gl = gl;

    // Detect software/virtualized WebGL (e.g. SwiftShader) so frame budgets never trigger GPU TDR
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    this.gpuRenderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    this.isSoftwareGpu = /swiftshader|llvmpipe|software|basic render|mesa offscreen/i.test(String(this.gpuRenderer || ''));
    console.info(`[XENOPHORA GPU] ${this.gpuRenderer} (software=${this.isSoftwareGpu})`);

    this.contextLost = false;
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.contextLost = true;
      console.error('[XENOPHORA] WebGL context lost!');
    });

    // Enable float FBO rendering (RGBA16F is universally linearly filterable in WebGL2 core!)
    this.hasColorBufferFloat = !!gl.getExtension('EXT_color_buffer_float');
    this.hasHalfFloat = this.hasColorBufferFloat || !!gl.getExtension('EXT_color_buffer_half_float');
    this.hdrInternalFormat = this.hasHalfFloat ? gl.RGBA16F : gl.RGBA8;
    this.hdrType = this.hasHalfFloat ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Core shared programs
    this.progPdeInit = this._createProgram(FULLSCREEN_VS, PDE_INIT_FS, 'PDE_INIT');
    this.progPdeStep = this._createProgram(FULLSCREEN_VS, PDE_STEP_FS, 'PDE_STEP');
    this.progPdeVis = this._createProgram(FULLSCREEN_VS, PDE_VIS_FS, 'PDE_VIS');
    this.progAccum = this._createProgram(FULLSCREEN_VS, ACCUM_FS, 'ACCUM');
    this.progBloomPre = this._createProgram(FULLSCREEN_VS, BLOOM_PREFILTER_FS, 'BLOOM_PRE');
    this.progBloomDown = this._createProgram(FULLSCREEN_VS, BLOOM_DOWN_FS, 'BLOOM_DOWN');
    this.progBloomUp = this._createProgram(FULLSCREEN_VS, BLOOM_UP_FS, 'BLOOM_UP');
    this.progComposite = this._createProgram(FULLSCREEN_VS, COMPOSITE_FS, 'COMPOSITE');

    // Lazily compiled per-regime raymarch & raypick shaders
    this.regimePrograms = new Map();
    this.pickPrograms = new Map();

    // Persistent 512x512 Ping-Pong CGLE PDE FBOs
    this.pdeFbos = [
      this._createTarget(PDE_SIZE, PDE_SIZE, this.hdrInternalFormat, gl.RGBA, this.hdrType, gl.REPEAT),
      this._createTarget(PDE_SIZE, PDE_SIZE, this.hdrInternalFormat, gl.RGBA, this.hdrType, gl.REPEAT),
    ];
    this.pdeIdx = 0;

    // 108x108 RGBA8 FBO for live HUD CGLE monitor preview
    this.pdeVisFbo = this._createTarget(
      PDE_VIS_SIZE,
      PDE_VIS_SIZE,
      gl.RGBA8,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      gl.CLAMP_TO_EDGE
    );

    // 1x1 RGBA8 FBO for universal cross-GPU 3D ray-pick -> intrinsic PDE UV + autofocus depth
    this.pickFbo = this._createTarget(1, 1, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.CLAMP_TO_EDGE);
    this.pickBuf = new Uint8Array(4);

    // Screen-sized HDR & bloom targets (initialized on first resize)
    this.renderW = 0;
    this.renderH = 0;
    this.sceneFbo = null;
    this.accumFbos = [null, null];
    this.accumIdx = 0;
    this.bloomMips = [];
    this.bloomUps = [];

    this.sampleCount = 0;
    this.frameCounter = 0;
    this.activeRegime = 0;
    this.pendingInjection = null;
    this.renderScale = 1.0;

    // Initialize PDE with chiral topological spiral vortices
    this.seedPDE(0, Math.random() * 100);
    // Warm up PDE 24 substeps so rich spiral chimera structure exists on Frame 1 (<8ms!)
    for (let i = 0; i < 24; i++) {
      this._stepPDEOnce(1.15, -1.08, 0.026, i * 0.02, null);
    }

    // Pre-compile Regime 0 immediately for instant startup
    this._getRegimeProgram(0);
    this.resize(1.0, false);
  }

  _compileShader(type, src, label) {
    const gl = this.gl;
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh);
      console.error(`[XENOPHORA Shader Error: ${label}]\n`, log);
      throw new Error(`Shader compile failed (${label}): ${log}`);
    }
    return sh;
  }

  _createProgram(vsSrc, fsSrc, label) {
    const gl = this.gl;
    const vs = this._compileShader(gl.VERTEX_SHADER, vsSrc, `${label}_VS`);
    const fs = this._compileShader(gl.FRAGMENT_SHADER, fsSrc, `${label}_FS`);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(prog);
      console.error(`[XENOPHORA Program Link Error: ${label}]\n`, log);
      throw new Error(`Program link failed (${label}): ${log}`);
    }
    const uniforms = {};
    const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(prog, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(prog, info.name);
    }
    return { prog, uniforms };
  }

  _createTarget(w, h, internalFormat, format, type, wrap = this.gl.CLAMP_TO_EDGE) {
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fbo, tex, w, h };
  }

  _destroyTarget(t) {
    if (!t) return;
    this.gl.deleteFramebuffer(t.fbo);
    this.gl.deleteTexture(t.tex);
  }

  _getRegimeProgram(regimeId) {
    if (!this.regimePrograms.has(regimeId)) {
      const fs = buildRaymarchFS(regimeId);
      this.regimePrograms.set(regimeId, this._createProgram(FULLSCREEN_VS, fs, `REGIME_${regimeId}`));
    }
    return this.regimePrograms.get(regimeId);
  }

  _getPickProgram(regimeId) {
    if (!this.pickPrograms.has(regimeId)) {
      const fs = buildRaypickFS(regimeId);
      this.pickPrograms.set(regimeId, this._createProgram(FULLSCREEN_VS, fs, `PICK_${regimeId}`));
    }
    return this.pickPrograms.get(regimeId);
  }

  setRegime(regimeId) {
    this.activeRegime = regimeId;
    this._getRegimeProgram(regimeId);
    this.resetAccumulation();
  }

  resetAccumulation() {
    this.sampleCount = 0;
  }

  resize(scale = 1.0, refining = false) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const displayW = Math.max(1, Math.floor(window.innerWidth * dpr));
    const displayH = Math.max(1, Math.floor(window.innerHeight * dpr));

    if (this.canvas.width !== displayW || this.canvas.height !== displayH) {
      this.canvas.width = displayW;
      this.canvas.height = displayH;
    }

    // Safe frame-time resolution cap (silky 60fps on GPU; zero TDR even on SwiftShader!)
    const maxDim = this.isSoftwareGpu
      ? (refining ? 720 : 560)
      : (refining ? 1440 : scale < 0.99 ? 860 : 1120);
    const capScale = Math.min(1.0, maxDim / Math.max(displayW, displayH));
    const w = Math.max(256, Math.floor(displayW * scale * capScale));
    const h = Math.max(160, Math.floor(displayH * scale * capScale));

    if (w === this.renderW && h === this.renderH) return;
    this.renderW = w;
    this.renderH = h;
    this.renderScale = scale;

    const gl = this.gl;
    this._destroyTarget(this.sceneFbo);
    this._destroyTarget(this.accumFbos[0]);
    this._destroyTarget(this.accumFbos[1]);
    for (const m of this.bloomMips) this._destroyTarget(m);
    for (const m of this.bloomUps) this._destroyTarget(m);
    this.bloomMips = [];
    this.bloomUps = [];

    this.sceneFbo = this._createTarget(w, h, this.hdrInternalFormat, gl.RGBA, this.hdrType);
    this.accumFbos = [
      this._createTarget(w, h, this.hdrInternalFormat, gl.RGBA, this.hdrType),
      this._createTarget(w, h, this.hdrInternalFormat, gl.RGBA, this.hdrType),
    ];

    // 4-level Kawase bloom pyramid (down + separate upsample targets to avoid float-blend hazards)
    let bw = Math.max(32, w >> 1);
    let bh = Math.max(32, h >> 1);
    for (let i = 0; i < 4; i++) {
      this.bloomMips.push(this._createTarget(bw, bh, this.hdrInternalFormat, gl.RGBA, this.hdrType));
      this.bloomUps.push(this._createTarget(bw, bh, this.hdrInternalFormat, gl.RGBA, this.hdrType));
      bw = Math.max(16, bw >> 1);
      bh = Math.max(16, bh >> 1);
    }

    this.resetAccumulation();
  }

  seedPDE(mode = 0, seed = Math.random() * 100) {
    const gl = this.gl;
    const dst = this.pdeFbos[this.pdeIdx];
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, PDE_SIZE, PDE_SIZE);
    gl.useProgram(this.progPdeInit.prog);
    gl.uniform1f(this.progPdeInit.uniforms.uSeed, seed);
    gl.uniform1i(this.progPdeInit.uniforms.uMode, mode);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.resetAccumulation();
  }

  queuePDEInjection(u, v, strength = 0.85, radius = 0.085, charge = 1.0) {
    this.pendingInjection = { u, v, strength, radius, charge };
  }

  _stepPDEOnce(c1, c2, dt, time, inj) {
    const gl = this.gl;
    const src = this.pdeFbos[this.pdeIdx];
    const dst = this.pdeFbos[1 - this.pdeIdx];
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
    gl.viewport(0, 0, PDE_SIZE, PDE_SIZE);
    gl.useProgram(this.progPdeStep.prog);

    const u = this.progPdeStep.uniforms;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.uniform1i(u.uState, 0);
    gl.uniform2f(u.uTexel, 1 / PDE_SIZE, 1 / PDE_SIZE);
    gl.uniform1f(u.uDt, dt);
    gl.uniform1f(u.uC1, c1);
    gl.uniform1f(u.uC2, c2);
    gl.uniform1f(u.uTime, time);

    if (inj) {
      gl.uniform2f(u.uInjectUv, inj.u, inj.v);
      gl.uniform1f(u.uInjectStrength, inj.strength);
      gl.uniform1f(u.uInjectRadius, inj.radius);
      gl.uniform1f(u.uInjectCharge, inj.charge);
    } else {
      gl.uniform2f(u.uInjectUv, 0.5, 0.5);
      gl.uniform1f(u.uInjectStrength, 0.0);
      gl.uniform1f(u.uInjectRadius, 0.08);
      gl.uniform1f(u.uInjectCharge, 1.0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.pdeIdx = 1 - this.pdeIdx;
  }

  stepPDE(c1, c2, time, substeps = 2) {
    if (this.contextLost) return;
    for (let i = 0; i < substeps; i++) {
      this._stepPDEOnce(c1, c2, 0.026, time, i === 0 ? this.pendingInjection : null);
    }
    this.pendingInjection = null;
  }

  updatePdePreview(filmNm) {
    if (this.contextLost || !this.pdePreviewCtx || !this.pdeImageData) return;
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pdeVisFbo.fbo);
    gl.viewport(0, 0, PDE_VIS_SIZE, PDE_VIS_SIZE);
    gl.useProgram(this.progPdeVis.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.pdeFbos[this.pdeIdx].tex);
    gl.uniform1i(this.progPdeVis.uniforms.uState, 0);
    gl.uniform1f(this.progPdeVis.uniforms.uFilmNm, filmNm);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.readPixels(0, 0, PDE_VIS_SIZE, PDE_VIS_SIZE, gl.RGBA, gl.UNSIGNED_BYTE, this.pdePixels);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Copy with Y flip into 2D HUD canvas
    const dst = this.pdeImageData.data;
    const rowBytes = PDE_VIS_SIZE * 4;
    for (let y = 0; y < PDE_VIS_SIZE; y++) {
      const srcOff = (PDE_VIS_SIZE - 1 - y) * rowBytes;
      const dstOff = y * rowBytes;
      dst.set(this.pdePixels.subarray(srcOff, srcOff + rowBytes), dstOff);
    }
    this.pdePreviewCtx.putImageData(this.pdeImageData, 0, 0);
  }

  _bindSceneUniforms(u, state) {
    const gl = this.gl;
    const { basis, params, lighting, time, frame, jitterScale, focusDist, resW, resH } = state;

    gl.uniform2f(u.uResolution, resW, resH);
    gl.uniform3fv(u.uCamPos, basis.pos);
    gl.uniform3fv(u.uCamRight, basis.right);
    gl.uniform3fv(u.uCamUp, basis.up);
    gl.uniform3fv(u.uCamFwd, basis.fwd);
    gl.uniform1f(u.uFovTan, basis.fovTan);
    gl.uniform1f(u.uFocusDist, focusDist);
    gl.uniform1f(u.uAperture, params.aperture);

    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uFrame, frame);
    gl.uniform1f(u.uJitterScale, jitterScale);
    if (u.uMaxSteps !== undefined) {
      gl.uniform1i(u.uMaxSteps, this.isSoftwareGpu ? 60 : 84);
    }
    if (u.uBounceSteps !== undefined) {
      gl.uniform1i(u.uBounceSteps, this.isSoftwareGpu ? 14 : 24);
    }

    gl.uniform1f(u.uRot4D, params.rot4d);
    gl.uniform1f(u.uRot4D2, params.rot4d2);
    gl.uniform1f(u.uFoldGain, params.foldGain);
    gl.uniform1f(u.uMorph, params.morph);
    gl.uniform1f(u.uSlice, params.slice);
    gl.uniform1f(u.uRelief, params.relief);
    gl.uniform1f(u.uGlow, params.glow);

    gl.uniform1f(u.uFilmNm, params.filmNm);
    gl.uniform1f(u.uIrid, params.irid);
    gl.uniform1f(u.uSparkle, params.sparkle);
    gl.uniform1f(u.uVol, params.vol);

    gl.uniform3fv(u.uKeyDir, lighting.keyDir);
    gl.uniform3fv(u.uKeyCol, lighting.keyCol);
    gl.uniform3fv(u.uFillDir, lighting.fillDir);
    gl.uniform3fv(u.uFillCol, lighting.fillCol);
    gl.uniform3fv(u.uCoreCol, lighting.coreCol);
    gl.uniform3fv(u.uAccentCol, lighting.accentCol);
    gl.uniform3fv(u.uBgTop, lighting.bgTop);
    gl.uniform3fv(u.uBgBot, lighting.bgBot);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.pdeFbos[this.pdeIdx].tex);
    gl.uniform1i(u.uPdeTex, 0);
  }

  // Exact 1x1 GPU Ray-Pick on the live 4D Manifold -> returns { hit, u, v, depth }
  rayPick(ndcX, ndcY, state) {
    const gl = this.gl;
    const pick = this._getPickProgram(this.activeRegime);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickFbo.fbo);
    gl.viewport(0, 0, 1, 1);
    gl.useProgram(pick.prog);
    this._bindSceneUniforms(pick.uniforms, {
      ...state,
      resW: this.canvas.width,
      resH: this.canvas.height,
      frame: 0,
      jitterScale: 0,
    });
    gl.uniform2f(pick.uniforms.uPickNdc, ndcX, ndcY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, this.pickBuf);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return {
      u: this.pickBuf[0] / 255,
      v: this.pickBuf[1] / 255,
      depth: (this.pickBuf[2] / 255) * 12.0,
      hit: this.pickBuf[3] > 128,
    };
  }

  render(state) {
    if (this.contextLost) return this.sampleCount;
    const gl = this.gl;
    const { refining, cameraMoving, params, time } = state;

    // Responsive dynamic scale while actively orbiting; full sharp resolution when resting/refining
    const desiredScale = cameraMoving && !refining ? 0.78 : 1.0;
    this.resize(desiredScale, refining);

    if (cameraMoving) {
      this.sampleCount = 0;
    }

    // Cap progressive path refine cleanly at 256 SPP
    const shouldTrace = !refining || this.sampleCount < 256;
    if (shouldTrace) {
      this.frameCounter++;
      this.sampleCount = refining ? this.sampleCount + 1 : Math.min(this.sampleCount + 1, 12);

      // 1. Primary Stochastic 4D Raymarch + Volumetric + Reflection/Refraction Pass
      const prog = this._getRegimeProgram(this.activeRegime);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFbo.fbo);
      gl.viewport(0, 0, this.renderW, this.renderH);
      gl.useProgram(prog.prog);

      const jitterScale = refining ? 1.0 : cameraMoving ? 0.25 : 0.75;
      this._bindSceneUniforms(prog.uniforms, {
        ...state,
        resW: this.renderW,
        resH: this.renderH,
        frame: this.frameCounter,
        jitterScale,
      });
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // 2. Temporal Accumulation / Live TAA Resolve Pass
      const histSrc = this.accumFbos[this.accumIdx];
      const histDst = this.accumFbos[1 - this.accumIdx];
      gl.bindFramebuffer(gl.FRAMEBUFFER, histDst.fbo);
      gl.viewport(0, 0, this.renderW, this.renderH);
      gl.useProgram(this.progAccum.prog);

      const blend = refining
        ? 1.0 / this.sampleCount
        : cameraMoving
          ? 1.0
          : Math.max(0.32, 1.0 / this.sampleCount);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.sceneFbo.tex);
      gl.uniform1i(this.progAccum.uniforms.uCurrent, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, histSrc.tex);
      gl.uniform1i(this.progAccum.uniforms.uHistory, 1);
      gl.uniform1f(this.progAccum.uniforms.uBlend, blend);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.accumIdx = 1 - this.accumIdx;
    }

    const resolvedTex = this.accumFbos[this.accumIdx].tex;

    // 3. Multi-Mip Dual-Filter Kawase Spectral Bloom
    // Prefilter into Mip 0
    const m0 = this.bloomMips[0];
    gl.bindFramebuffer(gl.FRAMEBUFFER, m0.fbo);
    gl.viewport(0, 0, m0.w, m0.h);
    gl.useProgram(this.progBloomPre.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, resolvedTex);
    gl.uniform1i(this.progBloomPre.uniforms.uSrc, 0);
    gl.uniform2f(this.progBloomPre.uniforms.uTexel, 1 / this.renderW, 1 / this.renderH);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Downsample chain Mip 0 -> 1 -> 2 -> 3
    gl.useProgram(this.progBloomDown.prog);
    for (let i = 1; i < this.bloomMips.length; i++) {
      const prev = this.bloomMips[i - 1];
      const cur = this.bloomMips[i];
      gl.bindFramebuffer(gl.FRAMEBUFFER, cur.fbo);
      gl.viewport(0, 0, cur.w, cur.h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, prev.tex);
      gl.uniform1i(this.progBloomDown.uniforms.uSrc, 0);
      gl.uniform2f(this.progBloomDown.uniforms.uTexel, 1 / prev.w, 1 / prev.h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // Upsample tent pyramid Mip 3 -> 2 -> 1 -> 0 into bloomUps
    gl.useProgram(this.progBloomUp.prog);
    let srcTex = this.bloomMips[this.bloomMips.length - 1].tex;
    let srcW = this.bloomMips[this.bloomMips.length - 1].w;
    let srcH = this.bloomMips[this.bloomMips.length - 1].h;
    for (let i = this.bloomMips.length - 2; i >= 0; i--) {
      const dst = this.bloomUps[i];
      const add = this.bloomMips[i];
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
      gl.viewport(0, 0, dst.w, dst.h);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      gl.uniform1i(this.progBloomUp.uniforms.uSrc, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, add.tex);
      gl.uniform1i(this.progBloomUp.uniforms.uAdd, 1);

      gl.uniform2f(this.progBloomUp.uniforms.uTexel, 1 / srcW, 1 / srcH);
      gl.uniform1f(this.progBloomUp.uniforms.uWeight, 0.72);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      srcTex = dst.tex;
      srcW = dst.w;
      srcH = dst.h;
    }

    // 4. Final Filmic Composite Pass -> Canvas Backbuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.progComposite.prog);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, resolvedTex);
    gl.uniform1i(this.progComposite.uniforms.uScene, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomUps[0].tex);
    gl.uniform1i(this.progComposite.uniforms.uBloom, 1);

    gl.uniform1f(this.progComposite.uniforms.uExposure, params.exposure);
    gl.uniform1f(this.progComposite.uniforms.uTime, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    return this.sampleCount;
  }
}
