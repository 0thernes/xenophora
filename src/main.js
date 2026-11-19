import { REGIMES, mutateState } from './engine/presets.js';
import { OrbitalCamera } from './engine/camera.js';
import { XenophoraRenderer } from './engine/renderer.js';
import { PiezoAudioEngine } from './engine/audio.js';
import { HudController } from './ui/hud.js';

const canvas = document.getElementById('gl-canvas');
const pdePreview = document.getElementById('pde-preview');

const camera = new OrbitalCamera();
const audio = new PiezoAudioEngine();
const renderer = new XenophoraRenderer(canvas, pdePreview);

let activeRegimeIdx = 0;
let params = { ...REGIMES[0].params };
let lighting = structuredClone(REGIMES[0].lighting);
let refining = false;
let simTime = 0;
let chargeFlip = 1.0;

// Smooth FPS tracking
let fpsSmooth = 60;
let lastTs = performance.now();
let uiTick = 0;

function selectRegime(id, instantCam = false) {
  const reg = REGIMES[id];
  if (!reg) return;
  activeRegimeIdx = id;
  params = { ...reg.params };
  lighting = structuredClone(reg.lighting);
  camera.applyPreset(reg.camera, instantCam);
  renderer.setRegime(id);
  audio.setRegime(id);
  hud.syncRegime(reg, params);
  if (!instantCam) {
    hud.toast(`${reg.code}`);
  }
}

