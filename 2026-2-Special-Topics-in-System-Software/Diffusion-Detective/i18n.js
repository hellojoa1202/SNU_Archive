/* Paired prose; numerical state is independent of language. */
(function(){'use strict';
const prose={
  "nav-coupling": {
    "en": "Paired paths",
    "ko": "끝점과 경로"
  },
  "nav-velocity": {
    "en": "Conditional mean",
    "ko": "속도의 평균"
  },
  "nav-transport": {
    "en": "Probability transport",
    "ko": "확률의 이동"
  },
  "nav-solver": {
    "en": "Numerical steps",
    "ko": "수치적분 단계"
  },
  "hero-title": {
    "en": "Paths. Velocities.<br><span>Probability in motion.</span>",
    "ko": "경로에서 속도로.<br><span>속도에서 확률의 이동으로.</span>"
  },
  "hero-lead": {
    "en": "An endpoint pairing defines a path. Conditional averaging gives a field. A solver turns the field into motion.",
    "ko": "끝점 대응으로 경로를 정하고, 조건부 평균으로 속도장을 만든다. 수치해법으로 그 흐름을 따라간다."
  },
  "hero-scope": {
    "en": "Four connected views, using the equations in the course notes. A small Gaussian-mixture example supplies the pictures and numerical values.",
    "ko": "강의자료의 수식으로 연결한 네 가지 시각화. 그림과 수치는 소규모 가우시안 혼합분포 예제로 구성한다."
  },
  "replay": {
    "en": "Replay",
    "ko": "다시 재생"
  },
  "speed": {
    "en": "Playback speed",
    "ko": "재생 속도"
  },
  "auto-demo": {
    "en": "Automatic probe and budget sweep",
    "ko": "관측점·평가 횟수 자동 변화"
  },
  "play-hint": {
    "en": "Playback starts automatically. Scroll to follow the same clock across the four views; pause to inspect any state.",
    "ko": "자동 재생으로 시작한다. 스크롤하며 같은 시간의 네 시각화를 보고, 일시정지하여 원하는 상태를 확인한다."
  },
  "coupling-title": {
    "en": "One pair, one prescribed path",
    "ko": "끝점 한 쌍으로 정하는 경로"
  },
  "coupling-guide": {
    "en": "<dt>Concept</dt><dd>Choose a joint law for the two endpoints, then prescribe an interpolation.</dd><dt>Animation</dt><dd>Watch photo markers follow their assigned paths; switch pairings while keeping both endpoint sets fixed.</dd><dt>Read the equation</dt><dd>The schedules weight the source and destination. Their derivatives determine the conditional velocity.</dd>",
    "ko": "<dt>개념</dt><dd>두 끝점의 결합분포를 정하고 그 사이의 보간 경로를 지정.</dd><dt>자동 시각화</dt><dd>사진 표식의 이동을 자동 재생. 출발·도착 중심은 유지한 채 대응 프리셋 변경.</dd><dt>수식 연결</dt><dd>스케줄은 끝점의 가중치를, 스케줄의 미분은 조건부 속도를 결정.</dd>"
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
    "en": "Tracked marker",
    "ko": "추적 표식"
  },
  "destination": {
    "en": "Assigned destination",
    "ko": "지정한 도착점"
  },
  "coupling-notes": {
    "en": "<li><b>Observe:</b> switching pairings changes intermediate paths and densities while preserving the two endpoint distributions. Changing the initial arrangement changes the source distribution.</li><li><b>Toy implementation:</b> twelve equally weighted translated Gaussian components; the same offset is carried between paired endpoints. The demo uses linear interpolation over a unit interval.</li><li><b>Image:</b> the photograph labels a center. It does not mean the marginal ODE must assemble the photograph. Pause at the beginning to drag a start.</li>",
    "ko": "<li><b>관찰:</b> 대응을 바꾸면 양 끝의 분포는 유지되지만 중간 경로·밀도는 변화. 초기 배치 변경은 출발 분포 자체를 변경.</li><li><b>구현용 예제:</b> 동일 가중치의 가우시안 성분 12개. 대응 끝점에 같은 오프셋을 적용하고 단위 시간 구간에서 선형 보간.</li><li><b>사진의 역할:</b> 중심의 식별 표시. 주변 ODE가 사진을 완성한다는 의미는 아님. 시작 시점에 멈추면 출발점을 직접 이동 가능.</li>"
  },
  "velocity-title": {
    "en": "Many possible directions, one field",
    "ko": "여러 조건부 방향에서 하나의 속도장으로"
  },
  "velocity-guide": {
    "en": "<dt>Concept</dt><dd>Average the possible conditional velocities given the current position.</dd><dt>Animation</dt><dd>An automatic probe reveals weighted arrows and posterior probabilities. A second view sweeps a candidate velocity over the loss surface.</dd><dt>Read the equation</dt><dd>The conditional expectation selects the mean. The loss identity explains why conditional targets can recover that mean.</dd>",
    "ko": "<dt>개념</dt><dd>현재 위치에서 가능한 조건부 속도를 평균.</dd><dt>자동 시각화</dt><dd>관측점을 자동 이동하며 가중 화살표와 사후확률 표시. 별도 손실 곡면에서 후보 속도를 자동 이동.</dd><dt>수식 연결</dt><dd>조건부기댓값이 평균 방향을 선택. 손실의 동치로 조건부 목표를 사용해도 그 평균을 학습하는 이유 설명.</dd>"
  },
  "field-hint": {
    "en": "Thin arrows: the field. Colored arrows: the three largest weighted contributions. Dark arrow: the mean over all components. Click a location to stop the automatic probe.",
    "ko": "가는 화살표는 속도장, 색 화살표는 기여도가 큰 세 성분, 진한 화살표는 전체 평균. 위치를 클릭하면 자동 관측을 멈추고 해당 지점을 조사한다."
  },
  "loss-title": {
    "en": "The local squared-error landscape",
    "ko": "한 위치에서 보는 제곱오차 곡면"
  },
  "total-label": {
    "en": "Conditional squared error",
    "ko": "조건부 제곱오차"
  },
  "excess-label": {
    "en": "Error from the mean",
    "ko": "평균과의 오차"
  },
  "variance-label": {
    "en": "Conditional variance",
    "ko": "조건부 분산"
  },
  "loss-hint": {
    "en": "Dark marker: the conditional mean. Purple marker: the candidate velocity. Color shows conditional squared error; darker is lower. Click to inspect a candidate.",
    "ko": "진한 표식은 조건부 평균, 보라색 표식은 후보 속도. 색은 조건부 제곱오차이며 진할수록 작다. 클릭하면 해당 후보를 조사한다."
  },
  "use-mean": {
    "en": "Set candidate to the mean",
    "ko": "후보를 평균으로 이동"
  },
  "loss-notes": {
    "en": "<li><b>What stays fixed:</b> at a fixed position and time, the variance does not depend on the candidate velocity. Moving the candidate changes only its error from the mean.</li><li><b>Local versus global:</b> the panel shows a conditional slice. The displayed training objectives also average over time and samples; their constant is independent of model parameters.</li><li><b>Learning:</b> equality of the objectives up to a constant does not guarantee successful optimization. This demo evaluates the mean analytically and trains no network.</li>",
    "ko": "<li><b>고정되는 값:</b> 위치·시간을 고정하면 조건부 분산은 후보 속도와 무관. 후보를 바꾸면 평균과의 오차만 변화.</li><li><b>국소와 전체:</b> 화면은 한 위치·시간에서의 조건부 단면. 위 학습 목적함수는 시간·표본에도 평균하며, 상수항은 모델 파라미터와 무관.</li><li><b>학습과의 연결:</b> 목적함수 동치가 최적화의 성공을 보장하지는 않음. 여기서는 평균을 해석적으로 계산하며 신경망은 학습하지 않음.</li>"
  },
  "transport-title": {
    "en": "Count what enters and leaves",
    "ko": "들어오고 나가는 확률을 관찰한다"
  },
  "transport-guide": {
    "en": "<dt>Concept</dt><dd>The continuity equation balances density change with probability flux.</dd><dt>Animation</dt><dd>Particles move through a marked region. Its model probability and sample fraction are traced over time.</dd><dt>Read the equation</dt><dd>Follow the density-change term and flux term together; they describe the same conservation law.</dd>",
    "ko": "<dt>개념</dt><dd>연속방정식은 밀도 변화와 확률 흐름의 균형.</dd><dt>자동 시각화</dt><dd>지정 영역을 지나는 입자와 시간별 모델 확률·표본 비율을 자동 추적.</dd><dt>수식 연결</dt><dd>밀도 변화 항과 확률 흐름 항을 연결해 같은 보존 법칙을 관찰.</dd>"
  },
  "mass-cut": {
    "en": "Region boundary",
    "ko": "관측 영역 경계"
  },
  "model-mass": {
    "en": "Model probability",
    "ko": "모델 확률"
  },
  "sample-mass": {
    "en": "Sample fraction",
    "ko": "표본 비율"
  },
  "mass-rate": {
    "en": "Probability change / time",
    "ko": "시간당 확률 변화"
  },
  "mass-hint": {
    "en": "Blue curve: model probability to the left of the boundary. Gray curve: transported sample fraction. The vertical line marks the shared time. Green/orange particles have recently entered/left the region.",
    "ko": "파란 곡선은 경계 왼쪽의 모델 확률, 회색은 이동 표본의 비율. 수직선은 현재 시간. 초록·주황 입자는 최근 영역으로 들어오거나 나간 표본."
  },
  "transport-notes": {
    "en": "<li><b>Paths:</b> the orange assigned line and blue marginal trajectory need not agree. Under the stated regularity, the velocity reproduces the densities without generally preserving the original endpoint pairing.</li><li><b>Finite samples:</b> the model probability is smooth, while the fraction of 96 particles changes in small jumps. These sampling differences are separate from numerical integration error.</li>",
    "ko": "<li><b>경로:</b> 주황색 지정 경로와 파란색 주변 궤적은 다를 수 있음. 정칙성 가정 아래 속도장은 분포를 재현하지만 원래 끝점 대응을 일반적으로 보존하지 않음.</li><li><b>유한 표본:</b> 모델 확률은 매끄럽고 96개 표본의 비율은 계단 형태로 변화. 표본에 따른 차이와 수치적분 오차는 구분.</li>"
  },
  "solver-title": {
    "en": "Watch the update, then compare the error",
    "ko": "갱신 과정을 보고 오차를 비교한다"
  },
  "solver-guide": {
    "en": "<dt>Concept</dt><dd>Euler follows the initial velocity; Heun also evaluates a predicted endpoint.</dd><dt>Animation</dt><dd>Animate the two stages, then sweep equal evaluation budgets on the same field.</dd><dt>Read the equation</dt><dd>Highlight the velocity used at each stage and compare first- and second-order global errors.</dd>",
    "ko": "<dt>개념</dt><dd>Euler는 시작 속도, Heun은 예측 끝점의 속도까지 평가.</dd><dt>자동 시각화</dt><dd>한 단계의 계산을 자동 재생하고 동일 평가 횟수에서 두 해법 비교.</dd><dt>수식 연결</dt><dd>각 단계에서 사용하는 속도 항을 강조하고 전역 오차의 1차·2차 수렴 비교.</dd>"
  },
  "step-note": {
    "en": "Local step, magnified equally for both methods. The animation uses an eight-step grid to make prediction and correction visible; the budget comparison below is separate.",
    "ko": "두 방법을 같은 배율로 확대한 국소 단계. 예측·보정을 보기 위해 8단계 격자를 사용하며, 아래의 평가 횟수 비교와 구분한다."
  },
  "piece-solver": {
    "en": "Tracked starting point",
    "ko": "추적할 출발점"
  },
  "budget-label": {
    "en": "Field evaluations per method",
    "ko": "각 방법의 속도장 평가 횟수"
  },
  "reference-legend": {
    "en": "Dashed · refined Heun reference",
    "ko": "점선 · 세밀한 Heun 기준해"
  },
  "ref-check": {
    "en": "Reference refinement difference",
    "ko": "기준해 세분화 차이"
  },
  "error-caption": {
    "en": "Endpoint error versus field evaluations, on logarithmic axes. The active budget is highlighted. Reference: Heun with 4,096 steps, checked against 2,048 steps. Refinement is a consistency check, not a certified error bound.",
    "ko": "로그 축에서 평가 횟수와 끝점 오차 비교. 현재 계산량을 강조. 기준해는 Heun 4,096단계이며 2,048단계와 비교해 확인. 세분화 차이는 일관성 점검이며 엄밀한 오차 상한은 아님."
  },
  "solver-notes": {
    "en": "<li><b>Cost:</b> Euler evaluates once per step, Heun twice. Equal evaluation counts compare their computational budgets directly.</li><li><b>Accuracy:</b> under the smoothness assumptions in the notes, Euler has first-order global error and Heun second-order global error. The advantage at a particular budget still depends on the field and path.</li><li><b>Read carefully:</b> deviation from an assigned destination is not the same as numerical error against the reference trajectory.</li>",
    "ko": "<li><b>계산량:</b> Euler는 단계당 1회, Heun은 2회 평가. 평가 횟수를 같게 두어 계산량 기준으로 비교.</li><li><b>정확도:</b> 강의의 매끄러움 가정 아래 Euler는 1차, Heun은 2차 전역 오차. 특정 계산량에서의 우열은 속도장·경로에 따라 달라짐.</li><li><b>구분:</b> 지정된 도착점에서 벗어나는 현상과 기준 궤적에 대한 수치 오차는 서로 다른 값.</li>"
  },
  "notes-title": {
    "en": "Model and course sources",
    "ko": "모형과 강의 출처"
  },
  "model-notes": {
    "en": "<li><b>Lecture equations:</b> every displayed equation is transcribed from the supplied notes. Source captions name the original slide and PDF page. No additional energy, assignment-cost, or closed-form probability equations are introduced.</li><li><b>Numerical example:</b> equally weighted translated Gaussian components of fixed width 0.16; a shared offset at paired endpoints. This tractable example and its interface are project constructions.</li><li><b>Evaluation:</b> densities, conditional means, and conditional losses are computed directly. Particle trajectories use 1,024-step Heun; tracked references use 4,096-step Heun. No network is trained.</li>",
    "ko": "<li><b>강의 수식:</b> 표시한 식은 제공된 강의자료에서 옮김. 각 식 아래에 원래 슬라이드 제목과 PDF 페이지 표기. 추가 에너지식·대응 비용식·확률의 닫힌 형태는 도입하지 않음.</li><li><b>수치 예제:</b> 동일 가중치, 고정 폭 0.16의 평행이동 가우시안 성분. 대응 끝점에 같은 오프셋 적용. 해석 가능한 이 예제와 인터페이스는 프로젝트용으로 구성.</li><li><b>계산:</b> 밀도·조건부 평균·조건부 손실은 직접 계산. 입자 궤적은 Heun 1,024단계, 추적 기준해는 4,096단계 사용. 신경망 학습은 하지 않음.</li>"
  },
  "sources": {
    "en": "Flow-based notes: “Condition on the endpoint pair,” “The conditional velocity,” “The velocity that generates the family,” and “The minimizer is the marginal velocity.” Score-SDE notes: “Flux” and “The continuity equation.” Differential-equations appendix: “Euler’s method,” “Heun’s method,” and “What a step costs.”",
    "ko": "Flow-based 자료: 끝점 대응·조건부 속도·주변 속도·목적함수 동치. Score-SDE 자료: 확률 흐름과 연속방정식. 미분방정식 부록: Euler·Heun 방법과 단계당 평가 횟수."
  }
};
let language=document.documentElement.lang==='ko'?'ko':'en';
function setLanguage(lang){language=lang==='ko'?'ko':'en';document.documentElement.lang=language;document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=prose[el.dataset.i18n][language];});document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===language)));document.querySelectorAll('canvas').forEach(el=>el.setAttribute('aria-label',language==='ko'?'인터랙티브 시각화. 인접한 설명과 조작 메뉴를 참고하세요.':'Interactive visualization. See the adjacent description and controls.'));window.dispatchEvent(new Event('diffusionlanguagechange'));}
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>setLanguage(el.dataset.lang)));
window.DiffusionI18n={text:(en,ko)=>language==='ko'?ko:en,setLanguage,get language(){return language;}};setLanguage(language);
})();
