/* English is the submission default; Korean has its own Korean ver/ entry point.
   Both views use the same DOM, controls, equations, and numerical model. */
(function(){
  'use strict';
  const prose={
  "prose-00": {
    "en": "Diffusion and inversion:<br><span>a spectral view.</span>",
    "ko": "확산과 역과정의<br><span>주파수 해석</span>"
  },
  "prose-01": {
    "en": "Interactive experiments in Fourier attenuation, regularization, and score-based sampling.",
    "ko": "Fourier 감쇠, 정규화, score 기반 샘플링을 연결하는 인터랙티브 실험."
  },
  "prose-02": {
    "en": "A density on a circle connects spectral attenuation, inverse problems, and bias–variance analysis. Jigsaw positions provide a geometric extension, followed by score-based sampling.",
    "ko": "원 위의 확률밀도로 확산의 주파수 감쇠와 역문제를 분석한다. 이어서 정규화의 편향·분산, 퍼즐의 위치 확산, score 기반 샘플링을 비교한다."
  },
  "prose-03": {
    "en": "Start with a probability density wrapped around a circle, with 0 and 2π meeting at the same point. Brownian motion spreads its mass. The evolving density follows the <strong>heat equation</strong>.",
    "ko": "0과 2π가 연결되는 원 위의 확률밀도를 고려한다. Brownian motion에 따른 밀도 변화는 <strong>열방정식</strong>을 따른다."
  },
  "prose-04": {
    "en": "Each Fourier mode is an eigenfunction of the heat operator: ∂²θ cos(kθ) = −k² cos(kθ). Its coefficient decays by <strong>hₖ(t) = exp(−k²t)</strong>. Doubling the frequency quadruples the decay rate. Throughout, D = 1 and densities are measured relative to dθ/(2π).",
    "ko": "Fourier 모드는 열 연산자의 고유함수이며 ∂²θ cos(kθ) = −k² cos(kθ)를 만족한다. 각 계수는 <strong>hₖ(t) = exp(−k²t)</strong>만큼 감소한다. 주파수가 두 배가 되면 감쇠율은 네 배가 된다. 확산계수는 D = 1, 기준 측도는 dθ/(2π)이다."
  },
  "prose-05": {
    "en": "Shifting the pattern changes its phase. The decay rate stays the same: it depends only on frequency.",
    "ko": "위상 이동은 패턴의 위치를 바꾸지만 감쇠율에는 영향을 주지 않는다. 감쇠율은 주파수에만 의존한다."
  },
  "prose-06": {
    "en": "Fine detail lives at high frequencies, where diffusion acts fastest. The large-scale shape persists longer.",
    "ko": "확산 시간이 증가할수록 미세한 구조를 나타내는 고주파 성분이 빠르게 감소한다."
  },
  "prose-07": {
    "en": "For an exact observation, division by hₖ recovers the original coefficient. Add a small measurement error ηₖ, and the same division <strong>amplifies the error along with the signal</strong>. Here cₖ stands for either a sine or a cosine coefficient.",
    "ko": "오차가 없는 관측은 hₖ로 나누어 원래 계수를 복원할 수 있다. 측정 오차 ηₖ가 포함되면 같은 연산이 <strong>신호와 오차를 함께 증폭</strong>한다. cₖ는 사인 또는 코사인 계수이다."
  },
  "prose-08": {
    "en": "A hard cutoff removes high-frequency modes, taking both their noise and their signal out of the reconstruction.",
    "ko": "Cutoff보다 높은 주파수를 제거한다. 해당 모드의 잡음과 신호가 동시에 제외된다."
  },
  "prose-09": {
    "en": "The solution to min Σₖ|hₖcₖ − yₖ|² + λΣₖ|cₖ|². A penalty on coefficient size softens the inverse gain. The mean stays fixed.",
    "ko": "min Σₖ|hₖcₖ − yₖ|² + λΣₖ|cₖ|²의 해이다. 계수 크기에 대한 벌점이 역산 이득을 제한하며, 평균은 보존된다."
  },
  "prose-10": {
    "en": "A filter trades fidelity for stability. With gain gₖ, the reconstruction error splits into <strong>bias</strong> from shrinking the signal and <strong>noise</strong> passed through the filter.",
    "ko": "필터의 이득 gₖ에 따라 복원 오차는 신호 축소에 따른 <strong>편향</strong>과 필터를 통과한 <strong>잡음</strong>으로 분해된다."
  },
  "prose-11": {
    "en": "Each real coefficient receives independent Uniform[−ε, ε] noise, with variance ε²/3. Parseval’s identity turns coefficient errors into density error, giving an <strong>exact bias–variance decomposition</strong>.",
    "ko": "각 실수 계수에 독립적인 Uniform[−ε, ε] 오차를 더하며, 그 분산은 ε²/3이다. Parseval 등식으로 계수 오차를 밀도 오차로 변환하면 <strong>편향·분산의 정확한 분해</strong>를 얻는다."
  },
  "prose-12": {
    "en": "Expected RMSE is √𝔼‖p̂ − p₀‖². The dashed curve uses this particular noise realization. Knowing the source lets us compare both in this toy model.",
    "ko": "기대 RMSE는 √𝔼‖p̂ − p₀‖²이다. 점선은 현재 잡음 실현값의 복원 오차를 나타낸다. 알려진 원본을 기준으로 기대 오차와 실제 오차를 비교한다."
  },
  "prose-13": {
    "en": "A jigsaw represents a structured position space. Each piece has a two-dimensional position, and a grid graph connects neighbouring pieces. Gaussian diffusion perturbs the positions; an exact score guides the reverse process.",
    "ko": "퍼즐 조각의 2차원 위치를 확률변수로 두고, 이웃 조각을 격자 그래프로 연결한다. 위치에 가우시안 잡음을 추가한 뒤 정확한 score를 이용해 역과정을 계산한다."
  },
  "prose-14": {
    "en": "The reference layout μ and its graph define the prior. This experiment isolates the geometry of diffusion using a known layout; it does not infer an unknown solution from image content. Its parameters are independent of the Fourier experiments above.",
    "ko": "기준 배치 μ와 격자 그래프가 사전분포를 결정한다. 알려진 배치에서 확산의 기하학을 분석하는 모델이며, 이미지 내용으로 미지의 정답을 추론하지 않는다. 위의 Fourier 실험과는 독립적인 매개변수를 사용한다."
  },
  "prose-15": {
    "en": "So far, the unknown was a density recovered from its measured coefficients. Score-based generation starts with samples instead. The <strong>score sₜ(θ) = ∂θ log pₜ(θ)</strong> guides particles through a prescribed family of densities. Here it follows directly from the Fourier expansion.",
    "ko": "밀도 복원은 관측 계수에서 원본 밀도를 추정한다. Score 기반 생성은 <strong>sₜ(θ) = ∂θ log pₜ(θ)</strong>를 이용해 샘플을 이동시킨다. 이 모델의 score는 Fourier 전개를 미분하여 정확히 계산한다."
  },
  "prose-16": {
    "en": "Write reverse time as r = T − t. The reverse of forward Brownian motion dθ = √2 dWₜ and its probability flow ODE then become:",
    "ko": "역방향 시간을 r = T − t로 정의한다. Forward Brownian motion dθ = √2 dWₜ에 대응하는 역 SDE와 probability flow ODE는 다음과 같다."
  },
  "prose-17": {
    "en": "A score-driven drift and fresh Brownian noise shape each path.",
    "ko": "Score에 의한 drift와 Brownian noise가 경로를 결정한다."
  },
  "prose-18": {
    "en": "Each starting point determines a path. The score coefficient is half that of the SDE.",
    "ko": "초기조건이 주어지면 경로가 결정된다. Score 계수는 역 SDE의 절반이다."
  },
  "prose-19": {
    "en": "Both methods start with the same rejection samples from exact p<sub>T</sub>. This experiment uses the analytic score, independently of measurement noise ε above. Finite samples and integration steps introduce approximation error. Paths break at the circle’s 0/2π seam.",
    "ko": "정확한 p<sub>T</sub>에서 rejection sampling한 동일한 입자를 사용한다. Score는 위의 측정 오차 ε와 독립적으로 계산한다. 유한 표본 및 시간 이산화에 따른 오차가 포함되며, 0/2π 경계에서는 궤적을 끊어 표시한다."
  },
  "prose-20": {
    "en": "The moment error Δ₆ compares empirical coefficients âₖ = (2/N)Σᵢcos(kΘᵢ) and b̂ₖ = (2/N)Σᵢsin(kΘᵢ) with the target’s first six modes. It avoids histogram binning, while measuring only those six modes.",
    "ko": "모멘트 오차 Δ₆는 경험적 계수 âₖ = (2/N)Σᵢcos(kΘᵢ), b̂ₖ = (2/N)Σᵢsin(kΘᵢ)를 목표 밀도의 첫 여섯 모드와 비교한다. 히스토그램 구간에 의존하지 않지만, 이 여섯 모드의 차이만 측정한다."
  },
  "prose-21": {
    "en": "Set qᵣ = p<sub>T−r</sub>. Since qᵣs<sub>T−r</sub> = ∂θqᵣ, the drift and diffusion terms combine into the same density evolution:",
    "ko": "qᵣ = p<sub>T−r</sub>와 qᵣs<sub>T−r</sub> = ∂θqᵣ를 대입하면 두 과정은 같은 밀도 방정식으로 정리된다."
  },
  "prose-22": {
    "en": "The time-dependent score supplies the distributional information. With exact scores and continuous integration, both processes share the same marginals; their individual paths still differ.",
    "ko": "정확한 score와 연속시간에서 두 과정의 주변분포는 동일하다. 개별 샘플의 경로는 서로 다르다."
  },
  "prose-23": {
    "en": "Fourier evolution, inverse filters, expected error, and the jigsaw score are analytic. Initial Fourier coefficients are bounded to ensure positive densities.",
    "ko": "Fourier 시간 변화, 복원 필터, 기대 오차와 퍼즐 모델의 score를 해석적으로 계산한다. Fourier 초기 계수는 밀도의 양수성을 보장하는 범위로 제한한다."
  },
  "prose-24": {
    "en": "Coefficient measurement noise and Brownian sampling noise are separate. Reconstructions retain negative values. Particle generation uses numerical integration, 512 samples, and 32 histogram bins.",
    "ko": "측정 오차와 Brownian 샘플링 잡음은 별개이다. 역산 결과의 음수 값도 유지한다. 원 위의 생성 실험은 표본 512개와 히스토그램 32구간을 사용한다."
  },
  "prose-25": {
    "en": "Lecture 2: scores and denoising. Lecture 3: forward SDEs, Fokker–Planck, reverse SDEs, and probability flow ODEs. Lecture A: Euler and Euler–Maruyama.",
    "ko": "Lecture 2: score와 denoising. Lecture 3: forward SDE, Fokker–Planck, reverse SDE, probability flow ODE. Lecture A: Euler와 Euler–Maruyama."
  },
  "jig-scatter-title": {
    "en": "Position diffusion",
    "ko": "조각의 위치 확산"
  },
  "jig-scatter-desc": {
    "en": "Diffusion increases the variance of each piece’s position. Dragging a piece changes the initial condition.",
    "ko": "확산 시간에 따라 각 조각의 위치 분산이 증가한다. 조각을 드래그하면 초기조건이 변경된다."
  },
  "jig-drag-help": {
    "en": "Drag to move · arrows to nudge",
    "ko": "드래그로 이동 · 방향키로 미세 조절"
  },
  "jig-reset": {
    "en": "Reset pieces",
    "ko": "배치 초기화"
  },
  "jig-pieces": {
    "en": "Pieces",
    "ko": "조각 수"
  },
  "jig-seed": {
    "en": "Noise seed",
    "ko": "잡음 시드"
  },
  "jig-time": {
    "en": "Diffusion time",
    "ko": "확산 시간"
  },
  "jig-intact": {
    "en": "Together",
    "ko": "맞춰진 배치"
  },
  "jig-scattered": {
    "en": "Scattered",
    "ko": "흩어진 배치"
  },
  "jig-scatter-play": {
    "en": "Play diffusion",
    "ko": "확산 재생"
  },
  "jig-forward-caption": {
    "en": "Positions diffuse; the image stays fixed. Scrubbing t reuses ε to compare marginal distributions.",
    "ko": "이미지는 고정하고 위치만 확산한다. 시간 조절 시 ε를 고정하여 주변분포의 변화를 비교한다."
  },
  "jig-assemble-title": {
    "en": "Reverse-time assembly",
    "ko": "역과정에 따른 조립"
  },
  "jig-assemble-desc": {
    "en": "Both methods use the same initial positions and score. The ODE is deterministic; the SDE includes Brownian increments.",
    "ko": "동일한 초기 배치와 score를 사용한다. ODE는 결정론적 경로를, SDE는 잡음이 포함된 경로를 생성한다."
  },
  "jig-assemble-play": {
    "en": "Reassemble",
    "ko": "다시 맞추기"
  },
  "jig-reverse-time": {
    "en": "Sampling progress",
    "ko": "샘플링 진행"
  },
  "jig-solver": {
    "en": "Integrator",
    "ko": "적분 방법"
  },
  "jig-steps": {
    "en": "Steps",
    "ko": "적분 횟수"
  },
  "jig-solver-exact": {
    "en": "Exact Gaussian",
    "ko": "가우시안 정확 전이"
  },
  "jig-solver-euler": {
    "en": "Euler / Euler–Maruyama",
    "ko": "Euler / Euler–Maruyama 근사"
  },
  "jig-tag-ode": {
    "en": "Deterministic",
    "ko": "결정론적"
  },
  "jig-tag-sde": {
    "en": "Stochastic",
    "ko": "확률적"
  },
  "jig-trace": {
    "en": "SELECTED PIECE · PATH",
    "ko": "선택한 조각 · 이동 경로"
  },
  "jig-arrow-note": {
    "en": "Arrow on each puzzle = score direction",
    "ko": "퍼즐 위 화살표 = score 방향"
  },
  "jig-marginal-note": {
    "en": "Exact score + an initial draw from p<sub>T</sub> give the same marginals in continuous time. Dragging pieces instead tests a chosen initial condition.",
    "ko": "정확한 score와 p<sub>T</sub> 표본에서 출발하면 연속시간의 두 과정은 같은 주변분포를 갖는다. 직접 수정한 배치는 지정된 초기조건에서의 경로 비교에 해당한다."
  },
  "jig-step-note": {
    "en": "zₖ = uₖᵀ(x − μ), ξ ∼ 𝒩(0,1); v′ₖ is the next-step variance. Steps follow log variance. Both views share an auto-fitting camera.",
    "ko": "zₖ = uₖᵀ(x − μ), ξ ∼ 𝒩(0,1)이며 v′ₖ는 다음 단계의 분산이다. 시간 간격은 로그 분산에 따라 정해진다. 두 화면은 동일한 자동 줌을 사용한다."
  },
  "jig-geometry-title": {
    "en": "Neighbour structure and eigenmodes",
    "ko": "이웃 관계와 고유모드"
  },
  "jig-geometry-desc": {
    "en": "Grid eigenmodes distinguish collective displacement from local deformation. Coupling γ penalizes relative displacement between neighbours.",
    "ko": "격자 그래프의 고유모드는 전체 이동과 국소적인 변형을 구분한다. 연결 강도 γ는 이웃 간 변위 차이에 대한 벌점을 조절한다."
  },
  "jig-mode": {
    "en": "Mode",
    "ko": "고유모드"
  },
  "jig-deform": {
    "en": "Mode displacement",
    "ko": "모드 변위"
  },
  "jig-mode-note": {
    "en": "This view isolates one eigenmode. The two samplers above use all modes.",
    "ko": "선택한 고유모드의 변위를 표시한다. 역과정 계산에는 모든 모드가 사용된다."
  },
  "jig-coupling": {
    "en": "Neighbour coupling",
    "ko": "이웃 연결 강도"
  },
  "jig-energy-note": {
    "en": "The first term anchors each piece. The second penalizes disagreements between neighbours. Increasing γ suppresses high-frequency deformation.",
    "ko": "첫 항은 기준 위치에서의 이탈을, 두 번째 항은 이웃 간 변위 차이를 제어한다. γ가 증가하면 고주파 변형의 사전분산이 감소한다."
  },
  "jig-no-snap": {
    "en": "Small gaps remain because the target covariance Σ₀ is nonzero. Pieces are never snapped into place.",
    "ko": "목표 공분산 Σ₀가 0이 아니므로 최종 배치에도 작은 틈이 남는다. 조각의 좌표는 정답 위치로 강제 보정하지 않는다."
  },
  "link-forward-title": {
    "en": "Selected Fourier mode",
    "ko": "선택한 Fourier 모드"
  },
  "link-forward-text": {
    "en": "The selected mode decays independently. Phase φ changes its orientation; amplitude A changes its initial strength. The heat operator scales both sine and cosine coefficients by the same hₖ.",
    "ko": "선택한 모드는 다른 모드와 독립적으로 감쇠한다. 위상 φ는 위치를, 진폭 A는 초기 크기를 결정한다. 열 연산자는 사인·코사인 계수에 동일한 hₖ를 적용한다."
  },
  "derive-tik-title": {
    "en": "Derivation of the regularized inverse",
    "ko": "정규화 역산의 유도"
  },
  "derive-tik-text": {
    "en": "For each real coefficient, differentiate (hₖc − yₖ)² + λc² with respect to c. The normal equation gives the filter below. Larger λ limits noise amplification while increasing signal shrinkage.",
    "ko": "각 실수 계수에 대해 (hₖc − yₖ)² + λc²를 c로 미분한다. 정규방정식을 풀면 아래 필터를 얻는다. λ가 증가하면 잡음 증폭이 제한되는 동시에 신호의 축소 편향이 커진다."
  },
  "derive-risk-title": {
    "en": "Why the cross term vanishes",
    "ko": "교차항이 사라지는 조건"
  },
  "derive-risk-text": {
    "en": "The noise has zero mean, and the source coefficients are fixed. The expected bias–noise cross term is therefore zero. Under dθ/(2π), each sine and cosine has squared norm 1/2; this accounts for the factor in the risk formula.",
    "ko": "잡음의 평균은 0이고 원본 계수는 고정되어 있으므로 편향과 잡음의 교차항 기댓값은 0이다. 기준 측도 dθ/(2π)에서 사인·코사인의 제곱 노름은 각각 1/2이며, 이것이 위험 함수의 계수에 반영된다."
  },
  "derive-step-title": {
    "en": "From continuous dynamics to numerical updates",
    "ko": "연속 방정식의 수치적분"
  },
  "derive-step-text": {
    "en": "With reverse step Δr = T/N, Euler evaluates the score at the current position and time. Euler–Maruyama adds an independent standard normal increment ξₙ. Reducing Δr improves time resolution; finite-sample fluctuations remain.",
    "ko": "역방향 시간 간격은 Δr = T/N이다. Euler는 현재 위치와 시점의 score를 사용하며, Euler–Maruyama는 독립적인 표준정규 난수 ξₙ을 추가한다. Δr의 감소는 시간 해상도를 높이지만 유한 표본의 변동을 제거하지는 않는다."
  }
};
  const ui={
  "Diffusion Detective · Following the spectrum": "Diffusion Detective · 주파수로 읽는 확산",
  "An interactive essay on diffusion, spectral inversion, regularization, and score-based sampling.": "확산의 주파수 감쇠, 역문제, 정규화와 score 기반 샘플링을 연결하는 인터랙티브 실험 노트.",
  "Skip to the experiments": "본문으로 이동",
  "AN INTERACTIVE MATHEMATICAL ESSAY": "확산과 역과정을 탐색하는 수학 노트",
  "Source ↗": "소스 ↗",
  "CONTENTS": "목차",
  "On this page": "글 목차",
  "Language": "언어",
  "From density to samples": "밀도 복원에서 샘플 생성으로",
  "Model & references": "모델과 참고문헌",
  "2026 FALL": "2026 가을학기",
  "Special Topics in": "시스템소프트웨어특강",
  "System Software": "확산 모델의 수학적 원리",
  "DIFFUSION DETECTIVE / INTERACTIVE NOTES": "DIFFUSION DETECTIVE / 인터랙티브 노트",
  "STRUCTURE": "구조",
  "DIFFUSION": "확산",
  "UNCERTAINTY": "불확실성",
  "THE QUESTION": "분석 대상",
  "Five experiments, one model": "하나의 모델, 다섯 가지 실험",
  "Analytic Fourier dynamics": "해석적으로 계산하는 Fourier 모델",
  "Read, adjust, follow the change ↓": "매개변수와 수식의 실시간 연동",
  "01 / FORWARD DIFFUSION": "01 / 순방향 확산",
  "02 / THE INVERSE PROBLEM": "02 / 역문제",
  "03 / BIAS–VARIANCE TRADEOFF": "03 / 편향과 분산",
  "05 / FROM INVERSION TO GENERATION": "05 / 복원에서 생성으로",
  "06 / MODEL & REFERENCES": "06 / 모델과 참고문헌",
  "EXPERIMENT 01": "실험 01",
  "EXPERIMENT 02": "실험 02",
  "EXPERIMENT 03": "실험 03",
  "EXPERIMENT 05": "실험 05",
  "LIVE": "실시간",
  "Initial density": "초기 밀도",
  "Asymmetric": "비대칭 패턴",
  "Twin peaks": "두 봉우리",
  "Broad peak": "넓은 봉우리",
  "Phase φ": "위상 φ",
  "Detail frequency k": "미세 무늬 주파수 k",
  "Detail amplitude A": "미세 무늬 크기 A",
  "Initial p₀": "초기 밀도 p₀",
  "Diffused pₜ": "확산된 밀도 pₜ",
  "Initial and diffused density": "초기 밀도와 확산된 밀도",
  "Diffusion time T": "확산 시간 T",
  "0 · initial pattern": "0 · 초기 패턴",
  "0.12 · more smoothing": "0.12 · 더 강한 평활화",
  "FOURIER ATTENUATION · k × t": "FOURIER 감쇠율 · k × t",
  "Attenuation across time and frequency": "시간과 주파수에 따른 감쇠율",
  "IN THE SPECTRUM": "주파수에서 읽는 단서",
  "One observation, three reconstructions": "같은 관측, 세 가지 복원",
  "Same density and time as above": "앞 실험과 같은 밀도·시간",
  "Error bound ε": "측정 오차 한계 ε",
  "Cutoff K": "Cutoff 주파수 K",
  "Regularization log₁₀λ": "정규화 강도 log₁₀λ",
  "Reconstruction": "복원",
  "Source": "원본",
  "Independent vertical scales": "패널별 독립적인 세로축",
  "OBSERVED & RECOVERED AMPLITUDE": "관측·복원 주파수 진폭",
  "Dashed: error bound √2 ε · log scale": "점선: 오차 한계 √2 ε · 로그 축",
  "Observed and recovered amplitude by frequency": "주파수별 관측 및 복원 진폭",
  "SPECTRAL CUTOFF": "주파수 제한 · SPECTRAL CUTOFF",
  "TIKHONOV REGULARIZATION": "TIKHONOV 정규화",
  "The bias–variance curve": "편향과 분산의 변화",
  "Linked to the filter above": "앞 실험의 필터와 연동",
  "Expected RMSE": "기대 RMSE",
  "Bias": "편향",
  "Noise RMS": "노이즈 RMS",
  "Realized error": "현재 관측의 실제 오차",
  "Expected error, bias, noise, and realized error across regularization strengths": "정규화 강도에 따른 기대 오차, 편향, 노이즈 및 실제 오차",
  "Two paths through the same densities": "같은 밀도를 지나는 두 경로",
  "Exact density and score from §01": "실험 01의 정확한 밀도·score",
  "Reverse time r/T": "역과정 진행률 r/T",
  "Integration steps": "적분 스텝 수",
  "Initial sample seed": "초기 샘플 시드",
  "Sample histogram": "입자 히스토그램",
  "Exact target density": "정확한 목표 밀도",
  "N = 512 · shared initial samples": "N = 512 · 같은 초기 입자",
  "REVERSE SDE": "역 SDE",
  "Reverse SDE samples and exact density": "역 SDE 입자 분포와 정확한 밀도",
  "Sixteen reverse SDE sample paths": "역 SDE의 입자 16개 궤적",
  "Probability flow ODE samples and exact density": "Probability flow ODE 입자 분포와 정확한 밀도",
  "Sixteen probability flow ODE sample paths": "Probability flow ODE의 입자 16개 궤적",
  "A note on the model": "모델의 가정과 계산 범위",
  "Analytic quantities": "해석적으로 계산한 것",
  "Numerical quantities": "수치적으로 계산한 것",
  "Course connections": "강의와의 연결",
  "Further reading": "참고문헌",
  "Evans · Partial Differential Equations · Heat equation": "Evans · Partial Differential Equations · 열방정식",
  "SNU · SPECIAL TOPICS IN SYSTEM SOFTWARE · 2026": "서울대학교 · 시스템소프트웨어특강 · 2026",
  "Spectral attenuation": "주파수 감쇠",
  "Inverse reconstruction": "역문제와 복원",
  "Regularization": "정규화",
  "Bias–variance decomposition": "편향·분산 분해",
  "Initial conditions and diffusion time": "초기조건과 확산 시간",
  "Equality of the density equations": "두 밀도 방정식의 동치",
  "Jigsaw position diffusion": "퍼즐의 위치 확산",
  "Diffusion on a jigsaw graph": "퍼즐 그래프에서의 확산",
  "04 / JIGSAW POSITION DIFFUSION": "04 / 퍼즐의 위치 확산",
  "Five experiments, two analytic models": "다섯 가지 실험, 두 해석적 모델"
};
  const requested=new URLSearchParams(location.search).get('lang');
  let language=requested==='ko'||(requested!=='en'&&/\/Korean(?:%20| )ver\/(?:index\.html)?$/.test(location.pathname))?'ko':'en';
  const textNodes=[],attributes=[];
  const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const node=walker.currentNode;
    if(node.parentElement.closest('[data-i18n],math,script,style,.language-switch'))continue;
    const english=node.nodeValue.trim();
    if(Object.hasOwn(ui,english))textNodes.push({node,original:node.nodeValue,english});
  }
  document.querySelectorAll('[aria-label],meta[name="description"]').forEach(element=>{
    const attribute=element.tagName==='META'?'content':'aria-label',english=element.getAttribute(attribute);
    if(Object.hasOwn(ui,english))attributes.push({element,attribute,english});
  });
  function apply(){
    document.documentElement.lang=language;
    document.querySelectorAll('[data-i18n]').forEach(element=>{
      const entry=prose[element.dataset.i18n];
      if(!entry)throw new Error('Missing translation: '+element.dataset.i18n);
      element.innerHTML=entry[language];
    });
    for(const {node,original,english} of textNodes)node.nodeValue=language==='ko'?original.replace(english,ui[english]):original;
    for(const {element,attribute,english} of attributes)element.setAttribute(attribute,language==='ko'?ui[english]:english);
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.lang===language));
    document.documentElement.style.setProperty('--formula-scroll-label',language==='ko'?"'수식 좌우 스크롤 ↔'":"'Scroll to explore the equation ↔'");
  }
  function setLanguage(next){
    if(!['en','ko'].includes(next)||next===language)return;
    const section=[...document.querySelectorAll('.hero,.chapter')].find(el=>el.getBoundingClientRect().top<=100&&el.getBoundingClientRect().bottom>100);
    const offset=section?scrollY-section.offsetTop:scrollY;
    language=next;
    const url=new URL(location.href);
    url.pathname=url.pathname.replace(/\/(English|Korean)(?:%20| )ver\/(?:index\.html)?$/,(next==='ko'?'/Korean%20ver/':'/English%20ver/')+(url.pathname.endsWith('/index.html')?'index.html':''));
    url.searchParams.delete('lang');
    if(location.protocol==='file:'){url.pathname=location.pathname;url.searchParams.set('lang',next);}
    history.replaceState(null,'',url);
    apply();window.dispatchEvent(new Event('diffusionlanguagechange'));
    if(section)window.scrollTo({top:section.offsetTop+Math.min(offset,section.clientHeight-100),behavior:'instant'});
  }
  window.DiffusionI18n={get language(){return language;},text:(en,ko)=>language==='ko'?ko:en,setLanguage};
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
  apply();
})();
