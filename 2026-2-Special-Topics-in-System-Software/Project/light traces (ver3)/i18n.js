const LightText = {
  "eyebrow": {
    "en": "PATHS · VELOCITIES · DISTRIBUTIONS",
    "ko": "경로 · 속도 · 분포"
  },
  "title": {
    "en": "One distribution. Different paths.",
    "ko": "같은 분포, 서로 다른 경로."
  },
  "intro": {
    "en": "Reverse SDE and probability flow ODE relate stochastic paths to deterministic transport. This experiment compares their time marginals, constructs the Gaussian Flow Matching velocity by conditional averaging, and measures the effects of score and integration errors.",
    "ko": "역방향 SDE와 Probability Flow ODE는 확률적 경로와 결정적 수송을 연결합니다. 이 실험은 두 과정의 시점별 주변분포를 비교하고, 조건부 평균으로 Gaussian Flow Matching 속도를 구성하며, score 근사와 수치 적분 오차의 영향을 분석합니다."
  },
  "r1": {
    "en": "Compare paths and density",
    "ko": "경로와 밀도 비교"
  },
  "r2": {
    "en": "Recover the mean direction",
    "ko": "평균 이동 방향 확인"
  },
  "r3": {
    "en": "Introduce a score error",
    "ko": "Score 오차의 영향"
  },
  "modelnote": {
    "en": "One analytic model throughout : a Gaussian source and a smooth three-cluster target. Light points represent samples, not physical photons. No neural network is trained.",
    "ko": "모든 장면은 하나의 해석적 모형을 사용합니다 : 가우시안 출발 분포와 세 군집의 매끄러운 목표 분포. 광점은 표본을 나타내며 실제 빛의 물리 모형은 아닙니다. 신경망은 학습하지 않습니다."
  },
  "h1": {
    "en": "A snapshot is not a trajectory",
    "ko": "순간 위치와 이동 궤적"
  },
  "lead1": {
    "en": "The reverse SDE and its probability flow ODE share time marginals under exact conditions. Their individual paths differ.",
    "ko": "정확한 조건에서 역방향 SDE와 Probability Flow ODE는 각 시점의 분포를 공유하지만, 개별 경로는 다릅니다."
  },
  "play": {
    "en": "Play",
    "ko": "재생"
  },
  "time": {
    "en": "Generation time",
    "ko": "생성 시간"
  },
  "resample": {
    "en": "New initial samples",
    "ko": "초기 표본 다시 뽑기"
  },
  "stochastic": {
    "en": "Stochastic",
    "ko": "확률적 이동"
  },
  "deterministic": {
    "en": "Deterministic",
    "ko": "결정적 이동"
  },
  "snapcaption": {
    "en": "Instant exposure : all 384 positions at the displayed time. Dashed outlines mark equal levels of the analytic density. Click a light in either view to track it.",
    "ko": "순간 촬영 : 표시된 시각의 광점 384개입니다. 점선은 해석적 밀도의 등고선입니다. 어느 화면에서든 광점을 클릭하면 해당 표본을 추적합니다."
  },
  "trailS": {
    "en": "Recorded path · SDE",
    "ko": "기록한 궤적 · SDE"
  },
  "trailO": {
    "en": "Recorded path · ODE",
    "ko": "기록한 궤적 · ODE"
  },
  "particle": {
    "en": "Tracked light",
    "ko": "추적할 광점"
  },
  "trailnote": {
    "en": "These trails accumulate past positions; they are not the current probability density. The two plots track the same starting sample.",
    "ko": "궤적은 과거 위치를 누적한 기록이며 현재의 확률밀도가 아닙니다. 두 그래프는 같은 출발 표본을 추적합니다."
  },
  "densitytitle": {
    "en": "What the snapshots have in common",
    "ko": "순간 사진의 공통점"
  },
  "projection": {
    "en": "Horizontal-coordinate density",
    "ko": "가로 좌표의 밀도"
  },
  "densitynote": {
    "en": "Sky blue : SDE · Red : ODE · Black dashed : analytic density. Bottom ticks locate the tracked light. Finite samples and integration leave discrepancies; marginal equality concerns exact continuous-time processes.",
    "ko": "하늘색 : SDE · 빨강 : ODE · 검정 점선 : 해석적 밀도. 아래 눈금은 추적 중인 광점의 위치입니다. 유한 표본·적분 오차가 남으며, 분포 일치는 정확한 연속 시간 과정에 관한 성질입니다."
  },
  "clocknote": {
    "en": "Equation clock s runs from data to noise; generation reads it backwards. The controls use t = 1 − s. The score coefficient changes together with the stochastic term.",
    "ko": "수식의 시간 s는 데이터에서 노이즈로 향하며 생성 시에는 거꾸로 읽습니다. 조작 시간은 t = 1 − s입니다. 확률항을 없앨 때 score의 계수도 함께 바뀝니다."
  },
  "h2": {
    "en": "From path tangents to a velocity field",
    "ko": "경로의 접선에서 평균 속도로"
  },
  "lead2": {
    "en": "Each endpoint pair determines a path and a tangent velocity. Conditioning on the current position and time, then averaging these tangents, defines the marginal velocity field.",
    "ko": "끝점 쌍마다 경로와 접선 속도가 정해집니다. 현재 위치와 시간을 조건으로 접선 속도를 평균하면 주변분포를 수송하는 속도장이 정의됩니다."
  },
  "probeX": {
    "en": "Observation x",
    "ko": "관측 위치 x"
  },
  "probeY": {
    "en": "Observation y",
    "ko": "관측 위치 y"
  },
  "geoTime": {
    "en": "Observation time",
    "ko": "관측 시간"
  },
  "geometrytitle": {
    "en": "Paths through the observation point",
    "ko": "관측점을 지나는 경로"
  },
  "velocitytitle": {
    "en": "The same velocity, two constructions",
    "ko": "같은 속도를 구하는 두 방식"
  },
  "geocaption": {
    "en": "The observation point sets the conditioning event. Path and arrow opacity encode posterior weights; the red tangent is their conditional mean.",
    "ko": "관측점은 조건부 분포의 기준 위치입니다. 경로와 화살표의 진하기는 사후 가중치에 대응하며, 빨간 접선은 조건부 평균입니다."
  },
  "velcaption": {
    "en": "Grey arrows : conditional velocities. Red : their weighted mean. Blue ring : the velocity computed from the score identity. Both use the same velocity scale.",
    "ko": "회색 화살표 : 조건부 속도. 빨강 : 가중 평균 속도. 하늘색 원 : score 관계식으로 계산한 속도. 두 결과는 같은 속도 척도를 사용합니다."
  },
  "bridgebody": {
    "en": "The linear term and score term sum to the conditional-mean velocity. With a Gaussian source, independent endpoints and a compatible schedule, this is the probability flow ODE written in generation time. Equal fields give equal ODE trajectories from the same initial point.",
    "ko": "선형항과 score 항을 더하면 조건부 평균 속도가 됩니다. 가우시안 출발점, 독립적인 끝점 추출, 호환되는 스케줄에서는 생성 시간으로 읽은 Probability Flow ODE와 같습니다. 같은 초기점에서 같은 속도장을 적분하면 같은 ODE 경로를 얻습니다."
  },
  "geometrylimit": {
    "en": "Averaging does not preserve each original endpoint pairing. Conditional paths and the mean-field ODE share marginals, not particle identities. Here the schedule is linear; only 0.05 ≤ t ≤ 0.95 is simulated to avoid singular endpoint coefficients.",
    "ko": "평균 속도는 원래 끝점 쌍을 개별적으로 보존하지 않습니다. 조건부 경로와 평균 ODE가 공유하는 것은 분포입니다. 선형 스케줄을 사용하며, 끝점 계수의 특이성을 피해 0.05 ≤ t ≤ 0.95만 계산합니다."
  },
  "h3": {
    "en": "Sampling with approximate scores",
    "ko": "근사 score를 사용한 샘플링"
  },
  "lead3": {
    "en": "A shared horizontal score bias perturbs both samplers. The integration grid controls discretization independently of this field perturbation.",
    "ko": "두 샘플러에 동일한 수평 score 편향을 적용합니다. 적분 격자는 이 장의 변화와 별도로 이산화 정도를 결정합니다."
  },
  "bias": {
    "en": "Score bias",
    "ko": "Score 편향"
  },
  "window": {
    "en": "Error interval",
    "ko": "오차 구간"
  },
  "steps": {
    "en": "Integration steps",
    "ko": "계산 스텝 수"
  },
  "reset": {
    "en": "Reset error",
    "ko": "오차 초기화"
  },
  "all": {
    "en": "Entire interval",
    "ko": "전체 구간"
  },
  "early": {
    "en": "Early · t < 0.5",
    "ko": "전반 · t < 0.5"
  },
  "late": {
    "en": "Late · t ≥ 0.5",
    "ko": "후반 · t ≥ 0.5"
  },
  "errorS": {
    "en": "Reverse SDE · current setting",
    "ko": "Reverse SDE · 현재 설정"
  },
  "errorO": {
    "en": "Probability Flow ODE · current setting",
    "ko": "Probability Flow ODE · 현재 설정"
  },
  "errorcaption": {
    "en": "Both rows share the displayed grid time and coordinate scale. Dashed contours show the analytic density. The time slider and graph cursor select the common snapshot; sections 1 and 2 retain the exact score.",
    "ko": "두 행은 격자 시각과 좌표 척도를 공유합니다. 점선은 해석적 밀도이며 시간 슬라이더와 그래프 커서는 공통 비교 시각을 나타냅니다. 앞의 두 장면은 정확한 score를 유지합니다."
  },
  "errortitle": {
    "en": "Distribution discrepancy over time",
    "ko": "시간에 따른 분포 차이"
  },
  "metric": {
    "en": "Horizontal empirical-CDF distance",
    "ko": "가로 좌표의 경험적 CDF 거리"
  },
  "errorlegend": {
    "en": "Solid : current setting · Faint dashed : exact-score, 1,024-step reference. Sky blue : SDE · Red : ODE. The cursor selects a snapshot time. This projected CDF distance measures the largest horizontal-coordinate CDF gap, not full 2D agreement.",
    "ko": "실선 : 현재 설정 · 옅은 점선 : 정확한 score, 1,024스텝 기준. 하늘색 : SDE · 빨강 : ODE. 커서는 비교할 순간 사진의 시각을 선택합니다. 지표는 가로 좌표 CDF의 최대 차이이며 전체 2차원 분포의 일치를 측정하지 않습니다."
  },
  "errorbody": {
    "en": "Both samplers share the initial samples. SDE step counts use sums of the same fine-grid Brownian increments. A nonzero gap can come from finite sampling, discretization or score error; stochasticity is not assumed to help in every setting.",
    "ko": "두 샘플러는 초기 표본을 공유합니다. SDE의 스텝 수를 바꿀 때도 같은 세밀한 격자의 브라운 증분을 합산해 사용합니다. 차이는 유한 표본, 이산화, score 오차에서 생길 수 있으며 확률항이 항상 유리하다고 가정하지 않습니다."
  },
  "takeaway": {
    "en": "Relations between the three experiments",
    "ko": "세 실험의 관계"
  },
  "summary": {
    "en": "SDE ↔ ODE : the same marginals, different paths. Gaussian FM ↔ the matching probability flow ODE : the same exact velocity. Approximate scores : neither equality is automatic.",
    "ko": "SDE ↔ ODE : 분포는 같고 경로는 다릅니다. Gaussian FM ↔ 대응 Probability Flow ODE : 정확한 속도가 같습니다. Score를 근사하면 이러한 관계는 자동으로 보장되지 않습니다."
  },
  "footer": {
    "en": "Analytic teaching experiment · Euler–Maruyama for SDE · Heun for ODE. The light-trace analogy records sample paths, not an optical simulation.",
    "ko": "해석적 교육용 실험 · SDE는 Euler–Maruyama, ODE는 Heun으로 계산합니다. 빛의 궤적은 표본 경로의 표현이며 광학 시뮬레이션은 아닙니다."
  },
  "notes": {
    "en": "Model & mathematical references",
    "ko": "모형과 수학적 근거"
  },
  "errorTime": {
    "en": "Comparison time · shared across views",
    "ko": "비교 시간 · 모든 장면에 연동"
  },
  "referenceRow": {
    "en": "Reference · exact score, 1,024 steps",
    "ko": "기준 · 정확한 score, 1,024스텝"
  },
  "settingRow": {
    "en": "Current setting · shared initial samples",
    "ko": "현재 설정 · 같은 초기 표본"
  },
  "updatesTitle": {
    "en": "The step count acts on these updates",
    "ko": "스텝 수가 바꾸는 수치 업데이트"
  },
  "stepsNote": {
    "en": "Changing the grid changes Δs and h in the numerical updates. It does not change the underlying continuous-time equation. The SDE update reads diffusion time backwards; Heun follows generation time.",
    "ko": "격자를 바꾸면 수치 업데이트의 Δs와 h가 달라집니다. 연속 시간 방정식 자체는 그대로입니다. SDE는 확산 시간을 거꾸로 읽고, Heun은 생성 시간을 따라 계산합니다."
  },
  "read1Title": {
    "en": "Score, drift and stochastic forcing",
    "ko": "Score·drift·확률항의 관계"
  },
  "read1Body": {
    "en": "The score is the spatial gradient of log density at a fixed time. It describes local relative density increase, not the direction to a particular target sample. In the reverse SDE, the drift and Brownian term jointly determine the evolving distribution. The probability flow ODE reproduces that distribution by changing the drift as well as removing the stochastic term; simply deleting noise from the SDE would give a different equation.",
    "ko": "Score는 한 시각에서 로그 밀도의 공간 기울기입니다. 국소적으로 상대 밀도가 증가하는 방향을 나타내며, 특정 목표 표본을 향하는 방향은 아닙니다. 역방향 SDE에서는 drift와 브라운 운동 항이 함께 분포의 변화를 결정합니다. Probability Flow ODE는 확률항을 없애는 동시에 drift를 바꾸어 같은 분포 변화를 재현합니다. SDE에서 잡음만 삭제한 식과는 다릅니다."
  },
  "read1Check": {
    "en": "The two histograms estimate a common distribution from finite samples. They need not coincide as point sets. Marginal alignment requires the exact score, a corresponding initial law and well-posed continuous-time dynamics; it does not imply equality of sample paths.",
    "ko": "두 히스토그램은 공통 분포의 유한 표본 추정치입니다. 점 집합 자체가 일치할 필요는 없습니다. 주변분포의 일치는 정확한 score, 대응하는 초기 분포, 잘 정의된 연속 시간 동역학을 전제로 하며 표본 경로의 일치를 뜻하지 않습니다."
  },
  "read2Title": {
    "en": "Conditional averaging and the regression target",
    "ko": "조건부 평균과 회귀 목표"
  },
  "read2Body": {
    "en": "An endpoint pair specifies both an interpolated position and its tangent velocity. Different pairs can be compatible with the same observed position and time, so position alone does not reveal a unique conditional tangent. The expectation averages these possibilities using their posterior probabilities given the observation. It is not an equal average over target clusters.",
    "ko": "끝점 쌍이 정해지면 보간 위치와 그 경로의 접선 속도가 정해집니다. 서로 다른 끝점 쌍이 같은 시각의 같은 관측 위치와 양립할 수 있으므로, 현재 위치만으로 개별 접선 속도가 하나로 정해지지는 않습니다. 조건부 기댓값은 관측 위치가 주어졌을 때 각 가능성의 사후확률로 속도를 평균합니다. 목표 군집을 동일한 비중으로 평균하는 연산이 아닙니다."
  },
  "read2Check": {
    "en": "The observation point determines the posterior weights and therefore the mean tangent. The red mean and sky-blue score-based ring coincide because they evaluate the same exact field. For squared-error Flow Matching, the conditional mean is the population regression target. The displayed result is analytic, without a fitted network.",
    "ko": "관측 위치에 따라 사후 가중치와 평균 접선이 달라집니다. 빨간 평균과 하늘색 score 기반 원은 같은 정확한 속도장을 계산하므로 겹칩니다. 제곱오차를 사용하는 Flow Matching에서 조건부 평균은 모집단 회귀의 목표입니다. 이 결과는 해석적 계산이며 신경망 학습 결과는 아닙니다."
  },
  "bridgeRead": {
    "en": "In the interpolation, a controls the Gaussian-source contribution and b the target-endpoint contribution; the dots denote time derivatives. The bridge equation rewrites the posterior average as a linear term plus a score correction. Its Gaussian-source and independence assumptions matter : it is not an identity for every possible coupling or interpolation.",
    "ko": "보간식의 a는 가우시안 출발점의 비중, b는 목표 끝점의 비중이며, 위의 점은 시간 미분입니다. 연결식은 사후 평균을 선형항과 score 보정항으로 다시 쓴 것입니다. 가우시안 출발점과 독립성 가정이 필요하므로, 임의의 결합이나 보간에 무조건 적용되는 항등식은 아닙니다."
  },
  "read3Title": {
    "en": "Score approximation and discretization",
    "ko": "Score 근사와 이산화"
  },
  "read3Body": {
    "en": "At zero bias, discrepancies remain due to finite sampling and numerical integration. A nonzero bias changes the score itself, so grid refinement alone cannot generally restore the exact dynamics. The same score perturbation enters the SDE and ODE with different coefficients and can produce different distribution errors.",
    "ko": "편향이 0이어도 유한 표본과 수치 적분에 따른 차이가 남습니다. 편향이 생기면 score 자체가 달라지므로 격자를 세분화하는 것만으로 정확한 동역학을 일반적으로 복구할 수 없습니다. 동일한 score 편향도 SDE와 ODE에 서로 다른 계수로 들어가며 분포 오차에 미치는 영향이 다를 수 있습니다."
  },
  "read3Check": {
    "en": "The CDF metric asks how much the fraction of samples to the left of a threshold differs from the analytic reference, taking the largest gap over thresholds. A small value only supports horizontal-coordinate agreement. The 1,024-step reference is also numerical and contains sampling variability; one seed does not establish that either sampler is universally more robust.",
    "ko": "CDF 지표는 각 기준 좌표의 왼쪽에 놓인 표본 비율이 해석적 기준과 얼마나 다른지 비교하고, 그중 가장 큰 차이를 취합니다. 작은 값은 가로 좌표의 일치만 뒷받침합니다. 1,024스텝 기준도 수치 계산이며 표본 변동이 남습니다. 하나의 난수 시드로 어느 샘플러가 항상 더 강건한지 결론 내릴 수는 없습니다."
  },
  "modelExplain": {
    "en": "The analytic model makes the reference distribution and score available at every time. This lets us test mathematical correspondences separately from neural-network training. A Gaussian source is interpolated toward a smooth three-component target; the displayed interval stops short of the singular endpoints. The point clouds, density plots and velocity construction all refer to this one family.",
    "ko": "해석적 모형을 사용하면 매 시각의 기준 분포와 score를 계산할 수 있습니다. 따라서 신경망 학습의 영향을 섞지 않고 수학적 대응 관계를 확인할 수 있습니다. 가우시안 출발 분포를 세 성분의 매끄러운 목표 분포로 보간하되, 계수가 특이해지는 끝점은 제외합니다. 점 구름·밀도 그래프·속도 구성은 모두 이 하나의 분포족을 다룹니다."
  },
  "question1": {
    "en": "Marginal distributions and path laws",
    "ko": "주변분포와 경로의 법칙"
  },
  "explain1": {
    "en": "A time marginal describes the position of a randomly chosen sample at one fixed time. A path law also includes dependence across times. The SDE and probability flow ODE can match the former while differing in the latter. Even starting from the same position, Brownian increments create a new source of randomness along the SDE route; the ODE route is fixed by its initial value and velocity field.",
    "ko": "시점별 주변분포는 한 시각을 고정했을 때 무작위 표본의 위치가 따르는 분포입니다. 경로의 법칙에는 서로 다른 시각의 위치 사이 의존성까지 포함됩니다. SDE와 Probability Flow ODE는 전자를 공유하면서 후자는 다를 수 있습니다. 같은 위치에서 출발해도 SDE에는 이동 중 브라운 증분이라는 추가 무작위성이 생기며, ODE의 경로는 초기값과 속도장으로 정해집니다."
  },
  "question2": {
    "en": "Probability transport under the mean field",
    "ko": "평균 속도장과 확률 수송"
  },
  "explain2": {
    "en": "Conditional averaging preserves the probability transport needed for the evolving marginal density. It does not assign each particle its original target endpoint. The grey arrows are representative compatible tangents, and their opacity encodes posterior weight. Integrating the red mean gives a new family of trajectories. The score identity computes that same mean field under the stated Gaussian assumptions, rather than recovering the endpoint labels.",
    "ko": "조건부 평균은 주변밀도를 변화시키는 데 필요한 확률 수송을 보존합니다. 각 입자에 원래의 목표 끝점을 다시 배정하는 것은 아닙니다. 회색 화살표는 관측과 양립하는 대표 접선들이고 진하기는 사후 가중치를 나타냅니다. 빨간 평균을 적분하면 새로운 경로들이 만들어집니다. Score 관계식은 명시한 가우시안 가정 아래 같은 평균 속도장을 계산하는 방식이며, 끝점의 개체 대응을 복원하는 방식은 아닙니다."
  },
  "question3": {
    "en": "Controlled sources of discrepancy",
    "ko": "오차 요인의 분리"
  },
  "explain3": {
    "en": "Score bias changes the sampler field; the time grid changes its numerical approximation. Initial samples and the underlying Brownian realization are shared across settings. Reference and perturbed rows use the same displayed time. Early and late bias isolate temporal sensitivity within this model, without establishing a universal ranking of stochastic and deterministic sampling.",
    "ko": "Score 편향은 샘플러의 장을, 시간 격자는 그 장의 수치 근사를 바꿉니다. 설정 사이에서 초기 표본과 바탕이 되는 브라운 운동 실현을 공유하며, 기준 행과 오차 적용 행은 같은 시각을 나타냅니다. 전반·후반 편향은 이 모형의 시간별 민감도를 분리하는 장치이며, 확률적·결정적 샘플링의 보편적 우열을 정하지는 않습니다."
  },
  "bonusTitle": {
    "en": "Bonus : parcel assignments and destination counts",
    "ko": "보너스 : 택배 배정과 구역별 물량"
  },
  "bonusIntro": {
    "en": "Twelve labeled parcels are assigned to three destination zones. Two assignments have the same zone counts but different parcel-to-zone correspondences.",
    "ko": "번호가 붙은 택배 12개를 세 구역에 배정한 예시입니다. 두 배정의 구역별 물량은 같지만, 각 택배가 향하는 구역은 다릅니다."
  },
  "planA": {
    "en": "Assignment A",
    "ko": "배정 A"
  },
  "planB": {
    "en": "Assignment B",
    "ko": "배정 B"
  },
  "parcelSelect": {
    "en": "Selected parcel",
    "ko": "선택한 택배"
  },
  "parcelRoutes": {
    "en": "Individual assignments",
    "ko": "개별 배정"
  },
  "parcelCounts": {
    "en": "Destination counts",
    "ko": "구역별 물량"
  },
  "parcelCaption": {
    "en": "Lines connect parcel identities to destination zones; they are assignment links, not simulated trajectories. Highlighted parcels retain their identity when the assignment changes.",
    "ko": "선은 택배와 구역의 배정 관계이며 실제 이동 궤적은 아닙니다. 강조된 택배의 번호는 배정을 바꿔도 유지됩니다."
  },
  "parcelMeaning": {
    "en": "A destination histogram contains counts, not identities. Here it remains four parcels per zone under both assignments.",
    "ko": "도착 구역의 히스토그램은 개체 번호가 아닌 물량을 나타냅니다. 두 배정 모두 구역당 4개로 동일합니다."
  },
  "parcelLimit": {
    "en": "This finite analogy concerns endpoint marginals only. It does not establish equality at intermediate times, nor represent an SDE, ODE or conditional-mean flow.",
    "ko": "이 유한 예시는 끝점 주변분포와 개체 대응의 차이만 나타냅니다. 중간 시각의 분포 일치나 SDE·ODE·조건부 평균 흐름을 모형화하지 않습니다."
  }
} ;
const lang=document.documentElement.lang==='ko'?'ko':'en';
const translate=key=>LightText[key]?.[lang]||key;
document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=translate(el.dataset.i18n));
document.querySelector('#language-'+lang).setAttribute('aria-current','page');
