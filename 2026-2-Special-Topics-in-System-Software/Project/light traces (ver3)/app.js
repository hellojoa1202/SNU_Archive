/* Shared rendering and state for both languages. */
'use strict';
const M=LightMath,$=id=>document.getElementById(id),BLUE='#73b9df',RED='#ae4c54',INK='#344652',GREY='#84919c';
const korean=document.documentElement.lang==='ko',say=(en,ko)=>korean?ko:en;
let state={time:.6,particle:0,px:.6,py:.4,bias:0,steps:512,window:'all',seed:17};
try{const saved=JSON.parse(sessionStorage.getItem('light-ver3')||'null');if(saved){for(const key of Object.keys(state))if(typeof saved[key]===typeof state[key])state[key]=saved[key];}}catch{}
state.time=Math.max(.05,Math.min(.95,state.time));state.particle=Math.max(0,Math.min(383,Math.round(state.particle)));state.px=Math.max(-1.5,Math.min(1.5,state.px));state.py=Math.max(-1.5,Math.min(1.5,state.py));state.bias=Math.max(-.8,Math.min(.8,state.bias));if(![32,128,512,1024].includes(state.steps))state.steps=512;if(!['all','early','late'].includes(state.window))state.window='all';
let data,base,reference,errorResult,worker,job=0,playing=false,last=0,highlightTimer,geometryMap,frameMaps={},errorTimer,errorPlot=null,errorPending=true,errorConfig=null,cacheHit=false;
const save=()=>{try{sessionStorage.setItem('light-ver3',JSON.stringify(state));}catch{}};
function emphasize(scope,keys){
 document.querySelectorAll('[data-term]').forEach(e=>e.classList.toggle('active',scope.contains(e)&&keys.includes(e.dataset.term)));
 clearTimeout(highlightTimer);highlightTimer=setTimeout(()=>document.querySelectorAll('.active[data-term]').forEach(e=>e.classList.remove('active')),1600);
}
function highlight(...keys){emphasize(document,keys);}
function highlightError(...keys){emphasize($('approximation'),keys);}
function sync(){for(const[id,value]of Object.entries({time:state.time,'geo-time':state.time,'error-time':state.time,'bonus-time':state.time,particle:state.particle+1,'bonus-particle':state.particle+1,'probe-x':state.px,'probe-y':state.py,bias:state.bias,steps:state.steps,window:state.window})){$(id).value=value;if($(id+'-out'))$(id+'-out').textContent=['particle','bonus-particle'].includes(id)?value:Number(value).toFixed(id.includes('time')?3:2);}}
function context(id){const c=$(id),w=c.clientWidth,h=c.clientHeight,d=Math.min(devicePixelRatio||1,2);if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);}const ctx=c.getContext('2d');ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.font='10px system-ui';ctx.lineWidth=1;return{c,ctx,w,h};}
function plane(id,bound=2.8,labels=['x','y']){const q=context(id),{ctx,w,h}=q,pad=25,scale=Math.min(w-2*pad,h-2*pad)/(2*bound),cx=w/2,cy=h/2,xy=p=>[cx+p[0]*scale,cy-p[1]*scale];ctx.strokeStyle='#e5e9ed';ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(w-pad,cy);ctx.moveTo(cx,pad);ctx.lineTo(cx,h-pad);ctx.stroke();ctx.fillStyle='#87939d';ctx.fillText(labels[0],w-pad+5,cy+3);ctx.fillText(labels[1],cx+5,14);ctx.fillText('0',cx+5,cy+13);for(const v of[-2,-1,1,2]){if(Math.abs(v)>=bound)continue;const px=xy([v,0]);ctx.beginPath();ctx.moveTo(px[0],cy-2);ctx.lineTo(px[0],cy+2);ctx.stroke();ctx.fillText(v,px[0]-3,cy+13);}return{...q,xy,scale,bound,unmap:(x,y)=>[(x-cx)/scale,(cy-y)/scale]};}
function dot(p,x,color,r=2){const q=p.xy(x);p.ctx.fillStyle=color;p.ctx.beginPath();p.ctx.arc(q[0],q[1],r,0,2*Math.PI);p.ctx.fill();}
function line(p,a,b,color,width=1,dash=[]){const{ctx}=p,x=p.xy(a),y=p.xy(b);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(...x);ctx.lineTo(...y);ctx.stroke();ctx.setLineDash([]);}
function arrow(p,a,b,color,width=1.5){line(p,a,b,color,width);const x=p.xy(a),y=p.xy(b),angle=Math.atan2(y[1]-x[1],y[0]-x[0]);if(Math.hypot(y[0]-x[0],y[1]-x[1])<3)return;const{ctx}=p;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...y);ctx.lineTo(y[0]-6*Math.cos(angle-.4),y[1]-6*Math.sin(angle-.4));ctx.lineTo(y[0]-6*Math.cos(angle+.4),y[1]-6*Math.sin(angle+.4));ctx.closePath();ctx.fill();}
function contours(p,t){const n=33,B=p.bound,grid=[];let max=0;for(let j=0;j<=n;j++){grid[j]=[];for(let i=0;i<=n;i++){const z=M.density([-B+2*B*i/n,-B+2*B*j/n],t);grid[j][i]=z;max=Math.max(max,z);}}
 const {ctx}=p;ctx.save();ctx.strokeStyle='#b8c1c9';ctx.lineWidth=.75;ctx.setLineDash([2,4]);
 for(const level of[.18,.5,.82].map(q=>q*max))for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const vs=[grid[j][i],grid[j][i+1],grid[j+1][i+1],grid[j+1][i]],cs=[[i,j],[i+1,j],[i+1,j+1],[i,j+1]],hits=[];
  for(let e=0;e<4;e++){const f=(e+1)%4;if((vs[e]<level)===(vs[f]<level))continue;const s=(level-vs[e])/(vs[f]-vs[e]);hits.push(cs[e].map((a,d)=>-B+2*B*(a+s*(cs[f][d]-a))/n));}
  for(let z=0;z+1<hits.length;z+=2){ctx.beginPath();ctx.moveTo(...p.xy(hits[z]));ctx.lineTo(...p.xy(hits[z+1]));ctx.stroke();}
 }ctx.restore();}
