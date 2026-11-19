<div align="center">

# XENOPHORA

### *A Living 4D Non-Euclidean Piezo-Optical Manifold & Coupled Quantum-Chimera PDE Engine*

**Bare-Metal WebGL2 · GLSL ES 3.00 · Operator-Split Complex Ginzburg–Landau PDE · Physical Spectral Optics · Procedural Web Audio · Zero External Dependencies**

[![Live Demo](https://img.shields.io/badge/LIVE_REAL--TIME_DEMO-GitHub_Pages-00d8ff?style=for-the-badge&logo=webgl&logoColor=000)](https://0thernes.github.io/xenophora/)
[![CI](https://img.shields.io/github/actions/workflow/status/0thernes/xenophora/ci.yml?style=for-the-badge&label=CI%20Tests)](https://github.com/0thernes/xenophora/actions/workflows/ci.yml)
[![Pages](https://img.shields.io/github/actions/workflow/status/0thernes/xenophora/pages.yml?style=for-the-badge&label=Pages%20Deploy)](https://github.com/0thernes/xenophora/actions/workflows/pages.yml)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-ZERO-7be8ff?style=for-the-badge)](#languages-technologies-packages--tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-ffb36b?style=for-the-badge)](./LICENSE)

<br />

<a href="https://0thernes.github.io/xenophora/">
  <img src="./assets/showcase/01-anemone-abyss.png" width="92%" alt="XENOPHORA — Regime I: Anemone Abyss rendered live in WebGL2" />
</a>

<sub><b>Live Real-Time Interactive WebGL2 Deployment:</b> <a href="https://0thernes.github.io/xenophora/">https://0thernes.github.io/xenophora/</a> — Orbit in 3D, rotate through 4D Clifford hyperspace, click any non-Euclidean fold to inject live quantum spiral singularities, slice tomographically, and accumulate 256-SPP cinema bokeh.</sub>

</div>

---

## About / What It Is

**XENOPHORA** is an interactive, real-time 3D/4D generative artwork and mathematical physics instrument running at **160–192 FPS** directly in a browser with **zero libraries** (no Three.js, no WebGL frameworks, no baked textures, no neural weights, no build step).

Instead of rendering static meshes or memoryless algebraic fractals, XENOPHORA couples a **persistent, non-equilibrium 2D Complex Ginzburg–Landau (CGLE) Artificial Life PDE** directly onto the **intrinsic conformal orbit-trap coordinates of six 4D non-Euclidean Signed Distance Field manifolds**, rendered through **5-band Airy thin-film wave interference, stochastic diffraction-grating crystal sparkles, secondary reflection/RGB-dispersion refraction bounces, volumetric scattering, progressive 256-SPP path refinement**, and **modal Web Audio piezo-glass synthesis**.

---

## Table of Contents

- [About / What It Is](#about--what-it-is)
- [Live Specimen Showcase (6 Real-Time 4D Regimes)](#live-specimen-showcase)
- [Novel 1/1 Uniqueness](#novel-11-uniqueness)
- [Artificial Life (A-Life), Morphogenesis & AI](#artificial-life-a-life-morphogenesis--ai)
- [Visual Reference Images Used (15-Image Moodboard Provenance)](#visual-reference-images-used)
- [Multi-Pass GPU Architecture](#multi-pass-gpu-architecture)
- [Languages, Technologies, Packages & Tools](#languages-technologies-packages--tools)
- [Quick Start & Controls](#quick-start--controls)
- [Automated Tests & CI](#automated-tests--ci)
- [Academic Papers & Foundational Lineage](#academic-papers--foundational-lineage)
- [Glossary & Documentation Index](#glossary--documentation-index)
- [Issues, Contributing, Security & License](#issues-contributing-security--license)

---

## Live Specimen Showcase

Every frame below was rendered live in real time by XENOPHORA's bare-metal WebGL2 engine (`160–192 FPS`, `0` external textures). Launch [**https://0thernes.github.io/xenophora/**](https://0thernes.github.io/xenophora/) and press **`1`–`6`** to explore all six live:

| `1` · I · ANEMONE ABYSS | `2` · II · OPALESCENT KIFS | `3` · III · CHIMERA FOAM |
| :---: | :---: | :---: |
| <img src="./assets/showcase/01-anemone-abyss.png" alt="Regime I: Anemone Abyss" /> | <img src="./assets/showcase/02-opalescent-kifs.png" alt="Regime II: Opalescent KIFS" /> | <img src="./assets/showcase/03-chimera-foam.png" alt="Regime III: Chimera Foam" /> |
| 4D Clifford-lifted Pseudo-Kleinian & gyroidal obsidian bio-cavern cradling a 22-petal Hopf-filament iris, satin piezo bead rings, floating orbs & gossamer beams. | Monumental recursive Menger-Labyrinth cliff skyline over an alien horizon, coated in prismatic diffraction-grating diamond glints, plasma portals & aurora cascade. | 3-octave warped triply-periodic Gyroid minimal surface with RGB chromatic-dispersion refraction, oil-slick thin-film caustics & suspended micro-droplets. |

| `4` · IV · RADIOLARIAN CORAL | `5` · V · DARK SERAPH | `6` · VI · XENO-HYBRID |
| :---: | :---: | :---: |
| <img src="./assets/showcase/04-radiolarian-coral.png" alt="Regime IV: Radiolarian Coral" /> | <img src="./assets/showcase/05-dark-seraph.png" alt="Regime V: Dark Seraph" /> | <img src="./assets/showcase/06-xeno-hybrid.png" alt="Regime VI: Xeno-Hybrid" /> |
| 60-fold icosahedral differential-growth ribbed ceramic-coral organoid with concentric porcelain grooves, creamy SSS & nestled satin ceramic pearls. | Bilateral liquid-mercury & obsidian-bone Rorschach monolith towering over a piercing crimson event-horizon singularity, 24-spoke geodesic web & spectral glitch strata. | Single-loop cross-species 4D fold seamlessly morphing Kleinian, KIFS, and refractive gyroidal soap-film membranes (`Chimera Hybrid Blend` slider). |

---

## Novel 1/1 Uniqueness

What separates XENOPHORA from standard WebGL demos, static Shadertoy fractals, and 2D A-Life canvases:

1. **PDE-Sculpted 4D Non-Euclidean Geometry:** Most raymarched fractals are stateless functions $f(\mathbf{p}, t)$ with zero memory; most reaction-diffusion / A-Life simulations live on flat 2D planes. XENOPHORA runs an **unconditionally stable Lie–Trotter operator-split Complex Ginzburg–Landau PDE** on `256×256` `RGBA16F` ping-pong FBOs and maps its living spiral waves & topological defects onto the **conformal orbit-trap manifold** of 4D Clifford-rotated SDFs—physically displacing 3D relief, modulating optical thin-film thickness, and lighting bioluminescent capillaries across infinite fractal scales.
2. **Exact `1×1` GPU Ray-Picked Intrinsic Manifold Perturbation:** Clicking anywhere on the 3D sculpture executes a dedicated `1×1` GPU sphere-trace (`buildRaypickFS`) against the live 4D manifold, extracts the exact folded `(trapU, trapV)` address, and **injects an alternating $\pm 1$ topological spiral vortex directly into that hidden non-Euclidean fold**—rippling causally across all self-similar symmetries while ringing a modal piezo-glass chord.
3. **Physical Wave Optics (Not Plastic Phong / HSV Rainbows):** Combines **5-band Airy / Fabry–Pérot thin-film interference** ($\text{OPD} = 2 n_f d \cos\theta_t + \lambda/2$), **dual-octave stochastic diffraction-grating micro-sparkles** ($m\lambda = d(\sin\theta_i + \sin\theta_o)$), **GGX microfacet + clearcoat**, **true secondary raymarched reflection & RGB chromatic-dispersion refraction**, analytical Laplacian curvature, and forward subsurface scattering.
4. **Live Interactive Mode $\leftrightarrow$ Progressive 256-SPP Cinema Path Refinement:** Orbit freely at `160–192 FPS`, double-click any depth for **GPU-picked optical rack autofocus**, then press **`Space`** to freeze time and converge up to **256 R2/IGN quasirandom samples** with physical thin-lens bokeh, soft area shadows, and subpixel anti-aliasing.
5. **Tomographic 4D MRI Slicing:** Drag **`Tomographic 4D Slice`** inside **`ALCH`** (`I`) to bisect any solid 4D manifold with a glowing holographic cross-section membrane revealing its recursive interior cavities.
6. **Windows ANGLE / D3D11 Engineering:** Per-regime lazy `#define REGIME_ID` specialization, Inigo Quilez `ZERO` loop anti-unroll barriers, bounding-volume early exits, surface-proximity PDE gating (`~96%` texture-fetch reduction), and automatic software-GPU detection prevent HLSL compile hangs and GPU TDR resets.

---

## Artificial Life (A-Life), Morphogenesis & AI

> Read the full essay in [**`docs/ALIFE_AND_AI.md`**](./docs/ALIFE_AND_AI.md).

- **Dissipative A-Life Substrate:** The live GPU CGLE field ($\partial_t A = A - (1 + i c_2)|A|^2 A + D(1 + i c_1)\nabla^2 A$) is an excitable continuous medium far from equilibrium—spontaneously forming self-sustaining rotating spiral waves, chimera domains, conserved $\pm 1$ topological vortex defects, and slow structural morphogenesis memory (`pde.b`).
- **Embodied Causal Interactivity:** Every user click injects conserved topological charge into the GPU's `RGBA16F` memory; defects collide, annihilate, and permanently alter the organism's 3D ribbed anatomy and iridescent skin.
- **Post-Diffusion Generative AI Co-Creation:** Unlike black-box diffusion models that output frozen statistical pixel approximations from gigabytes of weights, XENOPHORA was co-created by translating human visual curation into **first-principles analytical mathematics, differential geometry, and nonlinear physics**—yielding an open-ended, zero-dependency living system capable of infinite 1/1 mutations (`M` · `GENESIS MUTATE`) at infinite analytical zoom.

---

## Visual Reference Images Used

XENOPHORA's six specimens synthesize the sculptural, optical, and surreal DNA across **15 curated reference images** archived in [`assets/references/`](./assets/references/) (used strictly as artistic/mathematical design references—**never** as textures or neural training data). See the complete equation-by-equation mapping in [**`docs/INSPIRATION_AND_SYNTHESIS.md`**](./docs/INSPIRATION_AND_SYNTHESIS.md).

| 01 · Iris Cavern | 02 · Split Carapace | 03 · Soap-Film Foam | 04 · Dark Seraph | 05 · Spectral Grid |
| :---: | :---: | :---: | :---: | :---: |
| <img src="./assets/references/ref-01.webp" width="140" alt="Ref 01" /> | <img src="./assets/references/ref-02.png" width="140" alt="Ref 02" /> | <img src="./assets/references/ref-03.jpg" width="140" alt="Ref 03" /> | <img src="./assets/references/ref-04.jpg" width="140" alt="Ref 04" /> | <img src="./assets/references/ref-05.jpg" width="140" alt="Ref 05" /> |

| 06 · Beaded Flow | 07 · Mercury Gold | 08 · Oil Interference | 09 · Ribbed Coral | 10 · Piezo Organ |
| :---: | :---: | :---: | :---: | :---: |
| <img src="./assets/references/ref-06.jpg" width="140" alt="Ref 06" /> | <img src="./assets/references/ref-07.jpg" width="140" alt="Ref 07" /> | <img src="./assets/references/ref-08.jpg" width="140" alt="Ref 08" /> | <img src="./assets/references/ref-09.webp" width="140" alt="Ref 09" /> | <img src="./assets/references/ref-10.webp" width="140" alt="Ref 10" /> |

| 11 · Glitch Strata | 12 · Carved Cube | 13 · Ceramic Lattice | 14 · Fractal City | 15 · Diffraction Cliff |
| :---: | :---: | :---: | :---: | :---: |
| <img src="./assets/references/ref-11.jpg" width="140" alt="Ref 11" /> | <img src="./assets/references/ref-12.jpg" width="140" alt="Ref 12" /> | <img src="./assets/references/ref-13.jpg" width="140" alt="Ref 13" /> | <img src="./assets/references/ref-14.webp" width="140" alt="Ref 14" /> | <img src="./assets/references/ref-15.jpg" width="140" alt="Ref 15" /> |

---

## Multi-Pass GPU Architecture

> Deep dive with full FBO memory table and Web Audio modal graph in [**`docs/ARCHITECTURE.md`**](./docs/ARCHITECTURE.md).

```mermaid
flowchart LR
  PDE["256x256 RGBA16F<br/>Operator-Split CGLE PDE"] -->|"uPdeTex (trapUV)"| RM["Per-Regime 4D Raymarch<br/>+ Volumetrics + Bounce"]
  PICK["1x1 GPU Ray-Pick<br/>(Click / Dbl-Click)"] -->|"(trapU, trapV) Vortex"| PDE
  PICK -->|"Exact Depth"| CAM["Thin-Lens Rack Focus"]
  RM --> ACC["Ping-Pong HDR Accum<br/>(TAA / 256-SPP Refine)"]
  ACC --> BLOOM["4-Mip Dual-Filter<br/>Kawase HDR Bloom"]
  ACC --> COMP["Radial CA + ACES<br/>+ Filmic Dither"]
  BLOOM --> COMP
  COMP --> OUT["WebGL2 Canvas"]
  PICK -.->|"Curvature & Scale"| AUD["Web Audio Modal<br/>Piezo-Glass Synth"]
```

---

## Languages, Technologies, Packages & Tools

| Layer | Technology / Language | Purpose |
| :--- | :--- | :--- |
| **GPU Shaders** | **GLSL ES 3.00** (`src/shaders/*.glsl.js`) | 4D Clifford SDFs, CGLE PDE solver, Airy thin-film optics, diffraction grating, raymarcher, Kawase bloom, ACES grading |
| **3D Engine & App** | **JavaScript (Native ES Modules)** | Bare-metal WebGL2 multi-pass FBO orchestrator (`14` FBOs), damped inertial camera, presets, genetic mutator, HUD |
| **Audio Synthesis** | **Web Audio API** (`src/engine/audio.js`) | Zero-sample modal glass-bell partials (`1.0, 2.756, 5.404`), stereo shimmer feedback delay, 4D-coupled sub-drone |
| **Interface** | **HTML5 + CSS3** (`index.html`, `styles.css`) | Minimal obsidian-glass laboratory HUD, live `108×108` PDE chimera monitor, collapsible Manifold Alchemy drawer |
| **Local Server & Tests** | **Node.js (Built-in `node:http`, `node:test`, `node:assert`)** | Zero-dependency static dev server (`server.mjs`) & automated shader/math/HTTP security test suite |
| **CI / CD & Hosting** | **GitHub Actions + GitHub Pages** | Automated test execution on push/PR (`.github/workflows/ci.yml`) + automatic live WebGL2 deployment (`.github/workflows/pages.yml`) |
| **Runtime Packages (`dependencies`)** | **None (`0`)** | 100% self-contained — no `npm install`, no bundler, no CDN scripts, no telemetry |

---

## Quick Start & Controls

### Live Online (Instant)
Open **[https://0thernes.github.io/xenophora/](https://0thernes.github.io/xenophora/)** in Chrome, Edge, Firefox, or Safari with WebGL2 enabled.

### Run Locally
Requires **Node.js 18+** (zero `npm install` required):

```bash
git clone https://github.com/0thernes/xenophora.git
cd xenophora
npm start
# -> Open http://127.0.0.1:4173
```

### Interactive Controls & Shortcuts

| Action | Control |
| :--- | :--- |
| Orbit / Pan / Logarithmic Zoom | **Left-Drag** / **Right-Drag** / **Scroll Wheel** |
| Inject 3D Spiral CGLE Singularity | **Click** or **`Shift + Drag`** directly on the 3D manifold (or click the top-right `CGLE` box) |
| Optical Rack Autofocus (DOF) | **Double-Click** any point on the 3D sculpture |
| Switch 4D Specimens (`I`–`VI`) | **`1`** · **`2`** · **`3`** · **`4`** · **`5`** · **`6`** |
| Toggle 256-SPP Cinema Path Refine | **`Space`** (`REFINE`) |
| Discover 1/1 Genetic Mutation | **`M`** (`MUTATE`) |
| Open Manifold Alchemy Drawer (4D θ, Tomographic Slice, CGLE, Optics) | **`I`** (`ALCH`) |
| Toggle Gallery Drift / Piezo Audio / PNG Export / Pure Canvas / Reset Camera | **`C`** / **`A`** / **`P`** / **`H`** / **`R`** |

---

## Automated Tests & CI

Run the complete zero-dependency test suite locally via Node's native test runner:

```bash
npm test
```

- [`tests/shaders.test.mjs`](./tests/shaders.test.mjs) — Validates `#version 300 es`, balanced delimiters, operator-split Stuart–Landau stability, ESSL struct-ternary regression guard, `ZERO` ANGLE loop barriers, physical optical routines, and `1×1` ray-pick shaders across all 6 regimes.
- [`tests/presets-and-math.test.mjs`](./tests/presets-and-math.test.mjs) — Verifies all 6 specimen presets, `OrbitalCamera` strict basis orthonormality and clamping bounds, and 50-iteration `mutateState()` numerical stability.
- [`tests/server.test.mjs`](./tests/server.test.mjs) — Verifies HTTP `200` static serving, MIME types, `404` handling, and path-traversal rejection on `server.mjs`.

---

## Academic Papers & Foundational Lineage

XENOPHORA implements mathematical formulations from **19 peer-reviewed papers and monographs** spanning Aranson & Kramer (*Rev. Mod. Phys.* 2002), Kuramoto & Battogtokh (2002), Abrams & Strogatz (*PRL* 2004), Alan Turing (1952), Alan Schoen (1970), Mumford, Series & Wright (*Indra's Pearls* 2002), John Hart (1996), Belcour & Barla (*SIGGRAPH* 2017), Jos Stam (*SIGGRAPH* 1999), Walter et al. (2007), Jorge Jimenez (*SIGGRAPH* 2014), Martin Roberts (2018), and Rossing & Fletcher (1998).

See full citations and per-module mappings in [**`docs/PAPERS.md`**](./docs/PAPERS.md).

---

## Glossary & Documentation Index

- [**Master Documentation Index (`docs/INDEX.md`)**](./docs/INDEX.md)
- [**Complete Table of Contents (`docs/TABLE_OF_CONTENTS.md`)**](./docs/TABLE_OF_CONTENTS.md)
- [**A–Z Technical Glossary (`docs/GLOSSARY.md`)**](./docs/GLOSSARY.md)
- [**GPU Pipeline & Systems Architecture (`docs/ARCHITECTURE.md`)**](./docs/ARCHITECTURE.md)
- [**Artificial Life, Morphogenesis & AI (`docs/ALIFE_AND_AI.md`)**](./docs/ALIFE_AND_AI.md)
- [**Foundational Academic Papers (`docs/PAPERS.md`)**](./docs/PAPERS.md)
- [**15-Image Reference Provenance & Synthesis (`docs/INSPIRATION_AND_SYNTHESIS.md`)**](./docs/INSPIRATION_AND_SYNTHESIS.md)

---

## Issues, Contributing, Security & License

- **Issues & Proposals:** Use the structured templates in [`.github/ISSUE_TEMPLATE/`](./.github/ISSUE_TEMPLATE/) (Bug Report, Feature Request, New 4D Specimen Proposal) or browse [GitHub Issues](https://github.com/0thernes/xenophora/issues).
- **Contributing:** See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
- **Security:** See [`SECURITY.md`](./SECURITY.md).
- **Citation:** See [`CITATION.cff`](./CITATION.cff) (or click *Cite this repository* on GitHub).
- **Changelog:** See [`CHANGELOG.md`](./CHANGELOG.md).
- **License:** Released under the [**MIT License**](./LICENSE).
