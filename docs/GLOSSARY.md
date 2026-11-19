# XENOPHORA — Technical Glossary (A–Z)

Definitions of the mathematical, dynamical-systems, physical-optics, GPU-rendering, Artificial Life, and audio-synthesis concepts implemented inside XENOPHORA.

---

### A

- **ACES Filmic Tone Mapping (Narkowicz fit):** An S-curve high-dynamic-range compression operator mapping unbounded linear HDR radiances (`[0, ∞)`) into displayable `[0, 1]` sRGB while preserving saturated highlight roll-off without harsh clipping (`src/shaders/common.glsl.js`).
- **Airy / Fabry–Pérot Thin-Film Interference:** Wave-optical interference caused by light reflecting off the top and bottom boundaries of a microscopic dielectric coating of thickness $d$ and refractive index $n_f$. Constructive and destructive interference at optical path difference $\text{OPD} = 2 n_f d \cos\theta_t + \lambda/2$ produces iridescent structural color (soap bubbles, bismuth oxide, beetle carapaces) without pigments.
- **ANGLE (Almost Native Graphics Layer Engine):** Chromium's WebGL translation layer on Windows that compiles GLSL ES 3.00 shaders into Direct3D 11/12 HLSL. Large unrolled SDF raymarching loops can cause exponential HLSL compile-time blowup unless guarded with dynamic loop barriers (`ZERO` idiom).
- **Apollonian Sphere Inversion:** Reflection across a sphere of radius $R$ mapping $\mathbf{z} \mapsto \frac{R^2}{\|\mathbf{z}\|^2}\mathbf{z}$. Iterated with box-clamp reflections, it yields nested infinite sphere packings and vaulted fractal arches.
- **Artificial Life (A-Life):** The study and synthesis of lifelike emergent phenomena—self-organization, morphogenesis, excitable propagation, homeostasis, and responsiveness to perturbation—arising from local physical or computational rules rather than hand-keyframed animation.

### B

- **Benjamin–Feir (Modulational) Instability:** A regime of the Complex Ginzburg–Landau equation occurring when $1 + c_1 c_2 < 0$, in which uniform plane waves become unstable and spontaneously break into rotating spiral waves, oscillating solitons, and topological defect turbulence.

### C

- **Chimera State:** A counterintuitive spatiotemporal state in coupled oscillator networks and continuous excitable fields where coherent, phase-locked waves coexist simultaneously alongside incoherent, turbulent domains.
- **Clifford Rotation (4D Isoclinic / Double Rotation):** Rotation in orthogonal 2D planes of $\mathbb{R}^4$ (specifically the $zw$ and $xw$ planes in `liftTo4D()`). Lifting $\mathbb{R}^3$ onto the 3-sphere $S^3$ via inverse stereographic projection, applying Clifford rotations, and projecting back turns 3D manifolds smoothly inside-out.
- **Complex Ginzburg–Landau Equation (CGLE):** A canonical nonlinear partial differential equation governing oscillatory and excitable media near a Hopf bifurcation:
  $$\frac{\partial A}{\partial t} = A - (1 + i c_2)|A|^2 A + D(1 + i c_1)\nabla^2 A, \quad A(\mathbf{x}, t) \in \mathbb{C}$$
  Implemented in `src/shaders/pde.glsl.js` on a periodic `256×256` `RGBA16F` torus.
- **Conformal Orbit-Trap Coordinates (`trapUV`):** Angle-preserving intrinsic coordinates extracted from the folded 4D state vector $\mathbf{z}$ during SDF iteration. Sampling the live CGLE texture at `trapUV` wraps emergent PDE waves seamlessly across every macro, meso, and micro fractal fold without UV seams.

### D

- **Diffraction Grating Micro-Facet Sparkle:** Procedural stochastic crystal micro-normals paired with grating wavelength dispersion $m\lambda = d(\sin\theta_i + \sin\theta_o)$, generating spectral rainbow diamond glints across dark metallic-obsidian surfaces as viewing angles shift (`diffractionSparkle()` in `common.glsl.js`).
- **Distance Estimator (DE) / Signed Distance Field (SDF):** A scalar field $f(\mathbf{p})$ returning a conservative Lipschitz-1 lower bound on the Euclidean distance from $\mathbf{p}$ to the nearest surface, enabling sphere-tracing raymarching without polygon meshes.
- **Dual-Filter Kawase Bloom:** A multi-mip HDR downsample/upsample tent-filter pyramid (`src/shaders/post.glsl.js`) that produces wide, smooth optical halation at minimal GPU bandwidth.

### F

- **Framebuffer Object (FBO):** Offscreen WebGL2 render targets. XENOPHORA uses 14 FBOs simultaneously: 2 ping-pong `RGBA16F` PDE buffers, 1 `RGBA8` PDE preview buffer, 1 `1×1` ray-pick buffer, 1 HDR scene buffer, 2 ping-pong temporal accumulation buffers, and 8 bloom pyramid buffers.
- **Fresnel Reflectance (Schlick Approximation):** Angle-dependent reflection probability $F(\theta) = F_0 + (1 - F_0)(1 - \cos\theta)^5$ governing grazing mirror reflections and glass transmission ratios.

### G

