import test from 'node:test';
import assert from 'node:assert/strict';

import { REGIMES, mutateState } from '../src/engine/presets.js';
import { OrbitalCamera } from '../src/engine/camera.js';

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function len3(a) {
  return Math.hypot(a[0], a[1], a[2]);
}

test('Exactly 6 curated 4D specimen regimes exist with complete camera, params, and lighting', () => {
  assert.equal(REGIMES.length, 6);
  const ids = new Set();
  for (let i = 0; i < REGIMES.length; i++) {
    const r = REGIMES[i];
    assert.equal(r.id, i);
    ids.add(r.id);
    assert.ok(r.code && r.short && r.subtitle);
    assert.equal(r.camera.target.length, 3);
    assert.ok(r.camera.dist > 0.5 && r.camera.dist < 8.0);
    assert.ok(r.camera.fov >= 30 && r.camera.fov <= 80);

    // Ensure CGLE params start safely inside the operator-split stable manifold
    assert.ok(Math.abs(r.params.c1) <= 1.6, `Regime ${i} c1 out of safe range`);
    assert.ok(Math.abs(r.params.c2) <= 1.8, `Regime ${i} c2 out of safe range`);
    assert.ok(r.params.filmNm >= 160 && r.params.filmNm <= 1250);

    for (const vecKey of ['keyDir', 'keyCol', 'fillDir', 'fillCol', 'coreCol', 'accentCol', 'bgTop', 'bgBot']) {
      assert.equal(r.lighting[vecKey].length, 3, `Regime ${i} lighting.${vecKey} must be vec3`);
      for (const v of r.lighting[vecKey]) {
        assert.ok(Number.isFinite(v), `Regime ${i} lighting.${vecKey} contains non-finite value`);
      }
    }
  }
  assert.equal(ids.size, 6);
});

test('OrbitalCamera produces strictly orthonormal basis vectors across all presets and interactions', () => {
  const cam = new OrbitalCamera();
  for (const r of REGIMES) {
    cam.applyPreset(r.camera, true);
    const b = cam.getBasis();

    assert.ok(Math.abs(len3(b.fwd) - 1) < 1e-6, 'fwd must be unit length');
    assert.ok(Math.abs(len3(b.right) - 1) < 1e-6, 'right must be unit length');
    assert.ok(Math.abs(len3(b.up) - 1) < 1e-6, 'up must be unit length');
    assert.ok(Math.abs(dot3(b.fwd, b.right)) < 1e-6, 'fwd ⊥ right');
    assert.ok(Math.abs(dot3(b.fwd, b.up)) < 1e-6, 'fwd ⊥ up');
    assert.ok(Math.abs(dot3(b.right, b.up)) < 1e-6, 'right ⊥ up');
    assert.ok(b.fovTan > 0 && Number.isFinite(b.fovTan));
  }

  // Test clamping on extreme pitch and logarithmic zoom
  cam.orbit(0, 100000);
  cam.zoom(-100000);
  for (let i = 0; i < 60; i++) cam.update(0.05, true);
  assert.ok(cam.pitch <= 1.33 && cam.pitch >= -1.33);
  assert.ok(cam.dist >= 0.42 && cam.dist <= 7.5);
});

test('Genesis mutateState() stays finite and taste-bounded over 50 random mutations', () => {
  const base = REGIMES[0];
  for (let i = 0; i < 50; i++) {
    const m = mutateState(base.params, base.lighting);
    assert.ok(typeof m.paletteName === 'string' && m.paletteName.length > 0);
    assert.ok(m.params.filmNm >= 280 && m.params.filmNm <= 1080);
    assert.ok(m.params.c1 >= 0.65 && m.params.c1 <= 1.45);
    assert.ok(m.params.c2 <= -0.70 && m.params.c2 >= -1.50);
    for (const val of Object.values(m.params)) {
      assert.ok(Number.isFinite(val), 'Mutated param must be finite');
    }
  }
});
