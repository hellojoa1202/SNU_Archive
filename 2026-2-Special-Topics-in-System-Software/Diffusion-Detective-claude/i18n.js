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
    'hero-lead': 'Prior, score, 시간 격자. 샘플러가 대체하는 것을 하나씩 따로 잰다.',
    'hero-body': '역시간 SDE와 probability flow ODE는 참 종단 분포에서 참 score로 연속 시간에 돌릴 때 정확하다. 샘플러에는 이 셋이 모두 없다. 가우시안 prior에서 출발하고, 학습된 score를 따르고, 이산 스텝을 밟는다. 강의 노트는 이것이 유일한 근사라고 적는다. 이 노트는 그 밖의 모든 양이 닫힌 형태로 알려진 토이 모델을 만들어, 각 치환을 하나씩만 켜고 생성된 분포에 미치는 영향을 측정한다.',
    'route-1': '<small>01 · FORWARD</small><b>Forward SDE와 주변분포</b><span>열방정식으로 넓어지는 48성분 혼합.</span>',
    'route-2': '<small>02 · REVERSE</small><b>샘플러 한 가족</b><span>역 SDE와 probability flow ODE는 모든 주변분포를 공유한다.</span>',
    'route-3': '<small>03 · APPROXIMATE</small><b>Prior, score, 이산화</b><span>치환 하나씩, 오차를 측정한다.</span>',
    'hero-note': '토이 모델: p<sub>data</sub>는 8 × 6 격자 위 폭 τ = 0.06의 가우시안 48개의 균등 혼합, forward 과정은 dx = dw이며, score, 주변분포, 칸 질량, prior에 대한 KL은 모두 닫힌 형태 또는 수치적분으로 계산한다. 신경망 학습은 없다. 그림은 빛의 세기가 p<sub>t</sub>인 광학 덫 배열로 읽을 수 있다. 그 해석은 도움이 되는 곳에서만 쓰고 한계는 끝에 적었다.',

    'forward-title': 'Forward SDE와 그 주변분포',
    'forward-intro': 'Forward 과정은 f = 0, g = 1인 variance-exploding 사례 dx = dw이며 σ²(t) = t다. 아핀 드리프트 아래 섭동 커널은 가우시안 p<sub>t</sub>(x<sub>t</sub> | x<sub>0</sub>) = N(x<sub>0</sub>, t I)이고, 주변분포는 모든 성분이 t만큼 넓어진 데이터 혼합이다. 밀도는 열방정식 ∂<sub>t</sub>p = ½ Δp를 풀며, 아래 표본은 그 법칙을 따르는 SDE의 한 실현이다.',
    'forward-source': '섭동 커널과 주변밀도 · Score SDE 노트 PDF 18, 21쪽 · Fokker–Planck와 열방정식 34, 51쪽.',
    'forward-view': 'Forward SDE의 표본과 주변분포 p<sub>t</sub>',
    'btn-again': '새 실현',
    'forward-arrows': 'score ∇ log p<sub>t</sub>',
    'forward-time': '시각 t',
    'm-variance': '성분 분산 τ² + t',
    'm-contrast': '봉우리 대비',
    'forward-left': '표본 384개 · 회색 등고선: p<sub>t</sub>',
    'forward-right': '닫힌 형태로 구한 p<sub>t</sub>의 x 주변밀도',
    'forward-legend': '슬라이더는 강조된 항 τ² + t를 움직인다. 48개의 봉우리는 t ≈ 0.05에서 하나의 분지로 합쳐진다. 봉우리 대비는 성분 중심과 이웃까지 중간점 사이의 밀도 비율이고, SNR(t) = E²/P = 1 / t는 x<sub>t</sub>가 x<sub>0</sub>를 얼마나 기억하는지를 재는 강의의 척도다.',

    'family-title': '역시간 SDE와 probability flow ODE는 주변분포를 공유한다',
    'family-intro': '두 생성 방정식은 같은 방식으로 보증된다. 후보의 Fokker–Planck 방정식을 쓰고, forward 주변분포가 그것을 푼다는 것을 확인하고, 유일성에 나머지를 맡긴다. 둘은 한 매개변수 가족의 양 끝이다. 모든 η ≥ 0에 대해 아래 과정은 같은 주변분포를 지난다. 드리프트에 더해진 ½ η² g²배의 score가, 노이즈가 Fokker–Planck 방정식에 더하는 ½ η² g² Δp를 정확히 상쇄하기 때문이다. η = 1이 역시간 SDE, η = 0이 probability flow ODE다.',
    'family-source': '하나의 주변분포 가족, 여러 과정 · Score SDE 노트 PDF 78쪽 · 역시간 SDE 63쪽, probability flow ODE 73쪽.',
    'family-view': '입자 하나를 따라가고, 전체 분포를 비교한다.',
    'btn-noise': '새 노이즈, 같은 출발점',
    'btn-starts': '새 초기 표본',
    'progress': '생성 진행',
    'family-count': '표본 수',
    'family-left': '역시간 SDE (η = 1)',
    'family-right': 'Probability flow ODE (η = 0)',
    'family-legend': '파랑: SDE · 빨강: ODE · 회색 등고선: 해석적 p<sub>t</sub>. 두 패널은 정확한 종단 분포 p<sub>1</sub>의 같은 표본에서 출발하고 정확한 score로 256 스텝을 밟는다. 점을 클릭하면 같은 초기 입자를 두 패널에서 추적하고, 화살표 키로 이웃을 고른다.',
    'm-sde-ks': 'SDE: x 주변분포 KS 거리',
    'm-ode-ks': 'ODE: x 주변분포 KS 거리',
    'm-sep': '추적 입자의 거리',
    'family-note': '주변분포는 모든 시각에서 일치하지만 궤적은 다르다. ODE의 해는 교차하지 않으므로 x<sub>1</sub>에서 x<sub>0</sub>로의 사상은 전단사이고, SDE의 끝점은 출발점의 함수가 아니다. 두 KS 거리에는 유한 표본과 이산화 효과가 들어 있으며, 정확한 표본 1024개에서는 약 0.03이다.',
    'family-bridge': '<b>위의 모든 것은 참 p<sub>1</sub>, 참 score, 촘촘한 격자를 썼다.</b><span>샘플러에는 그중 아무것도 없다. 다음 절은 이것들을 한 번에 하나씩 바꾼다.</span>',

    'lab-title': 'Prior, score, 이산화: 치환을 한 번에 하나씩',
    'lab-intro': 'f = 0, g = 1이면 이 가족의 역방향 한 스텝은 한 줄이고, 샘플러는 그 안에서 정확히 세 가지를 바꾼다. x<sub>T</sub>의 분포, 평가하는 score, 스텝 h. 강의는 치환을 나열한다. p<sub>T</sub> 대신 p<sub>prior</sub>, ∇ log p<sub>t</sub> 대신 s<sub>ϕ</sub>, 연속 시간 대신 격자. 그리고 이것이 셋뿐임을 적는다. 여기서는 나머지 둘을 정확하게 둔 채 각각을 하나씩 켠다.',
    'lab-source': 'From the oracle to the model · Score SDE 노트 PDF 86쪽 · Euler–Maruyama 스텝 87쪽.',
    'lab-source2': '이 페이지에서 정의. 학습된 score는 오차를 알 수 없는 회귀 추정치다(denoising score matching, 83–84쪽). 그 자리에 통제된 오차 둘을 넣는다. δ ≥ 0은 더 늦고 매끄러운 시각에서 score를 평가하고, b는 상수 벡터를 더한다.',
    'lab-view': '치환을 하나 켠다',
    'tab-start': 'Prior', 'tab-start-sub': 'p<sub>T</sub> 대신 N(0, T I)',
    'tab-score': 'Score', 'tab-score-sub': '∇ log p<sub>t</sub> 대신 s̃',
    'tab-grid': '이산화', 'tab-grid-sub': '연속 시간 대신 스텝',
    'lab-T': '종단 시간 T',
    'lab-start-law': '초기 분포',
    'opt-exact': 'p_T (정확)',
    'opt-prior': 'N(0, T I)',
    'm-klbound': '상계 ½ SNR(T) E‖x₀‖²',
    'm-kl': 'KL(p<sub>T</sub> ‖ N(0, T I))',
    'lab-bias': '상수 편향 b<sub>x</sub>',
    'lab-smooth': '평활화 δ',
    'lab-arrows': 't = 0.02에서 s̃ 표시',
    'lab-nfe': 'score 평가 횟수',
    'lab-method': '적분기',
    'opt-auto': 'Euler–Maruyama (η > 0) / Heun (η = 0)',
    'opt-euler': 'Euler, η = 0',
    'opt-heun': 'Heun, η = 0',
    'm-step': '스텝 h = T / 스텝 수',
    'm-nfe': '실제 평가 횟수',
    'lab-eta': 'η (0 = probability flow ODE, 1 = 역 SDE)',
    'btn-noise2': '새 노이즈',
    'btn-reset': '정확한 설정으로',
    'lab-left': '최종 표본 · 회색 등고선: p<sub>0</sub>',
    'lab-right': '표본의 x 주변분포와 p<sub>0</sub>',
    'm-tv': '봉우리 질량 오차 (48칸 전변동)',
    'm-spread': '봉우리 내 퍼짐 / 정확값',
    'm-ks': 'x 주변분포 KS 거리',
    'lab-legend': '표본 2048개 중 600개를 그리며 모든 지표는 전부를 쓴다. 봉우리 질량 오차는 48개 중심 각각에 가장 가까운 표본의 비율을 그 칸 안의 p₀의 정확한 질량과 비교한다. 질량이 어디로 갔는지를 묻는다. 퍼짐은 가장 가까운 중심까지 거리의 제곱평균제곱근을 정확한 값에 대한 비율로 적는다. 얼마나 조밀하게 모였는지를 묻는다. 작은 회색 숫자는 p₀에서 정확히 뽑은 2048개의 값, 즉 각 지표의 바닥값이다.',
    'lab-point-start': '<b>Prior.</b> 강의는 불일치를 신호대잡음비로 묶는다. KL(p<sub>T</sub> ‖ N(0, P(T) I)) ≤ ½ SNR(T) E‖x₀‖² (PDF 23, 26쪽). 여기서 SNR(T) = 1 / T이고 상계는 한 자릿수쯤 느슨하지만 추세는 맞다. ODE는 전단사라서 T에서 틀린 것을 t = 0까지 그대로 운반하고, SDE는 노이즈를 계속 넣고 score 전체로 되끌어 오므로 출발점을 잊는다.',
    'lab-point-score': '<b>Score.</b> 상수 편향은 봉우리 사이에서 질량을 옮기고 분포 전체를 밀며, 평활화는 봉우리 질량은 유지한 채 모든 봉우리를 넓힌다. 이 가족은 score를, 따라서 편향도, (1 + η²)/2배 하므로 이 토이에서 SDE는 상수 편향에 ODE보다 <em>더</em> 민감하다. 확률적 샘플링이 강건하다는 통상의 논증은 요동치며 평균적으로 상쇄되는 오차에 대한 것이며, 상수 편향은 그렇지 않다.',
    'lab-point-grid': '<b>이산화.</b> score는 뻣뻣하다. ‖∇ log p<sub>t</sub>‖가 1 / (τ² + t)처럼 커지므로 t = 0 근처의 마지막 스텝이 결과를 결정한다. 같은 평가 횟수에서 ODE의 Euler가 128 정도까지는 가장 정확하고, Heun은 성긴 격자에서 지나쳐 256부터 비로소 효과를 내며, Euler–Maruyama는 마지막 스텝에 √h ≪ τ가 필요하고 그렇지 않으면 자기 노이즈로 봉우리가 넓어진다.',

    'budget-title': '오차 예산',
    'budget-intro': '각 패널은 나머지 두 치환을 끈 채 노브 하나를 쓸어 보며, 가족의 양 끝인 Heun을 쓴 probability flow ODE(η = 0, 파랑)와 Euler–Maruyama를 쓴 역 SDE(η = 1, 빨강)를 함께 그린다. T 쓸기는 h = 1/128을 고정하여 긴 forward 시간이 성긴 격자와 혼동되지 않게 했다. 점당 표본 2048개이며 점선은 정확한 표본 2048개의 값이다.',
    'budget-view': '노브 하나씩',
    'sw-T': 'Prior · T에 대한 봉우리 질량 오차',
    'sw-bias': 'Score 편향 · b<sub>x</sub>에 대한 봉우리 질량 오차',
    'sw-smooth': 'Score 평활화 · δ에 대한 퍼짐 비율',
    'sw-nfe': '이산화 · 평가 횟수에 대한 퍼짐 비율',
    'btn-recompute': '이 브라우저에서 다시 계산',
    'budget-note': '이 예산은 더해지지 않는다. 질량을 엉뚱한 봉우리로 옮긴 편향은 스텝을 늘려도 고쳐지지 않고, 성긴 격자는 forward 시간을 늘려도 고쳐지지 않는다. 질량을 옮기는 두 치환(prior, 편향)과 넓히는 두 치환(평활화, 격자)은 두 지표에서 갈라진다.',

    'flow-title': 'Flow matching은 probability flow ODE다',
    'flow-intro': '가우시안 source에서 flow matching이 학습하는 장은 다른 글자로 쓴 score다. 조건부 속도는 조건부 score의 아핀 함수이고, 사후분포에 대해 평균하면 주변 score가 된다. 맞춘 스케줄 α<sub>s</sub> = b<sub>T−s</sub>, σ<sub>s</sub> = a<sub>T−s</sub>에서 flow matching ODE와 그 확산의 probability flow ODE는 (0, T)에서 분포가 일치한다.',
    'flow-source': '주변 속도는 주변 score다 · Flow-based 노트 PDF 64쪽 · 열린 구간에서의 동일시 69, 74쪽.',
    'flow-point-1': '<b>Prior</b>는 더 이상 근사가 아니다. b₀ = 0이므로 보간은 t = 0에서 p<sub>prior</sub>에 정확히 도달한다. 그 대가는 맞춘 확산이 치른다. 그 계수는 그 끝점에서 발산하고, 확산은 유한 시간에 N(0, I)에 도달할 수 없다.',
    'flow-point-2': '<b>Score</b> 오차는 속도 오차가 된다. Conditional flow matching은 ȧ<sub>t</sub>x₀ + ḃ<sub>t</sub>x<sub>T</sub>에 회귀하며, denoising score matching을 성립시키는 것과 같은 조건부 기대값 논증으로 그 최소점은 주변 속도다.',
    'flow-point-3': '<b>이산화</b>는 그대로다. 직선인 조건부 경로가 주변 궤적을 직선으로 만들지는 않는다. solver는 여전히 곡선을 따라간다.',
    'limits-title': '범위와 광학 덫 해석',
    'limits-body': '이 토이는 홀로그램 광학 덫 배열로 읽을 수 있다. 빛의 세기 p<sub>t</sub>, 유체 속 입자, 빛이 꺼졌을 때의 Brownian 운동, 켜졌을 때의 복원력, δ는 초점이 흐린 빔, b는 옆으로 흐르는 유체. 이 해석은 변위에 선형인 기울기 힘을 내는 가우시안 빔 하나에서는 정확하고, 배열에서는 느슨하다. 실제 힘은 ∇I에 비례하지만 샘플러는 ∇ log p<sub>t</sub>를 따른다. 스케줄 τ² + t는 수학적 선택이다. 편향과 평활화는 효과를 예측하고 확인할 수 있어서 학습된 네트워크의 알 수 없는 오차 대신 넣었지 전형적이어서가 아니다. 시간 격자는 균일하다. 비균일 간격은 3절의 뻣뻣함에 대한 표준 처방이지만 강의 범위 밖이다.',
    'scope-title': '모델과 출처',
    'scope-body': '토이: 가우시안 48개, τ = 0.06, 간격 0.22, forward dx = dw. p<sub>t</sub>, ∇ log p<sub>t</sub>, 칸 질량, x 주변분포는 닫힌 형태. KL은 140 × 140 수치적분. 샘플러: η > 0에는 Euler–Maruyama, η = 0에는 Euler 또는 Heun을 쓰는 η 가족이며 시드를 고정해 모든 실행을 재생할 수 있다. 테스트(node --test)는 score와 유한차분, 열방정식, KL 상계, 칸 질량과 Monte Carlo, 가족의 주변분포 정렬을 검사한다. 강의 노트: <em>Diffusion Models의 수학적 원리</em>, 문태섭 교수, 2026년 가을 (Score SDE, Flow-based, 미분방정식 부록). Lai, Song, Kim, Mitsufuji, Ermon, <em>The Principles of Diffusion Models</em>, arXiv:2510.21890을 따른다. 광학 포획: A. Ashkin 외, Optics Letters 1986.',

    'btn-play': '재생', 'btn-pause': '일시정지',
    'lbl-floor': '바닥값',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-evals': '평가 횟수',
    'lbl-noise-time': '노이즈 시간 t =',
    'lbl-analytic': '점선: 해석적 x 주변밀도',
    'lbl-samples': '표본',
    'lbl-x': 'x 좌표',
    'status-running': '계산 중…', 'status-done': '완료', 'status-pre': 'node에서 같은 코드로 미리 계산한 값',
  };
  const en = {
    'btn-play': 'Play', 'btn-pause': 'Pause',
    'lbl-floor': 'floor',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-evals': 'score evaluations',
    'lbl-noise-time': 'Noise time t =',
    'lbl-analytic': 'Dashed: analytic x-density',
    'lbl-samples': 'samples',
    'lbl-x': 'x-coordinate',
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
