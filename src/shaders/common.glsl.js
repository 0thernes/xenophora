export const FULLSCREEN_VS = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  // Single overshooting fullscreen triangle (zero vertex buffer needed)
  vec2 p = vec2((gl_VertexID & 1) << 2, (gl_VertexID & 2) << 1) - 1.0;
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

export const COMMON_GLSL = `
#define PI 3.14159265359
#define TAU 6.28318530718
#define PHI 1.61803398875

// --- Quasirandom R2 sequence & Interleaved Gradient Noise ---
float ign(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

vec2 r2Seq(float n) {
  // Generalized golden ratio 2D low-discrepancy sequence
  return fract(vec2(0.7548776662466927, 0.5698402909980532) * n + 0.5);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

// Smooth 3D value noise
float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i + vec3(0,0,0)), hash13(i + vec3(1,0,0)), f.x),
        mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x),
        mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

// --- Rotation & Smooth CSG ---
mat2 rot2(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / max(k, 1e-5), 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float smax(float a, float b, float k) {
  return -smin(-a, -b, k);
}

// --- 4D Stereographic / Clifford Hyperspace Projection ---
// Lifts R^3 onto S^3 via inverse stereographic projection, rotates in 4D
// (zw & xw planes), and smoothly projects back with bounded Jacobian scaling.
vec4 liftTo4D(vec3 p, float thZW, float thXW) {
  float r2 = dot(p, p);
  float denom = r2 + 2.6;
  vec4 q = vec4(2.0 * p, r2 - 2.6) / denom;
  // Clifford rotation in ZW plane
  float cz = cos(thZW), sz = sin(thZW);
  vec2 zw = mat2(cz, -sz, sz, cz) * q.zw;
  q.z = zw.x; q.w = zw.y;
  // Clifford rotation in XW plane
  float cx = cos(thXW), sx = sin(thXW);
  vec2 xw = mat2(cx, -sx, sx, cx) * vec2(q.x, q.w);
  q.x = xw.x; q.w = xw.y;
  // Project back softly (clamped pole avoidance so DE stays Lipschitz-well-behaved)
  float inv = 1.0 / (1.0 - clamp(q.w, -0.72, 0.72) * 0.52);
  return vec4(q.xyz * inv * 1.42, inv);
}

// --- Exact Icosahedral Kaleidoscopic Symmetry Fold ---
vec3 foldIcosa(vec3 p) {
  // Golden-ratio icosahedral reflection planes
  vec3 n1 = normalize(vec3(-PHI, PHI - 1.0, 1.0));
  vec3 n2 = normalize(vec3(1.0, -PHI, PHI - 1.0));
  vec3 n3 = normalize(vec3(0.0, 0.0, -1.0));
  for (int i = 0; i < 4; i++) {
    p.xy = abs(p.xy);
    float d1 = dot(p, n1); if (d1 < 0.0) p -= 2.0 * d1 * n1;
    float d2 = dot(p, n2); if (d2 < 0.0) p -= 2.0 * d2 * n2;
    float d3 = dot(p, n3); if (d3 < 0.0) p -= 2.0 * d3 * n3;
  }
  return p;
}

// --- Gyroid Minimal Surface Helper ---
float gyroid(vec3 p) {
  return dot(sin(p), cos(p.yzx));
}

// --- Spectral Wavelength -> Linear RGB (Bruton-smooth analytical CIE fit) ---
vec3 spectralLambdaToRGB(float lambdaNm) {
  // Smooth physical spectral sensitivity approximation across 380..720 nm
  vec3 x = (vec3(lambdaNm) - vec3(595.0, 532.0, 455.0)) / vec3(58.0, 46.0, 42.0);
  vec3 rgb = exp(-0.5 * x * x);
  // Add violet secondary red lobe near 425 nm
  float v = (lambdaNm - 425.0) / 34.0;
  rgb.r += 0.38 * exp(-0.5 * v * v);
  return rgb;
}

// --- Physical Airy / Fabry-Perot Thin-Film Interference ---
// Evaluates exact optical path difference across 5 spectral bands
// OPD = 2 * n_film * d_nm * cos(theta_t) + lambda/2 (phase reversal)
vec3 thinFilmSpectral(float cosTheta, float thicknessNm, float iorFilm) {
  float sinT2 = max(0.0, 1.0 - cosTheta * cosTheta) / (iorFilm * iorFilm);
  float cosT = sqrt(max(0.001, 1.0 - sinT2));
  float opd = 2.0 * iorFilm * thicknessNm * cosT;

  // 5-band spectral reflectance integration
  const float lambdas[5] = float[5](440.0, 495.0, 545.0, 600.0, 655.0);
  vec3 sum = vec3(0.0);
  vec3 normW = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    float lam = lambdas[i];
    float phase = TAU * opd / lam + PI;
    // Airy thin-film reflectance factor (R_film ~ 0.16)
    float r = 0.5 - 0.5 * cos(phase);
    // Slight damping for very thick films (coherence length)
    float coh = exp(-0.00018 * abs(opd - 600.0));
    float refl = mix(0.5, r, coh);
    vec3 w = spectralLambdaToRGB(lam);
    sum += w * refl;
    normW += w;
  }
  return clamp(sum / max(normW, vec3(1e-4)), 0.0, 1.35);
}

// --- Stochastic Micro-Facet Prismatic Diffraction Grating Sparkle (Img #15!) ---
// Creates ultra-crisp spectral rainbow crystal glints across dark obsidian/crystal faces
vec3 diffractionSparkle(vec3 p, vec3 n, vec3 v, vec3 lDir, float density, float seedOffset) {
  // Multi-scale crystal facet lattice in local 3D world space
  vec3 q = p * density;
  vec3 cell = floor(q);
  vec3 f = fract(q) - 0.5;
  vec3 rnd = hash33(cell + seedOffset);

  // Random micro-facet normal tilted slightly around macro normal
  vec3 microOff = normalize(rnd * 2.0 - 1.0);
  vec3 microN = normalize(n + microOff * 0.42);
  vec3 h = normalize(lDir + v);

  // Sharp specular alignment with micro-facet (razor-crisp jewel glints without washing dark obsidian)
  float ndh = max(0.0, dot(microN, h));
  float glint = pow(ndh, 240.0) * smoothstep(0.42, 0.10, length(f));

  // Second finer octave for twinkling micro-dust glints
  vec3 q2 = p * (density * 2.35) + 17.3;
  vec3 cell2 = floor(q2);
  vec3 rnd2 = hash33(cell2 + seedOffset * 1.7);
  vec3 microN2 = normalize(n + normalize(rnd2 * 2.0 - 1.0) * 0.52);
  float glint2 = pow(max(0.0, dot(microN2, h)), 310.0) * smoothstep(0.42, 0.12, length(fract(q2) - 0.5));

  // Diffraction grating dispersion wavelength: m*lambda = d * (sin(theta_i) + sin(theta_o))
  float gratingPhase = fract(rnd.x + dot(n, v) * 1.4 + dot(microOff, h) * 2.2);
  float lambda = mix(415.0, 665.0, gratingPhase);
  vec3 specCol = spectralLambdaToRGB(lambda) * 2.4 + vec3(0.28);

  float gratingPhase2 = fract(rnd2.y + dot(n, lDir) * 1.8);
  vec3 specCol2 = spectralLambdaToRGB(mix(420.0, 670.0, gratingPhase2)) * 2.5 + vec3(0.28);

  return specCol * glint * 3.8 + specCol2 * glint2 * 3.1;
}

// --- Cellular Automaton / Spectral Data-Strata Pattern (Img #11 & #12) ---
float spectralStrata(vec2 uv, float time) {
  vec2 g = floor(uv * vec2(110.0, 42.0));
  float rowHash = hash12(vec2(g.y, floor(time * 0.35)));
  float runLen = mix(2.0, 14.0, rowHash);
  float seg = floor(g.x / runLen);
  float bit = step(0.46 + 0.25 * sin(g.y * 0.23 + time * 0.4), hash12(vec2(seg, g.y * 1.37)));
  float fine = step(0.62, hash12(g + vec2(0.0, floor(time * 1.5))));
  return mix(bit, fine, 0.35);
}

// --- GGX Microfacet Specular BRDF ---
float D_GGX(float ndh, float rough) {
  float a = rough * rough;
  float a2 = a * a;
  float d = (ndh * ndh) * (a2 - 1.0) + 1.0;
  return a2 / max(PI * d * d, 1e-5);
}

vec3 F_Schlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

float G_Smith(float ndv, float ndl, float rough) {
  float k = (rough + 1.0);
  k = (k * k) * 0.125;
  float gv = ndv / (ndv * (1.0 - k) + k);
  float gl = ndl / (ndl * (1.0 - k) + k);
  return gv * gl;
}

// --- ACES Narkowicz Filmic Tone Mapping ---
vec3 acesToneMap(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
`;