- **GGX (Trowbridge–Reitz) Microfacet BRDF:** Physically based normal distribution function with long specular tails, paired with Smith geometric masking-shadowing (`D_GGX`, `G_Smith`, `F_Schlick`) and a dual-lobe clearcoat highlight.
- **Gyroid Minimal Surface:** A triply-periodic zero-mean-curvature surface discovered by Alan Schoen (1970), approximated implicitly by $\sin x \cos y + \sin y \cos z + \sin z \cos x = 0$. Composed across multiple warped octaves in Regime III (`CHIMERA FOAM`) and Regime IV (`RADIOLARIAN CORAL`).

### H

- **Hopf Fibration / Filament Iris:** A geometric structure inspired by the projection of linked circular fibers of $S^3 \to S^2$ into $\mathbb{R}^3$, manifested in Regime I (`ANEMONE ABYSS`) as a 22-petal curved bioluminescent iris cavity.

### I

- **Icosahedral Kaleidoscopic Fold (`foldIcosa`):** Repeated reflection across golden-ratio ($\phi = \frac{1+\sqrt{5}}{2}$) symmetry planes that maps all of $\mathbb{R}^3$ into a single fundamental icosahedral cone, creating 60-fold sculptural coral symmetry in Regime IV.
- **Interleaved Gradient Noise (IGN):** A high-frequency blue-noise-like screen-space hash (`ign()`) used to eliminate volumetric raymarch banding and dither 8-bit sRGB dark gradients.

### K

- **KIFS (Kaleidoscopic Iterated Function System):** Recursive space folding combining absolute-value reflections, axis sorting, scaling, and 4D rotations to generate infinite self-similar architectural labyrinths (`mapKifs` in Regime II).
- **Kleinian Limit Set / Pseudo-Kleinian Fold:** Fractal geometry generated by iterated Möbius sphere inversions and box-clamp reflections (`2.0 * clamp(z, -c, c) - z`), producing vaulted cathedrals and nested sphere clusters (`mapAnemone` in Regime I).

### L

- **Laplacian Curvature Proxy:** Second-order normal offset estimate $\kappa \approx \frac{f(\mathbf{p}+\epsilon\mathbf{n}) + f(\mathbf{p}-\epsilon\mathbf{n}) - 2f(\mathbf{p})}{\epsilon}$ distinguishing sharp sculptural ridges (which catch metallic/thin-film rims) from deep crevices (which concentrate velvet AO and PDE bioluminescent veins).

### M

- **Modal Piezo-Glass Synthesis:** Additive sound synthesis exciting inharmonic circular-plate/glass bell frequency ratios (`1.0`, `2.756`, `5.404`) through exponential envelopes and a cross-coupled stereo shimmer delay (`src/engine/audio.js`).
- **Morphogenesis:** The biological and physical emergence of spatial anatomical relief and patterned surface form from continuous chemical or oscillatory fields (Turing 1952; implemented here by displacing 3D SDF normals with the live CGLE relief field).

### O

- **Operator Splitting (Strang / Lie–Trotter Splitting):** Decomposing a stiff PDE into separate substeps—here solving the nonlinear Stuart–Landau reaction analytically in closed form while integrating complex diffusion via a 9-point isotropic stencil—guaranteeing unconditional elimination of Nyquist checkerboard blowups.

### P

- **Path Refinement (Progressive Stochastic Accumulation):** Freezing time evolution and blending up to 256 quasirandom jittered frames (`1 / N`) to resolve subpixel anti-aliasing, soft area shadows, blurred glossy reflections, and physical thin-lens bokeh.
- **Pseudo-Kleinian:** A generalized 3D fold combining rectangular reflection chambers with spherical inversion, closely related to Schottky and Kleinian discrete Möbius groups.

### R

- **R2 Quasirandom Sequence:** A 2D low-discrepancy sequence based on the plastic constant $\phi_2 \approx 1.324717957$ (`r2Seq()`), yielding faster Monte Carlo convergence than pseudo-random noise during progressive path refinement.
- **RGB Chromatic Dispersion:** Wavelength-dependent refraction bending red, green, and blue light at distinct indices of refraction ($\eta_R = 1.33, \eta_G = 1.43, \eta_B = 1.56$) inside Regime III (`CHIMERA FOAM`).

### S

- **Stuart–Landau Equation:** The spatially homogeneous limit of the Complex Ginzburg–Landau equation, possessing an exact analytical radial solution $r(t+\Delta t) = r / \sqrt{e^{-2\Delta t} + r^2(1 - e^{-2\Delta t})}$.
- **Subsurface Scattering (SSS):** Light penetrating translucent ribbed coral or soap-film strata, estimated via a forward SDF thickness probe along the key light vector.

### T

- **TDR (Timeout Detection and Recovery):** Windows GPU driver watchdog that resets the WebGL context if a single draw call exceeds ~2 seconds. Mitigated in XENOPHORA via `ZERO` anti-unroll barriers, bounding-volume early exits, surface-proximity PDE gating, and automatic software-GPU budget scaling.
- **Tomographic 4D Slice:** An interactive oblique clipping plane (`uSlice`) bisecting the 3D manifold and illuminating the exact boundary intersection (`exp(-abs(dPlane - h.d) * 34.0)`) like an optical MRI cross-section.
- **Topological Phase Defect (Quantum Vortex):** A point in a 2D complex field $A(\mathbf{x})$ where amplitude vanishes ($|A| \to 0$) and the phase $\arg A$ winds by $\pm 2\pi k$ around the core. In XENOPHORA, clicking the 3D manifold injects alternating $\pm 1$ topological charge singularities.
