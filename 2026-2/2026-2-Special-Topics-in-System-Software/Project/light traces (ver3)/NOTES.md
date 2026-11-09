# Light Traces : From Diffusion Paths to Flow Matching

This version studies three connected questions : how paths can differ while marginals agree, how conditional tangent velocities recover a marginal field, and what changes when the score is perturbed. The moving lights are sample markers. Their trails record past positions, not instantaneous probability density or a physical optical intensity.

## How to use

1. Play or scrub generation time; click a light or use the numbered slider. The snapshots and histories are always visible. Compare the horizontal histograms with the dashed analytic reference.
2. Click/drag the observation point, or use the keyboard-accessible position sliders. The position panel shows conditional paths through that point. The velocity panel averages tangent vectors using posterior weights. The score identity gives the same result, marked with a blue ring. Dashed blue vectors show the linear contribution followed by the score contribution.
3. Add a horizontal score bias, select its time interval, and change the integration step count. The upper row shows exact-score reference snapshots; the lower row shows the current setting at the same grid time and scale. Scrub the comparison slider or drag the discrepancy-graph cursor to update all scene clocks. Only section 3 is perturbed. Reference curves use the exact score and 1,024 steps. The two language versions retain controls and the random seed through session storage.
4. Step-count changes highlight the finite step sizes in the Euler–Maruyama and Heun updates. Score-bias changes highlight the estimated score in section 3 only. Observation and time changes highlight the relevant conditional-mean, interpolation and score terms.

## Model and numerical interpretation

All scenes use the same independent-endpoint linear interpolation between a standard Gaussian source and an equally weighted, three-component isotropic Gaussian-mixture target. The target component standard deviation is 0.18. Its centers and all numerical routines are in `model.js`.

Generation time increases from 0.05 to 0.95, corresponding to reversed diffusion time. Exact samples from the marginal at 0.05 initialize both samplers; this version does not test prior mismatch. The truncated interval avoids singular diffusion coefficients at the ideal endpoint. The last displayed snapshot is therefore the marginal at 0.95, not the limiting data distribution at 1.

`conditional()` computes the exact posterior target law given the observation. It uses eight symmetric representative offsets per posterior Gaussian component. These are quadrature representatives, not eight possible worlds or learned outputs. Their posterior-weighted mean velocity is exact up to floating-point arithmetic because conditional velocity is affine in the target endpoint. The component target uncertainty is retained; component centers alone are not used as conditional endpoints.

`terms()` computes the linear and score contributions in the lecture's Gaussian FM identity. The linear schedule satisfies the lecture's diffusion compatibility condition. The corresponding generative reverse-SDE drift includes twice the score contribution and the appropriate noise amplitude; Heun integrates the mean ODE and Euler–Maruyama integrates the SDE. Time snapshots are taken at solver grid points. A finite collection of conditionally paired paths is illustrative; it is not claimed to be the complete conditional distribution.

Each of 384 samples has its own seeded fine-grid Brownian increments. Coarser SDE grids sum these same increments, so changing the step count does not create an unrelated noise realization. The plotted discrepancy is the one-dimensional Kolmogorov distance between the empirical horizontal-coordinate CDF and its analytic reference. It is not a full 2D metric. Sampling variability remains even with exact scores. Reference curves are numerical comparisons, not certified error bounds. Independently trained FM and score models are not simulated or claimed to have identical approximation errors.

## Lecture equations

Only equations present in the supplied course notes are displayed. `course-equations.json` stores the exact HTML and local PDF-page attribution. Time is renamed to s in the diffusion equations to distinguish it from generation time t; arguments are suppressed in the display as in the concise proposal.

- `lec03-score-sde.pdf`, PDF pages 70, 73–74 : reverse SDE, probability flow ODE and marginal alignment.
- `lec03-score-sde.pdf`, PDF pages 86–87 : replacing the exact score and numerical integration.
- `lec04-flow-based.pdf`, PDF pages 46–47 : path derivative and conditional mean velocity.
- `lec04-flow-based.pdf`, PDF pages 62–64, 67–74 : Gaussian source, score representation, reversed-clock correspondence, compatible schedules and endpoint singularities.
- `lecA-differential-equations.pdf`, PDF pages 15–16 : Euler and Heun updates.

The local PDF files are not redistributed. The analogy and analytic teaching implementation are project designs.

## Verification

Run `node --test model.test.cjs` from this folder. Checks cover the analytic score via finite differences, posterior-mean identity, continuity residuals, density normalization, SDE/ODE projected marginals, shared Brownian increments, Heun refinement, time-local score perturbations, equation audit, and bilingual markup. Browser checks cover playback, selection, dragging, score/grid controls, language-state persistence, and narrow layouts.

## Animation and cache

The comparison worker stores the active seed's samples and fine-grid Brownian increments, plus the three most recent settings. Compact Float32 frame buffers retain every solver grid state; plots show the nearest grid point rather than interpolating stochastic paths. CDF curves are evaluated at 33 grid times; the movable cursor evaluates the selected snapshot directly, so its marker need not lie exactly on the line joining those sampled curve values. Reference snapshots use the same grid time as the current setting.

Time scrubbing reads stored frames without solving again. New error/grid settings run in the worker; request IDs discard obsolete responses and the previous view is visibly dimmed while pending. Initial loading disables controls until reference frames exist. The direct-computation fallback is available when a browser cannot start the worker.

## Three-dimensional geometry

Section 4 uses the original exact-score, 1,024-step SDE/ODE paths. Orthographic camera rotation changes only projection. Both views use a shared spatial bound containing every stored path and generation time as their vertical coordinate. A movable horizontal slice includes all 384 positions and analytic density contours. Background traces use every eighth grid point; the selected path retains all steps. Future path segments are dashed.

A separate surface represents analytic density as height, on a fixed 0–2 vertical scale and spatial domain [-2.2,2.2] squared. Its height is not time. The projected CDF comparisons use the full clouds at the exact selected solver grid time and do not establish full 2D agreement. These are numerical reference experiments, not a proof of continuous-time marginal alignment. Score bias in section 3 does not affect them.

`geometry3d.js` provides dependency-free orthographic projection and SVG rendering. Section rendering is deferred while outside the viewport. Time, selected path and camera controls persist across languages.
