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
    'hero-lead': '확산 샘플러의 오차는 어디서 오고, 샘플러의 어느 부분이 그 책임을 지는가?',
    'hero-body': '강의에서 역시간 SDE와 probability flow ODE는 세 조건 아래에서 정확하다고 증명되었다. 과정이 참 종단 분포 p<sub>T</sub>에서 출발하고, 참 score ∇ log p<sub>t</sub>를 쓰고, 연속 시간으로 돌아간다는 조건이다. 실제 샘플러는 이 중 어느 것도 만족하지 못한다. 가우시안 prior에서 출발하고, score 자리에 학습된 네트워크를 넣고, 유한한 수의 스텝을 밟는다. 강의 노트는 이 셋이 관여하는 근사의 전부라고 짚어 둔다. 그러면 슬라이드가 답하지 않는 질문이 하나 남는다. 각각은 얼마나 비싼가, 그리고 그 답은 SDE로 샘플링하느냐 ODE로 샘플링하느냐에 따라 달라지는가. 이 노트는 세 치환을 제외한 모든 것을 정확히 계산할 수 있을 만큼 작은 토이 문제에서 이 질문에 답한다. 그래서 치환을 하나씩 따로 켤 수 있고, 최종 분포에 미치는 영향을 짐작이 아니라 측정으로 말할 수 있다.',
    'route-1': '<small>01 · FORWARD</small><b>샘플러가 되돌려야 하는 것</b><span>봉우리 48개의 밀도가 열방정식으로 하나의 가우시안이 된다.</span>',
    'route-2': '<small>02 · REVERSE</small><b>정확한 두 가지 귀로</b><span>역 SDE와 probability flow ODE는 모든 주변분포를 공유하고 어떤 궤적도 공유하지 않는다.</span>',
    'route-3': '<small>03 · APPROXIMATE</small><b>Prior, score, 이산화</b><span>치환 하나씩을 정확한 실행 옆에 놓고 손상을 잰다.</span>',
    'hero-note': '토이 모델: p<sub>data</sub>는 8 × 6 격자에 놓인 폭 τ = 0.06의 가우시안 48개의 균등 혼합이고, forward 과정은 variance-exploding SDE dx = dw이다. 이 선택에서는 주변밀도, 그 score, 각 봉우리 주변의 확률 질량, prior에 대한 KL 발산이 모두 닫힌 형태나 수치적분으로 구해지므로, 네트워크를 학습하지 않고 계산할 수 있는 것을 추정하지도 않는다. 물리적 그림이 도움이 된다면 같은 설정을 빛의 세기가 p<sub>t</sub>인 광학 덫 배열로 읽을 수 있다. 그 해석과 한계는 끝에 적어 두었다.',

    'forward-title': 'Forward SDE와 그 주변분포',
    'forward-intro': '샘플러가 하는 모든 일은 forward 과정을 거꾸로 돌리려는 시도이므로, forward 과정이 무엇을 망가뜨리는지부터 정확히 해 두는 것이 좋다. 강의의 variance-exploding 사례인 dx = dw, 즉 f = 0, g = 1, σ²(t) = t를 쓴다. 드리프트가 아핀이므로 섭동 커널은 출발점을 중심으로 한 가우시안이고, 주변분포 p<sub>t</sub>는 그 커널을 데이터에 대해 평균해서 얻는다.',
    'kernel-source': '커널 계산: NCSN (variance exploding) · Score SDE 노트 PDF 18쪽 · 여기서 σ²(t) = t.',
    'forward-source': '주변밀도 · Score SDE 노트 PDF 21쪽 · 분산 τ²의 가우시안 혼합이면 이 적분은 분산 τ² + t의 같은 혼합이다. f = 0인 Fokker–Planck 방정식은 열방정식 ∂<sub>t</sub>p = ½ Δp (34, 51쪽).',
    'forward-p2': '우리 데이터에서는 이 적분을 손으로 할 수 있다. 가우시안과 가우시안의 합성곱은 가우시안이므로 p<sub>t</sub>는 모든 성분이 τ²에서 τ² + t로 넓어진 같은 48성분 혼합이다. 봉우리 사이 간격은 0.22이므로, 폭 √(τ² + t)가 그 절반에 가까워지는 t ≈ 0.01쯤부터 봉우리가 구분되지 않기 시작하고, t ≈ 0.05가 되면 밀도는 하나의 덩어리다. 그 뒤로 forward 과정이 하는 일은 넓은 가우시안을 더 넓게 만드는 것뿐이다. 강의의 신호대잡음비 SNR(t) = E(0→t)² / P(t)는 여기서 1 / t이고, x<sub>t</sub>에 x<sub>0</sub>의 정보가 얼마나 남아 있는지를 추적한다. 유한한 시간에는 결코 0이 되지 않는데, 이것이 세 가지 근사 중 첫 번째가 들어오는 자리다.',
    'forward-view': 'Forward SDE의 표본과 주변분포 p<sub>t</sub>',
    'forward-look': '<b>볼 것.</b> 점은 48개 봉우리에서 출발해 forward SDE를 따르는 입자 384개이고, 회색 등고선은 같은 시각의 정확한 p<sub>t</sub>, 오른쪽은 그 x 주변밀도다. 여덟 줄의 봉우리가 얼마나 빨리 하나의 언덕으로 무너지는지 보고, 슬라이더 위치와 봉우리 대비 수치를 견주어 보라.',
    'btn-again': '새 실현',
    'forward-arrows': 'score ∇ log p<sub>t</sub>',
    'forward-time': '시각 t',
    'm-variance': '성분 분산 τ² + t',
    'm-contrast': '봉우리 대비',
    'forward-left': '표본 384개 · 회색 등고선: p<sub>t</sub>',
    'forward-right': '닫힌 형태로 구한 p<sub>t</sub>의 x 주변밀도',
    'forward-legend': '슬라이더는 강조된 항 σ²(t) − σ²(0) = t를 움직인다. 슬라이더는 세제곱 눈금이라 흥미로운 구간인 t = 0 근처가 길이의 대부분을 차지한다. 봉우리 대비는 성분 중심과 이웃까지 중간점 사이의 밀도 비율을 t = 0에서 1이 되도록 정규화한 것이다. score 화살표는 작은 t에서는 가장 가까운 봉우리를, 큰 t에서는 구름 전체의 중심을 가리키는데, 강의 첫 슬라이드가 그림으로 보여 준 성격 변화가 바로 이것이다.',
    'forward-bridge': '<b>forward 과정은 쓰기는 쉽고 표본 하나하나를 되돌리기는 불가능하다.</b><span>되돌릴 수 있는 것은 주변분포의 가족이다. 다음 절은 강의가 그 목적으로 만든 두 과정을 보이고, 왜 둘이 분포에서는 일치하면서 경로에서는 어긋나는지를 보인다.</span>',

    'family-title': '역시간 SDE와 probability flow ODE는 주변분포를 공유한다',
    'family-intro': '강의는 두 생성 방정식을 같은 논증으로 보증했다. 후보 과정의 Fokker–Planck 방정식을 쓰고, forward 주변분포 p<sub>t</sub>가 그것을 푼다는 것을 확인한 다음, 유일성으로부터 후보가 모든 p<sub>t</sub>를 지난다고 결론짓는다. 역시간 SDE는 score 전체와 새 노이즈로 이 일을 하고, probability flow ODE는 score의 절반과 노이즈 없이 한다. 어느 쪽도 개별 궤적에 대해서는 아무 말도 하지 않으며, “matching marginals, not trajectories”라는 제목의 슬라이드가 그 구분을 못 박는다.',
    'reverse-source': '역시간 SDE · Score SDE 노트 PDF 63쪽.',
    'pfode-source': 'Probability flow ODE · Score SDE 노트 PDF 73쪽.',
    'family-p2': '둘은 별개의 발명이 아니라 한 직선의 양 끝이다. 어떤 η ≥ 0에 대해서도 아래 과정은 거꾸로 돌렸을 때 forward Fokker–Planck 방정식을 푼다. 드리프트에 더해진 ½ η² g²배의 score가 추가 노이즈가 더하는 항 ½ η² g² Δp를 정확히 만들어 내므로, 모든 η에서 둘이 상쇄된다. η = 1이면 역 SDE, η = 0이면 probability flow ODE이고, 그 사이와 1보다 큰 값도 똑같이 정당한 샘플러다. 어느 것을 쓸지는 수학이 아니라 설계의 문제인데, 3절에서 재료가 더 이상 정확하지 않게 되면 이 선택이 중요해진다는 것을 보게 된다.',
    'family-source': '하나의 주변분포 가족, 여러 과정 · Score SDE 노트 PDF 78쪽 · η = 1이 역시간 SDE, η = 0이 probability flow ODE.',
    'family-view': '입자 하나를 따라가고, 전체 분포를 비교한다.',
    'family-look': '<b>볼 것.</b> 두 패널은 정확한 p<sub>1</sub>에서 뽑은 같은 1024개 점에서 출발하고 정확한 score로 256 스텝을 밟으므로, 다른 것은 η뿐이다. 아래 히스토그램을 보라. 파란 계단과 빨간 계단이 모든 시각에서 점선의 해석적 밀도 위에 겹친다. 그다음 궤적을 보라. ODE의 궤적은 서로 교차하지 않는 매끄러운 곡선이고, SDE의 궤적은 들쭉날쭉하며, 추적 중인 입자는 두 패널에서 서로 다른 곳에 도착한다.',
    'btn-noise': '새 노이즈, 같은 출발점',
    'btn-starts': '새 초기 표본',
    'family-trails': '입자 40개의 궤적',
    'family-colors': '출발 각도로 색 입히기',
    'progress': '생성 진행',
    'family-count': '표본 수',
    'family-left': '역시간 SDE (η = 1)',
    'family-right': 'Probability flow ODE (η = 0)',
    'family-legend': '파랑: SDE · 빨강: ODE · 회색 등고선: 해석적 p<sub>t</sub> · 검은 점: 추적 입자의 출발점. 점을 클릭하면 같은 초기 입자를 두 패널에서 추적하고, 화살표 키로 다음 입자로 옮겨 간다. “출발 각도로 색 입히기”를 켜면 ODE 패널은 색의 순서를 유지하고 SDE 패널은 뒤섞는데, 전단사를 바깥에서 보면 이렇게 보인다.',
    'm-sde-ks': 'SDE: x 주변분포 KS 거리',
    'm-ode-ks': 'ODE: x 주변분포 KS 거리',
    'm-sep': '추적 입자의 거리',
    'family-note': 'Kolmogorov–Smirnov 거리는 경험적 x 주변분포를 현재 시각의 정확한 주변분포와 비교한다. p<sub>t</sub>에서 정확히 뽑은 1024개도 약 0.03이 나오므로 두 샘플러 모두 1024개 점으로 보일 수 있는 바닥에 있다. 추적 입자의 두 버전 사이 거리는 구름 전체의 폭과 같은 1 정도다. 두 사실이 강의의 진술을 숫자로 옮긴 것이다. 같은 주변분포, 무관한 궤적.',
    'family-bridge': '<b>위의 모든 것은 참 p<sub>1</sub>, 참 score, 촘촘한 격자를 썼다.</b><span>샘플러에는 그중 아무것도 없다. 강의 슬라이드 “from the oracle to the model”은 각각이 무엇으로 대체되는지 나열하고, 다음 절은 나머지 둘을 정확하게 둔 채 한 번에 하나씩 대체하여 손상의 책임을 가린다.</span>',

    'lab-title': 'Prior, score, 이산화: 치환을 한 번에 하나씩',
    'lab-intro': '샘플링은 p<sub>T</sub> 자리에 prior를 넣는다. p<sub>T</sub>는 데이터셋 전체에 대한 혼합이기 때문이다. ∇ log p<sub>t</sub> 자리에는 학습된 네트워크 s<sub>ϕ<sup>×</sup></sub>를 넣는다. 주변 score는 계산할 수 없기 때문이다. 연속 시간 자리에는 격자를 넣는다. 컴퓨터는 한 스텝씩 적분하기 때문이다. 강의는 이 대체가 들어간 두 생성 방정식을 쓰고 관여하는 근사가 이 셋뿐이라고 적는다. 그러니 표본이 틀렸다면 셋 중 하나의 책임이다. 아래 실험은 어느 것인지 가려내도록 만들었다.',
    'lab-source': 'From the oracle to the model · Score SDE 노트 PDF 86쪽 · “근사는 셋이고, 그것이 전부다.”',
    'em-source': '역시간 SDE의 Euler–Maruyama 스텝 · Score SDE 노트 PDF 87쪽 · probability flow ODE의 Euler 스텝은 노이즈를 빼고 score 항을 절반으로 한다. Heun은 스텝당 평가를 한 번 더 한다(부록 16쪽).',
    'kl-source': '잔여는 신호대잡음비; 커널에서 주변분포로 · Score SDE 노트 PDF 23, 26쪽 · 여기서 E ≡ 1, P(T) = T이므로 SNR(T) = 1 / T.',
    'lab-p2': '첫째와 셋째 치환은 샘플러가 하는 그대로 재현하기 쉽다. p<sub>T</sub> 대신 N(0, T I)에서 출발하고, 연속 시간 대신 Δt = T / N을 쓰면 된다. 둘째는 그렇지 않다. 토이에는 학습된 네트워크가 없고, 실제 네트워크의 오차는 우리가 써 내려갈 수 있는 것이 아니기 때문이다. 그래서 s<sub>ϕ<sup>×</sup></sub> − ∇ log p<sub>t</sub> 자리에 통제된 오차 둘을 넣는다. 평활화 δ ≥ 0은 정확한 score를 더 늦은 시각 t + δ에서 평가하는데, 가까운 입력들을 평균하는 회귀가 하는 일이 바로 이것이라 현실적인 쪽이고, 참 score가 가장 빨리 변하는 t = 0 근처에서 가장 세게 문다. 상수 편향 b는 어디서나 같은 벡터를 더한다. 가장 단순한 계통 오차이고, SDE와 ODE에 미치는 영향이 가장 크게 갈리는 오차다. 그러면 샘플러가 보는 것은 ∇ log p<sub>t+δ</sub>(x) + b다. 이 대체식은 강의가 아니라 이 페이지에서 정의한 것이고, 강의의 몫은 학습된 score가 애초에 회귀 추정치인 이유, 즉 denoising score matching(83–84쪽)이다.',
    'lab-view': '왼쪽은 정확한 실행, 오른쪽은 치환 하나',
    'lab-look': '<b>볼 것.</b> 두 패널은 같은 시드, 같은 η, 같은 표본 1024개를 쓴다. 왼쪽은 세 재료를 모두 정확하게 두고, 오른쪽은 탭에서 고른 하나를 켠다. 아래 히스토그램은 두 x 주변분포를 정확한 밀도 위에 겹치고, 세 숫자는 어떤 종류의 손상이 났는지 말한다. 질량이 엉뚱한 봉우리로 갔는지, 봉우리가 너무 넓어졌는지, 둘 다인지. 각 탭에는 전형적인 지문을 보여 주는 프리셋이 있다.',
    'tab-start': 'Prior', 'tab-start-sub': 'p<sub>T</sub> 대신 N(0, T I)',
    'tab-score': 'Score', 'tab-score-sub': '∇ log p<sub>t</sub> 대신 ∇ log p<sub>t+δ</sub> + b',
    'tab-grid': '이산화', 'tab-grid-sub': '연속 시간 대신 N 스텝',
    'lab-T': '종단 시간 T',
    'lab-start-law': '오른쪽 패널의 초기 분포',
    'opt-prior': 'N(0, T I), prior',
    'opt-exact': 'p_T (정확, 치환 없음)',
    'm-klbound': '상계 ½ SNR(T) E‖x₀‖²',
    'm-kl': 'KL(p<sub>T</sub> ‖ N(0, T I))',
    'pre-prior-short': '프리셋: T = 0.25, ODE',
    'pre-prior-short-sde': '프리셋: T = 0.25, SDE',
    'lab-bias': '상수 편향 b<sub>x</sub>',
    'lab-smooth': '평활화 δ',
    'lab-arrows': '표본 대신 t = 0.02에서 대체된 score를 그리기',
    'pre-bias': '프리셋: 편향 1.0',
    'pre-smooth': '프리셋: 평활화 0.03',
    'lab-nfe': 'score 평가 횟수 N',
    'lab-method': '적분기',
    'opt-auto': 'Euler–Maruyama (η > 0) / Heun (η = 0)',
    'opt-euler': 'Euler, η = 0',
    'opt-heun': 'Heun, η = 0',
    'm-step': '스텝 Δt = T / N',
    'm-nfe': '실제 평가 횟수',
    'pre-coarse-sde': '프리셋: 8 스텝, SDE',
    'pre-coarse-heun': '프리셋: 평가 16회, Heun',
    'lab-eta': '두 패널의 η (0 = probability flow ODE, 1 = 역 SDE)',
    'btn-noise2': '새 노이즈',
    'btn-reset': '초기화',
    'lab-left': '정확: p<sub>T</sub>, ∇ log p<sub>t</sub>, 평가 256회',
    'lab-right': '치환을 넣은 실행',
    'm-tv': '엉뚱한 봉우리의 질량 (48칸 전변동)',
    'm-spread': '봉우리 폭 / 정확값',
    'm-ks': 'x 주변분포 KS 거리',
    'lab-legend': '회색: 정확한 실행 · 파랑: 치환을 넣은 실행 · 점선: p<sub>0</sub>의 해석적 x 주변밀도. 각각 표본 1024개, 600개를 그린다. 첫 숫자는 48개 중심 각각에 가장 가까운 표본의 비율을 그 칸 안의 p₀의 정확한 질량과 비교한 것이고, 둘째는 가장 가까운 중심까지 거리의 제곱평균제곱근을 정확한 값에 대한 비율로 적은 것이다. 작은 회색 숫자는 왼쪽의 정확한 실행에서 잰 같은 양으로, 유한 표본 잡음을 공유하므로 가장 공정한 기준선이다.',
    'lab-point-start': '<b>Prior.</b> N(0, T I)에서 출발하는 것은 강의가 신호대잡음비로 묶은 KL 발산만큼 정확히 틀린 것이다. 토이에서 T = 1일 때 상계는 0.2 nats이고 참 발산은 0.02이므로 상계는 한 자릿수쯤 느슨하지만 T에 대한 의존성은 맞다. 그 초기 오차가 그 뒤에 어떻게 되는지는 η에 달렸다. ODE는 전단사라서 시각 T에 엉뚱한 곳에 있던 질량은 변형되지만 보존된 채 시각 0까지 운반되고, T = 0.25에서는 그중 약 5분의 1이 엉뚱한 봉우리에 떨어진다. SDE는 노이즈를 계속 넣고 score 전체로 되끌어 오므로 t = 0에 이를 즈음에는 어디서 출발했는지를 대부분 잊고, 같은 실험에서 오차가 절반이다.',
    'lab-point-score': '<b>Score.</b> 두 오차는 다른 지문을 남긴다. 상수 편향은 분포 전체를 옆으로 밀므로 질량이 한 봉우리에서 다음 봉우리로 넘어가 첫째 지표가 오르지만 각 봉우리의 폭은 그대로다. 평활화는 봉우리 질량은 건드리지 않고 모든 봉우리를 넓히는데, t = 0 근처에서 샘플러가 밀도를 실제보다 넓다고 듣기 때문이다. 놀랄 만한 결과도 하나 있다. 이 토이에서 SDE는 상수 편향에 ODE보다 덜 민감한 것이 아니라 <em>더</em> 민감하다. 이 가족은 score를, 따라서 편향도, (1 + η²)/2배 하는데 이 값은 η = 1에서 1이고 η = 0에서 ½이다. 추가 노이즈는 매 스텝 같은 방향을 가리키는 오차를 평균해 없앨 수 없다. 확률적 샘플링이 score 오차에 강건하다는 통념은 요동치는 오차에 관한 것이고, 편향은 그 반대 경우다.',
    'lab-point-grid': '<b>이산화.</b> score는 뻣뻣하다. ‖∇ log p<sub>t</sub>‖가 1 / (τ² + t)처럼 커지므로 균일 격자는 스텝 대부분을 아무 일도 없는 곳에 쓰고, 봉우리가 만들어지는 마지막 몇 스텝에는 너무 큰 스텝으로 도착한다. 평가 횟수가 적을 때는 ODE의 Euler가 세 방법 중 가장 정확하고, Heun은 차수가 높은데도 예측 단계가 좁은 봉우리를 지나쳐 가장 나쁘다. Heun은 평가 256회쯤부터 비로소 이득이 된다. Euler–Maruyama에는 마지막 스텝에서 √Δt ≪ τ라는 조건이 하나 더 붙는다. 그렇지 않으면 맨 끝에 주입하는 노이즈가 만들려는 봉우리보다 넓다.',
    'lab-bridge': '<b>치환은 셋, 손상의 종류는 둘.</b><span>prior와 편향된 score는 봉우리 사이에서 질량을 옮기고, 평활화된 score와 성긴 격자는 봉우리를 넓힌다. 다음 절은 각 노브를 범위 전체에 걸쳐 쓸어 비교를 정량화한다.</span>',

    'budget-title': '오차 예산',
    'budget-intro': '각 패널은 나머지 두 치환을 끈 채 노브 하나를 쓸어 보며, 가족의 양 끝인 Heun으로 적분한 probability flow ODE(η = 0, 파랑)와 Euler–Maruyama로 적분한 역 SDE(η = 1, 빨강)를 함께 그린다. T 쓸기는 스텝 수가 아니라 스텝 크기 Δt = 1/128을 고정하여, 긴 forward 시간이 성긴 격자와 혼동되지 않게 했다. 모든 점은 표본 2048개의 실행이고, 점선은 p₀에서 정확히 뽑은 2048개가 같은 지표에서 받는 값이다. 그 선 아래는 정보가 없다. 처음 표시되는 값은 같은 JavaScript를 node에서 실행해 만든 것이고, 버튼을 누르면 브라우저에서 20초쯤 걸려 다시 계산한다.',
    'budget-view': '노브 하나씩',
    'sw-T': 'Prior · T에 대한 엉뚱한 봉우리의 질량',
    'sw-T-note': 'ODE는 prior 불일치를 고스란히 물려받아 T가 커져야만 잃는다. SDE는 실행 중에 잊어버려 모든 T에서 바닥에 있다.',
    'sw-bias': 'Score 편향 · b<sub>x</sub>에 대한 엉뚱한 봉우리의 질량',
    'sw-bias-note': '두 샘플러 모두 편향에 선형이고, SDE가 (1 + η²)/2배만큼 더 가파르다. b<sub>x</sub> = 1에서 분포는 봉우리 간격 이상 밀려 있다.',
    'sw-smooth': 'Score 평활화 · δ에 대한 봉우리 폭',
    'sw-smooth-note': '폭은 δ와 함께 꾸준히 커지고 두 샘플러가 일치한다. 질량 지표(표시 안 함)는 δ ≈ 0.03까지 바닥에 머무르므로, 평활화는 봉우리 사이로 질량을 옮기지 않고 봉우리를 넓힌다.',
    'sw-nfe': '이산화 · 평가 횟수에 대한 봉우리 폭',
    'sw-nfe-note': 'Heun은 평가 32회 미만에서 가장 나쁘고 128 부근에서는 지나치게 수축하며 256부터 가장 좋다. Euler–Maruyama는 마지막 스텝에 √Δt ≪ τ가 필요해 위에서 천천히 정확한 폭에 접근한다.',
    'btn-recompute': '이 브라우저에서 다시 계산',
    'budget-note': '이 예산은 더해지지 않는다. 질량을 엉뚱한 봉우리로 옮겨 놓은 편향은 스텝을 더 밟아도 고쳐지지 않고, 끝에서 너무 성긴 격자는 forward 과정을 더 오래 돌려도 고쳐지지 않는다. 두 지표를 고른 이유도 이것이다. 첫째는 질량이 어디로 갔는지, 둘째는 얼마나 조밀하게 모였는지를 답하고, 세 치환은 그 선의 서로 다른 쪽에 놓인다.',

    'flow-title': 'Flow matching은 probability flow ODE다',
    'flow-intro': 'Flow-based 강의의 마지막 부분은 score를 한 번도 언급하지 않는 flow matching이 source가 가우시안이면 결국 score를 학습한다는 것을 보인다. 데이터 끝점을 조건으로 하면 보간은 가우시안이고 그 조건부 score는 닫힌 형태로 있으며, 조건부 속도는 그 score의 아핀 함수로 드러난다. 사후분포에 대해 평균하면 조건부 score는 주변 score가 되므로, 학습되는 장은 드리프트 더하기 ∇ log p<sub>t</sub>의 배수다. 보간에 맞는 스케줄 α<sub>s</sub> = b<sub>T−s</sub>, σ<sub>s</sub> = a<sub>T−s</sub>의 확산을 고르면 대응은 정확해진다. 열린 구간 (0, T)에서 flow matching ODE와 그 확산의 probability flow ODE는 분포가 같은 해를 가진다.',
    'flow-source': '주변 속도는 주변 score다 · Flow-based 노트 PDF 64쪽 · 열린 구간에서의 동일시 69, 74쪽.',
    'flow-p2': '이 노트의 질문에 대해 이것은 곧바로 한 가지를 뜻한다. flow matching 샘플러는 probability flow ODE 샘플러이므로 옷만 조금 다를 뿐 같은 세 치환을 한다.',
    'flow-point-1': '<b>Prior</b>는 더 이상 근사가 아니다. b₀ = 0이므로 보간은 t = 0에서 p<sub>prior</sub>에 정확히 도달하고 묶어야 할 불일치가 없다. 강의는 그 비용이 어디로 갔는지 보인다. 맞춘 확산의 계수가 그 끝점에서 발산하는데, 정칙 계수를 가진 어떤 확산도 유한 시간에 N(0, I)에 도달하지 못하기 때문이다.',
    'flow-point-2': '<b>Score</b> 오차는 속도 오차가 된다. Conditional flow matching은 ȧ<sub>t</sub>x₀ + ḃ<sub>t</sub>x<sub>T</sub>에 회귀하고, denoising score matching을 성립시킨 것과 같은 조건부 기대값 논증으로 그 최소점은 주변 속도다. 학습된 장은 우리의 편향과 평활화가 흉내 내는 방식으로 그 최소점을 놓친다.',
    'flow-point-3': '<b>이산화</b>는 그대로다. 강의의 가우시안 예제는 직선인 조건부 경로와 s<sub>t</sub>² = (1 − t)² + t²로 휜 주변 궤적을 가지므로, solver는 여전히 곡선을 따라가고 성긴 격자는 여기서 치른 값을 그대로 치른다.',
    'limits-title': '범위와 광학 덫 해석',
    'limits-body': '물리적 그림이 필요하다면 이 토이는 홀로그램 광학 덫 배열이다. 빛의 세기 p<sub>t</sub>, 유체 속 입자, 빛이 꺼져 있을 때의 Brownian 운동, 켜졌을 때의 복원력, δ는 초점이 흐린 빔, b는 옆으로 흐르는 유체. 이 해석은 변위에 선형인 기울기 힘을 내는 가우시안 빔 하나에서는 정확하고 배열에서는 느슨하다. 물리적 힘은 ∇I에 비례하지만 샘플러는 ∇ log p<sub>t</sub>를 따르기 때문이다. 스케줄 τ² + t는 수학적 선택이다. 편향과 평활화는 효과를 예측하고 확인할 수 있어서 학습된 네트워크의 알 수 없는 오차 대신 넣은 것이지 전형적이어서가 아니다. 시간 격자는 균일하다. 비균일 간격은 3절에서 본 뻣뻣함에 대한 표준 처방이지만 강의 범위 밖이다.',
    'scope-title': '모델과 출처',
    'scope-body': '토이: 가우시안 48개, τ = 0.06, 간격 0.22, forward dx = dw. p<sub>t</sub>, ∇ log p<sub>t</sub>, 칸 질량, x 주변분포는 닫힌 형태. KL은 140 × 140 수치적분. 샘플러: η > 0에는 Euler–Maruyama, η = 0에는 Euler 또는 Heun을 쓰는 η 가족이며 시드를 고정해 모든 실행을 재생할 수 있다. 테스트(node --test)는 score와 log p<sub>t</sub>의 유한차분, 열방정식, KL 상계, 칸 질량과 Monte Carlo, 가족의 주변분포 정렬을 검사한다. 강의 노트: <em>Diffusion Models의 수학적 원리</em>, 문태섭 교수, 2026년 가을 (Score SDE, Flow-based, 미분방정식 부록). Lai, Song, Kim, Mitsufuji, Ermon, <em>The Principles of Diffusion Models</em>, arXiv:2510.21890을 따른다. 광학 포획: A. Ashkin 외, Optics Letters 1986.',

    'btn-play': '재생', 'btn-pause': '일시정지',
    'lbl-floor': '정확한 실행',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-evals': '평가 횟수',
    'lbl-noise-time': '노이즈 시간 t =',
    'lbl-analytic': '점선: 해석적 x 주변밀도',
    'lbl-exact-run': '정확한 실행',
    'lbl-substituted': '치환을 넣은 실행',
    'lbl-x': 'x 좌표',
    'lbl-floor-line': '정확한 표본',
    'status-running': '계산 중…', 'status-done': '완료', 'status-pre': 'node에서 같은 코드로 미리 계산한 값',
  };
  const en = {
    'btn-play': 'Play', 'btn-pause': 'Pause',
    'lbl-floor': 'exact run',
    'lbl-eta0': 'η = 0 (Heun)', 'lbl-eta1': 'η = 1 (Euler–Maruyama)',
    'lbl-evals': 'score evaluations',
    'lbl-noise-time': 'Noise time t =',
    'lbl-analytic': 'Dashed: analytic x-density',
    'lbl-exact-run': 'exact run',
    'lbl-substituted': 'with the substitution',
    'lbl-x': 'x-coordinate',
    'lbl-floor-line': 'exact draws',
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
