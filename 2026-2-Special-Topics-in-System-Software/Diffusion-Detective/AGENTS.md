# Project conventions

- English/ is the submission version; Korean/ is the review version. Their entry points are index.html within each folder.
- The root index.html preserves previous links and defaults to English/.
- When the user gives feedback in Korean, update both versions together. Their experiments, equations and controls must remain equivalent.
- Share numerical logic in math.js, interactions in app.js, translations in i18n.js and design in style.css. Do not duplicate computation by language.
- English/index.html and Korean/index.html use the same markup except the html language. Keep both in sync. Update English prose in both HTML files and its English/Korean entry in i18n.js together.
- Language changes retain slider values, random seeds, puzzle choices and hints.
- Keep the scrolling essay layout and small README text using <sub> markup.
- The project README contains only two execution links, Korean and English. The archive root README stays a plain EWHA-style table without links. The course README is only its small course title.
- Deploy through this repository's GitHub Pages workflow. Do not update a Sites copy unless requested.
