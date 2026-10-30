/* Connect the existing Fourier controls to equations without replacing content. */
(function(){
'use strict';
const byId=id=>document.getElementById(id),value=id=>Number(byId(id).value),t=(en,ko)=>DiffusionI18n.text(en,ko);
let active='time';
const affected={time:['forward','inverse','regularization','generation'],phase:['forward','inverse','regularization','generation'],amplitude:['forward','inverse','regularization','generation'],'detail-k':['forward','inverse','regularization','generation'],noise:['inverse','regularization'],cutoff:['inverse'],lambda:['inverse','regularization'],'risk-lambda':['inverse','regularization'],'reverse-progress':['generation'],steps:['generation'],'sample-seed':['generation']};
function annotate(){
 for(const section of ['forward','inverse','regularization','generation']){
  byId(section).querySelectorAll('math mi').forEach(el=>{
   const symbol=el.textContent;let ids='';
   if(['t','T'].includes(symbol))ids=section==='generation'?'time reverse-progress':'time';
   if(['ε','η'].includes(symbol))ids='noise';if(symbol==='λ')ids='lambda risk-lambda';
   if(section==='forward'&&['a','b'].includes(symbol))ids='phase amplitude detail-k';
   if(ids)el.dataset.controls=ids;
  });
 }
 const formulas=byId('inverse').querySelectorAll('.formula-grid .compact-equation');
 if(formulas.length===2){formulas[0].innerHTML='ĉₖ = yₖ / hₖ　(k ≤ <span class="math-token" data-controls="cutoff">K</span>),　0　(k &gt; <span class="math-token" data-controls="cutoff">K</span>)';formulas[1].innerHTML='ĉₖ = hₖyₖ / (hₖ² + <span class="math-token" data-controls="lambda risk-lambda">λ</span>)';}
}
function render(){
 document.querySelectorAll('[data-controls]').forEach(el=>el.classList.toggle('active',el.dataset.controls.split(' ').includes(active)));
 const T=value('time'),k=value('detail-k'),lambda=10**value('lambda'),dt=T/value('steps'),target=T*(1-value('reverse-progress')/100);
 const outputs={'attenuation':Math.exp(-k*k*T).toExponential(3),'step':dt.toExponential(3),'target-time':target.toFixed(5)};
 document.querySelectorAll('[data-value]').forEach(el=>el.textContent=outputs[el.dataset.value]);
 const names={time:['Diffusion time T','확산 시간 T'],phase:['Phase φ','위상 φ'],amplitude:['Detail amplitude A','미세 성분 진폭 A'],'detail-k':['Detail frequency k','미세 성분 주파수 k'],noise:['Error bound ε','측정 오차 한계 ε'],cutoff:['Cutoff K','제한 주파수 K'],lambda:['Regularization λ','정규화 강도 λ'],'risk-lambda':['Regularization λ','정규화 강도 λ'],'reverse-progress':['Reverse time r','역방향 시간 r'],steps:['Integration steps N','적분 횟수 N'],'sample-seed':['Sample seed','샘플 시드']};
 const name=names[active]?t(...names[active]):'';
 byId('forward-change').textContent=t('k = '+k+', T = '+T.toFixed(3)+': hₖ = '+outputs.attenuation+'. Highlighted terms track the selected parameter.','k = '+k+', T = '+T.toFixed(3)+'에서 hₖ = '+outputs.attenuation+'. 강조된 항은 선택한 매개변수와 연동된다.');
 byId('inverse-change').textContent=t('ε = '+value('noise').toFixed(4)+', K = '+value('cutoff')+', λ = '+lambda.toExponential(2)+'. Cutoff removes modes; Tikhonov reduces their gains.','ε = '+value('noise').toFixed(4)+', K = '+value('cutoff')+', λ = '+lambda.toExponential(2)+'. Cutoff는 모드를 제거하고 Tikhonov는 이득을 조절한다.');
 byId('risk-change').textContent=t('Var(ηₖ) = '+(value('noise')**2/3).toExponential(3)+'. Changing λ affects both bias and variance through gₖ.','Var(ηₖ) = '+(value('noise')**2/3).toExponential(3)+'. λ는 gₖ를 통해 편향과 분산에 모두 영향을 준다.');
 byId('generation-change').textContent=t('Δr = '+outputs.step+'; target time t = '+outputs['target-time']+'. The same initial seed is used for both methods.','Δr = '+outputs.step+', 목표 시점 t = '+outputs['target-time']+'. 두 방법은 동일한 초기 시드를 사용한다.');
 for(const id of ['forward-change','inverse-change','risk-change','generation-change'])byId(id).dataset.parameter=name;
}
Object.keys(affected).forEach(id=>{for(const event of ['input','focus'])byId(id).addEventListener(event,()=>{active=id;render();});});
window.addEventListener('diffusionlanguagechange',()=>{annotate();render();});
annotate();render();
window.EquationLinks={get active(){return active;}};
})();
