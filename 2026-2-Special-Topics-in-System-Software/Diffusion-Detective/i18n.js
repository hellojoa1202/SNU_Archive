/* Paired prose; numerical state is independent of language. */
(function(){'use strict';
const prose={
  "nav-coupling": {
    "en": "Design a coupling",
    "ko": "이동 계획"
  },
  "nav-velocity": {
    "en": "Average the directions",
    "ko": "평균 속도장"
  },
  "nav-transport": {
    "en": "Follow the flow",
    "ko": "분포와 경로"
  },
  "nav-solver": {
    "en": "Compute the path",
    "ko": "수치 계산"
  },
  "hero-title": {
    "en": "Same destination.<br><span>Different flows.</span>",
    "ko": "같은 도착 분포.<br><span>다른 이동 경로.</span>"
  },
  "hero-lead": {
    "en": "Design the connections. Build a velocity field. Trace what actually moves.",
    "ko": "연결을 설계하고, 속도장을 구성하고, 실제 이동을 추적한다."
  },
  "hero-question": {
    "en": "A coupling assigns destinations to starting points. A flow sees only the current position and time. This distinction changes the paths—even when the endpoint distributions stay the same.",
    "ko": "결합은 출발점에 목적지를 지정한다. 속도장은 현재 위치와 시간으로 이동을 결정한다. 두 방식은 출발·도착 분포가 같아도 서로 다른 경로를 만들 수 있다."
  },
  "hero-meta": {
    "en": "CH4 · Conditional Flow Matching → CH3 · continuity equation → numerical integration",
    "ko": "CH4 · Conditional Flow Matching → CH3 · 연속방정식 → 수치 적분"
  },
  "coupling-intro": {
    "en": "Twelve photo pieces mark twelve starting centers Aᵢ. Each is paired with a destination Bπ(i). Swap two assignments: the destination set stays fixed, but the intermediate routes change.",
    "ko": "사진 조각 12개가 출발 중심 Aᵢ를 표시한다. 각 중심은 도착점 Bπ(i)와 연결된다. 두 연결을 교환하면 도착점의 집합은 유지되지만 중간 이동 경로는 달라진다."
  },
  "piece-plan": {
    "en": "Tracked piece",
    "ko": "추적할 조각"
  },
  "dest-label": {
    "en": "Assigned destination",
    "ko": "연결할 도착점"
  },
  "time-plan": {
    "en": "Time t",
    "ko": "시간 t"
  },
  "reset": {
    "en": "Reset arrangement",
    "ko": "배치 초기화"
  },
  "plan-hint": {
    "en": "At t = 0, drag a piece to move its start. Choose another destination to exchange two assignments. Arrow keys move the selected start.",
    "ko": "t = 0에서 조각을 드래그해 출발점을 이동한다. 도착점 선택은 두 연결을 교환한다. 방향키로도 선택한 출발점을 이동할 수 있다."
  },
  "plan-identity": {
    "en": "The image identifies a piece; the equations move its center. Exchanging assignments preserves the set of destination locations, not the completed photograph.",
    "ko": "사진은 조각의 정체성을 표시하고, 수식은 그 중심을 이동시킨다. 연결 교환이 유지하는 것은 도착 위치의 집합이며, 완성된 사진의 배열은 아니다."
  },
  "model-title": {
    "en": "The smooth probability model behind the pieces",
    "ko": "조각 뒤의 연속 확률모형"
  },
  "model-copy": {
    "en": "To obtain a smooth field, each center carries a Gaussian component of fixed width τ = 0.16. For a component i, the same offset Z is carried from Aᵢ to Bπ(i). The puzzle outlines are identity markers, not probability contours.",
    "ko": "매끄러운 속도장을 위해 각 중심에 고정 폭 τ = 0.16인 가우시안 성분을 둔다. 성분 i에서는 같은 오프셋 Z를 Aᵢ에서 Bπ(i)까지 운반한다. 직소 조각의 외곽선은 정체성 표시이며 확률 등고선이 아니다."
  },
  "model-endpoints": {
    "en": "Changing the permutation π leaves p₀ and p₁ unchanged. Dragging a starting center changes p₀. The time convention throughout is source at t = 0, destination at t = 1.",
    "ko": "순열 π를 바꿔도 p₀와 p₁은 유지된다. 출발 중심을 드래그하면 p₀가 바뀐다. 전체 시간 방향은 t = 0의 출발 분포에서 t = 1의 도착 분포로 통일한다."
  },
  "coupling-title": {
    "en": "Design a route for each piece",
    "ko": "조각마다 이동 계획을 만든다"
  },
  "velocity-intro": {
    "en": "The field receives (x,t), not the hidden component identity I. Near one location, several components can contribute different velocities. Their posterior-weighted average is the velocity available to the field.",
    "ko": "속도장은 숨겨진 성분 I 대신 (x,t)를 입력받는다. 한 위치에 여러 성분이 기여하면 서로 다른 속도가 가능하다. 속도장이 사용하는 방향은 사후확률로 가중한 평균이다."
  },
  "time-field": {
    "en": "Time t",
    "ko": "시간 t"
  },
  "probe-label": {
    "en": "Probe location",
    "ko": "관측 위치"
  },
  "probe-button": {
    "en": "Probe the tracked route",
    "ko": "선택한 경로의 현재 위치"
  },
  "field-hint": {
    "en": "Click anywhere to probe the field. Thin arrows: local field. Colored arrows: rᵢuᵢ for the three highest-weight components. Dark arrow: the sum over all twelve. All arrows use the same length scale.",
    "ko": "화면을 클릭해 속도장을 조사한다. 가는 화살표는 속도장, 색 화살표는 가중치가 큰 세 성분의 rᵢuᵢ, 진한 화살표는 12개 전체의 합이다. 모든 화살표는 같은 길이 배율을 사용한다."
  },
  "loss-intro": {
    "en": "Training can use the individual velocity U, which is known for every sampled pair. The model still learns the conditional mean because the squared-error objective splits into a learnable term and a constant.",
    "ko": "학습에는 각 쌍에서 계산 가능한 개별 속도 U를 사용할 수 있다. 제곱오차 목적함수는 학습 가능한 항과 상수항으로 분해되므로, 모델은 조건부 평균 속도를 학습한다."
  },
  "loss-proof-title": {
    "en": "Why the cross term vanishes",
    "ko": "교차항이 사라지는 이유"
  },
  "loss-proof": {
    "en": "Expand vθ − U = (vθ − v*) + (v* − U), then condition on (Xₜ,t). The residual has conditional mean zero. The equality holds for any predictor; attaining v* additionally requires sufficient model capacity and optimization. Here v* is evaluated analytically. Expectations average over t ∼ Uniform[0,1] and the sampled component and offset.",
    "ko": "vθ − U = (vθ − v*) + (v* − U)를 전개한 뒤 (Xₜ,t)에 조건을 건다. 잔차의 조건부 평균이 0이므로 교차항이 사라진다. 이 등식은 임의의 예측기에 성립하며, v*를 실제 학습하려면 모델 용량과 최적화 조건이 추가로 필요하다. 여기서는 v*를 해석적으로 계산한다. 기대값은 t ∼ Uniform[0,1]과 표본 성분·오프셋에 대해 계산한다."
  },
  "velocity-title": {
    "en": "Merge the plans into one velocity field",
    "ko": "이동 계획을 하나의 속도장으로 합친다"
  },
  "transport-intro": {
    "en": "Now follow dx/dt = v*(x,t) from the selected starting center. The field re-evaluates the direction along the trajectory. It has no access to the original assignment, so its path need not follow the planned line.",
    "ko": "이제 선택한 출발 중심에서 dx/dt = v*(x,t)를 따른다. 속도장은 이동 중 현재 위치에서 방향을 다시 계산한다. 원래 연결 정보를 입력받지 않으므로, 경로가 지정한 직선과 같을 필요는 없다."
  },
  "piece-transport": {
    "en": "Tracked piece",
    "ko": "추적할 조각"
  },
  "time-transport": {
    "en": "Time t",
    "ko": "시간 t"
  },
  "legend-plan": {
    "en": "Dashed · assigned straight path",
    "ko": "점선 · 지정한 직선 경로"
  },
  "legend-flow": {
    "en": "Solid · marginal ODE path",
    "ko": "실선 · 평균 속도장의 ODE 경로"
  },
  "density-hint": {
    "en": "Background tint: exact pₜ. Small dots: 96 fixed samples transported by the ODE. The photo piece tracks one center; its identity is a passive label. Finite samples only approximate the density.",
    "ko": "배경 농도는 정확한 pₜ, 작은 점은 ODE로 이동한 고정 표본 96개이다. 사진 조각은 중심 하나를 추적하며, 정체성은 수동적인 표식이다. 유한 표본은 분포를 근사한다."
  },
  "continuity-intro": {
    "en": "The agreement is at the level of distributions. Each translated component satisfies a continuity equation. Summing them shows that the posterior-weighted velocity transports their mixture.",
    "ko": "일치하는 것은 분포이다. 평행이동하는 각 성분은 연속방정식을 만족한다. 이를 합하면 사후확률로 가중한 속도장이 혼합분포를 운반한다는 결과를 얻는다."
  },
  "identity-note": {
    "en": "With the matching initial law and a well-posed ODE, the flow reproduces pₜ. This statement does not preserve component identities. Reaching the destination distribution therefore does not guarantee that each photo piece occupies its assigned slot.",
    "ko": "같은 초기분포와 적절한 ODE의 존재·유일성 조건에서 흐름은 pₜ를 재현한다. 이 명제는 성분의 정체성을 보존한다는 뜻이 아니다. 도착 분포에 도달해도 각 사진 조각이 지정한 칸에 들어간다고 보장되지는 않는다."
  },
  "transport-title": {
    "en": "Follow the field, not the assignment",
    "ko": "속도장이 만드는 실제 경로를 따른다"
  },
  "solver-intro": {
    "en": "The exact velocity is now fixed. Only the numerical integration changes. Compare Euler and Heun with the same number of field evaluations; Heun uses two evaluations per step. The reference is a finer RK4 solve.",
    "ko": "이제 정확한 속도장은 고정하고 수치 적분만 바꾼다. 같은 속도장 평가 횟수에서 Euler와 Heun을 비교한다. Heun은 한 단계에 두 번 평가한다. 기준 경로는 더 세밀한 RK4 계산이다."
  },
  "piece-solver": {
    "en": "Tracked piece",
    "ko": "추적할 조각"
  },
  "budget-label": {
    "en": "Field evaluations per method",
    "ko": "방법별 속도장 평가 횟수"
  },
  "legend-reference": {
    "en": "Dashed · RK4 reference",
    "ko": "점선 · RK4 기준 경로"
  },
  "reference-check-label": {
    "en": "Reference refinement Δ",
    "ko": "기준 계산 세분화 차이"
  },
  "solver-metric": {
    "en": "Errors are endpoint distances from RK4 with 2,048 steps. Reference refinement compares 1,024 and 2,048 steps; it is a consistency check, not a certified bound. Curves are drawn in the same coordinates without magnifying differences.",
    "ko": "오차는 2,048단계 RK4와의 끝점 거리이다. 기준 계산의 세분화 차이는 1,024단계와 2,048단계를 비교한 값이며 엄밀한 오차 상한은 아니다. 경로는 차이를 확대하지 않고 같은 좌표에 표시한다."
  },
  "solver-end": {
    "en": "Changing the coupling changes the field and its trajectories. Changing the solver changes how that same field is approximated. A missed assigned slot and a numerical integration error are different quantities; only the latter is measured here.",
    "ko": "결합을 바꾸면 속도장과 경로가 달라진다. 수치해법을 바꾸면 같은 속도장의 근사 방식이 달라진다. 지정한 칸과의 거리와 수치 적분 오차는 다른 양이며, 이 실험은 후자를 측정한다."
  },
  "solver-title": {
    "en": "Compute the path with a finite budget",
    "ko": "유한한 계산으로 경로를 구한다"
  },
  "notes-title": {
    "en": "Model & sources",
    "ko": "모형과 출처"
  },
  "scope": {
    "en": "The four views share one coupling, selected piece, and clock. Twelve equally weighted components use τ = 0.16 throughout. Velocities and densities are analytic; trajectories are numerical. No network is trained. The simulation transports coordinates, not image pixels or physical interlocking pieces. The 96 transported samples use 512-step RK4; tracked center paths use 2,048 steps.",
    "ko": "네 화면은 하나의 결합, 선택 조각, 시간을 공유한다. 동일 가중치 성분 12개와 고정 폭 τ = 0.16을 사용한다. 속도장과 밀도는 해석적으로, 궤적은 수치적으로 계산한다. 신경망 학습 없이 좌표를 운반하며, 이미지 픽셀이나 물리적으로 맞물리는 조각을 시뮬레이션하지 않는다. 표본 96개의 이동은 512단계 RK4, 추적 중심의 경로는 2,048단계 RK4로 계산한다."
  },
  "sources": {
    "en": "Course: Lecture 4, slides 39–48 (couplings, conditional velocity, objective equivalence); Lecture 3 (continuity and probability flow); differential-equations appendix (numerical integration). The translated-mixture puzzle is an analytic example constructed for this project.",
    "ko": "강의: Lecture 4의 39–48쪽(결합, 조건부 속도, 목적함수 동치), Lecture 3(연속방정식과 probability flow), 미분방정식 부록(수치 적분). 평행이동 혼합분포 퍼즐은 이 프로젝트를 위해 구성한 해석적 예제이다."
  },
  "photo-note": {
    "en": "center-cropped; adaptation under the same license",
    "ko": "중앙 크롭 · 사진 변형물에 동일 라이선스 적용"
  },
  "research-scope": {
    "en": "A coupling determines conditional paths; conditional expectation turns those paths into a marginal velocity; the continuity equation identifies the transported law; a numerical solver approximates the resulting trajectories. The same twelve-component model makes each link explicit.",
    "ko": "결합은 조건부 경로를 정하고, 조건부 평균은 이를 전체 속도장으로 바꾼다. 연속방정식은 운반되는 분포를 설명하고, 수치해법은 그 궤적을 근사한다. 동일한 12성분 모형에서 이 연결을 단계별로 확인한다."
  },
  "minimum-pairing": {
    "en": "Use minimum-cost pairing",
    "ko": "최소 비용 연결 적용"
  },
  "current-cost": {
    "en": "Current assignment cost",
    "ko": "현재 연결 비용"
  },
  "minimum-cost": {
    "en": "Minimum permutation cost",
    "ko": "순열 중 최소 비용"
  },
  "cost-gap": {
    "en": "Cost above minimum",
    "ko": "최소값과의 차이"
  },
  "coupling-measure": {
    "en": "More precisely, the coupling is the joint law of (Aᵢ + τZ, Bπ(i) + τZ), averaged over i. Keeping the offset shared makes every component translate without changing its width. It also gives a closed-form velocity target for every sampled pair.",
    "ko": "정확히는 각 i에 대한 (Aᵢ + τZ, Bπ(i) + τZ)의 결합분포를 평균한 모형이다. 같은 오프셋을 공유하므로 각 성분은 폭을 유지하며 평행이동한다. 표본 쌍마다 속도 목표값도 직접 계산할 수 있다."
  },
  "cost-title": {
    "en": "What changing the coupling actually changes",
    "ko": "연결을 바꿀 때 달라지는 것"
  },
  "cost-explain": {
    "en": "The comparison button minimizes this quadratic cost over all permutations of the twelve destinations. It changes the assignment while retaining the current source centers. The objective is the mean squared speed of the conditional paths; it is not the kinetic energy of the marginal ODE. Those quantities differ whenever conditional directions disagree.",
    "ko": "비교 버튼은 도착점 12개의 모든 순열 중 이 제곱 비용을 최소화한다. 현재 출발 중심은 유지하고 연결만 바꾼다. 이 목적함수는 조건부 경로의 평균 제곱 속도이다. 조건부 방향들이 서로 다르면, 평균 속도장의 ODE가 갖는 운동에너지와는 차이가 생긴다."
  },
  "cost-observe": {
    "en": "Compare the original pairing with the minimum-cost pairing at t ≈ 0.5. Inspect how the intermediate density and local directions change. Lower assignment cost alone does not guarantee lower error for every finite-budget solver.",
    "ko": "t ≈ 0.5에서 원래 연결과 최소 비용 연결을 비교하면 중간 분포와 국소 방향의 변화가 드러난다. 연결 비용이 낮다는 사실만으로 모든 유한 계산량의 수치 오차가 작아진다고 보장되지는 않는다."
  },
  "field-mode": {
    "en": "Canvas interaction",
    "ko": "화면 조작"
  },
  "prediction-label": {
    "en": "Candidate velocity f",
    "ko": "후보 속도 f"
  },
  "use-mean": {
    "en": "Set f to the conditional mean",
    "ko": "f를 조건부 평균으로 설정"
  },
  "prediction-hint": {
    "en": "In “Edit prediction” mode, drag to set the purple candidate vector from the probe. Arrow keys adjust it. The vector is limited to ±2.5 per coordinate. The candidate changes the regression error; it does not replace the exact field used by the transport experiment.",
    "ko": "“후보 속도 수정” 모드에서 드래그하면 관측 위치에서 시작하는 보라색 후보 벡터를 정한다. 방향키로도 조절할 수 있다. 각 좌표는 ±2.5로 제한된다. 후보는 회귀 오차를 바꾸며, 이동 실험에 사용하는 정확한 속도장을 대체하지 않는다."
  },
  "risk-total": {
    "en": "Conditional MSE",
    "ko": "조건부 MSE"
  },
  "risk-excess": {
    "en": "Excess error ‖f − v*‖²",
    "ko": "초과 오차 ‖f − v*‖²"
  },
  "risk-variance": {
    "en": "Velocity variance C(x,t)",
    "ko": "속도 분산 C(x,t)"
  },
  "risk-explain": {
    "en": "At a fixed probe, the first term is controllable by the candidate f. The second is the conditional variance of the hidden velocity target. Setting f = v* removes the excess error but leaves C(x,t). A nonzero training loss can therefore coexist with the correct marginal velocity.",
    "ko": "관측 위치를 고정하면 첫 항은 후보 f로 조절할 수 있다. 둘째 항은 숨겨진 속도 목표값의 조건부 분산이다. f = v*로 두면 초과 오차는 사라지지만 C(x,t)는 남는다. 따라서 학습 손실이 0이 아니어도 전체 속도장은 정확할 수 있다."
  },
  "energy-title": {
    "en": "Direction cancellation connects the loss to the coupling",
    "ko": "방향 상쇄가 손실과 연결 비용을 잇는다"
  },
  "energy-copy": {
    "en": "The identity follows from the same orthogonal decomposition, now with f = 0. Opposing conditional velocities can have large individual magnitudes and a small average. The conditional variance measures the lost squared magnitude. The global identity holds at each fixed t in this translation model because the distribution of U is time-independent.",
    "ko": "같은 직교 분해에 f = 0을 대입하면 얻는 등식이다. 반대 방향의 조건부 속도들은 각각 크더라도 평균은 작을 수 있다. 사라진 제곱 크기는 조건부 분산에 해당한다. 이 평행이동 모형에서는 U의 분포가 시간에 무관하므로, 전체 기대값의 등식은 고정된 각 t에서 성립한다."
  },
  "energy-observe": {
    "en": "Change a pairing, return to the same probe and time, and compare the variance. The cost K(π) describes the entire coupling; C(x,t) describes one local ambiguity. Neither should be read as a standalone guarantee of sampler accuracy.",
    "ko": "연결을 바꾼 뒤 같은 위치와 시간에서 분산을 비교한다. K(π)는 전체 결합의 비용이고, C(x,t)는 한 위치에서의 불확실성이다. 어느 하나만으로 샘플러의 정확도가 보장되지는 않는다."
  },
  "mass-cut-label": {
    "en": "Vertical boundary c · probability on its left",
    "ko": "수직 경계 c · 왼쪽 영역의 확률"
  },
  "mass-model": {
    "en": "Model probability Pₜ(X₁ ≤ c)",
    "ko": "모형 확률 Pₜ(X₁ ≤ c)"
  },
  "mass-samples": {
    "en": "Transported sample fraction",
    "ko": "이동 표본의 비율"
  },
  "mass-rate": {
    "en": "Probability change dPₜ/dt",
    "ko": "확률 변화율 dPₜ/dt"
  },
  "mass-instruction": {
    "en": "Drag the dashed vertical boundary horizontally to measure the region. The sample fraction fluctuates around the model probability; 96 samples are a visual check, not a proof of equality. X₁ here denotes the first spatial coordinate, not the terminal time.",
    "ko": "수직 점선 경계를 좌우로 드래그해 영역을 측정한다. 표본 비율은 모형 확률 주변에서 달라지며, 표본 96개는 시각적 확인 수단으로 분포 일치의 증명은 아니다. 여기서 X₁은 최종 시간이 아니라 첫 번째 공간 좌표이다."
  },
  "continuity-proof": {
    "en": "Since uᵢ is constant in space and time, differentiating qᵢ,t(x) = qᵢ,0(x − tuᵢ) gives ∂ₜqᵢ,t = −uᵢ · ∇qᵢ,t. The divergence of uᵢ vanishes. Multiplying the posterior mean by pₜ cancels the normalization in rᵢ, leaving exactly the component probability fluxes.",
    "ko": "uᵢ는 공간과 시간에 대해 상수이다. qᵢ,t(x) = qᵢ,0(x − tuᵢ)를 미분하면 ∂ₜqᵢ,t = −uᵢ · ∇qᵢ,t를 얻고, uᵢ의 발산은 0이다. 사후 평균에 pₜ를 곱하면 rᵢ의 정규화 항이 소거되어 성분별 확률 유량의 합이 남는다."
  },
  "mass-title": {
    "en": "Conservation can be checked on a region",
    "ko": "영역의 확률로 보존 법칙을 확인한다"
  },
  "mass-proof": {
    "en": "Φ and φ are the standard-normal CDF and density. Integrating the continuity equation over the half-plane turns a change in its probability into flux across its boundary. Positive dPₜ/dt means net mass enters the left region; a fixed target density at t = 1 does not make this intermediate flux independent of the coupling.",
    "ko": "Φ와 φ는 표준정규분포의 누적분포함수와 밀도이다. 반평면에서 연속방정식을 적분하면 영역의 확률 변화가 경계를 지나는 유량으로 바뀐다. dPₜ/dt가 양수이면 왼쪽 영역으로 질량이 순유입된다. t = 1의 분포가 같아도 중간 유량은 결합에 따라 달라질 수 있다."
  },
  "joint-title": {
    "en": "Why an assigned path can cross while an ODE path cannot",
    "ko": "지정한 경로의 교차와 ODE의 유일성"
  },
  "joint-copy": {
    "en": "Different conditional components may occupy the same location at the same time while carrying different velocities. They retain their component identity. A well-posed marginal ODE assigns one velocity to each (x,t); uniqueness prevents distinct solutions from meeting at the same space-time point and then separating. Thus it transports the marginals without generally preserving the endpoint pairing. Paths may still cross geometrically at different times.",
    "ko": "서로 다른 조건부 성분은 같은 시각의 같은 위치에서 다른 속도를 가질 수 있다. 성분의 정체성을 유지하기 때문이다. 적절한 유일성 조건을 만족하는 전체 ODE는 (x,t)마다 하나의 속도를 정한다. 서로 다른 해가 같은 시공간 점에서 만난 뒤 다시 갈라지는 것은 유일성과 양립하지 않는다. 따라서 주변분포를 운반하면서도 원래 끝점 연결을 일반적으로 보존하지 않는다. 서로 다른 시각의 궤적은 기하학적으로 교차할 수 있다."
  },
  "solver-acceleration": {
    "en": "Along a trajectory, velocity changes both because time advances and because the particle enters a different part of the field. This material acceleration determines the first term missed by Euler.",
    "ko": "궤적을 따라 속도는 시간의 진행과 입자의 위치 이동 때문에 변한다. 이 물질 가속도는 Euler가 생략하는 첫 항을 결정한다."
  },
  "solver-order": {
    "en": "Euler retains only the first-order term. Heun averages the initial velocity and a predicted endpoint velocity, recovering the second-order term. Under sufficient smoothness, their global errors scale as O(h) and O(h²), respectively. The comparison below uses the same field throughout.",
    "ko": "Euler는 1차 항까지 사용한다. Heun은 시작 속도와 예측 끝점의 속도를 평균해 2차 항을 반영한다. 충분한 매끄러움 조건에서 전역 오차는 각각 O(h), O(h²)이다. 아래 비교에서는 같은 속도장을 사용한다."
  },
  "convergence-title": {
    "en": "Endpoint error across evaluation budgets",
    "ko": "평가 횟수에 따른 끝점 오차"
  },
  "convergence-note": {
    "en": "Observed order p = log₂(e(B/2)/e(B)) compares adjacent rows. As the step size becomes small, values may approach 1 for Euler and 2 for Heun. Non-asymptotic behavior, cancellation and reference precision can disturb this pattern.",
    "ko": "관측 차수 p = log₂(e(B/2)/e(B))는 인접한 행을 비교한다. 간격이 충분히 작아지면 Euler는 1, Heun은 2에 가까워질 수 있다. 아직 점근 구간이 아닌 경우, 오차 상쇄, 기준 계산의 정밀도는 이 패턴에 영향을 준다."
  },
  "solver-budget": {
    "en": "Equal steps would give Heun twice as many field evaluations. Equal NFE makes the computational comparison explicit, but the constants in the error estimates still depend on the field and the chosen trajectory. A lower assignment cost is not a proof that one method will win at a particular budget.",
    "ko": "단계 수를 같게 두면 Heun은 속도장을 두 배 더 평가한다. 같은 NFE 비교는 계산량을 명시하지만, 오차 추정의 상수는 속도장과 선택한 궤적에 여전히 의존한다. 연결 비용이 작다는 사실은 특정 계산량에서 어느 방법이 우세하다는 증명이 아니다."
  },
  "validation": {
    "en": "Checks cover: permutation invariance of p₀ and p₁; normalization of posterior weights; conditional loss and energy decompositions; finite-difference residuals of the continuity equation; half-plane probability flux; and Euler/Heun convergence. The minimum-cost assignment is exact over permutations of the twelve centers. Region probabilities use a normal-CDF approximation with absolute error below 10⁻⁷.",
    "ko": "검증 항목은 순열 변경에 대한 p₀·p₁ 불변성, 사후 가중치 정규화, 조건부 손실·에너지 분해, 연속방정식의 유한차분 잔차, 반평면 확률 유량, Euler·Heun 수렴이다. 최소 비용 연결은 중심 12개의 순열에 대해 정확히 계산한다. 영역 확률에는 절대 오차 10⁻⁷ 미만인 정규 누적분포함수 근사를 사용한다."
  }
};
let language=document.documentElement.lang==='ko'?'ko':'en';
function setLanguage(lang){language=lang==='ko'?'ko':'en';document.documentElement.lang=language;document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=prose[el.dataset.i18n][language];});document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===language)));document.querySelectorAll('canvas').forEach(el=>el.setAttribute('aria-label',language==='ko'?'퍼즐 이동 실험. 조각 선택은 인접한 선택 메뉴로도 가능하다.':'Puzzle transport experiment. The adjacent selector also selects pieces.'));window.dispatchEvent(new Event('diffusionlanguagechange'));}
document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>setLanguage(el.dataset.lang)));
window.DiffusionI18n={text:(en,ko)=>language==='ko'?ko:en,setLanguage,get language(){return language;}};setLanguage(language);
})();
