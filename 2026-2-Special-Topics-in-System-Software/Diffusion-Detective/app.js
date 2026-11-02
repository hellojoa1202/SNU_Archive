/* Analytic visualizations shared by both languages. */
(function(){
'use strict';
const M=DiffusionMath,$=id=>document.getElementById(id),t=(en,ko)=>DiffusionI18n.text(en,ko),blue='#375f87',orange='#bc8056';
const state={sigma:.45,scheme:'ddpm',y:.04,h:.04,u:0,seed:12,draw:0,active:'sigma'};
const fmt=(x,n=3)=>(Math.abs(x)<5e-10?0:x).toFixed(n);
const path=points=>points.map((p,i)=>(i?'L':'M')+p.map(x=>x.toFixed(2)).join(',')).join(' ');
function highlight(key){state.active=key;document.querySelectorAll('[data-link]').forEach(el=>el.classList.toggle('active',el.dataset.link.split(' ').includes(key)));}
function geometryPlots(p,region){
 const X=x=>48+(x+1.2)/2.4*564,Y=m=>210-(m+1.1)/2.2*170;
 const points=Array.from({length:1201},(_,i)=>{const y=-1.2+i*.002;return[y,M.geometry(y,state.sigma,state.scheme).mean];});
 let out='<path d="M48 '+Y(0)+'H612" class="axis"/>';
 out+='<path d="'+path(points.map(([x,v])=>[X(x),Y(v)]))+'" fill="none" stroke="'+blue+'" stroke-width="2"/>';
 const tangent=points.map(([x])=>[x,p.mean+p.slope*(x-state.y)]).filter(([x,v])=>v>=-1.1&&v<=1.1);
 out+='<path d="'+path(tangent.map(([x,v])=>[X(x),Y(v)]))+'" fill="none" stroke="'+orange+'" stroke-width="1.5" stroke-dasharray="4 4"/>';
 for(const[x,v,c]of [[state.y,p.mean,blue],[state.y+state.h,p.mean+p.delta,orange]])out+='<circle cx="'+X(x)+'" cy="'+Y(v)+'" r="4" fill="'+c+'"/>';
 out+='<path d="M'+X(state.y)+' '+Y(p.mean)+'H'+X(state.y+state.h)+'V'+Y(p.mean+p.delta)+'" fill="none" stroke="'+orange+'" stroke-width="1"/>';
 for(const x of [-1,-.5,0,.5,1])out+='<text x="'+X(x)+'" y="234" text-anchor="middle">'+x+'</text>';
 out+='<text x="48" y="18">D(y)</text><text x="612" y="250" text-anchor="end">y</text>';$('denoiser-plot').innerHTML=out;
 const G=v=>210-v/Math.max(1.2,region.peak*1.1)*170;
 let gain='<path d="M48 210H612" class="axis"/>';
 if(region.width>0)gain+='<rect x="'+X(-region.width)+'" y="30" width="'+(X(region.width)-X(-region.width))+'" height="180" fill="'+orange+'" opacity=".1"/>';
 gain+='<path d="M48 '+G(1)+'H612" stroke="'+orange+'" stroke-dasharray="4 4"/><text x="612" y="'+(G(1)-6)+'" text-anchor="end">gain = 1</text>';
 gain+='<path d="'+path(points.map(([x])=>[X(x),G(M.geometry(x,state.sigma,state.scheme).slope)]))+'" fill="none" stroke="'+blue+'" stroke-width="2"/><circle cx="'+X(state.y)+'" cy="'+G(p.slope)+'" r="4" fill="'+orange+'"/>';
 for(const x of [-1,-.5,0,.5,1])gain+='<text x="'+X(x)+'" y="234" text-anchor="middle">'+x+'</text>';
 gain+='<text x="48" y="18">D′(y) · max '+fmt(region.peak,2)+'</text><text x="612" y="250" text-anchor="end">y</text>';$('gain-plot').innerHTML=gain;
}
function posteriorPlot(p){const X=x=>48+(x+1.5)/3*564,Y=v=>190-v*140;let s='<path d="M48 190H612" class="axis"/>';for(const[x,w,c]of[[-1,p.minus,blue],[1,p.plus,orange]])s+='<rect x="'+(X(x)-28)+'" y="'+Y(w)+'" width="56" height="'+(w*140)+'" rx="2" fill="'+c+'" opacity=".8"/><text x="'+X(x)+'" y="'+(Y(w)-10)+'" text-anchor="middle">'+fmt(w*100,1)+'%</text><text x="'+X(x)+'" y="213" text-anchor="middle">x₀ = '+x+'</text>';
 s+='<path d="M'+X(p.mean)+' 32V190" stroke="#344a5e" stroke-dasharray="4 4"/><text x="'+X(p.mean)+'" y="20" text-anchor="middle">E[x₀ | y] = '+fmt(p.mean)+'</text>';$('posterior-plot').innerHTML=s;
}
function riskPlot(p){const X=u=>48+(u+1.3)/2.6*564,Y=r=>205-r/6*155,points=Array.from({length:201},(_,i)=>{const u=-1.3+i/200*2.6;return[X(u),Y(M.risk(u,p))];});let s='<path d="M48 205H612" class="axis"/><path d="'+path(points)+'" fill="none" stroke="'+blue+'" stroke-width="2"/>';s+='<circle cx="'+X(p.mean)+'" cy="'+Y(p.variance)+'" r="4" fill="#344a5e"/><circle cx="'+X(state.u)+'" cy="'+Y(M.risk(state.u,p))+'" r="5" fill="'+orange+'"/>';for(const u of [-1,0,1])s+='<text x="'+X(u)+'" y="228" text-anchor="middle">'+u+'</text>';s+='<text x="48" y="20">E[(x₀ − u)² | y]</text>';$('risk-plot').innerHTML=s;}
function copy(p,region){
 $('sigma-out').textContent=fmt(state.sigma,2);$('y-out').textContent=fmt(state.y,2);$('u-out').textContent=fmt(state.u,2);$('h-out').textContent=fmt(state.h,3);
 const values={a:fmt(p.a),sigma:fmt(state.sigma),y:fmt(state.y),mean:fmt(p.mean),variance:fmt(p.variance),risk:fmt(M.risk(state.u,p)),excess:fmt((state.u-p.mean)**2),slope:fmt(p.slope),curvature:fmt(p.curvature),delta:fmt(p.delta,5),linear:fmt(p.linear,5),remainder:p.remainder.toExponential(2),secant:fmt(p.secant),mass:region.mass<.00001?region.mass.toExponential(2):fmt(region.mass*100,2)+'%',width:fmt(region.width,4),sampleRisk:fmt(2*p.variance),mapRisk:fmt(2*(1-Math.abs(p.mean)))};
 document.querySelectorAll('[data-value]').forEach(el=>{if(Object.hasOwn(values,el.dataset.value))el.textContent=values[el.dataset.value];});
 $('sensitivity-live').textContent=t('At this observation: '+(p.slope>1?'local amplification':'local non-expansion')+'. The finite-step gain is '+fmt(p.secant)+', while D′(y) = '+fmt(p.slope)+'.','현재 관측점: '+(p.slope>1?'국소 증폭':'국소 비팽창')+'. 유한 변화의 증폭률은 '+fmt(p.secant)+', D′(y) = '+fmt(p.slope)+'.');
 $('region-live').textContent=region.width>0?t('D′(y) > 1 for |y| < '+fmt(region.width,4)+'. Probability mass is integrated over this interval.','|y| < '+fmt(region.width,4)+'에서 D′(y) > 1이다. 해당 구간의 관측 확률을 적분해 표시한다.'):t('D′(y) never exceeds 1 at this noise level.','이 노이즈 수준에서는 모든 y에서 D′(y) ≤ 1이다.');
 $('mean-live').textContent=t('Bayes risk '+fmt(p.variance)+' · local sensitivity '+fmt(p.slope)+'. These measure different properties.','Bayes 위험 '+fmt(p.variance)+' · 국소 민감도 '+fmt(p.slope)+'. 서로 다른 성질을 측정한다.');
 $('sample-result').textContent=state.draw?t('One posterior draw: x₀ = ','조건부분포에서 뽑은 한 후보: x₀ = ')+M.conditionalSample(p,state.seed+state.draw*7919):t('Posterior sampling returns a supported value; averaging minimizes squared error.','사후 샘플링은 지지집합의 값을 반환하고, 평균은 제곱오차를 최소화한다.');
 highlight(state.active);
}
function render(){const p=M.geometry(state.y,state.sigma,state.scheme,state.h),region=M.amplificationRegion(state.sigma,state.scheme);geometryPlots(p,region);posteriorPlot(p);riskPlot(p);copy(p,region);}
for(const id of ['sigma','y','h','u'])$(id).addEventListener('input',()=>{state[id]=Number($(id).value);if(id!=='u')state.draw=0;highlight(id);render();});
$('scheme').addEventListener('change',()=>{state.scheme=$('scheme').value;state.draw=0;highlight('scheme');render();});
$('ambiguous').addEventListener('click',()=>{state.y=0;$('y').value=0;state.draw=0;highlight('y');render();});
$('optimal').addEventListener('click',()=>{state.u=M.posterior(state.y,state.sigma,state.scheme).mean;$('u').value=state.u;highlight('u');render();});
$('posterior-sample').addEventListener('click',()=>{state.draw++;render();});
window.addEventListener('diffusionlanguagechange',render);
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){document.querySelectorAll('.contents a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}},{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('.chapter').forEach(el=>observer.observe(el));
window.addEventListener('scroll',()=>{const height=document.documentElement.scrollHeight-innerHeight;$('reading-progress').style.width=(height>0?scrollY/height*100:0)+'%';},{passive:true});
window.CourseLab={snapshot:()=>({...state,...M.geometry(state.y,state.sigma,state.scheme,state.h),region:M.amplificationRegion(state.sigma,state.scheme)})};render();
})();
