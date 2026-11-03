# Project conventions

- English ver/ is the submission version; Korean ver/ is the review version. Their entry points are index.html within each folder.
- The root index.html preserves previous links and defaults to English ver/.
- When the user gives feedback in Korean, update both versions together. Their experiments, equations and controls must remain equivalent.
- Share numerical logic in math.js, interactions in app.js, translations in i18n.js and design in style.css. Do not duplicate computation by language.
- English ver/index.html and Korean ver/index.html use the same markup except the html language. Keep both in sync. Update English prose in both HTML files and its English ver/Korean entry in i18n.js together.
- Language changes retain slider values, random seeds, selected pieces, coupling, probe location, clock and solver budget.
- Keep the scrolling essay layout and small README text using <sub> markup.
- The project README contains only two execution links, Korean and English. The archive root README stays a plain EWHA-style table without links. The course README is only its small course title.
- Deploy through this repository's GitHub Pages workflow. Do not update a Sites copy unless requested.

- The accepted narrative is likelihood-trained Neural ODE / continuous normalizing flows → Flow Matching → Conditional Flow Matching. Explain the obstacle that connects each stage. Density/divergence integration is now explicitly approved; do not restore DDPM, Fourier, or score-denoising tutorials.
- One shared analytic model supports an automatic CNF material-grid / log-density trace, manual local FM prediction, manual CFM pairing / conditional mean / loss slices, and an optional Euler/Heun generation comparison. Preserve draggable starts, pairing changes, probes, and the real photo puzzle only in CFM. Photo pieces label conditional pairs; marginal ODE paths need not retain those identities.
- The analytic model uses 48 translated Gaussian components of fixed tau=.16. The same Gaussian offset is carried between paired endpoints. Mixture velocities use posterior weights, not uniform averaging. Changing the permutation preserves endpoint densities, not piece identities. Do not claim exact puzzle assembly by the marginal ODE.
- Report numerical errors against refined Heun (4096 vs 2048 steps) at equal field-evaluation budgets. Refinement is a consistency check, not a certified error bound.
- Highlight equation terms on control changes. Keep concise declarative prose, compact typography and the scrolling layout.

- Use a white page, header, canvas and equation background. The English one-page Times New Roman submission PDF is stored outside the public repository in the workspace Proposal/ folder; do not publish its student identification details.

- Do not label concepts by lecture/chapter numbers; those numbers were personal file labels. Use concept names in both languages. Use 1., 2., 3., 4. for visible section numbering. Apply content feedback to both language versions together.

- Latest requirement: display only equations directly present in the supplied lecture PDFs. course-equations.json records each equation and its exact source slide/PDF page. Do not add model-specific density, assignment-cost, energy, Taylor, flux-integral or observed-order formulas. Keep toy computations in the numerical engine distinct from displayed lecture equations.
- Mixed interaction modes: only the CNF trajectory scene plays automatically while visible; all FM/CFM controls and solver controls are manual. Shared time and model edits persist across sections and languages. Keep the optional generation experiment expandable. Do not introduce metaphor titles such as motion score, probability gate, or wind map.
- course-equations.json is the displayed-equation audit. The current CNF likelihood and instantaneous change-of-variables equations come from flow-based PDF pages 32 and 21. The analytic field stands in for a parameterized neural field; compare mathematical objectives, never claim measured training acceleration or actual neural optimization.

- Visual revision: pure white surfaces, outline-only density contours (no tinted density wash). The CFM photo is an 8 × 6 jigsaw with 48 actual model components. Show start/current/end together; a selected piece links all three. FM includes a linked velocity-space squared-error contour plot. Do not label these graphs as trained results.

- Color preference: use muted slate blue (#526b86) and subdued red (#ae4c54), with pure white surfaces. Keep UI, SVGs, canvas plots and bilingual color labels consistent; do not restore vivid cobalt or orange accents.
