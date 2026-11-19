import { COMMON_GLSL } from './common.glsl.js';

// Temporal Accumulation / Hybrid TAA Blending Pass
export const ACCUM_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uCurrent;
uniform sampler2D uHistory;
uniform float uBlend; // 1.0 = reset, 1/N = path refine, ~0.35 = live motion TAA

void main() {
  vec4 cur = texture(uCurrent, vUv);
  if (uBlend >= 0.999) {
    fragColor = cur;
    return;
  }
  vec4 hist = texture(uHistory, vUv);
  // Protect against NaN poisoning in history buffer
  if (any(isnan(hist.rgb)) || any(isinf(hist.rgb))) hist = cur;
  fragColor = mix(hist, cur, uBlend);
}
`;

// Bloom Prefilter (extracts smooth bright spectral highlights without harsh clipping)
export const BLOOM_PREFILTER_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uSrc;
uniform vec2 uTexel;

void main() {
  // 4-tap box anti-firefly downsample
  vec3 c = 0.25 * (
    texture(uSrc, vUv + uTexel * vec2(-0.5, -0.5)).rgb +
    texture(uSrc, vUv + uTexel * vec2( 0.5, -0.5)).rgb +
    texture(uSrc, vUv + uTexel * vec2(-0.5,  0.5)).rgb +
    texture(uSrc, vUv + uTexel * vec2( 0.5,  0.5)).rgb
  );
  // Selective knee threshold: only luminous irises, plasma portals, and diffraction glints bloom!
  float luma = max(c.r, max(c.g, c.b));
  float thresh = 1.05;
  float knee = 0.65;
  float soft = clamp(luma - thresh + knee, 0.0, 2.0 * knee);
  soft = (soft * soft) / (4.0 * knee + 1e-4);
  float contrib = max(soft, luma - thresh) / max(luma, 1e-4);
  fragColor = vec4(min(c * contrib, vec3(6.0)), 1.0);
}
`;

// Dual-Filter Kawase Downsample
export const BLOOM_DOWN_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uSrc;
uniform vec2 uTexel;

void main() {
  vec3 sum = texture(uSrc, vUv).rgb * 4.0;
  sum += texture(uSrc, vUv - uTexel).rgb;
  sum += texture(uSrc, vUv + uTexel).rgb;
  sum += texture(uSrc, vUv + vec2(uTexel.x, -uTexel.y)).rgb;
  sum += texture(uSrc, vUv + vec2(-uTexel.x, uTexel.y)).rgb;
  fragColor = vec4(sum * 0.125, 1.0);
}
`;

// Dual-Filter Kawase Upsample with tent weights
export const BLOOM_UP_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uSrc;
uniform sampler2D uAdd;
uniform vec2 uTexel;
uniform float uWeight;

void main() {
  vec2 d = uTexel * 1.5;
  vec3 sum = vec3(0.0);
  sum += texture(uSrc, vUv + vec2(-d.x, 0.0)).rgb;
  sum += texture(uSrc, vUv + vec2( d.x, 0.0)).rgb;
  sum += texture(uSrc, vUv + vec2(0.0, -d.y)).rgb;
  sum += texture(uSrc, vUv + vec2(0.0,  d.y)).rgb;
  sum *= 2.0;
  sum += texture(uSrc, vUv + vec2(-d.x, -d.y)).rgb;
  sum += texture(uSrc, vUv + vec2( d.x, -d.y)).rgb;
  sum += texture(uSrc, vUv + vec2(-d.x,  d.y)).rgb;
  sum += texture(uSrc, vUv + vec2( d.x,  d.y)).rgb;
  sum /= 12.0;

  vec3 prev = texture(uAdd, vUv).rgb;
  fragColor = vec4(prev + sum * uWeight, 1.0);
}
`;

// Final Cinematic Grading Pass: Subtle Radial Chromatic Dispersion + Spectral Bloom + ACES + Micro-Grain
export const COMPOSITE_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uExposure;
uniform float uTime;

${COMMON_GLSL}

void main() {
  vec2 centered = vUv - 0.5;
  float r2 = dot(centered, centered);

  // Subtle museum-lens radial chromatic aberration only at outer periphery
  vec2 caOff = centered * r2 * 0.0065;
  float cR = texture(uScene, vUv + caOff).r;
  float cG = texture(uScene, vUv).g;
  float cB = texture(uScene, vUv - caOff).b;
  vec3 col = vec3(cR, cG, cB);

  vec3 bloom = texture(uBloom, vUv).rgb;
  col += bloom * 0.26;

  // Exposure + ACES Narkowicz Filmic Tone Mapping
  col *= uExposure;
  col = acesToneMap(col);

  // Subtle sculptural cinema vignette (keeps center luminous & corners grounded)
  col *= 1.0 - 0.38 * r2;

  // Linear -> sRGB gamma
  col = pow(max(col, vec3(0.0)), vec3(1.0 / 2.2));

  // Whisper-thin film dithering to eliminate 8-bit dark gradient banding
  float dither = (ign(gl_FragCoord.xy + fract(uTime) * 31.0) - 0.5) / 255.0;
  col += dither;

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
