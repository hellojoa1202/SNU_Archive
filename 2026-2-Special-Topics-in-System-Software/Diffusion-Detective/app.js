/* One analytic field, three objective constructions, optional generation solvers. */
(function(){
'use strict';
const M=FlowMath,V=PuzzleView,S=CourseStudio,$=id=>document.getElementById(id),tr=(en,ko)=>DiffusionI18n.text(en,ko);
const budgets=[16,32,64,128,256],distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),fmt=(x,n=3)=>Number(x).toFixed(n);
let model=M.create(),revision=0,activeSection='cnf',queued=false,dragging=false,lastTick=0,lastDraw=0,optionLanguage='';
let population=null,materialGrid=null,meshCache=null,comparisonCache=null,areaCache=null;
const refs=new Map(),traces=new Map(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={time:0,selected:19,budget:32,probe:[0,0],prediction:[.6,0],pairing:0,initial:0,playing:!reduced,axis:0,speed:1,active:'density-integral',sampleSeed:17};
let solverResult=null,cnfResult=null,lossRange=1.3;
const optionList=Array.from({length:model.a.length},(_,i)=>'<option value="'+i+'">'+(i+1)+'</option>').join('');
document.querySelectorAll('.piece-select').forEach(e=>e.innerHTML=optionList);$('destination').innerHTML=optionList;
function highlight(key){state.active=key;document.querySelectorAll('[data-link]').forEach(e=>e.classList.toggle('active',e.dataset.link.split(' ').includes(key)));}
function invalidate(){revision++;refs.clear();traces.clear();population=null;materialGrid=null;meshCache=null;comparisonCache=null;areaCache=null;}
function reference(){const i=state.selected;if(!refs.has(i)){const fine=M.integrate(model,model.a[i],'heun',4096),coarse=M.integrate(model,model.a[i],'heun',2048);refs.set(i,{fine,delta:distance(fine.end,coarse.end)});}return refs.get(i);}
function trace(){if(!traces.has(state.selected))traces.set(state.selected,M.likelihoodTrace(model,model.a[state.selected],2048));return traces.get(state.selected);}
function cloud(){if(!population)population=M.samples(model,48).map(x=>M.integrate(model,x,'heun',1024).path);return population;}
function meshData(){
 if(!materialGrid){materialGrid=[];
  // A curve has several material points: its edges are not assumed to stay straight.
  for(let j=0;j<5;j++)materialGrid.push(Array.from({length:33},(_,i)=>[-1.15+i*2.3/32,-.7+j*.35]).map(x=>M.integrate(model,x,'heun',512).path));
  for(let i=0;i<7;i++)materialGrid.push(Array.from({length:25},(_,j)=>[-1.15+i*2.3/6,-.7+j*1.4/24]).map(x=>M.integrate(model,x,'heun',512).path));
 }
 const key=revision+':'+state.selected;
 if(meshCache?.key!==key){const a=model.a[state.selected],points=[];for(const [u,v,du,dv] of [[-1,-1,2,0],[1,-1,0,2],[1,1,-2,0],[-1,1,0,-2]])for(let k=0;k<5;k++)points.push([a[0]+.06*(u+du*k/5),a[1]+.06*(v+dv*k/5)]);
  const patch=points.map(x=>M.integrate(model,x,'heun',1024).path);meshCache={key,patch};
 }
 return{grid:materialGrid,cloud:cloud(),patch:meshCache.patch,trace:trace()};
}
function comparison(){const key=revision+':'+state.selected;if(comparisonCache?.key===key)return comparisonCache;const ref=reference();const rows=budgets.map(budget=>{const e=M.integrate(model,model.a[state.selected],'euler',budget),h=M.integrate(model,model.a[state.selected],'heun',budget/2);return{budget,e,h,eError:distance(e.end,ref.fine.end),hError:distance(h.end,ref.fine.end)};});return comparisonCache={key,rows};}
function areaProfiles(){const key=revision+':'+state.selected+':'+state.axis+':'+state.budget;if(areaCache?.key!==key)areaCache={key,profiles:[M.quadrature(model,model.a[state.selected],'euler',state.budget,state.axis),M.quadrature(model,model.a[state.selected],'heun',state.budget/2,state.axis)]};return areaCache.profiles;}
function setPairing(p){state.pairing=p;model.pi=Array.from({length:model.a.length},(_,i)=>p===1?(i+8)%model.a.length:p===2?model.a.length-1-i:i);invalidate();}
function setInitial(p){state.initial=p;const base=M.create();model.a=base.a.map((a,i)=>p===1?[Math.cos(i*2*Math.PI/model.a.length)*.88,Math.sin(i*2*Math.PI/model.a.length)*.62]:p===2?[a[0]*.45-.55,a[1]*.8]:a);invalidate();}
function pause(){if(activeSection==='cnf')state.playing=false;}
function chart(id,lines,opts={}){
 const canvas=$(id),r=canvas.getBoundingClientRect();if(r.width<1)return;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);const c=canvas.getContext('2d');c.scale(d,d);c.fillStyle='#fff';c.fillRect(0,0,r.width,r.height);
 const left=49,right=r.width-18,top=28,bottom=r.height-42,xlim=opts.xlim||[0,1],ylim=opts.ylim||[0,1];
 const map=p=>[left+(p[0]-xlim[0])/(xlim[1]-xlim[0])*(right-left),bottom-(p[1]-ylim[0])/(ylim[1]-ylim[0])*(bottom-top)];
 c.font='10px Arial';c.strokeStyle='#e4e9ed';c.fillStyle='#6d7d89';c.textAlign='right';
 for(const value of opts.yticks||[0,.5,1]){const y=map([0,value])[1];c.beginPath();c.moveTo(left,y);c.lineTo(right,y);c.stroke();c.fillText(opts.yformat?opts.yformat(value):String(value),left-7,y+3);}
 c.textAlign='center';for(const value of opts.xticks||[0,.5,1]){const x=map([value,0])[0];c.fillText(opts.xformat?opts.xformat(value):String(value),x,bottom+18);}
 c.fillText(opts.xlabel||tr('Time','시간'),(left+right)/2,r.height-7);c.textAlign='left';c.fillText(opts.ylabel||'',left,13);
 c.save();c.beginPath();c.rect(left,top,right-left,bottom-top);c.clip();
 for(const line of lines){c.strokeStyle=line.color;c.lineWidth=line.width||1.7;c.setLineDash(line.dash||[]);c.beginPath();line.points.forEach((p,i)=>{const [x,y]=map(p);i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();c.setLineDash([]);if(opts.dots)for(const p of line.points){c.beginPath();c.arc(...map(p),3,0,Math.PI*2);c.fillStyle=line.color;c.fill();}}
 if(opts.endpoints)for(const line of lines.filter(l=>!l.dash)){const p=line.points.at(-1);if(p){c.beginPath();c.arc(...map(p),3.5,0,Math.PI*2);c.fillStyle=line.color;c.fill();}}
 if(opts.mark!==undefined){const x=map([opts.mark,0])[0];c.strokeStyle='#8696a1';c.lineWidth=1;c.setLineDash([3,4]);c.beginPath();c.moveTo(x,top);c.lineTo(x,bottom);c.stroke();}c.restore();
}
function cnf(){
 const data=meshData(),r=S.mesh(model,{...state,revision},data),trc=data.trace;
 $('density-integrated').textContent=fmt(r.integrated,5);$('density-exact').textContent=fmt(r.direct,5);$('density-gap').textContent=Math.abs(r.integrated-r.direct).toExponential(2);cnfResult={...r,error:Math.abs(r.integrated-r.direct)};
 const all=Array.from({length:101},(_,k)=>{const t=k/100;return[t,M.scalarAt(trc.logp,t),M.logDensity(model,M.at(trc.path,t),t)];});
 const values=all.flatMap(p=>p.slice(1)),lo=Math.min(...values),hi=Math.max(...values),pad=Math.max(.08,(hi-lo)*.12),low=lo-pad,high=hi+pad;
 const points=all.filter(p=>p[0]<state.time);points.push([state.time,r.integrated,r.direct]);
 chart('density-chart',[{points:all.map(p=>[p[0],p[1]]),color:'#d0d9e2',width:1,dash:[2,4]},{points:points.map(p=>[p[0],p[1]]),color:V.blue,width:2.6},{points:points.map(p=>[p[0],p[2]]),color:V.red,width:1.2,dash:[4,4]}],{ylim:[low,high],yticks:[low,(low+high)/2,high],yformat:x=>fmt(x,2),ylabel:tr('Log density along the trajectory','궤적을 따른 로그밀도'),mark:state.time,endpoints:true});
}
function fm(){S.regression(model,{...state,revision});S.velocityLoss(model,state);$('fm-error').textContent=fmt(M.conditionalRisk(model,state.probe,state.time,state.prediction).excess,4);}
function cfm(){
 S.pairboard(model,state);
 const fieldFrame=V.frame($('field-canvas'));V.heat(fieldFrame,model,state.time,revision);
 for(let y=-.65;y<=.65;y+=.26)for(let x=-1.15;x<=1.15;x+=.28)V.arrow(fieldFrame,[x,y],M.field(model,[x,y],state.time),'#cad6df',.6,.22);
 const info=M.field(model,state.probe,state.time,true),rank=info.weights.map((w,i)=>({i,w})).sort((a,b)=>b.w-a.w),colors=['#ae4c54','#32877b','#9b73a9'];
 for(let j=2;j>=0;j--){const{i,w}=rank[j];V.arrow(fieldFrame,state.probe,info.components[i].map(v=>v*w),colors[j],2.2,.44);}V.arrow(fieldFrame,state.probe,info.v,V.blue,2.8,.44);V.dot(fieldFrame,state.probe,V.ink,4);
 $('weights').innerHTML=rank.slice(0,3).map(({i,w},j)=>'<div><span style="color:'+colors[j]+'">'+tr('Pair ','끝점 쌍 ')+(i+1)+'</span><span class="weight-track"><span style="width:'+(w*100)+'%;background:'+colors[j]+'"></span></span><output>'+fmt(w*100,1)+'%</output></div>').join('');
 $('field-live').textContent=tr('Probability in remaining pairs: ','나머지 끝점 쌍의 확률: ')+fmt(Math.max(0,1-rank.slice(0,3).reduce((a,b)=>a+b.w,0))*100,1)+'%';
 const risk=S.loss(model,state);lossRange=risk.range;$('risk-total').textContent=fmt(risk.total,4);$('risk-excess').textContent=fmt(risk.excess,4);$('risk-variance').textContent=fmt(risk.irreducible,4);
}
function solver(){
 if(!$('solver-details').open)return;
 const f=V.frame($('solver-canvas')),ref=reference(),rows=comparison().rows,{e,h}=rows.find(r=>r.budget===state.budget);
 V.line(f,ref.fine.path,'#9ba8b2',1.5,[4,4]);V.line(f,e.path,V.red,1.8);V.line(f,h.path,V.blue,1.8);for(const p of e.path)V.dot(f,p,V.red,1.5);for(const p of h.path)V.dot(f,p,V.blue,1.5);V.dot(f,model.a[state.selected],V.ink,4);V.dot(f,e.end,V.red,4);V.dot(f,h.end,V.blue,4);
 const eError=distance(e.end,ref.fine.end),hError=distance(h.end,ref.fine.end);$('euler-error').textContent=eError.toExponential(2);$('heun-error').textContent=hError.toExponential(2);$('reference-check').textContent=ref.delta.toExponential(2);$('solver-live').textContent='Euler: '+state.budget+tr(' steps','단계')+' · Heun: '+state.budget/2+tr(' steps','단계')+' · '+state.budget+tr(' evaluations each','회씩 평가');
 const all=rows.flatMap(r=>[Math.log10(Math.max(1e-12,r.eError)),Math.log10(Math.max(1e-12,r.hError))]),low=Math.floor(Math.min(...all)),high=Math.max(low+1,Math.ceil(Math.max(...all))),ticks=Array.from({length:high-low+1},(_,i)=>low+i);
 chart('error-chart',[{points:rows.map(r=>[Math.log2(r.budget),Math.log10(Math.max(1e-12,r.eError))]),color:V.red},{points:rows.map(r=>[Math.log2(r.budget),Math.log10(Math.max(1e-12,r.hError))]),color:V.blue}],{xlim:[4,8],ylim:[low,high],xticks:[4,5,6,7,8],yticks:ticks.filter((_,i)=>i%Math.ceil(ticks.length/5)===0),xformat:x=>String(2**x),yformat:y=>'1e'+y,xlabel:tr('Field evaluations','속도장 평가 횟수'),ylabel:tr('Endpoint error','끝점 오차'),mark:Math.log2(state.budget),dots:true});
 solverResult={eError,hError,referenceDelta:ref.delta,eulerNfe:e.nfe,heunNfe:h.nfe};const profiles=areaProfiles();S.quadrature(model,state,ref,profiles);$('euler-area').textContent=fmt(profiles[0].area,5);$('heun-area').textContent=fmt(profiles[1].area,5);$('reference-area').textContent=fmt(ref.fine.end[state.axis]-model.a[state.selected][state.axis],5);
}
function sync(){
 $('header-play').hidden=activeSection!=='cnf';$('header-play').textContent=state.playing?'Ⅱ':'▶';$('header-play').setAttribute('aria-label',state.playing?tr('Pause animation','애니메이션 일시정지'):tr('Play animation','애니메이션 재생'));
 $('play-toggle').textContent=state.playing?tr('Pause','일시정지'):tr('Play','재생');$('play-toggle').setAttribute('aria-pressed',String(state.playing));$('speed').value=state.speed;
 if(optionLanguage!==DiffusionI18n.language){optionLanguage=DiffusionI18n.language;
  $('pairing').innerHTML=tr(['Original pairing','Shift destinations','Reverse destinations','Custom pairing'],['기본 대응','도착점 순환','도착점 역순','직접 지정']).map((name,i)=>'<option value="'+i+'"'+(i===3?' disabled':'')+'>'+name+'</option>').join('');
  $('initial').innerHTML=tr(['Scattered centers','Ring of centers','Compact centers'],['흩어진 중심','고리 배치','밀집 배치']).map((name,i)=>'<option value="'+i+'">'+name+'</option>').join('');
  $('coordinate').options[0].textContent=tr('Horizontal','가로');$('coordinate').options[1].textContent=tr('Vertical','세로');
 }
 $('pairing').value=state.pairing;$('initial').value=state.initial;$('coordinate').value=state.axis;$('budget').value=state.budget;
 document.querySelectorAll('.time-control').forEach(e=>e.value=state.time);document.querySelectorAll('[data-time]').forEach(e=>e.textContent=fmt(state.time));document.querySelectorAll('.piece-select').forEach(e=>e.value=state.selected);$('destination').value=model.pi[state.selected];
 const offset=state.prediction[0]-M.field(model,state.probe,state.time)[0];$('candidate-offset').min=-Math.max(2,Math.ceil(Math.abs(offset)));$('candidate-offset').max=Math.max(2,Math.ceil(Math.abs(offset)));$('candidate-offset').value=offset;$('candidate-offset-out').textContent=fmt(offset,2);
 for(const[j,axis]of ['x','y'].entries()){const range=Math.max(2,Math.ceil(Math.abs(state.prediction[j])));$('prediction-'+axis).min=-range;$('prediction-'+axis).max=range;$('prediction-'+axis).value=state.prediction[j];$('prediction-'+axis+'-out').textContent=fmt(state.prediction[j],2);}
 highlight(state.active);
}
function visible(id){const r=$(id).getBoundingClientRect();return r.bottom>0&&r.top<innerHeight+160;}
function render(all=false){sync();if(!dragging&&(all||visible('cnf')))cnf();if(all||visible('fm'))fm();if(all||visible('cfm'))cfm();if(!dragging&&(all||visible('solver')))solver();}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
function tick(now){const dt=lastTick?Math.min((now-lastTick)/1000,.1):0;lastTick=now;
 if(state.playing&&activeSection==='cnf'&&visible('mesh-canvas')&&!document.hidden){state.time=(state.time+dt*state.speed/20)%1;if(now-lastDraw>100){lastDraw=now;highlight('density-integral');render();}}
 requestAnimationFrame(tick);
}
for(const id of ['play-toggle','header-play'])$(id).addEventListener('click',()=>{state.playing=!state.playing;schedule();});
$('replay').addEventListener('click',()=>{state.time=0;state.playing=true;schedule();});$('speed').addEventListener('change',()=>{state.speed=Number($('speed').value);});
for(const el of document.querySelectorAll('.time-control'))el.addEventListener('input',()=>{pause();state.time=Number(el.value);highlight(activeSection==='cnf'?'density-integral':'time');schedule();});
for(const el of document.querySelectorAll('.piece-select'))el.addEventListener('change',()=>{state.selected=Number(el.value);highlight(activeSection==='cnf'?'initial-density':'connection');schedule();});
$('pairing').addEventListener('change',()=>{setPairing(Number($('pairing').value));highlight('connection');schedule();});$('initial').addEventListener('change',()=>{setInitial(Number($('initial').value));highlight('connection');schedule();});
$('destination').addEventListener('change',()=>{M.swap(model,state.selected,Number($('destination').value));state.pairing=3;invalidate();highlight('connection');schedule();});
for(const[j,axis]of ['x','y'].entries())$('prediction-'+axis).addEventListener('input',()=>{state.prediction[j]=Number($('prediction-'+axis).value);highlight('prediction');schedule();});
for(const id of ['use-target','use-mean'])$(id).addEventListener('click',()=>{state.prediction=M.field(model,state.probe,state.time);highlight('prediction');schedule();});
$('sample-position').addEventListener('click',()=>{state.sampleSeed++;const n=state.sampleSeed;state.time=((n*37)%97+1)/100;const pair=M.trainingPair(model,state.time,n%model.a.length,n);state.probe=pair.position;highlight('target');schedule();});
$('candidate-offset').addEventListener('input',()=>{state.prediction[0]=M.field(model,state.probe,state.time)[0]+Number($('candidate-offset').value);highlight('prediction');schedule();});
let dragStage=0;const planCanvas=$('plan-canvas');planCanvas.addEventListener('pointerdown',e=>{const hit=S.pairPoint(e),p=hit.point,all=model.a.map((_,i)=>({i,d:distance(hit.stage===0?model.a[i]:hit.stage===2?model.b[model.pi[i]]:M.component(model,i,state.time).mu,p)})).sort((a,b)=>a.d-b.d);if(all[0].d>.19)return;state.selected=all[0].i;dragging=hit.stage===0||(hit.stage===1&&state.time<.001);if(dragging){dragStage=hit.stage;planCanvas.setPointerCapture(e.pointerId);}highlight('connection');schedule();});
planCanvas.addEventListener('pointermove',e=>{if(!dragging)return;const p=S.pairPoint(e,dragStage).point;model.a[state.selected]=[Math.max(-1.18,Math.min(1.18,p[0])),Math.max(-.7,Math.min(.7,p[1]))];invalidate();schedule();});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])planCanvas.addEventListener(ev,()=>{if(dragging){dragging=false;schedule();}});
const fmCanvas=$('fm-canvas');let movingPrediction=false;
function changePrediction(e){const p=V.point(fmCanvas,e);state.prediction=p.map((x,j)=>Math.max(-2,Math.min(2,(x-state.probe[j])/.38)));highlight('prediction');schedule();}
fmCanvas.addEventListener('pointerdown',e=>{const p=V.point(fmCanvas,e),tip=state.probe.map((x,j)=>x+.38*state.prediction[j]);if(distance(p,tip)<.12){movingPrediction=true;fmCanvas.setPointerCapture(e.pointerId);changePrediction(e);}else{state.probe=p;highlight('target');schedule();}});
fmCanvas.addEventListener('pointermove',e=>{if(movingPrediction)changePrediction(e);});for(const ev of ['pointerup','pointercancel','lostpointercapture'])fmCanvas.addEventListener(ev,()=>movingPrediction=false);
const velocityCanvas=$('velocity-canvas');let draggingVelocity=false;
function setVelocity(e){state.prediction=S.velocityPoint(e);highlight('prediction');schedule();}
velocityCanvas.addEventListener('pointerdown',e=>{draggingVelocity=true;velocityCanvas.setPointerCapture(e.pointerId);setVelocity(e);});
velocityCanvas.addEventListener('pointermove',e=>{if(draggingVelocity)setVelocity(e);});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])velocityCanvas.addEventListener(ev,()=>draggingVelocity=false);
velocityCanvas.addEventListener('keydown',e=>{const d={ArrowLeft:[-.03,0],ArrowRight:[.03,0],ArrowUp:[0,-.03],ArrowDown:[0,.03]}[e.key];if(!d)return;e.preventDefault();state.prediction=state.prediction.map((x,j)=>x+d[j]);highlight('prediction');schedule();});
$('field-canvas').addEventListener('pointerdown',e=>{state.probe=V.point($('field-canvas'),e);highlight('probe');schedule();});
$('loss-canvas').addEventListener('pointerdown',e=>{const r=$('loss-canvas').getBoundingClientRect(),offset=Math.max(-lossRange,Math.min(lossRange,((e.clientX-r.left-48)/(r.width-70)*2-1)*lossRange));state.prediction[0]=M.field(model,state.probe,state.time)[0]+offset;highlight('prediction');schedule();});
for(const[id,kind]of [['plan-canvas','connection'],['fm-canvas','target'],['field-canvas','probe'],['loss-canvas','prediction']])$(id).addEventListener('keydown',e=>{const delta={ArrowLeft:[-.03,0],ArrowRight:[.03,0],ArrowUp:[0,-.03],ArrowDown:[0,.03]}[e.key];if(!delta)return;e.preventDefault();
 if(kind==='connection'){model.a[state.selected]=model.a[state.selected].map((x,j)=>Math.max(j?-.7:-1.18,Math.min(j?.7:1.18,x+delta[j])));invalidate();}
 else if(kind==='prediction')state.prediction[0]+=delta[0];else state.probe=state.probe.map((x,j)=>x+delta[j]);highlight(kind);schedule();});
