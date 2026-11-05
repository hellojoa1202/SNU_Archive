/* Linked path / population comparisons. Computation is shared by both languages. */
(function(){
'use strict';
const M=FlowMath,T=TransportMath,$=id=>document.getElementById(id),tr=(en,ko)=>DiffusionI18n.text(en,ko),blue='#6085ad',red='#ae4c54';
const toy=T.create(),state={progress:0,count:192,initialSeed:43,noiseSeed:71,selected:0,playing:!matchMedia('(prefers-reduced-motion: reduce)').matches};
let starts,ode,sde,previous=null,flowCache=null,queued=false,last=0,drawAt=0,contourCache=new Map();
function visible(id){const r=$(id).getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight+120;}
function frame(id,xlim,ylim){const c=$ (id),r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);const ctx=c.getContext('2d');ctx.setTransform(d,0,0,d,0,0);ctx.fillStyle='#fff';ctx.fillRect(0,0,r.width,r.height);const l=32,b=r.height-30,w=r.width-48,h=r.height-50;
 const map=p=>[l+(p[0]-xlim[0])/(xlim[1]-xlim[0])*w,b-(p[1]-ylim[0])/(ylim[1]-ylim[0])*h];
 ctx.strokeStyle='#e5e9ee';ctx.lineWidth=1;ctx.font='10px Arial';ctx.fillStyle='#7e8b98';
 for(let i=0;i<=4;i++){const x=xlim[0]+(xlim[1]-xlim[0])*i/4;ctx.textAlign='center';ctx.fillText(x.toFixed(1),map([x,0])[0],b+17);const y=ylim[0]+(ylim[1]-ylim[0])*i/4;ctx.textAlign='right';ctx.fillText(y.toFixed(1),l-5,map([0,y])[1]+3);}
 ctx.strokeRect(l,20,w,h);return{ctx,map,l,b,w,h,width:r.width,height:r.height,xlim,ylim};}
function line(f,points,color,width=1,dash=[]){const c=f.ctx;c.save();c.beginPath();c.rect(f.l,20,f.w,f.h);c.clip();c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.beginPath();points.forEach((p,i)=>{const q=f.map(p);i?c.lineTo(...q):c.moveTo(...q);});c.stroke();c.restore();}
function dot(f,p,color,r=2){const q=f.map(p);if(q[0]<f.l||q[0]>f.l+f.w||q[1]<20||q[1]>f.b)return;f.ctx.fillStyle=color;f.ctx.beginPath();f.ctx.arc(...q,r,0,2*Math.PI);f.ctx.fill();}
function contours(f,density,key){
 let segments=contourCache.get(key);if(!segments){const nx=48,ny=40,xy=(i,j)=>[f.xlim[0]+i/nx*(f.xlim[1]-f.xlim[0]),f.ylim[0]+j/ny*(f.ylim[1]-f.ylim[0])],vals=[];let max=0;
 for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){const v=density(xy(i,j));vals.push(v);max=Math.max(max,v);}segments=[];
 for(const frac of [.15,.4,.7])for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
  const ps=[xy(i,j),xy(i+1,j),xy(i+1,j+1),xy(i,j+1)],vs=[vals[j*(nx+1)+i],vals[j*(nx+1)+i+1],vals[(j+1)*(nx+1)+i+1],vals[(j+1)*(nx+1)+i]],cross=[];
  for(let a=0;a<4;a++){const b=(a+1)%4,level=max*frac;if((vs[a]>=level)===(vs[b]>=level))continue;const u=(level-vs[a])/(vs[b]-vs[a]);cross.push(ps[a].map((v,k)=>v+u*(ps[b][k]-v)));}
  for(let a=0;a+1<cross.length;a+=2)segments.push([cross[a],cross[a+1]]);
 }contourCache.clear();contourCache.set(key,segments);}
 const c=f.ctx;c.strokeStyle='#cbd2d9';c.lineWidth=.8;c.beginPath();for(const[a,b]of segments){c.moveTo(...f.map(a));c.lineTo(...f.map(b));}c.stroke();
}
function histogram(points,lo,hi,bins=32){const h=(hi-lo)/bins,counts=Array(bins).fill(0);for(const x of points){const i=Math.floor((x[0]-lo)/h);if(i>=0&&i<bins)counts[i]++;}return counts.flatMap((n,i)=>[[lo+i*h,n/points.length/h],[lo+(i+1)*h,n/points.length/h]]);}
function projection(id,a,b,density,lo,hi,labels){const ha=histogram(a,lo,hi),hb=histogram(b,lo,hi),ref=Array.from({length:181},(_,i)=>{const x=lo+(hi-lo)*i/180;return[x,density(x)];}),max=Math.max(...ha.map(p=>p[1]),...hb.map(p=>p[1]),...ref.map(p=>p[1]))*1.22;
 const f=frame(id,[lo,hi],[0,max]);line(f,ha,blue,1.3);line(f,hb,red,1.3);line(f,ref,'#263746',1.5,[4,3]);const c=f.ctx;c.textAlign='left';c.font='10px Arial';c.fillStyle=blue;c.fillText(labels[0],f.l+5,34);c.fillStyle=red;c.fillText(labels[1],f.l+5,49);c.fillStyle='#263746';c.fillText(tr('Dashed: analytic x-density','점선: 해석적 x축 밀도'),f.l+5,64);c.textAlign='right';c.fillStyle='#7e8b98';c.fillText(tr('x-coordinate','x좌표'),f.width-15,f.height-5);
}
function rebuild(newStarts){if(newStarts){starts=T.initial(toy,state.count,state.initialSeed);ode=T.solve(toy,starts,'ode');previous=null;}else previous=sde;
 sde=T.solve(toy,starts,'sde',state.noiseSeed);state.selected=Math.min(state.selected,starts.length-1);}
