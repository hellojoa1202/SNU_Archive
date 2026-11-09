/* i18n.js — Korean text for every data-i18n element. The English text is the one
 * written in the HTML; it is captured at load time so the switch works both ways. */
(function (root) {
  'use strict';
  const ko = {
    'skip': '본문으로 이동',
    'nav-forward': 'Forward 과정',
    'nav-family': '역 SDE와 PF-ODE',
    'nav-lab': '세 가지 치환',
    'nav-budget': '오차 예산',
    'nav-flow': 'Flow matching',
    'hero-title': '확산 샘플러의<br><span>세 가지 근사.</span>',
    'hero-lead': 'Prior. Score. 시간 격자.',
    'hero-body': '역 SDE와 probability flow ODE는 참 p<sub>T</sub>, 참 score, 연속 시간이 있으면 정확하다. 샘플러에는 셋 다 없다. 치환을 하나씩만 켜고 그 비용을 잰다.',
    'route-1-b': '샘플러가 되돌려야 하는 것', 'route-1-s': '봉우리 48개가 가우시안 하나로 흐려진다.',
    'route-2-b': '정확한 두 가지 귀로', 'route-2-s': '같은 주변분포, 다른 경로.',
    'route-3-b': 'Prior, score, 이산화', 'route-3-s': '정확한 실행 옆에서 노브를 하나씩.',
    'hero-note': '토이: 8 × 6 격자 위 가우시안 48개의 균등 혼합(τ = 0.06), forward 과정 dx = dw. 밀도, score, 봉우리 질량, prior에 대한 KL이 모두 닫힌 형태라서 학습하는 것도 추정하는 것도 없다.',

    'forward-title': 'Forward SDE와 그 주변분포',
    'forward-intro': '강의의 variance-exploding SDE dx = dw를 쓴다. f = 0, g = 1, σ²(t) = t. 섭동 커널은 출발점을 중심으로 한 가우시안이고, 주변분포 p<sub>t</sub>는 그것을 데이터에 대해 평균한 것이다.',
    'kernel-source': '커널 계산, variance exploding · Score SDE 노트 p. 18.',
    'forward-source': '주변밀도 · Score SDE 노트 p. 21. 이 혼합에서는 적분이 분산 τ² + t인 같은 혼합이 된다.',
    'forward-p2': '봉우리 간격이 0.22이므로 √(τ² + t)가 그 절반쯤 되는 t = 0.01 근처에서 봉우리가 합쳐진다. t = 0.05면 덩어리 하나다. SNR(t) = 1 / t는 x<sub>t</sub>에 x<sub>0</sub>가 얼마나 남았는지 말해 주는데, 0이 되는 일은 없다. 첫 번째 근사가 여기서 생긴다.',
    'forward-view': 'Forward SDE의 표본과 주변분포 p<sub>t</sub>',
    'btn-again': '새 실현',
    'forward-arrows': 'score ∇ log p<sub>t</sub>',
    'forward-time': '시간 t',
    'm-variance': '성분 분산 τ² + t', 'm-contrast': '봉우리 대비',
    'forward-left': '표본 384개 · 회색 등고선: p<sub>t</sub>', 'forward-right': 'p<sub>t</sub>의 x 주변분포, 닫힌 형태',
    'forward-legend': '슬라이더는 강조된 항 σ²(t) − σ²(0) = t이고, 작은 t에 대부분의 길이를 주도록 세제곱 눈금이다. 봉우리 대비는 중심의 밀도를 이웃과의 중간점 밀도로 나눈 값이며 t = 0에서 1로 맞췄다. score 화살표는 작은 t에서 가장 가까운 봉우리를, 큰 t에서 구름의 중심을 가리킨다.',
    'forward-bridge': '<b>Forward 과정은 표본 하나하나로는 되돌릴 수 없다.</b><span>주변분포의 가족은 되돌릴 수 있다. 강의는 그렇게 하는 과정 둘을 준다.</span>',

    'family-title': '역 SDE와 probability flow ODE는 주변분포를 공유한다',
    'family-intro': '두 방정식 모두 모든 p<sub>t</sub>를 지난다. 그 Fokker–Planck 방정식을 forward 주변분포가 풀기 때문이다. 역 SDE는 score 전체와 새 노이즈를 쓰고, probability flow ODE는 score의 절반과 노이즈 없음을 쓴다. 개별 궤적에 대해서는 아무 말도 없다.',
    'reverse-source': '역시간 SDE · Score SDE 노트 p. 63.',
    'pfode-source': 'Probability flow ODE · Score SDE 노트 p. 73.',
    'family-p2': '둘은 한 가족의 양 끝이다. 모든 η ≥ 0에 대해 아래 과정은 같은 주변분포를 가진다. 표류에 더해진 ½ η² g² 만큼의 score가 더해진 노이즈를 정확히 상쇄한다. η = 1이 역 SDE, η = 0이 probability flow ODE다.',
    'family-source': '하나의 주변분포 가족, 여러 과정 · Score SDE 노트 p. 78.',
    'fil-view': '쇠가루: 눈에 보이는 score 장(場)',
    'fil-p1': '종이 위에 뿌린 쇠가루는 아래 자석의 자기장을 따라 늘어서고, 종이를 톡톡 치면 자석 자리로 모인다. η 가족을 이렇게 읽는다. 장은 score ∇ log p<sub>t</sub>, 자석 48개는 봉우리, 쇠가루는 표본이다. 톡톡 치는 것이 노이즈항이므로 η는 얼마나 세게 치는지다. 종이를 기울이면 어디서나 같은 방향으로 밀리는데, 이것이 편향된 score다. 종이가 두꺼우면 장이 흐려지는데, 이것이 평활화된 score다. 얼마나 자주 치고 쇠가루를 움직이게 하는지가 시간 격자다. 큰 t에서 장은 종이 한가운데를 향하고, t가 줄면 48개의 작은 장으로 갈라지며 쇠가루가 따라간다.',
    'btn-pour': '새로 뿌리기',
    'fil-field': '장 표시',
    'fil-eta': '두드리기 η (0 = probability flow ODE, 1 = 역 SDE)',
    'fil-steps': '두드린 횟수 · 시간 격자',
    'taps-256': '256 스텝', 'taps-32': '32 스텝', 'taps-8': '8 스텝',
    'fil-tilt': '종이 기울기 · score 편향 b<sub>x</sub>',
    'fil-thick': '종이 두께 · score 평활화 δ',
    'm-fil-onsite': '자석 위의 쇠가루 (3τ 안)', 'm-fil-tv': '끝났을 때 엉뚱한 자석의 질량', 'm-fil-step': '스텝 Δt',
    'fil-legend': '회색 획: score 장 ∇ log p<sub>t+δ</sub> + b를 쇠가루가 장을 드러내는 방식으로 그린 것이며 p<sub>t</sub>가 큰 곳일수록 진하다. 파란 획: 표본 400개, 각자 자기 자리의 장 방향으로 늘어서 있다. 식은 뒤 기울기를 끌면 무늬 전체가 미끄러지고, 종이를 두껍게 하면 덩어리가 넓어지며, 두드림을 8번으로 줄이면 쇠가루가 자석에 못 미치고 멈춘다.',
    'family-view': '입자 하나를 따라가고, 전체 분포를 비교한다.',
    'btn-noise': '새 노이즈, 같은 출발점', 'btn-starts': '새 초기 표본',
    'family-trails': '입자 40개의 궤적', 'family-colors': '출발 각도로 색 입히기',
    'progress': '생성 진행',
    'family-count': '표본 수',
    'family-left': '역 SDE (η = 1)', 'family-right': 'Probability flow ODE (η = 0)',
    'family-legend': '파랑: SDE · 빨강: ODE · 회색 등고선: 해석적 p<sub>t</sub> · 검은 점: 추적 입자의 출발점. 점을 클릭하면 같은 초기 입자를 두 패널에서 추적하고, 화살표 키로 다음 입자로 옮긴다. 정확한 p<sub>1</sub>에서 뽑은 같은 1024개 출발점, 정확한 score, 256 스텝. 다른 것은 η뿐이다.',
    'm-sde-ks': 'SDE: x 주변분포 KS 거리', 'm-ode-ks': 'ODE: x 주변분포 KS 거리', 'm-sep': '추적 입자 간 거리',
    'family-note': '두 계단 곡선이 모든 시각에 점선의 해석적 밀도 위에 놓인다. 정확한 표본 1024개의 KS 거리가 약 0.03이고 두 샘플러 모두 거기에 있다. 추적 입자는 구름 폭만큼 떨어진 곳에 도착한다. ODE 궤적은 교차하지 않고 SDE 궤적은 교차한다. 같은 주변분포, 무관한 경로.',
    'family-bridge': '<b>위에서는 참 p<sub>1</sub>, 참 score, 촘촘한 격자를 썼다.</b><span>샘플러에는 셋 다 없다. 다음 절에서 하나씩 바꿔 넣는다.</span>',

    'lab-title': 'Prior, score, 이산화: 치환을 한 번에 하나씩',
    'lab-intro': '샘플러는 p<sub>T</sub> 대신 prior에서 출발하고, ∇ log p<sub>t</sub> 대신 학습된 네트워크 s<sub>ϕ<sup>×</sup></sub>를 평가하며, 유한한 스텝을 밟는다. 강의는 이 대체를 넣은 생성 방정식을 적고, 근사는 이 셋뿐이라고 말한다.',
    'lab-source': 'Oracle에서 모델로 · Score SDE 노트 p. 86.',
    'em-source': 'Euler–Maruyama 스텝 · Score SDE 노트 p. 87. ODE의 Euler 스텝은 노이즈를 빼고 score 항을 반으로 줄인다. Heun은 스텝마다 평가를 한 번 더 한다(부록 p. 16).',
    'kl-source': '잔여는 신호대잡음비 · Score SDE 노트 p. 23, 26. 여기서는 E ≡ 1, P(T) = T이므로 SNR(T) = 1 / T.',
    'lab-p2': 'Prior와 격자는 샘플러가 하는 그대로 재현한다. 토이에는 학습된 네트워크가 없으므로 통제된 오차 둘이 그 자리를 맡는다. 정확한 score를 t + δ에서 평가하는 평활화 δ, 그리고 상수 편향 b. 샘플러가 보는 것은 ∇ log p<sub>t+δ</sub>(x) + b다.',
    'lab-view': '왼쪽은 정확한 실행, 오른쪽은 치환 하나',
    'tab-start': 'Prior', 'tab-start-sub': 'p<sub>T</sub> 대신 N(0, T I)',
    'tab-score': 'Score', 'tab-score-sub': '∇ log p<sub>t</sub> 대신 ∇ log p<sub>t+δ</sub> + b',
    'tab-grid': '이산화', 'tab-grid-sub': '연속 시간 대신 N 스텝',
    'lab-T': '종단 시간 T',
    'lab-start-law': '오른쪽 패널의 초기 분포',
    'opt-prior': 'N(0, T I), prior', 'opt-exact': 'p_T (정확, 치환 없음)',
    'm-klbound': '상계 ½ SNR(T) E‖x₀‖²', 'm-kl': 'KL(p<sub>T</sub> ‖ N(0, T I))',
    'pre-prior-short': '프리셋: T = 0.25, ODE', 'pre-prior-short-sde': '프리셋: T = 0.25, SDE',
    'lab-bias': '상수 편향 b<sub>x</sub>', 'lab-smooth': '평활화 δ',
    'lab-arrows': 't = 0.02에서 치환된 score 그리기',
    'pre-bias': '프리셋: 편향 1.0', 'pre-smooth': '프리셋: 평활화 0.03',
    'lab-nfe': 'score 평가 횟수 N', 'lab-method': '적분기',
    'opt-auto': 'Euler–Maruyama (η > 0) / Heun (η = 0)', 'opt-euler': 'Euler, η = 0', 'opt-heun': 'Heun, η = 0',
    'm-step': '스텝 Δt = T / N', 'm-nfe': '쓴 평가 횟수',
    'pre-coarse-sde': '프리셋: 8 스텝, SDE', 'pre-coarse-heun': '프리셋: 16회 평가, Heun',
    'lab-eta': '두 패널의 η (0 = ODE, 1 = SDE)',
    'btn-noise2': '새 노이즈', 'btn-reset': '초기화',
    'lab-left': '정확: p<sub>T</sub>, ∇ log p<sub>t</sub>, 256회 평가', 'lab-right': '치환을 넣은 실행',
    'm-tv': '엉뚱한 봉우리의 질량 (48칸 total variation)', 'm-spread': '봉우리 폭 / 정확값', 'm-ks': 'x 주변분포 KS 거리',
    'lab-legend': '회색: 정확한 실행 · 파랑: 치환을 넣은 실행 · 점선: p<sub>0</sub>의 해석적 x 주변분포. 같은 시드, 같은 η, 각 1024개. 작은 회색 숫자는 정확한 실행의 값이며 기준선이다. 탭마다 전형적인 흔적을 보여 주는 프리셋이 있다.',
    'lab-point-start': '<b>Prior.</b> 상계는 T = 1에서 0.2 nat, 참 KL은 0.02다. ODE는 전단사라서 출발 오차를 t = 0까지 나른다. T = 0.25에서 질량의 5분의 1이 엉뚱한 봉우리에 떨어진다. SDE는 출발점을 잊고 그 절반을 보인다.',
    'lab-point-score': '<b>Score.</b> 편향은 봉우리 사이로 질량을 옮기고 폭은 그대로 둔다. 평활화는 봉우리를 넓히고 질량은 그대로 둔다. SDE는 편향에 ODE보다 <em>더</em> 민감하다. score 앞의 계수 (1 + η²)/2 때문이며, 매 스텝 같은 방향을 가리키는 오차를 노이즈가 평균해 없앨 수는 없다.',
    'lab-point-grid': '<b>이산화.</b> ‖∇ log p<sub>t</sub>‖는 1 / (τ² + t)처럼 커지므로, 균일 격자는 봉우리가 만들어지는 마지막 스텝들에 너무 큰 스텝으로 도착한다. 평가 횟수가 적을 때는 Euler가 Heun보다 낫다. Heun의 예측 단계가 좁은 봉우리를 지나쳐 버리기 때문이고, Heun은 256회쯤부터 이긴다. Euler–Maruyama는 마지막 스텝에서 √Δt ≪ τ도 필요하다.',
    'lab-bridge': '<b>치환 셋, 손상 두 종류.</b><span>Prior와 편향은 봉우리 사이로 질량을 옮기고, 평활화와 거친 격자는 봉우리를 넓힌다. 다음 절에서 노브를 하나씩 쓸어 본다.</span>',

    'budget-title': '오차 예산',
    'budget-intro': '각 패널은 나머지 두 치환을 끈 채 노브 하나를 쓸어 본다. Heun을 쓴 ODE(η = 0, 파랑)와 Euler–Maruyama를 쓴 SDE(η = 1, 빨강). T 쓸기는 Δt = 1/128을 고정한다. 점마다 표본 2048개이고, 점선은 정확한 표본 2048개가 받는 점수라서 그 아래는 정보가 없다.',
    'budget-view': '노브 하나씩',
    'sw-T': 'Prior · T에 따른 엉뚱한 봉우리의 질량',
    'sw-T-note': 'ODE는 prior의 불일치를 물려받아 T가 커져야 잃고, SDE는 모든 T에서 바닥에 있다.',
    'sw-bias': 'Score 편향 · b<sub>x</sub>에 따른 엉뚱한 봉우리의 질량',
    'sw-bias-note': '둘 다 편향에 선형이고 SDE가 (1 + η²)/2만큼 더 가파르다.',
    'sw-smooth': 'Score 평활화 · δ에 따른 봉우리 폭',
    'sw-smooth-note': '폭은 δ와 함께 커지고 두 샘플러가 일치한다. 봉우리 사이의 질량은 δ ≈ 0.03까지 바닥에 머문다.',
    'sw-nfe': '이산화 · 평가 횟수에 따른 봉우리 폭',
    'sw-nfe-note': 'Heun은 32회 아래에서 가장 나쁘고 256회부터 가장 좋다. Euler–Maruyama는 정확한 폭에 위에서부터 다가간다.',
    'btn-recompute': '이 브라우저에서 다시 계산',
    'budget-note': '예산은 더해지지 않는다. 엉뚱한 봉우리로 옮겨 간 질량은 스텝을 늘려도 돌아오지 않고, 끝에서 너무 거친 격자는 forward 시간을 늘려도 고쳐지지 않는다. 첫 지표는 질량이 어디로 갔는지, 둘째는 얼마나 조밀하게 모였는지를 말한다.',

    'flow-title': 'Flow matching은 probability flow ODE다',
    'flow-intro': '가우시안 source에서 flow matching의 조건부 속도는 조건부 score의 아핀 함수이고, 사후분포로 평균하면 주변 속도는 표류 더하기 ∇ log p<sub>t</sub>의 배수가 된다. 맞춘 스케줄 α<sub>s</sub> = b<sub>T−s</sub>, σ<sub>s</sub> = a<sub>T−s</sub>에서 flow-matching ODE와 probability flow ODE는 (0, T) 위에서 일치한다.',
    'flow-source': '주변 속도는 주변 score다 · Flow 기반 노트 p. 64. 열린 구간에서의 동일시 p. 69, 74.',
    'flow-p2': '그러므로 flow-matching 샘플러는 probability flow ODE 샘플러이고, 같은 세 치환을 한다.',
    'flow-point-1': '<b>Prior</b>는 정확해진다. b₀ = 0이 t = 0에서 보간을 p<sub>prior</sub>에 놓기 때문이다. 비용은 맞춘 확산의 계수로 옮겨 가서 그 끝점에서 발산한다.',
    'flow-point-2': '<b>Score</b> 오차는 속도 오차가 된다. Conditional flow matching은 ȧ<sub>t</sub>x₀ + ḃ<sub>t</sub>x<sub>T</sub>에 회귀하며, denoising score matching과 같은 조건부 기댓값 논증을 쓴다.',
    'flow-point-3': '<b>이산화</b>는 그대로다. 조건부 경로는 직선이고 주변 궤적은 곡선이라 적분기는 여전히 곡선을 따라간다.',
    'limits-title': '범위',
    'limits-body': '쇠가루 그림은 score 장의 그림이지 자기학의 모형이 아니다. 실제 쇠가루는 B를 따라 늘어서고 ∇|B|² 쪽으로 끌리며, 실제 종이는 매 스텝 알맞은 세기로 저절로 두드려지지 않는다. 편향과 평활화는 효과를 예측하고 확인할 수 있어서 학습된 네트워크의 알 수 없는 오차를 대신한다. 시간 격자는 균일하다.',
    'scope-title': '모델과 출처',
    'scope-body': '토이: 가우시안 48개, τ = 0.06, 간격 0.22, forward dx = dw. p<sub>t</sub>, ∇ log p<sub>t</sub>, 칸 질량, x 주변분포는 닫힌 형태, KL은 수치적분. 샘플러: η 가족, η &gt; 0은 Euler–Maruyama, η = 0은 Euler 또는 Heun, 시드 고정. 테스트(node --test)는 score와 유한차분, 열방정식, KL 상계, 칸 질량, 가족의 주변분포 정렬을 검사한다. 강의 노트: <em>Mathematical Principles of Diffusion Models</em>, 문태섭 교수, 2026 가을. Lai, Song, Kim, Mitsufuji, Ermon, <em>The Principles of Diffusion Models</em>, arXiv:2510.21890을 따른다.',

    'btn-play': '재생', 'btn-pause': '일시정지',
    'lbl-floor': '정확한 실행',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-evals': '평가 횟수',
    'lbl-noise-time': '노이즈 시간 t =',
    'lbl-analytic': '점선: 해석적 x 주변밀도',
    'lbl-exact-run': '정확한 실행',
    'lbl-substituted': '치환을 넣은 실행',
    'lbl-x': 'x 좌표',
    'lbl-floor-line': '정확한 표본',
    'status-running': '계산 중…', 'status-done': '완료', 'status-pre': 'node에서 같은 코드로 미리 계산한 값',
  };
  const en = {
    'btn-play': 'Play', 'btn-pause': 'Pause',
    'lbl-floor': 'exact run',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-evals': 'score evaluations',
    'lbl-noise-time': 'Noise time t =',
    'lbl-analytic': 'Dashed: analytic x-density',
    'lbl-exact-run': 'exact run',
    'lbl-substituted': 'with the substitution',
    'lbl-x': 'x-coordinate',
    'lbl-floor-line': 'exact draws',
    'status-running': 'computing…', 'status-done': 'done', 'status-pre': 'precomputed in node with the same code',
  };

  let language = document.documentElement.lang === 'ko' ? 'ko' : 'en';
  const requested = new URLSearchParams(location.search).get('lang');
  let stored = null;
  try { stored = localStorage.getItem('traps-language'); } catch (e) { /* ignore */ }
  if (requested === 'ko' || requested === 'en') language = requested;
  else if (stored === 'ko' || stored === 'en') language = stored;

  const original = new Map();
  function apply() {
    document.documentElement.lang = language;
    for (const el of document.querySelectorAll('[data-i18n]')) {
      const key = el.dataset.i18n;
      if (!original.has(el)) original.set(el, el.innerHTML);
      if (language === 'ko' && ko[key] !== undefined) el.innerHTML = ko[key];
      else el.innerHTML = original.get(el);
    }
    for (const b of document.querySelectorAll('.language-switch button')) b.setAttribute('aria-pressed', String(b.dataset.lang === language));
    try { localStorage.setItem('traps-language', language); } catch (e) { /* ignore */ }
    window.dispatchEvent(new CustomEvent('languagechange'));
  }
  function text(key) { return (language === 'ko' ? ko[key] : en[key]) || en[key] || key; }
  function setLanguage(l) { if (l === 'ko' || l === 'en') { language = l; apply(); } }
  root.BoardText = { apply, text, setLanguage, get language() { return language; } };
})(globalThis);
