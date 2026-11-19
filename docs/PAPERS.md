# Foundational Papers, Monographs & Technical Lineage

XENOPHORA is grounded in peer-reviewed nonlinear physics, differential geometry, computer graphics optics, and Artificial Life literature. Every subsystem maps directly to primary mathematical sources listed below.

---

## 1. Complex Ginzburg–Landau PDE, Chimera States & Morphogenesis (A-Life)

1. **Aranson, I. S., & Kramer, L. (2002).** *The world of the complex Ginzburg–Landau equation.* Reviews of Modern Physics, 74(1), 99–143.  
   - **Role in XENOPHORA:** Defines the Benjamin–Feir instability boundary ($1 + c_1 c_2 < 0$), defect-mediated turbulence, and spiral-wave dispersion dynamics implemented in `src/shaders/pde.glsl.js`.
2. **Kuramoto, Y., & Battogtokh, D. (2002).** *Coexistence of Coherence and Incoherence in Nonlocally Coupled Phase Oscillators.* Nonlinear Phenomena in Complex Systems, 5(4), 380–385.  
   - **Role in XENOPHORA:** Foundational discovery of **chimera states**—the spatiotemporal coexistence of phase-locked harmonic zones and chaotic defect cores inspiring the live `CGLE CHIMERA` surface field.
3. **Abrams, D. M., & Strogatz, S. H. (2004).** *Chimera States for Coupled Oscillators.* Physical Review Letters, 93(17), 174102.  
   - **Role in XENOPHORA:** Formalizes chimera dynamics and spiral-wave phase transitions in excitable media.
4. **Turing, A. M. (1952).** *The Chemical Basis of Morphogenesis.* Philosophical Transactions of the Royal Society of London B, 237(641), 37–72.  
   - **Role in XENOPHORA:** Conceptual foundation for coupling continuous reaction-diffusion/oscillatory fields directly to anatomical 3D surface relief (`uRelief` morphogenesis displacement).
5. **Cross, M. C., & Hohenberg, P. C. (1993).** *Pattern formation outside of equilibrium.* Reviews of Modern Physics, 65(3), 851–1112.  
   - **Role in XENOPHORA:** Guides the coupled slow-memory morphogenesis ridge channel (`pde.b`) paired with fast complex order-parameter evolution.

---

## 2. 4D Non-Euclidean Geometry, Kleinian Groups, KIFS & Minimal Surfaces

6. **Hart, J. C. (1996).** *Sphere tracing: A geometric method for the antialiased ray tracing of implicit surfaces.* The Visual Computer, 12(10), 527–545.  
   - **Role in XENOPHORA:** Lipschitz-1 sphere tracing framework powering all 6 SDF regimes and the `1×1` GPU ray-picker (`src/shaders/raymarch.glsl.js`).
7. **Mumford, D., Series, C., & Wright, D. (2002).** *Indra's Pearls: The Vision of Felix Klein.* Cambridge University Press.  
   - **Role in XENOPHORA:** Mathematical foundation of Schottky and Kleinian Möbius sphere-inversion limit sets and nested bead packings (`mapAnemone` in Regime I).
8. **Leys, J., & Knighty (2010–2016).** *Pseudo-Kleinian and Kaleidoscopic Iterated Function System (KIFS) Distance Estimators.* FractalForums / Mathematical Imagery Archive.  
   - **Role in XENOPHORA:** Basis for the Pseudo-Kleinian box-sphere inversion fold (Regime I), recursive Menger-KIFS architectural folds (Regime II), and golden-ratio icosahedral symmetry folds (Regime IV).
9. **Schoen, A. H. (1970).** *Infinite periodic minimal surfaces without self-intersections.* NASA Technical Note TN D-5541.  
   - **Role in XENOPHORA:** Discovery of the **Gyroid** triply-periodic minimal surface, generalized here into a 3-octave warped refractive soap-film sponge (`mapFoam`, Regime III) and organic coral ribbing (`mapRadiolarian`, Regime IV).
