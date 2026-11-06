# ver3 scope

This folder is the independent ver3 version. The other versions are preserved in sibling folders.

- Preserve bilingual, white-background, small-README and lecture-only-equation conventions.
- This version supersedes the parent's jigsaw and 48-component model requirements within this folder. Use the light-trace analogy and one independent Gaussian-source interpolation family throughout.
- The narrative is snapshots versus trajectories, conditional tangent averaging and Gaussian FM / PF ODE correspondence, then sensitivity to score error. All primary views stay visible in one scrolling page.
- Keep model.js and app.js shared across languages. i18n.js supplies prose; the two HTML files differ only in their document language.
- README.md has only the two small execution links. NOTES.md supplies implementation and source documentation. Proposal PDFs and personal identifiers stay outside the public repository.
- Preserve the distinction between snapshots and accumulated paths, pathwise and marginal equality, exact field identities and independently learned errors. Do not simulate singular endpoints or claim the 0.95 marginal is the final data law.

- The proposal's linked comparison is implemented as exact-reference and current-setting snapshot rows at the same grid time. All three time sliders and the discrepancy cursor share state.time.
- Preserve worker frame caching and request-ID rejection of stale results. Step changes emphasize discrete step sizes in the audited Euler–Maruyama/Heun equations, never the differential ds. Error controls highlight only the approximate experiment.

- Preserve SNU Archive, other courses and sibling versions. Always update English submission and Korean review versions together. Work on main; the three versions live in separate folders, not branches.
