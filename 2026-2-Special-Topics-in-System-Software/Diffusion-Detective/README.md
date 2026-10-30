<p><sub><strong>Diffusion Detective · Following the spectrum</strong></sub></p>

---

<p><sub>An interactive essay on spectral diffusion, inverse problems, regularization, and score-based sampling.</sub></p>
<p><sub><a href="https://hellojoa1202.github.io/SNU_Archive/2026-2-Special-Topics-in-System-Software/Diffusion-Detective/">Open the experiments ↗</a> · <a href="../">Course archive</a></sub></p>

<p><sub><strong>Languages · 언어</strong></sub></p>
<p><sub><a href="https://hellojoa1202.github.io/SNU_Archive/2026-2-Special-Topics-in-System-Software/Diffusion-Detective/">English · submission</a> / <a href="https://hellojoa1202.github.io/SNU_Archive/2026-2-Special-Topics-in-System-Software/Diffusion-Detective/?lang=ko">한국어 · 검토용</a>. Use the header language switch to change languages while keeping the experiment and puzzle state. The plain URL always defaults to English.</sub></p>
<p><sub>한국어 화면을 보고 피드백을 주면 영어·한국어 본문과 동적 설명을 함께 수정합니다. 두 버전은 동일한 수식, 계산 코드, 실험을 공유합니다.</sub></p>

<p><sub><strong>Getting started</strong></sub></p>
<p><sub>Open <code>index.html</code> in a browser. No installation, build step, account, or external library is needed. Equations use native MathML. The essay follows a continuous scroll, with experiments placed beside their mathematical context.</sub></p>
<table>
  <thead><tr><th><sub>Experiment</sub></th><th><sub>Explore</sub></th></tr></thead>
  <tbody>
    <tr><td><sub>01 · The fading spectrum</sub></td><td><sub>Adjust the initial density, phase, detail frequency, amplitude, and diffusion time. Follow the density and the frequency–time attenuation map.</sub></td></tr>
    <tr><td><sub>02 · Running it backward</sub></td><td><sub>Compare direct inversion, spectral cutoff, and Tikhonov on the same noisy observation. Adjust the error bound, cutoff, and regularization strength.</sub></td></tr>
    <tr><td><sub>03 · Choosing a filter</sub></td><td><sub>Compare exact expected RMSE, bias, noise RMS, and realized error across λ. The filter controls stay synchronized.</sub></td></tr>
    <tr><td><sub>04 · Two small mysteries</sub></td><td><sub>Choose among candidate sources and inspect their residuals. An earlier observation can resolve an ambiguous case.</sub></td></tr>
    <tr><td><sub>05 · From density to samples</sub></td><td><sub>Compare reverse SDE and probability flow ODE samples using the exact score. Adjust reverse time, integration steps, and the initial sample seed.</sub></td></tr>
  </tbody>
</table>

<p><sub><strong>Mathematical model</strong></sub></p>
<p><sub>On θ∈[0,2π), the reference measure is dθ/(2π). Source densities have the finite expansion p₀(θ)=1+Σₖ[aₖcos(kθ)+bₖsin(kθ)], k≤24. Coefficient bounds keep each source positive. Relative to Lebesgue measure, the density is p/(2π). With D=1, the heat equation ∂ₜp=∂²θp multiplies each mode by hₖ(t)=exp(−k²t).</sub></p>
<p><sub>Each real observed coefficient is yₖ=hₖcₖ+ηₖ, with independent ηₖ∼Uniform[−ε,ε]. This measurement noise is separate from Brownian sampling noise. Direct inversion uses gain 1/hₖ; cutoff removes k&gt;K; Tikhonov uses gₖ=hₖ/(hₖ²+λ). All filters preserve the mean.</sub></p>
<p><sub>Parseval’s identity gives L² error √(Σₖ[(aₖ−âₖ)²+(bₖ−b̂ₖ)²]/2). Expected squared error is (1/2)Σₖ(gₖhₖ−1)²(aₖ²+bₖ²)+(ε²/3)Σₖgₖ²: squared bias plus noise variance. The plots show the square roots of these quantities.</sub></p>
<p><sub>A puzzle candidate fits when every real coefficient residual is within ε. Multiple fits mean ambiguity within this finite candidate set and bounded-error model. Exact, noise-free coefficients remain invertible.</sub></p>
<p><sub>Generation uses the analytic score sₜ=∂θlog(pₜ). In reverse time r=T−t, the SDE is dΘᵣ=2sₜ(Θᵣ)dr+√2dBᵣ and the ODE is dΘᵣ=sₜ(Θᵣ)dr. Their density equations agree at qᵣ=pₜ. Both start with 512 shared rejection samples from exact pT. Euler–Maruyama and Euler provide the numerical updates. Histograms use 32 bins; Δ₆ measures empirical Fourier error in the first six modes.</sub></p>

<p><sub><strong>Observations and scope</strong></sub></p>
<p><sub>Fast high-frequency decay leads to exponential noise amplification under inversion. Regularization trades bias for variance. Reconstructions retain negative values and use independent vertical scales. Density inversion and score-based sampling are separate experiments. The sampling panels retain finite-sample and numerical integration error; agreement of continuous-time marginals does not imply identical paths or histograms. All distributional calculations are analytic, with no neural network training.</sub></p>

<p><sub><strong>Files and validation</strong></sub></p>
<p><sub><code>index.html</code>: essay and equations · <code>style.css</code>: responsive layout · <code>math.js</code>: Fourier model, filters, risk, score, and sampling · <code>i18n.js</code>: shared bilingual text and language switching · <code>app.js</code>: SVG plots and interaction · <code>math.test.cjs</code>: mathematical checks.</sub></p>
<p><sub><code>node --test math.test.cjs</code> checks positivity, normalization, exact inversion, the heat semigroup, score derivatives, puzzle identifiability, expected risk against Monte Carlo estimates, and generated moments. The root GitHub Actions workflow runs checks and publishes the five web assets.</sub></p>

<p><sub><strong>References</strong></sub></p>
<p><sub>Course lectures: Lecture 2 · Score-Based Perspective; Lecture 3 · Score SDE Framework; Lecture A · Differential Equations.<br><a href="https://the-principles-of-diffusion-models.github.io/#/blog">Tracing the Principles Behind Modern Diffusion Models</a> — reference for the scrolling equation-and-experiment format.<br><a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, ICLR 2021</a>.<br>Evans, Partial Differential Equations — heat equation.</sub></p>
