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

- The accepted topic is conditional flow matching: design a coupling, average conditional velocities, distinguish marginal transport from labeled assignments, and compare Euler/Heun at equal NFE. The continuity equation supports the transport proof. Do not restore denoising/Jacobian/MAP/Fourier sections.
- Four successive views share a single model, selection and clock. Preserve draggable starting centers, assignment exchange, spatial field probing and numerical solver comparison. Keep the real photo with interlocking pieces. The image is an identity marker; the model transports continuous coordinates, not image pixels or physically interlocking shapes.
- The analytic model uses 12 translated Gaussian components of fixed tau=.16. The same Gaussian offset is carried between paired endpoints. Mixture velocities use posterior weights, not uniform averaging. Changing the permutation preserves endpoint densities, not piece identities. Do not claim exact puzzle assembly by the marginal ODE.
- Report numerical errors against refined Heun (4096 vs 2048 steps) at equal field-evaluation budgets. Refinement is a consistency check, not a certified error bound.
- Highlight equation terms on control changes. Keep concise declarative prose, compact typography and the scrolling layout.

- Use a white page, header, canvas and equation background. The English one-page Times New Roman submission PDF is stored outside the public repository in the workspace Proposal/ folder; do not publish its student identification details.

- Do not label concepts by lecture/chapter numbers; those numbers were personal file labels. Use concept names in both languages. Use 1., 2., 3., 4. for visible section numbering. Apply content feedback to both language versions together.

- Latest requirement: display only equations directly present in the supplied lecture PDFs. course-equations.json records each equation and its exact source slide/PDF page. Do not add model-specific density, assignment-cost, energy, Taylor, flux-integral or observed-order formulas. Keep toy computations in the numerical engine distinct from displayed lecture equations.
- Automatic, pausable playback connects the shared clock, probe/loss visualization, particle probability graph, and Euler/Heun stage/error views. Retain optional presets and controls. The puzzle photograph belongs only to the pairing view. Keep both PDFs and website languages in sync when the user requests both.
