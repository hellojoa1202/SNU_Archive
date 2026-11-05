/* i18n.js — every sentence on the page, in English (submission) and Korean (reading copy).
 * Keys match data-i18n attributes in English ver/index.html and Korean ver/index.html.
 * Inline mathematics uses \( ... \) and is rendered by KaTeX after insertion. */
(function (root) {
  'use strict';

  const S = {
    /* ---------- chrome ---------- */
    'skip': { en: 'Skip to content', ko: '본문으로 이동' },
    'lens-label': { en: 'Lens', ko: '보기' },
    'lens-puzzle': { en: 'Puzzle board', ko: '퍼즐 판' },
    'lens-landscape': { en: 'Landscape', ko: '지형' },
    'contents': { en: 'Contents', ko: '차례' },
    'contents-note': { en: 'One toy, one question: when a diffusion sampler misses, which of its three approximations is to blame?', ko: '토이 모델 하나, 질문 하나. 확산 샘플러가 빗나갈 때 세 가지 근사 중 무엇이 원인인가?' },
    'nav-board': { en: 'The board and the landscape', ko: '퍼즐 판과 지형' },
    'nav-family': { en: 'Rolling back: one family of samplers', ko: '되돌리기: 샘플러 한 가족' },
    'nav-lab': { en: 'Three substitutions', ko: '세 가지 치환' },
    'nav-budget': { en: 'The error budget', ko: '오차 예산' },
    'nav-flow': { en: 'What flow matching changes', ko: 'Flow Matching이 바꾸는 것' },
    'nav-limits': { en: 'Where the analogy stops', ko: '비유가 멈추는 곳' },
    'mode-auto': { en: 'auto + manual', ko: '자동 + 수동' },
    'mode-manual': { en: 'manual', ko: '수동' },
    'footer': { en: 'Diffusion Detective · Special Topics in System Software · Seoul National University · Fall 2026', ko: 'Diffusion Detective · 시스템소프트웨어특강 · 서울대학교 · 2026년 가을' },

    /* ---------- hero ---------- */
    'hero-eyebrow': { en: 'Interactive course notes · Mathematical principles of diffusion models', ko: '인터랙티브 강의 노트 · Diffusion Models의 수학적 원리' },
    'hero-title': { en: 'The Shaken <span>Puzzle Board.</span>', ko: '흔들린 <span>퍼즐 판.</span>' },
    'hero-lead': { en: 'Three approximations of a diffusion sampler, measured one at a time.', ko: '확산 샘플러의 세 가지 근사를 하나씩 따로 재어 본다.' },
    'hero-p1': { en: 'Every sampler built on the score SDE framework is exact on paper and approximate in practice, and the gap has exactly three sources: the Gaussian prior that stands in for \\(p_T\\), the learned score that stands in for \\(\\nabla\\log p_t\\), and the time grid that stands in for the continuum. These notes build a toy in which everything else is known in closed form, so that each substitution can be switched on alone and its effect on the generated distribution can be measured, not guessed. A fourth dial, the noise level \\(\\eta\\) of the sampler, decides how the three errors propagate. The puzzle and the landscape are two pictures of the same density; switch between them at any time.', ko: 'Score SDE 틀 위에 세워진 모든 샘플러는 종이 위에서는 정확하고 실제로는 근사이며, 그 간극의 원인은 정확히 셋이다. \\(p_T\\)를 대신하는 가우시안 prior, \\(\\nabla\\log p_t\\)를 대신하는 학습된 score, 연속 시간을 대신하는 시간 격자. 이 노트는 그 밖의 모든 것이 닫힌 형태로 알려진 토이 모델을 만들어, 각 치환을 하나씩만 켜고 생성된 분포에 미치는 영향을 추측이 아니라 측정한다. 네 번째 다이얼인 샘플러의 노이즈 수준 \\(\\eta\\)는 세 오차가 어떻게 전파되는지를 결정한다. 퍼즐과 지형은 같은 밀도를 보는 두 가지 그림이며 언제든 전환할 수 있다.' },
    'hero-lens-puzzle': { en: 'Slots are the modes of the data; a photograph printed under the board is revealed where probability mass arrives. Pieces are blank: the sampler recovers where mass goes, never which piece goes where.', ko: '홈은 데이터의 봉우리이고, 판 아래 인쇄된 사진은 확률 질량이 도착한 만큼 드러난다. 조각은 무늬가 없다. 샘플러는 질량이 어디로 가는지를 복원할 뿐 어느 조각이 어디로 가는지는 복원하지 않는다.' },
    'hero-lens-landscape': { en: 'The same density drawn as height \\(U_t=-\\log p_t\\). Valleys are slots, the score is the downhill direction, and the forward process is the landscape flattening under the heat equation.', ko: '같은 밀도를 높이 \\(U_t=-\\log p_t\\)로 그린 것. 골짜기가 홈이고 score는 내리막 방향이며, forward 과정은 열방정식에 따라 지형이 평평해지는 일이다.' },

    /* ---------- 1 board ---------- */
    'board-eyebrow': { en: 'The model', ko: '모델' },
    'board-title': { en: 'The board, the landscape, and the shaking', ko: '퍼즐 판, 지형, 그리고 흔들기' },
    'board-p1': { en: 'The data distribution is an equal mixture of 48 isotropic Gaussians whose centres \\(\\mu_k\\) sit on an \\(8\\times6\\) grid with pitch \\(0.22\\). Each component has standard deviation \\(\\tau=0.06\\), so neighbouring slots are \\(3.7\\,\\tau\\) apart and the mixture is sharply multimodal: 48 wells, one per slot.', ko: '데이터 분포는 간격 \\(0.22\\)의 \\(8\\times6\\) 격자 위에 중심 \\(\\mu_k\\)를 둔 48개의 등방 가우시안의 균등 혼합이다. 각 성분의 표준편차는 \\(\\tau=0.06\\)이므로 이웃한 홈은 \\(3.7\\,\\tau\\)만큼 떨어져 있고, 혼합 분포는 홈마다 하나씩 48개의 우물을 가진 뚜렷한 다봉 분포다.' },
    'board-p2': { en: 'Shaking the board is the variance-exploding instance of the forward SDE: zero drift and a unit diffusion coefficient, \\(\\sigma^2(t)=t\\). Because the drift is affine (here, zero) the perturbation kernel is Gaussian in closed form, and the marginal \\(p_t\\) stays a 48-component mixture whose only change is the variance \\(\\tau^2+t\\) of every component. Nothing has to be simulated to know the law at any time.', ko: '판을 흔드는 일은 forward SDE의 variance-exploding 사례다. 드리프트는 0, 확산 계수는 1, 즉 \\(\\sigma^2(t)=t\\). 드리프트가 아핀(여기서는 0)이므로 섭동 커널은 닫힌 형태의 가우시안이고, 주변분포 \\(p_t\\)는 모든 성분의 분산이 \\(\\tau^2+t\\)로 커지는 것 말고는 변하지 않는 48성분 혼합으로 남는다. 어느 시각의 법칙이든 시뮬레이션 없이 안다.' },
    'board-p3': { en: 'The density moves by the Fokker–Planck equation, which with zero drift is the heat equation. Read as a landscape with height \\(U_t=-\\log p_t\\): heat flows from the ridges into the valleys, the wells fill in, and by \\(t\\approx0.05\\) the 48 slots have merged into one broad basin. The score is minus the slope of this landscape. It points downhill into the nearest wells at small \\(t\\) and towards the centre of the board at large \\(t\\).', ko: '밀도는 Fokker–Planck 방정식을 따라 움직이며, 드리프트가 0이면 그것은 열방정식이다. 높이 \\(U_t=-\\log p_t\\)의 지형으로 읽으면, 능선에서 골짜기로 열이 흘러 우물이 메워지고, \\(t\\approx0.05\\)쯤이면 48개의 홈은 하나의 넓은 분지로 합쳐진다. score는 이 지형의 기울기에 마이너스를 붙인 것이다. 작은 \\(t\\)에서는 가장 가까운 우물로 내려가는 방향을, 큰 \\(t\\)에서는 판의 중심을 가리킨다.' },
    'board-fig-title': { en: 'Shake the board: the marginals \\(p_t\\) of the forward process', ko: '판 흔들기: forward 과정의 주변분포 \\(p_t\\)' },
    'board-caption': { en: 'Left: the board (or the landscape) at shaking time \\(t\\). In the puzzle lens the printed picture and the slot outlines fade with the slot contrast, the density ratio between a slot centre and the midpoint to its neighbour. Right: the \\(x\\)-marginal of \\(p_t\\) in closed form; the 48 columns of the grid appear as 8 peaks that merge into one. Arrows show the exact score, scaled and clipped for legibility.', ko: '왼쪽: 흔든 시간 \\(t\\)에서의 판(또는 지형). 퍼즐 보기에서는 인쇄된 그림과 홈 윤곽이 홈 대비, 즉 홈 중심과 이웃 홈까지의 중간점 사이 밀도 비율에 따라 흐려진다. 오른쪽: 닫힌 형태로 구한 \\(p_t\\)의 \\(x\\) 주변밀도. 격자의 48개 홈이 8개의 봉우리로 나타나 하나로 합쳐진다. 화살표는 정확한 score이며 읽기 쉽도록 크기를 조절하고 잘랐다.' },
    'board-p4': { en: 'Two numbers summarise how far the shaking has gone. The component variance \\(\\tau^2+t\\) says how blurred each well is. The signal-to-noise ratio \\(\\mathrm{SNR}(t)=1/t\\) says how much the noisy state still remembers its slot; the next sections return to it when the sampler has to start somewhere.', ko: '흔들기가 얼마나 진행됐는지는 두 숫자로 요약된다. 성분 분산 \\(\\tau^2+t\\)는 각 우물이 얼마나 흐려졌는지를 말한다. 신호대잡음비 \\(\\mathrm{SNR}(t)=1/t\\)는 노이즈 상태가 자기 홈을 아직 얼마나 기억하는지를 말하며, 샘플러가 어딘가에서 출발해야 할 때 다음 절에서 다시 등장한다.' },

    /* ---------- 2 family ---------- */
    'family-eyebrow': { en: 'Generation', ko: '생성' },
    'family-title': { en: 'Rolling back: one family of samplers', ko: '되돌리기: 샘플러 한 가족' },
    'family-p1': { en: 'The forward marginals can be retraced by two very different processes. The reverse-time SDE injects fresh noise at every instant and compensates with the full score in its drift. The probability flow ODE injects no noise at all and uses half the score. Both were certified the same way in the lectures: write down the Fokker–Planck equation of the candidate, check that the forward marginals solve it, and let uniqueness do the rest.', ko: 'forward 주변분포는 매우 다른 두 과정으로 되짚어 갈 수 있다. 역시간 SDE는 매 순간 새 노이즈를 넣고 드리프트에 score 전체를 넣어 보상한다. Probability flow ODE는 노이즈를 전혀 넣지 않고 score의 절반을 쓴다. 강의에서 둘은 같은 방식으로 보증됐다. 후보 과정의 Fokker–Planck 방정식을 쓰고, forward 주변분포가 그것을 푼다는 것을 확인하고, 유일성에 나머지를 맡긴다.' },
    'family-p2': { en: 'They are the two ends of a one-parameter family. For every \\(\\eta\\ge0\\) the process below passes through the same marginals: the extra \\(\\tfrac12\\eta^2 g^2\\) of score in the drift cancels exactly the extra \\(\\tfrac12\\eta^2g^2\\Delta p\\) that the noise adds to the Fokker–Planck equation. With \\(f=0\\), \\(g=1\\) and a backward step \\(h\\), one Euler–Maruyama step of the family is the line used by every sampler on this page:', ko: '둘은 한 매개변수 가족의 양 끝이다. 모든 \\(\\eta\\ge0\\)에 대해 아래 과정은 같은 주변분포를 지난다. 드리프트에 더해진 \\(\\tfrac12\\eta^2 g^2\\)배의 score가, 노이즈가 Fokker–Planck 방정식에 더하는 \\(\\tfrac12\\eta^2g^2\\Delta p\\)를 정확히 상쇄하기 때문이다. \\(f=0\\), \\(g=1\\), 역방향 스텝 \\(h\\)에서 이 가족의 Euler–Maruyama 한 스텝은 이 페이지의 모든 샘플러가 쓰는 한 줄이다.' },
    'family-p3': { en: 'In the puzzle: a piece that rattles (\\(\\eta=1\\)) is pushed downhill twice as hard as a piece that rolls quietly (\\(\\eta=0\\)), and the two end up filling the slots identically. Below, every ingredient is exact: the starts are drawn from \\(p_T\\) itself, the score is the true one, and the grid has 256 steps. This is the reference against which the next section measures everything.', ko: '퍼즐로 말하면, 덜덜 떨며 구르는 조각(\\(\\eta=1\\))은 조용히 구르는 조각(\\(\\eta=0\\))보다 두 배 세게 내리막으로 밀리고, 결국 둘은 홈을 똑같이 채운다. 아래에서는 모든 재료가 정확하다. 출발점은 \\(p_T\\) 자체에서 뽑고, score는 참값이며, 격자는 256 스텝이다. 다음 절은 이것을 기준으로 모든 것을 잰다.' },
    'family-fig-title': { en: 'The \\(\\eta\\)-family with exact start, exact score and a fine grid', ko: '정확한 출발점, 정확한 score, 촘촘한 격자에서의 \\(\\eta\\) 가족' },
    'family-caption': { en: 'Pieces are coloured by where they started (hue from the angle, lightness from the radius). At \\(\\eta=0\\) the colours arrive in a smooth gradient: the flow map is continuous and one-to-one, so neighbours stay neighbours. At \\(\\eta=1\\) the colours are scrambled, and the slot frequencies on the right are the same. Click a piece to follow it; the thin lines are the first 24 trajectories.', ko: '조각은 출발 위치에 따라 색을 입혔다(각도가 색상, 반지름이 밝기). \\(\\eta=0\\)에서는 색이 매끄러운 그러데이션으로 도착한다. 흐름 사상은 연속이고 일대일이므로 이웃은 이웃으로 남는다. \\(\\eta=1\\)에서는 색이 뒤섞이지만 오른쪽의 홈 빈도는 같다. 조각을 클릭하면 따라갈 수 있고, 가는 선은 처음 24개의 궤적이다.' },
    'family-p4': { en: 'The colours are the visible form of two theorems. Solutions of an ODE with a Lipschitz field never meet, so the flow map \\(\\Psi_{T\\to0}\\) is injective, and running it backwards shows it is onto: it is a bijection from noise to data. The SDE has no such map; its endpoint is not a function of its start. The lecture put it in one line: matching marginals, not trajectories.', ko: '색은 두 정리의 눈에 보이는 형태다. Lipschitz 장을 가진 ODE의 해는 결코 만나지 않으므로 흐름 사상 \\(\\Psi_{T\\to0}\\)는 단사이고, 거꾸로 돌리면 전사임이 드러난다. 노이즈에서 데이터로의 전단사다. SDE에는 그런 사상이 없다. 끝점은 출발점의 함수가 아니다. 강의는 한 줄로 썼다. 궤적이 아니라 주변분포가 맞는 것이다.' },
    'family-p5': { en: 'The readouts on the right are the three numbers used throughout. <b>Slot TV</b> compares the fraction of pieces nearest to each slot with the exact slot masses of \\(p_0\\): it sees mass in the wrong well. <b>Spread</b> is the root-mean-square distance from a piece to its slot centre, reported as a ratio to the exact value \\(0.077\\): it sees blur, in either direction. <b>KS</b> is the Kolmogorov–Smirnov distance between the empirical and the exact \\(x\\)-marginal. Each has a floor at finite sample size, shown as the value for the same number of exact draws from \\(p_0\\).', ko: '오른쪽의 수치는 이 페이지 전체에서 쓰는 세 숫자다. <b>홈 TV</b>는 각 홈에 가장 가까운 조각의 비율을 \\(p_0\\)의 정확한 홈 질량과 비교한다. 엉뚱한 우물에 들어간 질량을 본다. <b>퍼짐</b>은 조각에서 홈 중심까지 거리의 제곱평균제곱근이며 정확한 값 \\(0.077\\)에 대한 비율로 적는다. 양방향의 흐림을 본다. <b>KS</b>는 경험적 \\(x\\) 주변분포와 정확한 주변분포 사이의 Kolmogorov–Smirnov 거리다. 각 숫자는 유한 표본에서 바닥값을 가지며, 같은 개수를 \\(p_0\\)에서 정확히 뽑았을 때의 값으로 표시한다.' },

    /* ---------- 3 lab ---------- */
    'lab-eyebrow': { en: 'The three approximations', ko: '세 가지 근사' },
    'lab-title': { en: 'Three substitutions, one at a time', ko: '세 가지 치환, 한 번에 하나씩' },
    'lab-p1': { en: 'Both generative equations were certified with the true score, started from the true \\(p_T\\), and in continuous time. A sampler has none of these. The lecture lists the substitutions and insists that they are the only ones:', ko: '두 생성 방정식은 참 score로, 참 \\(p_T\\)에서 출발하여, 연속 시간에서 보증됐다. 샘플러에는 이 중 아무것도 없다. 강의는 치환을 나열하고 그것이 전부임을 강조한다.' },
    'lab-p2': { en: 'The panel below is a laboratory for these three lines. The reference setting is the one of section 2. Each knob switches on one substitution: the start can be the Gaussian \\(\\mathcal N(0,T\\,I)\\) instead of \\(p_T\\); the score can be tilted by a constant \\(b\\) or blurred by reading it at a later time \\(t+\\delta\\); the grid can be coarse, with Euler–Maruyama, Euler or Heun steps. The fourth knob, \\(\\eta\\), is not an approximation but decides how the others propagate. The outcome is measured by', ko: '아래 패널은 이 세 줄을 위한 실험실이다. 기준 설정은 2절의 것이다. 각 노브는 치환 하나를 켠다. 출발점을 \\(p_T\\) 대신 가우시안 \\(\\mathcal N(0,T\\,I)\\)로 바꿀 수 있고, score를 상수 \\(b\\)만큼 기울이거나 더 늦은 시각 \\(t+\\delta\\)에서 읽어 흐리게 할 수 있으며, 격자를 Euler–Maruyama, Euler, Heun 스텝으로 성기게 할 수 있다. 네 번째 노브 \\(\\eta\\)는 근사가 아니라 나머지가 어떻게 전파되는지를 결정한다. 결과는 다음으로 잰다.' },
    'lab-p3': { en: 'where \\(\\hat f_k\\) is the fraction of the \\(N\\) final points whose nearest slot is \\(k\\), \\(m_k\\) the exact mass of \\(p_0\\) in that slot, and \\(\\mu_{k(n)}\\) the centre nearest to point \\(n\\). In the puzzle lens the photograph is revealed tile by tile in proportion to \\(\\hat f_k/m_k\\): a hole in the picture is a slot that received too little mass.', ko: '여기서 \\(\\hat f_k\\)는 최종 점 \\(N\\)개 중 가장 가까운 홈이 \\(k\\)인 비율, \\(m_k\\)는 그 홈 안의 \\(p_0\\)의 정확한 질량, \\(\\mu_{k(n)}\\)은 점 \\(n\\)에 가장 가까운 중심이다. 퍼즐 보기에서는 사진이 \\(\\hat f_k/m_k\\)에 비례해 타일별로 드러난다. 그림의 구멍은 질량을 너무 적게 받은 홈이다.' },
    'lab-fig-title': { en: 'The laboratory: switch each substitution on alone', ko: '실험실: 치환을 하나씩만 켜 본다' },
    'lab-caption': { en: 'Every change re-runs the sampler with the same seeds and replays the run; drag the progress slider to inspect intermediate times. Small grey numbers are the finite-sample floors for the chosen \\(N\\). The step readout shows \\(h=T/\\text{steps}\\) and the number of score evaluations actually spent (Heun uses two per step).', ko: '설정을 바꿀 때마다 같은 시드로 샘플러를 다시 돌리고 재생한다. 진행 슬라이더를 끌어 중간 시각을 볼 수 있다. 작은 회색 숫자는 선택한 \\(N\\)에서의 유한 표본 바닥값이다. 스텝 항목은 \\(h=T/\\text{steps}\\)와 실제로 쓴 score 평가 횟수를 보여준다(Heun은 스텝당 두 번).' },
    'knob-start': { en: 'Start', ko: '출발점' },
    'knob-start-analogy': { en: 'how long was the board shaken', ko: '판을 얼마나 오래 흔들었나' },
    'knob-score': { en: 'Score', ko: 'Score' },
    'knob-score-analogy': { en: 'a tilted or blurred map of the wells', ko: '기울었거나 흐려진 우물 지도' },
    'knob-grid': { en: 'Grid', ko: '격자' },
    'knob-grid-analogy': { en: 'pieces jump instead of rolling', ko: '조각이 구르지 않고 점프한다' },
    'knob-process': { en: 'Process', ko: '과정' },
    'knob-process-analogy': { en: 'rolling quietly or rattling', ko: '조용히 구르기 또는 덜덜 떨기' },
    'ctl-start-exact': { en: 'from \\(p_T\\) (exact)', ko: '\\(p_T\\)에서 (정확)' },
    'ctl-start-prior': { en: 'from \\(\\mathcal N(0,T I)\\)', ko: '\\(\\mathcal N(0,T I)\\)에서' },
    'ctl-bias': { en: 'tilt \\(b_x\\)', ko: '기울기 \\(b_x\\)' },
    'ctl-smooth': { en: 'blur \\(\\delta\\)', ko: '흐림 \\(\\delta\\)' },
    'ctl-nfe': { en: 'evaluations', ko: '평가 횟수' },
    'ctl-solver': { en: 'method', ko: '방법' },
    'solver-auto': { en: 'default (EM · Heun)', ko: '기본 (EM · Heun)' },
    'solver-euler': { en: 'Euler (η = 0)', ko: 'Euler (η = 0)' },
    'solver-heun': { en: 'Heun (η = 0)', ko: 'Heun (η = 0)' },
    'ctl-count': { en: 'pieces \\(N\\)', ko: '조각 수 \\(N\\)' },
    'ctl-progress': { en: 'progress', ko: '진행' },
    'ctl-new-noise': { en: 'New noise', ko: '새 노이즈' },
    'ctl-new-starts': { en: 'New starts', ko: '새 출발점' },
    'ctl-colors': { en: 'colour by start', ko: '출발점 색' },
    'ctl-paths': { en: 'trajectories', ko: '궤적' },
    'ctl-reset': { en: 'Reset to exact', ko: '정확한 설정으로' },
    'ctl-shake': { en: 'shaking time \\(t\\)', ko: '흔든 시간 \\(t\\)' },
    'ctl-time': { en: 'time \\(t\\)', ko: '시각 \\(t\\)' },
    'ctl-arrows': { en: 'score arrows', ko: 'score 화살표' },
    'ctl-apply-lab': { en: 'Send to the laboratory', ko: '실험실에 적용' },
    'ctl-compute': { en: 'Compute', ko: '계산' },
    'ctl-recompute': { en: 'Recompute in this browser', ko: '이 브라우저에서 다시 계산' },
    'btn-play': { en: 'Play', ko: '재생' },
    'btn-pause': { en: 'Pause', ko: '일시정지' },
    'ro-variance': { en: 'component variance τ² + t', ko: '성분 분산 τ² + t' },
    'ro-contrast': { en: 'slot contrast', ko: '홈 대비' },
    'ro-snr': { en: 'SNR', ko: 'SNR' },
    'ro-tv': { en: 'slot TV', ko: '홈 TV' },
    'ro-spread': { en: 'spread / exact', ko: '퍼짐 / 정확값' },
    'ro-ks': { en: 'KS (x-marginal)', ko: 'KS (x 주변분포)' },
    'ro-floor': { en: 'floors (exact draws)', ko: '바닥값 (정확한 표본)' },
    'ro-step': { en: 'step h · evaluations', ko: '스텝 h · 평가 횟수' },
    'status-running': { en: 'computing…', ko: '계산 중…' },
    'status-done': { en: 'done in', ko: '소요' },
    'status-precomputed': { en: 'precomputed with the same code (node); recompute to verify', ko: '같은 코드(node)로 미리 계산함. 다시 계산해 확인할 수 있음' },

    /* 3.1 */
    'prior-title': { en: 'The start: a Gaussian in place of \\(p_T\\)', ko: '출발점: \\(p_T\\) 대신 가우시안' },
    'prior-p1': { en: 'Sampling begins from \\(p_{\\mathrm{prior}}=\\mathcal N(0,P(T)\\,I)\\) because \\(p_T\\) is unavailable. The lecture measures the mismatch by the signal-to-noise ratio. Two data points produce kernels whose KL divergence is \\(\\tfrac12\\mathrm{SNR}(T)\\|x_0-x_0^\\prime\\|^2\\), and the data-processing inequality lifts this to the marginal:', ko: '\\(p_T\\)를 쓸 수 없으므로 샘플링은 \\(p_{\\mathrm{prior}}=\\mathcal N(0,P(T)\\,I)\\)에서 시작한다. 강의는 이 불일치를 신호대잡음비로 잰다. 두 데이터 점이 만드는 커널 사이의 KL 발산은 \\(\\tfrac12\\mathrm{SNR}(T)\\|x_0-x_0^\\prime\\|^2\\)이고, data-processing 부등식이 이를 주변분포로 끌어올린다.' },
    'prior-p2': { en: 'In the toy \\(E\\equiv1\\) and \\(P(T)=T\\), so \\(\\mathrm{SNR}(T)=1/T\\) and \\(\\mathbb E\\|x_0\\|^2=0.401\\). The bound is a straight line of slope \\(-1\\) on log axes. The true divergence, computed by quadrature, lies well below it and falls faster, but with the same trend: the board forgets its slots only as \\(T\\to\\infty\\), never at finite time. In the puzzle this is the board that was not shaken long enough and is nevertheless treated as fully shuffled.', ko: '토이에서는 \\(E\\equiv1\\), \\(P(T)=T\\)이므로 \\(\\mathrm{SNR}(T)=1/T\\)이고 \\(\\mathbb E\\|x_0\\|^2=0.401\\)이다. 상계는 로그 축에서 기울기 \\(-1\\)의 직선이다. 수치적분으로 구한 참 발산은 그보다 훨씬 아래에 있고 더 빨리 떨어지지만 추세는 같다. 판은 \\(T\\to\\infty\\)에서만 자기 홈을 잊고 유한 시간에는 결코 잊지 않는다. 퍼즐로는 충분히 오래 흔들지 않았는데 완전히 섞였다고 취급하는 판이다.' },
    'prior-fig-title': { en: '\\(p_T\\) against the Gaussian that replaces it', ko: '\\(p_T\\)와 그것을 대신하는 가우시안' },
    'prior-caption': { en: 'Left: the \\(x\\)-marginal of \\(p_T\\) (solid) and of \\(\\mathcal N(0,T\\,I)\\) (dashed) at the chosen \\(T\\). Right: the KL bound of the lecture and the numerical KL as functions of \\(T\\), log–log; the marker is the current \\(T\\). The slider is linked to the laboratory.', ko: '왼쪽: 선택한 \\(T\\)에서 \\(p_T\\)의 \\(x\\) 주변밀도(실선)와 \\(\\mathcal N(0,T\\,I)\\)의 주변밀도(점선). 오른쪽: 강의의 KL 상계와 수치 KL을 \\(T\\)의 함수로 로그–로그 축에 그린 것. 표시는 현재 \\(T\\)다. 슬라이더는 실험실과 연결돼 있다.' },
    'prior-p3': { en: 'How the start error reaches the end depends on \\(\\eta\\). The ODE is a bijection, so whatever mass is in the wrong place at \\(T\\) is carried, deformed but intact, to \\(t=0\\): in the laboratory, starting from the Gaussian at \\(T=0.25\\) with \\(\\eta=0\\) puts about a fifth of the mass into the wrong slots. The SDE keeps adding noise and pulling back with the full score, which lets it forget its start; the same experiment with \\(\\eta=1\\) halves the slot error. Section 4 sweeps \\(T\\) for both.', ko: '출발 오차가 끝까지 어떻게 전달되는지는 \\(\\eta\\)에 달려 있다. ODE는 전단사이므로 \\(T\\)에서 엉뚱한 곳에 있던 질량은 변형은 되지만 손실 없이 \\(t=0\\)까지 운반된다. 실험실에서 \\(T=0.25\\), \\(\\eta=0\\)으로 가우시안에서 출발하면 질량의 약 5분의 1이 엉뚱한 홈에 들어간다. SDE는 계속 노이즈를 더하고 score 전체로 되끌어 오므로 출발점을 잊을 수 있다. 같은 실험을 \\(\\eta=1\\)로 하면 홈 오차가 절반으로 준다. 4절에서 두 경우 모두에 대해 \\(T\\)를 쓸어 본다.' },

    /* 3.2 */
    'score-title': { en: 'The score: a regression estimate in place of \\(\\nabla\\log p_t\\)', ko: 'Score: \\(\\nabla\\log p_t\\) 대신 회귀 추정치' },
    'score-p1': { en: 'The marginal score is an integral over the whole data distribution and is never evaluated. A network is trained instead by denoising score matching, whose target is the conditional score \\(-\\epsilon/\\sigma_t\\) of the Gaussian kernel. The minimiser over all functions is the marginal score, so the objective is right; but a trained network is a finite approximation of that minimiser, and its error at a given \\((x,t)\\) is unknown.', ko: '주변 score는 데이터 분포 전체에 대한 적분이며 한 번도 직접 계산되지 않는다. 대신 네트워크를 denoising score matching으로 학습하며, 그 목표값은 가우시안 커널의 조건부 score \\(-\\epsilon/\\sigma_t\\)다. 모든 함수에 대한 최소점은 주변 score이므로 목적함수는 옳다. 그러나 학습된 네트워크는 그 최소점의 유한한 근사이고, 주어진 \\((x,t)\\)에서의 오차는 알 수 없다.' },
    'score-p2': { en: 'Rather than train a network and inherit an error we cannot characterise, the laboratory injects two errors we can. A <b>tilt</b> adds a constant \\(b\\) to the field, the board resting at an angle. A <b>blur</b> evaluates the exact score at the later time \\(t+\\delta\\), a map on which the wells are wider than they are. Blur is the more realistic of the two: a regression that averages over nearby inputs behaves like a score at a higher noise level, and this is precisely what goes wrong near \\(t=0\\), where the true score changes fastest.', ko: '특성을 알 수 없는 오차를 물려받으려고 네트워크를 학습시키는 대신, 실험실은 특성을 아는 오차 두 가지를 주입한다. <b>기울기</b>는 장에 상수 \\(b\\)를 더한다. 비스듬히 놓인 판이다. <b>흐림</b>은 정확한 score를 더 늦은 시각 \\(t+\\delta\\)에서 평가한다. 실제보다 우물이 넓게 그려진 지도다. 둘 중 흐림이 더 현실적이다. 가까운 입력들을 평균하는 회귀는 더 높은 노이즈 수준의 score처럼 행동하며, 참 score가 가장 빨리 변하는 \\(t=0\\) 근처에서 정확히 이 일이 벌어진다.' },
    'score-fig-title': { en: 'The exact field and the perturbed field', ko: '정확한 장과 섭동된 장' },
    'score-caption': { en: 'Left: the exact score at time \\(t\\). Right: the perturbed score \\(\\tilde s\\) for the chosen tilt and blur, drawn on the exact landscape so that the mismatch is visible. At small \\(t\\) blur removes the wells from the map entirely; tilt is a uniform offset that matters most while the true field is weak. The button copies both values into the laboratory.', ko: '왼쪽: 시각 \\(t\\)의 정확한 score. 오른쪽: 선택한 기울기와 흐림에 대한 섭동된 score \\(\\tilde s\\)를 정확한 지형 위에 그려 불일치가 보이게 했다. 작은 \\(t\\)에서 흐림은 지도에서 우물을 아예 지워 버린다. 기울기는 균일한 오프셋이며 참 장이 약한 동안 가장 크게 작용한다. 버튼은 두 값을 실험실로 복사한다.' },
    'score-p3': { en: 'The two errors leave different fingerprints. Tilt moves mass between slots: the picture shifts sideways, the slot TV grows roughly linearly in \\(|b|\\), and the spread barely changes. Blur keeps the slot frequencies right and widens every well: the spread ratio grows with \\(\\delta\\) while the slot TV stays at its floor until \\(\\delta\\) is comparable to the slot pitch. The puzzle shows one as a displaced picture and the other as a picture seen through frosted glass.', ko: '두 오차는 다른 지문을 남긴다. 기울기는 홈 사이에서 질량을 옮긴다. 그림이 옆으로 밀리고, 홈 TV는 \\(|b|\\)에 대략 비례해 커지며, 퍼짐은 거의 변하지 않는다. 흐림은 홈 빈도는 맞게 두고 모든 우물을 넓힌다. 퍼짐 비율은 \\(\\delta\\)와 함께 커지지만 홈 TV는 \\(\\delta\\)가 홈 간격에 비길 만해질 때까지 바닥값에 머문다. 퍼즐에서는 하나가 밀린 그림으로, 다른 하나가 간유리 너머로 본 그림으로 나타난다.' },
    'score-p4': { en: 'A point worth stating carefully: in this toy the ODE is <em>less</em> sensitive to a constant tilt than the SDE. The family multiplies the score, and therefore the tilt, by \\((1+\\eta^2)/2\\): at \\(\\eta=1\\) the sampler follows the wrong map twice as hard, and the extra noise does not help against an error that is the same at every step. Robustness of stochastic samplers to score error is usually argued for errors that fluctuate and average out, which a tilt does not. Blur affects both ends of the family about equally.', ko: '조심스럽게 적어 둘 점이 있다. 이 토이에서 ODE는 상수 기울기에 대해 SDE보다 <em>덜</em> 민감하다. 이 가족은 score를, 따라서 기울기도, \\((1+\\eta^2)/2\\)배 한다. \\(\\eta=1\\)에서 샘플러는 틀린 지도를 두 배 세게 따르고, 매 스텝 동일한 오차에 대해서는 추가 노이즈가 도움이 되지 않는다. 확률적 샘플러가 score 오차에 강건하다는 주장은 보통 요동치며 평균적으로 상쇄되는 오차에 대한 것이며, 기울기는 그렇지 않다. 흐림은 가족의 양 끝에 거의 같은 정도로 작용한다.' },

    /* 3.3 */
    'grid-title': { en: 'The grid: steps in place of the continuum', ko: '격자: 연속 시간 대신 스텝' },
    'grid-p1': { en: 'Generation is numerical integration. One Euler–Maruyama step of the reverse SDE and one Euler step of the probability flow ODE are the lecture\u2019s two lines; Heun adds a second evaluation per step and gains an order of accuracy on the ODE. The comparison below holds the number of score evaluations fixed, so Heun always takes half as many steps as Euler.', ko: '생성은 수치적분이다. 역 SDE의 Euler–Maruyama 한 스텝과 probability flow ODE의 Euler 한 스텝은 강의의 두 줄이다. Heun은 스텝당 평가를 한 번 더 하고 ODE에서 정확도 차수를 하나 올린다. 아래 비교는 score 평가 횟수를 고정하므로 Heun은 항상 Euler의 절반 스텝만 밟는다.' },
    'grid-p2': { en: 'For the variance-exploding instance the Euler–Maruyama step has a direct reading: between two noise levels it injects exactly the variance the forward process added and moves against the score by the same amount. One step undoes one rung of the ladder.', ko: 'variance-exploding 사례에서 Euler–Maruyama 스텝은 곧바로 읽힌다. 두 노이즈 수준 사이에서 forward 과정이 더한 분산을 정확히 그만큼 주입하고, 같은 양만큼 score 반대 방향으로 움직인다. 한 스텝이 사다리 한 칸을 되돌린다.' },
    'grid-fig-title': { en: 'Error against the number of score evaluations', ko: 'score 평가 횟수에 대한 오차' },
    'grid-caption': { en: 'Spread ratio (left) and KS distance (right) at \\(t=0\\) for Euler–Maruyama at \\(\\eta=1\\), Euler at \\(\\eta=0\\), and Heun at \\(\\eta=0\\), with exact start and exact score, \\(N=2048\\). Dashed lines are the finite-sample floors. Logarithmic axes.', ko: '정확한 출발점과 정확한 score, \\(N=2048\\)에서 \\(\\eta=1\\)의 Euler–Maruyama, \\(\\eta=0\\)의 Euler, \\(\\eta=0\\)의 Heun에 대한 \\(t=0\\)에서의 퍼짐 비율(왼쪽)과 KS 거리(오른쪽). 점선은 유한 표본 바닥값. 로그 축.' },
    'grid-p3': { en: 'Three things are visible. The field is stiff: the score scales like \\(1/(\\tau^2+t)\\), so the last steps near \\(t=0\\) are the hard ones and a uniform grid spends most of its budget where nothing happens. Euler approaches the exact spread from above and is the most accurate of the three up to about 128 evaluations. Heun\u2019s predictor overshoots the wells on coarse grids, where it is the worst by far, then over-contracts, and its second order pays off only from 256 evaluations on. Euler–Maruyama needs \\(\\sqrt h\\ll\\tau\\) in its last step or the injected noise alone blurs the wells, so its spread ratio comes down to one only slowly, from above.', ko: '세 가지가 보인다. 장은 뻣뻣하다. score는 \\(1/(\\tau^2+t)\\)처럼 커지므로 \\(t=0\\) 근처의 마지막 스텝들이 어렵고, 균일 격자는 예산 대부분을 아무 일도 없는 곳에 쓴다. Euler는 정확한 퍼짐에 위에서 접근하며 평가 횟수 128 정도까지는 셋 중 가장 정확하다. Heun의 예측 단계는 성긴 격자에서 우물을 지나쳐 단연 가장 나쁘고, 그다음에는 지나치게 수축하며, 2차 정확도는 평가 횟수 256부터 비로소 효과를 낸다. Euler–Maruyama는 마지막 스텝에서 \\(\\sqrt h\\ll\\tau\\)여야 하며 그렇지 않으면 주입된 노이즈만으로 우물이 흐려지므로, 퍼짐 비율은 위에서 천천히 1로 내려온다.' },

    /* ---------- 4 budget ---------- */
    'budget-eyebrow': { en: 'Putting it together', ko: '모아 보기' },
    'budget-title': { en: 'The error budget', ko: '오차 예산' },
    'budget-p1': { en: 'Each panel sweeps one knob with the other two substitutions switched off, for the two ends of the family: the probability flow ODE with Heun (\\(\\eta=0\\)) and the reverse SDE with Euler–Maruyama (\\(\\eta=1\\)). The \\(T\\) sweep holds the step size \\(h=1/128\\) fixed rather than the number of steps, so that a longer shake is not confused with a coarser grid. \\(N=2048\\) pieces per point; the floor is the value for 2048 exact draws.', ko: '각 패널은 나머지 두 치환을 끈 채 노브 하나를 쓸어 보며, 가족의 양 끝인 Heun을 쓴 probability flow ODE(\\(\\eta=0\\))와 Euler–Maruyama를 쓴 역 SDE(\\(\\eta=1\\))를 함께 그린다. \\(T\\) 쓸기는 스텝 수가 아니라 스텝 크기 \\(h=1/128\\)을 고정하여, 더 오래 흔든 것이 더 성긴 격자와 혼동되지 않게 했다. 점당 \\(N=2048\\)개의 조각이며 바닥값은 정확한 표본 2048개의 값이다.' },
    'budget-fig-title': { en: 'One knob at a time, both ends of the family', ko: '노브 하나씩, 가족의 양 끝' },
    'budget-caption': { en: 'Left to right: slot TV against \\(T\\) when starting from \\(\\mathcal N(0,T I)\\); slot TV against the tilt \\(b_x\\); spread ratio against the blur \\(\\delta\\); spread ratio against the number of evaluations. Blue: \\(\\eta=0\\). Red: \\(\\eta=1\\). The values shown first were produced by the same JavaScript in node and stored; the button recomputes them here.', ko: '왼쪽부터: \\(\\mathcal N(0,T I)\\)에서 출발할 때 \\(T\\)에 대한 홈 TV, 기울기 \\(b_x\\)에 대한 홈 TV, 흐림 \\(\\delta\\)에 대한 퍼짐 비율, 평가 횟수에 대한 퍼짐 비율. 파랑은 \\(\\eta=0\\), 빨강은 \\(\\eta=1\\). 처음 표시되는 값은 같은 JavaScript를 node에서 실행해 저장한 것이고, 버튼을 누르면 여기서 다시 계산한다.' },
    'budget-list': { en: '<li><b>Start.</b> The ODE inherits the prior mismatch in full and loses it only as the bound does, with \\(T\\); the SDE forgets most of it within the run. Past \\(T\\approx2\\) the two meet at the floor.</li><li><b>Tilt.</b> Linear in \\(|b|\\) for both, steeper for the SDE by the factor \\((1+\\eta^2)/2=1\\) against \\(\\tfrac12\\) in the drift. At \\(b_x=1\\) the picture has moved by more than one slot.</li><li><b>Blur.</b> The spread ratio rises monotonically in \\(\\delta\\) and the two ends of the family coincide; the slot TV (not shown) stays at the floor until \\(\\delta\\gtrsim0.03\\).</li><li><b>Grid.</b> At equal evaluations Heun is worst below 32, over-contracts around 128, and is best only from 256 on; Euler–Maruyama stays above one and comes down slowly because its last step needs \\(\\sqrt h\\ll\\tau\\).</li>', ko: '<li><b>출발점.</b> ODE는 prior 불일치를 고스란히 물려받고 상계가 그러하듯 \\(T\\)와 함께 서서히 잃는다. SDE는 대부분을 진행 중에 잊는다. \\(T\\approx2\\)를 지나면 둘은 바닥값에서 만난다.</li><li><b>기울기.</b> 둘 다 \\(|b|\\)에 선형이지만 SDE가 더 가파르다. 드리프트의 계수가 \\(\\tfrac12\\) 대신 \\((1+\\eta^2)/2=1\\)이기 때문이다. \\(b_x=1\\)에서 그림은 홈 하나 이상 밀려 있다.</li><li><b>흐림.</b> 퍼짐 비율은 \\(\\delta\\)에 대해 단조 증가하고 가족의 양 끝이 일치한다. 홈 TV(표시 안 함)는 \\(\\delta\\gtrsim0.03\\)까지 바닥값에 머문다.</li><li><b>격자.</b> 같은 평가 횟수에서 Heun은 32 미만에서 가장 나쁘고 128 부근에서는 지나치게 수축하며 256부터 비로소 가장 좋다. Euler–Maruyama는 마지막 스텝에 \\(\\sqrt h\\ll\\tau\\)가 필요하므로 1 위에 머물며 천천히 내려온다.</li>' },
    'budget-p2': { en: 'The budget is not additive. A tilt that moves mass to the wrong slot cannot be repaired by more steps; a coarse grid cannot be repaired by a longer shake. The three substitutions act on different aspects of the distribution, and that is what the two metrics were chosen to separate: slot TV answers <em>where</em> the mass went, spread answers <em>how tightly</em>.', ko: '이 예산은 더해지지 않는다. 질량을 엉뚱한 홈으로 옮긴 기울기는 스텝을 늘려도 고쳐지지 않고, 성긴 격자는 더 오래 흔들어도 고쳐지지 않는다. 세 치환은 분포의 서로 다른 측면에 작용하며, 두 지표는 바로 그것을 분리하려고 골랐다. 홈 TV는 질량이 <em>어디로</em> 갔는지를, 퍼짐은 <em>얼마나 조밀하게</em> 모였는지를 답한다.' },

    /* ---------- 5 flow ---------- */
    'flow-eyebrow': { en: 'The same three, elsewhere', ko: '같은 셋, 다른 곳에서' },
    'flow-title': { en: 'What flow matching changes, and what it does not', ko: 'Flow Matching이 바꾸는 것과 바꾸지 않는 것' },
    'flow-p1': { en: 'Flow matching never writes a score, yet the field it learns is one. For a Gaussian source and the interpolant \\(x_t=a_t x_0+b_t x_T\\), the conditional velocity is an affine function of the conditional score, and averaging over the posterior turns it into the marginal score. The result is a drift plus a multiple of \\(\\nabla\\log p_t\\), the shape of a probability flow ODE, and the lecture makes the match exact: choosing a diffusion with schedule \\(\\alpha_s=b_{T-s}\\), \\(\\sigma_s=a_{T-s}\\) gives a probability flow ODE whose solution, read in flow-matching time, is the flow-matching trajectory in distribution.', ko: 'Flow matching은 score를 한 번도 쓰지 않지만, 학습하는 장은 score다. 가우시안 source와 보간 \\(x_t=a_t x_0+b_t x_T\\)에 대해 조건부 속도는 조건부 score의 아핀 함수이고, 사후분포에 대해 평균하면 주변 score가 된다. 결과는 드리프트 더하기 \\(\\nabla\\log p_t\\)의 배수, 즉 probability flow ODE의 꼴이며, 강의는 이 대응을 정확하게 만든다. 스케줄 \\(\\alpha_s=b_{T-s}\\), \\(\\sigma_s=a_{T-s}\\)의 확산을 고르면, 그 probability flow ODE의 해를 flow matching 시간으로 읽은 것이 분포의 의미에서 flow matching 궤적이다.' },
    'flow-p2': { en: 'So a flow-matching sampler is a probability flow ODE sampler, and the three substitutions have exact counterparts:', ko: '따라서 flow matching 샘플러는 probability flow ODE 샘플러이고, 세 치환에는 정확한 대응물이 있다.' },
    'flow-list': { en: '<li><b>The start</b> is no longer an approximation. The interpolant reaches \\(p_{\\mathrm{prior}}\\) exactly at \\(t=0\\) because \\(b_0=0\\). The price is paid by the corresponding diffusion, whose coefficients \\(f\\) and \\(g\\) diverge at that endpoint: a diffusion cannot reach \\(\\mathcal N(0,I)\\) in finite time, and the identification holds on the open interval \\((0,T)\\).</li><li><b>The score</b> error becomes a velocity error. Conditional flow matching regresses on \\(\\dot a_t x_0+\\dot b_t x_T\\) and its minimiser is the marginal velocity, by the same conditional-expectation argument that made denoising score matching work. A trained field misses that minimiser in ways the tilt and the blur imitate, and the \\(\\eta\\)-family is available here too once the velocity is rewritten as a score.</li><li><b>The grid</b> is unchanged. Straight conditional paths do not make the marginal trajectories straight; the Gaussian example of the lecture has \\(s_t^2=(1-t)^2+t^2\\), curved for every pair, and the solver still has to follow the curve.</li>', ko: '<li><b>출발점</b>은 더 이상 근사가 아니다. \\(b_0=0\\)이므로 보간은 \\(t=0\\)에서 \\(p_{\\mathrm{prior}}\\)에 정확히 도달한다. 그 대가는 대응하는 확산이 치른다. 그 계수 \\(f\\), \\(g\\)는 그 끝점에서 발산한다. 확산은 유한 시간에 \\(\\mathcal N(0,I)\\)에 도달할 수 없고, 동일시는 열린 구간 \\((0,T)\\)에서만 성립한다.</li><li><b>score</b> 오차는 속도 오차가 된다. Conditional flow matching은 \\(\\dot a_t x_0+\\dot b_t x_T\\)에 회귀하며 그 최소점은 주변 속도다. denoising score matching을 성립시킨 것과 같은 조건부 기대값 논증이다. 학습된 장은 기울기와 흐림이 흉내 내는 방식으로 그 최소점을 놓치고, 속도를 score로 다시 쓰면 \\(\\eta\\) 가족도 여기서 쓸 수 있다.</li><li><b>격자</b>는 그대로다. 직선인 조건부 경로가 주변 궤적을 직선으로 만들지는 않는다. 강의의 가우시안 예제는 \\(s_t^2=(1-t)^2+t^2\\)로 모든 쌍에서 휘어 있고, solver는 여전히 곡선을 따라가야 한다.</li>' },
    'flow-p3': { en: 'The three-way split is therefore a property of generation by differential equation, not of diffusion in particular. The compatibility condition of the lecture, that \\(b_t/a_t\\) must increase, is the one place where the two frameworks part: a schedule that violates it still defines a flow-matching sampler but no diffusion, and then the first substitution has nothing to be compared with.', ko: '그러므로 세 갈래 분해는 미분방정식에 의한 생성의 성질이지 확산만의 성질이 아니다. \\(b_t/a_t\\)가 증가해야 한다는 강의의 호환 조건은 두 틀이 갈라지는 유일한 지점이다. 이를 어기는 스케줄도 flow matching 샘플러는 정의하지만 확산은 정의하지 않으며, 그때 첫 번째 치환은 비교할 대상이 없다.' },

    /* ---------- 6 limits ---------- */
    'limits-eyebrow': { en: 'Fine print', ko: '단서' },
    'limits-title': { en: 'Where the analogy stops', ko: '비유가 멈추는 곳' },
    'limits-list': { en: '<li><b>Pieces are blank by design.</b> A real jigsaw asks which piece goes where; the sampler answers only how much mass goes where. Colouring pieces by their start (section 2) is the one place identity appears, and it is a statement about the flow map, not about the picture.</li><li><b>A slot holds a fraction, not one piece.</b> Slot frequencies are a 48-cell histogram of a continuous density, and the picture is revealed in proportion to \\(\\hat f_k/m_k\\). A fully revealed tile means the right mass, not a solved tile.</li><li><b>The board changes shape on its own.</b> No real board blurs its wells with time. Here the wells blur under the heat equation and sharpen again under the reverse process; the landscape lens is the honest picture of that, the puzzle lens the memorable one.</li><li><b>Tilt and blur are surrogates.</b> A trained network makes errors that depend on \\(x\\) and \\(t\\) in ways neither captures. They were chosen because their effects can be predicted and checked, not because they are typical.</li><li><b>The time grid is uniform.</b> Non-uniform spacing is a standard remedy for the stiffness seen in 3.3 and is not covered by the lectures, so it is left out. The equal-evaluation comparison is fair within that choice.</li>', ko: '<li><b>조각은 일부러 비워 두었다.</b> 실제 퍼즐은 어느 조각이 어디에 가는지를 묻지만, 샘플러는 질량이 어디에 얼마나 가는지만 답한다. 출발점에 따라 조각에 색을 입힌 것(2절)이 정체성이 등장하는 유일한 자리이며, 그것은 그림이 아니라 흐름 사상에 대한 진술이다.</li><li><b>홈에는 조각 하나가 아니라 비율이 들어간다.</b> 홈 빈도는 연속 밀도의 48칸 히스토그램이고 그림은 \\(\\hat f_k/m_k\\)에 비례해 드러난다. 완전히 드러난 타일은 올바른 질량을 뜻하지 맞춘 조각을 뜻하지 않는다.</li><li><b>판이 스스로 모양을 바꾼다.</b> 시간에 따라 우물이 흐려지는 실제 판은 없다. 여기서 우물은 열방정식으로 흐려지고 역과정으로 다시 또렷해진다. 지형 보기가 그 정직한 그림이고 퍼즐 보기는 기억에 남는 그림이다.</li><li><b>기울기와 흐림은 대역이다.</b> 학습된 네트워크는 둘 중 어느 것도 담지 못하는 방식으로 \\(x\\)와 \\(t\\)에 의존하는 오차를 낸다. 전형적이어서가 아니라 효과를 예측하고 확인할 수 있어서 골랐다.</li><li><b>시간 격자는 균일하다.</b> 비균일 간격은 3.3에서 본 뻣뻣함에 대한 표준 처방이지만 강의 범위 밖이라 제외했다. 같은 평가 횟수 비교는 그 선택 안에서 공정하다.</li>' },
    'scope-title': { en: 'Scope and implementation', ko: '범위와 구현' },
    'scope-list': { en: '<li>Toy: 48 Gaussians, \\(\\tau=0.06\\), pitch \\(0.22\\); forward \\(dx=dw\\); \\(p_t\\), \\(\\nabla\\log p_t\\), slot masses and the \\(x\\)-marginal in closed form; KL by \\(140\\times140\\) midpoint quadrature. No neural network anywhere.</li><li>Sampler: the \\(\\eta\\)-family with Euler–Maruyama for \\(\\eta>0\\) and Euler or Heun for \\(\\eta=0\\); seeded random numbers so that every panel can be replayed.</li><li>Metrics: slot total variation against exact masses, spread ratio, KS distance of the \\(x\\)-marginal; each shown with its finite-sample floor.</li><li>Code: <code>model.js</code> (closed forms), <code>sampler.js</code> (integrators and metrics), <code>views.js</code> (drawing), <code>app.js</code> (controls), <code>equations.js</code> (every displayed equation with its lecture page). <code>node --test</code> checks the score against finite differences of \\(\\log p_t\\), the heat equation, the KL bound, slot masses against Monte Carlo, and marginal alignment of the family. Equations are typeset by KaTeX from a CDN; the source is shown if it cannot load.</li>', ko: '<li>토이: 가우시안 48개, \\(\\tau=0.06\\), 간격 \\(0.22\\); forward \\(dx=dw\\); \\(p_t\\), \\(\\nabla\\log p_t\\), 홈 질량, \\(x\\) 주변분포는 닫힌 형태; KL은 \\(140\\times140\\) 중점 수치적분. 신경망은 어디에도 없다.</li><li>샘플러: \\(\\eta>0\\)에는 Euler–Maruyama, \\(\\eta=0\\)에는 Euler 또는 Heun을 쓰는 \\(\\eta\\) 가족. 모든 패널을 재생할 수 있도록 시드를 고정한 난수.</li><li>지표: 정확한 질량에 대한 홈 전변동, 퍼짐 비율, \\(x\\) 주변분포의 KS 거리. 각각 유한 표본 바닥값과 함께 표시.</li><li>코드: <code>model.js</code>(닫힌 형태), <code>sampler.js</code>(적분기와 지표), <code>views.js</code>(그리기), <code>app.js</code>(조작), <code>equations.js</code>(표시된 모든 수식과 출처 쪽). <code>node --test</code>는 score를 \\(\\log p_t\\)의 유한차분과, 열방정식, KL 상계, 홈 질량과 Monte Carlo, 가족의 주변분포 정렬을 검사한다. 수식은 CDN의 KaTeX로 조판하며 불러오지 못하면 원문을 보여준다.</li>' },
    'sources-title': { en: 'Sources of the displayed equations', ko: '표시된 수식의 출처' },
    'src-col-eq': { en: 'Equation', ko: '수식' },
    'src-col-src': { en: 'Lecture notes · PDF page', ko: '강의 노트 · PDF 쪽' },
    'src-defined': { en: 'defined on this page', ko: '이 페이지에서 정의' },
    'photo-credit': { en: 'Photograph under the board: “Cat August 2010-4” by Alvesgaspar, Wikimedia Commons, CC BY-SA 3.0, cropped to 4:3 and resized. Lecture notes: Mathematical Principles of Diffusion Models, Prof. Taesup Moon, Fall 2026, following Lai, Song, Kim, Mitsufuji and Ermon, <em>The Principles of Diffusion Models</em>, arXiv:2510.21890.', ko: '판 아래 사진: Alvesgaspar, “Cat August 2010-4”, Wikimedia Commons, CC BY-SA 3.0, 4:3으로 자르고 축소함. 강의 노트: Diffusion Models의 수학적 원리, 문태섭 교수, 2026년 가을. Lai, Song, Kim, Mitsufuji, Ermon, <em>The Principles of Diffusion Models</em>, arXiv:2510.21890을 따른다.' },

    /* canvas labels */
    'lbl-sde': { en: 'SDE', ko: 'SDE' },
    'lbl-ode': { en: 'ODE', ko: 'ODE' },
    'lbl-exact': { en: 'exact', ko: '정확' },
    'lbl-floor': { en: 'floor', ko: '바닥값' },
    'lbl-marginal': { en: 'x-marginal of p_t', ko: 'p_t의 x 주변밀도' },
    'lbl-prior': { en: 'N(0, T I)', ko: 'N(0, T I)' },
    'lbl-pT': { en: 'p_T', ko: 'p_T' },
    'lbl-bound': { en: 'KL bound ½·SNR(T)·E‖x₀‖²', ko: 'KL 상계 ½·SNR(T)·E‖x₀‖²' },
    'lbl-klnum': { en: 'KL (quadrature)', ko: 'KL (수치적분)' },
    'lbl-slots': { en: 'slot 1 … 48, bars = pieces, line = exact mass', ko: '홈 1 … 48, 막대 = 조각, 선 = 정확한 질량' },
    'lbl-em': { en: 'Euler–Maruyama, η = 1', ko: 'Euler–Maruyama, η = 1' },
    'lbl-euler': { en: 'Euler, η = 0', ko: 'Euler, η = 0' },
    'lbl-heun': { en: 'Heun, η = 0', ko: 'Heun, η = 0' },
    'lbl-eta0': { en: 'η = 0 (Heun)', ko: 'η = 0 (Heun)' },
    'lbl-eta1': { en: 'η = 1 (Euler–Maruyama)', ko: 'η = 1 (Euler–Maruyama)' },
    'lbl-evals': { en: 'score evaluations', ko: 'score 평가 횟수' },
    'lbl-spread-ratio': { en: 'spread / exact', ko: '퍼짐 / 정확값' },
    'lbl-ks': { en: 'KS distance', ko: 'KS 거리' },
    'lbl-tv': { en: 'slot TV', ko: '홈 TV' },
    'lbl-T': { en: 'T (start from N(0, T I))', ko: 'T (N(0, T I)에서 출발)' },
    'lbl-tilt': { en: 'tilt b_x', ko: '기울기 b_x' },
    'lbl-blur': { en: 'blur δ', ko: '흐림 δ' },
    'lbl-time-t': { en: 'noise time t =', ko: '노이즈 시간 t =' },
    'lbl-exact-field': { en: 'exact score', ko: '정확한 score' },
    'lbl-perturbed-field': { en: 'perturbed score', ko: '섭동된 score' },
  };

  let language = document.documentElement.lang === 'ko' ? 'ko' : 'en';
  const stored = (() => { try { return localStorage.getItem('board-language'); } catch (e) { return null; } })();
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'ko' || requested === 'en') language = requested;
  else if (stored === 'ko' || stored === 'en') language = stored;

  function text(key) {
    const entry = S[key];
    if (!entry) return key;
    return entry[language] || entry.en;
  }

  function tr(en, ko) { return language === 'ko' ? ko : en; }

  function apply() {
    document.documentElement.lang = language;
    for (const el of document.querySelectorAll('[data-i18n]')) {
      const key = el.dataset.i18n;
      if (!S[key]) continue;
      el.innerHTML = text(key);
    }
    for (const b of document.querySelectorAll('.language-switch button')) b.setAttribute('aria-pressed', String(b.dataset.lang === language));
    try { localStorage.setItem('board-language', language); } catch (e) { /* private mode */ }
    window.dispatchEvent(new CustomEvent('languagechange', { detail: language }));
  }

  function setLanguage(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    language = lang;
    apply();
  }

  root.BoardText = { text, tr, apply, setLanguage, get language() { return language; }, strings: S };
})(globalThis);
