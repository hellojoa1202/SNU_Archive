(function(){
'use strict';
const M=CircularDial,$=id=>document.getElementById('dial-'+id),tr=(en,ko)=>DiffusionI18n.text(en,ko),root=document.querySelector('.dial-lab');
const blue='#375f87',orange='#b17d56',muted='#758695',COUNT=6;
let start=[],selected=2,kind='sample',simulation,reference=[],referenceKey='',active='time',animation=null,playing='',drag=null;
const num=id=>Number($(id).value),degree=x=>x*180/Math.PI,fmt=(x,n=3)=>x.toFixed(n);
function parameters(){return{T:num('time'),m:num('m'),sigma:num('sigma'),steps:num('steps'),seed:num('seed'),solver:$('solver').value};}
function context(canvas){const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return{ctx,w:box.width,h:box.height};}
function board(id,angles,time,colour=blue){
 const {ctx:c,w,h}=context($(id)),R=Math.min(w,h)*.44,cx=w/2,cy=h/2,inner=R*.17,band=(R-inner)/COUNT,m=num('m');
 c.translate(cx,cy);c.fillStyle='#fff';c.beginPath();c.arc(0,0,R+4,0,M.TAU);c.fill();
 for(let i=0;i<COUNT;i++){
  const r0=inner+i*band,r1=r0+band-1.5;c.save();c.rotate(angles[i]);c.beginPath();c.arc(0,0,r1,0,M.TAU);c.arc(0,0,r0,M.TAU,0,true);c.clip();c.fillStyle=i%2?'#f0f4f7':'#f7f9fb';c.fillRect(-R,-R,2*R,2*R);
  for(let spoke=0;spoke<m;spoke++)for(const [offset,width,stroke]of [[-.065,.055,'#b17d56'],[0,.065,blue],[.07,.025,'#9bb3c6']]){
   c.beginPath();for(let j=0;j<=140;j++){const r=inner+(R-inner)*j/140,a=spoke*M.TAU/m+.36*Math.sin((r/R)*Math.PI*2.3)+offset,x=r*Math.cos(a),y=r*Math.sin(a);if(j)c.lineTo(x,y);else c.moveTo(x,y);}c.strokeStyle=stroke;c.lineWidth=R*width;c.lineCap='round';c.stroke();
  }
  c.restore();c.strokeStyle=i===selected?colour:'#dce4eb';c.lineWidth=i===selected?1.5:.7;c.beginPath();c.arc(0,0,r1,0,M.TAU);c.stroke();
 }
 c.fillStyle='#e8eef4';c.beginPath();c.arc(0,0,inner-4,0,M.TAU);c.fill();c.fillStyle=blue;c.font='11px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('m = '+m,0,0);
 for(let j=0;j<24;j++){const a=j/24*M.TAU;c.strokeStyle=j%6?'#c4d0dc':'#8b9dad';c.lineWidth=1;c.beginPath();c.moveTo((R+8)*Math.cos(a),(R+8)*Math.sin(a));c.lineTo((R+(j%6?11:15))*Math.cos(a),(R+(j%6?11:15))*Math.sin(a));c.stroke();}
 const theta=angles[selected],r=inner+(selected+.5)*band,score=M.profile(theta,time,m,num('sigma')).score;
 c.fillStyle=colour;c.beginPath();c.arc(r*Math.cos(theta),r*Math.sin(theta),3,0,M.TAU);c.fill();
 if(Math.abs(score)>1e-10){const delta=Math.sign(score)*Math.min(.55,Math.abs(score)*.07),end=theta+delta;c.strokeStyle=colour;c.lineWidth=2;c.beginPath();c.arc(0,0,r,theta,end,delta<0);c.stroke();const x=r*Math.cos(end),y=r*Math.sin(end),a=end+(delta>0?Math.PI/2:-Math.PI/2);c.fillStyle=colour;c.beginPath();c.moveTo(x,y);c.lineTo(x-7*Math.cos(a-.5),y-7*Math.sin(a-.5));c.lineTo(x-7*Math.cos(a+.5),y-7*Math.sin(a+.5));c.fill();}
}
function plot(id,series,marker,axis){
 const W=440,H=200,L=42,R=14,T=20,B=30,all=series.flatMap(s=>s.values);let lo=Math.min(0,...all),hi=Math.max(.1,...all);const pad=(hi-lo)*.1;lo-=pad;hi+=pad;
 const X=x=>L+(x+Math.PI)/M.TAU*(W-L-R),Y=y=>T+(hi-y)/(hi-lo)*(H-T-B);let out='';
 for(let i=0;i<=3;i++){const v=lo+(hi-lo)*i/3,y=Y(v);out+='<path d="M'+L+' '+y+'H'+(W-R)+'" stroke="#e5ebef"/><text x="'+(L-7)+'" y="'+(y+3)+'" text-anchor="end">'+v.toFixed(1)+'</text>';}
 ['−π','−π/2','0','π/2','π'].forEach((v,i)=>out+='<text x="'+X(-Math.PI+i*Math.PI/2)+'" y="193" text-anchor="middle">'+v+'</text>');
 for(const s of series){out+='<path d="'+s.values.map((v,i)=>(i?'L':'M')+X(-Math.PI+i/(s.values.length-1)*M.TAU).toFixed(2)+','+Y(v).toFixed(2)).join(' ')+'" fill="none" stroke="'+s.colour+'" stroke-width="1.7"'+(s.dashed?' stroke-dasharray="4 3"':'')+'/>';}
 out+='<path d="M'+X(marker)+' '+T+'V'+(H-B)+'" stroke="'+blue+'" stroke-dasharray="3 4" opacity=".65"/><text x="'+L+'" y="10">'+axis+'</text>';
 $(id).setAttribute('viewBox',`0 0 ${W} ${H}`);$(id).innerHTML=out;
}
function highlight(key){active=key;root.querySelectorAll('[data-dial-term]').forEach(el=>el.classList.toggle('active',el.dataset.dialTerm.split(' ').includes(key)));}
function forwardRender(){
 const {T,m,sigma}=parameters(),theta=start[selected],p=M.profile(theta,T,m,sigma);
 board('forward',start,T);$('time-out').textContent=fmt(T,2);$('sigma-out').textContent=fmt(sigma,2)+' rad';$('angle').value=Math.round(degree(theta));$('angle-out').textContent=fmt(degree(theta),1)+'°';
 $('selection').textContent=tr('Ring ','원판 ')+(selected+1)+' / '+COUNT;
 $('state').textContent=kind==='sample'?tr('Sample from pT','pT 표본'):kind==='boundary'?tr('Mode-boundary initial condition','대칭 경계 초기조건'):tr('Edited initial condition','수정된 초기조건');
 $('forward-note').textContent=tr('Noise scale √(2T) = ','잡음 크기 √(2T) = ')+fmt(Math.sqrt(2*T))+' rad. '+tr('Equivalent rotations are separated by ','동등한 회전 상태의 간격은 ')+fmt(360/m,0)+'°.';
 const xs=Array.from({length:257},(_,i)=>-Math.PI+i/256*M.TAU);
 plot('density',[{values:xs.map(x=>M.profile(x,0,m,sigma).density),colour:orange,dashed:true},{values:xs.map(x=>M.profile(x,T,m,sigma).density),colour:blue}],theta,'p(θ) · '+tr('orange p₀ / blue pT','주황 p₀ / 파랑 pT'));
 plot('score',[{values:xs.map(x=>M.profile(x,T,m,sigma).score),colour:blue}],theta,'sT(θ)');
 $('score-note').textContent='θ = '+fmt(degree(theta),1)+'°, sT(θ) = '+fmt(p.score)+'. '+tr('The score is a direction of increasing log density, not an angular error from a stored answer. Arrows have capped display lengths.','Score는 저장된 정답과의 각도 차이가 아니라 로그밀도가 증가하는 방향이다. 화살표의 표시 길이는 제한된다.');
}
function step(){return Math.round(num('progress')/1000*num('steps'));}
function trajectories(j){const W=460,H=175,L=38,R=15,T=12,B=27,X=i=>L+i/num('steps')*(W-L-R),Y=a=>T+(Math.PI-a)/M.TAU*(H-T-B);let html='';
 for(const [a,label]of [[-Math.PI,'−π'],[0,'0'],[Math.PI,'π']])html+='<path d="M'+L+' '+Y(a)+'H'+(W-R)+'" stroke="#e3e9ef"/><text x="'+(L-7)+'" y="'+(Y(a)+3)+'" text-anchor="end">'+label+'</text>';
 for(const type of ['sde','ode']){let d='';for(let i=0;i<=j;i++){const a=simulation[type][i][selected],cut=i===0||Math.abs(a-simulation[type][i-1][selected])>Math.PI;d+=(cut?'M':'L')+X(i).toFixed(2)+','+Y(a).toFixed(2);}html+='<path d="'+d+'" fill="none" stroke="'+(type==='ode'?blue:orange)+'" stroke-width="1.6"/>';}
 html+='<text x="'+L+'" y="170">'+tr('integration step','적분 단계')+'</text><text x="'+(W-R)+'" y="170" text-anchor="end">'+num('steps')+'</text>';$('paths').setAttribute('viewBox',`0 0 ${W} ${H}`);$('paths').innerHTML=html;
}
function reverseRender(){const j=step(),time=simulation.times[j],{steps,solver,m}=parameters();
 $('progress-out').textContent=j+' / '+steps+' · t = '+fmt(time,4);$('ode-solver').textContent=solver==='heun'?'Heun':'Euler';$('sde-solver').textContent='Euler–Maruyama';
 for(const type of ['ode','sde']){const angles=simulation[type][j];board(type,angles,time,type==='ode'?blue:orange);$(type+'-metrics').textContent=tr('RMS distance to nearest mode: ','가장 가까운 모드와의 RMS 각도: ')+fmt(degree(M.error(angles,m)),2)+'° · '+tr('selected ','선택 원판 ')+fmt(degree(angles[selected]),1)+'°';}
 trajectories(j);
 const err=reference.length?Math.sqrt(simulation.ode[steps].reduce((s,a,i)=>s+M.wrap(a-reference[i])**2,0)/COUNT):null;
 $('numeric-note').textContent=err===null?tr('Reference integration pending.','기준해 계산 대기.'):tr('ODE endpoint RMS difference: ','ODE 종점 RMS 차이: ')+err.toExponential(2)+' rad. '+tr('Blue: ODE; orange: SDE. Paths break at ±π.','파랑: ODE, 주황: SDE. ±π 경계에서 궤적을 끊어 표시한다.');highlight(active);
}
function recompute(withReference=true){const {T,m,sigma,steps,seed,solver}=parameters();simulation=M.simulate(start,T,m,sigma,steps,seed,solver);const key=JSON.stringify([start,T,m,sigma]);if(withReference&&key!==referenceKey){reference=M.simulate(start,T,m,sigma,4096,seed,'heun').ode[4096];referenceKey=key;}else if(!withReference){reference=[];referenceKey='';}forwardRender();reverseRender();}
function newSample(withReference=true){const p=parameters();start=M.forward(COUNT,p.T,p.m,p.sigma,p.seed).angles;kind='sample';recompute(withReference);}
function labels(){ $('scatter').textContent=playing==='forward'?tr('Pause','일시정지'):tr('Diffuse','확산 재생');$('play').textContent=playing==='reverse'?tr('Pause','일시정지'):tr('Run reverse process','역과정 재생');}
function stop(){if(animation)cancelAnimationFrame(animation);const was=playing;animation=null;playing='';labels();if(was==='forward')recompute();}
function play(type){if(animation){stop();return;}playing=type;labels();const begin=performance.now();function tick(now){const f=Math.min(1,(now-begin)/6500);if(type==='forward'){$('time').value=(f*1.5).toFixed(2);highlight('time');newSample(false);}else{$('progress').value=Math.round(f*1000);highlight('progress');reverseRender();}if(f<1)animation=requestAnimationFrame(tick);else{animation=null;playing='';labels();if(type==='forward')recompute();}}animation=requestAnimationFrame(tick);}
$('scatter').addEventListener('click',()=>play('forward'));$('play').addEventListener('click',()=>play('reverse'));$('reset').addEventListener('click',()=>{stop();newSample();});
for(const id of ['time','m','sigma','seed'])$(id).addEventListener('input',()=>{stop();if(id==='seed')$('seed').value=Math.max(1,Math.min(9999,num('seed')||1));highlight(id);newSample();});
for(const id of ['steps','solver'])$(id).addEventListener('input',()=>{stop();highlight(id==='solver'?'steps':id);recompute();});
$('progress').addEventListener('input',()=>{stop();highlight('progress');reverseRender();});
$('angle').addEventListener('input',()=>{stop();start[selected]=num('angle')*Math.PI/180;kind='edited';highlight('angle');recompute();});
$('boundary').addEventListener('click',()=>{stop();start[selected]=Math.PI/num('m');kind='boundary';$('progress').value=0;highlight('angle');recompute();});
root.addEventListener('focusin',e=>{if(e.target.id.startsWith('dial-')){const id=e.target.id.slice(5);if(['time','m','sigma','angle','seed','progress','steps'].includes(id))highlight(id);}});
function locate(e){const box=$('forward').getBoundingClientRect(),x=e.clientX-box.left-box.width/2,y=e.clientY-box.top-box.height/2,R=Math.min(box.width,box.height)*.44,r=Math.hypot(x,y),index=Math.floor((r-R*.17)/(R*.83/COUNT));return{angle:Math.atan2(y,x),index};}
$('forward').addEventListener('pointerdown',e=>{const loc=locate(e);if(loc.index<0||loc.index>=COUNT)return;stop();selected=loc.index;drag={last:loc.angle,moved:false};$('forward').setPointerCapture(e.pointerId);$('forward').focus({preventScroll:true});highlight('angle');forwardRender();reverseRender();});
$('forward').addEventListener('pointermove',e=>{if(!drag)return;const loc=locate(e),delta=M.wrap(loc.angle-drag.last);if(Math.abs(delta)<.001)return;drag.last=loc.angle;drag.moved=true;kind='edited';start[selected]=M.wrap(start[selected]+delta);forwardRender();});
function endDrag(){if(!drag)return;const moved=drag.moved;drag=null;if(moved)recompute();}$('forward').addEventListener('pointerup',endDrag);$('forward').addEventListener('pointercancel',endDrag);
$('forward').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();stop();if(e.key==='ArrowUp'||e.key==='ArrowDown'){selected=(selected+(e.key==='ArrowUp'?1:COUNT-1))%COUNT;forwardRender();reverseRender();return;}start[selected]=M.wrap(start[selected]+(e.key==='ArrowLeft'?-1:1)*Math.PI/180);kind='edited';highlight('angle');recompute();});
window.addEventListener('diffusionlanguagechange',()=>{labels();forwardRender();reverseRender();});
let resize;window.addEventListener('resize',()=>{cancelAnimationFrame(resize);resize=requestAnimationFrame(()=>{forwardRender();reverseRender();});});
newSample();
window.DialLab={snapshot:()=>({start:start.slice(),selected,kind,active,ode:simulation.ode[step()].slice(),sde:simulation.sde[step()].slice(),time:simulation.times[step()],reference:reference.slice()}),stop};
})();
