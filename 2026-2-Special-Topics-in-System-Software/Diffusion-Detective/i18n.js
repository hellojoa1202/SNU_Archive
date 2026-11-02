/* Shared paired prose. Numerical computation is language-independent. */
(function(){
'use strict';
  const prose={
  "jig-title": {
    "en": "A puzzle of noise prediction",
    "ko": "노이즈 예측으로 복원하는 퍼즐"
  },
  "prose-13": {
    "en": "The previous experiments use optimal conditional predictions. This puzzle isolates a different question: how does a specified error in noise prediction affect the reconstructed positions?",
    "ko": "앞의 실험은 최적의 조건부 예측을 다뤘다. 사진 퍼즐에서는 노이즈 예측에 주어진 오차가 있을 때 원본 위치 추정이 얼마나 달라지는지 확인한다."
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
    "en": "Conditional uncertainty and prediction error are different. Even an optimal predictor can leave uncertainty about the original; this puzzle separately measures the effect of an imposed error in the predicted noise.",
    "ko": "조건부 불확실성과 예측 오차는 서로 다르다. 최적 예측에도 원본에 대한 불확실성은 남을 수 있다. 이 퍼즐은 노이즈 예측에 인위적으로 더한 오차의 영향을 따로 측정한다."
  },
  "jig-credit": {
    "en": "center-cropped; photo adaptation under the same license",
    "ko": "중앙 크롭 · 사진 변형물에 동일 라이선스 적용"
  },
  "nav-reconstruction": {
    "en": "Reconstruction & generation",
    "ko": "복원과 생성"
  },
  "nav-forward": {
    "en": "Adding noise",
    "ko": "노이즈 추가"
  },
  "nav-prediction": {
    "en": "Noise prediction & score",
    "ko": "노이즈 예측과 score"
  },
  "nav-posterior": {
    "en": "Mean & uncertainty",
    "ko": "조건부 평균과 불확실성"
  },
  "nav-puzzle": {
    "en": "Photo puzzle",
    "ko": "사진 퍼즐"
  },
  "nav-notes": {
    "en": "Model & references",
    "ko": "모델과 참고문헌"
  },
  "hero-title": {
    "en": "What does a<br><span>denoiser predict?</span>",
    "ko": "복원 모델은<br><span>무엇을 예측할까?</span>"
  },
  "hero-lead": {
    "en": "From encoder–decoder reconstruction to DDPM, NCSN, and the conditional mean.",
    "ko": "Encoder·decoder의 복원에서 DDPM, NCSN, 조건부 평균으로 이어지는 실험."
  },
  "hero-question": {
    "en": "A noisy observation may have more than one possible source. These experiments connect the training objective, the predicted noise, and the reconstructed result.",
    "ko": "노이즈가 섞인 관측에는 여러 원본 후보가 있을 수 있다. 학습 목적함수, 예측한 노이즈, 복원 결과가 어떻게 연결되는지 살펴본다."
  },
  "hero-meta": {
    "en": "Lectures 1–2 · exact toy model · linked equations",
    "ko": "강의 1–2 중심 · 정확히 계산하는 예제 · 수식과 조작의 연결"
  },
  "reconstruction-number": {
    "en": "01 / RECONSTRUCTION & GENERATION",
    "ko": "01 / 복원과 생성"
  },
  "reconstruction-title": {
    "en": "Reconstruction begins with a representation",
    "ko": "표현을 거쳐 원본을 복원한다"
  },
  "recon-intro": {
    "en": "An autoencoder compresses x into a representation z and decodes it back. A VAE gives this representation a probability model, allowing new latent samples to be decoded into data.",
    "ko": "Autoencoder는 x를 표현 z로 압축한 뒤 다시 복원한다. VAE는 이 표현에 확률모델을 부여해 새로운 잠재변수에서도 데이터를 생성할 수 있게 한다."
  },
  "flow-data": {
    "en": "data",
    "ko": "데이터"
  },
  "flow-encoder": {
    "en": "encoder",
    "ko": "인코더"
  },
  "flow-latent": {
    "en": "latent variable",
    "ko": "잠재변수"
  },
  "flow-decoder": {
    "en": "decoder",
    "ko": "디코더"
  },
  "recon-elbo": {
    "en": "The first term rewards reconstruction; the KL term controls how the encoded distribution differs from the latent prior. With a Gaussian decoder of fixed variance, the reconstruction term becomes a squared-error objective up to scaling and constants.",
    "ko": "첫 항은 복원 성능을, KL 항은 인코딩된 분포와 잠재 사전분포의 차이를 다룬다. 분산이 고정된 가우시안 디코더에서는 복원 항이 상수와 배율을 제외하면 제곱오차 목적함수가 된다."
  },
  "recon-ddpm": {
    "en": "DDPM fixes the forward encoder to a Gaussian noising chain and learns the reverse process. Its prediction target can be the added noise, the clean signal, or an equivalent parameterization.",
    "ko": "DDPM은 정방향 인코더를 가우시안 노이즈를 더하는 과정으로 고정하고 역과정을 학습한다. 예측 대상은 더해진 노이즈, 원본 신호 또는 이와 동등한 표현으로 둘 수 있다."
  },
  "recon-bridge": {
    "en": "The shared question is what a squared-error predictor returns when several originals could explain the same representation. Sections 02–04 make that question exactly computable.",
    "ko": "서로 다른 원본이 같은 표현을 설명할 수 있을 때, 제곱오차로 학습한 모델은 무엇을 반환할까? 다음 실험에서는 그 답을 정확히 계산한다."
  },
  "forward-number": {
    "en": "02 / FORWARD NOISING",
    "ko": "02 / 정방향 노이즈 추가"
  },
  "forward-title": {
    "en": "Two possible originals, one noisy observation",
    "ko": "두 원본 후보와 하나의 관측"
  },
  "forward-intro": {
    "en": "Use a small data distribution: x₀ = −1 or +1, each with probability 1/2. Adding Gaussian noise turns these two points into overlapping distributions.",
    "ko": "작은 데이터 분포를 사용한다. x₀는 각각 확률 1/2로 −1 또는 +1이다. 가우시안 노이즈를 더하면 두 점에서 출발한 분포가 서로 겹친다."
  },
  "scheme-label": {
    "en": "Corruption model",
    "ko": "노이즈를 더하는 방식"
  },
  "sigma-label": {
    "en": "Noise level σₜ",
    "ko": "노이즈 수준 σₜ"
  },
  "new-samples-label": {
    "en": "Resample forward points",
    "ko": "정방향 표본 다시 뽑기"
  },
  "forward-notation": {
    "en": "Notation follows lecture 1: aₜ is its ᾱₜ, the signal amplitude. In DDPM, σₜ = √(1 − aₜ²). NCSN keeps aₜ = 1 and conditions its score network on the noise level. Here both can be inspected over the same σ range.",
    "ko": "강의 1의 표기에 맞춰 aₜ를 신호 진폭 ᾱₜ로 둔다. DDPM에서는 σₜ = √(1 − aₜ²)이다. NCSN은 aₜ = 1을 유지하며 노이즈 수준을 score network의 조건으로 사용한다. 여기서는 같은 σ 범위에서 두 방식을 관찰한다."
  },
  "prediction-number": {
    "en": "03 / NOISE PREDICTION & SCORE",
    "ko": "03 / 노이즈 예측과 SCORE"
  },
  "prediction-title": {
    "en": "Two predictions of the same conditional information",
    "ko": "같은 조건부 정보를 다르게 표현한다"
  },
  "prediction-intro": {
    "en": "DDPM trains a noise predictor. NCSN trains a noise-conditional score. For a fixed Gaussian corruption, their optimal predictions are related by a known scale factor.",
    "ko": "DDPM은 노이즈 예측을, NCSN은 노이즈 수준에 따른 score를 학습한다. 같은 가우시안 노이즈 모델에서 두 최적 예측값은 알려진 배율로 연결된다."
  },
  "observation-label": {
    "en": "Observed value y",
    "ko": "관측값 y"
  },
  "metric-eps": {
    "en": "Optimal noise prediction ε*",
    "ko": "최적 노이즈 예측 ε*"
  },
  "metric-score": {
    "en": "Marginal score s*",
    "ko": "관측 분포의 score s*"
  },
  "metric-mean": {
    "en": "Clean estimate E[x₀ | y]",
    "ko": "원본 추정 E[x₀ | y]"
  },
  "score-legend": {
    "en": "Solid and dashed curves coincide.",
    "ko": "실선과 점선이 일치한다."
  },
  "prediction-meaning": {
    "en": "The optimum predicts the conditional average of the injected noise, not necessarily the particular noise that produced one observation. The reconstructed output is consequently a conditional mean.",
    "ko": "최적 예측은 관측값에 대한 노이즈의 조건부 평균이다. 특정 관측을 만들었던 개별 노이즈와 항상 같지는 않다. 따라서 복원 결과도 원본의 조건부 평균이 된다."
  },
  "score-derive-text": {
    "en": "Differentiating the Gaussian likelihood gives its conditional score. Averaging it under p(x₀ | y) yields the marginal score. Rearranging E[ε | y] = (y − aₜE[x₀ | y])/σₜ gives the clean estimate, also known as Tweedie’s formula for scaled Gaussian corruption.",
    "ko": "가우시안 우도를 미분하면 조건부 score를 얻는다. 이를 p(x₀ | y)로 평균하면 관측 분포의 score가 된다. E[ε | y] = (y − aₜE[x₀ | y])/σₜ를 정리하면 원본 추정식을 얻으며, 이는 스케일을 포함한 가우시안 노이즈의 Tweedie 공식이다."
  },
  "score-derive-title": {
    "en": "Derive the noise–score identity",
    "ko": "노이즈와 score의 관계 유도"
  },
  "prediction-distinction": {
    "en": "This identity connects prediction targets at the same corruption level. DDPM and NCSN still differ in their noise schedules, training weights, and sampling algorithms; NCSN originally uses annealed Langevin dynamics.",
    "ko": "이 관계는 같은 노이즈 수준의 예측 대상을 연결한다. DDPM과 NCSN은 노이즈 스케줄, 학습 가중치, 샘플링 알고리즘에서 차이가 있으며, 원래 NCSN은 annealed Langevin dynamics를 사용한다."
  },
  "posterior-number": {
    "en": "04 / CONDITIONAL MEAN",
    "ko": "04 / 조건부 평균"
  },
  "posterior-title": {
    "en": "The best reconstruction may be an average",
    "ko": "최적의 복원이 평균일 수 있다"
  },
  "posterior-intro": {
    "en": "At y = 0, the two originals are equally plausible. Their conditional mean is 0, even though 0 never appears in the clean data. A squared-error optimum need not be a valid data sample.",
    "ko": "y = 0에서는 두 원본의 가능성이 같다. 깨끗한 데이터에 0이 없어도 조건부 평균은 0이다. 제곱오차를 최소화한 값이 실제 데이터의 한 후보와 반드시 일치하지는 않는다."
  },
  "posterior-shared": {
    "en": "Uses the noise level and observation above",
    "ko": "위의 노이즈 수준과 관측값 사용"
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
  "mean-derive-text": {
    "en": "The cross term vanishes because m is the conditional mean. The remaining variance is independent of u. This is the same least-squares argument behind the Gaussian VAE decoder and the optimal noise predictor.",
    "ko": "m이 조건부 평균이므로 교차항은 0이다. 남은 분산 항은 u와 독립이다. 가우시안 VAE 디코더와 최적 노이즈 예측에도 같은 최소제곱 논리가 적용된다."
  },
  "mean-derive-title": {
    "en": "Why the conditional mean minimizes MSE",
    "ko": "조건부 평균이 MSE를 최소화하는 이유"
  },
  "notes-number": {
    "en": "06 / MODEL & REFERENCES",
    "ko": "06 / 모델과 참고문헌"
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
    "en": "Sections 02–04 use P(x₀ = ±1) = 1/2 and Gaussian corruption. Densities, posterior probabilities, conditional means, and scores are calculated exactly. The sample strip uses 80 seeded draws; its finite counts need not equal the analytic density.",
    "ko": "02–04절은 P(x₀ = ±1) = 1/2와 가우시안 노이즈를 사용한다. 밀도, 사후확률, 조건부 평균, score를 정확히 계산한다. 표본 표시는 고정 시드의 80개 추출을 사용하며 유한 표본의 빈도는 정확한 밀도와 차이가 날 수 있다."
  },
  "notes-training-title": {
    "en": "Training and implementation",
    "ko": "학습과 구현"
  },
  "notes-training": {
    "en": "No neural network is trained. Exact optima make the equations inspectable in the browser. The photo puzzle uses a separate, explicitly simulated noise predictor. Its image is fixed; only piece positions enter the calculation.",
    "ko": "신경망 학습 없이 정확한 최적값을 계산해 브라우저에서 수식을 확인한다. 사진 퍼즐은 별도로 명시한 모의 노이즈 예측을 사용한다. 사진은 고정되고 조각 위치만 계산 대상이 된다."
  },
  "notes-course-title": {
    "en": "Course connections",
    "ko": "강의 연결"
  },
  "notes-course": {
    "en": "Lecture 1: autoencoders, VAE ELBO, conditional-mean decoding, DDPM, and noise/x parameterizations. Lecture 2: denoising score matching, Tweedie’s formula, NCSN, and the score–noise relation.",
    "ko": "강의 1: autoencoder, VAE ELBO, 조건부 평균 디코딩, DDPM, 노이즈·원본 예측 변환. 강의 2: denoising score matching, Tweedie 공식, NCSN, score와 노이즈의 관계."
  },
  "notes-reading-title": {
    "en": "Further reading",
    "ko": "참고문헌"
  },
  "flow-output": {
    "en": "output",
    "ko": "출력"
  },
  "reversal-label": {
    "en": "learned reversal",
    "ko": "학습하는 역과정"
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
