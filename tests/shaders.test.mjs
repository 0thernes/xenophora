import test from 'node:test';
import assert from 'node:assert/strict';

import { FULLSCREEN_VS } from '../src/shaders/common.glsl.js';
import { PDE_INIT_FS, PDE_STEP_FS, PDE_VIS_FS } from '../src/shaders/pde.glsl.js';
import { buildRaymarchFS, buildRaypickFS } from '../src/shaders/raymarch.glsl.js';
import {
  ACCUM_FS,
  BLOOM_PREFILTER_FS,
  BLOOM_DOWN_FS,
  BLOOM_UP_FS,
  COMPOSITE_FS,
} from '../src/shaders/post.glsl.js';

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function assertBalancedDelimiters(src, label) {
  const clean = stripComments(src);
  let braces = 0;
  let parens = 0;
  let brackets = 0;
  for (const ch of clean) {
    if (ch === '{') braces++;
    else if (ch === '}') braces--;
    else if (ch === '(') parens++;
    else if (ch === ')') parens--;
    else if (ch === '[') brackets++;
    else if (ch === ']') brackets--;
    assert.ok(braces >= 0, `${label}: unmatched closing '}'`);
    assert.ok(parens >= 0, `${label}: unmatched closing ')'`);
    assert.ok(brackets >= 0, `${label}: unmatched closing ']'`);
  }
  assert.equal(braces, 0, `${label}: unbalanced curly braces ({})`);
  assert.equal(parens, 0, `${label}: unbalanced parentheses (())`);
  assert.equal(brackets, 0, `${label}: unbalanced square brackets ([])`);
}

const STATIC_SHADERS = [
  ['FULLSCREEN_VS', FULLSCREEN_VS],
  ['PDE_INIT_FS', PDE_INIT_FS],
  ['PDE_STEP_FS', PDE_STEP_FS],
  ['PDE_VIS_FS', PDE_VIS_FS],
  ['ACCUM_FS', ACCUM_FS],
  ['BLOOM_PREFILTER_FS', BLOOM_PREFILTER_FS],
  ['BLOOM_DOWN_FS', BLOOM_DOWN_FS],
  ['BLOOM_UP_FS', BLOOM_UP_FS],
  ['COMPOSITE_FS', COMPOSITE_FS],
];

test('All static GLSL ES 3.00 shaders start with #version 300 es and have balanced syntax', () => {
  for (const [label, src] of STATIC_SHADERS) {
    assert.ok(src.startsWith('#version 300 es'), `${label} must begin with #version 300 es`);
    assert.ok(src.includes('void main()'), `${label} must define void main()`);
    assertBalancedDelimiters(src, label);
  }
});

test('Operator-split CGLE PDE shader enforces radial clamping and analytical Stuart-Landau step', () => {
  assert.ok(PDE_STEP_FS.includes('exp(-2.0 * dt)'), 'Expected exact analytical Stuart-Landau factor');
  assert.ok(PDE_STEP_FS.includes('uInjectUv'), 'Expected interactive singularity injection uniform');
  assert.ok(PDE_STEP_FS.includes('clamp(uC1'), 'Expected dispersive stability clamp on c1');
});

test('All 6 regimes build valid raymarch and 1x1 raypick shaders with ESSL & ANGLE TDR safeguards', () => {
  for (let id = 0; id < 6; id++) {
    const rm = buildRaymarchFS(id);
    const rp = buildRaypickFS(id);

    for (const [tag, src] of [
      [`RAYMARCH_${id}`, rm],
      [`RAYPICK_${id}`, rp],
    ]) {
      assert.ok(src.startsWith('#version 300 es'), `${tag}: missing #version 300 es`);
      assert.ok(src.includes(`#define REGIME_ID ${id}`), `${tag}: missing REGIME_ID define`);
      assertBalancedDelimiters(src, tag);

      // Regression guard: ESSL 3.00 / WebGL2 forbids ternary ?: on struct HitInfo
      assert.ok(
        !/return\s*\([^)]*\)\s*\?\s*[a-zA-Z0-9_]+\s*:\s*[a-zA-Z0-9_]+\s*;/.test(src),
        `${tag}: found forbidden struct ternary in hitMin`
      );

      // ANGLE HLSL anti-unroll barrier guard
      assert.ok(
        src.includes('int(min(uFrame, 0.0))'),
        `${tag}: missing ZERO loop anti-unroll barrier`
      );
    }

    // Raymarch-specific optical and proximity-gating guards
    assert.ok(rm.includes('thinFilmSpectral('), `RAYMARCH_${id}: missing physical thin-film interference`);
    assert.ok(rm.includes('diffractionSparkle('), `RAYMARCH_${id}: missing diffraction grating sparkle`);
    assert.ok(rm.includes('traceBounce('), `RAYMARCH_${id}: missing secondary reflection/refraction bounce`);
    assert.ok(rm.includes('uPdeTex'), `RAYMARCH_${id}: missing live CGLE PDE sampler`);
    assert.ok(rp.includes('uPickNdc'), `RAYPICK_${id}: missing uPickNdc cursor pick uniform`);
  }
});
