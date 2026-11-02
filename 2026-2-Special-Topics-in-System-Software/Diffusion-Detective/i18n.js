/* Shared paired prose. Numerical computation is language-independent. */
(function(){
'use strict';
  const prose={
  "nav-geometry": {
    "en": "Covariance & Jacobian",
    "ko": "공분산과 Jacobian"
  },
  "nav-sensitivity": {
    "en": "Local sensitivity",
    "ko": "국소 민감도"
  },
  "nav-posterior": {
    "en": "Optimality & validity",
    "ko": "최적성과 샘플 타당성"
  },
  "nav-puzzle": {
    "en": "Predictor error · puzzle",
    "ko": "예측기 오차와 퍼즐"
  },
  "nav-notes": {
    "en": "Scope & references",
    "ko": "범위와 참고문헌"
  },
  "hero-title": {
    "en": "When optimal denoising<br><span>amplifies perturbations.</span>",
    "ko": "최적의 복원은<br><span>언제 변화를 증폭할까?</span>"
  },
  "hero-lead": {
    "en": "Posterior covariance, denoiser Jacobians, and the limits of minimum-MSE reconstruction.",
    "ko": "사후 공분산, 복원 함수의 Jacobian, 최소 MSE 복원의 한계."
  },
  "hero-question": {
    "en": "A Bayes-optimal denoiser minimizes reconstruction error. Does it also suppress small changes in the observation? The answer is controlled by posterior uncertainty.",
    "ko": "Bayes 최적 복원기는 복원 오차를 최소화한다. 관측값의 작은 변화도 항상 억제할까? 그 답은 사후 불확실성에 의해 결정된다."
  },
  "hero-meta": {
    "en": "Starting point: DDPM/NCSN prediction identities · extension: local sensitivity",
    "ko": "출발점: DDPM·NCSN 예측 관계식 · 확장: 국소 민감도"
  },
  "geometry-number": {
    "en": "01 / ESTIMATOR GEOMETRY",
    "ko": "01 / 복원 함수의 기하"
  },
  "geometry-title": {
    "en": "From Tweedie’s identity to a covariance Jacobian",
    "ko": "Tweedie 공식에서 공분산 Jacobian으로"
  },
  "geometry-start": {
    "en": "Fix a noise level: y = ax₀ + σε with a > 0 and ε ∼ 𝒩(0, I). Write D(y) = E[x₀ | y], ε*(y) = E[ε | y], and s*(y) = ∇ log p(y). Starting from the lecture’s prediction identities, differentiate D with respect to its observation.",
    "ko": "한 노이즈 수준에서 y = ax₀ + σε, a > 0, ε ∼ 𝒩(0, I)로 둔다. D(y) = E[x₀ | y], ε*(y) = E[ε | y], s*(y) = ∇ log p(y)로 쓴다. 강의의 예측 관계식을 출발점으로 D를 관측값에 대해 미분한다."
  },
  "geometry-theorem": {
    "en": "The local response of the optimal denoiser is determined by its posterior covariance:",
    "ko": "최적 복원기의 국소 반응은 사후 공분산으로 결정된다."
  },
  "geometry-meaning": {
    "en": "For a unit direction v, the directional gain vᵀJ_Dv equals (a/σ²) Var(vᵀx₀ | y). An unresolved direction in the posterior can therefore become an amplified direction in the output. Minimum MSE does not imply a contraction.",
    "ko": "단위 방향 v의 증폭률 vᵀJ_Dv는 (a/σ²) Var(vᵀx₀ | y)이다. 사후분포에서 결정되지 않은 방향은 출력 변화가 증폭되는 방향이 될 수 있다. 최소 MSE라는 성질만으로 수축성이 보장되지는 않는다."
  },
  "geometry-proof-title": {
    "en": "Derivation from the posterior score",
    "ko": "사후분포의 score를 이용한 유도"
  },
  "geometry-proof-text": {
    "en": "Differentiate under the posterior integral. Gaussian smoothing and finite conditional second moments justify the identity under the usual integrability conditions. The result applies to a general prior; the next experiment uses a finite prior so every term can be checked exactly.",
    "ko": "사후분포 적분을 미분하면 위 관계를 얻는다. 가우시안 평활화와 유한 조건부 이차 모멘트 아래에서 통상적인 적분 가능 조건을 가정한다. 관계식은 일반 사전분포에 적용되며, 다음 실험에서는 각 항을 정확히 확인할 수 있는 유한 사전분포를 사용한다."
  },
  "geometry-credit": {
    "en": "Extension of lecture 2’s Tweedie formula; derivative identity:",
    "ko": "강의 2의 Tweedie 공식에서 확장한 분석 · 미분 관계식:"
  },
  "sensitivity-number": {
    "en": "02 / LOCAL SENSITIVITY",
    "ko": "02 / 국소 민감도"
  },
  "sensitivity-title": {
    "en": "Measure the response to an observation perturbation",
    "ko": "관측값의 작은 변화가 출력에 미치는 영향"
  },
  "sensitivity-model": {
    "en": "Use the symmetric prior P(x₀ = ±1) = 1/2 as an exact stress test. Its posterior mean and derivative are available in closed form:",
    "ko": "대칭 사전분포 P(x₀ = ±1) = 1/2로 민감도를 정확히 분석한다. 사후평균과 미분은 다음과 같다."
  },
  "scheme-label": {
    "en": "Amplitude convention",
    "ko": "신호 진폭 설정"
  },
  "sigma-label": {
    "en": "Noise level σ",
    "ko": "노이즈 수준 σ"
  },
  "y-label": {
    "en": "Base observation y",
    "ko": "기준 관측값 y"
  },
  "h-label": {
    "en": "Observation perturbation h",
    "ko": "관측 변화 h"
  },
  "curve-caption": {
    "en": "Solid: D(y). Dashed: tangent at the selected observation. Dots: y and y+h.",
    "ko": "실선: D(y). 점선: 선택한 관측점의 접선. 두 점: y와 y+h."
  },
  "gain-caption": {
    "en": "The shaded interval has D′(y) > 1. The scale follows the peak derivative.",
    "ko": "음영 구간은 D′(y) > 1인 영역이다. 세로 눈금은 미분의 최댓값에 맞춘다."
  },
  "gain-metric": {
    "en": "Local gain D′(y)",
    "ko": "국소 증폭률 D′(y)"
  },
  "variance-metric": {
    "en": "Posterior variance",
    "ko": "사후분산"
  },
  "curvature-metric": {
    "en": "Score derivative s′(y)",
    "ko": "Score의 미분 s′(y)"
  },
  "actual-change": {
    "en": "Actual output change",
    "ko": "실제 출력 변화"
  },
  "linear-change": {
    "en": "Linear prediction D′(y)h",
    "ko": "선형 예측 D′(y)h"
  },
  "linear-remainder": {
    "en": "Linearization residual",
    "ko": "선형 근사 잔차"
  },
  "finite-step-note": {
    "en": "D′ is a local quantity. A finite h can cross the steep transition region, so its secant gain need not equal D′(y). Reducing h tests the linear approximation directly.",
    "ko": "D′는 국소적인 양이다. 유한한 h는 급격한 전이 구간을 가로지를 수 있어 실제 증폭률이 D′(y)와 다를 수 있다. h를 줄이면 선형 근사의 정확도를 직접 확인할 수 있다."
  },
  "rare-event-title": {
    "en": "Large local gain can be a rare event",
    "ko": "큰 국소 증폭이 드문 사건일 수 있다"
  },
  "rare-event-copy": {
    "en": "At y = 0, D′(0) = a/σ² grows as noise decreases. But y = 0 also lies between the clean modes and can become extremely unlikely. A large worst-case derivative is not the same as a large average reconstruction error.",
    "ko": "y = 0에서 D′(0) = a/σ²는 노이즈가 줄어들수록 커진다. 반면 y = 0은 두 원본 모드 사이에 있어 매우 드문 관측이 될 수 있다. 최악의 국소 민감도와 평균적인 복원 오차는 같은 지표가 아니다."
  },
  "region-mass": {
    "en": "P(D′(Y) > 1), integrated under p(y):",
    "ko": "관측분포로 적분한 P(D′(Y) > 1):"
  },
  "posterior-number": {
    "en": "03 / OPTIMALITY & VALIDITY",
    "ko": "03 / 최적성과 타당한 샘플"
  },
  "posterior-title": {
    "en": "Bayes optimality, stability, and valid samples are different",
    "ko": "Bayes 최적성·안정성·샘플의 타당성은 다르다"
  },
  "posterior-intro": {
    "en": "For the same posterior, compare three decisions: the conditional mean, a MAP estimate, and an independent posterior draw. They optimize different criteria. At the symmetric boundary, the mean is unsupported even though it has the smallest conditional MSE.",
    "ko": "같은 사후분포에서 조건부 평균, MAP 추정, 독립적인 사후 샘플을 비교한다. 각 선택은 서로 다른 기준을 따른다. 대칭 경계에서는 평균이 데이터 지지집합에 없더라도 조건부 MSE가 가장 작다."
  },
  "posterior-shared": {
    "en": "Uses the same σ and y as the sensitivity experiment",
    "ko": "민감도 실험과 같은 σ, y 사용"
  },
  "ambiguous-label": {
    "en": "Set y = 0",
    "ko": "y = 0으로 설정"
  },
  "posterior-sample-label": {
    "en": "Draw one candidate",
    "ko": "후보 하나 뽑기"
  },
  "risk-intro": {
    "en": "A candidate estimate u has two costs: its distance from the conditional mean, and the uncertainty that remains after observing y. Only the first can be reduced by choosing u.",
    "ko": "추정값 u의 오차는 조건부 평균에서 벗어난 정도와 관측 후에도 남은 불확실성으로 나뉜다. u를 바꿔 줄일 수 있는 것은 첫 항이다."
  },
  "estimate-label": {
    "en": "Candidate estimate u",
    "ko": "추정값 u"
  },
  "risk-total": {
    "en": "Conditional MSE",
    "ko": "조건부 MSE"
  },
  "risk-excess": {
    "en": "Distance penalty",
    "ko": "평균과의 거리 비용"
  },
  "risk-floor": {
    "en": "Remaining uncertainty",
    "ko": "남은 불확실성"
  },
  "optimal-label": {
    "en": "Use the conditional mean",
    "ko": "조건부 평균으로 설정"
  },
  "mean-derive-title": {
    "en": "Why the conditional mean minimizes MSE",
    "ko": "조건부 평균이 MSE를 최소화하는 이유"
  },
  "mean-derive-text": {
    "en": "The conditional mean has risk Var(x₀|y). For an independent posterior draw X̃₀, averaging over both X₀ and X̃₀ doubles that variance. For this binary prior the MAP risk is 2(1 − |D(y)|). A supported output and minimum MSE are distinct goals.",
    "ko": "조건부 평균의 위험은 Var(x₀|y)이다. 사후분포에서 독립적으로 뽑은 X̃₀는 X₀와 X̃₀ 모두에 대해 평균하면 위험이 그 분산의 두 배가 된다. 이 이진 사전분포에서 MAP의 위험은 2(1 − |D(y)|)이다. 지지집합에 속하는 출력과 최소 MSE는 서로 다른 목표이다."
  },
  "mean-decision": {
    "en": "Mean: conditional risk",
    "ko": "평균의 조건부 위험"
  },
  "sample-decision": {
    "en": "Posterior draw: expected risk",
    "ko": "사후 샘플의 기대 위험"
  },
  "map-decision": {
    "en": "MAP: conditional risk",
    "ko": "MAP의 조건부 위험"
  },
  "jig-title": {
    "en": "A puzzle of noise prediction",
    "ko": "노이즈 예측으로 복원하는 퍼즐"
  },
  "prose-13": {
    "en": "Observation sensitivity and predictor error are separate mechanisms. The experiments above differentiate the exact estimator with respect to y. This photographic puzzle holds an observation fixed and changes the error in its predicted noise.",
    "ko": "관측값에 대한 민감도와 예측기 오차는 별개이다. 앞에서는 정확한 복원기를 y에 대해 미분했다. 사진 퍼즐에서는 관측을 고정한 채 예측한 노이즈의 오차를 바꾼다."
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
  "prose-14": {
    "en": "A small pointwise prediction error does not control the derivative of that error. The puzzle measures pointwise reconstruction error; the preceding Jacobian experiment measures response to observation perturbations.",
    "ko": "한 점에서 예측 오차가 작다고 그 오차의 미분까지 작다는 보장은 없다. 퍼즐은 점별 원본 추정 오차를 측정하고, 앞의 Jacobian 실험은 관측 변화에 대한 반응을 측정한다."
  },
  "jig-credit": {
    "en": "center-cropped; photo adaptation under the same license",
    "ko": "중앙 크롭 · 사진 변형물에 동일 라이선스 적용"
  },
  "learned-title": {
    "en": "Extending the identity to an imperfect score",
    "ko": "불완전한 score로의 확장"
  },
  "learned-copy": {
    "en": "A predictor can be accurate at a point but vary rapidly nearby. Controlling reconstruction error and controlling local sensitivity therefore require different information. The puzzle does not assume or measure a learned J_e.",
    "ko": "예측기는 한 점에서 정확해도 그 주변에서 급격하게 변할 수 있다. 복원 오차와 국소 민감도를 제어하려면 서로 다른 정보가 필요하다. 이 퍼즐은 학습된 J_e를 가정하거나 측정하지 않는다."
  },
  "notes-number": {
    "en": "05 / SCOPE & REFERENCES",
    "ko": "05 / 범위와 참고문헌"
  },
  "notes-title": {
    "en": "What is calculated, and what is assumed",
    "ko": "계산한 것과 가정한 것"
  },
  "notes-model-title": {
    "en": "Analytic probability model",
    "ko": "확률모델"
  },
  "notes-model": {
    "en": "The covariance–Jacobian identity assumes Gaussian corruption with scalar a > 0 and finite posterior second moments. The scalar experiment uses an equally weighted two-point prior. Its mean, derivatives, conditional risks, and amplification interval are analytic; the interval probability uses 512-panel Simpson quadrature.",
    "ko": "공분산·Jacobian 관계식은 스칼라 a > 0인 가우시안 노이즈와 유한 사후 이차 모멘트를 가정한다. 스칼라 실험은 동일 가중치의 두 점 사전분포를 사용한다. 평균, 미분, 조건부 위험과 증폭 구간은 해석식으로 계산하고, 구간 확률은 512구간 Simpson 적분으로 구한다."
  },
  "notes-training-title": {
    "en": "Training and implementation",
    "ko": "학습과 구현"
  },
  "notes-training": {
    "en": "All estimators are computed analytically; no network is trained. The photographic puzzle is a separate synthetic predictor-error experiment. Local denoiser expansion does not by itself establish instability of a multi-step diffusion sampler.",
    "ko": "추정기는 해석식으로 계산하며 신경망 학습은 수행하지 않는다. 사진 퍼즐은 별도의 모의 예측 오차 실험이다. 복원기의 국소 팽창만으로 다단계 diffusion sampler가 불안정하다고 결론 내릴 수는 없다."
  },
  "notes-course-title": {
    "en": "Course connections",
    "ko": "강의 연결"
  },
  "notes-course": {
    "en": "Lecture 1 supplies noise/x prediction and conditional-mean optimality. Lecture 2 supplies Tweedie’s formula and the score/noise identity. Differentiating these identities gives the local-sensitivity analysis developed here; it is an extension, not a claim that this whole derivation appeared in the lectures.",
    "ko": "강의 1의 노이즈·원본 예측과 조건부 평균 최적성, 강의 2의 Tweedie 공식과 score·노이즈 관계식을 출발점으로 삼는다. 이를 미분해 국소 민감도를 분석하는 부분은 여기서 확장한 내용이며, 전체 유도가 강의에 그대로 제시되었다는 뜻은 아니다."
  },
  "notes-reading-title": {
    "en": "Further reading",
    "ko": "참고문헌"
  }
};
  const ui={
  "CONTENTS": "목차",
  "INTERACTIVE COURSE NOTES": "강의 개념을 살펴보는 수학 노트",
  "Skip to the content": "본문으로 이동",
  "Source ↗": "소스 ↗",
  "On this page": "페이지 목차",
  "Language": "언어",
  "05 / PHOTO PUZZLE": "05 / 사진 퍼즐",
  "Noise prediction": "노이즈 예측",
  "Denoising score matching": "Denoising score matching",
  "q: fixed noising": "q: 고정된 노이즈 추가",
  "pϕ: learned reversal": "pϕ: 학습하는 역과정",
  "Noisy density from two original values": "두 원본 값에서 출발한 관측 밀도",
  "Exact score and rescaled optimal noise prediction": "정확한 score와 재조정한 최적 노이즈 예측",
  "Posterior probabilities of two originals and their mean": "두 원본의 사후확률과 조건부 평균",
  "Conditional squared error versus estimated clean value": "원본 추정값에 따른 조건부 제곱오차",
  "Noisy puzzle positions. Click a piece or use arrow keys to select.": "노이즈가 섞인 퍼즐 위치. 클릭 또는 방향키로 조각 선택.",
  "Estimated puzzle positions. Click a piece or use arrow keys to select.": "추정한 퍼즐 위치. 클릭 또는 방향키로 조각 선택.",
  "Noise level versus reconstruction error amplification": "노이즈 수준에 따른 원본 추정 오차의 증폭률",
  "04 / PREDICTOR ERROR": "04 / 예측기 오차",
  "Denoiser response with tangent and perturbed observation": "복원 함수와 접선 및 변화한 관측점",
  "Denoiser derivative and the region of local amplification": "복원 함수의 미분과 국소 증폭 구간"
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
