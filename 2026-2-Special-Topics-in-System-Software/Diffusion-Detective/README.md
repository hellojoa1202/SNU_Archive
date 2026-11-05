<p><sub><a href="https://hellojoa1202.github.io/SNU_Archive/2026-2-Special-Topics-in-System-Software/Diffusion-Detective/English%20ver/">English ver</a></sub></p>
<p><sub><a href="https://hellojoa1202.github.io/SNU_Archive/2026-2-Special-Topics-in-System-Software/Diffusion-Detective/Korean%20ver/">Korean ver</a></sub></p>

# The Shaken Puzzle Board

Interactive course notes for *Special Topics in System Software (Mathematical Principles of Diffusion Models)*, Fall 2026.
The English page is the submission; the Korean page is a reading copy with identical experiments.

## Topic and mathematical background

A sampler built on the score SDE framework is exact on paper and approximate in practice, and the lecture notes list exactly three substitutions that separate the two: the Gaussian prior that stands in for $p_T$, the learned score $s_{\phi^\times}$ that stands in for $\nabla\log p_t$, and the time grid that stands in for the continuum. The page builds a toy in which everything else is known in closed form and measures the effect of each substitution alone.

- **Toy.** $p_{\text{data}}=\frac1{48}\sum_k\mathcal N(\mu_k,\tau^2 I)$ with the 48 centres on an $8\times6$ grid of pitch $0.22$ and $\tau=0.06$. Forward process $dx=dw$ (the variance-exploding instance, $f=0$, $g=1$), so $p_t$ is the same mixture with component variance $\tau^2+t$, the score is a posterior-weighted sum of $(\mu_k-x)/(\tau^2+t)$, and $p_t$ solves the heat equation $\partial_t p=\tfrac12\Delta p$.
- **Samplers.** The one-parameter family $d\bar x=[f-\tfrac{1+\eta^2}{2}g^2\nabla\log p_t]\,dt+\eta g\,d\bar w$ run from $T$ to $0$: $\eta=1$ is the reverse-time SDE, $\eta=0$ the probability flow ODE; all $\eta$ share the forward marginals.
- **Three substitutions.** Start from $\mathcal N(0,TI)$ instead of $p_T$ (measured by $\mathrm{SNR}(T)=1/T$ and the lecture's bound $D_{\mathrm{KL}}\le\tfrac12\mathrm{SNR}(T)\,\mathbb E\|x_0\|^2$, compared with the KL computed by quadrature); replace the score by a controlled perturbation $\tilde s(x,t)=\nabla\log p_{t+\delta}(x)+b$ (a blur $\delta$ and a tilt $b$); replace continuous time by Euler–Maruyama, Euler or Heun steps at a fixed number of score evaluations.
- **Two pictures of one density.** *Puzzle board*: slots are the modes; a photograph printed under the board is revealed tile by tile in proportion to the probability mass that lands in each slot; pieces are blank because the sampler recovers where mass goes, not which piece goes where. *Landscape*: the same density as height $U_t=-\log p_t$, valleys = slots, score = downhill, forward process = the landscape flattening under the heat equation.
- **Flow matching.** The closing section uses the new lecture material identifying Gaussian flow matching with a probability flow ODE ($v_t=\frac{\dot b_t}{b_t}x+a_t^2(\frac{\dot b_t}{b_t}-\frac{\dot a_t}{a_t})\nabla\log p_t$) to map the three substitutions onto a flow-matching sampler.

## How to use the page

1. The **lens switch** in the header (Puzzle board / Landscape) applies to every figure and persists.
2. **Section 1** — drag the shaking time $t$; watch the wells blur (puzzle) or the landscape flatten (terrain); toggle the score arrows.
3. **Section 2** — the $\eta$-family with exact start, exact score and 256 steps. Pieces are coloured by their start: at $\eta=0$ the colours arrive as a smooth gradient (the flow map is a bijection), at $\eta=1$ they are scrambled, and the slot frequencies are the same. Click a piece to follow it.
4. **Section 3, the laboratory** — four knob groups: *Start* ($T$, and $p_T$ vs. $\mathcal N(0,TI)$), *Score* (tilt $b_x$, blur $\delta$), *Grid* (evaluations and method), *Process* ($\eta$, number of pieces). Every change re-runs the sampler with fixed seeds and replays it; the progress slider scrubs intermediate times. Readouts: slot total variation, spread ratio, KS distance, each with its finite-sample floor.
5. **3.1 / 3.2 / 3.3** — focused figures for each substitution: $p_T$ against the Gaussian prior with the KL bound vs. numerical KL; the exact vs. perturbed score field; error vs. number of evaluations for the three integrators.
6. **Section 4** — one-knob sweeps for $\eta=0$ and $\eta=1$ (shown from `sweeps.json`, recomputable in the browser in about 20 s).

## Key implementation details

- No build step, no framework, no network except KaTeX from cdnjs (the raw TeX is shown if it fails to load). Everything runs in the browser from `English ver/index.html` or `Korean ver/index.html`.
- `model.js` — closed forms: density, log-density, score, KL to the prior by $140\times140$ midpoint quadrature, exact slot masses by products of normal CDF differences (edge slots extend to infinity so the slots partition the plane), $x$-marginal density and CDF.
- `sampler.js` — the $\eta$-family integrator (Euler–Maruyama for $\eta>0$; Euler or Heun for $\eta=0$), seeded sfc32 random numbers so every run can be replayed, and the metrics: slot TV $\tfrac12\sum_k|\hat f_k-m_k|$, spread (RMS distance to the nearest slot centre, reported relative to the value for exact draws), KS distance of the $x$-marginal, and finite-sample floors from exact draws of $p_0$.
- `budget.js` + `make-sweeps.cjs` — the section-4 sweeps, run in node to produce `sweeps.json` and runnable in the browser with the same code.
- `equations.js` — every displayed equation with the lecture PDF and page it comes from; the few lines that define the toy or the metrics are marked “defined on this page”.
- `views.js` — the two lenses, bars and plots; `app.js` — controls; `i18n.js` — all prose in both languages.
- Tests (`node --test model.test.cjs sampler.test.cjs`): score against finite differences of $\log p_t$; the heat equation; the KL bound dominates the numerical KL; slot masses against Monte Carlo; the family reproduces intermediate and final marginals for $\eta\in\{0,\tfrac12,1\}$; tilt shifts the mean and blur widens the spread; reproducibility and argument validation.

## Main observations and their interpretation

Numbers below are for $N=2048$ pieces; the finite-sample floor of the slot TV is $0.06$ and of the spread ratio about $0.87$ (ODE) to $1.27$ (SDE at 128 steps).

| Substitution | Probability flow ODE ($\eta=0$, Heun) | Reverse SDE ($\eta=1$, Euler–Maruyama) | Reading |
|---|---|---|---|
| Start from $\mathcal N(0,TI)$, step $h=1/128$ fixed | slot TV $0.23\to0.04$ as $T$ goes $0.25\to4$ | at the floor for every $T$ | the ODE is a bijection and carries the start error to the end; the SDE forgets its start. The lecture's KL bound is loose by an order of magnitude but has the right trend. |
| Tilt $b_x$ | slot TV $0.22$ at $b_x=1$ | $0.32$ at $b_x=1$ | a constant bias enters the drift with weight $(1+\eta^2)/2$, so the SDE follows the wrong map twice as hard; the picture is displaced by more than one slot. |
| Blur $\delta$ | spread ratio $1.3\to2.6$ for $\delta=0.01\to0.1$, slot TV at the floor | same | blur widens every well without moving mass between slots: frosted glass, not a displaced picture. |
| Evaluations | Heun worst below 32, over-contracts near 128, best from 256 | spread ratio decreases slowly from above | the field is stiff ($\|\nabla\log p_t\|\sim1/(\tau^2+t)$); a uniform grid spends its budget where nothing happens; Euler–Maruyama needs $\sqrt h\ll\tau$ in its last step. |

The budget is not additive: a tilt cannot be repaired by more steps and a coarse grid cannot be repaired by a longer shake. Slot TV answers *where* the mass went, spread answers *how tightly*; the two substitutions that move mass (start, tilt) and the two that blur it (blur, grid) separate cleanly.

Where the analogy stops is stated on the page: pieces are blank by design, a slot holds a fraction rather than one piece, the board changes shape on its own under the heat equation, tilt and blur are surrogates for an unknown network error, and the time grid is uniform.

## References

- Lecture notes, *Mathematical Principles of Diffusion Models* (Prof. Taesup Moon, Fall 2026): Score SDE framework (forward SDE, perturbation kernels, SNR and the KL bound, Fokker–Planck, reverse-time SDE, probability flow ODE, the $\eta$-family, denoising score matching, the three substitutions, Euler–Maruyama); Flow-based perspective (flow map, flow matching and the probability flow ODE); Differential-equations appendix (non-intersection, Euler and Heun). Page numbers for every equation are in `equations.js` and in the page's source table.
- C.-H. Lai, Y. Song, D. Kim, Y. Mitsufuji, S. Ermon. *The Principles of Diffusion Models.* arXiv:2510.21890.
- Y. Song, J. Sohl-Dickstein, D. P. Kingma, A. Kumar, S. Ermon, B. Poole. *Score-Based Generative Modeling through Stochastic Differential Equations.* ICLR 2021.
- B. D. O. Anderson. *Reverse-Time Diffusion Equation Models.* Stochastic Processes and their Applications, 1982.
- Photograph: “Cat August 2010-4” by Alvesgaspar, Wikimedia Commons, CC BY-SA 3.0 (cropped and resized; see `assets/PHOTO-LICENSE.txt`).
