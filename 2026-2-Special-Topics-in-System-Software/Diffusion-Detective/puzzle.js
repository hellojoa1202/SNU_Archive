/* Shared bilingual jigsaw interaction. No snapping, image recognition, or stored-noise replay. */
(function(){
'use strict';
const M=PuzzleMath,$=id=>document.getElementById('jig-'+id),t=(en,ko)=>DiffusionI18n.text(en,ko);
const blue='#375f87',orange='#bc8056';
let model,start,sim,paths=[],selected=8,edited=false,extent=1.15,animation=null,active='time';
const num=id=>Number($(id).value),fmt=(v,n=3)=>Number(v).toFixed(n);
const art=new Image();art.src=new URL('assets/cat-photo.jpg',document.currentScript.src).href;
function drawArt(c,x,y,w,h){const sw=Math.min(art.naturalWidth,art.naturalHeight*1.5),sh=sw/1.5;c.drawImage(art,(art.naturalWidth-sw)/2,(art.naturalHeight-sh)/2,sw,sh,x,y,w,h);}
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
 if(!art.complete||!art.naturalWidth)return;const canvas=$(id),{ctx:c,w,h,scale}=frame(canvas,viewExtent);c.save();c.translate(w/2,h/2);c.scale(scale,scale);
 c.globalAlpha=.055;drawArt(c,-.75,-.5,1.5,1);c.globalAlpha=1;c.strokeStyle='#bcc6d3';c.lineWidth=1/scale;c.setLineDash([3/scale,5/scale]);c.strokeRect(-.75,-.5,1.5,1);c.setLineDash([]);
 const order=Array.from({length:model.n},(_,i)=>i).filter(i=>i!==selected);order.push(selected);
 for(const i of order){c.save();c.translate(positions[2*i],positions[2*i+1]);c.fillStyle='#fff';c.shadowColor='rgba(30,45,65,.16)';c.shadowBlur=2;c.shadowOffsetY=1;c.fill(paths[i]);c.shadowColor='transparent';c.save();c.clip(paths[i]);drawArt(c,-.75-model.mu[2*i],-.5-model.mu[2*i+1],1.5,1);c.restore();c.strokeStyle=i===selected?colour:'rgba(35,43,51,.52)';c.lineWidth=(i===selected?2:.8)/scale;c.stroke(paths[i]);c.restore();}
 if(score){const i=selected,x=positions[2*i],y=positions[2*i+1],sx=score[2*i],sy=score[2*i+1],mag=Math.hypot(sx,sy),len=Math.min(.28,mag*.018);if(mag>1e-8){const ex=x+len*sx/mag,ey=y+len*sy/mag;c.strokeStyle=colour;c.fillStyle=colour;c.lineWidth=2/scale;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.stroke();const a=Math.atan2(sy,sx);c.beginPath();c.moveTo(ex,ey);c.lineTo(ex-.045*Math.cos(a-.5),ey-.045*Math.sin(a-.5));c.lineTo(ex-.045*Math.cos(a+.5),ey-.045*Math.sin(a+.5));c.closePath();c.fill();}}
 c.restore();
}

function highlight(key){active=key;document.querySelectorAll('[data-puzzle-term]').forEach(el=>el.classList.toggle('active',el.dataset.puzzleTerm.split(' ').includes(key)));}
function frameIndex(){const n=sim.times.length-1;return Math.min(n,Math.round(num('progress')/1000*n));}
function setExtent(){extent=1.05;for(let i=0;i<model.n;i++)extent=Math.max(extent,Math.abs(start[2*i])+.16,(Math.abs(start[2*i+1])+.15)/.7);}
function build(){const dims={24:[6,4],60:[10,6],150:[15,10]}[num('pieces')];model=M.create(...dims);selected=Math.min(selected,model.n-1);paths=Array.from({length:model.n},(_,i)=>piecePath(i));reset();}
function reset(){edited=false;start=M.forward(model,num('time'),num('seed'));setExtent();$('progress').value=0;resimulate();}
function resimulate(){sim=M.simulate(model,start,num('time'),num('steps'),num('seed'),$('solver').value);render();}
function copy(){
 const j=frameIndex(),time=sim.times[j];
 $('time-out').textContent=fmt(num('time'),2);$('progress-out').textContent=Math.round(num('progress')/10)+'%';
 $('piece-status').textContent=t('Piece ','조각 ')+(selected+1)+' / '+model.n;
 $('start-status').textContent=edited?t('Position edited','위치 수정됨'):t('Position noise','위치 노이즈');
 $('live-note').textContent=active==='position'?t('The blue arrow shows the direction toward a more likely position.','파란 화살표는 더 가능성 높은 위치로 향하는 방향을 나타낸다.'):t('Noise scale = '+fmt(Math.sqrt(2*M.D*num('time')))+'. Increasing T spreads the pieces further.','노이즈 크기 = '+fmt(Math.sqrt(2*M.D*num('time')))+'. T가 커질수록 조각이 더 넓게 흩어진다.');
 $('reverse-note').textContent=t('Remaining time t = '+fmt(time,5)+'. Blue: deterministic path. Orange: a path with fresh noise.','남은 시간 t = '+fmt(time,5)+'. 파랑: 정해진 경로. 주황: 새로운 잡음이 더해지는 경로.');
 $('steps-out').textContent='Δt₀ = '+(sim.times[0]-sim.times[1]).toExponential(2);
 $('ode-error').textContent=M.rms(sim.ode[j],M.exactODE(model,start,time,num('time'))).toExponential(2);
 $('play').textContent=animation?t('Pause','일시정지'):t('Reassemble','다시 맞추기');
 $('ode-caption').textContent=$('solver').value==='exact'?t('Exact ODE steps','정확한 ODE 이동'):t('Euler steps','Euler 근사');
 $('sde-caption').textContent=$('solver').value==='exact'?t('Exact reverse transitions','정확한 역방향 전이'):t('Euler–Maruyama steps','Euler–Maruyama 근사');
 highlight(active);
}
function trajectory(j){
 const tracks=[sim.ode,sim.sde].map(xs=>xs.map(x=>[x[2*selected],x[2*selected+1]]));
 const all=tracks.flat(),xs=all.map(p=>p[0]),ys=all.map(p=>p[1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
 const scale=Math.min(390/Math.max(.03,xmax-xmin),120/Math.max(.03,ymax-ymin)),point=p=>[230+(p[0]-(xmin+xmax)/2)*scale,85+(p[1]-(ymin+ymax)/2)*scale];
 let out='';tracks.forEach((track,k)=>{const pts=track.map(point),color=k?orange:blue,path=ps=>ps.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(2)).join(',')).join(' ');out+='<path d="'+path(pts)+'" fill="none" stroke="'+color+'" opacity=".15"/><path d="'+path(pts.slice(0,j+1))+'" fill="none" stroke="'+color+'" stroke-width="2"/><circle cx="'+pts[j][0]+'" cy="'+pts[j][1]+'" r="3.5" fill="'+color+'"/>';});$('trajectory').innerHTML=out;
}
function render(){
 if(!sim)return;const j=frameIndex(),time=sim.times[j];
 drawPuzzle('forward',start,M.score(model,start,num('time')),blue,extent);
 // Fixed shared scale preserves the visible motion and makes methods comparable.
 drawPuzzle('ode',sim.ode[j],null,blue,extent);drawPuzzle('sde',sim.sde[j],null,orange,extent);
 trajectory(j);copy();
}
function stop(){if(animation)cancelAnimationFrame(animation);animation=null;if(sim)copy();}
$('play').addEventListener('click',()=>{
 if(animation){stop();return;}if(num('progress')>=1000)$('progress').value=0;
 const initial=num('progress'),begin=performance.now();
 function tick(now){const f=Math.min(1000,initial+(now-begin)/6500*1000);$('progress').value=Math.round(f);highlight('progress');render();if(f<1000)animation=requestAnimationFrame(tick);else{animation=null;copy();}}
 animation=requestAnimationFrame(tick);copy();
});
$('reset').addEventListener('click',()=>{stop();$('time').value=0;highlight('time');reset();});
$('shuffle').addEventListener('click',()=>{stop();$('seed').value=num('seed')%9999+1;highlight('seed');reset();});
$('pieces').addEventListener('input',()=>{stop();highlight('position');build();});
$('time').addEventListener('input',()=>{stop();highlight('time');reset();});
for(const id of ['steps','solver'])$(id).addEventListener('input',()=>{stop();highlight('steps');resimulate();});
$('progress').addEventListener('input',()=>{stop();highlight('progress');render();});
$('seed').addEventListener('input',()=>{stop();$('seed').value=Math.max(1,Math.min(9999,num('seed')||1));highlight('seed');reset();});
let drag=null;const canvas=$('forward');
function world(e){const rect=canvas.getBoundingClientRect(),scale=Math.min((rect.width-30)/(2*extent),(rect.height-28)/(2*extent*.7));return[(e.clientX-rect.left-rect.width/2)/scale,(e.clientY-rect.top-rect.height/2)/scale];}
canvas.addEventListener('pointerdown',e=>{const [x,y]=world(e);let found=-1;const order=Array.from({length:model.n},(_,i)=>i).filter(i=>i!==selected);order.push(selected);const ctx=canvas.getContext('2d');ctx.save();ctx.setTransform(1,0,0,1,0,0);for(const i of order)if(ctx.isPointInPath(paths[i],x-start[2*i],y-start[2*i+1]))found=i;ctx.restore();if(found<0)return;stop();selected=found;drag={dx:x-start[2*selected],dy:y-start[2*selected+1]};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});highlight('position');render();});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const[x,y]=world(e);start[2*selected]=Math.max(-extent+.1,Math.min(extent-.1,x-drag.dx));start[2*selected+1]=Math.max(-extent*.7+.1,Math.min(extent*.7-.1,y-drag.dy));edited=true;$('progress').value=0;resimulate();});
canvas.addEventListener('pointerup',()=>{drag=null;});canvas.addEventListener('pointercancel',()=>{drag=null;});
canvas.addEventListener('keydown',e=>{const d={ArrowLeft:[-.015,0],ArrowRight:[.015,0],ArrowUp:[0,-.015],ArrowDown:[0,.015]}[e.key];if(!d)return;e.preventDefault();stop();edited=true;start[2*selected]+=d[0];start[2*selected+1]+=d[1];$('progress').value=0;setExtent();highlight('position');resimulate();});
document.querySelectorAll('[data-puzzle-term]').forEach(el=>el.addEventListener('pointerenter',()=>{highlight(el.dataset.puzzleTerm.split(' ')[0]);copy();}));
art.onload=render;art.onerror=()=>{$('live-note').textContent=t('Image could not load. Reload the page.','이미지를 불러오지 못했다. 새로고침 필요.');};
window.addEventListener('diffusionlanguagechange',render);window.addEventListener('resize',render);
build();
window.JigsawLab={stop,snapshot:()=>({n:model.n,selected,edited,extent,start:Array.from(start),ode:Array.from(sim.ode[frameIndex()]),sde:Array.from(sim.sde[frameIndex()]),time:sim.times[frameIndex()],active,loaded:art.complete&&art.naturalWidth>0})};
})();
