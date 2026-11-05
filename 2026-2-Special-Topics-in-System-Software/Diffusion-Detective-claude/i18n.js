/* i18n.js — Korean text for every data-i18n element. The English text is the one
 * written in the HTML; it is captured at load time so the switch works both ways. */
(function (root) {
  'use strict';
  const ko = {
    'skip': '본문으로 이동',
    'nav-forward': '레이저 끄기',
    'nav-family': '레이저 켜기',
    'nav-lab': '세 가지 치환',
    'nav-budget': '오차 예산',
    'nav-flow': 'Flow matching',
    'hero-title': '빛의 <span>덫.</span>',
    'hero-lead': '확산 샘플러의 세 가지 근사를 하나씩 따로 재어 본다.',
    'hero-body': '초점을 맞춘 레이저는 작은 입자를 밝은 점 쪽으로 끌어당긴다. 광학 핀셋이다. 홀로그램으로 밝은 점을 여러 개 만들면 유체 속을 떠돌던 입자들이 그 무늬로 모여든다. 빛의 세기를 확률밀도로, 끌어당기는 힘을 그 score로 읽으면 이것이 확산 샘플러다. 역시간 SDE와 probability flow ODE는 종이 위에서 정확하지만, 샘플러는 자기에게 없는 세 가지, 참 종단 분포, 참 score, 연속 시간을 대체한다. 여기서는 그 밖의 모든 것이 닫힌 형태로 알려져 있으므로, 각 대체를 하나씩만 켜고 입자들이 어디에 도착하는지 그 영향을 볼 수 있다.',
    'route-1': '<small>01 · LASER OFF</small><b>입자가 퍼진다</b><span>Brownian 운동이 무늬를 흐린다. forward 과정.</span>',
    'route-2': '<small>02 · LASER ON</small><b>입자가 모인다</b><span>되끌어 오는 방법 한 가족, ODE에서 SDE까지.</span>',
    'route-3': '<small>03 · APPROXIMATE</small><b>세 가지를 바꾼다</b><span>어디서 출발하는지, 어떤 장을 느끼는지, 얼마나 자주 갱신되는지.</span>',
    'hero-note': '토이 모델: 8 × 6 배열의 덫 자리 48개. 시각 t의 세기 장은 p<sub>t</sub>이고 입자가 느끼는 힘은 ∇ log p<sub>t</sub>다. 가우시안 빔 하나에서는 이것이 광학 덫의 익숙한 선형 복원력이다. 등고선은 빛, 점은 입자, 막대는 덫마다 포획한 입자 수를 정확한 확률 질량 비율과 비교한 것이다. 대응 관계는 명시했고 그 한계는 끝에 적었다.',

    'forward-title': '입자가 퍼지고 무늬가 흐려진다',
    'forward-intro': '레이저를 끄면 각 입자는 유체 속에서 Brownian 운동을 한다. dx = dw, 드리프트 0, 확산 계수 1의 variance-exploding forward SDE다. 입자는 덫 자리마다 하나씩, 폭 τ = 0.06의 촘촘한 48개 무리에서 출발한다. 드리프트가 아핀이므로 시각 t의 밀도는 모든 성분이 t만큼 넓어진 같은 48개 가우시안 혼합이며 닫힌 형태로 알려진다. 법칙을 알기 위해 시뮬레이션은 필요 없다. 점들은 그 법칙의 한 실현이다.',
    'forward-source': '섭동 커널과 주변밀도 · Score SDE 노트 PDF 18, 21쪽 · f = 0, g = 1이면 Fokker–Planck 방정식은 열방정식 ∂<sub>t</sub>p = ½ Δp (34, 51쪽).',
    'forward-view': '무리가 퍼지는 것을 본다',
    'btn-again': '새 실현',
    'forward-arrows': '힘의 장 ∇ log p<sub>t</sub> 표시',
    'forward-time': '레이저를 끈 뒤 지난 시간 t',
    'm-variance': '무리 분산 τ² + t',
    'm-contrast': '덫 대비',
    'forward-left': '세기 p<sub>t</sub>(등고선)와 입자 384개',
    'forward-right': '닫힌 형태로 구한 p<sub>t</sub>의 x 주변밀도',
    'forward-legend': '수식에서 강조된 부분: 슬라이더는 τ² + t를 움직인다. 48개의 점은 t ≈ 0.05에서 하나의 넓은 빛으로 합쳐진다. 덫 대비는 덫 자리와 이웃까지 중간점 사이의 세기 비율이고, 신호대잡음비 1 / t는 퍼져 나가는 입자가 자기가 떠난 덫을 아직 얼마나 기억하는지 말한다.',

    'family-title': '되끌어 오기: 샘플러 한 가족',
    'family-intro': '이제 빛을 켜고 시간에 따라 점점 선명하게 조인다. 매 순간의 세기는 t가 0을 향해 줄어드는 p<sub>t</sub>다. 입자를 모는 방법은 하나가 아니라 한 매개변수 가족이다. 모든 η ≥ 0에 대해 아래 과정은 forward 과정과 같은 주변분포를 가진다. 드리프트에 더해진 score가, 노이즈가 Fokker–Planck 방정식에 더하는 확산을 정확히 상쇄하기 때문이다. η = 1은 역시간 SDE로 입자가 자기 열요동 속에서 끌려오고, η = 0은 probability flow ODE로 입자가 요동 없이 장을 따라 끌려온다.',
    'family-source': '하나의 주변분포 가족, 여러 과정 · Score SDE 노트 PDF 78쪽 · 역시간 SDE 63쪽, probability flow ODE 73쪽.',
    'family-view': '같은 포획, 다른 경로',
    'btn-noise': '새 노이즈',
    'btn-starts': '새 출발점',
    'family-colors': '출발점 색',
    'family-trails': '궤적',
    'progress': '진행 (t는 1에서 0으로)',
    'family-left': '정확한 출발점, 정확한 장, 256 스텝의 입자 1024개',
    'family-right': '정확한 질량 비율과 비교한 덫별 포획 수',
    'm-tv': '포획 오차 (전변동)',
    'm-spread': '퍼짐 / 정확값',
    'm-floor': '정확한 표본 1024개의 바닥값',
    'family-legend': '입자는 출발 위치에 따라 색을 입혔다. η = 0에서는 색이 매끄러운 그러데이션으로 도착한다. ODE의 해는 교차하지 않으므로 출발점에서 도착점으로의 사상은 전단사이고 이웃은 이웃으로 남는다. η = 1에서는 색이 뒤섞인다. 오른쪽의 덫별 포획 수는 두 경우에 같다. 샘플러는 정체성이 아니라 질량을 맞춘다. 입자를 클릭하면 그 경로를 따라갈 수 있다.',
    'family-bridge': '<b>지금까지는 모두 정확했다.</b><span>샘플러에는 그중 아무것도 없다. 종단 분포도, 장도, 연속 시간도. 다음 절은 이것들을 한 번에 하나씩 바꾼다.</span>',

    'lab-title': '세 가지 치환, 한 번에 하나씩',
    'lab-intro': 'f = 0, g = 1이면 이 가족의 역방향 한 스텝은 한 줄이다. 샘플러는 그 안에서 세 가지를 바꾼다. 입자가 어디서 출발하는지, 어떤 장을 느끼는지, 스텝 h가 얼마나 큰지, 즉 장이 얼마나 자주 갱신되는지. 강의 노트는 이 셋을 유일한 근사로 꼽으며, 이 토이는 나머지 모든 양을 정확하게 유지하여 각각을 따로 잴 수 있게 한다.',
    'lab-source': 'From the oracle to the model · Score SDE 노트 PDF 86쪽 (세 가지 치환) · Euler–Maruyama 스텝 87쪽.',
    'lab-source2': '이 페이지에서 정의. 학습된 score는 오차를 알 수 없는 회귀 추정치다(denoising score matching, 83–84쪽). 그 자리에 통제된 오차 둘을 넣는다. 더 흐린 시각의 장을 읽는 초점 흐림 δ와, 모든 입자를 같은 방향으로 미는 drift b.',
    'lab-view': '치환을 하나 켠다',
    'tab-start': '출발점', 'tab-start-sub': '입자를 엉뚱한 분포에서 풀어놓음',
    'tab-score': '장', 'tab-score-sub': '초점이 흐린 빔, 옆으로 미는 drift',
    'tab-grid': '스텝', 'tab-grid-sub': '장을 연속이 아니라 펄스로 갱신',
    'lab-T': '종단 시간 T (레이저를 꺼 둔 시간)',
    'lab-start-law': '입자를 풀어놓는 분포',
    'opt-exact': 'p_T 자체 (정확)',
    'opt-prior': 'N(0, T I), 가우시안 prior',
    'm-klbound': 'KL 상계 ½ SNR(T) E‖x₀‖²',
    'm-kl': 'KL(p<sub>T</sub> ‖ N(0, T I)), 수치적분',
    'lab-bias': 'Drift b<sub>x</sub>',
    'lab-smooth': '초점 흐림 δ',
    'lab-arrows': '입자가 느끼는 장을 t = 0.02에서 표시',
    'lab-nfe': '장 평가 횟수 (펄스 수)',
    'lab-method': '방법',
    'opt-auto': 'Euler–Maruyama (η > 0) / Heun (η = 0)',
    'opt-euler': 'Euler, η = 0만',
    'opt-heun': 'Heun, η = 0만',
    'm-step': '스텝 h = T / 스텝 수',
    'm-nfe': '실제 평가 횟수',
    'lab-eta': '과정 η (0 = ODE, 1 = 역 SDE)',
    'btn-reset': '정확한 설정으로',
    'lab-left': '입자 2048개가 도착하는 곳',
    'lab-right': '정확한 질량 비율과 비교한 덫별 포획 수',
    'm-ks': 'KS 거리, x 주변분포',
    'lab-legend': '입자 2048개 중 600개를 그리며 모든 지표는 전부를 쓴다. 포획 오차는 각 덫에 가장 가까운 입자의 비율을 그 칸 안의 p₀의 정확한 질량과 비교한다. 질량이 어디로 갔는지를 묻는다. 퍼짐은 가장 가까운 자리까지 거리의 제곱평균제곱근을 정확한 값에 대한 비율로 적는다. 얼마나 조밀하게 모였는지를 묻는다. 작은 회색 숫자는 p₀에서 정확히 뽑은 2048개의 값, 즉 각 지표의 바닥값이다.',
    'lab-point-start': '<b>출발점.</b> 강의는 불일치를 신호대잡음비로 묶는다. KL(p<sub>T</sub> ‖ N(0, P(T) I)) ≤ ½ SNR(T) E‖x₀‖² (PDF 23, 26쪽). 여기서 SNR(T) = 1 / T이고 상계는 한 자릿수쯤 느슨하지만 추세는 맞다. ODE는 전단사라서 T에서 틀린 것을 t = 0까지 그대로 운반하고, SDE는 요동을 계속 더하고 되끌어 오므로 입자를 어디서 풀어놓았는지 잊을 수 있다.',
    'lab-point-score': '<b>장.</b> drift는 덫 사이에서 질량을 옮겨 무늬 전체를 옆으로 밀고, 초점 흐림은 포획 수는 유지한 채 모든 무리를 넓힌다. 이 가족은 장을, 따라서 drift도, (1 + η²)/2배 하므로 이 토이에서 SDE는 상수 drift에 ODE보다 <em>더</em> 민감하다. 확률적 샘플링이 강건하다는 통상의 논증은 요동치며 평균적으로 상쇄되는 오차에 대한 것이며, 상수 drift는 그렇지 않다.',
    'lab-point-grid': '<b>스텝.</b> 장은 뻣뻣하다. ‖∇ log p<sub>t</sub>‖가 1 / (τ² + t)처럼 커지므로 t = 0 근처의 마지막 펄스들이 결정적이다. 같은 평가 횟수에서 ODE의 Euler가 128 정도까지는 가장 정확하고, Heun은 성긴 격자에서 덫을 지나쳐 256부터 비로소 효과를 내며, Euler–Maruyama는 마지막 스텝에 √h ≪ τ가 필요하고 그렇지 않으면 자기 요동으로 무리가 넓어진다.',

    'budget-title': '오차 예산',
    'budget-intro': '각 패널은 나머지 두 치환을 끈 채 노브 하나를 쓸어 보며, 가족의 양 끝인 Heun을 쓴 probability flow ODE(η = 0, 파랑)와 Euler–Maruyama를 쓴 역 SDE(η = 1, 빨강)를 함께 그린다. T 쓸기는 스텝 크기 h = 1/128을 고정하여, 레이저를 오래 꺼 둔 것이 성긴 펄스와 혼동되지 않게 했다. 점당 입자 2048개이며 점선은 정확한 표본 2048개의 바닥값이다.',
    'budget-view': '노브 하나씩',
    'sw-T': 'N(0, T I)에서 출발 · T에 대한 포획 오차',
    'sw-bias': 'Drift · b<sub>x</sub>에 대한 포획 오차',
    'sw-smooth': '초점 흐림 · δ에 대한 퍼짐 비율',
    'sw-nfe': '펄스 · 평가 횟수에 대한 퍼짐 비율',
    'btn-recompute': '이 브라우저에서 다시 계산',
    'budget-note': '이 예산은 더해지지 않는다. 질량을 엉뚱한 덫으로 옮긴 drift는 펄스를 늘려도 고쳐지지 않고, 성긴 펄스는 레이저를 더 오래 꺼 두어도 고쳐지지 않는다. 질량을 옮기는 두 치환(출발점, drift)과 넓히는 두 치환(초점 흐림, 펄스)은 두 지표에서 깔끔하게 갈라진다.',

    'flow-title': 'Flow matching이 바꾸는 것과 바꾸지 않는 것',
    'flow-intro': 'Flow matching은 score를 쓰지 않지만, 가우시안 source에서는 학습하는 장이 곧 score다. 조건부 속도는 조건부 score의 아핀 함수이고, 사후분포에 대해 평균하면 주변 score가 된다. 맞춘 스케줄 α<sub>s</sub> = b<sub>T−s</sub>, σ<sub>s</sub> = a<sub>T−s</sub>에서 flow matching ODE는 (0, T) 위의 probability flow ODE다.',
    'flow-source': '주변 속도는 주변 score다 · Flow-based 노트 PDF 64쪽 · 열린 구간에서의 동일시 69, 74쪽.',
    'flow-point-1': '<b>출발점</b>은 더 이상 근사가 아니다. b₀ = 0이므로 보간은 t = 0에서 prior에 정확히 도달한다. 그 대가는 맞춘 확산이 치른다. 그 계수는 그 끝점에서 발산하고, 확산은 유한 시간에 N(0, I)에 도달할 수 없다.',
    'flow-point-2': '<b>장</b>의 오차는 속도 오차가 된다. Conditional flow matching은 ȧ<sub>t</sub>x₀ + ḃ<sub>t</sub>x<sub>T</sub>에 회귀하며 그 최소점은 주변 속도다. denoising score matching을 성립시키는 것과 같은 조건부 기대값 논증이다.',
    'flow-point-3': '<b>스텝</b>은 그대로다. 직선인 조건부 경로가 주변 궤적을 직선으로 만들지는 않는다. solver는 여전히 곡선을 따라간다.',
    'limits-title': '대응이 멈추는 곳',
    'limits-body': '실제 광학 덫은 작은 입자를 ∇I에 비례하는 힘으로 끈다. 여기서의 힘은 ∇ log p<sub>t</sub>로, 가우시안 빔 하나의 선형 복원력과는 일치하지만 배열에서는 사후확률로 가중한 합이다. 빛을 variance-exploding 스케줄 τ² + t로 조이는 것은 수학적 선택이지 실험적 선택이 아니다. 초점 흐림과 drift는 효과를 예측하고 확인할 수 있어서 학습된 네트워크의 알 수 없는 오차 대신 넣은 것이지 전형적이어서가 아니다. 시간 격자는 균일하다. 비균일 간격은 3절의 뻣뻣함에 대한 표준 처방이지만 강의 범위 밖이라 제외했다.',
    'scope-title': '모델과 출처',
    'scope-body': '토이: 가우시안 48개, τ = 0.06, 자리 간격 0.22, forward dx = dw. p<sub>t</sub>, ∇ log p<sub>t</sub>, 칸 질량, x 주변분포는 닫힌 형태. KL은 140 × 140 수치적분. 신경망은 없다. 샘플러: η > 0에는 Euler–Maruyama, η = 0에는 Euler 또는 Heun을 쓰는 η 가족이며 시드를 고정해 모든 실행을 재생할 수 있다. 테스트(node --test)는 score와 유한차분, 열방정식, KL 상계, 칸 질량과 Monte Carlo, 가족의 주변분포 정렬을 검사한다. 강의 노트: <em>Diffusion Models의 수학적 원리</em>, 문태섭 교수, 2026년 가을 (Score SDE, Flow-based, 미분방정식 부록). Lai, Song, Kim, Mitsufuji, Ermon, <em>The Principles of Diffusion Models</em>, arXiv:2510.21890을 따른다. 광학 포획: A. Ashkin 외, <em>Observation of a single-beam gradient force optical trap for dielectric particles</em>, Optics Letters 1986.',

    'btn-play': '재생', 'btn-pause': '일시정지',
    'lbl-marginal': 'p_t의 x 주변밀도',
    'lbl-slots': '덫 1 … 48 · 막대 = 입자, 선 = 정확한 질량',
    'lbl-floor': '바닥값',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-T': 'T', 'lbl-tilt': 'b_x', 'lbl-blur': 'δ', 'lbl-evals': '평가 횟수',
    'lbl-tv': '포획 오차', 'lbl-spread': '퍼짐 / 정확값',
    'lbl-noise-time': '시간 t =',
    'status-running': '계산 중…', 'status-done': '완료', 'status-pre': 'node에서 같은 코드로 미리 계산한 값',
  };
  const en = {
    'btn-play': 'Play', 'btn-pause': 'Pause',
    'lbl-marginal': 'x-marginal of p_t',
    'lbl-slots': 'trap 1 … 48 · bars = particles, line = exact mass',
    'lbl-floor': 'floor',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-T': 'T', 'lbl-tilt': 'b_x', 'lbl-blur': 'δ', 'lbl-evals': 'field evaluations',
    'lbl-tv': 'capture error', 'lbl-spread': 'spread / exact',
    'lbl-noise-time': 'time t =',
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
