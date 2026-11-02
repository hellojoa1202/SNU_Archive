/* Paired prose; numerical state is independent of language. */
(function(){'use strict';
const prose={
  "nav-coupling": {
    "en": "Motion score",
    "ko": "경로 악보"
  },
  "nav-velocity": {
    "en": "Layered plans",
    "ko": "겹친 이동 계획"
  },
  "nav-transport": {
    "en": "Probability gate",
    "ko": "확률 출입문"
  },
  "nav-solver": {
    "en": "Displacement by area",
    "ko": "면적으로 만드는 이동"
  },
  "hero-title": {
    "en": "Flow Matching.<br><span>Paths, means, conservation, integration.</span>",
    "ko": "Flow Matching.<br><span>경로 · 평균 · 보존 · 적분</span>"
  },
  "hero-lead": {
    "en": "Write the paths, inspect the shared direction, count probability crossing a gate, and build displacement from area.",
    "ko": "경로를 직접 정하고, 평균 방향을 조사하고, 출입하는 확률을 센 뒤, 면적을 쌓아 이동을 계산한다."
  },
  "hero-scope": {
    "en": "Three manual experiments and one automatic probability-flow scene. Every displayed equation comes from the supplied course notes.",
    "ko": "세 가지 수동 실험과 하나의 자동 확률 흐름. 표시 수식은 제공된 강의자료에서만 사용한다."
  },
  "replay": {
    "en": "Replay",
    "ko": "다시 재생"
  },
  "speed": {
    "en": "Playback speed",
    "ko": "재생 속도"
  },
  "coupling-title": {
    "en": "A motion score you can rewrite",
    "ko": "직접 바꾸는 경로 악보"
  },
  "coupling-guide": {
    "en": "<dt>Concept</dt><dd>Each pair carries one prescribed trajectory.</dd><dt>Interaction</dt><dd>Change a pairing; drag the time ruler to slice the threads. The photo board and time-space view stay synchronized.</dd><dt>Equation</dt><dd>The highlighted thread is one interpolant. Its tangent follows the conditional velocity.</dd>",
    "ko": "<dt>개념</dt><dd>끝점 한 쌍이 하나의 지정 경로를 구성.</dd><dt>조작</dt><dd>대응 관계를 바꾸고 시간자를 드래그해 실처럼 펼친 경로를 자르기. 사진판과 시간·공간 장면은 동기화.</dd><dt>수식 연결</dt><dd>강조한 실은 하나의 보간 경로. 그 접선이 조건부 속도에 대응.</dd>"
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
    "en": "Layer the plans, then inspect the common direction",
    "ko": "이동 계획을 겹쳐 평균 방향을 읽는다"
  },
  "velocity-guide": {
    "en": "<dt>Concept</dt><dd>A location can be explained by several endpoint pairs.</dd><dt>Interaction</dt><dd>Choose a location manually. Transparent cards expose possible directions; their weighted contributions form the mean.</dd><dt>Equation</dt><dd>The conditional-expectation term becomes a visible accumulation. The loss curves share a minimizer but differ in height.</dd>",
    "ko": "<dt>개념</dt><dd>한 위치에 도달할 수 있는 끝점 쌍은 여러 개.</dd><dt>조작</dt><dd>위치를 직접 선택. 투명 카드로 가능한 방향을 펼치고 가중 기여를 누적해 평균 구성.</dd><dt>수식 연결</dt><dd>조건부기댓값은 눈에 보이는 방향의 누적. 손실 곡선은 높이가 달라도 최솟값 위치가 같음.</dd>"
  },
  "field-hint": {
    "en": "Click the field to choose a location. The three cards show the most likely components; the accumulation below includes all twelve. Card opacity follows posterior probability.",
    "ko": "속도장을 클릭해 위치 선택. 세 카드는 확률이 큰 성분이며, 아래 누적에는 12개 전체를 포함. 카드의 투명도는 사후확률에 대응."
  },
  "loss-title": {
    "en": "Same minimum, different height",
    "ko": "같은 최솟값 위치, 다른 높이"
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
    "en": "Slide the candidate horizontally; its vertical velocity stays at the conditional mean. Upper curve: conditional squared error. Lower curve: error from the mean. The shaded gap is independent of the candidate at this fixed probe. These are local slices, not the full training losses.",
    "ko": "후보의 가로속도를 조절하고 세로속도는 조건부 평균에 고정. 위 곡선은 조건부 제곱오차, 아래는 평균과의 오차. 음영의 높이 차이는 고정한 관측점에서 후보와 무관. 전체 학습 손실이 아닌 국소 단면."
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
    "en": "A gate that keeps a probability ledger",
    "ko": "확률의 출입을 기록하는 문"
  },
  "transport-guide": {
    "en": "<dt>Concept</dt><dd>Flux counts what crosses a boundary; continuity balances what remains.</dd><dt>Interaction</dt><dd>This scene plays automatically. Move the gate manually to define a new fixed observation region; playback pauses for inspection.</dd><dt>Equation</dt><dd>Entering and leaving particles change the ledger. The density-change and flux terms describe this same balance.</dd>",
    "ko": "<dt>개념</dt><dd>경계를 통과하는 흐름과 영역에 남는 확률의 보존.</dd><dt>조작</dt><dd>이 장면은 자동 재생. 출입문을 옮겨 고정 관측 영역을 다시 지정하면 일시정지.</dd><dt>수식 연결</dt><dd>입자의 유입·유출이 장부를 변경. 밀도 변화 항과 흐름 항은 같은 균형을 표현.</dd>"
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
    "en": "Blue: model probability inside the gate. Gray: sample fraction. The ledger counts every crossing since the start, including repeated entries and exits, for the currently selected fixed boundary.",
    "ko": "파란색은 문 안쪽의 모델 확률, 회색은 표본 비율. 장부는 현재 선택한 고정 경계에서 시작 이후의 모든 출입을 집계하며 재진입·재유출도 포함."
  },
  "transport-notes": {
    "en": "<li><b>Paths:</b> the orange assigned line and blue marginal trajectory need not agree. Under the stated regularity, the velocity reproduces the densities without generally preserving the original endpoint pairing.</li><li><b>Finite samples:</b> the model probability is smooth, while the fraction of 96 particles changes in small jumps. These sampling differences are separate from numerical integration error.</li>",
    "ko": "<li><b>경로:</b> 주황색 지정 경로와 파란색 주변 궤적은 다를 수 있음. 정칙성 가정 아래 속도장은 분포를 재현하지만 원래 끝점 대응을 일반적으로 보존하지 않음.</li><li><b>유한 표본:</b> 모델 확률은 매끄럽고 96개 표본의 비율은 계단 형태로 변화. 표본에 따른 차이와 수치적분 오차는 구분.</li>"
  },
  "solver-title": {
    "en": "Build displacement out of signed area",
    "ko": "부호 있는 면적을 쌓아 이동을 만든다"
  },
  "solver-guide": {
    "en": "<dt>Concept</dt><dd>The solution integrates velocity along its own trajectory.</dd><dt>Interaction</dt><dd>Select a coordinate and an evaluation budget manually. Hover over a time interval to connect its colored area to the update.</dd><dt>Equation</dt><dd>Euler contributes rectangles; Heun contributes trapezoids built from its stage evaluations. Their total signed area equals each method’s displacement.</dd>",
    "ko": "<dt>개념</dt><dd>해는 자신의 궤적을 따라 속도를 적분한 결과.</dd><dt>조작</dt><dd>좌표와 평가 횟수를 직접 선택. 시간 구간을 가리켜 색 면적과 갱신식 연결.</dd><dt>수식 연결</dt><dd>Euler는 직사각형, Heun은 단계 평가로 만든 사다리꼴. 부호 있는 면적의 합은 각 방법의 변위와 일치.</dd>"
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
    "en": "Flow-based notes: “Condition on the endpoint pair,” “The conditional velocity,” “The velocity that generates the family,” and “The minimizer is the marginal velocity.” Score-SDE notes: “Flux” and “The continuity equation.” Differential-equations appendix: “From a continuous trajectory to numerical updates,” “Euler’s method,” “Heun’s method,” and “What a step costs.”",
    "ko": "Flow-based 자료: 끝점 대응·조건부 속도·주변 속도·목적함수 동치. Score-SDE 자료: 확률 흐름과 연속방정식. 미분방정식 부록: 궤적의 적분식, Euler·Heun 방법과 단계당 평가 횟수."
  },
  "board-title": {
    "en": "Position on the photo board",
    "ko": "사진판 위의 위치"
  },
  "score-title": {
    "en": "The same paths, unfolded through time",
    "ko": "같은 경로를 시간축으로 펼치면"
  },
  "score-note": {
    "en": "The tilted sheets are spatial planes; vertical height encodes time. Drag the ruler on the right or use arrow keys. Crossing threads are conditional paths, not marginal ODE trajectories.",
    "ko": "기울어진 판은 공간, 세로 높이는 시간. 오른쪽 시간자를 드래그하거나 방향키로 이동. 교차하는 실은 조건부 경로이며 주변 ODE 궤적과 구분."
  },
  "probe-title": {
    "en": "Choose the observation point",
    "ko": "관측 위치 선택"
  },
  "layers-title": {
    "en": "Unfold the possible plans",
    "ko": "가능한 계획 펼치기"
  },
  "candidate-offset": {
    "en": "Horizontal candidate offset from the mean",
    "ko": "평균에서 후보 가로속도의 차이"
  },
  "gate-initial": {
    "en": "Initially inside",
    "ko": "처음 안에 있던 수"
  },
  "gate-entered": {
    "en": "Entered",
    "ko": "들어온 수"
  },
  "gate-left": {
    "en": "Left",
    "ko": "나간 수"
  },
  "gate-current": {
    "en": "Currently inside",
    "ko": "지금 안에 있는 수"
  },
  "mass-details": {
    "en": "Compare model probability and finite samples",
    "ko": "모델 확률과 유한 표본 비교"
  },
  "coordinate": {
    "en": "Coordinate to integrate",
    "ko": "적분할 좌표"
  },
  "area-e-label": {
    "en": "signed area",
    "ko": "부호 있는 면적"
  },
  "area-h-label": {
    "en": "signed area",
    "ko": "부호 있는 면적"
  },
  "area-ref-label": {
    "en": "Reference displacement",
    "ko": "기준 변위"
  },
  "quadrature-note": {
    "en": "Above/below the zero line means positive/negative displacement. Each method evaluates velocity at its own numerical states; the gray curve follows the refined reference trajectory. Hover or use arrow keys to inspect an interval.",
    "ko": "0 기준선 위·아래는 양·음의 변위. 각 방법은 자체 수치 상태에서 속도를 평가하고, 회색 곡선은 세밀한 기준 궤적을 따름. 마우스나 방향키로 시간 구간 조사."
  },
  "solver-details": {
    "en": "Inspect trajectories and convergence",
    "ko": "궤적과 수렴 오차 비교"
  }
};
let language=document.documentElement.lang==='ko'?'ko':'en';
function setLanguage(lang){language=lang==='ko'?'ko':'en';document.documentElement.lang=language;document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=prose[el.dataset.i18n][language];});document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===language)));document.querySelectorAll('canvas').forEach(el=>el.setAttribute('aria-label',language==='ko'?'인터랙티브 시각화. 인접한 설명과 조작 메뉴를 참고하세요.':'Interactive visualization. See the adjacent description and controls.'));window.dispatchEvent(new Event('diffusionlanguagechange'));}
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>setLanguage(el.dataset.lang)));
window.DiffusionI18n={text:(en,ko)=>language==='ko'?ko:en,setLanguage,get language(){return language;}};setLanguage(language);
})();
