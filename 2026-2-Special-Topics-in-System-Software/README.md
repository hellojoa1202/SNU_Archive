# Diffusion Detective

확산으로 흐려진 원형 밀도 패턴을 Fourier 주파수 영역에서 복원하는 인터랙티브 퍼즐입니다. 열방정식, 역문제의 불안정성, 정규화, 유한 정밀도에서의 식별 가능성을 시각화합니다.

## 실행 및 배포

`dist/index.html`을 일반 브라우저로 열면 실행됩니다. 빌드·패키지 설치·로그인이 필요 없습니다. 외부 Google Fonts를 사용할 수 없는 환경에서는 시스템 글꼴로 표시됩니다. 앱의 계산과 조작에는 네트워크가 필요 없습니다.

배포 주소: https://hellojoa1202.github.io/SNU_Archive/2026-2-Special-Topics-in-System-Software/

저장소 루트의 `.github/workflows/pages.yml`이 main 브랜치 push 시 검증 후 자동 배포합니다. 이 과목 폴더의 `dist` 내용만 웹사이트에 게시하고 소스·테스트·README는 저장소에 보관합니다. 모든 자산은 상대 경로를 사용합니다.

## 사용법

1. 세 사건 중 하나를 선택합니다. 첫 사건은 식별 가능하고 두 번째와 세 번째는 주어진 오차 한계 아래 복수 후보가 가능합니다.
2. 시간 되감기, 최대 주파수, 복원 방법과 Tikhonov 강도를 조작합니다.
3. 후보 A/B/C 또는 '현재 단서로는 구분 불가'를 선택하고 판단을 확인합니다.
4. 더 이른 시점의 단서는 관측을 교체하여 후보를 식별 가능하게 만듭니다.
5. 자유 실험에서는 실제 원본을 보며 확산 시간·오차 한계·오차 실현을 바꿀 수 있습니다.
6. 수학 노트에서 수식과 관측 결과의 관계를 확인합니다.

## 수학적 배경

원의 좌표 θ∈[0,2π), 기준 측도 dθ/(2π)를 사용합니다. p(θ)=1+Σ[aₖcos(kθ)+bₖsin(kθ)]이며 k≤24인 유한 모델입니다. 이 밀도는 Lebesgue 측도 기준으로는 p/(2π)입니다.

D=1인 열방정식 ∂ₜp=∂²θp는 각 Fourier 계수를 hₖ=exp(−k²t)로 감쇠시킵니다. 후보들은 삼각부등식으로 양성이 보장되는 계수를 사용하며 평균 밀도는 1입니다. 관측은 각 실수 계수에 독립적인 균등 오차 η∈[−ε,ε]를 더합니다. 이는 forward diffusion의 Brownian randomness와 구별되는 측정 오차입니다. 평균 모드에는 오차를 넣지 않습니다. 관측과 복원은 양성 제약을 따로 강제하지 않으므로 음수가 나올 수 있습니다.

- 단순 역복원: ĉₖ=yₖ exp(k²τ), k≤K; 나머지는 0.
- Tikhonov: ĉₖ=hₖ yₖ/(hₖ²+λ), hₖ=exp(−k²τ), k≤K.
- τ=T일 때 원본을, τ<T일 때 중간 시점 밀도를 추정합니다.
- L² 오차: sqrt(Σ[(a−â)²+(b−b̂)²]/2), 기준 측도 dθ/(2π). 원본 공개 후에만 표시합니다.
- 양립성: 후보의 forward 계수와 관측 사이 모든 실수 계수별 잔차가 ε 이내인지 검사합니다. 통계적 신뢰구간이 아닌, 명시한 bounded-noise 모델의 결정론적 가능 집합입니다.
- 스펙트럼의 진폭 오차 한계는 실수·허수 각각 ε이므로 √2 ε입니다. 한계 아래라고 반드시 정보가 없다는 뜻은 아니며, 최종 판정은 후보별 전체 계수 잔차로 합니다.

## 주요 관찰과 해석

고주파는 빠르게 감쇠하며, 단순 역산 시 오차가 지수적으로 커집니다. 큰 역복원 이득은 가짜 요철이나 음수 밀도를 만들 수 있습니다. Cutoff와 Tikhonov는 오차 증폭과 편향을 교환합니다. 둘 이상의 원본이 오차 한계 아래 관측과 양립하면, 복원 알고리즘만으로 단일 원본을 식별할 수 없습니다. 더 이른 관측은 후보 구분을 돕습니다.

정확한 유한 Fourier 계수에 대한 열방정식은 역산 가능합니다. 이 데모가 보이는 한계는 유한 정밀도 아래의 불안정성입니다. 밀도 복원 문제와 score를 이용한 reverse-time SDE 샘플 생성은 별개의 문제입니다. 이 버전은 입자 SDE 샘플러를 구현하지 않으며 수학 노트에서 관계를 설명합니다. 원 위의 Brownian forward process는 dθ=√2dW이고 reverse 식은 감소하는 t에서 dθ=−2∂θlog(pₜ)dt+√2dW̄입니다.

## 구현 및 검증

- `dist/math.js`: 의존성 없는 순수 Fourier 계산 및 seeded noise.
- `dist/app.js`: SVG 시각화와 상호작용, 정답 판정.
- `dist/style.css`: 반응형 레이아웃 및 감소된 모션 환경 지원.
- `node --test tests/math.test.cjs`: 밀도 양성, 정확한 역산, heat semigroup, 사건별 식별 가능성, 힌트, 정규화, 질량 보존 검사.

후보 곡선은 알려진 가설이며 실제 생성 후보는 판단 후 공개합니다. 정답 생성, 판정, 그래프를 분리해 실제 원본을 사용하지 않고도 후보 양립성을 평가합니다. 학습된 신경망은 사용하지 않습니다.

## 참고

- 강의 Lecture 2: Score-Based Perspective.
- 강의 Lecture 3: Score SDE Framework, 특히 Fokker–Planck와 reverse-time SDE.
- Song et al., *Score-Based Generative Modeling through Stochastic Differential Equations*, ICLR 2021. https://arxiv.org/abs/2011.13456
- Evans, *Partial Differential Equations*, heat equation과 Fourier 해석 배경.
