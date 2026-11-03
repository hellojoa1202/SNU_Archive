(function(){
const prose={
  "skip": {
    "en": "Skip to content",
    "ko": "본문으로 이동"
  },
  "nav-cnf": {
    "en": "Neural ODE flows",
    "ko": "Neural ODE 기반 Flow"
  },
  "nav-fm": {
    "en": "Flow Matching",
    "ko": "FM: 속도 회귀"
  },
  "nav-cfm": {
    "en": "Conditional Flow Matching",
    "ko": "CFM: 조건부 목표"
  },
  "nav-solver": {
    "en": "Generation: ODE solvers",
    "ko": "생성: ODE 수치해법"
  },
  "hero-title": {
    "en": "From Neural ODEs<br><span>to Conditional Flow Matching.</span>",
    "ko": "Neural ODE에서<br><span>Conditional Flow Matching으로.</span>"
  },
  "hero-lead": {
    "en": "One transport problem. Three ways to construct a training objective.",
    "ko": "하나의 분포 운반 문제에서 이어지는 세 가지 학습 구성."
  },
  "hero-body": {
    "en": "Follow the obstacle that each method leaves behind: a trajectory-dependent likelihood, an inaccessible marginal velocity, and a tractable conditional target.",
    "ko": "궤적을 계산해야 얻는 우도에서 시작해, 직접 구하기 어려운 주변 속도와 계산 가능한 조건부 목표로 연결."
  },
  "route-node": {
    "en": "<b>Neural ODE flow</b><span>Integrate a trajectory</span>",
    "ko": "<b>Neural ODE Flow</b><span>궤적을 따라 적분</span>"
  },
  "route-fm": {
    "en": "<b>Flow Matching</b><span>Regress a local velocity</span>",
    "ko": "<b>Flow Matching</b><span>한 위치의 속도 회귀</span>"
  },
  "route-cfm": {
    "en": "<b>Conditional FM</b><span>Use a sampled endpoint pair</span>",
    "ko": "<b>Conditional FM</b><span>끝점 쌍으로 목표 구성</span>"
  },
  "hero-note": {
    "en": "An analytic toy field makes the quantities inspectable. The page compares objectives and sampling computations; it does not train a network.",
    "ko": "해석적 토이 속도장으로 각 값을 직접 확인. 학습 목적과 샘플링 계산을 비교하며 신경망 학습은 수행하지 않음."
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
    "en": "Follow a deforming sheet of graph paper",
    "ko": "격자 종이가 변형되는 모습을 따라가기"
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
    "en": "The graph paper is a material grid carried by the ODE. The small blue patch surrounds the tracked start; its area is a finite-patch approximation. Blue: integrated log density. Dashed: direct analytic evaluation. Curves overlap when the numerical calculation agrees.",
    "ko": "격자는 ODE를 따라 움직이는 위치들의 연결. 작은 파란 영역은 추적 출발점 주변을 나타내며 면적은 유한 영역의 근사. 파란 곡선은 적분한 로그밀도, 점선은 직접 계산한 값. 수치 계산이 일치하면 두 곡선이 겹침."
  },
  "cnf-model": {
    "en": "In this demonstration, the analytic velocity takes the place of the parameterized field. The integral is evaluated up to the current time; the likelihood formula above is its endpoint form.",
    "ko": "이 데모에서는 해석적 속도장이 매개변수화된 속도장 역할을 대신함. 적분은 현재 시각까지 계산하며, 위 우도 수식은 끝 시각에서의 형태."
  },
  "bridge-fm": {
    "en": "<b>What remains:</b> even one likelihood evaluation follows a trajectory. Can training use a target available at a single position and time?",
    "ko": "<b>다음 문제:</b> 우도를 한 번 평가할 때도 궤적을 계산해야 함. 한 위치·시각에서 얻는 목표만으로 학습할 수 있을까?"
  },
  "fm-title": {
    "en": "Replace likelihood evaluation with velocity regression",
    "ko": "우도 계산에서 속도 회귀로"
  },
  "fm-intro": {
    "en": "Prescribe a probability path and its generating velocity. Flow Matching fits that velocity pointwise, so the objective contains no trajectory solve.",
    "ko": "확률 경로와 이를 만드는 속도를 정하고, 위치별 목표 속도에 맞추도록 회귀. 목적함수 안에서 전체 궤적을 풀 필요가 없어짐."
  },
  "compute-cnf": {
    "en": "<b>Likelihood-based flow</b><span>Initial state → ODE steps → accumulated density → objective</span>",
    "ko": "<b>우도 기반 Flow</b><span>초기 상태 → ODE 단계 → 누적 밀도 → 목적함수</span>"
  },
  "compute-fm": {
    "en": "<b>Flow Matching</b><span>Sample time and position → compare velocities → local error</span>",
    "ko": "<b>Flow Matching</b><span>시각·위치 표본 → 속도 비교 → 국소 오차</span>"
  },
  "fm-view": {
    "en": "Compare two arrows at one location",
    "ko": "한 위치에서 두 화살표 비교"
  },
  "legend-target": {
    "en": "Blue: analytic target",
    "ko": "파란색: 해석적 목표"
  },
  "legend-prediction": {
    "en": "Orange: candidate velocity",
    "ko": "주황색: 후보 속도"
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
    "en": "Click to move the observation point; drag the orange arrow tip or use the coordinate controls. The analytic target is available in this toy model. In a general data distribution, this marginal target is the quantity we cannot evaluate directly.",
    "ko": "화면을 눌러 관측 위치 변경. 주황 화살표 끝을 드래그하거나 좌표 조절로 후보 속도 변경. 이 토이 모형에서는 해석적 목표를 계산할 수 있지만, 일반적인 데이터 분포에서는 바로 이 주변 목표를 직접 구하기 어려움."
  },
  "fm-note": {
    "en": "The displayed error is one local contribution. The training objective also averages over time and positions. Drawing a toy sample uses its known endpoint interpolation; no marginal ODE is solved for that draw.",
    "ko": "표시한 오차는 한 위치에서의 기여. 학습 목적함수는 시각·위치에 대해서도 평균. 토이 표본은 알려진 끝점 보간으로 뽑으며 이 표본 추출에 주변 ODE 풀이는 필요하지 않음."
  },
  "bridge-cfm": {
    "en": "<b>What remains:</b> pointwise regression is useful only if its target can be obtained. Instead of evaluating the marginal velocity, can we use a target from one sampled endpoint pair?",
    "ko": "<b>다음 문제:</b> 회귀하려면 목표값을 얻을 수 있어야 함. 주변 속도 대신, 표본으로 뽑은 끝점 쌍에서 계산한 목표를 쓸 수 있을까?"
  },
  "cfm-title": {
    "en": "Construct a target from an endpoint pair",
    "ko": "끝점 쌍에서 계산 가능한 목표를 만든다"
  },
  "cfm-intro": {
    "en": "Sample two paired endpoints, interpolate their positions, and differentiate that path. This gives a conditional target without integrating the marginal ODE.",
    "ko": "대응하는 끝점 쌍을 뽑고 위치를 보간한 뒤 그 경로의 속도를 계산. 주변 ODE를 적분하지 않고 조건부 목표를 얻을 수 있음."
  },
  "pair-view": {
    "en": "Pair positions, then inspect their directions",
    "ko": "위치를 대응시키고 이동 방향 확인"
  },
  "pairing": {
    "en": "Pairing preset",
    "ko": "대응 프리셋"
  },
  "initial": {
    "en": "Initial arrangement",
    "ko": "초기 배치"
  },
  "board-label": {
    "en": "Photo markers: conditional paths",
    "ko": "사진 표식: 조건부 경로"
  },
  "field-label": {
    "en": "At the observation point: weighted directions",
    "ko": "관측점에서의 가중 방향"
  },
  "piece-plan": {
    "en": "Selected marker",
    "ko": "선택한 표식"
  },
  "destination": {
    "en": "Assigned destination",
    "ko": "대응하는 도착점"
  },
  "pair-caption": {
    "en": "At time zero, drag a photo marker to change a starting center. Changing only the pairing preserves endpoint densities. In the field, the three colored arrows show the largest probability-weighted contributions; the dark arrow includes all twelve.",
    "ko": "시간이 0일 때 사진 표식을 드래그하여 출발 중심 변경. 대응만 바꾸면 끝점 밀도는 유지. 오른쪽 색 화살표는 확률로 가중한 기여가 큰 세 성분, 진한 화살표는 전체 12개 성분의 평균."
  },
  "pair-meaning": {
    "en": "The photograph identifies a conditional endpoint pair. A marginal ODE reproduces the distribution path under the stated regularity; its individual trajectories need not keep those labeled assignments.",
    "ko": "사진은 조건부 끝점 쌍의 식별 표시. 정칙성 가정 아래 주변 ODE는 분포 경로를 재현하지만, 개별 궤적이 그 표식의 도착점 대응까지 유지하는 것은 아님."
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
    "en": "<b>The connection:</b> CFM makes the Flow Matching target trainable through endpoint samples. Training can avoid a trajectory solve; generation still follows the learned velocity with an ODE solver.",
    "ko": "<b>연결:</b> CFM은 끝점 표본을 이용해 Flow Matching의 목표를 학습 가능한 조건부 회귀로 구성. 학습에서 궤적 풀이를 피할 수 있어도 생성에서는 속도장을 따라 ODE를 풀어야 함."
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
    "en": "<li><b>One shared model:</b> twelve equally weighted Gaussian components, width 0.16, carry a shared offset between paired endpoints. Pairing and initial-position edits affect all scenes.</li><li><b>What is computed:</b> analytic velocities and losses; Heun trajectories and a divergence integral. The toy field substitutes for a learned network. The comparison concerns objective construction, not measured training speed.</li><li><b>Numerical resolution:</b> material grid and particle paths: 1,024 steps; tracked log-density trace: 2,048 steps. Solver reference: 4,096 steps.</li>",
    "ko": "<li><b>공통 모형:</b> 동일 가중치·폭 0.16의 가우시안 성분 12개가 대응 끝점 사이에 같은 오프셋을 운반. 대응·출발 위치 수정은 전체 장면에 반영.</li><li><b>계산 범위:</b> 해석적 속도·손실, Heun 궤적과 발산 적분. 토이 속도장이 학습된 신경망을 대신하며, 학습 속도 측정이 아닌 목적함수 구성의 비교.</li><li><b>수치 해상도:</b> 격자·입자 궤적 1,024단계, 추적 로그밀도 2,048단계. 수치해법 기준해 4,096단계.</li>"
  },
  "sources": {
    "en": "Flow-based notes: “How the density moves along a trajectory” (PDF p. 21), “Training: maximum likelihood” (p. 32), “Regress the velocity instead” (p. 39), and conditional targets and objective equivalence (pp. 43, 46–47, 50–52). Differential-equations appendix: integral equation, Euler, and Heun (pp. 14–16).",
    "ko": "Flow-based 자료: 궤적을 따른 밀도 변화(PDF 21쪽), 최대우도 학습(32쪽), 속도 회귀(39쪽), 조건부 목표와 목적함수 동치(43, 46–47, 50–52쪽). 미분방정식 부록: 적분식·Euler·Heun(14–16쪽)."
  }
};
let language=document.documentElement.lang==='ko'?'ko':'en';
function setLanguage(lang){language=lang==='ko'?'ko':'en';document.documentElement.lang=language;document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=prose[el.dataset.i18n][language];});document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===language)));document.querySelectorAll('canvas').forEach(el=>el.setAttribute('aria-label',language==='ko'?'인터랙티브 시각화. 인접한 설명과 조작 메뉴를 참고하세요.':'Interactive visualization. See the adjacent description and controls.'));window.dispatchEvent(new Event('diffusionlanguagechange'));}
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>setLanguage(el.dataset.lang)));
window.DiffusionI18n={text:(en,ko)=>language==='ko'?ko:en,setLanguage,get language(){return language;}};setLanguage(language);
})();
