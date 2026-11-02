# Project conventions

- English ver/ is the submission version; Korean ver/ is the review version. Their entry points are index.html within each folder.
- The root index.html preserves previous links and defaults to English ver/.
- When the user gives feedback in Korean, update both versions together. Their experiments, equations and controls must remain equivalent.
- Share numerical logic in math.js, interactions in app.js, translations in i18n.js and design in style.css. Do not duplicate computation by language.
- English ver/index.html and Korean ver/index.html use the same markup except the html language. Keep both in sync. Update English prose in both HTML files and its English ver/Korean entry in i18n.js together.
- Language changes retain slider values, random seeds, selected pieces, noise levels, prediction error and conditional-estimation settings.
- Keep the scrolling essay layout and small README text using <sub> markup.
- The project README contains only two execution links, Korean and English. The archive root README stays a plain EWHA-style table without links. The course README is only its small course title.
- Deploy through this repository's GitHub Pages workflow. Do not update a Sites copy unless requested.

- The user removed introductory encoder/decoder and Gaussian-density walkthroughs. Start directly from the lecture’s denoising identities and investigate posterior covariance, the denoiser Jacobian, local versus finite perturbations, Bayes risk versus sample validity, and predictor error. Distinguish material derived here from material explicitly covered in lectures. Do not restore Fourier analysis or introductory noising lessons.
- Keep the photo puzzle late in the essay. It separately illustrates pointwise predictor error, not SDE/ODE paths or the Jacobian of a learned model. Keep the real photo and interlocking edges. No AI-generated artwork or landscapes.
- Highlight equation terms when controls change. Positions remain continuous, without grid snapping.

- Use compact typography and impersonal descriptive prose in both languages. Korean uses concise declarative forms such as “감소한다”, not conversational endings or invitations. Do not replace the page structure during local revisions.
