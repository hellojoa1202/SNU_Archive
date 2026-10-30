/* Shared copy; experiments and controls are never replaced on language change. */
(function(){
'use strict';
const prose={
  "skip": {
    "en": "Skip to the puzzle",
    "ko": "퍼즐로 이동"
  },
  "nav-scatter": {
    "en": "Scatter",
    "ko": "흩뜨리기"
  },
  "nav-assemble": {
    "en": "Assemble",
    "ko": "다시 맞추기"
  },
  "nav-geometry": {
    "en": "Geometry",
    "ko": "조각의 연결"
  },
  "hero": {
    "en": "Piece by piece.",
    "ko": "한 조각씩, 다시."
  },
  "lead": {
    "en": "Scatter a picture. Let a score field bring it together.",
    "ko": "그림을 흩뜨리고, score를 따라 다시 맞춰보세요."
  },
  "hero-tag": {
    "en": "150 PIECES · ONE POSITION MODEL",
    "ko": "150개의 조각 · 하나의 위치 모델"
  },
  "scatter-title": {
    "en": "Take it apart.",
    "ko": "흩뜨려 보기."
  },
  "scatter-desc": {
    "en": "Time adds noise to each piece’s position. Drag a piece to change the starting configuration.",
    "ko": "시간이 흐르면 조각의 위치에 잡음이 더해져요. 조각을 직접 끌어 배치도 바꿀 수 있어요."
  },
  "drag-help": {
    "en": "Drag to move · arrows to nudge",
    "ko": "드래그로 이동 · 방향키로 미세 조절"
  },
  "reset": {
    "en": "Reset pieces",
    "ko": "배치 초기화"
  },
  "pieces": {
    "en": "Pieces",
    "ko": "조각 수"
  },
  "seed": {
    "en": "Noise seed",
    "ko": "잡음 시드"
  },
  "time": {
    "en": "Diffusion time",
    "ko": "확산 시간"
  },
  "intact": {
    "en": "Together",
    "ko": "맞춰진 배치"
  },
  "scattered": {
    "en": "Scattered",
    "ko": "흩어진 배치"
  },
  "scatter-play": {
    "en": "Play diffusion",
    "ko": "확산 재생"
  },
  "forward-caption": {
    "en": "Positions diffuse; the image stays fixed. Scrubbing t reuses ε to compare marginal distributions.",
    "ko": "이미지는 고정하고 위치만 확산해요. t를 움직일 때 ε를 고정해 주변분포의 변화를 비교해요."
  },
  "assemble-title": {
    "en": "Two ways back.",
    "ko": "다시 맞추는 두 경로."
  },
  "assemble-desc": {
    "en": "The same scattered start, the same score. One path is smooth; the other keeps sampling noise.",
    "ko": "같은 출발점, 같은 score. ODE는 매끄럽게 이동하고, SDE는 잡음을 더하며 이동해요."
  },
  "assemble-play": {
    "en": "Reassemble",
    "ko": "다시 맞추기"
  },
  "reverse-time": {
    "en": "Sampling progress",
    "ko": "샘플링 진행"
  },
  "solver": {
    "en": "Integrator",
    "ko": "적분 방법"
  },
  "steps": {
    "en": "Steps",
    "ko": "적분 횟수"
  },
  "solver-exact": {
    "en": "Exact Gaussian",
    "ko": "가우시안 정확 전이"
  },
  "solver-euler": {
    "en": "Euler / Euler–Maruyama",
    "ko": "Euler / Euler–Maruyama"
  },
  "tag-ode": {
    "en": "Deterministic",
    "ko": "결정론적"
  },
  "tag-sde": {
    "en": "Stochastic",
    "ko": "확률적"
  },
  "trace": {
    "en": "SELECTED PIECE · PATH",
    "ko": "선택한 조각 · 이동 경로"
  },
  "arrow-note": {
    "en": "Arrow on each puzzle = score direction",
    "ko": "퍼즐 위 화살표 = score 방향"
  },
  "marginal-note": {
    "en": "Exact score + an initial draw from p<sub>T</sub> give the same marginals in continuous time. Dragging pieces instead tests a chosen initial condition.",
    "ko": "정확한 score와 p<sub>T</sub> 표본에서 출발하면 연속 시간의 두 과정은 같은 주변분포를 가져요. 조각을 직접 움직이면 지정한 초기조건에서의 경로를 비교해요."
  },
  "step-note": {
    "en": "zₖ = uₖᵀ(x − μ), ξ ∼ 𝒩(0,1); v′ₖ is the next-step variance. Steps follow log variance. Both views share an auto-fitting camera.",
    "ko": "zₖ = uₖᵀ(x − μ), ξ ∼ 𝒩(0,1). v′ₖ는 다음 단계의 분산이에요. 시간 간격은 로그 분산을 따르고, 두 화면은 같은 자동 줌을 사용해요."
  },
  "geometry-title": {
    "en": "Pieces have neighbours.",
    "ko": "조각은 서로 연결돼 있어요."
  },
  "geometry-desc": {
    "en": "A grid graph connects adjacent pieces. Its eigenmodes separate collective motion from local misalignment.",
    "ko": "격자 그래프가 이웃 조각을 연결해요. 고유모드로 전체 이동과 국소적인 어긋남을 나눠 볼 수 있어요."
  },
  "mode": {
    "en": "Mode",
    "ko": "고유모드"
  },
  "deform": {
    "en": "Mode displacement",
    "ko": "모드 변위"
  },
  "mode-note": {
    "en": "This view isolates one eigenmode. The two samplers above use all modes.",
    "ko": "여기서는 한 고유모드만 펼쳐 보여줘요. 위의 두 샘플러는 모든 모드를 사용해요."
  },
  "coupling": {
    "en": "Neighbour coupling",
    "ko": "이웃 연결 강도"
  },
  "energy-note": {
    "en": "The first term anchors each piece. The second penalizes disagreements between neighbours. Increasing γ suppresses high-frequency deformation.",
    "ko": "첫 항은 조각을 기준 위치에 붙잡고, 두 번째 항은 이웃 간 변위 차이를 줄여요. γ가 커질수록 고주파 변형이 억제돼요."
  },
  "honesty": {
    "en": "A known layout μ and its grid graph define a Gaussian prior over 2N coordinates; the score is exact. This demonstrates position diffusion, rather than learning to solve an unknown image puzzle.",
    "ko": "완성 배치 μ와 격자 그래프로 2N개 좌표의 가우시안 사전분포를 정하고, 정확한 score를 계산해요. 미지의 그림을 학습해 푸는 대신 위치 확산의 원리를 살펴보는 모델이에요."
  },
  "no-snap": {
    "en": "Small gaps remain because the target covariance Σ₀ is nonzero. Pieces are never snapped into place.",
    "ko": "목표 공분산 Σ₀가 0이 아니어서 마지막에도 작은 틈이 남아요. 조각을 정답 위치에 강제로 끼워 넣지는 않아요."
  }
};
const query=new URLSearchParams(location.search).get('lang');
let language=query==='ko'||(query!=='en'&&/\/Korean(?:%20| )ver\//.test(location.pathname))?'ko':'en';
const aria={
 'forward-canvas':['Jigsaw pieces. Drag or select a piece; use arrow keys to move it.','퍼즐 조각. 조각을 드래그하거나 선택한 뒤 방향키로 이동할 수 있어요.'],
 'ode-canvas':['Probability flow ODE puzzle reconstruction','Probability flow ODE로 조립하는 퍼즐'],
 'sde-canvas':['Reverse SDE puzzle reconstruction','Reverse SDE로 조립하는 퍼즐'],
 'graph-canvas':['A graph eigenmode deforming the puzzle layout','그래프 고유모드에 따른 퍼즐 배치 변형'],
 'trajectory':['Selected piece paths: ODE and SDE','선택한 조각의 ODE와 SDE 이동 경로'],
 'spectrum':['Variance by graph eigenvalue','그래프 고유값에 따른 분산']
};
function apply(){
 for(const [id,labels] of Object.entries(aria))document.getElementById(id).setAttribute('aria-label',labels[language==='ko'?1:0]);
 document.documentElement.lang=language;
 document.title=language==='ko'?'Diffusion Detective · 한 조각씩, 다시':'Diffusion Detective · Piece by piece';
 document.querySelectorAll('[data-i18n]').forEach(el=>{const entry=prose[el.dataset.i18n];if(entry)el.innerHTML=entry[language];});
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===language)));
}
function setLanguage(next){
 if(!['en','ko'].includes(next)||next===language)return;
 language=next;const url=new URL(location.href);
 url.pathname=url.pathname.replace(/\/(English|Korean)(?:%20| )ver\/(?:index\.html)?$/,(next==='ko'?'/Korean%20ver/':'/English%20ver/')+(url.pathname.endsWith('/index.html')?'index.html':''));
 url.searchParams.delete('lang');if(location.protocol==='file:'){url.pathname=location.pathname;url.searchParams.set('lang',next);}
 history.replaceState(null,'',url);apply();window.dispatchEvent(new Event('diffusionlanguagechange'));
}
window.DiffusionI18n={get language(){return language;},text:(en,ko)=>language==='ko'?ko:en,setLanguage};
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
apply();
})();