function cloud(id,points,t,color,selected=-1){const p=plane(id);contours(p,t);let out=0;p.ctx.save();p.ctx.beginPath();p.ctx.rect(20,20,p.w-40,p.h-40);p.ctx.clip();points.forEach((x,i)=>{const pixel=p.xy(x);if(pixel[0]<20||pixel[0]>p.w-20||pixel[1]<20||pixel[1]>p.h-20)out++;dot(p,x,color+'c4',1.7);});if(selected>=0){const q=p.xy(points[selected]);p.ctx.strokeStyle=INK;p.ctx.lineWidth=1.3;p.ctx.beginPath();p.ctx.arc(...q,5,0,2*Math.PI);p.ctx.stroke();}p.ctx.restore();p.ctx.fillStyle=GREY;p.ctx.fillText('t = '+t.toFixed(3),8,p.h-5);if(out)p.ctx.fillText(say('Outside frame : ','화면 밖 : ')+out,p.w-115,p.h-5);frameMaps[id]={p,points};}
function trace(id,paths,frame,color){const selected=paths[state.particle],path=selected.slice(0,frame.index+1),B=Math.max(1.6,...base.sde[state.particle].map(q=>Math.max(Math.abs(q[0]),Math.abs(q[1]))),...base.ode[state.particle].map(q=>Math.max(Math.abs(q[0]),Math.abs(q[1]))))+.2,p=plane(id,B);
 p.ctx.lineWidth=1.1;p.ctx.strokeStyle=color;p.ctx.beginPath();path.forEach((x,i)=>{const q=p.xy(x);i?p.ctx.lineTo(...q):p.ctx.moveTo(...q);});p.ctx.stroke();dot(p,path[0],'#fff',3);p.ctx.strokeStyle=GREY;p.ctx.beginPath();p.ctx.arc(...p.xy(path[0]),3,0,2*Math.PI);p.ctx.stroke();dot(p,path.at(-1),color,3);p.ctx.fillStyle=GREY;p.ctx.fillText(say('Light ','광점 ')+(state.particle+1),8,p.h-5);}
