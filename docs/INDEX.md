# XENOPHORA — Documentation Index

Master navigation index for every document, shader pipeline, test suite, visual asset, and GitHub governance file in the `0thernes/xenophora` repository.

---

## Live Interactive Experience

- **Live Real-Time WebGL2 Deployment (GitHub Pages):** https://0thernes.github.io/xenophora/
- **Repository:** https://github.com/0thernes/xenophora

---

## Core Documentation (`docs/`)

| Document | Scope |
| :--- | :--- |
| [README.md](../README.md) | Project overview, live 6-specimen gallery, uniqueness breakdown, A-Life/AI thesis, tech stack, controls, quick start |
| [TABLE_OF_CONTENTS.md](./TABLE_OF_CONTENTS.md) | Master hierarchical Table of Contents across all docs, source modules, shaders, tests, and assets |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Multi-pass WebGL2 FBO graph, shader compilation model, ANGLE/TDR defenses, memory budget, and Web Audio modal graph |
| [ALIFE_AND_AI.md](./ALIFE_AND_AI.md) | Artificial Life (A-Life), dissipative morphogenesis, chimera states, excitable media, and contrast with neural/diffusion AI |
| [PAPERS.md](./PAPERS.md) | Foundational academic papers, physics equations, and algorithms implemented in XENOPHORA |
| [GLOSSARY.md](./GLOSSARY.md) | A–Z technical glossary of differential geometry, nonlinear PDEs, physical optics, raymarching, and synthesis terminology |
| [INSPIRATION_AND_SYNTHESIS.md](./INSPIRATION_AND_SYNTHESIS.md) | Complete catalog of the 15 moodboard reference images (`assets/references/`) and how their motifs were mathematically synthesized |

---

## Source Code Map (`src/`)

| File | Language | Role |
| :--- | :--- | :--- |
| [index.html](../index.html) | HTML5 | Full-bleed WebGL2 canvas, CGLE live preview card, specimen dock, and Manifold Alchemy drawer |
| [styles.css](../styles.css) | CSS3 | Obsidian-glass HUD styling, typography, telemetry alignment, and injection reticle animation |
| [server.mjs](../server.mjs) | JavaScript (ESM) | Zero-dependency Node.js static server with path-traversal protection |
| [src/main.js](../src/main.js) | JavaScript (ESM) | Frame loop, pointer/touch/wheel input, GPU ray-pick PDE injection, rack autofocus, PNG export |
| [src/engine/renderer.js](../src/engine/renderer.js) | JavaScript (WebGL2) | Multi-pass FBO orchestrator: ping-pong `RGBA16F` CGLE PDE, HDR raymarch, TAA/256-SPP refine, 4-mip Kawase bloom, `1×1` ray-picker |
| [src/engine/camera.js](../src/engine/camera.js) | JavaScript (ESM) | Damped inertial orbital, pan, logarithmic zoom, gallery drift, and orthonormal camera basis |
| [src/engine/presets.js](../src/engine/presets.js) | JavaScript (ESM) | 6 curated specimen presets (`I`–`VI`) and taste-bounded genetic mutation engine (`mutateState`) |
| [src/engine/audio.js](../src/engine/audio.js) | JavaScript (Web Audio) | Procedural modal glass-bell synthesizer, stereo shimmer feedback delay, and sub-harmonic drone |
| [src/ui/hud.js](../src/ui/hud.js) | JavaScript (ESM) | Reactive telemetry readouts, keyboard shortcuts (`1`–`6`, `Space`, `M`, `I`, `C`, `A`, `P`, `H`, `R`), toast notifications |
| [src/shaders/common.glsl.js](../src/shaders/common.glsl.js) | GLSL ES 3.00 | 4D Clifford lift, icosahedral folding, gyroid, 5-band Airy thin-film interference, diffraction grating sparkle, GGX PBR, ACES |
| [src/shaders/pde.glsl.js](../src/shaders/pde.glsl.js) | GLSL ES 3.00 | Operator-split Complex Ginzburg–Landau (CGLE) + morphogenesis relief PDE & live HUD visualizer |
| [src/shaders/regimes.glsl.js](../src/shaders/regimes.glsl.js) | GLSL ES 3.00 | 6 bespoke Lipschitz-bounded 4D SDFs, tomographic 4D slice plane, and volumetric scattering fields |
| [src/shaders/raymarch.glsl.js](../src/shaders/raymarch.glsl.js) | GLSL ES 3.00 | Stochastic thin-lens raymarcher, secondary reflection & RGB chromatic-dispersion refraction, `1×1` GPU ray-picker |
| [src/shaders/post.glsl.js](../src/shaders/post.glsl.js) | GLSL ES 3.00 | Temporal accumulation resolve, 4-level dual-filter Kawase bloom, radial chromatic aberration, ACES tone mapping |

---

## Automated Tests (`tests/`)

| File | Coverage |
| :--- | :--- |
| [tests/shaders.test.mjs](../tests/shaders.test.mjs) | GLSL ES 3.00 syntax invariants, balanced delimiters, ESSL struct-ternary regression guard, `ZERO` loop barriers, proximity PDE gating across all 6 regimes |
| [tests/presets-and-math.test.mjs](../tests/presets-and-math.test.mjs) | Preset completeness, `OrbitalCamera` orthonormality & bounds, `mutateState()` numerical stability & taste bounds |
| [tests/server.test.mjs](../tests/server.test.mjs) | Static server HTTP 200 checks, MIME types, and directory-traversal (`403`) security tests |

---

## Repository Governance & Automation

- [LICENSE](../LICENSE) — MIT License
- [CITATION.cff](../CITATION.cff) — Academic citation metadata
- [CHANGELOG.md](../CHANGELOG.md) — Release history
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Development & shader contribution guide
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) — Community standards
- [SECURITY.md](../SECURITY.md) — Sandbox guarantees & vulnerability reporting
- [.github/workflows/ci.yml](../.github/workflows/ci.yml) — Automated Node.js test suite CI
- [.github/workflows/pages.yml](../.github/workflows/pages.yml) — Automated GitHub Pages real-time deployment
- [.github/ISSUE_TEMPLATE/](../.github/ISSUE_TEMPLATE/) — Bug Report, Feature Request, and 4D Specimen Proposal templates
- [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) — Pull request checklist
