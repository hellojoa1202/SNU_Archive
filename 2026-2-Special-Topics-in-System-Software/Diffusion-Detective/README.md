<p><sub><strong>Diffusion Detective · 확산으로 지워진 정보의 복원과 한계</strong></sub></p>

---

<p><sub>원의 확률밀도를 이용해 주파수 감쇠, 역열문제, 정규화, 식별 가능성, score 기반 역확산을 연결하는 스크롤형 인터랙티브 수학 노트입니다.</sub></p>
<p><sub><a href="https://hellojoa1202.github.io/SNU_Archive/2026-2-Special-Topics-in-System-Software/Diffusion-Detective/">웹사이트 실행 ↗</a> · <a href="../">과목으로 돌아가기</a></sub></p>

<p><sub><strong>실행과 사용법</strong></sub></p>
<p><sub><code>index.html</code>을 브라우저에서 열면 됩니다. 설치, 빌드, 로그인, 외부 라이브러리 없이 실행됩니다. 수식은 브라우저의 기본 MathML로 렌더링합니다. 목차는 해당 위치로 스크롤하며 내용은 탭이나 접힌 패널 안에 숨기지 않습니다.</sub></p>
<table>
  <thead><tr><th><sub>실험</sub></th><th><sub>조작과 관찰</sub></th></tr></thead>
  <tbody>
    <tr><td><sub>01 · Forward diffusion</sub></td><td><sub>초기 분포, 위상, 미세 무늬 주파수와 크기, 확산 시간을 조절하고 밀도 곡선과 k×t 감쇠 지도를 비교합니다.</sub></td></tr>
    <tr><td><sub>02 · Inverse problem</sub></td><td><sub>같은 관측에 대한 단순 역산, spectral cutoff, Tikhonov를 동시에 비교합니다. 측정 오차, cutoff와 λ를 조절합니다.</sub></td></tr>
    <tr><td><sub>03 · Bias–variance</sub></td><td><sub>λ별 기대 RMSE, 편향, 노이즈 RMS와 실제 오차를 비교합니다. 실험 02와 λ가 동기화됩니다.</sub></td></tr>
    <tr><td><sub>04 · Identifiability puzzles</sub></td><td><sub>독립적인 두 퍼즐에서 후보를 선택하고 계수별 최대 잔차를 확인합니다. 더 이른 관측으로 모호성이 해소되는지 확인합니다.</sub></td></tr>
    <tr><td><sub>05 · Score-based generation</sub></td><td><sub>정확한 score를 사용하는 reverse SDE와 probability flow ODE를 비교합니다. 진행률, 적분 스텝과 초기 샘플 시드를 조절합니다.</sub></td></tr>
  </tbody>
</table>

<p><sub><strong>수학적 배경</strong></sub></p>
<p><sub>θ∈[0,2π), 기준 측도 dθ/(2π)를 사용합니다. p₀(θ)=1+Σₖ[aₖcos(kθ)+bₖsin(kθ)], k≤24이며 초기 계수는 항상 양의 밀도를 만들도록 제한합니다. Lebesgue 측도 기준 밀도는 p/(2π)입니다. D=1인 열방정식 ∂ₜp=∂²θp의 각 모드 감쇠율은 hₖ(t)=exp(−k²t)입니다.</sub></p>
<p><sub>관측 yₖ=hₖcₖ+ηₖ에서 각 실수 계수의 ηₖ는 독립적인 Uniform[−ε,ε]입니다. 측정 오차는 Brownian 입자 노이즈와 구별합니다. 단순 역산의 이득은 1/hₖ, cutoff는 k&gt;K의 이득을 0으로, Tikhonov는 gₖ=hₖ/(hₖ²+λ)로 둡니다. 평균 모드는 변형하지 않습니다.</sub></p>
<p><sub>Parseval 등식에 따른 L² 오차는 √(Σₖ[(aₖ−âₖ)²+(bₖ−b̂ₖ)²]/2)입니다. 기대 제곱오차는 (1/2)Σₖ(gₖhₖ−1)²(aₖ²+bₖ²)+(ε²/3)Σₖgₖ²이며, 두 항이 편향 제곱과 노이즈 분산입니다. 사이트에는 수식과 그래프를 함께 제시합니다.</sub></p>
<p><sub>퍼즐은 모든 실수 계수의 잔차가 ε 이하인 후보를 관측과 양립한다고 판정합니다. 두 후보 이상이 양립하면 이 후보 집합과 오차 모델 아래에서 식별 불가능합니다. 이는 통계적 신뢰구간이 아닙니다. 유한 모드의 오차 없는 관측은 정확히 역산 가능합니다.</sub></p>
<p><sub>생성 실험은 sₜ=∂θlog(pₜ)를 해석식으로 계산합니다. 역방향 시간 r=T−t에서 SDE는 dΘᵣ=2sₜ(Θᵣ)dr+√2dBᵣ, ODE는 dΘᵣ=sₜ(Θᵣ)dr입니다. 두 식의 Fokker–Planck 방정식은 qᵣ=pₜ에서 ∂ᵣq=−∂²θq로 일치합니다. 초기 512개 입자는 정확한 pT에서 rejection sampling하고 두 방법이 공유합니다. SDE는 Euler–Maruyama, ODE는 Euler로 적분하며 32구간 히스토그램을 표시합니다. Δ₆는 처음 6개 Fourier 모드의 경험적 모멘트 오차입니다.</sub></p>

<p><sub><strong>주요 관찰과 한계</strong></sub></p>
<p><sub>고주파의 빠른 감쇠는 역산에서 오차의 지수적 증폭으로 이어집니다. 정규화는 편향과 분산을 교환하고, 시각적인 선명함이 정확한 복원을 보장하지 않습니다. 음수 밀도나 큰 진동을 숨기지 않으며 각 복원 그래프는 독립적인 축을 표시합니다. 밀도 계수의 역문제와 score 기반 입자 생성은 다른 작업입니다. 정확한 score의 주변분포 일치는 유한 표본의 히스토그램 일치를 뜻하지 않습니다. 생성에는 Monte Carlo 및 적분 오차가 남습니다. 신경망 학습과 새로운 알고리즘 개발은 하지 않습니다.</sub></p>

<p><sub><strong>파일과 검증</strong></sub></p>
<p><sub><code>index.html</code>: 수식과 본문 · <code>style.css</code>: 반응형 디자인 · <code>math.js</code>: Fourier·복원·위험도·score·샘플링 · <code>app.js</code>: SVG와 상호작용 · <code>math.test.cjs</code>: 수학 검증. <code>node --test math.test.cjs</code>로 밀도 양성, 질량 보존, 정확한 역산, semigroup, score 미분, 식별 가능성, Monte Carlo 위험도, 생성 모멘트를 검사합니다.</sub></p>
<p><sub>저장소 루트의 <code>.github/workflows/pages.yml</code>이 검증 후 웹 자산 네 개만 게시합니다. 빌드 결과 디렉터리는 버전에 저장하지 않습니다.</sub></p>

<p><sub><strong>참고</strong></sub></p>
<p><sub>강의 Lecture 2 · Score-Based Perspective / Lecture 3 · Score SDE Framework / Lecture A · Differential Equations.<br><a href="https://the-principles-of-diffusion-models.github.io/#/blog">Tracing the Principles Behind Modern Diffusion Models</a> — 스크롤형 수식·시각화 구성 참고.<br><a href="https://arxiv.org/abs/2011.13456">Song et al., Score-Based Generative Modeling through Stochastic Differential Equations, ICLR 2021</a>.<br>Evans, Partial Differential Equations — Heat equation.</sub></p>