function plot(id,xmin,xmax,ymax){const p=context(id),left=39,right=p.w-14,top=15,bottom=p.h-28,xy=(x,y)=>[left+(right-left)*(x-xmin)/(xmax-xmin),bottom-(bottom-top)*y/ymax];p.ctx.strokeStyle='#e1e6eb';p.ctx.beginPath();p.ctx.moveTo(left,top);p.ctx.lineTo(left,bottom);p.ctx.lineTo(right,bottom);p.ctx.stroke();p.ctx.fillStyle=GREY;for(let j=0;j<=2;j++){const v=ymax*j/2,y=xy(0,v)[1];p.ctx.fillText(v.toFixed(2),3,y+3);}return {...p,xy,left,right,top,bottom};}
function curve(p,points,color,dash=[],width=1.5){const{ctx}=p;ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();points.forEach((q,i)=>{const pt=p.xy(q[0],q[1]);i?ctx.lineTo(...pt):ctx.moveTo(...pt);});ctx.stroke();ctx.setLineDash([]);}
function densityPlot(s,o){const n=32,lo=-2.8,hi=2.8,dx=(hi-lo)/n,hs=Array(n).fill(0),ho=Array(n).fill(0);for(const [pts,arr]of[[s.points,hs],[o.points,ho]])pts.forEach(q=>{const i=Math.floor((q[0]-lo)/dx);if(i>=0&&i<n)arr[i]+=1/pts.length/dx;});const ref=Array.from({length:161},(_,i)=>{const x=lo+(hi-lo)*i/160;return[x,M.projection(x,s.time)];}),ymax=Math.max(...hs,...ho,...ref.map(q=>q[1]))*1.15,p=plot('density',lo,hi,ymax);
 for(const[arr,c]of[[hs,BLUE],[ho,RED]]){const pts=[];arr.forEach((y,i)=>{pts.push([lo+i*dx,y],[lo+(i+1)*dx,y]);});curve(p,pts,c+'b0',[],1.2);}curve(p,ref,INK,[4,4]);for(const x of[-2,-1,0,1,2])p.ctx.fillText(x,p.xy(x,0)[0]-3,p.h-9);
 for(const[f,c]of[[s,BLUE],[o,RED]]){const x=f.points[state.particle][0];if(x<lo||x>hi)continue;const px=p.xy(x,0)[0];p.ctx.strokeStyle=c;p.ctx.lineWidth=2;p.ctx.beginPath();p.ctx.moveTo(px,p.bottom-11);p.ctx.lineTo(px,p.bottom+2);p.ctx.stroke();}
}
// The everyday reading reuses the exact experiment; it adds no crowd dynamics.
function drawOccupancy(s,o){
 const pathS=base.sde[state.particle],pathO=base.ode[state.particle];
 const bound=Math.max(2.8,...pathS.flatMap(q=>q.map(Math.abs)),...pathO.flatMap(q=>q.map(Math.abs)))+.15;
 function floor(id){const p=context(id),pad=24,scale=Math.min(p.w-2*pad,p.h-2*pad)/(2*bound);
  p.xy=q=>[p.w/2+q[0]*scale,p.h/2-q[1]*scale];
  p.ctx.strokeStyle='#e1e6eb';p.ctx.strokeRect(pad,pad,p.w-2*pad,p.h-2*pad);
  p.ctx.save();p.ctx.strokeStyle='#edf0f3';p.ctx.setLineDash([2,5]);
  for(let i=1;i<5;i++){const x=pad+(p.w-2*pad)*i/5;p.ctx.beginPath();p.ctx.moveTo(x,pad);p.ctx.lineTo(x,p.h-pad);p.ctx.stroke();}
  p.ctx.restore();
  p.ctx.fillStyle=GREY;p.ctx.fillText(say('CONCOURSE · SCHEMATIC PLAN','대합실 · 개념 평면도'),pad,14);
  // Two entrance marks are schematic context, not boundary conditions.
  p.ctx.strokeStyle='#aab8c2';p.ctx.lineWidth=2;
  for(const x of [p.w*.32,p.w*.68]){p.ctx.beginPath();p.ctx.moveTo(x-12,pad);p.ctx.lineTo(x+12,pad);p.ctx.stroke();}
  p.ctx.fillStyle=GREY;p.ctx.fillText('t : '+o.time.toFixed(3),pad,p.h-7);
  p.ctx.save();p.ctx.beginPath();p.ctx.rect(pad,pad,p.w-2*pad,p.h-2*pad);p.ctx.clip();return p;
 }
 const a=floor('occupancy-map');
 o.points.forEach(q=>dot(a,q,RED+'75',1.8));
 const current=a.xy(o.points[state.particle]);a.ctx.strokeStyle=INK;a.ctx.beginPath();a.ctx.arc(...current,6,0,2*Math.PI);a.ctx.stroke();a.ctx.restore();
 const b=floor('occupancy-track');
 for(const [path,frame,color] of [[pathS,s,BLUE],[pathO,o,RED]]){
  b.ctx.strokeStyle=color;b.ctx.lineWidth=1.4;b.ctx.beginPath();
  path.slice(0,frame.index+1).forEach((q,i)=>{const xy=b.xy(q);i?b.ctx.lineTo(...xy):b.ctx.moveTo(...xy);});b.ctx.stroke();
  const end=b.xy(path[frame.index]);b.ctx.beginPath();b.ctx.arc(...end,4,0,2*Math.PI);b.ctx.stroke();
 }
 dot(b,pathO[0],INK,3);b.ctx.restore();
}
function drawExact(){if(!base)return;const s=M.frame(base.sde,state.time),o=M.frame(base.ode,state.time);cloud('sde',s.points,s.time,BLUE,state.particle);cloud('ode',o.points,o.time,RED,state.particle);trace('trail-sde',base.sde,s,BLUE);trace('trail-ode',base.ode,o,RED);densityPlot(s,o);drawOccupancy(s,o);drawGeometry();drawErrors();}
function drawGeometry(){const x=[state.px,state.py],t=state.time,result=M.conditional(x,t),terms=M.terms(x,t),p=plane('geometry',2.2);geometryMap=p;contours(p,t);p.ctx.save();p.ctx.beginPath();p.ctx.rect(20,20,p.w-40,p.h-40);p.ctx.clip();for(const c of result.candidates){const a=c.e.map((q,j)=>.95*q+.05*c.y[j]),b=c.e.map((q,j)=>.05*q+.95*c.y[j]);line(p,a,b,'rgba(115,185,223,'+(.12+c.weight*2.4)+')',1);dot(p,b,BLUE+'55',1.6);}arrow(p,x,x.map((q,j)=>q+.28*result.mean[j]),RED,2.2);dot(p,x,INK,3.3);p.ctx.restore();p.ctx.fillStyle=GREY;p.ctx.fillText(say('Position space','위치 공간'),8,p.h-5);
 const B=Math.max(1,...result.candidates.map(c=>Math.max(...c.u.map(Math.abs))),...terms.linear.map(Math.abs),...terms.correction.map(Math.abs))*1.22,vp=plane('velocity',B,['vₓ','vᵧ']);for(const c of result.candidates)arrow(vp,[0,0],c.u,'rgba(104,117,130,'+(.13+c.weight*2.6)+')',1);line(vp,[0,0],terms.linear,BLUE+'b0',1.3,[4,3]);line(vp,terms.linear,terms.v,BLUE+'b0',1.3,[4,3]);arrow(vp,[0,0],result.mean,RED,2);vp.ctx.strokeStyle=BLUE;vp.ctx.lineWidth=1.7;vp.ctx.beginPath();vp.ctx.arc(...vp.xy(terms.v),6,0,Math.PI*2);vp.ctx.stroke();vp.ctx.fillStyle=GREY;vp.ctx.fillText(say('Velocity space','속도 공간'),8,vp.h-5);vp.ctx.fillText('±'+B.toFixed(1),vp.w-45,vp.h-5);
 $('schedule-readout').textContent='a : '+(1-t).toFixed(3)+'  ·  b : '+t.toFixed(3)+'  ·  '+say('Observation','관측점')+' : ('+x.map(q=>q.toFixed(2)).join(', ')+')';
 const difference=Math.hypot(...result.mean.map((q,j)=>q-terms.v[j]));$('mean-readout').textContent=say('Mean velocity','평균 속도')+' : ('+result.mean.map(q=>q.toFixed(3)).join(', ')+')  ·  '+say('Difference between constructions','두 계산의 차이')+' : '+difference.toExponential(1)+'  ·  '+say('Dashed sky blue : linear term, then score term','하늘색 점선 : 선형항, 이어서 score 항');}
