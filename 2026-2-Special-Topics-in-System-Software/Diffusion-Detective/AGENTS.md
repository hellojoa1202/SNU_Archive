# Project conventions

## What this is
- Course project for *Special Topics in System Software (Mathematical Principles of Diffusion Models)*, Fall 2026. Topic: **The Shaken Puzzle Board — three approximations of a diffusion sampler** (prior for p_T, learned score for ∇log p_t, time grid for the continuum), measured one at a time on an analytic 48-Gaussian toy, with the η-family (reverse SDE ↔ probability flow ODE) as the fourth dial.
- Two visual lenses of the same density share one state: **puzzle board** (slots = modes, photo revealed by slot mass) and **landscape** (height −log p_t). The lens switch is global and persists.
- `English ver/` is the submission; `Korean ver/` is the reading copy. The two HTML files are identical except `<html lang>`; all prose lives in `i18n.js` under one key per element (`data-i18n`). Edit both languages together.

## Code layout (no build step, no framework, no network needed except KaTeX)
- `model.js` closed forms: mixture density, score, log-density, KL to the Gaussian prior (quadrature), exact slot masses, x-marginal. Slots partition the whole plane (edge slots extend to ∞).
- `sampler.js` the η-family integrator (Euler–Maruyama for η>0; Euler/Heun for η=0), seeded sfc32 RNG, metrics (slot TV, spread, KS), finite-sample floors.
- `budget.js` the four sweeps of section 4; `make-sweeps.cjs` writes `sweeps.json` (shown first, recomputable in the browser).
- `equations.js` every displayed equation with its lecture PDF page. `source: null` = defined on this page. **Display only equations that appear in the supplied lecture PDFs, or that define this page's own toy/metrics, and say which.**
- `views.js` drawing only; `app.js` controls; `style.css` white surfaces, muted blue `#5c80a8`, red `#ad4b53`.
- Tests: `node --test model.test.cjs sampler.test.cjs` (score vs finite differences, heat equation, KL bound, slot masses vs Monte Carlo, marginal alignment of the family, reproducibility).

## Writing rules
- Declarative, concrete prose; numbers come from the code (rerun `make-sweeps.cjs` and the exploration before changing a claim). Do not claim measured training behaviour: there is no neural network.
- Analogy is subordinate to the mathematics: equation titles use mathematical names, the puzzle/landscape words appear in knob subtitles and captions. State where the analogy stops (section 6).
- Time convention: diffusion clock only (t = 0 data, t = T noise); generation runs T → 0.
- Section numbering 1–6 with 3.1–3.3; no lecture/chapter numbers in headings (cite PDF pages in equation sources instead).
- Proposal typography: spaces on both sides of colons (A : B). The proposal PDF with student ID lives outside the repository (workspace `Proposal/`).

## Deployment
- GitHub Pages via `.github/workflows/pages.yml` (tests, then copies the listed files). Add new files to the copy list and to the hashing list.
- Project README: links first, then the documentation required by the course (topic, usage, implementation, observations, references).
