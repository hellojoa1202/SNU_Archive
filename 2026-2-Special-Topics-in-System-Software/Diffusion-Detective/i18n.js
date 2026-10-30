/* English is the submission default; Korean has its own Korean ver/ entry point.
   Both views use the same DOM, controls, equations, and numerical model. */
(function(){
  'use strict';
  const prose={
  "prose-00": {
    "en": "Following diffusion,<br><span>frequency by frequency.</span>",
    "ko": "주파수로 살펴보는<br><span>확산과 역과정.</span>"
  },
  "prose-01": {
    "en": "A blurred pattern still carries clues.<br>Follow them from <em>Fourier modes</em> to reverse-time sampling.",
    "ko": "흐려진 패턴에도 단서는 남아 있습니다.<br><em>Fourier 모드</em>에서 역확산 샘플링까지, 그 흔적을 따라갑니다."
  },
  "prose-02": {
    "en": "What does it take to run diffusion backward? A small distribution on a circle makes the question tangible: first in the <strong>spectrum</strong>, then through <strong>regularization and uncertainty</strong>, and finally through particles following an exact score field.",
    "ko": "확산을 거꾸로 돌리려면 어떤 정보가 필요할까요? 원 위의 작은 확률분포를 통해 <strong>주파수 성분</strong>의 변화와 <strong>정규화·불확실성</strong>을 살펴본 뒤, 정확한 score를 따라 움직이는 입자로 연결합니다."
  },
  "prose-03": {
    "en": "Start with a probability density wrapped around a circle, with 0 and 2π meeting at the same point. Brownian motion spreads its mass. The evolving density follows the <strong>heat equation</strong>.",
    "ko": "0과 2π가 연결되는 원 위에 확률밀도를 놓습니다. Brownian motion으로 입자가 움직이면 확률질량이 퍼집니다. 이때 밀도 변화는 <strong>열방정식</strong>을 따릅니다."
  },
  "prose-04": {
    "en": "Each Fourier mode is an eigenfunction of the heat operator: ∂²θ cos(kθ) = −k² cos(kθ). Its coefficient decays by <strong>hₖ(t) = exp(−k²t)</strong>. Doubling the frequency quadruples the decay rate. Throughout, D = 1 and densities are measured relative to dθ/(2π).",
    "ko": "Fourier 모드는 열 연산자의 고유함수입니다. ∂²θ cos(kθ) = −k² cos(kθ)이므로 각 계수는 <strong>hₖ(t) = exp(−k²t)</strong>만큼 줄어듭니다. 주파수가 두 배면 감쇠율은 네 배입니다. 확산계수는 D = 1, 밀도의 기준 측도는 dθ/(2π)로 둡니다."
  },
  "prose-05": {
    "en": "Shifting the pattern changes its phase. The decay rate stays the same: it depends only on frequency.",
    "ko": "패턴을 회전하면 위상은 바뀝니다. 감쇠율은 주파수에만 의존하므로 그대로입니다."
  },
  "prose-06": {
    "en": "Fine detail lives at high frequencies, where diffusion acts fastest. The large-scale shape persists longer.",
    "ko": "미세한 무늬를 담은 고주파 성분은 빠르게 약해집니다. 큰 윤곽을 담은 저주파 성분은 더 오래 남습니다."
  },
  "prose-07": {
    "en": "For an exact observation, division by hₖ recovers the original coefficient. Add a small measurement error ηₖ, and the same division <strong>amplifies the error along with the signal</strong>. Here cₖ stands for either a sine or a cosine coefficient.",
    "ko": "오차가 없는 관측은 hₖ로 나누어 원래 계수를 구할 수 있습니다. 작은 측정 오차 ηₖ가 섞이면 같은 연산이 <strong>신호와 오차를 함께 증폭</strong>합니다. 여기서 cₖ는 사인 또는 코사인 계수 하나를 뜻합니다."
  },
  "prose-08": {
    "en": "A hard cutoff removes high-frequency modes, taking both their noise and their signal out of the reconstruction.",
    "ko": "Cutoff보다 높은 주파수를 제외합니다. 해당 성분에 담긴 노이즈와 실제 신호가 함께 빠집니다."
  },
  "prose-09": {
    "en": "The solution to min Σₖ|hₖcₖ − yₖ|² + λΣₖ|cₖ|². A penalty on coefficient size softens the inverse gain. The mean stays fixed.",
    "ko": "min Σₖ|hₖcₖ − yₖ|² + λΣₖ|cₖ|²의 해입니다. 계수의 크기에 벌점을 주어 역산 이득을 완화합니다. 평균은 보존합니다."
  },
  "prose-10": {
    "en": "A filter trades fidelity for stability. With gain gₖ, the reconstruction error splits into <strong>bias</strong> from shrinking the signal and <strong>noise</strong> passed through the filter.",
    "ko": "필터를 강하게 적용하면 안정성을 얻는 대신 신호도 일부 줄어듭니다. 이득이 gₖ일 때 복원 오차는 신호를 줄이면서 생기는 <strong>편향</strong>과 필터를 통과한 <strong>노이즈</strong>로 나뉩니다."
  },
  "prose-11": {
    "en": "Each real coefficient receives independent Uniform[−ε, ε] noise, with variance ε²/3. Parseval’s identity turns coefficient errors into density error, giving an <strong>exact bias–variance decomposition</strong>.",
    "ko": "각 실수 계수에 독립적인 Uniform[−ε, ε] 오차를 더하며, 분산은 ε²/3입니다. Parseval 등식으로 계수 오차를 밀도 오차로 바꾸면 <strong>편향과 분산을 정확히 분해</strong>할 수 있습니다."
  },
  "prose-12": {
    "en": "Expected RMSE is √𝔼‖p̂ − p₀‖². The dashed curve uses this particular noise realization. Knowing the source lets us compare both in this toy model.",
    "ko": "기대 RMSE는 √𝔼‖p̂ − p₀‖²입니다. 점선은 현재 관측에 섞인 오차 한 번의 실현에 대한 값입니다. 이 toy 모델에서는 원본을 알기 때문에 두 값을 직접 비교할 수 있습니다."
  },
  "prose-13": {
    "en": "The source is hidden now. One of three candidates produced each observation through diffusion and bounded measurement error. Which candidates still fit the evidence? Each puzzle has its own observation, independent of the controls above.",
    "ko": "이번에는 원본을 숨깁니다. 세 후보 중 하나를 확산시키고 측정 오차를 더한 관측입니다. 어떤 후보가 단서와 맞을까요? 각 퍼즐의 관측은 위 실험의 조작값과 독립적입니다."
  },
  "prose-14": {
    "en": "A candidate fits when every coefficient residual is within ε. Multiple fits leave the source ambiguous <strong>under this candidate set and error bound</strong>. With exact coefficients, the finite Fourier model remains invertible; finite precision is what makes the distinction difficult.",
    "ko": "모든 계수의 잔차가 ε 이내인 후보가 관측과 양립합니다. 둘 이상이 맞는다면 <strong>이 후보 집합과 오차 한계 아래에서는</strong> 원본을 하나로 구분하기 어렵습니다. 정확한 계수를 안다면 유한 Fourier 모델은 역산 가능합니다. 여기서 구분을 어렵게 만드는 것은 유한 정밀도입니다."
  },
  "prose-15": {
    "en": "So far, the unknown was a density recovered from its measured coefficients. Score-based generation starts with samples instead. The <strong>score sₜ(θ) = ∂θ log pₜ(θ)</strong> guides particles through a prescribed family of densities. Here it follows directly from the Fourier expansion.",
    "ko": "지금까지는 관측한 계수에서 원본 밀도를 추정했습니다. Score 기반 생성에서는 샘플의 움직임을 다룹니다. <strong>Score sₜ(θ) = ∂θ log pₜ(θ)</strong>가 입자를 이끌어 시간별 밀도를 따라가게 합니다. 이 모델의 score는 Fourier 전개를 미분하여 직접 구합니다."
  },
  "prose-16": {
    "en": "Write reverse time as r = T − t. The reverse of forward Brownian motion dθ = √2 dWₜ and its probability flow ODE then become:",
    "ko": "역방향 시간을 r = T − t로 두면, forward Brownian motion dθ = √2 dWₜ의 역 SDE와 probability flow ODE는 다음과 같습니다."
  },
  "prose-17": {
    "en": "A score-driven drift and fresh Brownian noise shape each path.",
    "ko": "Score에 의한 drift와 새로 주입되는 Brownian noise가 경로를 만듭니다."
  },
  "prose-18": {
    "en": "Each starting point determines a path. The score coefficient is half that of the SDE.",
    "ko": "시작점이 정해지면 경로가 결정됩니다. Score의 계수는 SDE의 절반입니다."
  },
  "prose-19": {
    "en": "Both methods start with the same rejection samples from exact p<sub>T</sub>. This experiment uses the analytic score, independently of measurement noise ε above. Finite samples and integration steps introduce approximation error. Paths break at the circle’s 0/2π seam.",
    "ko": "두 방법은 정확한 p<sub>T</sub>에서 rejection sampling한 동일한 입자로 시작합니다. 위의 측정 오차 ε와 독립적으로, 해석적으로 구한 score를 사용합니다. 유한 표본과 적분 스텝에 따른 근사 오차가 남습니다. 원의 0/2π 경계에서는 궤적의 선을 끊어 표시합니다."
  },
  "prose-20": {
    "en": "The moment error Δ₆ compares empirical coefficients âₖ = (2/N)Σᵢcos(kΘᵢ) and b̂ₖ = (2/N)Σᵢsin(kΘᵢ) with the target’s first six modes. It avoids histogram binning, while measuring only those six modes.",
    "ko": "모멘트 오차 Δ₆는 경험적 계수 âₖ = (2/N)Σᵢcos(kΘᵢ), b̂ₖ = (2/N)Σᵢsin(kΘᵢ)를 목표 밀도의 첫 여섯 모드와 비교합니다. 히스토그램의 구간 선택에 의존하지 않지만, 이 여섯 모드에서의 차이만 측정합니다."
  },
  "prose-21": {
    "en": "Set qᵣ = p<sub>T−r</sub>. Since qᵣs<sub>T−r</sub> = ∂θqᵣ, the drift and diffusion terms combine into the same density evolution:",
    "ko": "qᵣ = p<sub>T−r</sub>로 두면 qᵣs<sub>T−r</sub> = ∂θqᵣ입니다. 이를 대입하면 두 과정의 밀도 변화가 같은 식으로 정리됩니다."
  },
  "prose-22": {
    "en": "The time-dependent score supplies the distributional information. With exact scores and continuous integration, both processes share the same marginals; their individual paths still differ.",
    "ko": "시간별 score가 분포에 대한 정보를 제공합니다. 정확한 score와 연속시간에서는 두 과정의 주변분포가 같습니다. 개별 입자의 경로는 서로 다릅니다."
  },
  "prose-23": {
    "en": "The finite Fourier evolution, inverse filters, candidate residuals, and expected error are analytic. Coefficient bounds keep every source density positive.",
    "ko": "유한 Fourier 모델의 시간 변화, 복원 필터, 후보별 잔차, 기대 오차는 해석식으로 계산합니다. 초기 계수의 범위를 제한하여 원본 밀도가 항상 양수가 되도록 합니다."
  },
  "prose-24": {
    "en": "Coefficient measurement noise and Brownian sampling noise are separate. Reconstructions retain negative values. Particle generation uses numerical integration, 512 samples, and 32 histogram bins.",
    "ko": "계수의 측정 오차와 Brownian 샘플링 노이즈는 별개입니다. 복원에서 생긴 음수 값은 그대로 표시합니다. 입자 생성은 수치적분하며 표본 512개, 히스토그램 32구간을 사용합니다."
  },
  "prose-25": {
    "en": "Lecture 2: scores and denoising. Lecture 3: forward SDEs, Fokker–Planck, reverse SDEs, and probability flow ODEs. Lecture A: Euler and Euler–Maruyama.",
    "ko": "Lecture 2의 score와 denoising, Lecture 3의 forward SDE·Fokker–Planck·reverse SDE·probability flow ODE, Lecture A의 Euler·Euler–Maruyama와 연결됩니다."
  }
};
  const ui={
  "Diffusion Detective · Following the spectrum": "Diffusion Detective · 주파수로 읽는 확산",
  "An interactive essay on diffusion, spectral inversion, regularization, and score-based sampling.": "확산의 주파수 감쇠, 역문제, 정규화와 score 기반 샘플링을 연결하는 인터랙티브 실험 노트.",
  "Skip to the experiments": "본문으로 이동",
  "AN INTERACTIVE MATHEMATICAL ESSAY": "확산과 역과정을 탐색하는 수학 노트",
  "Source ↗": "소스 ↗",
  "CONTENTS": "목차",
  "On this page": "글 목차",
  "Language": "언어",
  "The fading spectrum": "약해지는 주파수 성분",
  "Running it backward": "확산을 거꾸로 돌리면",
  "Choosing a filter": "복원 필터의 선택",
  "Two small mysteries": "두 가지 복원 퍼즐",
  "From density to samples": "밀도 복원에서 샘플 생성으로",
  "Model & references": "모델과 참고문헌",
  "2026 FALL": "2026 가을학기",
  "Special Topics in": "시스템소프트웨어특강",
  "System Software": "확산 모델의 수학적 원리",
  "DIFFUSION DETECTIVE / INTERACTIVE NOTES": "DIFFUSION DETECTIVE / 인터랙티브 노트",
  "STRUCTURE": "구조",
  "DIFFUSION": "확산",
  "UNCERTAINTY": "불확실성",
  "THE QUESTION": "살펴볼 질문",
  "Five experiments, one model": "하나의 모델, 다섯 가지 실험",
  "Analytic Fourier dynamics": "해석적으로 계산하는 Fourier 모델",
  "Read, adjust, follow the change ↓": "읽고 조작하며 변화 살펴보기 ↓",
  "01 / FORWARD DIFFUSION": "01 / 순방향 확산",
  "02 / THE INVERSE PROBLEM": "02 / 역문제",
  "03 / BIAS–VARIANCE TRADEOFF": "03 / 편향과 분산",
  "04 / IDENTIFIABILITY PUZZLES": "04 / 식별 가능성 퍼즐",
  "05 / FROM INVERSION TO GENERATION": "05 / 복원에서 생성으로",
  "06 / MODEL & REFERENCES": "06 / 모델과 참고문헌",
  "EXPERIMENT 01": "실험 01",
  "EXPERIMENT 02": "실험 02",
  "EXPERIMENT 03": "실험 03",
  "EXPERIMENT 05": "실험 05",
  "A pattern, a phase, a little time": "패턴과 위상, 그리고 확산 시간",
  "LIVE": "실시간",
  "Initial density": "초기 밀도",
  "Asymmetric": "비대칭 패턴",
  "Twin peaks": "두 봉우리",
  "Broad peak": "넓은 봉우리",
  "Phase φ": "위상 φ",
  "Detail frequency k": "미세 무늬 주파수 k",
  "Detail amplitude A": "미세 무늬 크기 A",
  "Initial p₀": "초기 밀도 p₀",
  "Diffused pₜ": "확산된 밀도 pₜ",
  "Initial and diffused density": "초기 밀도와 확산된 밀도",
  "Diffusion time T": "확산 시간 T",
  "0 · initial pattern": "0 · 초기 패턴",
  "0.12 · more smoothing": "0.12 · 더 강한 평활화",
  "FOURIER ATTENUATION · k × t": "FOURIER 감쇠율 · k × t",
  "Attenuation across time and frequency": "시간과 주파수에 따른 감쇠율",
  "IN THE SPECTRUM": "주파수에서 읽는 단서",
  "One observation, three reconstructions": "같은 관측, 세 가지 복원",
  "Same density and time as above": "앞 실험과 같은 밀도·시간",
  "Error bound ε": "측정 오차 한계 ε",
  "Cutoff K": "Cutoff 주파수 K",
  "Regularization log₁₀λ": "정규화 강도 log₁₀λ",
  "Reconstruction": "복원",
  "Source": "원본",
  "Independent vertical scales": "패널별 독립적인 세로축",
  "OBSERVED & RECOVERED AMPLITUDE": "관측·복원 주파수 진폭",
  "Dashed: error bound √2 ε · log scale": "점선: 오차 한계 √2 ε · 로그 축",
  "Observed and recovered amplitude by frequency": "주파수별 관측 및 복원 진폭",
  "SPECTRAL CUTOFF": "주파수 제한 · SPECTRAL CUTOFF",
  "TIKHONOV REGULARIZATION": "TIKHONOV 정규화",
  "Choosing what to recover": "어디까지 복원할까",
  "The bias–variance curve": "편향과 분산의 변화",
  "Linked to the filter above": "앞 실험의 필터와 연동",
  "Expected RMSE": "기대 RMSE",
  "Bias": "편향",
  "Noise RMS": "노이즈 RMS",
  "Realized error": "현재 관측의 실제 오차",
  "Expected error, bias, noise, and realized error across regularization strengths": "정규화 강도에 따른 기대 오차, 편향, 노이즈 및 실제 오차",
  "Two paths through the same densities": "같은 밀도를 지나는 두 경로",
  "Exact density and score from §01": "실험 01의 정확한 밀도·score",
  "Reverse time r/T": "역과정 진행률 r/T",
  "Integration steps": "적분 스텝 수",
  "Initial sample seed": "초기 샘플 시드",
  "Sample histogram": "입자 히스토그램",
  "Exact target density": "정확한 목표 밀도",
  "N = 512 · shared initial samples": "N = 512 · 같은 초기 입자",
  "REVERSE SDE": "역 SDE",
  "Reverse SDE samples and exact density": "역 SDE 입자 분포와 정확한 밀도",
  "Sixteen reverse SDE sample paths": "역 SDE의 입자 16개 궤적",
  "Probability flow ODE samples and exact density": "Probability flow ODE 입자 분포와 정확한 밀도",
  "Sixteen probability flow ODE sample paths": "Probability flow ODE의 입자 16개 궤적",
  "Where the two equations meet": "두 밀도 방정식의 연결",
  "A note on the model": "모델의 가정과 계산 범위",
  "Analytic quantities": "해석적으로 계산한 것",
  "Numerical quantities": "수치적으로 계산한 것",
  "Course connections": "강의와의 연결",
  "Further reading": "참고문헌",
  "Evans · Partial Differential Equations · Heat equation": "Evans · Partial Differential Equations · 열방정식",
  "SNU · SPECIAL TOPICS IN SYSTEM SOFTWARE · 2026": "서울대학교 · 시스템소프트웨어특강 · 2026"
};
  const requested=new URLSearchParams(location.search).get('lang');
  let language=requested==='ko'||(requested!=='en'&&/\/Korean(?:%20| )ver\/(?:index\.html)?$/.test(location.pathname))?'ko':'en';
  const textNodes=[],attributes=[];
  const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const node=walker.currentNode;
    if(node.parentElement.closest('[data-i18n],math,script,style,.language-switch'))continue;
    const english=node.nodeValue.trim();
    if(Object.hasOwn(ui,english))textNodes.push({node,original:node.nodeValue,english});
  }
  document.querySelectorAll('[aria-label],meta[name="description"]').forEach(element=>{
    const attribute=element.tagName==='META'?'content':'aria-label',english=element.getAttribute(attribute);
    if(Object.hasOwn(ui,english))attributes.push({element,attribute,english});
  });
  function apply(){
    document.documentElement.lang=language;
    document.querySelectorAll('[data-i18n]').forEach(element=>{
      const entry=prose[element.dataset.i18n];
      if(!entry)throw new Error('Missing translation: '+element.dataset.i18n);
      element.innerHTML=entry[language];
    });
    for(const {node,original,english} of textNodes)node.nodeValue=language==='ko'?original.replace(english,ui[english]):original;
    for(const {element,attribute,english} of attributes)element.setAttribute(attribute,language==='ko'?ui[english]:english);
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.lang===language));
    document.documentElement.style.setProperty('--formula-scroll-label',language==='ko'?"'수식은 좌우로 스크롤할 수 있습니다 ↔'":"'Scroll to explore the equation ↔'");
  }
  function setLanguage(next){
    if(!['en','ko'].includes(next)||next===language)return;
    const section=[...document.querySelectorAll('.hero,.chapter')].find(el=>el.getBoundingClientRect().top<=100&&el.getBoundingClientRect().bottom>100);
    const offset=section?scrollY-section.offsetTop:scrollY;
    language=next;
    const url=new URL(location.href);
    url.pathname=url.pathname.replace(/\/(English|Korean)(?:%20| )ver\/(?:index\.html)?$/,(next==='ko'?'/Korean%20ver/':'/English%20ver/')+(url.pathname.endsWith('/index.html')?'index.html':''));
    url.searchParams.delete('lang');
    if(location.protocol==='file:'){url.pathname=location.pathname;url.searchParams.set('lang',next);}
    history.replaceState(null,'',url);
    apply();window.dispatchEvent(new Event('diffusionlanguagechange'));
    if(section)window.scrollTo({top:section.offsetTop+Math.min(offset,section.clientHeight-100),behavior:'instant'});
  }
  window.DiffusionI18n={get language(){return language;},text:(en,ko)=>language==='ko'?ko:en,setLanguage};
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
  apply();
})();
