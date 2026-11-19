export const REGIMES = [
  {
    id: 0,
    code: '01 · ANEMONE ABYSS',
    short: 'ANEMONE',
    subtitle: '4D Pseudo-Kleinian Cathedral × Hopf Filament Iris × CGLE Chimera Skin',
    camera: {
      yaw: 0.14,
      pitch: 0.07,
      dist: 3.12,
      target: [0.0, 0.02, 0.0],
      fov: 46,
      focusDist: 2.95,
    },
    params: {
      rot4d: 0.24,
      rot4d2: 0.12,
      foldGain: 1.0,
      morph: 0.5,
      slice: -1.0,
      c1: 1.15,
      c2: -1.08,
      relief: 0.72,
      glow: 0.92,
      filmNm: 520,
      irid: 0.92,
      sparkle: 0.62,
      vol: 0.95,
      aperture: 0.014,
      exposure: 1.16,
    },
    lighting: {
      keyDir: [-0.72, 0.42, 0.55],
      keyCol: [1.0, 0.54, 0.22],     // Incandescent amber-gold (Img #1)
      fillDir: [0.78, 0.18, 0.35],
      fillCol: [0.14, 0.78, 1.0],    // Electric abyssal cyan (Img #1)
      coreCol: [0.85, 0.94, 1.0],    // Luminous pearl-cyan iris
      accentCol: [1.0, 0.20, 0.66],  // Bioluminescent magenta cavities (Img #10)
      bgTop: [0.002, 0.004, 0.009],
      bgBot: [0.005, 0.003, 0.006],
    },
  },
  {
    id: 1,
    code: '02 · OPALESCENT KIFS',
    short: 'KIFS CLIFF',
    subtitle: '4D Menger-Labyrinth Monolith × Prismatic Diffraction Grating × Aurora Cascade',
    camera: {
      yaw: -0.62,
      pitch: 0.06,
      dist: 4.18,
      target: [-0.22, 0.06, 0.0],
      fov: 50,
      focusDist: 3.65,
    },
    params: {
      rot4d: 0.16,
      rot4d2: -0.18,
      foldGain: 1.04,
      morph: 0.5,
      slice: -1.0,
      c1: 1.05,
      c2: -0.95,
      relief: 0.55,
      glow: 0.95,
      filmNm: 690,
      irid: 1.12,
      sparkle: 1.08,
      vol: 1.05,
      aperture: 0.010,
      exposure: 1.22,
    },
    lighting: {
      keyDir: [-0.62, 0.68, 0.42],
      keyCol: [1.0, 0.72, 0.38],     // Warm solar-gold zenith (Img #14)
      fillDir: [0.76, 0.35, -0.35],
      fillCol: [0.42, 0.76, 1.0],    // Aurora ice-blue cascade (Img #15)
      coreCol: [1.0, 0.45, 0.16],    // Molten plasma portal wells (Img #14)
      accentCol: [0.18, 0.94, 0.86], // Engraved cyan-gold calligraphy (Img #12)
      bgTop: [0.002, 0.003, 0.008],
      bgBot: [0.001, 0.002, 0.005],
    },
  },
  {
    id: 2,
    code: '03 · CHIMERA FOAM',
    short: 'CHIMERA FOAM',
    subtitle: 'Möbius-Gyroidal Minimal Surface × RGB Chromatic Refraction × Thin-Film Oil Caustics',
    camera: {
      yaw: 0.38,
      pitch: -0.04,
      dist: 2.38,
      target: [0.0, 0.0, 0.0],
      fov: 58,
      focusDist: 2.1,
    },
    params: {
      rot4d: 0.42,
      rot4d2: 0.28,
      foldGain: 1.02,
      morph: 0.5,
      slice: -1.0,
      c1: 1.25,
      c2: -1.18,
      relief: 0.75,
      glow: 0.85,
      filmNm: 640,
      irid: 1.55,
      sparkle: 0.78,
      vol: 0.75,
      aperture: 0.009,
      exposure: 1.24,
    },
    lighting: {
      keyDir: [0.45, 0.72, 0.52],
      keyCol: [1.0, 0.68, 0.30],     // Amber caustic refraction (Img #3)
      fillDir: [-0.75, -0.22, 0.58],
      fillCol: [0.38, 0.48, 1.0],    // Electric sapphire-violet
      coreCol: [1.0, 0.24, 0.72],    // Iridescent magenta soap-film
      accentCol: [0.18, 0.90, 1.0],  // Spectral cyan dispersion
      bgTop: [0.001, 0.001, 0.004],
      bgBot: [0.003, 0.001, 0.005],
    },
  },
  {
    id: 3,
    code: '04 · RADIOLARIAN CORAL',
    short: 'RADIOLARIAN',
    subtitle: 'Icosahedral Differential-Growth Ribbed Coils × Apollonian Ceramic Pearls × Macro SSS',
    camera: {
      yaw: 0.36,
      pitch: 0.14,
      dist: 3.42,
      target: [0.0, 0.0, 0.0],
      fov: 42,
      focusDist: 3.10,
    },
    params: {
      rot4d: 0.26,
      rot4d2: 0.16,
      foldGain: 1.0,
      morph: 0.5,
      slice: -1.0,
      c1: 0.95,
      c2: -1.15,
      relief: 1.15,
      glow: 0.38,
      filmNm: 460,
      irid: 0.75,
      sparkle: 0.30,
      vol: 0.40,
      aperture: 0.012,
      exposure: 1.14,
    },
    lighting: {
      keyDir: [-0.76, 0.48, 0.44],
      keyCol: [1.0, 0.74, 0.46],     // Warm macro studio gold (Img #9)
      fillDir: [0.78, 0.25, 0.48],
      fillCol: [0.48, 0.78, 1.0],    // Glacial studio porcelain blue (Img #9)
      coreCol: [0.98, 0.40, 0.52],   // Satin coral-rose bead glaze
      accentCol: [0.24, 0.76, 0.92], // Cerulean porcelain glaze (Img #13)
      bgTop: [0.006, 0.009, 0.016],
      bgBot: [0.004, 0.003, 0.006],
    },
  },
  {
    id: 4,
    code: '05 · DARK SERAPH',
    short: 'SERAPH',
    subtitle: 'Bilateral Ferrofluid Rorschach × Crimson Event-Horizon Web × Spectral Glitch Strata',
    camera: {
      yaw: 0.0,
      pitch: 0.04,
      dist: 3.48,
      target: [0.0, 0.02, 0.0],
      fov: 48,
      focusDist: 3.25,
    },
    params: {
      rot4d: 0.14,
      rot4d2: -0.08,
      foldGain: 1.04,
      morph: 0.5,
      slice: -1.0,
      c1: 1.22,
      c2: -1.25,
      relief: 0.92,
      glow: 0.98,
      filmNm: 380,
      irid: 0.62,
      sparkle: 0.72,
      vol: 0.92,
      aperture: 0.009,
      exposure: 1.18,
    },
    lighting: {
      keyDir: [0.0, 0.88, 0.48],
      keyCol: [0.94, 0.88, 0.80],    // Pale bone-ivory zenith light (Img #4)
      fillDir: [0.0, -0.42, 0.82],
      fillCol: [0.96, 0.12, 0.14],   // Crimson singularity under-glow (Img #4)
      coreCol: [1.0, 0.10, 0.16],    // Piercing crimson aperture
      accentCol: [0.96, 0.72, 0.30], // Molten antique-gold fractures (Img #7)
      bgTop: [0.005, 0.005, 0.006],
      bgBot: [0.003, 0.001, 0.002],
    },
  },
  {
    id: 5,
    code: '06 · XENO-HYBRID',
    short: 'HYBRID',
    subtitle: 'Live 4D Cross-Species Chimera (Kleinian-KIFS × Gyroidal Soap-Film × Acoustic Pearls)',
    camera: {
      yaw: 0.46,
      pitch: 0.15,
      dist: 3.55,
      target: [0.0, 0.0, 0.0],
      fov: 48,
      focusDist: 3.30,
    },
    params: {
      rot4d: 0.48,
      rot4d2: -0.32,
      foldGain: 1.08,
      morph: 0.52,
      slice: -1.0,
      c1: 1.20,
      c2: -1.15,
      relief: 0.85,
      glow: 0.92,
      filmNm: 760,
      irid: 1.28,
      sparkle: 1.05,
      vol: 0.88,
      aperture: 0.008,
      exposure: 1.18,
    },
    lighting: {
      keyDir: [-0.68, 0.54, 0.48],
      keyCol: [1.0, 0.60, 0.28],
      fillDir: [0.74, -0.14, 0.55],
      fillCol: [0.18, 0.86, 1.0],
      coreCol: [0.96, 0.26, 0.76],
      accentCol: [1.0, 0.82, 0.32],
      bgTop: [0.002, 0.003, 0.007],
      bgBot: [0.003, 0.002, 0.005],
    },
  },
];

