/* English is the submission default; Korean has its own Korean ver/ entry point.
   Both views use the same DOM, controls, equations, and numerical model. */
(function(){
  'use strict';
  const prose={
  "prose-00": {
    "en": "Diffusion,<br><span>piece by piece.</span>",
    "ko": "퍼즐로 보는<br><span>확산과 역과정</span>"
  },
  "prose-01": {
    "en": "A jigsaw experiment in noise, score, and two reverse paths.",
    "ko": "노이즈, score, 두 가지 역과정을 살펴보는 직소퍼즐 실험."
  },
  "prose-02": {
    "en": "How do scattered pieces come together? Start with the puzzle, then explore the equations and spectral experiments below.",
    "ko": "흩어진 조각은 어떻게 다시 모일까? 퍼즐의 움직임에서 시작해 수식과 아래의 심화 실험으로 이어진다."
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
    "en": "Noise moves each piece away from its place. The score points toward more likely positions. Two reverse processes bring the pieces back into a coherent picture.",
    "ko": "노이즈는 조각의 위치를 흐트러뜨린다. Score는 더 가능성 높은 위치를 가리킨다. 두 가지 역과정으로 조각이 다시 모이는 모습을 비교한다."
  },
  "prose-14": {
    "en": "This puzzle uses a known reference layout to make the score visible. The experiments below retain the spectral view of diffusion and the distinction between inversion and generation.",
    "ko": "이 퍼즐은 알려진 완성 배치로 score의 의미를 시각화한다. 아래의 심화 실험은 주파수 관점의 확산과 역산·생성의 차이를 다룬다."
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
    "en": "The puzzle uses an independent Gaussian model with a known reference layout and analytic score. Fourier evolution, inverse filters, and expected error in the spectral experiments are also analytic.",
    "ko": "퍼즐은 알려진 기준 배치와 해석적 score를 갖는 독립 가우시안 모델을 사용한다. 주파수 실험의 Fourier 시간 변화, 역산 필터와 기대 오차도 해석식으로 계산한다."
  },
  "prose-24": {
    "en": "Coefficient measurement noise and Brownian sampling noise are separate. Reconstructions retain negative values. Particle generation uses numerical integration, 512 samples, and 32 histogram bins.",
    "ko": "측정 오차와 Brownian 샘플링 잡음은 별개이다. 역산 결과의 음수 값도 유지한다. 원 위의 생성 실험은 표본 512개와 히스토그램 32구간을 사용한다."
  },
  "prose-25": {
    "en": "Lecture 2: scores and denoising. Lecture 3: forward SDEs, Fokker–Planck, reverse SDEs, and probability flow ODEs. Lecture A: Euler and Euler–Maruyama.",
    "ko": "Lecture 2: score와 denoising. Lecture 3: forward SDE, Fokker–Planck, reverse SDE, probability flow ODE. Lecture A: Euler와 Euler–Maruyama."
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
  },
  "jig-title": {
    "en": "Diffusion, one piece at a time",
    "ko": "조각의 움직임으로 보는 확산"
  },
  "jig-intro1": {
    "en": "01 · Add position noise",
    "ko": "01 · 위치에 노이즈 추가"
  },
  "jig-intro2": {
    "en": "02 · Follow the score",
    "ko": "02 · Score 방향으로 이동"
  },
  "jig-intro3": {
    "en": "03 · Compare two paths",
    "ko": "03 · 두 경로 비교"
  },
  "jig-drag": {
    "en": "Drag a piece · arrow keys to move",
    "ko": "조각 드래그 · 방향키로 이동"
  },
  "jig-reference": {
    "en": "Reference picture",
    "ko": "완성 그림"
  },
  "jig-pieces-label": {
    "en": "Pieces",
    "ko": "조각 수"
  },
  "jig-noise": {
    "en": "Noise amount",
    "ko": "노이즈 크기"
  },
  "jig-shuffle": {
    "en": "New noise",
    "ko": "다른 노이즈"
  },
  "jig-reset": {
    "en": "Noise 0",
    "ko": "노이즈 0"
  },
  "jig-control-note": {
    "en": "The picture stays the same. Only the positions change.",
    "ko": "그림은 유지되고 조각의 위치만 바뀐다."
  },
  "jig-symbols": {
    "en": "x₀: starting position · T: noise time · ε: random displacement · D = 0.03",
    "ko": "x₀: 시작 위치 · T: 노이즈 시간 · ε: 무작위 변위 · D = 0.03"
  },
  "jig-score-title": {
    "en": "What moves a piece?",
    "ko": "조각은 어느 방향으로 움직일까?"
  },
  "jig-score-copy": {
    "en": "The blue arrow is the score. In this model, it points from the current position x toward the reference position μ. As noise decreases, the same displacement produces a stronger score.",
    "ko": "파란 화살표가 score이다. 이 모델에서는 현재 위치 x에서 기준 위치 μ를 향한다. 노이즈가 줄어들수록 같은 위치 차이에 대한 score가 커진다."
  },
  "jig-compare": {
    "en": "Two ways to reassemble",
    "ko": "다시 모이는 두 가지 경로"
  },
  "jig-compare-copy": {
    "en": "Both start from the same scattered pieces. The ODE follows a fixed path. The SDE adds fresh random motion along the way.",
    "ko": "같은 배치에서 출발한다. ODE는 정해진 경로를 따르고, SDE는 이동 중에도 새로운 무작위 흔들림을 더한다."
  },
  "jig-progress-label": {
    "en": "Reverse progress",
    "ko": "역과정 진행률"
  },
  "jig-path-title": {
    "en": "One piece, two trajectories",
    "ko": "한 조각의 두 이동 경로"
  },
  "jig-path-copy": {
    "en": "Blue: ODE · Orange: SDE. A smooth return and a noisy return can lead to the same final distribution.",
    "ko": "파랑: ODE · 주황: SDE. 매끄러운 경로와 흔들리는 경로가 같은 최종 분포로 이어질 수 있다."
  },
  "jig-math-title": {
    "en": "Equations and numerical accuracy",
    "ko": "수식과 수치 계산의 정확도"
  },
  "jig-assumption": {
    "en": "Each piece position has a Gaussian distribution around its known reference μ. Positions are independent, with σ₀ = 0.004. The model illustrates diffusion of positions; it does not infer the image or discover the solution to an unknown puzzle.",
    "ko": "각 조각의 위치는 알려진 기준 위치 μ 주변의 가우시안 분포를 따른다. 조각의 위치는 독립이고 σ₀ = 0.004이다. 위치의 확산을 보여주는 모델이며, 그림을 인식하거나 모르는 퍼즐의 정답을 찾는 방식은 아니다."
  },
  "jig-derive": {
    "en": "Differentiating log pₜ = constant − ‖x − μ‖²/(2v(t)) gives the score above. The arrow displays its direction, with length capped for readability.",
    "ko": "log pₜ = 상수 − ‖x − μ‖²/(2v(t))를 x로 미분하면 위의 score를 얻는다. 화살표는 그 방향을 표시하며 길이는 화면에 맞게 제한한다."
  },
  "jig-marginals": {
    "en": "With an exact score and initial samples from pT, both continuous-time processes have distribution pₜ at the same remaining time. Their individual paths differ. Manually moving a piece changes the initial distribution, so this equality no longer applies to that edited sample.",
    "ko": "정확한 score를 사용하고 pT에서 출발하면 두 연속시간 과정은 같은 남은 시간에 같은 분포 pₜ를 갖는다. 개별 경로는 다르다. 조각을 직접 옮기면 초기분포가 바뀌므로 수정된 배치에 이 일치를 적용할 수 없다."
  },
  "jig-solver-label": {
    "en": "Calculation",
    "ko": "계산 방법"
  },
  "jig-steps-label": {
    "en": "Steps",
    "ko": "계산 횟수"
  },
  "jig-seed-label": {
    "en": "Random seed",
    "ko": "난수 시드"
  },
  "jig-error-label": {
    "en": "ODE error against the exact solution",
    "ko": "정확한 해 대비 ODE 오차"
  },
  "jig-exact": {
    "en": "Default: exact Gaussian updates. Let z = x − μ, v = v(t), v′ = v(t − Δr), and q = v′/v. The ODE scales z by √q. The SDE draws from its exact reverse conditional distribution:",
    "ko": "기본값은 정확한 가우시안 갱신이다. z = x − μ, v = v(t), v′ = v(t − Δr), q = v′/v로 둔다. ODE는 z를 √q배로 줄이고, SDE는 정확한 역방향 조건부분포에서 뽑는다."
  },
  "jig-grid": {
    "en": "Steps are spaced uniformly in log v(t). Euler and Euler–Maruyama approximate the continuous equations; increasing the step count reduces discretization error. Slider frames reuse the same ε for comparison and are not a Brownian trajectory. A small final variance remains: no pieces are snapped to the grid.",
    "ko": "시간 격자는 log v(t)를 균등하게 나눈다. Euler와 Euler–Maruyama는 연속 방정식을 근사하며 계산 횟수를 늘리면 이산화 오차가 줄어든다. 노이즈 슬라이더는 비교를 위해 같은 ε를 사용하며 Brownian 경로를 재생하지 않는다. 마지막에도 작은 분산이 남고, 조각을 정답 위치에 강제로 붙이지 않는다."
  },
  "jig-credit": {
    "en": "center-cropped for the puzzle; photo adaptation under the same license",
    "ko": "퍼즐에 맞춰 중앙 크롭 · 사진 변형물에 동일 라이선스 적용"
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
  "03 / THE INVERSE PROBLEM": "03 / 역문제",
  "04 / BIAS–VARIANCE TRADEOFF": "04 / 편향과 분산",
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
  "Five experiments, two analytic models": "다섯 가지 실험, 두 해석적 모델",
  "Diffusion puzzle": "확산 퍼즐",
  "01 / DIFFUSION PUZZLE": "01 / 확산 퍼즐",
  "02 / FORWARD DIFFUSION": "02 / 정방향 확산",
  "03 / INVERSE PROBLEM": "03 / 역문제",
  "04 / REGULARIZATION": "04 / 정규화",
  "04 / STABILITY": "04 / 안정성",
  "03 / INVERSE RECONSTRUCTION": "03 / 역산과 복원",
  "Puzzle first · further analysis below": "퍼즐 실험 · 아래에서 심화 분석",
  "Exact score · interactive equations": "정확한 score · 연동되는 수식",
  "Exact density and score from §02": "실험 02의 정확한 밀도·score",
  "Exact Gaussian": "정확한 가우시안 계산",
  "Jigsaw pieces. Drag a piece or use arrow keys to move the selected piece.": "직소퍼즐. 조각을 드래그하거나 방향키로 선택한 조각 이동.",
  "Tabby cat photograph used for the jigsaw": "직소퍼즐에 사용한 줄무늬 고양이 사진",
  "PROBABILITY FLOW ODE puzzle positions": "Probability flow ODE에 따른 퍼즐 위치",
  "REVERSE SDE puzzle positions": "역 SDE에 따른 퍼즐 위치",
  "Selected puzzle piece trajectories": "선택한 조각의 이동 경로"
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
