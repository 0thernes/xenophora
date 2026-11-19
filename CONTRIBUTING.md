# Contributing to XENOPHORA

Contributions—new 4D mathematical regimes, physical optical shading models, PDE integrators, acoustic synthesis instruments, performance improvements, and documentation refinements—are warmly welcome.

---

## Core Design Principles

1. **Zero External Runtime Dependencies:** Keep XENOPHORA 100% bare-metal WebGL2 / GLSL ES 3.00 / Web Audio / vanilla ES Modules with zero build step.
2. **Physics & Mathematics First:** Visual effects should emerge from real differential geometry, PDE dynamics, or physical optics rather than static baked textures.
3. **Windows ANGLE / TDR Safety Mandatory:**
   - Never use ternary `?:` on GLSL `struct` types (forbidden in ESSL / WebGL2).
   - Guard heavy SDF loops with `int zero = int(min(uFrame, 0.0));` to prevent HLSL unrolling bloat.
   - Gate `samplePDE()` lookups inside `mapScene()` to surface proximity (`detailed && abs(d) < 0.06`).
   - Bound fractal folds inside cheap analytical envelopes so empty-space rays exit quickly.
   - Keep `PDE_STEP_FS` inside the von Neumann stability region (prefer operator splitting over raw explicit Euler).

---

## Local Development Workflow

```bash
git clone https://github.com/0thernes/xenophora.git
cd xenophora
npm test          # Run zero-dependency shader, math, and server test suite
npm start         # Launch live local server at http://127.0.0.1:4173
```

---

## Proposing a New 4D Specimen Regime

1. Use the **4D Specimen Proposal** issue template (`.github/ISSUE_TEMPLATE/specimen_proposal.md`).
2. Ensure your SDF is conservatively Lipschitz-1 bounded (`stepScale` safe) and frames cleanly from its default hero camera in `src/engine/presets.js`.
3. Verify zero console errors and zero WebGL context loss across both hardware GPUs and software rasterizers.
4. Run `npm test` and confirm all shader invariant tests pass before opening a pull request.