const CURATED_PALETTES = [
  {
    name: 'SOLAR ABYSS',
    keyCol: [1.0, 0.54, 0.22],
    fillCol: [0.14, 0.80, 1.0],
    coreCol: [0.94, 0.96, 1.0],
    accentCol: [1.0, 0.20, 0.64],
  },
  {
    name: 'BISMUTH OBSIDIAN',
    keyCol: [0.95, 0.80, 0.52],
    fillCol: [0.40, 0.46, 1.0],
    coreCol: [0.32, 1.0, 0.86],
    accentCol: [0.98, 0.38, 0.84],
  },
  {
    name: 'CRIMSON OSSUARY',
    keyCol: [0.96, 0.88, 0.78],
    fillCol: [0.92, 0.14, 0.20],
    coreCol: [1.0, 0.18, 0.14],
    accentCol: [1.0, 0.74, 0.28],
  },
  {
    name: 'OPALESCENT AURORA',
    keyCol: [0.68, 0.92, 1.0],
    fillCol: [0.76, 0.30, 1.0],
    coreCol: [1.0, 0.72, 0.36],
    accentCol: [0.24, 1.0, 0.74],
  },
  {
    name: 'PORCELAIN REEF',
    keyCol: [1.0, 0.76, 0.52],
    fillCol: [0.42, 0.74, 0.98],
    coreCol: [1.0, 0.42, 0.52],
    accentCol: [0.94, 0.82, 0.42],
  },
  {
    name: 'CHALCEDONY VOID',
    keyCol: [0.64, 0.84, 1.0],
    fillCol: [1.0, 0.42, 0.22],
    coreCol: [0.55, 0.94, 1.0],
    accentCol: [1.0, 0.64, 0.18],
  },
];

export function mutateState(currentParams, currentLighting) {
  const pal = CURATED_PALETTES[Math.floor(Math.random() * CURATED_PALETTES.length)];
  const rand = (a, b) => a + Math.random() * (b - a);
  return {
    paletteName: pal.name,
    params: {
      ...currentParams,
      rot4d: rand(-1.85, 1.85),
      rot4d2: rand(-1.45, 1.45),
      foldGain: rand(0.86, 1.22),
      morph: rand(0.14, 0.86),
      c1: rand(0.65, 1.45),
      c2: -rand(0.70, 1.50),
      relief: rand(0.55, 1.20),
      glow: rand(0.55, 1.15),
      filmNm: Math.round(rand(280, 1080)),
      irid: rand(0.65, 1.55),
      sparkle: rand(0.35, 1.65),
      vol: rand(0.55, 1.12),
    },
    lighting: {
      ...currentLighting,
      keyCol: [...pal.keyCol],
      fillCol: [...pal.fillCol],
      coreCol: [...pal.coreCol],
      accentCol: [...pal.accentCol],
    },
  };
}