const hud = new HudController({
  onSelectRegime: (id) => selectRegime(id, false),
  onParamChange: (key, val) => {
    params[key] = val;
    renderer.resetAccumulation();
  },
  onToggleRefine: () => {
    refining = !refining;
    renderer.resetAccumulation();
    hud.syncModes({ refining, driftEnabled: camera.driftEnabled, audioEnabled: audio.enabled });
    hud.toast(refining ? 'PATH REFINE — ACCUMULATING 256 SPP CINEMA TRACE' : 'LIVE CGLE PDE EVOLUTION RESUMED');
  },
  onMutate: () => {
    const m = mutateState(params, lighting);
    params = m.params;
    lighting = m.lighting;
    renderer.seedPDE(Math.random() > 0.5 ? 0 : 1, Math.random() * 500);
    for (let i = 0; i < 24; i++) {
      renderer.stepPDE(params.c1, params.c2, simTime, 1);
    }
    renderer.resetAccumulation();
    hud.syncParams(params);
    audio.pluckPiezo(Math.random(), Math.random(), 0.75);
    hud.toast(`GENESIS MUTATION · ${m.paletteName}`);
  },
  onToggleOrbit: () => {
    camera.driftEnabled = !camera.driftEnabled;
    if (!camera.driftEnabled) renderer.resetAccumulation();
    hud.syncModes({ refining, driftEnabled: camera.driftEnabled, audioEnabled: audio.enabled });
    hud.toast(camera.driftEnabled ? 'GALLERY DRIFT ON' : 'GALLERY DRIFT PAUSED');
  },
  onToggleAudio: () => {
    const on = audio.toggle();
    hud.syncModes({ refining, driftEnabled: camera.driftEnabled, audioEnabled: on });
    hud.toast(on ? 'PIEZO-OPTICAL AUDIO ACTIVE' : 'AUDIO MUTED');
  },
  onCapture: () => {
    const link = document.createElement('a');
    link.download = `xenophora-${REGIMES[activeRegimeIdx].short.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    hud.toast('FRAME CAPTURED TO PNG');
  },
  onSeedPDE: (mode) => {
    renderer.seedPDE(mode, Math.random() * 1000);
    for (let i = 0; i < 20; i++) renderer.stepPDE(params.c1, params.c2, simTime, 1);
    renderer.resetAccumulation();
    audio.pluckPiezo(0.3, 0.7, 0.65);
    hud.toast(mode === 0 ? 'CHIRAL SPIRAL VORTICES SEEDED' : 'HARMONIC RESONANT RING SEEDED');
  },
  onDirectPdeInject: (u, v) => {
    chargeFlip = -chargeFlip;
    renderer.queuePDEInjection(u, v, 0.92, 0.095, chargeFlip);
    renderer.resetAccumulation();
    audio.pluckPiezo(u, v, 0.45);
  },
  onResetCamera: () => {
    camera.applyPreset(REGIMES[activeRegimeIdx].camera, false);
    renderer.resetAccumulation();
    hud.toast('CAMERA RESET');
  },
});

// Initialize Regime 0 immediately
selectRegime(0, true);
hud.syncModes({ refining, driftEnabled: camera.driftEnabled, audioEnabled: audio.enabled });

// ============================================================================
// DIRECT 3D CANVAS INTERACTION: ORBIT, PAN, LOG-ZOOM, 3D PDE INJECT, RACK-FOCUS
// ============================================================================
let pointerMode = null; // 'orbit' | 'pan' | 'inject'
let downX = 0;
let downY = 0;
let lastX = 0;
let lastY = 0;
let movedDist = 0;

function getRenderState(cameraMoving) {
  return {
    basis: camera.getBasis(),
    focusDist: camera.focusDist,
    params,
    lighting,
    time: simTime,
    refining,
    cameraMoving,
  };
}

function injectAtClientPoint(clientX, clientY, showReticle = true) {
  const rect = canvas.getBoundingClientRect();
  const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const ndcY = 1 - ((clientY - rect.top) / rect.height) * 2;
  const pick = renderer.rayPick(ndcX, ndcY, getRenderState(false));
  if (pick.hit) {
    chargeFlip = -chargeFlip;
    renderer.queuePDEInjection(pick.u, pick.v, 0.95, 0.09, chargeFlip);
    if (refining) {
      // Step PDE briefly even if frozen so user sees immediate injected wave
      renderer.stepPDE(params.c1, params.c2, simTime, 6);
    }
    renderer.resetAccumulation();
    if (showReticle) hud.pulseReticle(clientX, clientY);
    audio.pluckPiezo(pick.u, pick.v, 0.72);
    return pick;
  }
  return null;
}

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId);
  downX = lastX = e.clientX;
  downY = lastY = e.clientY;
  movedDist = 0;

  if (e.shiftKey) {
    pointerMode = 'inject';
    injectAtClientPoint(e.clientX, e.clientY, true);
  } else if (e.button === 2 || e.button === 1) {
    pointerMode = 'pan';
    camera.isDragging = true;
  } else {
    pointerMode = 'orbit';
    camera.isDragging = true;
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (!pointerMode) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  movedDist += Math.hypot(dx, dy);

  if (pointerMode === 'orbit') {
    camera.orbit(dx, dy);
  } else if (pointerMode === 'pan') {
    camera.pan(dx, dy);
  } else if (pointerMode === 'inject') {
    injectAtClientPoint(e.clientX, e.clientY, false);
  }
});

canvas.addEventListener('pointerup', (e) => {
  if (pointerMode === 'orbit' && movedDist < 5) {
    // Clean single click directly injects a spiral chimera singularity into the 3D manifold!
    const hit = injectAtClientPoint(e.clientX, e.clientY, true);
    if (hit) {
      hud.toast(`CHIMERA SINGULARITY INJECTED · UV (${hit.u.toFixed(2)}, ${hit.v.toFixed(2)})`);
    }
  }
  pointerMode = null;
  camera.isDragging = false;
});

canvas.addEventListener('dblclick', (e) => {
  // Cinema rack autofocus via exact GPU depth pick!
  const rect = canvas.getBoundingClientRect();
  const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const ndcY = 1 - ((e.clientY - rect.top) / rect.height) * 2;
  const pick = renderer.rayPick(ndcX, ndcY, getRenderState(false));
  if (pick.hit) {
    camera.setFocusDistance(pick.depth);
    renderer.resetAccumulation();
    hud.pulseReticle(e.clientX, e.clientY);
    hud.toast(`OPTICAL FOCUS LOCKED · ${pick.depth.toFixed(2)}m`);
  }
});

canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    camera.zoom(e.deltaY);
  },
  { passive: false }
);

window.addEventListener('resize', () => renderer.resize(1.0));

// ============================================================================
// MAIN RENDER & LIVE PDE LOOP
// ============================================================================
function loop(now) {
  requestAnimationFrame(loop);

  const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
  lastTs = now;
  fpsSmooth += (1 / dt - fpsSmooth) * 0.1;

  const camMoved = camera.update(dt, refining);

  if (!refining) {
    simTime += dt;
    // Step the 512x512 GPU Complex Ginzburg-Landau PDE field every frame!
    renderer.stepPDE(params.c1, params.c2, simTime, 3);
    audio.updateContinuous(params.rot4d + simTime * 0.12, params.c1);
  }

  const spp = renderer.render(getRenderState(camMoved));

  // Refresh the live CGLE micro-monitor & telemetry at ~15 Hz
  uiTick++;
  if (uiTick % 4 === 0) {
    renderer.updatePdePreview(params.filmNm);
    hud.updateTelemetry({
      fps: fpsSmooth,
      spp,
      rot4d: params.rot4d,
      focusDist: camera.focusDist,
    });
  }
}

requestAnimationFrame(loop);
