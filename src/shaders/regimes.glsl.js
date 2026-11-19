// Bespoke Lipschitz-bounded 4D Non-Euclidean SDF & Volumetric Field Modules
// Sculpturally composed for museum-grade macro silhouettes, deep fractal cavities,
// micro-filigree, and zero GPU TDR risk!

export const REGIMES_GLSL = `
struct HitInfo {
  float d;
  float mat;      // 0: manifold, 1: glossy pearls, 2: core/emissive, 3: abyssal floor, 4: refractive glass-foam
  vec2 trapUV;    // Conformal intrinsic manifold coordinates for 256x256 GPU CGLE PDE lookup
  float trapA;    // Primary orbit-trap metric (ridges / scale / metallic tint)
  float trapB;    // Secondary orbit-trap metric (cavities / rib phase / veins)
  float emissive; // Direct geometric self-emission energy
};

HitInfo hitMin(HitInfo a, HitInfo b) {
  if (a.d < b.d) return a;
  return b;
}

HitInfo hitSmin(HitInfo a, HitInfo b, float k) {
  float h = clamp(0.5 + 0.5 * (b.d - a.d) / max(k, 1e-4), 0.0, 1.0);
  HitInfo r;
  r.d = mix(b.d, a.d, h) - k * h * (1.0 - h);
  r.mat = (h > 0.5) ? a.mat : b.mat;
  r.trapUV = mix(b.trapUV, a.trapUV, h);
  r.trapA = mix(b.trapA, a.trapA, h);
  r.trapB = mix(b.trapB, a.trapB, h);
  r.emissive = mix(b.emissive, a.emissive, h);
  return r;
}

vec4 samplePDE(vec2 uv) {
  return texture(uPdeTex, fract(uv));
}

// ============================================================================
// REGIME 0: ANEMONE ABYSS (Monumental Kleinian Cavern + Hopf Iris + Piezo Rings)
// Inspired by Images #1, #2, #10
// ============================================================================
#if REGIME_ID == 0
HitInfo mapAnemone(vec3 p, bool detailed) {
  HitInfo res;
  res.d = 1e5; res.mat = 0.0; res.trapUV = vec2(0.5); res.trapA = 0.0; res.trapB = 0.0; res.emissive = 0.0;

  float t = uTime * 0.22;

  // Monumental organic bio-cathedral reef cradling the Anemone Iris & Piezo Alcoves (Img #1 & #10)
  vec3 domeP = p - vec3(0.0, 0.04, -0.18);
  float gReef1 = gyroid(p * 2.25 + vec3(0.0, t * 0.12, 0.0));
  float gReef2 = gyroid(p * 5.4 + gReef1 * 1.15);
  float dDome = length(domeP * vec3(0.74, 0.86, 0.88)) - 1.44 - 0.16 * gReef1 - 0.055 * gReef2;

  if (dDome < 0.30) {
    vec4 p4 = liftTo4D(p * 0.65, uRot4D + 0.06 * sin(t), uRot4D2 + 0.05 * cos(t * 0.8));
    vec3 q = mix(p, p4.xyz, 0.20);
    float jac4 = mix(1.0, p4.w, 0.20);

    // Rich Apollonian / Pseudo-Kleinian porous sponge fused with voluminous coral-rock vaults!
    vec3 z = q * 1.05;
    vec3 cSize = vec3(1.02, 1.08, 0.98);
    float kleinR = 1.18 * uFoldGain;
    float scale = 1.0;
    float minR = 1e5;
    float orbitSum = 0.0;
    mat2 twist = rot2(0.18 + 0.20 * sin(uRot4D));

    for (int i = 0; i < 7; i++) {
      z = 2.0 * clamp(z, -cSize, cSize) - z;
      float r2 = dot(z, z);
      float k = max(kleinR / max(r2, 0.025), 1.0);
      z *= k;
      scale *= k;
      if (i == 2 || i == 5) z.xy = twist * z.xy;
      minR = min(minR, r2);
      orbitSum += abs(z.y) / (scale + 1.0);
    }

    float dKlein = (length(z) - 0.56) / scale;
    // Voluminous cavernous gyroidal reef mass so the cathedral has deep dark organic crags around the iris!
    float dReefVault = max(dDome, (abs(gReef1 + 0.32 * gReef2) - 0.42) * 0.22);
    float dShell = smin(smax(dKlein, dDome, 0.12), dReefVault, 0.16);

    // Sculpted ribbed housing rings framing both the main iris cavity AND the magenta side alcove (Img #10!)
    vec3 rimP = p - vec3(0.0, 0.08, 0.36);
    float dRim1 = length(vec2(length(rimP.xy) - 0.58, rimP.z)) - 0.15;
    vec3 rimP2 = p - vec3(0.56, -0.24, 0.44);
    rimP2.xz = rot2(-0.48) * rimP2.xz;
    float dRim2 = length(vec2(length(rimP2.xy) - 0.30, rimP2.z)) - 0.10;
    dShell = smin(dShell, min(dRim1, dRim2), 0.12);

    // Carve an unobstructed front-facing vaulted cavern tunnel so the Anemone Iris & Piezo Ring gaze straight out!
    vec3 cavP = p - vec3(0.0, 0.08, 0.34);
    float dCavity = length(vec3(cavP.xy, min(cavP.z, 0.0))) - 0.57;
    vec3 alcP = p - vec3(0.56, -0.24, 0.44);
    float dAlcove2 = length(vec3(alcP.xy, min(alcP.z, 0.0))) - 0.29;
    dShell = smax(dShell, -dCavity, 0.09);
    dShell = smax(dShell, -dAlcove2, 0.07);

    vec2 uv0 = fract(vec2(atan(z.y, z.x) / TAU + 0.5, log(max(length(z), 1e-3)) * 0.25 + orbitSum * 0.4));

    float pdeVort = 0.0;
    if (detailed && abs(dShell) < 0.06) {
      vec4 pde = samplePDE(uv0);
      float rib = sin(orbitSum * 26.0 + length(rimP.xy) * 28.0 + pde.b * 4.0);
      dShell -= ((pde.b - 0.5) * 0.010 + rib * 0.005) * uRelief;
      pdeVort = pde.a;
    }
    dShell /= max(jac4, 0.85);

    res.d = dShell;
    res.mat = 0.0;
    res.trapUV = uv0;
    res.trapA = clamp(sqrt(minR) * 0.78, 0.0, 1.5);
    res.trapB = clamp(orbitSum * 0.85, 0.0, 1.5);
    res.emissive = smoothstep(0.58, 0.96, pdeVort) * uGlow * 0.55;
  } else {
    res.d = dDome;
  }

  // --- 2. THE ANEMONE IRIS CORE (Img #1: Graceful Rounded Bioluminescent Petal Loops!) ---
  vec3 ic = p - vec3(0.0, 0.08, 0.16);
  float icR = length(ic);
  if (icR < 0.65) {
    ic.xy = rot2(t * 0.22 + uRot4D * 0.35) * ic.xy;
    float ir = length(ic.xy);
    float iAng = atan(ic.y, ic.x);

    // Deep pitch-black obsidian central pupil (Img #1!)
    float dPupil = icR - 0.078;
    res = hitMin(res, HitInfo(dPupil, 1.0, vec2(0.5), 0.98, 0.0, 0.0));

    // 22 gracefully rounded anemone petal loops (smooth organic contour, zero jagged tips!)
    float nPetals = 22.0;
    float sec = TAU / nPetals;
    float aFold = mod(iAng + sec * 0.5, sec) - sec * 0.5;
    float rNorm = clamp((ir - 0.075) / 0.37, 0.0, 1.0);
    float archZ = -0.10 * sin(rNorm * PI);
    // Smooth teardrop loop envelope curving roundly at outer tip
    float petalWidth = 0.044 * sqrt(max(0.0, sin(rNorm * PI))) * (0.35 + 0.65 * rNorm);
    float edgeDist = abs(abs(aFold * max(ir, 0.075)) - petalWidth);
    float dFil = length(vec2(edgeDist, ic.z - archZ)) - 0.0044;
    float dIrisBound = max(ir - 0.445, 0.078 - ir);
    dFil = max(dFil, dIrisBound) * 0.65;

    // Fine luminous inner radial filaments radiating from dark pupil
    float dSpoke = max(length(vec2(aFold * max(ir, 0.075), ic.z - archZ * 0.35)) - 0.0036, max(ir - 0.34, 0.078 - ir)) * 0.68;
    float dIris = min(dFil, dSpoke);

    float irisGlow = mix(1.45, 0.38, pow(rNorm, 0.85));
    res = hitMin(res, HitInfo(dIris, 2.0, vec2(iAng / TAU + 0.5, rNorm), rNorm, 1.0, irisGlow));
  } else {
    res.d = min(res.d, icR - 0.52);
  }

  // --- 3. EMBEDDED BEADED PIEZO-RESONATOR RINGS & FLOATING OBSIDIAN-PEARL ORBS (Img #1 & #10) ---
  vec3 bp = p - vec3(0.0, 0.08, 0.44);
  float br = length(bp.xy);
  float bang = atan(bp.y, bp.x);
  float bSec = TAU / 26.0;
  float ba = mod(bang + bSec * 0.5, bSec) - bSec * 0.5;
  float dBeads1 = length(vec3(br * cos(ba) - 0.58, br * sin(ba), bp.z)) - 0.044;

  // Secondary tilted piezo ring around magenta alcove
  vec3 bp2 = p - vec3(0.56, -0.24, 0.50);
  bp2.xz = rot2(-0.52) * bp2.xz;
  float br2 = length(bp2.xy);
  float bang2 = atan(bp2.y, bp2.x);
  float bSec2 = TAU / 18.0;
  float ba2 = mod(bang2 + bSec2 * 0.5, bSec2) - bSec2 * 0.5;
  float dBeads2 = length(vec3(br2 * cos(ba2) - 0.30, br2 * sin(ba2), bp2.z)) - 0.028;

  // Floating abyssal spheres at varied depths (Img #1)
  float dOrbs = 1e5;
  dOrbs = min(dOrbs, length(p - vec3(-0.88, 0.20 + 0.04 * sin(t * 1.4), 0.96)) - 0.13);
  dOrbs = min(dOrbs, length(p - vec3(1.04, -0.44 + 0.05 * cos(t * 1.1), 0.78)) - 0.115);
  dOrbs = min(dOrbs, length(p - vec3(1.24, 0.72 - 0.04 * sin(t * 0.9), 0.32)) - 0.095);
  dOrbs = min(dOrbs, length(p - vec3(-1.22, -0.58 + 0.03 * cos(t * 1.6), 0.45)) - 0.072);
  dOrbs = min(dOrbs, length(p - vec3(0.52, 0.98 + 0.04 * sin(t * 1.2), 0.18)) - 0.062);

  float dAllPearls = min(min(dBeads1, dBeads2), dOrbs);
  float isRim2 = (dBeads2 < min(dBeads1, dOrbs)) ? 1.0 : 0.25;
  res = hitMin(res, HitInfo(dAllPearls, 1.0, fract(p.xy * 0.6 + 0.5), clamp(length(p) * 0.45, 0.0, 1.0), isRim2, 0.0));

  // --- 4. DARK REFLECTIVE CRYSTALLINE PEDESTAL FLOOR (Img #10) ---
  float fr = length(p.xz);
  float dFloor = p.y + 1.26 - 0.02 * smoothstep(1.3, 0.7, fr) * sin(fr * 24.0);
  res = hitMin(res, HitInfo(dFloor, 3.0, fract(p.xz * 0.45 + 0.5), fr * 0.4, 0.0, 0.0));

  return res;
}
#endif

// ============================================================================
// REGIME 1: OPALESCENT KIFS (Monumental Menger-Labyrinth Cliff + Aurora Cascade)
// Inspired by Images #12, #14, #15
// ============================================================================
#if REGIME_ID == 1
HitInfo mapKifs(vec3 p, bool detailed) {
  HitInfo res;
  res.d = 1e5; res.mat = 0.0; res.trapUV = vec2(0.5); res.trapA = 0.0; res.trapB = 0.0; res.emissive = 0.0;

  // Dramatic diagonal stepped cliff promontory leaving deep star-filled chasm on right (Img #15!)
  float cliffWall = p.x - 0.24 + 0.22 * p.y + 0.24 * sin(p.y * 1.5 - 0.4);
  float dCliffMask = max(cliffWall, length(p - vec3(-0.52, 0.08, -0.05)) - 1.95);

  if (dCliffMask < 0.30) {
    vec3 q = p - vec3(-0.48, 0.06, 0.0);
    q.xz = rot2(0.32 + uRot4D * 0.12) * q.xz;

    // True Recursive Menger Sponge + Architectural KIFS Cantilevers!
    // Carves deep interlocking rectangular corridors, terraces, towers & balconies (Img #14 & #15)
    vec3 z = q * 0.78;
    float dMenger = length(max(abs(z) - vec3(1.18), 0.0));
    float s = 1.0;
    float trapMin = 1e5;
    float channelTrap = 0.0;
    vec3 trapVec = z;
    mat2 rotFold = rot2(uRot4D * 0.16);
    mat2 rotFold2 = rot2(uRot4D2 * 0.16);

    for (int i = 0; i < 6; i++) {
      // Scale into repeated Menger 3x3x3 architectural cells with slight 4D twist
      vec3 a = mod(z * s + 1.0, 2.0) - 1.0;
      s *= (2.82 + 0.32 * (uFoldGain - 1.0));
      vec3 r = abs(1.0 - 3.0 * abs(a));
      if (i == 1 || i == 3) r.xy = abs(rotFold * r.xy);
      if (i == 2 || i == 4) r.yz = abs(rotFold2 * r.yz);

      // Menger cross-corridor cutout (carves crisp stepped shafts & cantilevered cubes!)
      float da = max(r.x, r.y);
      float db = max(r.y, r.z);
      float dc = max(r.z, r.x);
      float c = (min(da, min(db, dc)) - 1.0) / s;

      if (c > dMenger) {
        dMenger = c;
        trapVec = a;
      }
      trapMin = min(trapMin, dot(a, a));
      channelTrap += exp(-abs(da - db) * 4.5) / float(i + 1);
    }

    // Divide by initial scaling (0.78) to preserve exact Euclidean DE
    float dMonolith = smax(dMenger / 0.78, dCliffMask, 0.025);

    vec2 uv1 = fract(vec2(trapVec.x + trapVec.z * 0.5, trapVec.y * 0.8) * 0.55 + p.xy * 0.2 + 0.5);

    float channelEmit = 0.0;
    if (detailed && abs(dMonolith) < 0.045) {
      vec4 pde = samplePDE(uv1);
      // Crisp recessed calligraphic microchip channels (Img #12 & #14)
      float groove = smoothstep(0.06, 0.012, abs(fract(channelTrap * 2.2) - 0.5));
      dMonolith += groove * 0.004 * uRelief;
      channelEmit = (groove * 0.45 + smoothstep(0.65, 0.96, pde.a) * 0.65) * uGlow;
    }

    res.d = dMonolith;
    res.mat = 0.0;
    res.trapUV = uv1;
    res.trapA = clamp(sqrt(trapMin) * 0.95, 0.0, 1.5);
    res.trapB = clamp(channelTrap * 0.75, 0.0, 1.5);
    res.emissive = channelEmit;
  } else {
    res.d = dCliffMask;
  }

  // --- 2. GLOWING PLASMA PORTAL RINGS ON LOWER TERRACES (Img #14) ---
  vec3 pp1 = p - vec3(-0.18, -0.82, 0.88);
  float dPortal1 = length(vec2(length(pp1.xz) - 0.20, pp1.y)) - 0.018;
  vec3 pp2 = p - vec3(0.28, -1.04, 0.42);
  float dPortal2 = length(vec2(length(pp2.xz) - 0.14, pp2.y)) - 0.015;
  res = hitMin(res, HitInfo(min(dPortal1, dPortal2), 2.0, fract(p.xz * 2.0), 0.8, 1.0, 1.8));

  // --- 3. DARK VOLCANIC ALIEN HORIZON PLAIN FAR BELOW CHASM (Img #15) ---
  float terrain = 0.12 * sin(p.x * 1.6 + 0.4) * cos(p.z * 1.4) + 0.045 * sin(p.x * 5.2 - p.z * 4.1);
  float dGround = p.y + 1.38 - terrain * smoothstep(0.3, 2.2, length(p.xz));
  res = hitMin(res, HitInfo(dGround, 3.0, fract(p.xz * 0.35), clamp(length(p.xz) * 0.22, 0.0, 1.5), terrain * 4.0, 0.0));

  return res;
}
#endif

// ============================================================================
// REGIME 2: CHIMERA FOAM (Jewel-Refractive Gyroidal Soap-Film Hyper-Sponge)
// Inspired by Image #3
// ============================================================================
#if REGIME_ID == 2
HitInfo mapFoam(vec3 p, bool detailed) {
  HitInfo res;
  res.d = 1e5; res.mat = 4.0; res.trapUV = vec2(0.5); res.trapA = 0.0; res.trapB = 0.0; res.emissive = 0.0;

  float t = uTime * 0.24;
  float dOuter = length(p) - 2.75;

  if (dOuter < 0.25) {
    vec4 p4 = liftTo4D(p * 0.62, uRot4D + 0.10 * sin(t * 0.7), uRot4D2 + 0.08 * cos(t * 0.6));
    vec3 q = mix(p, p4.xyz, 0.26);
    float jac = mix(1.0, p4.w, 0.26);

    // Multi-scale webbed gyroid minimal surface with dramatic gaping cosmic voids (Img #3!)
    float freq = 2.65 * uFoldGain;
    vec3 gP = q * freq;
    float g1 = gyroid(gP);
    float g2 = gyroid(gP * 2.45 + vec3(g1 * 1.25, -g1 * 0.85, g1 * 0.70) + t * 0.22);
    float g3 = gyroid(gP * 5.8 - vec3(g2 * 0.55));

    // Carve smooth organic soap-film struts (thin glossy bridges separating huge pitch-black bubbles!)
    float field = g1 + 0.28 * g2 + 0.075 * g3;
    float wallThick = 0.14 + 0.04 * sin(length(q) * 2.5 - t);
    float dGyroid = (abs(field) - wallThick) / (freq * 2.15);

    // Add large spherical soap-bubble cutouts for dramatic multi-layered cavernous sightlines!
    float dCenterVoid = -(length(p - vec3(0.0, 0.0, 0.42)) - 0.78);
    float dSideVoid1  = -(length(p - vec3(-0.95, 0.45, -0.35)) - 0.56);
    float dSideVoid2  = -(length(p - vec3(0.88, -0.38, -0.45)) - 0.54);

    float dFoam = smax(dGyroid, dOuter, 0.16);
    dFoam = smax(dFoam, dCenterVoid, 0.12);
    dFoam = smax(dFoam, dSideVoid1, 0.10);
    dFoam = smax(dFoam, dSideVoid2, 0.10);

    vec2 uv2 = fract(vec2(atan(q.y, q.x) / TAU + 0.5 + g1 * 0.18, q.z * 0.28 + g2 * 0.22 + 0.5));

    float pdeVort = 0.0;
    if (detailed && abs(dFoam) < 0.05) {
      vec4 pde = samplePDE(uv2);
      dFoam -= (pde.b - 0.5) * 0.012 * uRelief;
      pdeVort = pde.a;
    }

    res.d = dFoam / max(jac, 0.85);
    res.mat = 4.0;
    res.trapUV = uv2;
    res.trapA = clamp(abs(g2) * 0.85 + 0.15, 0.0, 1.5);
    res.trapB = clamp(0.5 + 0.5 * g1, 0.0, 1.5);
    res.emissive = smoothstep(0.62, 0.96, pdeVort) * uGlow * 0.42;

    // Suspended glistening micro-droplets inside dark bubble voids (Img #3)
    vec3 dp = p * 1.85;
    vec3 cell = floor(dp);
    vec3 f = fract(dp) - 0.5;
    vec3 rnd = hash33(cell + 11.7);
    if (rnd.x >= 0.52) {
      vec3 off = (rnd - 0.5) * 0.52;
      off.y += 0.04 * sin(t * 2.0 + rnd.x * TAU);
      float rad = mix(0.024, 0.088, pow(rnd.z, 2.4));
      float dDrop = max((length(f - off) - rad) / 1.85, length(p) - 2.35);
      res = hitMin(res, HitInfo(dDrop, 1.0, fract(rnd.xy + uv2 * 0.5), rnd.y * 1.2, rnd.z, 0.0));
    }
  } else {
    res.d = dOuter;
  }

  return res;
}
#endif

// ============================================================================
// REGIME 3: RADIOLARIAN CORAL (Dense Icosahedral Ribbed Bio-Coral & Ceramic Pearls)
// Inspired by Images #9 & #13
// ============================================================================
#if REGIME_ID == 3
HitInfo mapRadiolarian(vec3 p, bool detailed) {
  HitInfo res;
  res.d = 1e5; res.mat = 0.0; res.trapUV = vec2(0.5); res.trapA = 0.0; res.trapB = 0.0; res.emissive = 0.0;

  float t = uTime * 0.18;
  float rCenter = length(p);

  // Guaranteed lush, solid-core icosahedral differential-growth sculpture centered at origin!
  if (rCenter < 1.58) {
    vec4 p4 = liftTo4D(p * 0.72, uRot4D + 0.06 * sin(t), uRot4D2 + 0.05 * cos(t * 0.9));
    vec3 q = mix(p, p4.xyz, 0.16);
    float jac = mix(1.0, p4.w, 0.16);

    // Exact icosahedral folding produces 60-fold sculptural symmetry of curling coral lobes!
    vec3 ic = foldIcosa(q);

    // Multi-scale domain-warped curl coils wrapping every icosahedral lobe (Img #9!)
    vec3 w1 = q * (2.6 * uFoldGain);
    float g1 = gyroid(w1 + vec3(0.0, t * 0.12, 0.0));
    vec3 w2 = q * (5.6 * uFoldGain) + vec3(g1 * 1.55, -g1 * 1.25, g1 * 1.10);
    float g2 = gyroid(w2);

    // Plump sculptural ribbed toroidal-coil lobes radiating from icosahedral vertices!
    vec3 lobeA = ic - vec3(0.32, 0.18, 0.72);
    float dLobeA = length(vec2(length(lobeA.xy) - 0.26, lobeA.z)) - 0.165;

    vec3 lobeB = ic - vec3(0.14, 0.44, 0.56);
    float dLobeB = length(lobeB * vec3(1.1, 0.9, 1.0)) - 0.24;

    // Deeply convoluted coral brain/coil outer shell anchored cleanly around r ~ 0.96
    float baseSphere = rCenter - 0.96 - 0.16 * g1 - 0.075 * g2;
    // Carve sinuous deep spiral canyons between bulging ribbed curls
    float canyon = (abs(g1 + 0.35 * g2) - 0.22) * 0.22;
    float dCore = smin(baseSphere, min(dLobeA, dLobeB), 0.14);
    float dCoral = smax(dCore, -canyon - 0.06, 0.06);
    dCoral = min(dCoral, rCenter - 0.56); // Solid inner heart so no see-through holes!

    // Signature dense concentric parallel ceramic ribs curving organically around every coil (Img #9!)
    float coilPhase = g1 * 2.4 + g2 * 1.1 + atan(ic.y, ic.x) * 1.5 + length(lobeA) * 5.2;
    vec2 uv3 = fract(vec2(atan(q.y, q.x) / TAU + 0.5, coilPhase * 0.22 + 0.5));

    float pdeVort = 0.0;
    if (detailed && abs(dCoral) < 0.07) {
      vec4 pde = samplePDE(uv3);
      float parallelRibs = sin(coilPhase * 19.0 + pde.b * 4.5);
      float fineStriation = sin(coilPhase * 42.0) * 0.28;
      dCoral -= (parallelRibs * 0.012 + fineStriation * 0.004 + (pde.b - 0.5) * 0.010) * uRelief;
      pdeVort = pde.a;
    }

    res.d = (dCoral * 0.65) / max(jac, 0.85);
    res.mat = 0.0;
    res.trapUV = uv3;
    res.trapA = clamp(0.5 + 0.45 * g1 + 0.25 * g2, 0.0, 1.5);
    res.trapB = clamp(0.5 + 0.5 * sin(coilPhase * 3.5), 0.0, 1.5);
    res.emissive = smoothstep(0.72, 0.98, pdeVort) * uGlow * 0.32;
  } else {
    res.d = rCenter - 1.36;
  }

  // Glossy satin-ceramic pearls visibly nestled across the ribbed icosahedral hollows + macro bokeh spheres (Img #9 & #13!)
  vec3 ip = foldIcosa(p);
  float dNest1 = length(ip - vec3(0.46, 0.26, 0.96)) - 0.165;
  float dNest2 = length(ip - vec3(0.20, 0.60, 0.80)) - 0.115;
  float dNest3 = length(ip - vec3(0.72, 0.14, 0.68)) - 0.092;

  float dSat = 1e5;
  dSat = min(dSat, length(p - vec3(1.36, 0.64 + 0.04 * sin(t), 0.52)) - 0.115);
  dSat = min(dSat, length(p - vec3(-1.38, -0.74 + 0.05 * cos(t * 1.1), 0.62)) - 0.145);
  dSat = min(dSat, length(p - vec3(-1.24, 0.86 - 0.04 * sin(t * 0.8), 0.25)) - 0.078);
  dSat = min(dSat, length(p - vec3(1.18, -0.88 + 0.03 * cos(t * 1.3), -0.15)) - 0.088);

  float dPearls = min(min(dNest1, min(dNest2, dNest3)), dSat);
  float pearlColorKey = fract(length(ip * 2.1) + (dNest2 < dNest1 ? 0.35 : 0.0) + (dSat < 0.2 ? 0.62 : 0.0));
  res = hitMin(res, HitInfo(dPearls, 1.0, fract(p.xy * 0.8 + 0.5), pearlColorKey, 0.5, 0.0));

  return res;
}
#endif

// ============================================================================
// REGIME 4: DARK SERAPH (Bilateral Ferrofluid Rorschach & Crimson Singularity)
// Inspired by Images #4, #7, #11
// ============================================================================
#if REGIME_ID == 4
HitInfo mapSeraph(vec3 p, bool detailed) {
  HitInfo res;
  res.d = 1e5; res.mat = 0.0; res.trapUV = vec2(0.5); res.trapA = 0.0; res.trapB = 0.0; res.emissive = 0.0;

  float t = uTime * 0.20;
  vec3 sym = vec3(abs(p.x), p.y, p.z);

  vec3 wingP = sym - vec3(0.56, 0.36, -0.14);
  float dWingEnv = length(wingP * vec3(0.62, 1.06, 1.15)) - 1.04;
  float dCrownEnv = length((sym - vec3(0.0, 0.72, -0.08)) * vec3(1.15, 0.85, 1.1)) - 0.78;
  float dSeraphEnv = smin(dWingEnv, dCrownEnv, 0.25);

  vec3 butP = sym - vec3(0.86, -0.96, 0.24);
  butP.xy = rot2(0.42) * butP.xy;
  vec3 bBox = abs(butP) - vec3(0.24, 0.85, 0.65);
  float dButtress = length(max(bBox, 0.0)) + min(max(bBox.x, max(bBox.y, bBox.z)), 0.0);
  float dEnvAll = min(dSeraphEnv, dButtress);

  if (dEnvAll < 0.25) {
    vec3 z = sym;
    z.xy = rot2(-0.18 + 0.14 * sin(uRot4D)) * z.xy;
    float scale = 1.0;
    float fiberSum = 0.0;
    float minR = 1e5;

    for (int i = 0; i < 6; i++) {
      z.x = abs(z.x) - 0.36 * uFoldGain;
      z.y = abs(z.y) - 0.28;
      z.xz = rot2(0.32 + uRot4D2 * 0.24) * z.xz;
      z.xy = rot2(-0.24 + 0.06 * float(i)) * z.xy;
      float r2 = dot(z, z);
      float k = clamp(1.12 / max(r2, 0.09), 1.0, 2.25);
      z *= k;
      scale *= k;
      minR = min(minR, r2);
      fiberSum += sin(z.x * 2.2 + z.y * 1.7) / (scale + 0.6);
    }

    float dFractal = (length(z.xz) - 0.32) / scale;
    float dPortalVoid = length(p - vec3(0.0, -0.58, 0.15)) - 0.52;

    float dMain = smax(dFractal, dSeraphEnv, 0.08);
    dMain = smin(dMain, smax(dFractal * 0.75 + 0.02, dButtress, 0.05), 0.12);
    dMain = smax(dMain, -dPortalVoid, 0.07);

    vec2 uv4 = fract(vec2(sym.x * 0.48 + fiberSum * 0.4, sym.y * 0.42 - sym.z * 0.25 + 0.5));

    float strataEmit = 0.0;
    if (detailed && abs(dMain) < 0.055) {
      vec4 pde = samplePDE(uv4);
      float tendon = sin(fiberSum * 38.0 + gyroid(sym * 7.5) * 2.2 + pde.b * 4.0);
      dMain -= (tendon * 0.008 + (pde.b - 0.5) * 0.007) * uRelief;
      // Crisp selective spectral data-strata etching ONLY on lower architectural buttress walls (Img #11)
      float strata = spectralStrata(uv4 * vec2(1.2, 1.8), t);
      float inButtress = smoothstep(-0.22, -0.72, p.y) * smoothstep(0.55, 0.95, sym.x);
      strataEmit = (strata * inButtress * 0.38 + smoothstep(0.72, 0.97, pde.a) * 0.45) * uGlow;
    }

    res.d = dMain;
    res.mat = 0.0;
    res.trapUV = uv4;
    res.trapA = clamp(sqrt(minR) * 0.72, 0.0, 1.5);
    res.trapB = clamp(0.5 + 0.5 * sin(fiberSum * 12.0), 0.0, 1.5);
    res.emissive = strataEmit;
  } else {
    res.d = dEnvAll;
  }

  // Piercing Crimson Event-Horizon Singularity & 24-Spoke Geodesic Spiderweb (Img #4!)
  vec3 sc = p - vec3(0.0, -0.58, 0.14);
  float sr = length(sc.xy);
  float sAng = atan(sc.y, sc.x);
  float dSing = length(sc) - 0.044;

  float wSec = TAU / 24.0;
  float wa = mod(sAng + wSec * 0.5, wSec) - wSec * 0.5;
  float dSpoke = length(vec2(wa * max(sr, 0.05), sc.z)) - 0.0038;
  float dRing = length(vec2(abs(fract(sr * 6.5) - 0.5) / 6.5, sc.z)) - 0.0032;
  float dWeb = max(min(dSpoke, dRing), max(sr - 0.72, 0.052 - sr));

  res = hitMin(res, HitInfo(dSing, 2.0, vec2(0.5), 1.0, 1.0, 3.2));
  res = hitMin(res, HitInfo(dWeb * 0.85, 1.0, fract(vec2(sAng / TAU, sr)), 0.9, 0.8, smoothstep(0.62, 0.06, sr) * 0.65));
  res = hitMin(res, HitInfo(p.y + 1.48, 3.0, fract(p.xz * 0.5), length(p.xz) * 0.3, 0.0, 0.0));

  return res;
}
#endif

// ============================================================================
// REGIME 5: XENO-HYBRID (Single-Loop Fused 4D Kleinian-KIFS-Gyroid Chimera!)
// ============================================================================
#if REGIME_ID == 5
HitInfo mapHybrid(vec3 p, bool detailed) {
  HitInfo res;
  res.d = 1e5; res.mat = 0.0; res.trapUV = vec2(0.5); res.trapA = 0.0; res.trapB = 0.0; res.emissive = 0.0;

  float t = uTime * 0.22;
  float dBound = length(p) - 1.48;

  if (dBound < 0.28) {
    vec4 p4 = liftTo4D(p * 0.70, uRot4D + 0.09 * sin(t), uRot4D2 + 0.07 * cos(t * 0.8));
    vec3 q = mix(p, p4.xyz, 0.24);
    float jac = mix(1.0, p4.w, 0.24);

    vec3 z = q;
    float scale = 1.0;
    float minR = 1e5;
    float orbit = 0.0;
    float m = clamp(uMorph, 0.0, 1.0);
    mat2 tw = rot2(0.24 + uRot4D * 0.32);

    for (int i = 0; i < 7; i++) {
      vec3 zKlein = 2.0 * clamp(z, vec3(-0.96), vec3(0.96)) - z;
      vec3 zKifs = abs(z);
      if (zKifs.x < zKifs.y) zKifs.xy = zKifs.yx;
      if (zKifs.x < zKifs.z) zKifs.xz = zKifs.zx;
      z = mix(zKlein, zKifs - vec3(0.45, 0.28, 0.15), m * 0.65);

      float r2 = dot(z, z);
      float kInv = max(1.18 * uFoldGain / max(r2, 0.028), 1.0);
      float kScale = mix(kInv, 1.98, m * 0.45);
      z *= kScale;
      scale *= kScale;
      if (i == 2 || i == 4) z.xy = tw * z.xy;
      minR = min(minR, r2);
      orbit += abs(z.y - z.x) / (scale + 1.0);
    }

    float dPrim = mix(length(z) - 0.54, length(max(abs(z) - vec3(0.84), 0.0)) - 0.05, m) / scale;
    float dMain = smax(dPrim, dBound, 0.10);
    dMain = smax(dMain, -(length(p - vec3(0.0, 0.0, 0.46)) - 0.54), 0.08);

    vec2 uv5 = fract(vec2(atan(z.y, z.x) / TAU + 0.5, orbit * 0.65 + 0.5));

    float pdeVort = 0.0;
    if (detailed && abs(dMain) < 0.055) {
      vec4 pde = samplePDE(uv5);
      dMain -= (pde.b - 0.5) * 0.011 * uRelief;
      pdeVort = pde.a;
    }

    res.d = dMain / max(jac, 0.85);
    res.mat = 0.0;
    res.trapUV = uv5;
    res.trapA = clamp(sqrt(minR) * 0.82, 0.0, 1.5);
    res.trapB = clamp(orbit * 0.72, 0.0, 1.5);
    res.emissive = smoothstep(0.62, 0.96, pdeVort) * uGlow * 0.58;

    // Interlaced refractive gyroidal soap-film mantle wrapping the hybrid monolith!
    float g = gyroid(q * 3.1 + t * 0.28);
    float dGlass = smax((abs(g) - 0.07) / 3.9, length(p) - 1.34, 0.08);
    dGlass = smax(dGlass, -(length(p - vec3(0.0, 0.0, 0.46)) - 0.62), 0.08);
    res = hitSmin(res, HitInfo(dGlass, 4.0, uv5, 0.85, abs(g), res.emissive * 0.4), 0.045);
  } else {
    res.d = dBound;
  }

  float dCore = length(p - vec3(0.0, 0.0, 0.04)) - 0.14;
  res = hitMin(res, HitInfo(dCore, 2.0, vec2(0.5), 1.0, 1.0, 1.8));

  vec3 op = p;
  op.xz = rot2(t * 0.35) * op.xz;
  float ang = atan(op.z, op.x);
  float sec = TAU / 8.0;
  float a = mod(ang + sec * 0.5, sec) - sec * 0.5;
  float r = length(op.xz);
  float dRingOrbs = length(vec3(r * cos(a) - 1.24, op.y - 0.22 * sin(ang * 3.0 + t), r * sin(a))) - 0.082;
  res = hitMin(res, HitInfo(dRingOrbs, 1.0, fract(p.xy), 0.6, 0.9, 0.0));
  res = hitMin(res, HitInfo(p.y + 1.32, 3.0, fract(p.xz * 0.5), length(p.xz) * 0.35, 0.0, 0.0));

  return res;
}
#endif

// ============================================================================
// UNIFIED SCENE DISPATCHER + TOMOGRAPHIC 4D SLICE PLANE
// ============================================================================
HitInfo mapScene(vec3 p, bool detailed) {
  HitInfo h;
#if REGIME_ID == 0
  h = mapAnemone(p, detailed);
#elif REGIME_ID == 1
  h = mapKifs(p, detailed);
#elif REGIME_ID == 2
  h = mapFoam(p, detailed);
#elif REGIME_ID == 3
  h = mapRadiolarian(p, detailed);
#elif REGIME_ID == 4
  h = mapSeraph(p, detailed);
#else
  h = mapHybrid(p, detailed);
#endif

  if (uSlice > -0.98 && h.mat != 3.0) {
    vec3 sliceN = normalize(vec3(0.32, 0.22, 0.92));
    float dPlane = dot(p, sliceN) - uSlice * 1.38;
    if (dPlane > h.d) {
      float edgeBand = exp(-abs(dPlane - h.d) * 34.0);
      h.d = dPlane;
      h.emissive = max(h.emissive, edgeBand * 2.2 + 0.25);
      h.trapA = 1.25;
    }
  }
  return h;
}

// ============================================================================
// BESPOKE VOLUMETRIC ENERGY & GOSSAMER SCATTERING INTEGRATOR PER REGIME
// Tightly sculpted to preserve pitch-black abyssal chiaroscuro!
// ============================================================================
vec3 sampleVolumeField(vec3 p, vec3 rd) {
  float t = uTime * 0.25;
  vec3 vol = vec3(0.0);

#if REGIME_ID == 0 || REGIME_ID == 5
  vec3 ic = p - vec3(0.0, 0.08, 0.16);
  float rIris = length(ic);
  vol += uCoreCol * exp(-rIris * 4.4) * 0.42;
  float dLeft = length(p - vec3(-0.78, 0.08, 0.24));
  float dRight = length(p - vec3(0.78, -0.05, 0.20));
  vol += uKeyCol * exp(-dLeft * 2.4) * 0.24;
  vol += uFillCol * exp(-dRight * 2.2) * 0.28;
  float dMag = length(p - vec3(0.56, -0.24, 0.46));
  vol += uAccentCol * exp(-dMag * 3.8) * 0.44;
  // Hair-thin vertical gossamer laser filaments descending from abyss (Img #1 & #10)
  vec2 filGrid = fract(p.xz * 2.1) - 0.5;
  float cellH = hash12(floor(p.xz * 2.1));
  if (cellH > 0.74) {
    float lineD = length(filGrid - (vec2(cellH, fract(cellH * 13.7)) - 0.5) * 0.55);
    float beam = exp(-lineD * 64.0) * smoothstep(2.2, 0.7, length(p.xz)) * smoothstep(-1.25, 0.8, p.y);
    vol += mix(uFillCol, uAccentCol, fract(cellH * 7.3)) * beam * 0.16;
  }
#endif

#if REGIME_ID == 1
  // Luminous Aurora Plasma Cascade pouring vertically down right crystal cliff face (Img #15!)
  vec3 ap = p - vec3(0.46, 0.18, -0.08);
  float sheet = exp(-abs(ap.x + 0.16 * sin(ap.y * 1.9 + t)) * 6.2) * exp(-abs(ap.z) * 2.1);
  float curtain = 0.5 + 0.5 * sin(ap.y * 7.5 - t * 2.2 + gyroid(p * 3.8) * 2.0);
  vol += mix(uFillCol, vec3(0.86, 0.95, 1.0), curtain) * sheet * (0.35 + 0.65 * curtain) * 0.62;
  float dp1 = length(p - vec3(-0.18, -0.78, 0.88));
  vol += uCoreCol * exp(-dp1 * 5.2) * 0.65;
#endif

#if REGIME_ID == 2
  // Subtle internal caustic bloom strictly inside foam chambers (keeps cosmic voids dark!)
  float w1 = 0.5 + 0.5 * sin(p.x * 2.5 + p.y * 2.0 - t);
  float w2 = 0.5 + 0.5 * cos(p.z * 2.6 - p.x * 1.8 + t * 0.8);
  vec3 caustic = mix(uKeyCol, uCoreCol, w1);
  caustic = mix(caustic, uAccentCol, w2 * 0.5);
  vol += caustic * exp(-length(p) * 1.15) * 0.08;
#endif

#if REGIME_ID == 3
  float dWarm = length(p - vec3(-1.55, 0.55, 0.4));
  float dCool = length(p - vec3(1.55, 0.30, 0.5));
  vol += uKeyCol * exp(-dWarm * 1.45) * 0.06;
  vol += uFillCol * exp(-dCool * 1.45) * 0.065;
#endif

#if REGIME_ID == 4
  vec3 sc = p - vec3(0.0, -0.58, 0.14);
  float rs = length(sc);
  vol += uCoreCol * exp(-rs * 5.2) * 1.15;
  vol += vec3(0.75, 0.06, 0.08) * exp(-rs * 1.85) * 0.22;
#endif

  return vol * uVol;
}
`;
