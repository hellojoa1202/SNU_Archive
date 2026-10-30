# Project conventions

- English is the submission version and the default at the plain project URL.
- Korean is the review version at `?lang=ko`.
- When the user gives feedback in Korean, update both language versions together. Keep their content, equations, experiments and controls equivalent.
- Keep numerical logic shared in `math.js` and interactions shared in `app.js`; never fork the computation by language.
- Static translations live in `i18n.js`; English prose is also present in `index.html` so the default remains readable before JavaScript loads. Update both English copies and the Korean translation when editing a translated prose block.
- Language changes must retain slider values, random seeds, puzzle choices and hint state.
- Keep the scrolling essay layout. Avoid additional page tabs and folders unless needed.
- Keep every README, including headings, in small text using `<sub>` markup.
- Deploy through this repository's GitHub Pages workflow. Do not create or update a Sites-hosted copy unless explicitly requested.
