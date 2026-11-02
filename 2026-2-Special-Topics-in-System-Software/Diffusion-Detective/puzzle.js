/* One-step noise prediction experiment. Shared bilingual state and rendering. */
(function(){
'use strict';
const M=PuzzleMath,$=id=>document.getElementById('jig-'+id),t=(en,ko)=>DiffusionI18n.text(en,ko);
const blue='#375f87',orange='#bc8056';
let model,result,paths=[],selected=8,extent=1.15,active='sigma';
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
function build(){const dims={24:[6,4],60:[10,6],150:[15,10]}[num('pieces')];model=M.create(...dims);selected=Math.min(selected,model.n-1);paths=Array.from({length:model.n},(_,i)=>piecePath(i));update();}
function update(){result=M.evaluate(model,num('sigma'),num('error'),num('seed'));extent=1.04;for(const positions of [result.observed,result.estimate])for(let i=0;i<model.n;i++)extent=Math.max(extent,Math.abs(positions[2*i])+.15,(Math.abs(positions[2*i+1])+.15)/.7);render();}
function copy(){
 $('sigma-out').textContent=fmt(result.sigma,2);$('error-out').textContent=fmt(num('error'),2);
 $('signal-value').textContent=fmt(result.a);$('gain-value').textContent=fmt(result.gain);$('snr-value').textContent=Number.isFinite(result.snr)?fmt(result.snr,2):'∞';
 $('noise-error').textContent=fmt(result.noiseError,4);$('position-error').textContent=fmt(result.positionError,4);
 $('piece-status').textContent=t('Selected piece ','선택한 조각 ')+(selected+1)+' / '+model.n;
 const i=2*selected;
 $('live-note').textContent=result.sigma===0?t('σ = 0: no noise is added, so the estimate equals the original regardless of the noise prediction.','σ = 0: 노이즈가 없으므로 노이즈 예측값과 관계없이 원본 위치가 유지된다.'):num('error')===0?t('Zero prediction error: the algebra recovers every original position. This is the reference case with known noise.','예측 오차 0: 수식으로 원본 위치가 복원된다. 실제 노이즈를 아는 경우의 기준 결과이다.'):t('Prediction RMS '+fmt(result.noiseError,4)+' × amplification '+fmt(result.gain)+' = position RMS '+fmt(result.positionError,4)+'.','예측 RMS '+fmt(result.noiseError,4)+' × 증폭률 '+fmt(result.gain)+' = 위치 RMS '+fmt(result.positionError,4)+'.');
 $('piece-values').textContent='xₜ = ('+fmt(result.observed[i])+', '+fmt(result.observed[i+1])+') → x̂₀ = ('+fmt(result.estimate[i])+', '+fmt(result.estimate[i+1])+')';
 $('piece-error').textContent='δ = ('+fmt(result.delta[i])+', '+fmt(result.delta[i+1])+') → x̂₀ − x₀ = ('+fmt(result.estimate[i]-model.mu[i])+', '+fmt(result.estimate[i+1]-model.mu[i+1])+')';
 highlight(active);
}
function drawGain(){const svg=$('gain'),X=s=>45+s/.98*380,Y=g=>175-g/5*145;let d='';for(let j=0;j<=196;j++){const s=j*.005;d+=(j?'L':'M')+X(s).toFixed(2)+','+Y(M.coefficients(s).gain).toFixed(2);}let out='';for(const g of [0,1,2,3,4,5])out+='<path d="M45 '+Y(g)+'H425" stroke="#e1e6eb"/><text x="34" y="'+(Y(g)+3)+'" text-anchor="end">'+g+'</text>';for(const s of [0,.25,.5,.75,.98])out+='<text x="'+X(s)+'" y="195" text-anchor="middle">'+s+'</text>';out+='<path d="'+d+'" fill="none" stroke="'+blue+'" stroke-width="2"/><path d="M'+X(result.sigma)+' 175V'+Y(result.gain)+'" stroke="'+orange+'" stroke-dasharray="3 3"/><circle cx="'+X(result.sigma)+'" cy="'+Y(result.gain)+'" r="4" fill="'+orange+'"/><text x="45" y="16">σ / a</text><text x="425" y="214" text-anchor="end">σ</text>';svg.innerHTML=out;}
function render(){if(!result)return;drawPuzzle('observed',result.observed,null,blue,extent);drawPuzzle('estimate',result.estimate,null,orange,extent);drawGain();copy();}
for(const id of ['sigma','error','seed'])$(id).addEventListener('input',()=>{if(id==='seed')$('seed').value=Math.max(1,Math.min(9999,num('seed')||1));highlight(id);update();});
$('pieces').addEventListener('input',()=>{highlight('position');build();});
$('shuffle').addEventListener('click',()=>{$('seed').value=num('seed')%9999+1;highlight('seed');update();});
$('perfect').addEventListener('click',()=>{$('error').value=0;highlight('error');update();});
for(const id of ['observed','estimate']){
 const canvas=$(id);
 canvas.addEventListener('pointerdown',e=>{const positions=id==='observed'?result.observed:result.estimate,rect=canvas.getBoundingClientRect(),scale=Math.min((rect.width-30)/(2*extent),(rect.height-28)/(2*extent*.7)),x=(e.clientX-rect.left-rect.width/2)/scale,y=(e.clientY-rect.top-rect.height/2)/scale,ctx=canvas.getContext('2d');let found=-1;const order=Array.from({length:model.n},(_,i)=>i).filter(i=>i!==selected);order.push(selected);ctx.save();ctx.setTransform(1,0,0,1,0,0);for(const i of order)if(ctx.isPointInPath(paths[i],x-positions[2*i],y-positions[2*i+1]))found=i;ctx.restore();if(found<0)return;selected=found;canvas.focus({preventScroll:true});highlight('position');render();});
 canvas.addEventListener('keydown',e=>{const d={ArrowLeft:-1,ArrowRight:1,ArrowUp:-model.cols,ArrowDown:model.cols}[e.key];if(d===undefined)return;e.preventDefault();selected=(selected+d+model.n)%model.n;highlight('position');render();});
}
document.querySelectorAll('[data-puzzle-term]').forEach(el=>el.addEventListener('pointerenter',()=>highlight(el.dataset.puzzleTerm.split(' ')[0])));
art.onload=render;art.onerror=()=>{$('live-note').textContent=t('Image could not load. Reload the page.','이미지를 불러오지 못했다. 새로고침 필요.');};
window.addEventListener('diffusionlanguagechange',render);window.addEventListener('resize',render);build();
window.JigsawLab={snapshot:()=>({n:model.n,selected,extent,sigma:result.sigma,error:num('error'),seed:num('seed'),observed:Array.from(result.observed),estimate:Array.from(result.estimate),noiseError:result.noiseError,positionError:result.positionError,gain:result.gain,active,loaded:art.complete&&art.naturalWidth>0})};
})();
