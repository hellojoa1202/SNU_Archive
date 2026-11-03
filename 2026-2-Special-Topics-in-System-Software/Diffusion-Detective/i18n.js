(function(){
const prose={
  "skip": {
    "en": "Skip to content",
    "ko": "본문으로 이동"
  },
  "nav-score": {
    "en": "Noise and score",
    "ko": "노이즈와 Score"
  },
  "nav-sde": {
    "en": "SDE → ODE",
    "ko": "SDE → ODE 비교"
  },
  "nav-fm": {
    "en": "Flow Matching → CFM",
    "ko": "Flow Matching → CFM 학습"
  },
  "nav-solver": {
    "en": "Numerical generation",
    "ko": "수치적 생성"
  },
  "hero-title": {
    "en": "From Diffusion<br><span>to Flow Matching.</span>",
    "ko": "Diffusion에서<br><span>Flow Matching으로.</span>"
  },
  "hero-lead": {
    "en": "Different paths. Matching distributions.",
    "ko": "서로 다른 경로, 같은 시각의 분포."
  },
  "hero-body": {
    "en": "Must a generative model recover individual paths, or the distributions they carry? Follow this question from score-based sampling to conditional velocity regression.",
    "ko": "생성 모델이 맞춰야 하는 것은 개별 경로일까, 그 경로들이 만드는 분포일까? Score 기반 생성에서 조건부 속도 회귀까지 이 질문을 따라간다."
  },
  "route-node": {
    "en": "<small>01 · SCORE</small><svg viewBox=\"0 0 240 86\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"#acbdcc\" stroke-width=\"1.2\"><path d=\"M12 10C86 2 121 65 222 25\"/><path d=\"M12 30C81 20 143 72 222 41\"/><path d=\"M12 53C86 32 146 70 222 57\"/><path d=\"M12 76C88 49 160 73 222 73\"/></g><path d=\"M12 30C81 20 143 72 222 41\" fill=\"none\" stroke=\"#6085ad\" stroke-width=\"2.2\"/><g fill=\"#6085ad\"><circle cx=\"12\" cy=\"30\" r=\"3\"/><circle cx=\"77\" cy=\"36\" r=\"3\"/><circle cx=\"147\" cy=\"52\" r=\"3\"/></g><circle cx=\"222\" cy=\"41\" r=\"4\" fill=\"#ae4c54\"/></svg><b>Start from the score</b><span>Connect noise and score prediction.</span>",
    "ko": "<small>01 · SCORE</small><svg viewBox=\"0 0 240 86\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"#acbdcc\" stroke-width=\"1.2\"><path d=\"M12 10C86 2 121 65 222 25\"/><path d=\"M12 30C81 20 143 72 222 41\"/><path d=\"M12 53C86 32 146 70 222 57\"/><path d=\"M12 76C88 49 160 73 222 73\"/></g><path d=\"M12 30C81 20 143 72 222 41\" fill=\"none\" stroke=\"#6085ad\" stroke-width=\"2.2\"/><g fill=\"#6085ad\"><circle cx=\"12\" cy=\"30\" r=\"3\"/><circle cx=\"77\" cy=\"36\" r=\"3\"/><circle cx=\"147\" cy=\"52\" r=\"3\"/></g><circle cx=\"222\" cy=\"41\" r=\"4\" fill=\"#ae4c54\"/></svg><b>Score에서 출발</b><span>노이즈 예측과 Score 예측을 연결.</span>"
  },
  "route-fm": {
    "en": "<small>02 · DISTRIBUTIONS</small><svg viewBox=\"0 0 240 86\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"#dce5ec\"><path d=\"M20 70H220M40 80V8\"/><circle cx=\"143\" cy=\"24\" r=\"19\"/><circle cx=\"143\" cy=\"24\" r=\"31\"/></g><path d=\"M66 67L143 24L132 27M143 24L137 35\" fill=\"none\" stroke=\"#6085ad\" stroke-width=\"2.2\"/><path d=\"M66 67L172 53L161 49M172 53L162 59\" fill=\"none\" stroke=\"#ae4c54\" stroke-width=\"2.2\"/><path d=\"M143 24L172 53\" stroke=\"#ae4c54\" stroke-dasharray=\"3 3\"/><circle cx=\"66\" cy=\"67\" r=\"3\" fill=\"#17283e\"/></svg><b>Change the process</b><span>Compare stochastic and deterministic paths.</span>",
    "ko": "<small>02 · DISTRIBUTIONS</small><svg viewBox=\"0 0 240 86\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"#dce5ec\"><path d=\"M20 70H220M40 80V8\"/><circle cx=\"143\" cy=\"24\" r=\"19\"/><circle cx=\"143\" cy=\"24\" r=\"31\"/></g><path d=\"M66 67L143 24L132 27M143 24L137 35\" fill=\"none\" stroke=\"#6085ad\" stroke-width=\"2.2\"/><path d=\"M66 67L172 53L161 49M172 53L162 59\" fill=\"none\" stroke=\"#ae4c54\" stroke-width=\"2.2\"/><path d=\"M143 24L172 53\" stroke=\"#ae4c54\" stroke-dasharray=\"3 3\"/><circle cx=\"66\" cy=\"67\" r=\"3\" fill=\"#17283e\"/></svg><b>생성 과정을 바꾸기</b><span>확률적 경로와 결정론적 경로 비교.</span>"
  },
  "route-cfm": {
    "en": "<small>03 · FLOW MATCHING</small><svg viewBox=\"0 0 240 86\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"#80adae\" stroke-width=\"1.3\"><path d=\"M14 12L102 45L158 18M14 32L102 45L158 33M14 53L102 45L158 54M14 74L102 45L158 73\"/></g><g fill=\"#398eaa\"><circle cx=\"14\" cy=\"12\" r=\"3\"/><circle cx=\"14\" cy=\"32\" r=\"3\"/><circle cx=\"14\" cy=\"53\" r=\"3\"/><circle cx=\"14\" cy=\"74\" r=\"3\"/></g><path d=\"M102 45L218 42L208 37M218 42L208 47\" fill=\"none\" stroke=\"#6085ad\" stroke-width=\"2.2\"/><circle cx=\"102\" cy=\"45\" r=\"4\" fill=\"#ae4c54\"/></svg><b>Learn a marginal velocity</b><span>Build targets from endpoint pairs.</span>",
    "ko": "<small>03 · FLOW MATCHING</small><svg viewBox=\"0 0 240 86\" aria-hidden=\"true\"><g fill=\"none\" stroke=\"#80adae\" stroke-width=\"1.3\"><path d=\"M14 12L102 45L158 18M14 32L102 45L158 33M14 53L102 45L158 54M14 74L102 45L158 73\"/></g><g fill=\"#398eaa\"><circle cx=\"14\" cy=\"12\" r=\"3\"/><circle cx=\"14\" cy=\"32\" r=\"3\"/><circle cx=\"14\" cy=\"53\" r=\"3\"/><circle cx=\"14\" cy=\"74\" r=\"3\"/></g><path d=\"M102 45L218 42L208 37M218 42L208 47\" fill=\"none\" stroke=\"#6085ad\" stroke-width=\"2.2\"/><circle cx=\"102\" cy=\"45\" r=\"4\" fill=\"#ae4c54\"/></svg><b>주변 속도 학습</b><span>끝점 쌍에서 학습 목표 구성.</span>"
  },
  "hero-note": {
    "en": "Two comparisons, each with its own reference distribution. A photo jigsaw makes the distinction between piece identity and occupied positions concrete in the CFM section.",
    "ko": "두 비교는 각각의 기준 분포를 사용한다. CFM에서는 사진 퍼즐로 조각의 정체성과 채워진 위치의 차이를 직접 확인한다."
  },
  "score-title": {
    "en": "From predicted noise to the score",
    "ko": "노이즈 예측에서 Score로"
  },
  "score-intro": {
    "en": "DDPM predicts noise; NCSN predicts the score. At the optimal predictor, a known scale factor connects the two. The next question is how this quantity moves a distribution.",
    "ko": "DDPM은 노이즈를, NCSN은 Score를 예측한다. 최적 예측에서는 알려진 배율로 두 값을 연결할 수 있다. 다음 질문은 이 값으로 분포를 어떻게 이동시키는가이다."
  },
  "score-note": {
    "en": "Here ε⋆ is the conditional mean noise, not the particular noise used to corrupt one sample. The score is a gradient of log density. We use an analytic score below so that sampling behavior can be isolated from estimation error.",
    "ko": "ε⋆는 한 표본에 넣었던 실제 노이즈가 아니라 조건부 평균 노이즈다. Score는 로그밀도의 기울기다. 아래에서는 해석적 Score를 사용하여 추정 오차와 샘플링 방식의 차이를 구분한다."
  },
  "sde-title": {
    "en": "A random path is not the distribution",
    "ko": "하나의 무작위 경로와 분포는 다르다"
  },
  "sde-intro": {
    "en": "The reverse SDE injects noise along its trajectory. Its probability flow ODE has no stepwise noise and half the score correction. With the exact score and matching initial law, both reproduce the same time marginals.",
    "ko": "역방향 SDE는 경로에 노이즈를 추가한다. 대응하는 Probability Flow ODE에는 단계별 노이즈가 없고 Score 보정의 계수가 절반이다. 정확한 Score와 같은 초기 분포를 사용하면 두 과정은 각 시각의 분포를 재현한다."
  },
  "sde-clock": {
    "en": "Generation runs from noise time t = 1 down to t = 0. Both panels start from the same samples drawn from the exact terminal mixture. This toy uses zero forward drift and constant diffusion.",
    "ko": "생성은 노이즈 시간 t = 1에서 t = 0으로 진행한다. 두 화면은 정확한 종단 혼합분포에서 뽑은 동일 표본으로 시작한다. 토이 모형의 정방향 drift는 0, 확산 계수는 상수다."
  },
  "sde-view": {
    "en": "Follow one particle. Compare the whole population.",
    "ko": "한 입자를 추적하고 전체 분포를 비교한다."
  },
  "sde-rerun": {
    "en": "New noise, same starts",
    "ko": "출발점 유지 · 노이즈 다시 뽑기"
  },
  "sde-starts": {
    "en": "New initial sample",
    "ko": "초기 표본 다시 뽑기"
  },
  "sde-time": {
    "en": "Generation progress",
    "ko": "생성 진행도"
  },
  "sde-count": {
    "en": "Population size",
    "ko": "표본 수"
  },
  "sde-legend": {
    "en": "Blue: SDE · Red: ODE · Gray contours: analytic reference density. Click a point to track the same initial particle in both panels; arrow keys select adjacent particles. Dashed blue: its previous noise realization.",
    "ko": "파랑: SDE · 빨강: ODE · 회색 등고선: 해석적 기준 밀도. 점을 클릭하면 두 화면에서 같은 출발 입자를 추적한다. 방향키로 입자를 바꿀 수 있다. 파란 점선은 직전 노이즈로 생성한 경로다."
  },
  "sde-diff": {
    "en": "SDE: x-marginal CDF discrepancy",
    "ko": "SDE: x축 주변 CDF 차이"
  },
  "ode-diff": {
    "en": "ODE: x-marginal CDF discrepancy",
    "ko": "ODE: x축 주변 CDF 차이"
  },
  "path-diff": {
    "en": "Tracked particle separation",
    "ko": "추적 입자 사이 거리"
  },
  "sde-finite": {
    "en": "The curves compare empirical x-coordinate densities with the analytic reference. Finite samples and numerical integration cause discrepancies; the theorem concerns distributions in continuous time, not identical clouds or paths. CDF discrepancy measures this projection only.",
    "ko": "곡선은 표본의 x좌표 밀도와 해석적 기준을 비교한다. 유한 표본과 수치적분 때문에 차이가 생긴다. 정리는 연속 시간의 분포에 대한 것이며 점 구름이나 개별 경로의 일치를 뜻하지 않는다. CDF 차이는 x축 투영만 측정한다."
  },
  "sde-bridge": {
    "en": "<b>Matching distributions leaves freedom in the paths.</b><span>Flow Matching uses this freedom differently: choose a probability path and learn a velocity that generates it.</span>",
    "ko": "<b>분포를 맞추면서도 경로는 다르게 구성할 수 있다.</b><span>Flow Matching은 확률 경로를 먼저 정하고 이를 만드는 속도를 학습한다.</span>"
  },
  "fm-title": {
    "en": "From matching distributions to learning a velocity",
    "ko": "분포를 맞추는 과정에서 속도를 학습하는 문제로"
  },
  "fm-intro": {
    "en": "Instead of fixing the path through forward diffusion, choose a probability path. Flow Matching regresses its marginal velocity. The difficulty is evaluating that target: conditional paths provide the next step.",
    "ko": "정방향 확산으로 경로를 정하는 대신 확률 경로를 직접 선택한다. Flow Matching은 이를 만드는 주변 속도를 회귀한다. 계산하기 어려운 이 목표를 조건부 경로로 바꾸는 것이 다음 단계다."
  },
  "fm-open": {
    "en": "Inspect local velocity regression",
    "ko": "국소 속도 회귀 살펴보기"
  },
  "fm-view": {
    "en": "A local velocity comparison and its error",
    "ko": "같은 후보 속도, 두 가지 관점"
  },
  "position-plane": {
    "en": "Position space: choose where to compare",
    "ko": "위치 공간: 비교할 위치"
  },
  "velocity-plane": {
    "en": "Velocity space: choose a prediction",
    "ko": "속도 공간: 비교할 후보"
  },
  "legend-target": {
    "en": "Blue: analytic target",
    "ko": "파란색: 해석적 목표"
  },
  "legend-prediction": {
    "en": "Red: candidate velocity",
    "ko": "빨간색: 후보 속도"
  },
  "pred-x": {
    "en": "Candidate horizontal velocity",
    "ko": "후보 가로속도"
  },
  "pred-y": {
    "en": "Candidate vertical velocity",
    "ko": "후보 세로속도"
  },
  "sample-position": {
    "en": "Draw a time and position",
    "ko": "시각·위치 표본 뽑기"
  },
  "use-target": {
    "en": "Match the target",
    "ko": "목표 속도에 맞추기"
  },
  "local-error": {
    "en": "Local squared error",
    "ko": "국소 제곱오차"
  },
  "fm-caption": {
    "en": "Left: move the observation point or drag the red arrow. Right: drag the same candidate in velocity space. Each contour joins velocities with the same squared error; its centre is the target. Density is shown by outlines, without a shaded background.",
    "ko": "왼쪽: 관측 위치를 옮기거나 빨간 화살표를 드래그한다. 오른쪽: 같은 후보 속도를 속도 공간에서 움직인다. 등고선은 제곱오차가 같은 속도들을 연결하며, 중심이 목표 속도다. 공간의 밀도는 채움 없이 윤곽선으로 표시한다."
  },
  "fm-note": {
    "en": "The displayed error is one local contribution. The training objective also averages over time and positions. Drawing a toy sample uses its known endpoint interpolation; no marginal ODE is solved for that draw.",
    "ko": "표시한 오차는 한 위치에서의 기여. 학습 목적함수는 시각·위치에 대해서도 평균. 토이 표본은 알려진 끝점 보간으로 뽑으며 이 표본 추출에 주변 ODE 풀이는 필요하지 않음."
  },
  "bridge-cfm": {
    "en": "<small>02 → 03</small><b>The local target is still hard to evaluate.</b><span>Conditional Flow Matching replaces it with a target obtained from sampled endpoints.</span>",
    "ko": "<small>02 → 03</small><b>한 지점의 목표 속도도 직접 계산하기 어렵다.</b><span>Conditional Flow Matching은 끝점 표본에서 얻는 조건부 목표를 사용한다.</span>"
  },
  "cfm-title": {
    "en": "Straight conditional paths, curved marginal paths",
    "ko": "직선인 조건부 경로, 곡선인 주변 경로"
  },
  "cfm-intro": {
    "en": "Sample a paired start and endpoint, then interpolate. These individual paths may cross. Their conditional mean velocity defines a different ODE: under regularity, it reproduces the same intermediate distributions without keeping each pair’s assignment.",
    "ko": "출발점과 도착점을 쌍으로 뽑아 보간하면 개별 경로는 교차할 수 있다. 조건부 평균 속도로 정의한 ODE는 다른 경로를 따른다. 적절한 정칙성 아래 같은 중간 분포를 만들지만 각 쌍의 대응까지 유지하지는 않는다."
  },
  "pair-view": {
    "en": "A filled board is not necessarily a solved puzzle",
    "ko": "자리를 채우는 것과 그림을 맞추는 것은 다르다"
  },
  "puzzle-intro": {
    "en": "A jigsaw checks <b>which piece belongs in each place</b>. A positional distribution describes <b>where the pieces are</b>. Exchange two destinations, then hide the photographs: the endpoint positions stay the same while the image changes.",
    "ko": "직소퍼즐은 <b>어느 조각이 어느 자리에 있는지</b>를 확인한다. 위치 분포는 <b>조각들이 어디에 있는지</b>를 나타낸다. 두 조각의 도착점을 바꾼 뒤 사진을 숨겨 보면, 끝점 위치는 그대로인데 그림은 달라진다."
  },
  "pairing": {
    "en": "Pairing preset",
    "ko": "대응 프리셋"
  },
  "initial": {
    "en": "Initial arrangement",
    "ko": "초기 배치"
  },
  "piece-plan": {
    "en": "Selected marker",
    "ko": "선택한 표식"
  },
  "destination": {
    "en": "Assigned destination",
    "ko": "대응하는 도착점"
  },
  "puzzle-photo-label": {
    "en": "Photo pieces",
    "ko": "사진 조각"
  },
  "puzzle-position-label": {
    "en": "Positions only",
    "ko": "위치만 보기"
  },
  "puzzle-swap-label": {
    "en": "Exchange two destinations",
    "ko": "두 조각의 도착점 교환"
  },
  "puzzle-reset-label": {
    "en": "Restore original pairing",
    "ko": "기본 대응 복원"
  },
  "board-label": {
    "en": "One piece identity across three arrangements",
    "ko": "세 배치에서 같은 조각 추적"
  },
  "pair-caption": {
    "en": "The exchange button swaps the selected piece with a second piece and moves to the endpoint. It keeps all endpoint positions occupied; only their identities change. Dot view shows component centers. The smooth distributions and sampled clouds are compared below.",
    "ko": "교환 버튼은 선택한 조각과 다른 조각의 도착점을 바꾸고 끝점으로 이동한다. 모든 끝점 자리는 그대로 채워지고 조각의 정체성만 달라진다. 점 보기는 모형 성분의 중심을 표시하며, 매끄러운 분포와 표본 비교는 아래 그래프에서 확인한다."
  },
  "flow-compare-title": {
    "en": "One probability path, two ways to move samples",
    "ko": "하나의 확률 경로를 만드는 두 이동 방식"
  },
  "comparison-time": {
    "en": "Interpolation time",
    "ko": "보간 시간"
  },
  "conditional-label": {
    "en": "Conditional interpolation",
    "ko": "조건부 보간"
  },
  "marginal-label": {
    "en": "Marginal ODE",
    "ko": "주변 ODE"
  },
  "flow-compare-note": {
    "en": "A highlighted pair starts at the same point in both panels. Blue follows its assigned conditional segment; red follows the probability-weighted mean field. Change the pairing to alter the interior of the path while preserving endpoint densities. The density projection uses 144 samples; integration uses 384 Heun steps.",
    "ko": "강조한 쌍은 두 화면에서 같은 점으로 출발한다. 파랑은 지정된 조건부 선분, 빨강은 확률로 가중한 평균 속도를 따른다. 대응만 바꾸면 양 끝 분포를 유지하며 중간 경로가 달라진다. 밀도 투영에는 표본 144개, 적분에는 Heun 384단계를 사용한다."
  },
  "pair-meaning": {
    "en": "The puzzle separates identity from position. Changing a pairing preserves the endpoint densities but generally changes the intermediate ones. For any fixed pairing, its conditional paths and the marginal ODE reproduce the same time marginals under regularity; individual pieces need not reach their assigned slots along the ODE.",
    "ko": "퍼즐은 조각의 정체성과 위치를 구분한다. 대응을 바꾸면 끝점 밀도는 유지되지만 중간 밀도는 일반적으로 달라진다. 하나의 대응을 고정하면, 그 조건부 경로와 주변 ODE는 적절한 정칙성 아래 각 시각의 같은 분포를 만든다. ODE를 따르는 개별 조각이 지정된 칸에 도착할 필요는 없다."
  },
  "mean-question": {
    "en": "Why does the average work?",
    "ko": "평균 속도로도 분포를 맞추는 이유"
  },
  "mean-read": {
    "en": "At one location, several endpoint pairs can contribute different directions. Weight them by their conditional probabilities. This velocity satisfies the continuity equation for the interpolation’s density. Move the observation point below, then inspect how the shared loss minimum follows the mean.",
    "ko": "한 위치에는 서로 다른 방향을 가진 여러 끝점 쌍이 기여할 수 있다. 각 쌍의 조건부 확률로 가중하면 보간 분포의 연속방정식을 만족하는 속도를 얻는다. 아래 관측 위치를 바꾸고 평균 속도와 손실의 최소점이 함께 이동하는 모습을 확인한다."
  },
  "field-label": {
    "en": "At the observation point: weighted directions",
    "ko": "관측점에서의 가중 방향"
  },
  "weight-explanation": {
    "en": "Colored arrows: the three largest probability-weighted contributions. Blue: the mean using all 48 components. Click to move the observation point.",
    "ko": "색 화살표: 확률로 가중한 기여가 가장 큰 세 방향. 파랑: 48개 성분을 모두 반영한 평균. 화면을 클릭해 관측 위치를 바꿀 수 있다."
  },
  "loss-explain": {
    "en": "The model sees position and time, while different endpoint pairs can supply different target velocities there. Squared-error regression recovers their conditional mean. The conditional and marginal objectives differ by a parameter-independent constant.",
    "ko": "모델은 위치와 시각을 보고 예측하지만, 같은 위치에서도 끝점 쌍에 따라 목표 속도가 달라질 수 있음. 제곱오차 회귀는 그 조건부 평균을 회복하며, 두 목적함수는 매개변수와 무관한 상수만큼 차이 남."
  },
  "loss-title": {
    "en": "Compare the local loss slices",
    "ko": "국소 손실 단면 비교"
  },
  "candidate-offset": {
    "en": "Horizontal offset from the conditional mean",
    "ko": "조건부 평균에서 후보 가로속도의 차이"
  },
  "risk-total-label": {
    "en": "Conditional squared error",
    "ko": "조건부 제곱오차"
  },
  "risk-excess-label": {
    "en": "Error from the mean",
    "ko": "평균과의 오차"
  },
  "risk-variance-label": {
    "en": "Conditional variance",
    "ko": "조건부 분산"
  },
  "use-mean": {
    "en": "Set both coordinates to the mean",
    "ko": "두 좌표를 평균에 맞추기"
  },
  "loss-caption": {
    "en": "Move the horizontal candidate coordinate while holding its vertical coordinate fixed. Both curves have the same horizontal minimizer; their gap is independent of the candidate. This local slice illustrates the objective identity rather than displaying the full training losses.",
    "ko": "세로 후보 좌표를 고정하고 가로 좌표를 이동. 두 곡선은 가로 방향 최솟값 위치가 같고 높이 차이는 후보와 무관. 이 국소 단면으로 목적함수 관계를 설명하며 전체 학습 손실 자체를 표시하는 것은 아님."
  },
  "cfm-conclusion": {
    "en": "<small>03 → GENERATION</small><b>CFM makes the FM objective trainable.</b><span>Training uses conditional targets. Generation follows the learned field with an ODE solver.</span>",
    "ko": "<small>03 → GENERATION</small><b>CFM은 FM의 목표를 학습 가능한 형태로 만든다.</b><span>학습에는 조건부 목표를 쓰고, 생성할 때는 학습한 속도장을 따라 ODE를 푼다.</span>"
  },
  "cnf-open": {
    "en": "Supplement: density and divergence along an ODE",
    "ko": "보조 실험: ODE의 밀도와 발산"
  },
  "cnf-title": {
    "en": "Likelihood needs the whole trajectory",
    "ko": "우도를 계산하려면 궤적이 필요하다"
  },
  "cnf-intro": {
    "en": "A continuous normalizing flow transports points with an ODE. For maximum-likelihood training, the position and the accumulated density change must be solved together.",
    "ko": "연속적인 Flow는 ODE로 위치를 운반. 최대우도 학습에서는 위치와 누적 밀도 변화를 함께 계산해야 함."
  },
  "cnf-read": {
    "en": "<b>Read the equation:</b> the starting log density is corrected by the divergence accumulated along the moving point. Expansion lowers local density; compression raises it.",
    "ko": "<b>수식 읽기:</b> 출발 로그밀도에서 이동 경로를 따라 누적한 발산을 뺌. 영역이 팽창하면 국소 밀도는 낮아지고, 압축되면 높아짐."
  },
  "cnf-view": {
    "en": "Trajectory → divergence → log density",
    "ko": "궤적 → 발산 → 로그밀도"
  },
  "replay": {
    "en": "Replay",
    "ko": "다시 재생"
  },
  "speed": {
    "en": "Playback speed",
    "ko": "재생 속도"
  },
  "cnf-piece": {
    "en": "Tracked starting point",
    "ko": "추적할 출발점"
  },
  "mesh-label": {
    "en": "Positions and a local material patch",
    "ko": "위치와 작은 영역의 변형"
  },
  "trace-label": {
    "en": "Accumulated log density",
    "ko": "누적된 로그밀도"
  },
  "density-integrated-label": {
    "en": "From the divergence integral",
    "ko": "발산 적분으로 계산"
  },
  "density-exact-label": {
    "en": "Direct analytic log density",
    "ko": "직접 계산한 로그밀도"
  },
  "density-gap-label": {
    "en": "Numerical discrepancy",
    "ko": "수치적 차이"
  },
  "cnf-caption": {
    "en": "Blue: accumulated log density. Red dashes: direct analytic value. Pale dots preview the full trace. The grid and outlined patch move with the ODE; the patch area is a finite-region approximation.",
    "ko": "파랑: 누적 로그밀도. 빨간 점선: 직접 계산한 값. 옅은 점선: 전체 곡선 미리보기. 격자와 작은 영역은 ODE를 따라 움직이며, 면적은 유한한 영역으로 계산한 근삿값이다."
  },
  "cnf-model": {
    "en": "In this demonstration, the analytic velocity takes the place of the parameterized field. The integral is evaluated up to the current time; the likelihood formula above is its endpoint form.",
    "ko": "이 데모에서는 해석적 속도장이 매개변수화된 속도장 역할을 대신함. 적분은 현재 시각까지 계산하며, 위 우도 수식은 끝 시각에서의 형태."
  },
  "solver-title": {
    "en": "Sampling still needs an ODE solver",
    "ko": "생성에서는 여전히 ODE를 푼다"
  },
  "solver-intro": {
    "en": "Compare the numerical integration stage separately from the choice of training objective. Use the same starting point, velocity field, and evaluation budget.",
    "ko": "학습 목적함수의 선택과 수치적분 단계를 구분. 같은 출발점·속도장·평가 횟수에서 생성 궤적을 비교."
  },
  "solver-open": {
    "en": "Open the Euler / Heun comparison",
    "ko": "Euler / Heun 비교 펼치기"
  },
  "piece-solver": {
    "en": "Tracked starting point",
    "ko": "추적할 출발점"
  },
  "budget": {
    "en": "Field evaluations per method",
    "ko": "각 방법의 속도장 평가 횟수"
  },
  "coordinate": {
    "en": "Coordinate to integrate",
    "ko": "적분할 좌표"
  },
  "euler-area-label": {
    "en": "Euler signed area",
    "ko": "Euler 부호 있는 면적"
  },
  "heun-area-label": {
    "en": "Heun signed area",
    "ko": "Heun 부호 있는 면적"
  },
  "ref-area-label": {
    "en": "Reference displacement",
    "ko": "기준 변위"
  },
  "area-note": {
    "en": "Euler rectangles and Heun stage-value trapezoids accumulate the displacement of each numerical method. Hover over an interval to highlight its update term. Each method evaluates its own states; the gray velocity curve follows the refined reference.",
    "ko": "Euler 직사각형과 Heun 단계값 사다리꼴의 부호 있는 면적은 각 수치해법의 변위로 누적. 구간을 가리키면 갱신 항 강조. 각 방법은 자체 상태에서 속도를 평가하며 회색 속도 곡선은 세밀한 기준 궤적을 따름."
  },
  "reference-legend": {
    "en": "Dashed: refined Heun",
    "ko": "점선: 세밀한 Heun 기준해"
  },
  "e-error-label": {
    "en": "Euler endpoint error",
    "ko": "Euler 끝점 오차"
  },
  "h-error-label": {
    "en": "Heun endpoint error",
    "ko": "Heun 끝점 오차"
  },
  "ref-check-label": {
    "en": "Reference refinement difference",
    "ko": "기준해 세분화 차이"
  },
  "solver-caption": {
    "en": "Equal field evaluations: Euler uses one evaluation per step, Heun two. Errors are measured against 4,096-step Heun, checked against 2,048 steps. Refinement checks consistency; it is not a certified error bound. Assigned-endpoint differences are separate from numerical integration error.",
    "ko": "동일 평가 횟수로 비교: Euler는 단계당 1회, Heun은 2회 평가. 오차 기준은 Heun 4,096단계이며 2,048단계와 비교. 세분화 차이는 일관성 점검으로 엄밀한 오차 상한은 아님. 지정 도착점과의 차이는 수치적분 오차와 구분."
  },
  "notes-title": {
    "en": "Model, scope, and sources",
    "ko": "모형·범위·출처"
  },
  "model-notes": {
    "en": "<li><b>Score experiment:</b> three smooth Gaussian components, exact score, exact terminal sampling. Reverse SDE: 512 Euler–Maruyama steps; probability flow ODE: 512 Heun steps.</li><li><b>CFM experiment:</b> 48 translated Gaussian components, width 0.16, share a Gaussian offset within each endpoint pair. The conditional and marginal displays use the same initial samples.</li><li><b>Scope:</b> analytic targets replace trained networks. Equal marginals apply within each experiment, not between the diffusion and CFM probability paths. Numerical and finite-sample discrepancies are visible.</li>",
    "ko": "<li><b>Score 실험:</b> 매끄러운 가우시안 성분 3개, 정확한 Score와 종단 표본. 역방향 SDE는 Euler–Maruyama 512단계, Probability Flow ODE는 Heun 512단계.</li><li><b>CFM 실험:</b> 폭 0.16의 가우시안 성분 48개. 각 끝점 쌍 안에서 같은 가우시안 오프셋을 공유하며 조건부·주변 화면은 동일 초기 표본을 사용.</li><li><b>범위:</b> 해석적 목표가 학습된 신경망을 대신한다. 분포 일치는 각 실험 내부의 관계이며 Diffusion과 CFM의 경로끼리 같다는 뜻은 아니다. 수치·표본 오차를 함께 표시.</li>"
  },
  "sources": {
    "en": "Score-based notes: PDF p. 51. Score-SDE notes: pp. 70, 73. Flow-based notes: pp. 21, 32, 39, 43, 46–47, 50–52. Differential-equations appendix: pp. 14–16. Every displayed equation is listed in the repository’s source audit.",
    "ko": "Score-based 자료: PDF 51쪽. Score-SDE 자료: 70, 73쪽. Flow-based 자료: 21, 32, 39, 43, 46–47, 50–52쪽. 미분방정식 부록: 14–16쪽. 모든 표시 수식은 저장소의 출처 목록에 기록."
  }
};
let language=document.documentElement.lang==='ko'?'ko':'en';
function setLanguage(lang){language=lang==='ko'?'ko':'en';document.documentElement.lang=language;document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=prose[el.dataset.i18n][language];});document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===language)));document.querySelectorAll('canvas').forEach(el=>el.setAttribute('aria-label',language==='ko'?'인터랙티브 시각화. 인접한 설명과 조작 메뉴를 참고하세요.':'Interactive visualization. See the adjacent description and controls.'));window.dispatchEvent(new Event('diffusionlanguagechange'));}
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>setLanguage(el.dataset.lang)));
window.DiffusionI18n={text:(en,ko)=>language==='ko'?ko:en,setLanguage,get language(){return language;}};setLanguage(language);
})();
