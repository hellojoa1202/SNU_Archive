/* UI for the shared graph-Gaussian jigsaw model. All coordinates remain
   continuous: drawing, dragging and sampling never snap pieces to a grid. */
(function(){
'use strict';
const M=Jigsaw,$=id=>document.getElementById(id),t=(en,ko)=>DiffusionI18n.text(en,ko);
const blue='#2455e6',orange='#ee6d43',ink='#172029',muted='#69727d';
let model,start,simulation,paths=[],selected=72,edited=false,extent=1.3,animation=null,activeTerm='time';
const number=id=>Number($(id).value),format=(x,n=3)=>Number(x).toFixed(n);
const art=document.createElement('canvas');art.width=1200;art.height=800;
function artwork(){
 const c=art.getContext('2d');c.fillStyle='#cfdfed';c.fillRect(0,0,1200,800);
 c.fillStyle='#f5ecd9';c.fillRect(0,0,1200,380);
 c.fillStyle='#ef673f';c.beginPath();c.arc(845,217,119,0,Math.PI*2);c.fill();
 c.fillStyle='#315a9e';c.fillRect(0,380,1200,420);
 c.fillStyle='#7299c2';c.fillRect(0,404,1200,12);c.fillRect(0,464,1200,7);c.fillRect(0,570,1200,6);
 c.fillStyle='#8babc8';c.fillRect(570,422,540,5);c.fillRect(700,495,420,4);
 // A compact architectural illustration, drawn locally at full resolution.
 c.fillStyle='#e0c4a6';c.beginPath();c.moveTo(0,200);c.lineTo(328,172);c.lineTo(388,800);c.lineTo(0,800);c.fill();
 c.fillStyle='#f4e5cd';c.beginPath();c.moveTo(0,200);c.lineTo(224,249);c.lineTo(224,800);c.lineTo(0,800);c.fill();
 c.fillStyle='#174570';c.fillRect(46,285,100,171);c.fillStyle='#7fa5ba';c.fillRect(58,297,76,144);c.fillStyle='#174570';c.fillRect(92,290,8,160);
 c.fillStyle='#b77a58';c.beginPath();c.moveTo(224,249);c.lineTo(328,172);c.lineTo(328,800);c.lineTo(224,800);c.fill();
 c.fillStyle='#e8d8bd';c.beginPath();c.moveTo(350,560);c.lineTo(570,506);c.lineTo(1200,724);c.lineTo(1200,800);c.lineTo(350,800);c.fill();
 c.strokeStyle='#b9a182';c.lineWidth=3;for(let i=0;i<8;i++){c.beginPath();c.moveTo(370+i*91,555+i*27);c.lineTo(390+i*124,800);c.stroke();}
 c.fillStyle='#204e6c';c.beginPath();c.moveTo(472,598);c.lineTo(545,580);c.lineTo(748,648);c.lineTo(675,674);c.fill();
 c.fillStyle='#e8cfa8';c.fillRect(500,498,22,110);c.fillStyle='#2b6b57';
 for(const [x,y,r]of [[490,465,52],[540,449,51],[524,408,48],[477,420,43]]){c.beginPath();c.arc(x,y,r,0,7);c.fill();}
 c.fillStyle='#255c4b';c.beginPath();c.arc(486,466,38,0,7);c.fill();
 c.fillStyle='#f6ead5';c.fillRect(40,647,124,13);c.fillStyle='#c49270';c.fillRect(43,660,117,140);
 c.fillStyle='#ee754c';c.beginPath();c.moveTo(56,631);c.lineTo(148,631);c.lineTo(134,684);c.lineTo(72,684);c.fill();
 c.strokeStyle='#285e53';c.lineWidth=10;for(const [x,y]of [[62,546],[95,521],[140,564]]){c.beginPath();c.moveTo(100,640);c.quadraticCurveTo(x+20,y+20,x,y);c.stroke();}
 c.fillStyle='#285e53';for(const [x,y]of [[62,546],[95,521],[140,564]]){c.beginPath();c.ellipse(x,y,12,30,-.4,0,7);c.fill();}
}
artwork();
function piecePath(i){
 const w=1.5/model.cols,h=1/model.rows,x=i%model.cols,y=Math.floor(i/model.cols),p=new Path2D();
 const sign=n=>n%2?1:-1;
 const sides=[y? -sign(i-model.cols+331):0,x<model.cols-1?sign(i+17):0,y<model.rows-1?sign(i+331):0,x? -sign(i-1+17):0];
 p.moveTo(-w/2,-h/2);
 function edge(ax,ay,bx,by,s){const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy),d=Math.min(w,h)*.22*s;const q=(u,v)=>[ax+u*dx+dy/len*v*d,ay+u*dy-dx/len*v*d];
  if(!s){p.lineTo(bx,by);return;}p.lineTo(...q(.35,0));p.bezierCurveTo(...q(.46,0),...q(.31,1),...q(.5,1));p.bezierCurveTo(...q(.69,1),...q(.54,0),...q(.65,0));p.lineTo(bx,by);
 }
 edge(-w/2,-h/2,w/2,-h/2,sides[0]);edge(w/2,-h/2,w/2,h/2,sides[1]);edge(w/2,h/2,-w/2,h/2,sides[2]);edge(-w/2,h/2,-w/2,-h/2,sides[3]);p.closePath();return p;
}
function canvasContext(canvas){const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(rect.width*ratio)||canvas.height!==Math.round(rect.height*ratio)){canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);}const ctx=canvas.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,rect.width,rect.height);return{ctx,w:rect.width,h:rect.height};}
function frame(canvas,viewExtent=extent){const {ctx,w,h}=canvasContext(canvas);const scale=Math.min((w-30)/(2*viewExtent),(h-28)/(2*viewExtent*.7));return{ctx,w,h,scale};}
function drawPuzzle(id,positions,score=null,colour=blue,viewExtent=extent){
 const canvas=$(id),{ctx:c,w,h,scale}=frame(canvas,viewExtent);c.save();c.translate(w/2,h/2);c.scale(scale,scale);
 c.globalAlpha=.055;c.drawImage(art,-.75,-.5,1.5,1);c.globalAlpha=1;c.strokeStyle='#bcc6d3';c.lineWidth=1/scale;c.setLineDash([3/scale,5/scale]);c.strokeRect(-.75,-.5,1.5,1);c.setLineDash([]);
 const order=Array.from({length:model.n},(_,i)=>i).filter(i=>i!==selected);order.push(selected);
 for(const i of order){c.save();c.translate(positions[2*i],positions[2*i+1]);c.fillStyle='#fff';c.shadowColor='rgba(30,45,65,.16)';c.shadowBlur=2;c.shadowOffsetY=1;c.fill(paths[i]);c.shadowColor='transparent';c.save();c.clip(paths[i]);c.drawImage(art,-.75-model.mu[2*i],-.5-model.mu[2*i+1],1.5,1);c.restore();c.strokeStyle=i===selected?colour:'rgba(255,255,255,.75)';c.lineWidth=(i===selected?2:.55)/scale;c.stroke(paths[i]);c.restore();}
 if(score){const i=selected,x=positions[2*i],y=positions[2*i+1],sx=score[2*i],sy=score[2*i+1],mag=Math.hypot(sx,sy),len=Math.min(.28,mag*.018);if(mag>1e-8){const ex=x+len*sx/mag,ey=y+len*sy/mag;c.strokeStyle=colour;c.fillStyle=colour;c.lineWidth=2/scale;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.stroke();const a=Math.atan2(sy,sx);c.beginPath();c.moveTo(ex,ey);c.lineTo(ex-.045*Math.cos(a-.5),ey-.045*Math.sin(a-.5));c.lineTo(ex-.045*Math.cos(a+.5),ey-.045*Math.sin(a+.5));c.closePath();c.fill();}}
 c.restore();
}
function rebuildModel(){const dims={24:[6,4],60:[10,6],150:[15,10]}[number('pieces')];model=M.create(...dims,number('gamma'));selected=Math.min(selected,model.n-1);$('mode').max=model.n-1;$('mode').value=Math.min(number('mode'),model.n-1);paths=Array.from({length:model.n},(_,i)=>piecePath(i));}
function resetStart(){edited=false;start=M.forward(model,number('time'),number('seed'));updateExtent();resimulate();}
function updateExtent(){let maxX=.9,maxY=.65;for(let i=0;i<model.n;i++){maxX=Math.max(maxX,Math.abs(start[2*i])+.1);maxY=Math.max(maxY,Math.abs(start[2*i+1])+.1);}extent=Math.max(1.05,maxX,maxY/.7);}
function resimulate(){simulation=M.simulate(model,start,number('time'),number('steps'),number('seed'),$('solver').value);render();}
function selectedFrame(){return Math.min(simulation.times.length-1,Math.round(number('progress')/1000*number('steps')));}
function highlight(key){activeTerm=key;document.querySelectorAll('[data-term]').forEach(el=>el.classList.toggle('active',el.dataset.term===key||(key==='steps'&&el.dataset.term==='progress')));}
function liveCopy(){
 const time=number('time'),j=selectedFrame(),remaining=simulation.times[j],v=M.variance(model,time),k=number('mode');
 $('time-out').textContent=format(time);$('noise-scale').textContent=format(Math.sqrt(2*M.D*time));$('gamma-out').textContent=format(model.gamma,1);$('mode-out').textContent=k;$('deform-out').textContent=format(number('deform'),2);
 $('progress-out').textContent=j+' / '+number('steps')+' · t = '+format(remaining,5);
 $('start-status').textContent=edited?t('Edited start','직접 수정한 배치'):t('Sample from pₜ','pₜ에서 뽑은 배치');
 $('piece-status').textContent=t('PIECE ','조각 ')+String(selected+1).padStart(3,'0')+' / '+model.n;
 $('mode-status').textContent='λ'+k+' = '+format(model.modes[k].lambda);
 $('forward-explain').textContent=activeTerm==='position'?t('x changed. The score updates from the new displacement x − μ.','x가 바뀌었어요. 새 변위 x − μ에서 score를 다시 계산해요.'):activeTerm==='seed'?t('ε changed. The same time now gives a different scattered arrangement.','ε가 바뀌었어요. 같은 시간에서도 다른 배치가 만들어져요.'):t('t = '+format(time)+' → noise scale '+format(Math.sqrt(2*M.D*time))+'. Larger t spreads the pieces further.','t = '+format(time)+' → 잡음 크기 '+format(Math.sqrt(2*M.D*time))+'. t가 커지면 조각이 더 멀리 흩어져요.');
 $('reverse-explain').textContent=activeTerm==='stochastic'?t('The SDE adds a fresh Gaussian increment. The ODE has no noise term.','SDE는 매 단계 새로운 가우시안 잡음을 더해요. ODE에는 이 항이 없어요.'):activeTerm==='steps'?t('More steps → smaller Δr. Compare Euler’s endpoint error with the exact ODE.','적분 횟수가 늘면 Δr이 작아져요. Euler와 정확한 ODE의 오차를 비교해 보세요.'):t('t = '+format(remaining,5)+'. The arrow follows the selected piece’s score; its length is capped for readability.','t = '+format(remaining,5)+'. 화살표는 선택한 조각의 score 방향이에요. 길이는 보기 편하게 제한했어요.');
 $('geometry-explain').textContent=t('Mode '+k+': λ = '+format(model.modes[k].lambda)+', vₖ(t) = '+v[k].toExponential(2)+'. γ changes the prior variance; 2Dt adds the same variance to every mode.','모드 '+k+': λ = '+format(model.modes[k].lambda)+', vₖ(t) = '+v[k].toExponential(2)+'. γ는 사전분산을 바꾸고, 2Dt는 모든 모드에 같은 분산을 더해요.');
 const ex=$('solver').value==='exact';
 for(const type of ['ode','sde'])$(type+'-update').innerHTML=ex?(type==='ode'?'z′<sub>k</sub> = √(<span class="term" data-term="steps">v′<sub>k</sub></span>/v<sub>k</sub>) z<sub>k</sub>':'z′<sub>k</sub> = (<span class="term" data-term="steps">v′<sub>k</sub></span>/v<sub>k</sub>) z<sub>k</sub> + √[v′<sub>k</sub>(1 − v′<sub>k</sub>/v<sub>k</sub>)] <span class="term" data-term="stochastic">ξ</span>'):'x′ = x + '+(type==='sde'?'2D':'D')+'s <span class="term" data-term="steps">Δr</span>'+(type==='sde'?' + <span class="term" data-term="stochastic">√(2DΔr) ξ</span>':'');
 highlight(activeTerm);
}
function renderReverse(){
 const j=selectedFrame(),time=simulation.times[j],positions={};
 let viewExtent=.92;
 for(const type of ['ode','sde']){positions[type]=M.fromModes(model,simulation[type][j]);for(let i=0;i<model.n;i++)viewExtent=Math.max(viewExtent,Math.abs(positions[type][2*i])+.09,(Math.abs(positions[type][2*i+1])+.09)/.7);}
 for(const type of ['ode','sde']){
  const x=positions[type];drawPuzzle(type+'-canvas',x,M.score(model,x,time),type==='ode'?blue:orange,viewExtent);
  const error=M.rms(x,M.exactODE(model,start,time,number('time')));
  $(type+'-metrics').innerHTML='<span>'+t('Seam RMS','이웃 오차')+' <strong>'+format(M.seamError(model,x),4)+'</strong></span><span>'+(type==='ode'?t('vs. exact ODE','정확한 ODE와 차이')+' <strong>'+error.toExponential(1)+'</strong>':t('Remaining t','남은 t')+' <strong>'+format(time,5)+'</strong>')+'</span>';
 }
 drawTrajectory(j);liveCopy();
}
function drawTrajectory(j){
 const svg=$('trajectory'),tracks={};let xmin=Infinity,xmax=-Infinity,ymin=Infinity,ymax=-Infinity;
 for(const type of ['ode','sde']){tracks[type]=simulation[type].map(z=>{let x=model.mu[2*selected],y=model.mu[2*selected+1];for(let k=0;k<model.n;k++){x+=model.modes[k].u[selected]*z[2*k];y+=model.modes[k].u[selected]*z[2*k+1];}xmin=Math.min(xmin,x);xmax=Math.max(xmax,x);ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);return[x,y];});}
 const scale=Math.min(380/Math.max(.02,xmax-xmin),105/Math.max(.02,ymax-ymin)),cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;
 const point=([x,y])=>[230+(x-cx)*scale,75+(y-cy)*scale];
 let out='<path d="M20 75H440 M230 12V138" stroke="#e1e5eb" stroke-dasharray="3 5"/>';
 for(const type of ['sde','ode']){const pts=tracks[type].map(point),colour=type==='ode'?blue:orange,d=ps=>ps.map((p,i)=>(i?'L':'M')+p.map(x=>x.toFixed(2)).join(',')).join(' ');out+='<path d="'+d(pts)+'" fill="none" stroke="'+colour+'" opacity=".16"/><path d="'+d(pts.slice(0,j+1))+'" fill="none" stroke="'+colour+'" stroke-width="1.7"/><circle cx="'+pts[j][0]+'" cy="'+pts[j][1]+'" r="3" fill="'+colour+'"/>';}
 svg.innerHTML=out;
}
function drawGraph(){
 const {ctx:c,w,h}=canvasContext($('graph-canvas')),scale=Math.min((w-55)/2,(h-40)/1.4),mode=model.modes[number('mode')],max=Math.max(...Array.from(mode.u,Math.abs)),amplitude=number('deform'),xy=[];
 for(let i=0;i<model.n;i++)xy.push([w/2+model.mu[2*i]*scale,h/2+(model.mu[2*i+1]+amplitude*mode.u[i]/max)*scale]);
 c.strokeStyle='#ccd5df';c.lineWidth=1;for(const[i,j]of model.edges){c.beginPath();c.moveTo(...xy[i]);c.lineTo(...xy[j]);c.stroke();}
 for(let i=0;i<model.n;i++){const u=mode.u[i]/max;c.fillStyle=u>=0?blue:orange;c.globalAlpha=.35+.65*Math.abs(u);c.beginPath();c.arc(...xy[i],model.n>60?2.8:4,0,7);c.fill();}c.globalAlpha=1;
 c.fillStyle=muted;c.font='10px Arial';c.fillText(t('node = piece · edge = neighbour','점 = 조각 · 선 = 이웃 관계'),16,h-12);
}
function drawSpectrum(){
 const svg=$('spectrum'),left=47,right=442,top=25,bottom=169,v=M.variance(model,number('time')),lo=Math.log10(Math.min(...model.v0))-.25,hi=Math.log10(Math.max(...v))+.3;
 const X=lambda=>left+lambda/8*(right-left),Y=value=>bottom-(Math.log10(value)-lo)/(hi-lo)*(bottom-top);
 let out='';for(let exponent=Math.ceil(lo);exponent<=hi;exponent++){const y=Y(10**exponent);out+='<path d="M'+left+' '+y+'H'+right+'" stroke="#e4e8ee"/><text x="'+(left-9)+'" y="'+(y+3)+'" text-anchor="end" font-size="9" fill="'+muted+'">10^'+exponent+'</text>';}
 for(const [values,colour]of [[v,blue],[model.v0,orange]]){out+='<path d="'+model.modes.map((m,i)=>(i?'L':'M')+X(m.lambda).toFixed(2)+','+Y(values[i]).toFixed(2)).join(' ')+'" stroke="'+colour+'" stroke-width="2" fill="none"/>';const k=number('mode');out+='<circle cx="'+X(model.modes[k].lambda)+'" cy="'+Y(values[k])+'" r="4" fill="'+colour+'"/>';}
 out+='<text x="47" y="12" font-size="10" fill="'+muted+'">'+t('variance · log scale','분산 · 로그 눈금')+'</text><text x="320" y="12" font-size="10" fill="'+blue+'">vₖ(t)</text><text x="385" y="12" font-size="10" fill="'+orange+'">vₖ(0)</text>';
 for(const lambda of [0,2,4,6,8])out+='<text x="'+X(lambda)+'" y="188" text-anchor="middle" font-size="10" fill="'+muted+'">'+lambda+'</text>';
 out+='<text x="244" y="206" text-anchor="middle" font-size="10" fill="'+muted+'">'+t('graph eigenvalue λₖ','그래프 고유값 λₖ')+'</text>';svg.innerHTML=out;
}
function render(){drawPuzzle('forward-canvas',start);renderReverse();drawGraph();drawSpectrum();}
function stopAnimation(){if(animation)cancelAnimationFrame(animation);animation=null;updatePlayLabels();}
function updatePlayLabels(){const a=$('scatter-play'),b=$('assemble-play');a.innerHTML=t('Play diffusion','확산 재생')+' <span>↗</span>';b.innerHTML=t('Reassemble','다시 맞추기')+' <span>↙</span>';}
function play(kind){if(animation){stopAnimation();return;}const isForward=kind==='forward',button=$(isForward?'scatter-play':'assemble-play');const begin=performance.now(),duration=6000;button.textContent=t('Pause','일시정지');function tick(now){const f=Math.min(1,(now-begin)/duration);if(isForward){$('time').value=(M.T*f).toFixed(3);resetStart();highlight('time');}else{$('progress').value=Math.round(f*1000);highlight('progress');renderReverse();}if(f<1)animation=requestAnimationFrame(tick);else{animation=null;updatePlayLabels();}}animation=requestAnimationFrame(tick);}
$('scatter-play').addEventListener('click',()=>play('forward'));$('assemble-play').addEventListener('click',()=>play('reverse'));
$('reset').addEventListener('click',()=>{stopAnimation();resetStart();highlight('time');});
for(const id of ['pieces','gamma'])$(id).addEventListener('input',()=>{stopAnimation();highlight(id==='gamma'?'gamma':'position');const keep=edited&&id==='gamma';rebuildModel();if(keep)resimulate();else resetStart();});
for(const id of ['time','seed'])$(id).addEventListener('input',()=>{stopAnimation();if(id==='seed')$('seed').value=Math.max(1,Math.min(9999,number('seed')||1));highlight(id);resetStart();});
for(const id of ['steps','solver'])$(id).addEventListener('input',()=>{stopAnimation();highlight('steps');resimulate();});
$('progress').addEventListener('input',()=>{stopAnimation();highlight('progress');renderReverse();});
for(const id of ['mode','deform'])$(id).addEventListener('input',()=>{highlight(id);drawGraph();drawSpectrum();liveCopy();});
// Highlighting follows both control interaction and equation inspection.
document.addEventListener('pointerover',e=>{const term=e.target.closest('[data-term]');if(term){highlight(term.dataset.term);liveCopy();}});
document.addEventListener('focusin',e=>{const term=e.target.closest('[data-term]');if(term){highlight(term.dataset.term);liveCopy();}else if(e.target.id&&['time','gamma','seed','mode','steps','progress'].includes(e.target.id)){highlight(e.target.id);liveCopy();}});
let drag=null;
const canvas=$('forward-canvas');
function pointerWorld(e){const rect=canvas.getBoundingClientRect(),scale=Math.min((rect.width-30)/(2*extent),(rect.height-28)/(2*extent*.7));return[(e.clientX-rect.left-rect.width/2)/scale,(e.clientY-rect.top-rect.height/2)/scale];}
canvas.addEventListener('pointerdown',e=>{const [x,y]=pointerWorld(e);let closest=-1;const order=Array.from({length:model.n},(_,i)=>i).filter(i=>i!==selected);order.push(selected);for(const i of order){const dx=x-start[2*i],dy=y-start[2*i+1];if(Math.abs(dx)<.75/model.cols*1.5&&Math.abs(dy)<.5/model.rows*1.5)closest=i;}if(closest<0)return;stopAnimation();selected=closest;drag={dx:x-start[2*selected],dy:y-start[2*selected+1],x,y,moved:false};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});highlight('position');render();});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const [x,y]=pointerWorld(e);if(Math.hypot(x-drag.x,y-drag.y)>.002)drag.moved=true;if(!drag.moved)return;start[2*selected]=Math.max(-extent+.08,Math.min(extent-.08,x-drag.dx));start[2*selected+1]=Math.max(-extent*.7+.08,Math.min(extent*.7-.08,y-drag.dy));edited=true;drawPuzzle('forward-canvas',start);$('start-status').textContent=t('Edited start','직접 수정한 배치');});
function endDrag(){if(!drag)return;const moved=drag.moved;drag=null;if(moved)resimulate();}canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
canvas.addEventListener('keydown',e=>{const delta={ArrowLeft:[-.015,0],ArrowRight:[.015,0],ArrowUp:[0,-.015],ArrowDown:[0,.015]}[e.key];if(!delta)return;e.preventDefault();stopAnimation();edited=true;start[2*selected]+=delta[0];start[2*selected+1]+=delta[1];highlight('position');updateExtent();resimulate();});
window.addEventListener('diffusionlanguagechange',()=>{updatePlayLabels();render();});
let resizeFrame;window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(render);});
rebuildModel();resetStart();
// Small read-only snapshot for reproducible browser validation.
window.DiffusionLab={snapshot:()=>({n:model.n,gamma:model.gamma,edited,selected,language:DiffusionI18n.language,start:Array.from(start),ode:Array.from(simulation.ode[selectedFrame()]),sde:Array.from(simulation.sde[selectedFrame()]),time:simulation.times[selectedFrame()],activeTerm}),stop:stopAnimation};
})();
