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
    "en": "Freeze a moving light to see its position. Keep its trail to see how it arrived. Use these two views to connect diffusion sampling and Flow Matching.",
    "ko": "움직이는 빛을 순간 촬영하면 위치가, 궤적을 남기면 이동 과정이 보입니다. 두 관점으로 확산 샘플링과 Flow Matching의 관계를 살펴봅니다."
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
    "en": "Blue : SDE · Red : ODE · Black dashed : analytic density. Bottom ticks locate the tracked light. Finite samples and integration leave discrepancies; marginal equality concerns exact continuous-time processes.",
    "ko": "파랑 : SDE · 빨강 : ODE · 검정 점선 : 해석적 밀도. 아래 눈금은 추적 중인 광점의 위치입니다. 유한 표본·적분 오차가 남으며, 분포 일치는 정확한 연속 시간 과정에 관한 성질입니다."
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
    "en": "A geometric view of Flow Matching : each endpoint pair gives a path tangent; conditional averaging gives one velocity at each position and time.",
    "ko": "Flow Matching을 기하학적으로 봅니다. 끝점 쌍마다 경로의 접선이 정해지고, 조건부 평균은 각 위치와 시간에 하나의 속도를 부여합니다."
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
    "en": "Drag the observation point or use the position sliders. Thin paths and velocity arrows share posterior weights through opacity. The red tangent marks the conditional mean direction.",
    "ko": "관측점을 드래그하거나 위치 슬라이더를 조절할 수 있습니다. 경로와 속도 화살표의 진하기는 같은 사후 가중치에 대응합니다. 빨간 접선은 조건부 평균 방향입니다."
  },
  "velcaption": {
    "en": "Grey arrows : conditional velocities. Red : their weighted mean. Blue ring : the velocity computed from the score identity. Both use the same velocity scale.",
    "ko": "회색 화살표 : 조건부 속도. 빨강 : 가중 평균 속도. 파란 원 : score 관계식으로 계산한 속도. 두 결과는 같은 속도 척도를 사용합니다."
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
    "en": "When the score is no longer exact",
    "ko": "Score가 정확하지 않다면"
  },
  "lead3": {
    "en": "Introduce the same horizontal score bias into both samplers. Then refine the integration grid to separate sensitivity to score error from numerical effects.",
    "ko": "두 샘플러의 score에 같은 수평 방향 편향을 넣습니다. 계산 간격도 바꾸어 score 오차의 영향과 수치 계산의 영향을 살펴봅니다."
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
    "en": "Rows share the displayed grid time and coordinate scale. Change the time slider or drag the graph cursor to compare evolution. Dashed contours show the analytic density. Sections 1 and 2 keep the exact score.",
    "ko": "두 행은 표시된 격자 시각과 좌표 척도를 공유합니다. 시간 슬라이더나 그래프 커서를 움직여 변화 과정을 비교할 수 있습니다. 점선 등고선은 해석적 밀도이며, 앞의 두 장면은 정확한 score를 유지합니다."
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
    "en": "Solid : current setting · Faint dashed : exact-score, 1,024-step reference. Blue : SDE · Red : ODE. The cursor selects a snapshot time. This projected CDF distance measures the largest horizontal-coordinate CDF gap, not full 2D agreement.",
    "ko": "실선 : 현재 설정 · 옅은 점선 : 정확한 score, 1,024스텝 기준. 파랑 : SDE · 빨강 : ODE. 커서는 비교할 순간 사진의 시각을 선택합니다. 지표는 가로 좌표 CDF의 최대 차이이며 전체 2차원 분포의 일치를 측정하지 않습니다."
  },
  "errorbody": {
    "en": "Both samplers share the initial samples. SDE step counts use sums of the same fine-grid Brownian increments. A nonzero gap can come from finite sampling, discretization or score error; stochasticity is not assumed to help in every setting.",
    "ko": "두 샘플러는 초기 표본을 공유합니다. SDE의 스텝 수를 바꿀 때도 같은 세밀한 격자의 브라운 증분을 합산해 사용합니다. 차이는 유한 표본, 이산화, score 오차에서 생길 수 있으며 확률항이 항상 유리하다고 가정하지 않습니다."
  },
  "takeaway": {
    "en": "What stays the same?",
    "ko": "무엇이 같고, 무엇이 다른가?"
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
  }
} ;
const lang=document.documentElement.lang==='ko'?'ko':'en';
const translate=key=>LightText[key]?.[lang]||key;
document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=translate(el.dataset.i18n));
document.querySelector('#language-'+lang).setAttribute('aria-current','page');
