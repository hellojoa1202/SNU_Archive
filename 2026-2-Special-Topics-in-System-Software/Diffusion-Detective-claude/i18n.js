/* i18n.js — Korean text for every data-i18n element. The English text is the one
 * written in the HTML; it is captured at load time so the switch works both ways. */
(function (root) {
  'use strict';
  const ko = {
    'skip': '본문으로 이동',
    'lens-puzzle': '퍼즐',
    'lens-contour': '등고선',
    'nav-forward': '판 흔들기',
    'nav-family': '되돌리기',
    'nav-lab': '세 가지 치환',
    'nav-budget': '오차 예산',
    'nav-flow': 'Flow matching',
    'hero-title': '흔들린<br><span>퍼즐 판.</span>',
    'hero-lead': '확산 샘플러의 세 가지 근사를 하나씩 따로 재어 본다.',
    'hero-body': '종이 위에서 역시간 SDE와 probability flow ODE는 정확하다. 샘플러는 자기에게 없는 세 가지를 대체한다. 참 종단 분포, 참 score, 연속 시간. 이 페이지는 그 밖의 모든 것이 닫힌 형태로 알려진 토이 모델을 만들어, 각 대체를 하나씩만 켜고 생성된 분포에 미치는 영향을 눈으로 확인한다.',
    'route-1': '<small>01 · FORWARD</small><b>판을 흔든다</b><span>48개의 홈이 열방정식에 따라 흐려진다.</span>',
    'route-2': '<small>02 · REVERSE</small><b>조각을 되돌린다</b><span>ODE에서 SDE까지, 샘플러 한 가족.</span>',
    'route-3': '<small>03 · APPROXIMATE</small><b>세 가지를 바꾼다</b><span>prior, score, 시간 격자. 한 번에 하나씩.</span>',
    'hero-note': '같은 밀도를 보는 두 화면, 퍼즐 판과 등고선 지도가 모든 조작을 공유한다. 48개의 조각은 추적하는 표본 48개이며 각각 자기가 뽑힌 홈의 타일을 지니고 있다. 점은 나머지 표본이다. 샘플러는 어느 조각이 어디에 놓이는지가 아니라 질량이 어디로 가는지로 평가되며, 둘은 어긋날 수 있다.',

    'forward-title': '판 흔들기',
    'forward-intro': '데이터 분포는 8 × 6 판의 홈마다 하나씩 놓인 48개 가우시안의 균등 혼합이며, 각 폭은 τ = 0.06이다. forward 과정은 variance-exploding SDE dx = dw, 즉 드리프트 0, 확산 계수 1이다. 드리프트가 아핀이므로 시각 t의 주변분포는 모든 성분이 t만큼 넓어진 같은 혼합이다. 이를 알기 위해 시뮬레이션은 필요 없다.',
    'forward-source': '섭동 커널과 주변밀도 · Score SDE 노트 PDF 18, 21쪽 · f = 0, g = 1이면 Fokker–Planck 방정식은 열방정식 ∂<sub>t</sub>p = ½ Δp (34, 51쪽).',
    'forward-view': '조각이 흩어지는 것을 본다',
    'forward-arrows': 'score ∇ log p<sub>t</sub> 표시',
    'forward-time': '흔든 시간 t',
    'm-variance': '성분 분산 τ² + t',
    'm-contrast': '홈 대비',
    'forward-left': '시각 t의 판',
    'forward-right': '닫힌 형태로 구한 p<sub>t</sub>의 x 주변밀도',
    'forward-legend': '수식에서 강조된 부분: 슬라이더는 τ² + t를 움직인다. 각 조각은 자기만의 Brownian 경로 dx = dw를 따른다. forward 과정의 한 실현이다. 등고선 화면은 그런 모든 경로가 공유하는 법칙 p<sub>t</sub>를 보여준다. 48개 홈은 t ≈ 0.05에서 하나의 분지로 합쳐지고, 신호대잡음비 1 / t는 흔들린 조각이 자기 홈을 아직 얼마나 기억하는지 말한다.',

    'family-title': '되돌리기: 샘플러 한 가족',
    'family-intro': '역시간 SDE와 probability flow ODE는 한 직선의 양 끝이다. 모든 η ≥ 0에 대해 아래 과정은 forward 과정과 같은 주변분포를 가진다. 드리프트에 더해진 score가, 노이즈가 Fokker–Planck 방정식에 더하는 확산을 정확히 상쇄하기 때문이다. η = 1이 역 SDE, η = 0이 probability flow ODE다.',
    'family-source': '하나의 주변분포 가족, 여러 과정 · Score SDE 노트 PDF 78쪽 · 역시간 SDE 63쪽, probability flow ODE 73쪽.',
    'family-view': '같은 홈, 다른 경로',
    'btn-noise': '새 노이즈',
    'btn-starts': '새 출발점',
    'family-colors': '출발점 색',
    'progress': '생성 진행',
    'family-left': '되돌아오는 조각 (정확한 출발점, 정확한 score, 256 스텝)',
    'family-right': '정확한 홈 질량과 비교한 홈 빈도',
    'm-tv': '홈 오차 (전변동)',
    'm-spread': '퍼짐 / 정확값',
    'm-floor': '정확한 표본 1024개의 바닥값',
    'family-legend': '48개의 조각은 추적하는 표본이다. 정확한 출발점에서는 조각 k가 성분 k에서 뽑히므로 그 타일이 곧 참 출신이다. 점은 출발 위치로 색을 입힌 나머지 표본 976개다. η = 0에서는 색이 매끄러운 그러데이션으로 도착한다. ODE의 해는 교차하지 않으므로 흐름 사상은 전단사다. η = 1에서는 색이 뒤섞인다. 두 경우 모두 조각은 자기 것이 아닌 홈에 놓이는데 오른쪽의 홈 빈도는 맞다. 샘플러는 정체성이 아니라 질량을 맞춘다. 조각을 클릭하면 따라갈 수 있다.',
    'family-bridge': '<b>지금까지는 모두 정확했다.</b><span>샘플러에는 그중 아무것도 없다. 종단 분포도, score도, 연속 시간도. 다음 절은 이것들을 한 번에 하나씩 바꾼다.</span>',

    'lab-title': '세 가지 치환, 한 번에 하나씩',
    'lab-intro': 'f = 0, g = 1이면 이 가족의 역방향 한 스텝은 한 줄이다. 샘플러는 그 안에서 세 가지를 바꾼다. x가 어디서 출발하는지, 어떤 score를 읽는지, 스텝 h가 얼마나 큰지. 강의 노트는 이 셋을 유일한 근사로 꼽으며, 이 토이는 나머지 모든 양을 정확하게 유지하여 각각을 따로 잴 수 있게 한다.',
    'lab-source': 'From the oracle to the model · Score SDE 노트 PDF 86쪽 (세 가지 치환) · Euler–Maruyama 스텝 87쪽.',
    'lab-source2': '이 페이지에서 정의: 학습된 score는 오차를 알 수 없는 회귀 추정치다(denoising score matching, 83–84쪽). 흐림 δ와 기울기 b는 그 자리에 넣는 통제된 오차 둘이다.',
    'lab-view': '치환을 하나 켠다',
    'tab-start': '출발점', 'tab-start-sub': '판을 충분히 오래 흔들지 않았다',
    'tab-score': 'Score', 'tab-score-sub': '기울었거나 흐려진 홈 지도',
    'tab-grid': '격자', 'tab-grid-sub': '조각이 구르지 않고 점프한다',
    'lab-T': '종단 시간 T',
    'lab-start-law': '출발 분포',
    'opt-exact': 'p_T 자체 (정확)',
    'opt-prior': 'N(0, T I), prior',
    'm-klbound': 'KL 상계 ½ SNR(T) E‖x₀‖²',
    'm-kl': 'KL(p<sub>T</sub> ‖ N(0, T I)), 수치적분',
    'lab-bias': '기울기 b<sub>x</sub>',
    'lab-smooth': '흐림 δ',
    'lab-arrows': 't = 0.02에서 섭동된 score 장 그리기',
    'lab-nfe': 'score 평가 횟수',
    'lab-method': '방법',
    'opt-auto': 'Euler–Maruyama (η > 0) / Heun (η = 0)',
    'opt-euler': 'Euler, η = 0만',
    'opt-heun': 'Heun, η = 0만',
    'm-step': '스텝 h = T / 스텝 수',
    'm-nfe': '실제 평가 횟수',
    'lab-eta': '과정 η (0 = ODE, 1 = 역 SDE)',
    'btn-reset': '정확한 설정으로',
    'lab-left': '샘플러가 맞추는 그림',
    'lab-right': '정확한 홈 질량과 비교한 홈 빈도',
    'm-ks': 'KS 거리, x 주변분포',
    'lab-legend': '표본 2048개 중 조각 48개와 나머지 점 552개를 그린다. 홈 사이에 걸친 조각은 흐림, 엉뚱한 홈의 조각은 옮겨진 질량, 빈 홈은 부족한 질량이다. 홈 오차는 질량이 어디로 갔는지를, 퍼짐은 얼마나 조밀하게 모였는지를 묻는다. 작은 회색 숫자는 p₀에서 정확히 뽑은 2048개의 값, 즉 각 지표의 바닥값이다.',
    'lab-point-start': '<b>출발점.</b> 강의는 불일치를 신호대잡음비로 묶는다. KL(p<sub>T</sub> ‖ N(0, P(T) I)) ≤ ½ SNR(T) E‖x₀‖² (PDF 23, 26쪽). 여기서 SNR(T) = 1 / T이고 상계는 한 자릿수쯤 느슨하지만 추세는 맞다. ODE는 전단사라서 T에서 틀린 것을 t = 0까지 그대로 운반하고, SDE는 노이즈를 계속 더하고 되끌어 오므로 출발점을 잊을 수 있다.',
    'lab-point-score': '<b>Score.</b> 기울기는 홈 사이에서 질량을 옮겨 그림을 옆으로 밀고, 흐림은 홈 빈도는 유지한 채 모든 우물을 넓힌다. 이 가족은 score를, 따라서 기울기도, (1 + η²)/2배 하므로 이 토이에서 SDE는 상수 기울기에 ODE보다 <em>더</em> 민감하다. 확률적 샘플링이 강건하다는 통상의 논증은 요동치며 평균적으로 상쇄되는 오차에 대한 것이며, 기울기는 그렇지 않다.',
    'lab-point-grid': '<b>격자.</b> 장은 뻣뻣하다. ‖∇ log p<sub>t</sub>‖가 1 / (τ² + t)처럼 커지므로 t = 0 근처의 마지막 스텝들이 어렵다. 같은 평가 횟수에서 ODE의 Euler가 128 정도까지는 가장 정확하고, Heun은 성긴 격자에서 우물을 지나쳐 256부터 비로소 효과를 내며, Euler–Maruyama는 마지막 스텝에 √h ≪ τ가 필요하고 그렇지 않으면 자기 노이즈로 우물이 흐려진다.',

    'budget-title': '오차 예산',
    'budget-intro': '각 패널은 나머지 두 치환을 끈 채 노브 하나를 쓸어 보며, 가족의 양 끝인 Heun을 쓴 probability flow ODE(η = 0, 파랑)와 Euler–Maruyama를 쓴 역 SDE(η = 1, 빨강)를 함께 그린다. T 쓸기는 스텝 크기 h = 1/128을 고정하여 더 오래 흔든 것이 더 성긴 격자와 혼동되지 않게 했다. 점당 표본 2048개이며 점선은 정확한 표본 2048개의 바닥값이다.',
    'budget-view': '노브 하나씩',
    'sw-T': 'N(0, T I)에서 출발 · T에 대한 홈 오차',
    'sw-bias': '기울기 · b<sub>x</sub>에 대한 홈 오차',
    'sw-smooth': '흐림 · δ에 대한 퍼짐 비율',
    'sw-nfe': '격자 · 평가 횟수에 대한 퍼짐 비율',
    'btn-recompute': '이 브라우저에서 다시 계산',
    'budget-note': '이 예산은 더해지지 않는다. 질량을 엉뚱한 홈으로 옮긴 기울기는 스텝을 늘려도 고쳐지지 않고, 성긴 격자는 더 오래 흔들어도 고쳐지지 않는다. 질량을 옮기는 두 치환(출발점, 기울기)과 흐리게 하는 두 치환(흐림, 격자)은 두 지표에서 깔끔하게 갈라진다.',

    'flow-title': 'Flow matching이 바꾸는 것과 바꾸지 않는 것',
    'flow-intro': 'Flow matching은 score를 쓰지 않지만, 가우시안 source에서는 학습하는 장이 곧 score다. 조건부 속도는 조건부 score의 아핀 함수이고, 사후분포에 대해 평균하면 주변 score가 된다. 맞춘 스케줄 α<sub>s</sub> = b<sub>T−s</sub>, σ<sub>s</sub> = a<sub>T−s</sub>에서 flow matching ODE는 (0, T) 위의 probability flow ODE다.',
    'flow-source': '주변 속도는 주변 score다 · Flow-based 노트 PDF 64쪽 · 열린 구간에서의 동일시 69, 74쪽.',
    'flow-point-1': '<b>출발점</b>은 더 이상 근사가 아니다. b₀ = 0이므로 보간은 t = 0에서 prior에 정확히 도달한다. 그 대가는 맞춘 확산이 치른다. 그 계수는 그 끝점에서 발산하고, 확산은 유한 시간에 N(0, I)에 도달할 수 없다.',
    'flow-point-2': '<b>Score</b> 오차는 속도 오차가 된다. Conditional flow matching은 ȧ<sub>t</sub>x₀ + ḃ<sub>t</sub>x<sub>T</sub>에 회귀하며 그 최소점은 주변 속도다. denoising score matching을 성립시키는 것과 같은 조건부 기대값 논증이다.',
    'flow-point-3': '<b>격자</b>는 그대로다. 직선인 조건부 경로가 주변 궤적을 직선으로 만들지는 않는다. solver는 여전히 곡선을 따라간다.',
    'limits-title': '비유가 멈추는 곳',
    'limits-body': '조각의 타일은 그 표본 하나가 어디서 출발했는지를 말할 뿐 어디에 도착해야 하는지를 말하지 않는다. 샘플러는 홈별 질량으로 평가되며, 정확한 ODE조차 조각 k를 다른 홈으로 보낸다. 홈에는 조각 하나가 아니라 질량의 일부가 들어간다. 판은 스스로 모양을 바꾼다. 열방정식으로 흐려지고 역과정으로 다시 또렷해지며, 등고선 화면이 그 정직한 그림이다. 기울기와 흐림은 효과를 예측하고 확인할 수 있어서 고른 것이지 전형적이어서가 아니다. 시간 격자는 균일하다. 비균일 간격은 3절의 뻣뻣함에 대한 표준 처방이지만 강의 범위 밖이라 제외했다.',
    'scope-title': '모델과 출처',
    'scope-body': '토이: 가우시안 48개, τ = 0.06, 홈 간격 0.22, forward dx = dw. p<sub>t</sub>, ∇ log p<sub>t</sub>, 홈 질량, x 주변분포는 닫힌 형태. KL은 140 × 140 수치적분. 신경망은 없다. 샘플러: η > 0에는 Euler–Maruyama, η = 0에는 Euler 또는 Heun을 쓰는 η 가족이며 시드를 고정해 모든 실행을 재생할 수 있다. 테스트(node --test)는 score와 유한차분, 열방정식, KL 상계, 홈 질량과 Monte Carlo, 가족의 주변분포 정렬을 검사한다. 강의 노트: <em>Diffusion Models의 수학적 원리</em>, 문태섭 교수, 2026년 가을 (Score SDE, Flow-based, 미분방정식 부록). Lai, Song, Kim, Mitsufuji, Ermon, <em>The Principles of Diffusion Models</em>, arXiv:2510.21890을 따른다. 사진: “Cat August 2010-4”, Alvesgaspar, Wikimedia Commons, CC BY-SA 3.0, 자르고 축소함.',

    // canvas / button labels
    'btn-play': '재생', 'btn-pause': '일시정지',
    'lbl-marginal': 'p_t의 x 주변밀도',
    'lbl-slots': '홈 1 … 48 · 막대 = 표본, 선 = 정확한 질량',
    'lbl-floor': '바닥값',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-T': 'T', 'lbl-tilt': 'b_x', 'lbl-blur': 'δ', 'lbl-evals': '평가 횟수',
    'lbl-tv': '홈 오차', 'lbl-spread': '퍼짐 / 정확값',
    'lbl-time': 't =', 'lbl-noise-time': '노이즈 시간 t =',
    'status-running': '계산 중…', 'status-done': '완료', 'status-pre': 'node에서 같은 코드로 미리 계산한 값',
  };
  const en = {
    'btn-play': 'Play', 'btn-pause': 'Pause',
    'lbl-marginal': 'x-marginal of p_t',
    'lbl-slots': 'slot 1 … 48 · bars = samples, line = exact mass',
    'lbl-floor': 'floor',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-T': 'T', 'lbl-tilt': 'b_x', 'lbl-blur': 'δ', 'lbl-evals': 'score evaluations',
    'lbl-tv': 'slot error', 'lbl-spread': 'spread / exact',
    'lbl-time': 't =', 'lbl-noise-time': 'noise time t =',
    'status-running': 'computing…', 'status-done': 'done', 'status-pre': 'precomputed in node with the same code',
  };

  let language = document.documentElement.lang === 'ko' ? 'ko' : 'en';
  const requested = new URLSearchParams(location.search).get('lang');
  let stored = null;
  try { stored = localStorage.getItem('board-language'); } catch (e) { /* ignore */ }
  if (requested === 'ko' || requested === 'en') language = requested;
  else if (stored === 'ko' || stored === 'en') language = stored;

  const original = new Map(); // English innerHTML of every data-i18n element
  function apply() {
    document.documentElement.lang = language;
    for (const el of document.querySelectorAll('[data-i18n]')) {
      const key = el.dataset.i18n;
      if (!original.has(el)) original.set(el, el.innerHTML);
      if (language === 'ko' && ko[key] !== undefined) el.innerHTML = ko[key];
      else el.innerHTML = original.get(el);
    }
    for (const b of document.querySelectorAll('.language-switch button')) b.setAttribute('aria-pressed', String(b.dataset.lang === language));
    try { localStorage.setItem('board-language', language); } catch (e) { /* ignore */ }
    window.dispatchEvent(new CustomEvent('languagechange'));
  }
  function text(key) { return (language === 'ko' ? ko[key] : en[key]) || en[key] || key; }
  function setLanguage(l) { if (l === 'ko' || l === 'en') { language = l; apply(); } }
  root.BoardText = { apply, text, setLanguage, get language() { return language; } };
})(globalThis);
