# XENOPHORA — Master Table of Contents

Complete hierarchical map of the entire XENOPHORA codebase, documentation, mathematical subsystems, tests, visual assets, and deployment workflows.

---

## 1. Overview & Live Showcase
- 1.1 [Project Manifesto & Live Demo](../README.md#xenophora)
- 1.2 [Six Live-Rendered 4D Specimens](../README.md#live-specimen-showcase)
  - 1.2.1 `I · ANEMONE ABYSS` ([render](../assets/showcase/01-anemone-abyss.png))
  - 1.2.2 `II · OPALESCENT KIFS` ([render](../assets/showcase/02-opalescent-kifs.png))
  - 1.2.3 `III · CHIMERA FOAM` ([render](../assets/showcase/03-chimera-foam.png))
  - 1.2.4 `IV · RADIOLARIAN CORAL` ([render](../assets/showcase/04-radiolarian-coral.png))
  - 1.2.5 `V · DARK SERAPH` ([render](../assets/showcase/05-dark-seraph.png))
  - 1.2.6 `VI · XENO-HYBRID` ([render](../assets/showcase/06-xeno-hybrid.png))
- 1.3 [What Makes XENOPHORA 1/1 Novel](../README.md#novel-11-uniqueness)
- 1.4 [Quick Start & Controls](../README.md#quick-start--controls)

## 2. Artificial Life (A-Life), Dynamical Systems & AI
- 2.1 [Full Essay: A-Life & Post-Diffusion Generative Media](./ALIFE_AND_AI.md)
- 2.2 [Dissipative Morphogenesis & Complex Ginzburg–Landau Chimera States](./ALIFE_AND_AI.md#1-dissipative-morphogenesis--cgle-chimera-states)
- 2.3 [Non-Euclidean Substrate Coupling (PDE-Sculpted 4D Geometry)](./ALIFE_AND_AI.md#2-coupled-non-euclidean-morphogenesis)
- 2.4 [Interactive Perturbation & Embodied Feedback Loops](./ALIFE_AND_AI.md#3-interactive-perturbation--embodied-autopoiesis)
- 2.5 [Why XENOPHORA Is Not Conventional Diffusion AI](./ALIFE_AND_AI.md#4-contrast-with-neural-diffusion-and-conventional-ai)

## 3. Mathematical & GPU Architecture
- 3.1 [Full Technical Architecture](./ARCHITECTURE.md)
- 3.2 [Multi-Pass WebGL2 Framebuffer Pipeline](./ARCHITECTURE.md#multi-pass-webgl2-fbo-pipeline)
  - 3.2.1 Pass 1: Operator-Split CGLE PDE (`256×256 RGBA16F` Ping-Pong)
  - 3.2.2 Pass 2: Per-Regime Stochastic 4D Raymarch + Volumetric Integration
  - 3.2.3 Pass 3: Hybrid TAA & Progressive 256-SPP Path Accumulation
  - 3.2.4 Pass 4: 4-Level Dual-Filter Kawase HDR Spectral Bloom
  - 3.2.5 Pass 5: Radial Chromatic Aberration + ACES Filmic Composite
  - 3.2.6 On-Demand Pass: `1×1` Exact GPU Ray-Pick -> Intrinsic `trapUV` & Depth
- 3.3 [ANGLE / D3D11 Compiler & TDR Engineering Defenses](./ARCHITECTURE.md#angle-hlsl-compiler--gpu-tdr-defenses)
- 3.4 [Web Audio Modal Piezo-Optical Synthesis Graph](./ARCHITECTURE.md#web-audio-modal-synthesis-graph)

## 4. Visual Reference Provenance (15 Moodboard Images)
- 4.1 [Complete 15-Image Reference Synthesis Catalog](./INSPIRATION_AND_SYNTHESIS.md)
- 4.2 [Reference Image Directory (`assets/references/ref-01` .. `ref-15`)](../assets/references/)

## 5. Academic Lineage & Terminology
- 5.1 [Academic Papers, Books & Foundational Equations](./PAPERS.md)
- 5.2 [A–Z Technical Glossary](./GLOSSARY.md)

## 6. Languages, Tools & Zero-Dependency Stack
- 6.1 [Stack Breakdown](../README.md#languages-technologies-packages--tools)
- 6.2 [Package Manifest (`package.json`)](../package.json)

## 7. Verification, Tests & CI/CD
- 7.1 [Shader Static & Invariant Tests (`tests/shaders.test.mjs`)](../tests/shaders.test.mjs)
- 7.2 [Math, Camera & Mutation Stability Tests (`tests/presets-and-math.test.mjs`)](../tests/presets-and-math.test.mjs)
- 7.3 [HTTP Static Server & Path-Traversal Tests (`tests/server.test.mjs`)](../tests/server.test.mjs)
- 7.4 [GitHub Actions CI Workflow (`.github/workflows/ci.yml`)](../.github/workflows/ci.yml)
- 7.5 [GitHub Pages Live Deployment (`.github/workflows/pages.yml`)](../.github/workflows/pages.yml)

## 8. Community, Governance & Legal
- 8.1 [Documentation Index](./INDEX.md)
- 8.2 [Contributing Guidelines](../CONTRIBUTING.md)
- 8.3 [Code of Conduct](../CODE_OF_CONDUCT.md)
- 8.4 [Security Policy](../SECURITY.md)
- 8.5 [Changelog](../CHANGELOG.md)
- 8.6 [Citation Metadata (`CITATION.cff`)](../CITATION.cff)
- 8.7 [MIT License](../LICENSE)