10. **Hopf, H. (1931).** *Über die Abbildungen der dreidimensionalen Sphäre auf die Kugelfläche.* Mathematische Annalen, 104, 637–665.  
    - **Role in XENOPHORA:** Inspiration for the $S^3 \to \mathbb{R}^3$ stereographic Clifford lift (`liftTo4D`) and the radiant filament iris architecture of Regime I.

---

## 3. Physical Spectral Optics, Diffraction & Microfacet Shading

11. **Belcour, L., & Barla, P. (2017).** *A Practical Extension to Microfacet Theory for the Modeling of Varying Iridescence.* ACM Transactions on Graphics (SIGGRAPH 2017), 36(4), Article 65.  
    - **Role in XENOPHORA:** Physical thin-film interference formulation linking optical path difference ($\text{OPD} = 2 n_f d \cos\theta_t$) to spectral reflectance (`thinFilmSpectral()` in `src/shaders/common.glsl.js`).
12. **Stam, J. (1999).** *Diffraction Shaders.* Proceedings of SIGGRAPH 1999, 101–110.  
    - **Role in XENOPHORA:** Physical grating-dispersion theory underlying the stochastic micro-facet rainbow diffraction sparkles (`diffractionSparkle()`).
13. **Walter, B., Marschner, S. R., Li, H., & Torrance, K. E. (2007).** *Microfacet Models for Refraction through Rough Surfaces.* Eurographics Symposium on Rendering (EGSR 2007).  
    - **Role in XENOPHORA:** GGX (Trowbridge–Reitz) specular microfacet NDF and Smith geometric shadowing-masking (`D_GGX`, `G_Smith`).
14. **Schlick, C. (1994).** *An Inexpensive BRDF Model for Physically-Based Rendering.* Computer Graphics Forum, 13(3), 233–246.  
    - **Role in XENOPHORA:** Fresnel reflectance approximation modulated by spectral thin-film phase shift (`F_Schlick`).

---

## 4. Real-Time Sampling, Post-Processing & Procedural Acoustics

15. **Roberts, M. (2018).** *The Unreasonable Effectiveness of Quasirandom Sequences.* Extreme Learning Technical Note.  
    - **Role in XENOPHORA:** Generalized golden-ratio plastic-constant 2D R2 sequence (`r2Seq()`) driving 256-SPP progressive path refinement and thin-lens bokeh sampling.
16. **Jimenez, J. (2014).** *Next Generation Post Processing in Call of Duty: Advanced Warfare.* ACM SIGGRAPH 2014 Advances in Real-Time Rendering Course.  
    - **Role in XENOPHORA:** Interleaved Gradient Noise (`ign()`) and dual-filter multi-mip HDR bloom pyramid (`src/shaders/post.glsl.js`).
17. **Narkowicz, K. (2016).** *ACES Filmic Tone Mapping Curve.* Technical Note.  
    - **Role in XENOPHORA:** Filmic HDR-to-sRGB compression (`acesToneMap()`).
18. **Quilez, I. (2010–2024).** *Signed Distance Functions, Smooth Minimums & WebGL Anti-Unroll Techniques (`ZERO`).* iquilezles.org Technical Articles.  
    - **Role in XENOPHORA:** Polynomial smooth CSG (`smin`/`smax`), tetrahedron normal stencil, and the `int zero = int(min(uFrame, 0.0))` loop barrier preventing Windows ANGLE HLSL compile-time unrolling blowups.
19. **Rossing, T. D., & Fletcher, N. H. (1998).** *The Physics of Musical Instruments (2nd ed.).* Springer.  
    - **Role in XENOPHORA:** Circular plate & glass-resonator inharmonic partial ratios (`1.0, 2.756, 5.404`) powering the Web Audio piezo-optical modal synthesizer (`src/engine/audio.js`).
