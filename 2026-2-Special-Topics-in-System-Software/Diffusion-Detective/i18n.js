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
    "en": "Interactive experiments in diffusion, inversion, and noise prediction.",
    "ko": "확산, 역문제, 노이즈 예측을 연결하는 인터랙티브 실험."
  },
  "prose-02": {
    "en": "How does diffusion weaken a signal, and why does inversion amplify errors? Spectral experiments establish the principle; a photographic jigsaw applies it to noise prediction.",
    "ko": "확산은 신호를 어떻게 약하게 만들고, 역산은 왜 오차를 증폭할까? 주파수 실험으로 원리를 살펴본 뒤 사진 퍼즐에서 노이즈 예측에 적용한다."
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
    "en": "The same inversion question appears in diffusion models: how does an error in predicted noise affect the recovered signal? Here the signal is a vector of puzzle-piece positions.",
    "ko": "앞에서 본 역산의 문제가 diffusion model에서도 나타난다. 노이즈 예측이 틀리면 복원 결과는 얼마나 달라질까? 이 실험에서는 퍼즐 조각의 위치를 신호로 사용한다."
  },
  "prose-14": {
    "en": "The connection to the earlier inverse problem is the amplification factor. A weak signal makes inversion sensitive to error. The next section returns to score-based generation as a separate experiment.",
    "ko": "앞의 역문제와 연결되는 핵심은 오차 증폭이다. 신호가 약할수록 역산은 작은 오차에 민감해진다. 다음 절에서는 별도의 실험으로 score 기반 생성을 살펴본다."
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
    "en": "Fourier evolution, inverse filters, expected error, and the puzzle reconstruction identity are analytic. The puzzle uses known positions and synthetic noise predictions, with adjustable prediction error.",
    "ko": "Fourier 시간 변화, 역산 필터, 기대 오차와 퍼즐의 추정식은 해석식으로 계산한다. 퍼즐에서는 알려진 위치와 인위적으로 구성한 노이즈 예측을 사용하며 예측 오차를 조절한다."
  },
  "prose-24": {
    "en": "Coefficient measurement noise and Brownian sampling noise are separate. Reconstructions retain negative values. Particle generation uses numerical integration, 512 samples, and 32 histogram bins.",
    "ko": "측정 오차와 Brownian 샘플링 잡음은 별개이다. 역산 결과의 음수 값도 유지한다. 원 위의 생성 실험은 표본 512개와 히스토그램 32구간을 사용한다."
  },
  "prose-25": {
    "en": "Lecture 1: noise and x-prediction parameterizations. Lecture 2: scores and denoising. Lecture 3: reverse SDEs and probability flow ODEs. Lecture A: Euler and Euler–Maruyama.",
    "ko": "Lecture 1: 노이즈 예측과 원본 예측의 변환. Lecture 2: score와 denoising. Lecture 3: reverse SDE와 probability flow ODE. Lecture A: Euler와 Euler–Maruyama."
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
    "en": "A puzzle of noise prediction",
    "ko": "노이즈 예측으로 복원하는 퍼즐"
  },
  "jig-forward-copy": {
    "en": "Noise moves the pieces; aₜ also contracts their positions toward the center. The photograph and the shapes of the pieces remain fixed.",
    "ko": "노이즈가 조각을 흩뜨리고, aₜ는 위치를 중심 쪽으로 축소한다. 사진과 조각의 모양은 유지된다."
  },
  "jig-sigma-label": {
    "en": "Noise level σₜ",
    "ko": "노이즈 수준 σₜ"
  },
  "jig-error-label": {
    "en": "Prediction error η",
    "ko": "예측 오차 η"
  },
  "jig-pieces-label": {
    "en": "Pieces",
    "ko": "조각 수"
  },
  "jig-observed-title": {
    "en": "NOISY OBSERVATION · xₜ",
    "ko": "노이즈가 섞인 배치 · xₜ"
  },
  "jig-estimate-title": {
    "en": "RECONSTRUCTED POSITIONS · x̂₀",
    "ko": "추정한 원본 배치 · x̂₀"
  },
  "jig-shuffle": {
    "en": "New noise",
    "ko": "다른 노이즈"
  },
  "jig-perfect": {
    "en": "Zero prediction error",
    "ko": "예측 오차 0"
  },
  "jig-denoise-copy": {
    "en": "Subtract the predicted noise, then undo the contraction. The orange outline marks the same piece in the reconstructed picture.",
    "ko": "예측한 노이즈를 뺀 뒤 축소된 크기를 되돌린다. 주황색 윤곽은 추정 결과에서 같은 조각을 표시한다."
  },
  "jig-predictor": {
    "en": "The predictor is a controlled simulation: ε̂ = ε + ηz, with independent standard-normal z. The slider changes its error, not a trained network. η = 0 uses the true injected noise as an ideal reference.",
    "ko": "추정 노이즈는 ε̂ = ε + ηz로 구성한다. z는 독립적인 표준정규 난수이고, η로 예측 오차를 조절한다. 학습된 신경망 대신 예측 오차를 가정하는 실험이다. η = 0은 실제로 더한 노이즈를 사용하는 이상적인 기준이다."
  },
  "jig-error-title": {
    "en": "Why the same error matters more at high noise",
    "ko": "같은 예측 오차가 더 크게 나타나는 이유"
  },
  "jig-error-copy": {
    "en": "If the prediction misses the noise by δ, the position error is multiplied by σₜ/aₜ. More noise means less signal, so a small prediction error can leave a visibly misaligned puzzle.",
    "ko": "노이즈 예측이 δ만큼 틀리면 위치 오차에는 σₜ/aₜ가 곱해진다. 노이즈가 커지고 신호가 약해질수록 작은 예측 오차도 눈에 띄는 조각 어긋남으로 이어진다."
  },
  "jig-noise-rms": {
    "en": "Noise prediction RMS",
    "ko": "노이즈 예측 RMS"
  },
  "jig-gain-label": {
    "en": "Amplification σₜ/aₜ",
    "ko": "증폭률 σₜ/aₜ"
  },
  "jig-position-rms": {
    "en": "Position RMS",
    "ko": "위치 RMS"
  },
  "jig-detail-title": {
    "en": "Derivation and connection to the lecture",
    "ko": "수식 유도와 강의 내용 연결"
  },
  "jig-lecture": {
    "en": "Lecture 1, “One model, three parameterizations” (slide 60/85), converts noise prediction into x-prediction. Here aₜ denotes the lecture’s ᾱₜ, and σₜ = √(1 − aₜ²). All formulas apply coordinate by coordinate.",
    "ko": "강의 1의 “One model, three parameterizations”(60/85쪽)는 노이즈 예측과 원본 예측 사이의 변환을 다룬다. 여기서 aₜ는 강의의 ᾱₜ이고, σₜ = √(1 − aₜ²)이다. 모든 식은 각 좌표에 적용된다."
  },
  "jig-loss": {
    "en": "Define SNR = aₜ²/σₜ². Then the squared reconstruction error is the squared noise-prediction error divided by SNR. Equal noise-prediction error at two noise levels need not imply equal reconstruction error.",
    "ko": "SNR = aₜ²/σₜ²로 두면 원본 추정의 제곱오차는 노이즈 예측의 제곱오차를 SNR로 나눈 값이다. 서로 다른 노이즈 수준에서 예측 오차가 같아도 원본 추정 오차는 달라질 수 있다."
  },
  "jig-scope": {
    "en": "A puzzle image supplies recognizable pieces; the calculation acts on their continuous positions. The known original and injected noise make the error measurable. This is a single noise level and one reconstruction identity, rather than a full generative sampler or an image-recognition puzzle solver.",
    "ko": "사진은 조각을 구분하는 역할을 하고 계산 대상은 연속적인 조각 위치이다. 원본과 실제 노이즈를 알고 있어 오차를 측정할 수 있다. 한 노이즈 수준에서의 추정식을 다루며 전체 생성 샘플러나 그림 인식 기반 퍼즐 풀이를 구현한 것은 아니다."
  },
  "jig-seed-label": {
    "en": "Random seed",
    "ko": "난수 시드"
  },
  "jig-credit": {
    "en": "center-cropped; photo adaptation under the same license",
    "ko": "중앙 크롭 · 사진 변형물에 동일 라이선스 적용"
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
  "01 / FORWARD DIFFUSION": "01 / 정방향 확산",
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
  "Selected puzzle piece trajectories": "선택한 조각의 이동 경로",
  "02 / THE INVERSE PROBLEM": "02 / 역문제",
  "03 / BIAS–VARIANCE TRADEOFF": "03 / 편향과 분산",
  "04 / NOISE PREDICTION": "04 / 노이즈 예측",
  "Noise prediction puzzle": "노이즈 예측과 퍼즐",
  "Five experiments, linked by noise": "노이즈로 연결되는 다섯 가지 실험",
  "Noisy puzzle positions. Click a piece or use arrow keys to select.": "노이즈가 섞인 퍼즐 위치. 클릭 또는 방향키로 조각 선택.",
  "Estimated puzzle positions. Click a piece or use arrow keys to select.": "추정한 퍼즐 위치. 클릭 또는 방향키로 조각 선택.",
  "Noise level versus reconstruction error amplification": "노이즈 수준에 따른 원본 추정 오차의 증폭률"
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
