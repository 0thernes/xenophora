# Changelog

All notable changes to **XENOPHORA** are documented in this file.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-11-19

### Added
- **Bare-Metal WebGL2 Multi-Pass Engine (`src/engine/renderer.js`):** 14-FBO pipeline with zero external dependencies, automatic software-GPU detection, and responsive resolution scaling.
- **Operator-Split Complex Ginzburg–Landau Chimera PDE (`src/shaders/pde.glsl.js`):** Unconditionally checkerboard-free `256×256` `RGBA16F` ping-pong PDE combining exact analytical Stuart–Landau nonlinear integration, 9-point isotropic complex diffusion, slow morphogenesis rib memory, and sparse topological phase-defect vorticity + live `108×108` HUD preview.
- **Six Bespoke 4D Non-Euclidean Regimes (`src/shaders/regimes.glsl.js`):**
  1. `I · ANEMONE ABYSS` (4D Pseudo-Kleinian / gyroidal cavern, 22-petal Hopf filament iris, piezo bead rings, gossamer laser threads)
  2. `II · OPALESCENT KIFS` (Recursive Menger-Labyrinth cliff, prismatic diffraction fire, plasma portals, vertical aurora cascade)
  3. `III · CHIMERA FOAM` (3-octave warped Gyroid minimal surface, RGB chromatic-dispersion refraction, oil-slick caustics, suspended micro-droplets)
  4. `IV · RADIOLARIAN CORAL` (60-fold icosahedral differential-growth ribbed ceramic sculpture, macro SSS, nestled glossy ceramic pearls)
  5. `V · DARK SERAPH` (Bilateral obsidian-mercury Rorschach monolith, piercing crimson event-horizon singularity, 24-spoke geodesic spiderweb, bitwise spectral glitch strata)
  6. `VI · XENO-HYBRID` (Single-loop cross-species Kleinian-KIFS-Gyroid 4D chimera)
- **Physical Spectral Optics & 256-SPP Path Refinement (`src/shaders/common.glsl.js`, `raymarch.glsl.js`, `post.glsl.js`):** 5-band Airy thin-film interference, stochastic micro-facet diffraction sparkles, GGX PBR + clearcoat, secondary reflection/refraction bounce, thin-lens bokeh DOF, 4-mip dual-filter Kawase bloom, ACES tone mapping, and tomographic 4D slicing.
- **Exact `1×1` GPU Ray-Picked Manifold Injection & Rack Autofocus:** Clicking injects chiral $\pm 1$ spiral singularities directly at the folded `(trapU, trapV)` coordinate; double-clicking locks thin-lens focus distance to exact 3D depth.
- **Procedural Piezo-Optical Web Audio Engine (`src/engine/audio.js`):** Modal glass-bell partials, stereo shimmer delay, and per-regime harmonic sub-drone.
- **Documentation, Tests & GitHub Pages:** Full `docs/` library, 15-image reference provenance catalog, automated Node.js test suite (`tests/`), CI workflow, and live GitHub Pages deployment.
