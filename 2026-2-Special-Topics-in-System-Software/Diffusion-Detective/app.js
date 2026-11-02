/* Analytic visualizations shared by both languages. */
(function(){
'use strict';
const M=DiffusionMath,$=id=>document.getElementById(id),t=(en,ko)=>DiffusionI18n.text(en,ko),blue='#375f87',orange='#bc8056';
const state={sigma:.45,scheme:'ddpm',y:.35,u:0,seed:12,draw:0,active:'sigma'};
const fmt=(x,n=3)=>(Math.abs(x)<5e-10?0:x).toFixed(n);
const X=y=>48+(y+3)/6*564;
const path=points=>points.map((p,i)=>(i?'L':'M')+p.map(x=>x.toFixed(2)).join(',')).join(' ');
function highlight(key){state.active=key;document.querySelectorAll('[data-link]').forEach(el=>el.classList.toggle('active',el.dataset.link.split(' ').includes(key)));}
function densityPlot(){
 const pairs=Array.from({length:401},(_,i)=>{const y=-3+i*6/400;return[y,M.density(y,state.sigma,state.scheme)];}),top=Math.max(.7,...pairs.map(p=>p[1])),Y=v=>207-v/top*156,{a}=M.coefficients(state.sigma,state.scheme);
 let s='<path d="M48 207H612" class="axis"/>';
 for(const x of [-3,-2,-1,0,1,2,3])s+='<text x="'+X(x)+'" y="228" text-anchor="middle">'+x+'</text>';
 s+='<path d="'+path(pairs.map(([x,p])=>[X(x),Y(p)]))+'L612 207H48Z" fill="'+blue+'" opacity=".08"/><path d="'+path(pairs.map(([x,p])=>[X(x),Y(p)]))+'" stroke="'+blue+'" stroke-width="2" fill="none"/>';
 for(const x of [-a,a])s+='<path d="M'+X(x)+' 43V207" stroke="#b9c9d7" stroke-dasharray="3 4"/>';
 const samples=M.samples(state.sigma,state.scheme,state.seed);
 for(let i=0;i<samples.length;i++){const p=samples[i];if(p.y>=-3&&p.y<=3)s+='<circle cx="'+X(p.y)+'" cy="'+(248+i%3*5)+'" r="2" fill="'+(p.x0<0?blue:orange)+'" opacity=".65"/>';}
 s+='<path d="M'+X(state.y)+' 29V207" stroke="'+orange+'" stroke-width="1.5"/><circle cx="'+X(state.y)+'" cy="'+Y(M.density(state.y,state.sigma,state.scheme))+'" r="4" fill="'+orange+'"/><text x="'+X(state.y)+'" y="19" text-anchor="middle">y = '+fmt(state.y,2)+'</text>';
 $('density-plot').innerHTML=s;
 $('sample-caption').textContent=t('80 forward samples · dashed lines: component means ±aₜ · display window [−3, 3]','정방향 표본 80개 · 점선: 성분 평균 ±aₜ · 표시 구간 [−3, 3]');
}
function scorePlot(){const values=Array.from({length:301},(_,i)=>{const x=-2.5+i/300*5;return[x,M.posterior(x,state.sigma,state.scheme).score];}),bound=Math.max(1,...values.map(p=>Math.abs(p[1]))),X=x=>48+(x+2.5)/5*564,Y=v=>110-v/bound*75;let s='<path d="M48 110H612" class="axis"/>';
 s+='<path d="'+path(values.map(([x,v])=>[X(x),Y(v)]))+'" stroke="'+blue+'" stroke-width="2" fill="none"/>';
 // Values below are computed independently from the conditional noise prediction.
 s+='<path d="'+path(values.map(([x])=>[X(x),Y(-M.posterior(x,state.sigma,state.scheme).noise/state.sigma)]))+'" stroke="'+orange+'" stroke-dasharray="5 5" stroke-width="1.4" fill="none"/>';
 const p=M.posterior(state.y,state.sigma,state.scheme);s+='<circle cx="'+X(state.y)+'" cy="'+Y(p.score)+'" r="4" fill="'+orange+'"/><text x="42" y="38" text-anchor="end">'+fmt(bound,1)+'</text><text x="42" y="189" text-anchor="end">'+fmt(-bound,1)+'</text>';for(const x of [-2,-1,0,1,2])s+='<text x="'+X(x)+'" y="210" text-anchor="middle">'+x+'</text>';
 $('score-plot').innerHTML=s;
}
function posteriorPlot(p){const X=x=>48+(x+1.5)/3*564,Y=v=>190-v*140;let s='<path d="M48 190H612" class="axis"/>';for(const[x,w,c]of[[-1,p.minus,blue],[1,p.plus,orange]])s+='<rect x="'+(X(x)-28)+'" y="'+Y(w)+'" width="56" height="'+(w*140)+'" rx="2" fill="'+c+'" opacity=".8"/><text x="'+X(x)+'" y="'+(Y(w)-10)+'" text-anchor="middle">'+fmt(w*100,1)+'%</text><text x="'+X(x)+'" y="213" text-anchor="middle">x₀ = '+x+'</text>';
 s+='<path d="M'+X(p.mean)+' 32V190" stroke="#344a5e" stroke-dasharray="4 4"/><text x="'+X(p.mean)+'" y="20" text-anchor="middle">E[x₀ | y] = '+fmt(p.mean)+'</text>';$('posterior-plot').innerHTML=s;
}
function riskPlot(p){const X=u=>48+(u+1.3)/2.6*564,Y=r=>205-r/6*155,points=Array.from({length:201},(_,i)=>{const u=-1.3+i/200*2.6;return[X(u),Y(M.risk(u,p))];});let s='<path d="M48 205H612" class="axis"/><path d="'+path(points)+'" fill="none" stroke="'+blue+'" stroke-width="2"/>';s+='<circle cx="'+X(p.mean)+'" cy="'+Y(p.variance)+'" r="4" fill="#344a5e"/><circle cx="'+X(state.u)+'" cy="'+Y(M.risk(state.u,p))+'" r="5" fill="'+orange+'"/>';for(const u of [-1,0,1])s+='<text x="'+X(u)+'" y="228" text-anchor="middle">'+u+'</text>';s+='<text x="48" y="20">E[(x₀ − u)² | y]</text>';$('risk-plot').innerHTML=s;}
function copy(p){
 $('sigma-out').textContent=fmt(state.sigma,2);$('y-out').textContent=fmt(state.y,2);$('u-out').textContent=fmt(state.u,2);
 const values={a:fmt(p.a),sigma:fmt(state.sigma),y:fmt(state.y),mean:fmt(p.mean),noise:fmt(p.noise),score:fmt(p.score),variance:fmt(p.variance),risk:fmt(M.risk(state.u,p)),excess:fmt((state.u-p.mean)**2),plus:fmt(p.plus*100,1)+'%',minus:fmt(p.minus*100,1)+'%'};
 document.querySelectorAll('[data-value]').forEach(el=>{if(Object.hasOwn(values,el.dataset.value))el.textContent=values[el.dataset.value];});
 $('forward-live').textContent=t('aₜ = '+fmt(p.a)+', σₜ = '+fmt(state.sigma)+'. '+(state.scheme==='ddpm'?'DDPM scales the signal as noise increases.':'The NCSN corruption keeps the signal scale at 1.'),'aₜ = '+fmt(p.a)+', σₜ = '+fmt(state.sigma)+'. '+(state.scheme==='ddpm'?'DDPM에서는 노이즈가 증가하면 신호의 크기가 줄어든다.':'NCSN의 노이즈 추가에서는 신호의 크기 1을 유지한다.'));
 $('prediction-live').textContent='−ε*(y)/σₜ = '+fmt(-p.noise/state.sigma)+' = s*(y)';
 $('mean-live').textContent=t('Conditional mean '+fmt(p.mean)+' · minimum conditional MSE '+fmt(p.variance)+'.','조건부 평균 '+fmt(p.mean)+' · 최소 조건부 MSE '+fmt(p.variance)+'.');
 $('sample-result').textContent=state.draw?t('One posterior draw: x₀ = ','조건부분포에서 뽑은 한 후보: x₀ = ')+M.conditionalSample(p,state.seed+state.draw*7919):t('A posterior draw selects −1 or +1; the conditional mean may lie between them.','조건부분포에서 뽑은 값은 −1 또는 +1이고, 조건부 평균은 그 사이에 놓일 수 있다.');
 highlight(state.active);
}
function render(){const p=M.posterior(state.y,state.sigma,state.scheme);densityPlot();scorePlot();posteriorPlot(p);riskPlot(p);copy(p);}
for(const id of ['sigma','y','u'])$(id).addEventListener('input',()=>{state[id]=Number($(id).value);if(id!=='u')state.draw=0;highlight(id);render();});
$('scheme').addEventListener('change',()=>{state.scheme=$('scheme').value;state.draw=0;highlight('scheme');render();});
$('new-samples').addEventListener('click',()=>{state.seed++;highlight('seed');render();});
$('ambiguous').addEventListener('click',()=>{state.y=0;$('y').value=0;state.draw=0;highlight('y');render();});
$('optimal').addEventListener('click',()=>{state.u=M.posterior(state.y,state.sigma,state.scheme).mean;$('u').value=state.u;highlight('u');render();});
$('posterior-sample').addEventListener('click',()=>{state.draw++;render();});
window.addEventListener('diffusionlanguagechange',render);
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){document.querySelectorAll('.contents a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}},{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('.chapter').forEach(el=>observer.observe(el));
window.addEventListener('scroll',()=>{const height=document.documentElement.scrollHeight-innerHeight;$('reading-progress').style.width=(height>0?scrollY/height*100:0)+'%';},{passive:true});
window.CourseLab={snapshot:()=>({...state,...M.posterior(state.y,state.sigma,state.scheme)})};render();
})();
