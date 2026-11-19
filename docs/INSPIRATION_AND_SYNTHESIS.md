# Visual Reference Provenance & Mathematical Synthesis

XENOPHORA was designed from a curated 15-image visual moodboard exploring extreme bio-crystalline architecture, optical wave interference, differential ribbing, diffraction-grating monoliths, and bilateral Rorschach symmetry.

**Crucial distinction:** None of the 15 images are used as textures, skyboxes, sprites, or neural training data inside the engine. Every visual motif was **deconstructed into pure analytical mathematics, PDEs, and spectral optics** in GLSL ES 3.00.

---

## Complete 15-Image Reference Catalog (`assets/references/`)

| # | Reference Image | Dominant Visual Phenomenon | Synthesized Into XENOPHORA |
| :-: | :-: | :--- | :--- |
| **01** | <img src="../assets/references/ref-01.webp" width="120" alt="Ref 01" /> | Radiant anemone/iris filament heart inside a cavern, warm-amber vs electric-cyan mist, hovering spheres, gossamer threads | **Regime I (`ANEMONE ABYSS`)** — 22-petal rounded Hopf filament iris, dark obsidian pupil, dual-temperature amber/cyan volumetric scatter, vertical gossamer laser beams |
| **02** | <img src="../assets/references/ref-02.png" width="120" alt="Ref 02" /> | Split dark fibrous outer carapace revealing intertwined mathematical knots & filaments | **Regime I (`ANEMONE ABYSS`)** — Split Kleinian-gyroidal bio-carapace dome framing an exposed interior topological cavity |
| **03** | <img src="../assets/references/ref-03.jpg" width="120" alt="Ref 03" /> | Refractive iridescent glass-gel soap-film sponge spanning pitch-black voids with floating micro-droplets | **Regime III (`CHIMERA FOAM`)** — 3-octave warped Gyroid minimal surface, RGB chromatic-dispersion refraction (`η = 1.33/1.43/1.56`), oil-slick Fabry–Pérot iridescence, Voronoi floating droplets |
| **04** | <img src="../assets/references/ref-04.jpg" width="120" alt="Ref 04" /> | Symmetrical Beksiński/Giger dark fibrous monolith towering over a piercing crimson singularity & radiating spiderweb | **Regime V (`DARK SERAPH`)** — Strict bilateral mirror symmetry (`abs(p.x)`), curl-warped fibrous wings, piercing crimson core, 24-spoke geodesic spiderweb, pale bone-ivory zenith key |
| **05** | <img src="../assets/references/ref-05.jpg" width="120" alt="Ref 05" /> | Hyper-subdivided spectral mosaic grid, recursive frames, optical chromatic strips | **HUD & Optics** — Multi-scale recursive spatial subdivision sensibility & subtle peripheral radial chromatic lens dispersion (`post.glsl.js`) |
| **06** | <img src="../assets/references/ref-06.jpg" width="120" alt="Ref 06" /> | Dense iridescent beaded flow-fields transitioning into striped curvilinear ribbons on pitch black | **Regime I & IV + CGLE PDE** — Concentric glossy beaded rings & sinuous phase-crest striations flowing continuously across obsidian voids |
| **07** | <img src="../assets/references/ref-07.jpg" width="120" alt="Ref 07" /> | Bilateral chrome/obsidian liquid-mercury fractal Rorschach with molten antique-gold hairline veins | **Regime V (`DARK SERAPH`)** — High-metallic (`0.88`) low-roughness liquid-mercury ridges with molten antique-gold veins pooled inside negative-curvature crevices |
| **08** | <img src="../assets/references/ref-08.jpg" width="120" alt="Ref 08" /> | Psychedelic iridescent fluid-marbled bilateral interference patterns & fine curvilinear folds | **Thin-Film Spectral Physics (`common.glsl.js`)** — Live CGLE-modulated 5-band Airy thin-film phase shift producing fluid oil-slick interference bands |
| **09** | <img src="../assets/references/ref-09.webp" width="120" alt="Ref 09" /> | Ultra-detailed 3D macro sculpture of grooved, ribbed ceramic/coral coils & glossy satin spheres with shallow DOF | **Regime IV (`RADIOLARIAN CORAL`)** — 60-fold icosahedral differential-growth ribbed porcelain shell (`sin(coilPhase * 19.0)`), creamy SSS, nestled satin ceramic spheres, warm-gold vs glacial-blue macro studio light & thin-lens bokeh |
| **10** | <img src="../assets/references/ref-10.webp" width="120" alt="Ref 10" /> | Alien biological-acoustic organ on an illuminated crystal grid pedestal with concentric beaded resonators & magenta bioluminescent cavities | **Regime I (`ANEMONE ABYSS`)** — Embedded 26-bead primary & 18-bead tilted magenta-alcove piezo-resonator rings hovering above a dark reflective crystal-grid plinth |
| **11** | <img src="../assets/references/ref-11.jpg" width="120" alt="Ref 11" /> | High-contrast monochrome cellular-automaton / binary data-strata spectrogram | **Regime V (`DARK SERAPH`)** — Procedural bitwise `spectralStrata()` cellular-automaton engravings etched along the dark architectural monolith buttresses |
| **12** | <img src="../assets/references/ref-12.jpg" width="120" alt="Ref 12" /> | 3D isometric labyrinthine cube of carved neon-rimmed metallic calligraphy channels | **Regime II (`OPALESCENT KIFS`)** — Recessed glowing cyan/gold calligraphic channels carved into Menger-KIFS architectural blocks (`channelTrap` grooves) |
| **13** | <img src="../assets/references/ref-13.jpg" width="120" alt="Ref 13" /> | Symmetrical cerulean & ochre spheres nested in stippled Apollonian lattice patterns on pitch black | **Regime IV (`RADIOLARIAN CORAL`)** — Curated cerulean, ochre, coral-rose, and pearl-titanium ceramic spheres nestled inside folded icosahedral cavities |
| **14** | <img src="../assets/references/ref-14.webp" width="120" alt="Ref 14" /> | Macro golden-obsidian recursive fractal megacity with glowing plasma portal vortices & shallow DOF | **Regime II (`OPALESCENT KIFS`)** — Stepped recursive Menger-Labyrinth skyline with warm solar zenith rim lighting and glowing concentric plasma portal rings on lower terraces |
| **15** | <img src="../assets/references/ref-15.jpg" width="120" alt="Ref 15" /> | Monumental dark crystal Mandelbox cathedral cliff covered in prismatic diffraction glitter with an aurora plasma cascade pouring over an alien horizon | **Regime II (`OPALESCENT KIFS`) & Global Optics** — Stochastic dual-octave `diffractionSparkle()` rainbow crystal glints across dark titanium-obsidian cliff faces, volumetric vertical aurora cascade, and dark undulating alien horizon plain |

---

## Resulting Live 3D WebGL2 Specimens (`assets/showcase/`)

All six renders below were captured directly from the live `160–192 FPS` browser engine with zero external textures:

| I · Anemone Abyss | II · Opalescent KIFS | III · Chimera Foam |
| :---: | :---: | :---: |
| <img src="../assets/showcase/01-anemone-abyss.png" width="320" alt="Anemone Abyss" /> | <img src="../assets/showcase/02-opalescent-kifs.png" width="320" alt="Opalescent KIFS" /> | <img src="../assets/showcase/03-chimera-foam.png" width="320" alt="Chimera Foam" /> |

| IV · Radiolarian Coral | V · Dark Seraph | VI · Xeno-Hybrid |
| :---: | :---: | :---: |
| <img src="../assets/showcase/04-radiolarian-coral.png" width="320" alt="Radiolarian Coral" /> | <img src="../assets/showcase/05-dark-seraph.png" width="320" alt="Dark Seraph" /> | <img src="../assets/showcase/06-xeno-hybrid.png" width="320" alt="Xeno-Hybrid" /> |