$('budget').addEventListener('change',()=>{state.budget=Number($('budget').value);highlight('euler');schedule();});$('coordinate').addEventListener('change',()=>{state.axis=Number($('coordinate').value);highlight('integral');schedule();});
const quad=$('quadrature-canvas');quad.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&!e.buttons)return;const r=quad.getBoundingClientRect();state.time=Math.max(0,Math.min(.9999,(e.clientX-r.left-48)/(r.width-68)));highlight(e.clientY-r.top<r.height/2?'euler':'correct');schedule();});quad.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();state.time=Math.max(0,Math.min(.9999,state.time+(e.key==='ArrowLeft'?-1:1)/state.budget));highlight('integral');schedule();});
$('solver-details').addEventListener('toggle',schedule);
function updateSection(){let best='';for(const section of document.querySelectorAll('section.chapter')){if(section.id==='notes')continue;const r=section.getBoundingClientRect();if(r.top<innerHeight*.45&&r.bottom>100)best=section.id;}
 if(best)activeSection=best;document.querySelectorAll('.contents a').forEach(a=>a.classList.toggle('active',a.hash==='#'+activeSection));schedule();}
window.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;$('reading-progress').style.width=(h?scrollY/h*100:0)+'%';updateSection();},{passive:true});
for(const event of ['diffusionlanguagechange','puzzlephotoload','resize'])window.addEventListener(event,()=>{optionLanguage='';schedule();});
window.FlowLab={snapshot:()=>({...state,probe:state.probe.slice(),prediction:state.prediction.slice(),model:JSON.parse(JSON.stringify(model)),revision,activeSection,loaded:V.loaded,cnf:cnfResult,risk:M.conditionalRisk(model,state.probe,state.time,state.prediction),solver:solverResult,areas:areaProfiles().map(p=>({area:p.area,displacement:p.displacement,nfe:p.nfe}))}),highlight};
render();updateSection();requestAnimationFrame(tick);
})();
