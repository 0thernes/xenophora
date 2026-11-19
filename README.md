# XENOPHORA

**A Living 4D Non-Euclidean Piezo-Optical Manifold**  
*Bare-metal WebGL2 / GLSL 300 es + Web Audio API — Zero External Dependencies*

XENOPHORA fuses five real-time GPU simulation, differential-geometry, and physical-optics pipelines into a single interactive 3D instrument:

1. **Operator-Split Complex Ginzburg–Landau (CGLE) Chimera PDE (`RGBA16F` Ping-Pong FBOs)**  
   Solves $\partial_t A = A - (1 + i c_2)|A|^2 A + D(1 + i c_1)\nabla^2 A$ with exact analytical Stuart–Landau nonlinear integration and 9-point isotropic complex dispersion. The live spiral waves and topological phase-defect cores are mapped onto the conformal orbit-trap coordinates of 4D non-Euclidean manifolds — sculpting ribbed 3D morphogenesis relief, shifting thin-film interference thickness, and igniting bioluminescent capillaries in real time.
2. **Exact `1×1` GPU Ray-Picked Intrinsic Manifold Injection**  
   Clicking (or `Shift + Drag`ging) anywhere on the 3D sculpture fires a GPU pick ray through the exact 4D SDF, reads back the folded intrinsic `(u, v)` coordinate, and injects a real chiral spiral singularity into the CGLE PDE right at that hidden non-Euclidean fold.
3. **Physical Spectral Optics & Secondary Raytracing**  
   - 5-band Airy / Fabry–Pérot thin-film optical interference (`OPD = 2 n_f d \cos\theta_t`)
   - Stochastic micro-facet prismatic diffraction grating sparkles
   - Secondary raymarched reflection and RGB chromatic-dispersion refraction bounces
   - 4-tap analytical curvature, exponential crevice AO, soft penumbra shadows, forward SSS, and 4-level dual-filter Kawase HDR bloom + ACES filmic grading
4. **Progressive 256-SPP Stochastic Path Refinement + Thin-Lens Bokeh**  
   Press `Space` (`REFINE`) to freeze PDE evolution and accumulate up to 256 low-discrepancy R2 / Interleaved Gradient Noise jittered samples with physical aperture bokeh, soft area shadows, and subpixel anti-aliasing.
5. **Procedural Piezo-Optical Web Audio Engine**  
   Modal glass-bell partials, stereo shimmer delay feedback network, and sub-harmonic drone coupled to live 4D rotation, PDE dispersion chaos, and 3D manifold clicks.

---

## Six Curated 4D Specimens (`1`–`6`)

| Key | Specimen | Mathematics & Optics |
| :-: | :--- | :--- |
| `1` | **I · ANEMONE ABYSS** | 4D Clifford-lifted Pseudo-Kleinian & gyroidal cavern, 22-petal Hopf-filament iris, concentric ceramic piezo bead rings, gossamer filaments |
| `2` | **II · OPALESCENT KIFS** | Recursive Menger-Labyrinth cathedral cliff, prismatic diffraction-grating glints, engraved calligraphic channels, plasma portals, vertical aurora cascade |
| `3` | **III · CHIMERA FOAM** | Triply-periodic warped gyroid minimal surface, RGB chromatic refraction, oil-slick thin-film caustics, suspended micro-droplets |
| `4` | **IV · RADIOLARIAN CORAL** | 60-fold icosahedral differential-growth ribbed ceramic-coral organoid, macro SSS, nested glossy porcelain spheres |
| `5` | **V · DARK SERAPH** | Bilateral liquid-mercury & obsidian-bone Rorschach monolith, piercing crimson event-horizon singularity, 24-spoke geodesic spiderweb, bitwise spectral glitch strata |
| `6` | **VI · XENO-HYBRID** | Single-loop cross-species 4D fold continuously morphing Kleinian, KIFS, and refractive gyroidal soap-film topologies |

---

## Quick Start

Requires Node.js (zero `npm install` needed):

```bash
npm start
# or
node server.mjs
```

Open **http://127.0.0.1:4173** in any WebGL2-capable browser.

---

## Controls

| Action | Input |
| :--- | :--- |
| Orbit / Pan / Logarithmic Zoom | **Left-Drag** / **Right-Drag** / **Scroll** |
| Inject 3D Spiral PDE Singularity | **Click** or **`Shift + Drag`** on 3D surface (or click top-right `CGLE` monitor) |
| Optical Rack Autofocus (DOF) | **Double-Click** any 3D depth |
| Switch Specimens | **`1`–`6`** |
| Toggle 256-SPP Path Refine | **`Space`** |
| Genesis 1/1 Mutation | **`M`** |
| Open Manifold Alchemy Drawer (4D θ, Tomographic Slice, PDE, Optics) | **`I`** |
| Toggle Gallery Drift / Audio / PNG Snapshot / Pure Canvas / Reset Camera | **`C`** / **`A`** / **`P`** / **`H`** / **`R`** |

---

## Architecture

```text
├── index.html                   # Full-bleed viewport + minimal laboratory HUD
├── styles.css                   # Obsidian-glass typography & hairline UI
├── server.mjs                   # Zero-dependency Node HTTP server
└── src/
    ├── main.js                  # Render loop, pointer/ray-pick wiring, PNG capture
    ├── engine/
    │   ├── renderer.js          # WebGL2 multi-pass FBO orchestrator (PDE, HDR, TAA, Bloom, Pick)
    │   ├── camera.js            # Inertial orbital + truck + log-zoom + rack-focus camera
    │   ├── presets.js           # 6 curated specimens + taste-bounded genetic mutator
    │   └── audio.js             # Procedural Web Audio modal glass-bell & shimmer engine
    ├── shaders/
    │   ├── common.glsl.js       # 4D Clifford lift, icosahedral folds, Airy thin-film, diffraction, GGX
    │   ├── pde.glsl.js          # Operator-split CGLE chimera PDE + live monitor visualizer
    │   ├── regimes.glsl.js      # 6 bespoke Lipschitz-bounded 4D SDF & volumetric field modules
    │   ├── raymarch.glsl.js     # Stochastic raymarcher, secondary bounces, 1x1 GPU ray-picker
    │   └── post.glsl.js         # Temporal accumulation, dual-filter Kawase bloom, ACES grading
    └── ui/
        └── hud.js               # Reactive telemetry, shortcuts, and alchemy inspector
```

## License

MIT
