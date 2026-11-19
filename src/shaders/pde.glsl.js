import { COMMON_GLSL } from './common.glsl.js';

// Initializes the 256x256 RGBA16F Complex Ginzburg-Landau + Morphogenesis Memory field
// Channels: R = Re(A), G = Im(A), B = Smooth structural rib relief [0..1], A = Sparse topological defect cores [0..1]
export const PDE_INIT_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform float uSeed;
uniform int uMode;

${COMMON_GLSL}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec2 A = vec2(0.0);

  if (uMode == 1) {
    float r = length(p);
    float ang = atan(p.y, p.x);
    float phase = 4.0 * ang + r * 14.0 + uSeed * 3.1;
    A = vec2(cos(phase), sin(phase)) * smoothstep(0.0, 0.08, r);
  } else {
    // 8 balanced +/-1 topological charge vortices on periodic torus
    float phaseSum = 0.0;
    float amp = 1.0;
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      vec2 c = vec2(
        hash12(vec2(fi * 1.73 + uSeed, 3.19)),
        hash12(vec2(7.41, fi * 2.17 + uSeed))
      );
      vec2 d = vUv - c;
      d -= round(d);
      float charge = (mod(fi, 2.0) < 0.5) ? 1.0 : -1.0;
      phaseSum += charge * atan(d.y, d.x);
      amp *= smoothstep(0.0, 0.045, length(d));
    }
    phaseSum += 1.4 * sin(vUv.x * TAU * 2.0 + uSeed) * cos(vUv.y * TAU * 2.0);
    A = vec2(cos(phaseSum), sin(phaseSum)) * clamp(amp, 0.05, 1.0);
  }

  float rib = 0.5 + 0.5 * sin(atan(A.y, A.x) * 2.0);
  float defect = smoothstep(0.55, 0.08, length(A));
  fragColor = vec4(A, rib, defect);
}
`;

// Unconditionally-stable Operator-Split Complex Ginzburg-Landau (CGLE) PDE!
// Step 1: Exact analytical nonlinear Stuart-Landau integration (zero amplitude overshoot!)
// Step 2: Mild complex dispersion diffusion + isotropic anti-checkerboard damping
// Produces sumptuous, silky rotating quantum spirals & sparse topological defect cores!
export const PDE_STEP_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uDt;
uniform float uC1;
uniform float uC2;
uniform float uTime;

uniform vec2 uInjectUv;
uniform float uInjectStrength;
uniform float uInjectRadius;
uniform float uInjectCharge;

${COMMON_GLSL}

void main() {
  vec4 sC = texture(uState, vUv);

  vec2 dx = vec2(uTexel.x, 0.0);
  vec2 dy = vec2(0.0, uTexel.y);

  vec4 sN  = texture(uState, fract(vUv + dy));
  vec4 sS  = texture(uState, fract(vUv - dy));
  vec4 sE  = texture(uState, fract(vUv + dx));
  vec4 sW  = texture(uState, fract(vUv - dx));
  vec4 sNE = texture(uState, fract(vUv + dx + dy));
  vec4 sNW = texture(uState, fract(vUv - dx + dy));
  vec4 sSE = texture(uState, fract(vUv + dx - dy));
  vec4 sSW = texture(uState, fract(vUv - dx - dy));

  vec2 A = sC.rg;

  // 9-point isotropic Laplacian (maximal rotational symmetry, zero grid bias)
  vec2 avg9 = 0.2 * (sN.rg + sS.rg + sE.rg + sW.rg)
            + 0.05 * (sNE.rg + sNW.rg + sSE.rg + sSW.rg);
  vec2 lapA = avg9 - A;

  // Safe dispersion step guaranteed inside von Neumann stability circle
  float dt = min(uDt, 0.032);
  float c1 = clamp(uC1, -1.5, 1.5);
  float c2 = clamp(uC2, -1.8, 1.8);
  // Real diffusion dominates dispersive rotation at Nyquist -> ZERO checkerboard instability!
  float diffReal = 0.26;
  float diffImag = 0.11 * c1;
  vec2 A1 = A + vec2(
    diffReal * lapA.x - diffImag * lapA.y,
    diffReal * lapA.y + diffImag * lapA.x
  ) * (dt * 12.0);

  // Exact analytical nonlinear Stuart-Landau step:
  // dA/dt = A - (1 + i*c2)*|A|^2*A
  float r2 = dot(A1, A1);
  float r = sqrt(max(r2, 1e-8));
  float e2 = exp(-2.0 * dt);
  float rNext = r / sqrt(e2 + r2 * (1.0 - e2));
  float dPhi = -c2 * r2 * dt * 1.4;
  float cp = cos(dPhi), sp = sin(dPhi);
  vec2 Anext = mat2(cp, -sp, sp, cp) * (A1 * (rNext / r));

  // Interactive spiral singularity / soliton pulse injection!
  if (uInjectStrength > 0.001) {
    vec2 d = vUv - uInjectUv;
    d -= round(d);
    float dist = length(d);
    float env = exp(-(dist * dist) / max(uInjectRadius * uInjectRadius, 1e-5));
    float ang = atan(d.y, d.x);
    float spiralPhase = uInjectCharge * ang + dist * 24.0 - uTime * 3.0;
    vec2 vortex = vec2(cos(spiralPhase), sin(spiralPhase)) * smoothstep(0.0, uInjectRadius * 0.4, dist);
    Anext = mix(Anext, vortex, clamp(env * uInjectStrength, 0.0, 0.9));
  }

  float amp = length(Anext);
  if (amp > 1.35) Anext *= 1.35 / amp;

  // Smooth morphogenesis rib field [0..1] derived from spiral wave phase crests
  float phase = atan(Anext.y, Anext.x);
  float waveCrest = 0.5 + 0.5 * sin(phase * 2.0 + amp * 2.5);
  float lapM = 0.2 * (sN.b + sS.b + sE.b + sW.b) + 0.05 * (sNE.b + sNW.b + sSE.b + sSW.b) - sC.b;
  float mNext = clamp(mix(sC.b, waveCrest, 0.16) + lapM * 0.18, 0.0, 1.0);

  // SPARSE topological phase-defect & soliton-ridge energy [0..1]!
  // Bright ONLY at actual spiral cores (amplitude dip) and sharp phase-wave fronts!
  float coreDip = smoothstep(0.68, 0.14, amp);
  float waveFront = pow(max(0.0, sin(phase * 2.0)), 6.0) * smoothstep(0.3, 0.9, amp);
  float targetVort = clamp(coreDip * 0.95 + waveFront * 0.45, 0.0, 1.0);
  float vort = mix(sC.a, targetVort, 0.18);

  fragColor = vec4(Anext, mNext, vort);
}
`;

// Renders the live 108x108 micro-monitor preview of the Complex Ginzburg-Landau PDE field
export const PDE_VIS_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uState;
uniform float uFilmNm;

${COMMON_GLSL}

void main() {
  vec4 s = texture(uState, vUv);
  float phase = atan(s.g, s.r);
  float amp = length(s.rg);
  float rib = s.b;
  float vort = s.a;

  // Jewel-toned thin-film phase visualization on deep obsidian!
  vec3 irid = thinFilmSpectral(0.55 + 0.35 * cos(phase), uFilmNm + rib * 260.0, 1.56);
  vec3 base = vec3(0.01, 0.014, 0.026) + irid * (0.14 + 0.42 * rib * rib) * smoothstep(0.08, 0.92, amp);

  // Highlight quantum spiral defect cores & bright wave fronts
  vec3 coreGlow = mix(vec3(0.15, 0.85, 1.0), vec3(1.0, 0.32, 0.72), 0.5 + 0.5 * sin(phase));
  base += coreGlow * smoothstep(0.35, 0.92, vort) * 1.1;

  vec2 q = vUv - 0.5;
  base *= 1.0 - 0.5 * dot(q, q);
  fragColor = vec4(acesToneMap(base * 1.15), 1.0);
}
`;