function drawErrors(){
 if(!errorResult||!base)return;
 const frames={sde:M.packedFrame(errorResult.sde,state.time),ode:M.packedFrame(errorResult.ode,state.time)},t=frames.sde.time;
 for(const[k,c]of[['sde',BLUE],['ode',RED]]){
  cloud('reference-'+k,M.frame(base[k],t).points,t,c);
  cloud('error-'+k,frames[k].points,t,c);
 }
 const ymax=Math.max(.08,...['sde','ode'].flatMap(k=>[...errorResult[k].curve,...reference[k]].map(q=>q.d)))*1.15,p=plot('errors',.05,.95,ymax);errorPlot=p;
 // Show the interval where the selected bias is active, without a filled background.
 if(errorConfig&&errorConfig.bias!==0){const lo=errorConfig.window==='late'?.5:.05,hi=errorConfig.window==='early'?.5:.95;
  p.ctx.strokeStyle='#9aa7b1';p.ctx.lineWidth=2;p.ctx.beginPath();p.ctx.moveTo(p.xy(lo,0)[0],p.top+2);p.ctx.lineTo(p.xy(hi,0)[0],p.top+2);p.ctx.stroke();
 }
 for(const[k,c]of[['sde',BLUE],['ode',RED]]){
  curve(p,reference[k].map(q=>[q.t,q.d]),c+'65',[4,4],1);
  curve(p,errorResult[k].curve.map(q=>[q.t,q.d]),c,[],1.8);
  const d=M.discrepancy(frames[k].points,t),q=p.xy(t,d);p.ctx.fillStyle=c;p.ctx.beginPath();p.ctx.arc(...q,3.3,0,2*Math.PI);p.ctx.fill();
 }
 const x=p.xy(t,0)[0];p.ctx.strokeStyle='#536777';p.ctx.lineWidth=1;p.ctx.setLineDash([3,3]);p.ctx.beginPath();p.ctx.moveTo(x,p.top+7);p.ctx.lineTo(x,p.bottom);p.ctx.stroke();p.ctx.setLineDash([]);
 p.ctx.fillStyle=GREY;for(const x of[.05,.25,.5,.75,.95])p.ctx.fillText(x.toFixed(2),p.xy(x,0)[0]-9,p.h-9);
 $('error-readout').textContent=say('Displayed grid time','표시된 격자 시각')+' : '+t.toFixed(4)+' · '+say('Projected CDF distance','투영 CDF 거리')+' : SDE '+M.discrepancy(frames.sde.points,t).toFixed(4)+' · ODE '+M.discrepancy(frames.ode.points,t).toFixed(4);
}
function buildBase(){data=M.dataset(384,state.seed);base={sde:M.solve(data,{kind:'sde',steps:1024}),ode:M.solve(data,{kind:'ode',steps:1024})};reference={sde:M.errorCurve(base.sde),ode:M.errorCurve(base.ode)};drawExact();}
function pending(){
 errorPending=true;$('comparison-views').setAttribute('aria-busy','true');$('errors').classList.add('pending');
 $('status').textContent=say('Updating the comparison…','비교 결과를 갱신하는 중…');
 $('step-readout').textContent=say('Requested steps','선택한 스텝 수')+' : '+state.steps+' · Δs, h : '+((M.T1-M.T0)/state.steps).toFixed(6);
}
function calculate(){
 const id=++job,config={id,seed:state.seed,bias:state.bias,window:state.window,steps:state.steps};pending();
 if(worker){worker.postMessage(config);return;}
 setTimeout(()=>{
  const result={};for(const kind of ['sde','ode'])result[kind]=M.pack(M.solve(data,{kind,bias:config.bias,window:config.window,steps:config.steps}));
  accept({id,result,config,cached:false});
 },20);
}
function accept({id,result,config,cached}){
 if(id!==job)return;
 errorResult=result;errorConfig=config;cacheHit=!!cached;errorPending=false;
 $('comparison-views').setAttribute('aria-busy','false');$('errors').classList.remove('pending');drawErrors();
 $('status').textContent=say('Shared initial samples and noise · ','초기 표본과 난수 공유 · ')+config.steps+say(' steps · bias : ','스텝 · 편향 : ')+Number(config.bias).toFixed(2);
 $('step-readout').textContent=say('Steps','스텝 수')+' : '+config.steps+' · Δs, h : '+((M.T1-M.T0)/config.steps).toFixed(6);
}
try{worker=new Worker('../worker.js');worker.onmessage=e=>accept(e.data);worker.onerror=()=>{worker.terminate();worker=null;calculate();};}catch{worker=null;}
function clock(value){state.time=Number(value);sync();drawExact();highlight('time','probe','linear','score','noise');save();}
for(const id of ['time','geo-time','error-time','bonus-time'])$(id).addEventListener('input',e=>{setPlay(false);clock(e.target.value);});
for(const id of ['particle','bonus-particle'])$(id).addEventListener('input',e=>{state.particle=Number(e.target.value)-1;sync();drawExact();save();});
for(const[id,key]of[['probe-x','px'],['probe-y','py']])$(id).addEventListener('input',e=>{state[key]=Number(e.target.value);sync();drawGeometry();highlight('probe','linear','score');save();});
for(const[id,key]of[['bias','bias'],['steps','steps'],['window','window']])$(id).addEventListener(id==='bias'?'input':'change',e=>{state[key]=key==='window'?e.target.value:Number(e.target.value);sync();highlightError(key==='steps'?'steps':'bias');save();pending();clearTimeout(errorTimer);++job;errorTimer=setTimeout(calculate,160);});
$('reset').onclick=()=>{state.bias=0;state.steps=512;state.window='all';sync();save();highlightError('bias','steps');clearTimeout(errorTimer);calculate();};
$('resample').onclick=()=>{setPlay(false);state.seed+=101;++job;clearTimeout(errorTimer);errorResult=null;pending();$('resample').disabled=true;$('status').textContent=say('Sampling…','표본 생성 중…');setTimeout(()=>{buildBase();calculate();save();$('resample').disabled=false;},30);};
for(const id of ['sde','ode'])$(id).addEventListener('click',e=>{const q=frameMaps[id],r=e.currentTarget.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let nearest=0,d=Infinity;q.points.forEach((p,i)=>{const z=q.p.xy(p),dd=(z[0]-x)**2+(z[1]-y)**2;if(dd<d){d=dd;nearest=i;}});state.particle=nearest;sync();drawExact();save();});
function probe(e){const r=$('geometry').getBoundingClientRect(),v=geometryMap.unmap(e.clientX-r.left,e.clientY-r.top);state.px=Math.max(-1.5,Math.min(1.5,v[0]));state.py=Math.max(-1.5,Math.min(1.5,v[1]));sync();drawGeometry();highlight('probe','linear','score');save();}
$('geometry').addEventListener('pointerdown',e=>{setPlay(false);e.currentTarget.setPointerCapture(e.pointerId);probe(e);});$('geometry').addEventListener('pointermove',e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))probe(e);});$('geometry').addEventListener('pointerup',e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);});
function selectErrorTime(e){
 if(!errorPlot)return;const r=$('errors').getBoundingClientRect(),fraction=(e.clientX-r.left-errorPlot.left)/(errorPlot.right-errorPlot.left);
 setPlay(false);clock(M.T0+(M.T1-M.T0)*Math.max(0,Math.min(1,fraction)));
}
$('errors').addEventListener('pointerdown',e=>{e.currentTarget.setPointerCapture(e.pointerId);selectErrorTime(e);});
$('errors').addEventListener('pointermove',e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))selectErrorTime(e);});
$('errors').addEventListener('pointerup',e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);});
function setPlay(value){playing=value;last=0;$('play').textContent=value?say('Pause','일시정지'):say('Play','재생');$('play').setAttribute('aria-pressed',String(value));if(!value)save();}
$('play').onclick=()=>{if(!playing&&state.time>=.95){state.time=.05;sync();drawExact();}setPlay(!playing);};
function animate(now){if(playing&&(!last||now-last>65)){if(last)state.time=Math.min(.95,state.time+(now-last)/17000);last=now;sync();drawExact();if(state.time>=.95){setPlay(false);save();}}requestAnimationFrame(animate);}
new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)setPlay(false);},{threshold:.05}).observe($('exposure'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)setPlay(false);});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{drawExact();drawErrors();},120);});
window.LightLab={snapshot:()=>({...state,playing,mean:M.conditional([state.px,state.py],state.time).mean,field:M.velocity([state.px,state.py],state.time),pending:errorPending,cacheHit,errorTime:errorResult?M.packedFrame(errorResult.sde,state.time).time:null,config:errorConfig,errors:errorResult?{sde:errorResult.sde.curve.at(-1).d,ode:errorResult.ode.curve.at(-1).d}:null}),ready:false};
document.querySelectorAll('input,select,button').forEach(e=>e.disabled=true);
sync();$('status').textContent=say('Preparing analytic references…','해석적 기준을 준비하는 중…');setTimeout(()=>{buildBase();calculate();LightLab.ready=true;$('top').setAttribute('aria-busy','false');document.querySelectorAll('input,select,button').forEach(e=>e.disabled=false);requestAnimationFrame(animate);},30);
