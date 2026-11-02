# Project conventions

- English ver/ is the submission version; Korean ver/ is the review version. Their entry points are index.html within each folder.
- The root index.html preserves previous links and defaults to English ver/.
- When the user gives feedback in Korean, update both versions together. Their experiments, equations and controls must remain equivalent.
- Share numerical logic in math.js, interactions in app.js, translations in i18n.js and design in style.css. Do not duplicate computation by language.
- English ver/index.html and Korean ver/index.html use the same markup except the html language. Keep both in sync. Update English prose in both HTML files and its English ver/Korean entry in i18n.js together.
- Language changes retain slider values, random seeds, selected rings, manually rotated angles and sampling progress.
- Keep the scrolling essay layout and small README text using <sub> markup.
- The project README contains only two execution links, Korean and English. The archive root README stays a plain EWHA-style table without links. The course README is only its small course title.
- Deploy through this repository's GitHub Pages workflow. Do not update a Sites copy unless requested.

- Preserve the Fourier, inverse-filter, bias–variance and circle SDE/ODE explanations and experiments. Section 04 illustrates circular diffusion with concentric rotating rings and an m-fold wrapped-Gaussian prior. It replaces the jigsaw only. State the independent-angle prior and distinguish sampling from reversal of recorded noise.
- Highlight the affected equation terms when controls change. Show actual numerical angles without snapping.

- Use compact typography and impersonal descriptive prose in both languages. Korean uses concise declarative forms such as “감소한다”, not conversational endings or invitations. Do not replace the page structure during local revisions.
