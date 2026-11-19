import { COMMON_GLSL } from './common.glsl.js';
import { REGIMES_GLSL } from './regimes.glsl.js';

const SHARED_UNIFORMS = `
uniform vec2 uResolution;
uniform vec3 uCamPos;
uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform vec3 uCamFwd;
uniform float uFovTan;
uniform float uFocusDist;
uniform float uAperture;

uniform float uTime;
uniform float uFrame;
uniform float uJitterScale;
uniform int uMaxSteps;
uniform int uBounceSteps;

uniform float uRot4D;
uniform float uRot4D2;
uniform float uFoldGain;
uniform float uMorph;
uniform float uSlice;
uniform float uRelief;
uniform float uGlow;

uniform float uFilmNm;
uniform float uIrid;
uniform float uSparkle;
uniform float uVol;

uniform vec3 uKeyDir;
uniform vec3 uKeyCol;
uniform vec3 uFillDir;
uniform vec3 uFillCol;
uniform vec3 uCoreCol;
uniform vec3 uAccentCol;
uniform vec3 uBgTop;
uniform vec3 uBgBot;

uniform sampler2D uPdeTex;
`;

export function buildRaymarchFS(regimeId) {
  return `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

#define REGIME_ID ${regimeId}

${SHARED_UNIFORMS}
${COMMON_GLSL}
${REGIMES_GLSL}

// --- Zero-Inline 4-Tap Tetrahedron Normal (Inigo Quilez ZERO loop barrier!) ---
vec3 calcNormal(vec3 p, float eps, bool detailed) {
  vec3 n = vec3(0.0);
  int zero = int(min(uFrame, 0.0));
  for (int i = zero; i < 4; i++) {
    vec3 e = 0.57735027 * (2.0 * vec3((((i + 3) >> 1) & 1), ((i >> 1) & 1), (i & 1)) - 1.0);
    n += e * mapScene(p + e * eps, detailed).d;
  }
  return normalize(n);
}

// --- 4-Tap Exponential Ambient Occlusion (Deep Velvet Crevices!) ---
float calcAO(vec3 p, vec3 n, float jitter) {
  float occ = 0.0;
  float sca = 1.0;
  int zero = int(min(uFrame, 0.0));
  for (int i = zero; i < 4; i++) {
    float h = 0.018 + 0.08 * pow(float(i) + 0.32 + jitter * 0.35, 1.55) * 0.48;
    float d = mapScene(p + n * h, false).d;
    occ += clamp((h - d) / max(h, 1e-4), 0.0, 1.0) * sca;
    sca *= 0.62;
  }
  return pow(clamp(1.0 - 0.92 * occ, 0.02, 1.0), 1.35);
}

// --- Soft Penumbra Raymarched Shadow ---
float calcShadow(vec3 ro, vec3 rd, float maxT, float kSoft, float jitter) {
  float res = 1.0;
  float t = 0.028 + jitter * 0.014;
  int zero = int(min(uFrame, 0.0));
  for (int i = zero; i < 14; i++) {
    float h = mapScene(ro + rd * t, false).d;
    if (h < 0.0008) return 0.0;
    res = min(res, kSoft * h / t);
    t += clamp(h * 0.85, 0.02, 0.28);
    if (t > maxT) break;
  }
  return clamp(res, 0.0, 1.0);
}

// --- Deep Abyssal / Studio Chiaroscuro Environment ---
vec3 evalEnvironment(vec3 rd) {
  float y = clamp(rd.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(uBgBot, uBgTop, smoothstep(0.0, 1.0, y));

  // Tight sculptural specular environment accents (keeps sky velvet obsidian!)
  float kLobe = pow(max(0.0, dot(rd, normalize(uKeyDir))), 24.0);
  float fLobe = pow(max(0.0, dot(rd, normalize(uFillDir))), 20.0);
  col += uKeyCol * kLobe * 0.14 + uFillCol * fLobe * 0.11;

#if REGIME_ID == 1 || REGIME_ID == 2 || REGIME_ID == 5
  vec3 sp = rd * 165.0;
  vec3 sc = floor(sp);
  vec3 sf = fract(sp) - 0.5;
  float sh = hash13(sc);
  if (sh > 0.992) {
    float pt = smoothstep(0.22, 0.04, length(sf));
    float bri = pow((sh - 0.992) / 0.008, 2.2) * pt;
    vec3 starTint = mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.82, 0.65), hash13(sc + 7.1));
    col += starTint * bri * 1.45;
  }
#endif

#if REGIME_ID == 3
  // Soft moody studio bokeh backdrop glows (Img #9)
  float b1 = pow(max(0.0, dot(rd, normalize(vec3(-0.65, 0.35, -0.68)))), 18.0);
  float b2 = pow(max(0.0, dot(rd, normalize(vec3(0.68, -0.18, -0.68)))), 16.0);
  col += uKeyCol * b1 * 0.18 + uFillCol * b2 * 0.16;
#endif

  return col;
}

// --- Lightweight Secondary Bounce Shading ---
vec3 shadeSecondary(vec3 p, vec3 n, vec3 v, HitInfo h) {
  vec4 pde = samplePDE(h.trapUV);
  float ndv = max(0.02, dot(n, v));
  vec3 irid = thinFilmSpectral(ndv, uFilmNm + h.trapA * 210.0 + pde.b * 180.0, 1.56);

  if (h.mat > 1.5 && h.mat < 2.5) {
    return mix(uCoreCol, uAccentCol, 0.2) * (1.2 + h.emissive * 0.95);
  }

  vec3 l1 = normalize(uKeyDir);
  vec3 l2 = normalize(uFillDir);
  float diff1 = max(0.0, dot(n, l1));
  float diff2 = max(0.0, dot(n, l2));
  vec3 h1 = normalize(l1 + v);
  float spec = pow(max(0.0, dot(n, h1)), 48.0);

  vec3 base = vec3(0.02, 0.024, 0.036);
  if (h.mat > 0.5 && h.mat < 1.5) {
    base = mix(vec3(0.45, 0.52, 0.62), uCoreCol * 0.7, fract(h.trapA * 1.7));
  } else if (h.mat > 3.5) {
    base = mix(vec3(0.04, 0.025, 0.08), irid * 0.72, 0.82);
  } else {
    base = mix(vec3(0.02, 0.024, 0.036), irid * 0.35, 0.45 * uIrid);
  }

  vec3 col = base * (uKeyCol * diff1 * 1.15 + uFillCol * diff2 * 0.8 + vec3(0.015));
  col += (irid * 0.65 + vec3(0.25)) * uKeyCol * spec * 0.9;
  col += mix(uAccentCol, uFillCol, pde.b) * h.emissive * 0.75;
  return col;
}

// --- Fast Secondary Raymarch (Reflection or Refraction Bounce) ---
vec3 traceBounce(vec3 ro, vec3 rd, float maxT) {
  if (uBounceSteps <= 0) return evalEnvironment(rd);
  float t = 0.024;
  vec3 volAcc = vec3(0.0);
  int zero = int(min(uFrame, 0.0));
  for (int i = zero; i < 26; i++) {
    if (i >= uBounceSteps) break;
    vec3 p = ro + rd * t;
    HitInfo h = mapScene(p, false);
    if (h.d < max(0.0018, 0.003 * t)) {
      vec3 n = calcNormal(p, max(0.0025, 0.003 * t), false);
      return shadeSecondary(p, n, -rd, h) + volAcc;
    }
    float st = max(h.d * 0.82, 0.016);
    if ((i & 3) == 0) {
      volAcc += sampleVolumeField(p, rd) * st * 0.25;
    }
    t += st;
    if (t > maxT) break;
  }
  return evalEnvironment(rd) + volAcc;
}

// --- Full Physically-Based Spectral Surface Shader ---
vec3 shadePrimary(vec3 p, vec3 n, vec3 v, HitInfo h, float hitT, float jNoise, vec2 r2) {
  vec4 pde = samplePDE(h.trapUV);
  float pdePhase = atan(pde.g, pde.r);
  float pdeRib = pde.b;
  float pdeVort = pde.a;

  // --- Emissive Singularity / Hopf Iris / Plasma Portal Material ---
  if (h.mat > 1.5 && h.mat < 2.5) {
    float rim = pow(1.0 - max(0.0, dot(n, v)), 1.8);
    vec3 col = mix(uCoreCol, uFillCol, h.trapA * 0.55);
    col = mix(col, vec3(1.0, 0.98, 0.96), 0.35 + 0.35 * rim);
    return col * (0.95 + h.emissive * 0.85);
  }

  // Analytical Curvature proxy
  float cEps = max(0.022, 0.008 * hitT);
  float dPlus = mapScene(p + n * cEps, false).d;
  float dMinus = mapScene(p - n * cEps, false).d;
  float curv = clamp((dPlus + dMinus - 2.0 * h.d) / cEps, -1.2, 1.2);
  float ridge = smoothstep(0.03, 0.58, curv);
  float crevice = smoothstep(-0.02, -0.52, curv);

  float ao = calcAO(p, n, jNoise);
  vec3 l1 = normalize(uKeyDir);
  vec3 l2 = normalize(uFillDir);
  vec3 l1Jit = normalize(l1 + (vec3(r2.x, r2.y, jNoise) - 0.5) * 0.038 * uJitterScale);
  float sh1 = calcShadow(p + n * 0.01, l1Jit, 3.8, 10.0, jNoise);

  float ndv = max(0.015, dot(n, v));
  float ndl1 = max(0.0, dot(n, l1));
  float ndl2 = max(0.0, dot(n, l2));
  vec3 h1 = normalize(l1 + v);
  vec3 h2 = normalize(l2 + v);
  float ndh1 = max(0.0, dot(n, h1));
  float ndh2 = max(0.0, dot(n, h2));

  // Physical Airy / Fabry-Perot Thin-Film Interference driven by curvature + PDE phase!
  float filmD = uFilmNm + h.trapA * 220.0 + pdeRib * 210.0 + ridge * 90.0 + sin(pdePhase) * 60.0;
  vec3 thinFilm = thinFilmSpectral(ndv, filmD, 1.56);

  vec3 albedo = vec3(0.032, 0.036, 0.048);
  float rough = 0.24;
  float metallic = 0.75;
  float sssWeight = 0.20;
  float sparkleMult = 1.0;
  vec3 emissiveCol = vec3(0.0);

  if (h.mat > 0.5 && h.mat < 1.5) {
    // MATERIAL 1: GLOSSY ACOUSTIC PEARLS / SATIN CERAMIC ORBS / DARK PUPIL
    rough = 0.12;
    metallic = 0.30;
    sssWeight = 0.45;
    sparkleMult = 0.15;
#if REGIME_ID == 3
    // Rich macro porcelain pearl palette (coral, cerulean, warm ochre, pearl — Img #9 & #13)
    float pk = fract(h.trapA * 1.9);
    if (pk < 0.28) albedo = vec3(0.84, 0.28, 0.42);
    else if (pk < 0.56) albedo = vec3(0.24, 0.58, 0.78);
    else if (pk < 0.80) albedo = vec3(0.88, 0.66, 0.34);
    else albedo = vec3(0.76, 0.80, 0.86);
    rough = 0.14;
    metallic = 0.14;
#elif REGIME_ID == 4
    // Dark obsidian-steel geodesic spiderweb & crimson inner reflection
    albedo = vec3(0.025, 0.02, 0.028);
    metallic = 0.92;
    rough = 0.10;
    emissiveCol += uCoreCol * h.emissive * 0.95;
#else
    if (h.trapA > 0.95) {
      // Pitch-black obsidian iris pupil (Img #1!)
      albedo = vec3(0.008, 0.010, 0.016);
      metallic = 0.85;
      rough = 0.06;
    } else {
      albedo = mix(vec3(0.42, 0.46, 0.52), vec3(0.06, 0.08, 0.12), smoothstep(0.2, 0.8, h.trapA));
      albedo = mix(albedo, thinFilm * 0.55, 0.28 * uIrid);
      if (h.trapB > 0.75) {
        emissiveCol += uAccentCol * 0.45 * uGlow;
      }
    }
#endif
  } else if (h.mat > 2.5 && h.mat < 3.5) {
    // MATERIAL 3: REGIME-BESPOKE ABYSSAL STAGE / HORIZON!
    rough = 0.09;
    metallic = 0.85;
    sssWeight = 0.0;
    albedo = vec3(0.012, 0.014, 0.020);
#if REGIME_ID == 0 || REGIME_ID == 5
    // Subtle dark crystalline glass plinth with recessed faint luminous lattice (Img #10)
    sparkleMult = 0.55;
    vec2 g = abs(fract(p.xz * 2.2) - 0.5);
    float gridLine = smoothstep(0.032, 0.008, min(g.x, g.y));
    float fade = exp(-length(p.xz) * 0.58);
    emissiveCol += mix(uFillCol, uAccentCol, pdeRib) * gridLine * 0.26 * fade * uGlow;
#elif REGIME_ID == 1
    // Dark alien basalt plain fading into cosmic night (Img #15 — NO neon grid!)
    sparkleMult = 0.42;
    rough = 0.34;
    metallic = 0.45;
    albedo = vec3(0.018, 0.020, 0.028) * (0.7 + 0.5 * clamp(h.trapB, 0.0, 1.0));
#elif REGIME_ID == 4
    // Pure wet black obsidian mirror abyss reflecting the Seraph & crimson singularity cleanly (Img #4!)
    sparkleMult = 0.08;
    rough = 0.045;
    metallic = 0.96;
    albedo = vec3(0.003, 0.002, 0.004);
#endif
  } else if (h.mat > 3.5) {
    // MATERIAL 4: JEWEL-REFRACTIVE SOAP-FILM MINIMAL SURFACE (Img #3!)
    rough = 0.04;
    metallic = 0.20;
    sssWeight = 0.72;
    sparkleMult = 0.65;
    // Vivid iridescent oil-slick glass webbing (amber, orchid, sapphire, electric cyan) over dark voids!
    vec3 jewelIrid = pow(clamp(thinFilm, 0.0, 1.2), vec3(1.25)) * 1.45;
    albedo = mix(vec3(0.025, 0.015, 0.045), jewelIrid * 0.72, 0.86 * clamp(uIrid, 0.0, 1.3));
    emissiveCol += mix(uCoreCol, uKeyCol, pdeRib) * h.emissive * 0.75;
  } else {
    // MATERIAL 0: PRIMARY 4D SCULPTURAL MANIFOLD
#if REGIME_ID == 0
    // Deep volcanic bronze-obsidian carapace with warm ridges & subtle cyan/magenta capillaries (Img #1 & #10)
    albedo = mix(vec3(0.022, 0.026, 0.034), vec3(0.16, 0.14, 0.13), ridge * 0.75);
    albedo = mix(albedo, thinFilm * 0.38, 0.38 * uIrid * (0.3 + 0.7 * ridge));
    rough = mix(0.34, 0.12, ridge);
    metallic = 0.78;
    sssWeight = 0.25;
    vec3 veinCol = mix(uFillCol, uAccentCol, smoothstep(0.25, 0.78, pdeRib));
    emissiveCol += veinCol * (h.emissive * 0.85 + crevice * smoothstep(0.62, 0.96, pdeVort) * uGlow * 0.75);
#elif REGIME_ID == 1
    // Dark smoked titanium-obsidian Menger cathedral cliff + jewel diffraction sparkle (Img #14 & #15!)
    albedo = mix(vec3(0.016, 0.018, 0.026), vec3(0.14, 0.16, 0.22), ridge * 0.85);
    albedo = mix(albedo, thinFilm * 0.42, 0.45 * uIrid);
    rough = mix(0.28, 0.08, ridge);
    metallic = 0.90;
    sssWeight = 0.06;
    sparkleMult = 1.95; // Signature prismatic crystal cliff fire (Img #15!)
    vec3 calCol = mix(uKeyCol, uAccentCol, smoothstep(0.28, 0.78, h.trapB));
    emissiveCol += calCol * h.emissive * 0.78;
#elif REGIME_ID == 3
    // Tactile ribbed porcelain-coral ceramic sculpture with studio color-banding (Img #9!)
    float band = fract(h.trapA * 1.25 + h.trapB * 0.35 + pdeRib * 0.28);
    vec3 cCream  = vec3(0.74, 0.76, 0.80);
    vec3 cCoral  = vec3(0.84, 0.36, 0.32);
    vec3 cTeal   = vec3(0.16, 0.52, 0.68);
    vec3 cIndigo = vec3(0.20, 0.24, 0.48);
    albedo = mix(cCream, cTeal, smoothstep(0.16, 0.44, band));
    albedo = mix(albedo, cCoral, smoothstep(0.48, 0.74, band) * 0.78);
    albedo = mix(albedo, cIndigo, smoothstep(0.76, 0.95, band) * 0.68);
    // Deep sculpted contrast between dark ribbed valleys and ivory crests!
    albedo *= mix(0.26, 1.15, ridge * 0.75 + 0.25);
    albedo = mix(albedo, thinFilm * 0.75, 0.18 * uIrid);
    rough = mix(0.38, 0.16, ridge);
    metallic = 0.14;
    sssWeight = 0.72;
    sparkleMult = 0.25;
    emissiveCol += mix(uCoreCol, uAccentCol, pdeRib) * h.emissive * 0.45;
#elif REGIME_ID == 4
    // Dark Beksiński obsidian-mercury monolith + pale bone-ivory crown + molten antique-gold veins (Img #4 & #7!)
    float heightBone = smoothstep(0.25, 1.05, p.y);
    albedo = mix(vec3(0.018, 0.020, 0.026), vec3(0.34, 0.31, 0.27), heightBone * (0.25 + 0.75 * ridge));
    float goldVein = smoothstep(0.48, 0.88, h.trapB) * (0.35 + 0.65 * crevice);
    albedo = mix(albedo, uAccentCol * 0.65, goldVein * 0.55);
    albedo = mix(albedo, thinFilm * 0.32, 0.22 * uIrid);
    rough = mix(0.24, 0.075, ridge);
    metallic = mix(0.88, 0.52, heightBone * 0.55);
    sssWeight = 0.12;
    emissiveCol += mix(vec3(0.92, 0.90, 0.88), uCoreCol, smoothstep(0.1, -0.75, p.y)) * h.emissive * 0.75;
#else
    albedo = mix(vec3(0.020, 0.024, 0.038), thinFilm * 0.52, 0.58 * uIrid);
    rough = mix(0.24, 0.08, ridge);
    metallic = 0.82;
    sssWeight = 0.42;
    sparkleMult = 1.45;
    emissiveCol += mix(uAccentCol, uCoreCol, pdeRib) * h.emissive * 0.72;
#endif
  }

  // --- GGX Microfacet PBR Lighting ---
  vec3 F0 = mix(vec3(0.04), albedo, metallic);
  F0 = mix(F0, clamp(thinFilm * 0.78 + 0.12, 0.04, 0.96), clamp(uIrid * 0.55, 0.0, 0.82));

  vec3 F1 = F_Schlick(max(0.0, dot(h1, v)), F0);
  float D1 = D_GGX(ndh1, max(rough, 0.05));
  float G1 = G_Smith(ndv, ndl1, max(rough, 0.05));
  vec3 spec1 = (D1 * G1 * F1) / max(4.0 * ndv * ndl1 + 0.001, 0.001);

  vec3 F2 = F_Schlick(max(0.0, dot(h2, v)), F0);
  float D2 = D_GGX(ndh2, max(rough, 0.06));
  float G2 = G_Smith(ndv, ndl2, max(rough, 0.06));
  vec3 spec2 = (D2 * G2 * F2) / max(4.0 * ndv * ndl2 + 0.001, 0.001);

  float ccD = D_GGX(ndh1, 0.075);
  float ccF = 0.04 + 0.96 * pow(1.0 - ndv, 5.0);
  vec3 clearcoat = vec3(ccD * ccF * 0.18) * mix(vec3(1.0), thinFilm, 0.45 * uIrid);

  vec3 kD1 = (1.0 - F1) * (1.0 - metallic);
  vec3 kD2 = (1.0 - F2) * (1.0 - metallic);

  vec3 Lo = (kD1 * albedo / PI + spec1 + clearcoat) * uKeyCol * ndl1 * (0.12 + 0.88 * sh1) * 2.35;
  Lo += (kD2 * albedo / PI + spec2) * uFillCol * ndl2 * 1.35;

  // Subsurface Back-Scattering
  if (sssWeight > 0.01) {
    float thick1 = clamp(mapScene(p + l1 * 0.14, false).d / 0.14, 0.0, 1.0);
    float backL = pow(clamp(dot(v, -l1), 0.0, 1.0), 2.5);
    vec3 sssCol = mix(albedo, thinFilm, 0.4 * uIrid);
    Lo += sssCol * (uKeyCol * (0.30 + 0.85 * backL) * thick1 + uFillCol * 0.25) * sssWeight * 0.65;
  }

  // Core Cavity Point Light
#if REGIME_ID == 0 || REGIME_ID == 5
  vec3 toCore = vec3(0.0, 0.08, 0.16) - p;
  float coreD2 = max(dot(toCore, toCore), 0.05);
  float coreNdl = max(0.0, dot(n, normalize(toCore)));
  Lo += (albedo * 0.45 + thinFilm * 0.28) * uCoreCol * (coreNdl / (0.32 + coreD2 * 2.1)) * 1.15 * ao;
#elif REGIME_ID == 4
  vec3 toSing = vec3(0.0, -0.58, 0.14) - p;
  float singD2 = max(dot(toSing, toSing), 0.04);
  float singNdl = max(0.0, dot(n, normalize(toSing)));
  Lo += (albedo * 0.55 + F0 * 0.55) * uCoreCol * (singNdl / (0.24 + singD2 * 1.65)) * 1.85 * ao;
#endif

  // Deep Chiaroscuro Ambient Indirect + Sculptural Rim Iridescence
  float fresnel = pow(1.0 - ndv, 3.8);
  vec3 envUp = mix(uBgBot, uBgTop, n.y * 0.5 + 0.5) * 1.8 + vec3(0.008, 0.010, 0.015);
  Lo += albedo * envUp * ao * 1.1;
  Lo += thinFilm * mix(uFillCol, uKeyCol, 0.5) * fresnel * (0.24 + 0.36 * uIrid) * ao;

  // Stochastic Prismatic Diffraction Grating Micro-Sparkles (Img #15)
  if (uSparkle * sparkleMult > 0.01) {
    vec3 glint1 = diffractionSparkle(p, n, v, l1, 48.0, 1.3);
    vec3 glint2 = diffractionSparkle(p, n, v, l2, 62.0, 9.7);
    Lo += (glint1 * (0.22 + 0.78 * sh1) + glint2 * 0.55) * uSparkle * sparkleMult * (0.25 + 0.75 * ao);
  }

  // Secondary Reflection / Chromatic Dispersion Refraction Bounce
  vec3 Fview = F_Schlick(ndv, F0);
  if (h.mat > 3.5) {
    // Jewel-toned chromatic-dispersion soap-film glass (Img #3!)
    vec3 refrG = refract(-v, n, 1.0 / 1.43);
    vec3 refrR = refract(-v, n, 1.0 / 1.33);
    vec3 refrB = refract(-v, n, 1.0 / 1.56);
    vec3 innerCol = traceBounce(p - n * 0.032, refrG, 3.6);
    vec3 dispTint = vec3(
      thinFilmSpectral(ndv, filmD + 95.0, 1.48).r,
      thinFilm.g,
      thinFilmSpectral(ndv, filmD - 95.0, 1.62).b
    );
    vec3 envDisp = vec3(evalEnvironment(refrR).r, evalEnvironment(refrG).g, evalEnvironment(refrB).b);
    vec3 refrCol = innerCol * (0.35 + 0.85 * dispTint) + envDisp * 0.45;

    vec3 reflDir = reflect(-v, n);
    vec3 reflCol = evalEnvironment(reflDir) * 1.2 + sampleVolumeField(p + reflDir * 0.65, reflDir) * 0.95;
    float glassF = clamp(0.12 + 0.88 * pow(1.0 - ndv, 3.4), 0.0, 1.0);
    // Rich dark translucent depth with vivid iridescent rim edges!
    Lo = mix(refrCol * 0.78 + Lo * 0.45, reflCol * (0.45 + 0.75 * thinFilm) + Lo * 0.82, glassF);
  } else {
    float reflStrength = max(max(Fview.r, Fview.g), Fview.b) * (1.0 - rough * 0.82);
    if (reflStrength > 0.10) {
      vec3 reflDir = reflect(-v, n);
      vec3 jit = normalize(vec3(r2.x - 0.5, r2.y - 0.5, jNoise - 0.5));
      reflDir = normalize(reflDir + jit * rough * 0.22 * uJitterScale);
      vec3 bounce = traceBounce(p + n * 0.016, reflDir, 3.8);
      float w = reflStrength * ((h.mat > 2.5 && h.mat < 3.5) ? 0.95 : 0.62);
      Lo += bounce * mix(Fview, thinFilm * Fview, 0.42 * uIrid) * w * (0.22 + 0.78 * ao);
    }
  }

  // Ground shading with AO & add clean selective self-emission
  Lo = Lo * (0.28 + 0.72 * ao) + emissiveCol;
  return Lo;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 r2 = r2Seq(uFrame + 1.0);
  float jNoise = ign(fragCoord + r2 * 64.0);
  vec2 subPixel = (fract(r2 + vec2(jNoise, fract(jNoise * 1.618))) - 0.5) * uJitterScale;

  vec2 ndc = ((fragCoord + subPixel) / uResolution) * 2.0 - 1.0;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  vec3 rd = normalize(
    uCamFwd +
    uCamRight * (ndc.x * aspect * uFovTan) +
    uCamUp * (ndc.y * uFovTan)
  );
  vec3 ro = uCamPos;

  // Physical Thin-Lens Aperture Bokeh (DOF)
  if (uAperture > 0.0004 && uJitterScale > 0.01) {
    vec2 diskSeed = fract(r2Seq(uFrame * 1.7 + 19.0) + vec2(jNoise, hash12(fragCoord + uFrame)));
    float rad = sqrt(diskSeed.x) * uAperture;
    float ang = diskSeed.y * TAU;
    vec3 lensOff = (uCamRight * cos(ang) + uCamUp * sin(ang)) * rad;
    vec3 focusPoint = ro + rd * uFocusDist;
    ro += lensOff;
    rd = normalize(focusPoint - ro);
  }

  // Primary Raymarch + Integrated Volumetric Scattering
  float t = 0.02 + jNoise * 0.014;
  float maxT = 11.5;
  bool hit = false;
  HitInfo h;
  vec3 volAcc = vec3(0.0);
  float transmittance = 1.0;
  int zero = int(min(uFrame, 0.0));

  for (int i = zero; i < 88; i++) {
    if (i >= uMaxSteps) break;
    vec3 p = ro + rd * t;
    h = mapScene(p, true);
    float eps = max(0.0005, 0.0008 * t);
    if (h.d < eps) {
      hit = true;
      break;
    }

    float stepD = max(h.d * 0.74, eps * 1.35);
    if (t < 6.0 && uVol > 0.01 && (i & 1) == 0) {
      float volStep = min(stepD * 1.5, 0.28);
      vec3 vEmit = sampleVolumeField(p + rd * (volStep * jNoise * 0.5), rd);
      volAcc += vEmit * volStep * transmittance * 0.42;
      float density = clamp(dot(vEmit, vec3(0.25)) * 0.12, 0.0, 0.30);
      transmittance *= exp(-density * volStep);
    }

    t += stepD;
    if (t > maxT) break;
    if (t > 4.6 && dot(p, rd) > 0.0 && p.y > -0.95 && rd.y > -0.05) break;
  }

  vec3 col;
  if (hit) {
    vec3 p = ro + rd * t;
    float nEps = max(0.00065, 0.00095 * t);
    vec3 n = calcNormal(p, nEps, true);
    col = shadePrimary(p, n, -rd, h, t, jNoise, r2);

    float fog = 1.0 - exp(-max(0.0, t - 3.2) * 0.16);
    col = mix(col, evalEnvironment(rd), clamp(fog, 0.0, 0.85));
    col = col * transmittance + volAcc;
  } else {
    col = evalEnvironment(rd) * transmittance + volAcc;
  }

  col = min(col, vec3(24.0));
  if (any(isnan(col)) || any(isinf(col))) col = vec3(0.0);

  fragColor = vec4(col, hit ? t : 100.0);
}
`;
}

export function buildRaypickFS(regimeId) {
  return `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

#define REGIME_ID ${regimeId}

${SHARED_UNIFORMS}
uniform vec2 uPickNdc;

${COMMON_GLSL}
${REGIMES_GLSL}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec3 rd = normalize(
    uCamFwd +
    uCamRight * (uPickNdc.x * aspect * uFovTan) +
    uCamUp * (uPickNdc.y * uFovTan)
  );
  vec3 ro = uCamPos;

  float t = 0.02;
  int zero = int(min(uFrame, 0.0));
  for (int i = zero; i < 80; i++) {
    vec3 p = ro + rd * t;
    HitInfo h = mapScene(p, true);
    if (h.d < max(0.0007, 0.001 * t)) {
      fragColor = vec4(fract(h.trapUV), clamp(t / 12.0, 0.0, 1.0), 1.0);
      return;
    }
    t += max(h.d * 0.76, 0.0012);
    if (t > 12.0) break;
  }
  fragColor = vec4(0.5, 0.5, 0.25, 0.0);
}
`;
}