function transport(){if(!sde)rebuild(true);const p=state.progress,t=1-p,a=sde.map(path=>M.at(path,p)),b=ode.map(path=>M.at(path,p));
 for(const[id,paths,points,color]of [['sde-canvas',sde,a,blue],['ode-canvas',ode,b,red]]){
  const f=frame(id,[-3.5,3.5],[-2.8,2.8]);contours(f,x=>T.density(toy,x,t),'sde:'+t);
  for(let i=0;i<Math.min(paths.length,12);i++){const k=Math.floor(p*(paths[i].length-1));line(f,paths[i].slice(0,k+1),id==='sde-canvas'?'#dbe2e9':'#eadbdd',.65);}
  for(const point of points)dot(f,point,color,state.count>192?1.5:2);
  const selected=paths[state.selected],k=Math.floor(p*(selected.length-1));
  if(id==='sde-canvas'&&previous)line(f,previous[state.selected].slice(0,k+1),'#8c9caf',1,[4,4]);
  line(f,[...selected.slice(0,k+1),points[state.selected]],color,2.1);dot(f,starts[state.selected],'#17283e',3);dot(f,points[state.selected],'#fff',6);dot(f,points[state.selected],color,4);
 }
 projection('transport-density',a,b,x=>T.projection(toy,x,t),-3.5,3.5,['SDE','ODE']);
 $('sde-distance').textContent=T.discrepancy(a,x=>T.cdf(toy,x,t,M.normalCDF)).toFixed(3);$('ode-distance').textContent=T.discrepancy(b,x=>T.cdf(toy,x,t,M.normalCDF)).toFixed(3);$('path-distance').textContent=Math.hypot(a[state.selected][0]-b[state.selected][0],a[state.selected][1]-b[state.selected][1]).toFixed(3);
}
function conditionalComparison(){const snap=FlowLab.modelState(),m=snap.model,t=snap.time;
 if(flowCache?.revision!==snap.revision){const initial=M.samples(m,144,59);flowCache={revision:snap.revision,initial,paths:initial.map(x=>M.integrate(m,x,'heun',384).path),centers:new Map()};}
 const c=flowCache;if(!c.centers.has(snap.selected))c.centers.set(snap.selected,M.integrate(m,m.a[snap.selected],'heun',384).path);
 const a=c.initial.map((x,i)=>{const u=M.component(m,i%m.a.length,t).u;return x.map((q,j)=>q+t*u[j]);}),b=c.paths.map(p=>M.at(p,t));
 const selected=M.component(m,snap.selected,t),tracked=c.centers.get(snap.selected);
 for(const[id,points,color]of [['conditional-canvas',a,blue],['marginal-canvas',b,red]]){
  const f=frame(id,[-1.5,1.5],[-1,1]);contours(f,x=>M.density(m,x,t),'fm:'+snap.revision+':'+t);
  for(let i=0;i<24;i++){if(id==='conditional-canvas')line(f,[c.initial[i],a[i]],'#dae2e9',.7);else line(f,c.paths[i].slice(0,Math.floor(t*384)+1),'#e7d7d9',.7);}
  for(const point of points)dot(f,point,color,2);
  const p=id==='conditional-canvas'?selected.mu:M.at(tracked,t),path=id==='conditional-canvas'?[m.a[snap.selected],selected.mu]:[...tracked.slice(0,Math.floor(t*384)+1),p];
  line(f,path,color,2.3);dot(f,m.b[m.pi[snap.selected]],'#adb7c1',4);dot(f,m.a[snap.selected],'#17283e',3);dot(f,p,'#fff',6);dot(f,p,color,4);
 }
 const density=x=>m.a.reduce((s,_,i)=>{const z=(x-M.component(m,i,t).mu[0])/m.tau;return s+Math.exp(-z*z/2);},0)/(m.a.length*m.tau*Math.sqrt(2*Math.PI));
 projection('flow-density',a,b,density,-1.5,1.5,[tr('Conditional','조건부 보간'),tr('Marginal ODE','주변 ODE')]);
}
function render(){queued=false;$('transport-play').textContent=state.playing?tr('Pause','일시정지'):tr('Play','재생');$('transport-play').setAttribute('aria-pressed',String(state.playing));$('transport-time').value=state.progress;$('transport-time-out').textContent=tr('Noise time t = ','노이즈 시간 t = ')+(1-state.progress).toFixed(3);if(visible('sde-canvas')||visible('ode-canvas')||visible('transport-density'))transport();if(visible('conditional-canvas')||visible('marginal-canvas')||visible('flow-density'))conditionalComparison();}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(render);}
$('transport-play').onclick=()=>{if(state.progress>=1)state.progress=0;state.playing=!state.playing;schedule();};
$('transport-time').oninput=()=>{state.playing=false;state.progress=+$('transport-time').value;FlowLab.highlight('score');schedule();};
$('transport-rerun').onclick=()=>{state.noiseSeed++;if(!sde)rebuild(true);else rebuild(false);FlowLab.highlight('randomness');schedule();};
$('transport-starts').onclick=()=>{state.initialSeed++;rebuild(true);schedule();};
$('transport-count').onchange=()=>{state.count=+$('transport-count').value;rebuild(true);schedule();};
for(const id of ['sde-canvas','ode-canvas']){$(id).addEventListener('pointerdown',e=>{if(!sde)return;const rect=$(id).getBoundingClientRect(),pos=[-3.5+(e.clientX-rect.left-32)/(rect.width-48)*7,2.8-(e.clientY-rect.top-20)/(rect.height-50)*5.6],paths=id==='sde-canvas'?sde:ode;let best=Infinity;paths.forEach((path,i)=>{const p=M.at(path,state.progress),d=Math.hypot(p[0]-pos[0],p[1]-pos[1]);if(d<best){best=d;state.selected=i;}});schedule();});$(id).addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();state.selected=(state.selected+(e.key==='ArrowRight'?1:-1)+state.count)%state.count;schedule();});}
for(const event of ['scroll','resize','diffusionlanguagechange','flowrender'])window.addEventListener(event,schedule,{passive:true});
function tick(now){const dt=last?Math.min((now-last)/1000,.1):0;last=now;if(state.playing&&visible('sde-canvas')&&!document.hidden){state.progress=Math.min(1,state.progress+dt/18);if(state.progress===1)state.playing=false;if(now-drawAt>90){drawAt=now;schedule();}}requestAnimationFrame(tick);}
window.PathComparisons={snapshot:()=>({...state,initial:starts?.map(p=>p.slice()),sdeEnd:sde?.[state.selected].at(-1),odeEnd:ode?.[state.selected].at(-1),flowRevision:flowCache?.revision})};
schedule();requestAnimationFrame(tick);
})();
