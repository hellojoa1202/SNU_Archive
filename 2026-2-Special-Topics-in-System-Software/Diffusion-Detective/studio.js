/* Numerical views of the lecture's objectives, sharing one analytic field. */
(function(){
'use strict';
const M=FlowMath,V=PuzzleView,tr=(en,ko)=>DiffusionI18n.text(en,ko);
function setup(id){const canvas=document.getElementById(id),r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);const c=canvas.getContext('2d');c.scale(d,d);c.fillStyle='#fff';c.fillRect(0,0,r.width,r.height);c.font='11px Arial';c.lineJoin='round';return{c,w:r.width,h:r.height};}
function line(c,points,color,width=1,dash=[]){c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();c.setLineDash([]);}
function dot(c,p,color,r=3){c.fillStyle=color;c.beginPath();c.arc(...p,r,0,Math.PI*2);c.fill();}
function text(c,value,x,y,color='#6a7a85',align='left',size=11){c.font=size+'px Arial';c.fillStyle=color;c.textAlign=align;c.fillText(value,x,y);}
function arrow(c,a,b,color,width=1.6){line(c,[a,b],color,width);const angle=Math.atan2(b[1]-a[1],b[0]-a[0]);line(c,[[b[0]-5*Math.cos(angle-.5),b[1]-5*Math.sin(angle-.5)],b,[b[0]-5*Math.cos(angle+.5),b[1]-5*Math.sin(angle+.5)]],color,width);}

function mesh(model,state,data){
 const f=V.frame(document.getElementById('mesh-canvas')),c=f.c,t=state.time;
 // Each edge is sampled along the initial material grid, so deformed edges can curve.
 data.grid.forEach((curve,i)=>V.line(f,curve.map(path=>M.at(path,t)),i<5?'#398eaa':'#729fc8',1));
 for(const path of data.cloud)V.dot(f,M.at(path,t),'#669990',1.7);
 const patch=data.patch.map(path=>M.at(path,t));c.beginPath();patch.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle='rgba(36,89,211,.08)';c.fill();c.strokeStyle=V.blue;c.lineWidth=1.2/f.scale;c.stroke();
 const trace=data.trace,upto=Math.floor(t*trace.steps);V.line(f,trace.path.slice(0,upto+1),V.orange,2.6);
 const pos=M.at(trace.path,t);V.dot(f,pos,V.ink,4.5);V.dot(f,trace.path[0],V.orange,3);
 V.text(f,tr('Start','출발'),[trace.path[0][0],trace.path[0][1]-.09],V.orange,11);
 const div=M.differential(model,pos,t).divergence;
 c.save();c.setTransform(Math.min(devicePixelRatio||1,2),0,0,Math.min(devicePixelRatio||1,2),0,0);
 text(c,(div<-.005?tr('Now: local compression','현재: 국소 압축'):div>.005?tr('Now: local expansion','현재: 국소 팽창'):tr('Now: locally volume-preserving','현재: 국소 부피 유지')),14,21,V.blue);
 text(c,tr('divergence: ','발산: ')+div.toFixed(3),f.w-14,21,'#6f7f8c','right');
 const patchArea=Math.abs(patch.reduce((sum,p,i)=>{const q=patch[(i+1)%patch.length];return sum+p[0]*q[1]-p[1]*q[0];},0))/2;
 text(c,tr('Patch area: ','작은 영역의 면적: ')+(patchArea/.0144).toFixed(2)+'×',14,f.h-13,V.blue);c.restore();
 return{divergence:div,integrated:M.scalarAt(trace.logp,t),direct:M.logDensity(model,pos,t)};
}
function regression(model,state){
 const f=V.frame(document.getElementById('fm-canvas'));V.heat(f,model,state.time,state.revision);
 for(let y=-.65;y<=.65;y+=.26)for(let x=-1.15;x<=1.15;x+=.28)V.arrow(f,[x,y],M.field(model,[x,y],state.time),'#b8c8d7',.8,.22);
 const target=M.field(model,state.probe,state.time),factor=.38;
 V.arrow(f,state.probe,target,V.blue,2.5,factor);V.arrow(f,state.probe,state.prediction,V.orange,2.5,factor);V.dot(f,state.probe,V.ink,4);
 const tip=state.probe.map((x,j)=>x+factor*state.prediction[j]);V.dot(f,tip,V.orange,5);
 const targetTip=state.probe.map((x,j)=>x+factor*target[j]);V.line(f,[tip,targetTip],'#88999f',1,[3,3]);
 return tip;
}
function loss(model,state){
 const info=M.field(model,state.probe,state.time,true),risk=M.conditionalRisk(model,state.probe,state.time,state.prediction);
 const{c,w,h}=setup('loss-canvas'),left=48,right=w-22,top=31,bottom=h-41;
 const offset=state.prediction[0]-info.v[0],vertical=(state.prediction[1]-info.v[1])**2;
 const range=Math.max(1.3,Math.abs(offset)*1.12),maxY=range*range+vertical+risk.irreducible+.12;
 const map=(x,y)=>[left+(x+range)/(2*range)*(right-left),bottom-y/maxY*(bottom-top)];
 for(const frac of [0,.5,1]){const y=frac*maxY;line(c,[map(-range,y),map(range,y)],'#e7edf1');text(c,y.toFixed(1),left-7,map(0,y)[1]+3,'#83939f','right',10);}
 const low=[],high=[];for(let i=0;i<=100;i++){const x=-range+2*range*i/100;low.push(map(x,x*x+vertical));high.push(map(x,x*x+vertical+risk.irreducible));}
 c.beginPath();high.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));low.slice().reverse().forEach(p=>c.lineTo(...p));c.closePath();c.fillStyle='rgba(83,126,117,.12)';c.fill();line(c,high,'#537e75',2);line(c,low,V.blue,2);
 line(c,[map(0,0),map(0,maxY)],'#b9c8d0',1,[3,3]);line(c,[map(offset,0),map(offset,risk.total)],V.orange,1,[3,3]);dot(c,map(offset,risk.total),'#537e75',4);dot(c,map(offset,risk.excess),V.blue,4);
 for(const x of [-range*.75,0,range*.75])text(c,(info.v[0]+x).toFixed(2),map(x,0)[0],bottom+17,'#7c8d99','center',10);
 text(c,tr('Conditional error','조건부 오차'),left,16,'#537e75');text(c,tr('Error from mean','평균과의 오차'),right,16,V.blue,'right');text(c,tr('Candidate horizontal velocity','후보 가로속도'),(left+right)/2,h-7,'#6a7a85','center');
 text(c,tr('Same horizontal minimizer','가로 최솟값 위치 동일'),map(0,vertical)[0]+8,map(0,vertical)[1]-9,V.ink,'left',10);
 return{...risk,range};
}
function quadrature(model,state,reference,profiles){const{c,w,h}=setup('quadrature-canvas'),left=48,right=w-20,panelH=(h-80)/2;const samples=Array.from({length:101},(_,k)=>{const t=k/100,p=M.at(reference.fine.path,t);return[t,M.field(model,p,t)[state.axis]];});const values=[0,...samples.map(p=>p[1]),...profiles.flatMap(p=>p.segments.flatMap(s=>[s.v0,s.v1]))];let low=Math.min(...values),high=Math.max(...values);const pad=Math.max(.06,(high-low)*.12);low-=pad;high+=pad;
 profiles.forEach((profile,i)=>{const top=24+i*(panelH+28),bottom=top+panelH-20,color=i?V.blue:V.orange,map=(t,v)=>[left+t*(right-left),bottom-(v-low)/(high-low)*(bottom-top)];
 text(c,i?'Heun':'Euler',left,top-8,color,'left',12);for(const y of [low,0,high]){line(c,[map(0,y),map(1,y)],y===0?'#a9bbc8':'#edf1f4',y===0?1.2:.7);text(c,y.toFixed(2),left-7,map(0,y)[1]+3,'#8293a0','right',9);}
 profile.segments.forEach(seg=>{const current=state.time>=seg.t0&&state.time<seg.t1,points=[map(seg.t0,0),map(seg.t0,seg.v0),map(seg.t1,seg.v1),map(seg.t1,0)];c.beginPath();points.forEach((p,j)=>j?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=i?(current?'rgba(55,95,135,.3)':'rgba(55,95,135,.09)'):(current?'rgba(188,128,86,.32)':'rgba(188,128,86,.10)');c.fill();c.strokeStyle=i?'rgba(55,95,135,.36)':'rgba(188,128,86,.38)';c.lineWidth=current?1.5:.65;c.stroke();});
 line(c,samples.map(([t,v])=>map(t,v)),'#6f7f8c',1.1);line(c,[map(state.time,low),map(state.time,high)],'#a5b4be',1,[3,4]);for(const t of [0,.5,1])text(c,String(t),map(t,0)[0],bottom+15,'#81939f','center',10);
 });text(c,tr('Time · signed area accumulates displacement','시간 · 부호 있는 면적을 누적하면 변위'),w/2,h-5,V.ink,'center',10);
}
function pairLayout(){
 const canvas=document.getElementById('plan-canvas'),r=canvas.getBoundingClientRect(),vertical=r.width<620;
 const panels=Array.from({length:3},(_,stage)=>{const w=vertical?r.width:(r.width-48)/3,h=vertical?r.height/3:r.height,x=vertical?0:stage*(w+24),y=vertical?stage*h:0;
  return{x,y,w,h,cx:x+w/2,cy:y+h/2+6,scale:Math.min((w-22)/2.6,(h-80)/1.8)};});
 return{canvas,r,panels,vertical};
}
function pairPoint(e,forceStage){const l=pairLayout(),x=e.clientX-l.r.left,y=e.clientY-l.r.top;let stage=forceStage;
 if(stage===undefined)stage=l.vertical?Math.min(2,Math.max(0,Math.floor(y/(l.r.height/3)))):l.panels.reduce((best,p,i)=>Math.abs(x-p.cx)<Math.abs(x-l.panels[best].cx)?i:best,0);
 const p=l.panels[stage];return{stage,point:[(x-p.cx)/p.scale,(y-p.cy)/p.scale]};
}
function pairboard(model,state){
 const{c,w,h}=setup('plan-canvas'),layout=pairLayout(),titles=[tr('Starting arrangement','출발 배치'),tr('Conditional interpolation','조건부 보간'),tr('Assigned endpoints','대응된 도착점')],order=model.a.map((_,i)=>i).filter(i=>i!==state.selected).concat(state.selected);
 layout.panels.forEach((p,stage)=>{
  text(c,String(stage+1).padStart(2,'0'),p.x+8,p.y+18,V.blue,'left',10);
  text(c,titles[stage],p.x+30,p.y+18,V.ink,'left',11);
  text(c,stage===0?'t = 0':stage===2?'t = 1':'t = '+state.time.toFixed(2),p.cx,p.y+p.h-15,'#627386','center',10);
  c.save();c.beginPath();c.rect(p.x,p.y+30,p.w,p.h-60);c.clip();c.translate(p.cx,p.cy);c.scale(p.scale,p.scale);const f={c,scale:p.scale,w:p.w,h:p.h};
  if(stage===1){const i=state.selected;V.line(f,[model.a[i],model.b[model.pi[i]]],V.orange,1.5,[3,4]);V.dot(f,model.a[i],V.orange,2.5);}
  for(const i of order){const pos=stage===0?model.a[i]:stage===2?model.b[model.pi[i]]:M.component(model,i,state.time).mu;V.piece(f,model,i,pos,i===state.selected);}
  c.restore();
  if(stage<2){if(layout.vertical)arrow(c,[w/2,p.y+p.h-4],[w/2,p.y+p.h+9],'#8da6b1',1);else arrow(c,[p.x+p.w+3,h/2],[p.x+p.w+20,h/2],'#8da6b1',1);}
 });
 const i=state.selected;document.getElementById('pair-live').textContent=tr('Piece ','조각 ')+(i+1)+' → '+tr('destination ','도착점 ')+(model.pi[i]+1)+tr(' · one of 48 conditional targets',' · 48개 조건부 목표 중 하나');
}
let velocityGeometry=null;
function velocityLoss(model,state){
 const{c,w,h}=setup('velocity-canvas'),target=M.field(model,state.probe,state.time),p=state.prediction;
 const bound=Math.max(2.2,...target.map(v=>Math.abs(v)+.6),...p.map(v=>Math.abs(v)+.3));
 const left=38,right=w-20,top=35,bottom=h-35,scale=Math.min((right-left)/(bound*2),(bottom-top)/(bound*2)),cx=(left+right)/2,cy=(top+bottom)/2,map=v=>[cx+v[0]*scale,cy+v[1]*scale];
 velocityGeometry={cx,cy,scale,bound};
 c.save();c.beginPath();c.rect(left,top,right-left,bottom-top);c.clip();
 line(c,[[left,cy],[right,cy]],'#dce5ec');line(c,[[cx,top],[cx,bottom]],'#dce5ec');
 const a=map(target),b=map(p);for(const radius of [.5,1,1.5,2]){c.beginPath();c.arc(...a,radius*scale,0,Math.PI*2);c.strokeStyle='#abc0ec';c.lineWidth=.85;c.stroke();text(c,(radius*radius).toFixed(2),a[0]+radius*scale-3,a[1]-5,'#6c89b5','right',9);}
 line(c,[a,b],V.orange,2);dot(c,a,V.blue,4);dot(c,b,V.orange,5);c.restore();
 text(c,tr('Squared error in velocity space','속도 공간에서의 제곱오차'),14,17,V.ink,'left',11);
 text(c,'vₓ',right,cy+15,'#7e8b9b','right',10);text(c,'vᵧ',cx+8,bottom-3,'#7e8b9b','left',10);
 for(const v of [-2,-1,1,2])if(Math.abs(v)<bound){text(c,String(v),map([v,0])[0],cy+13,'#8c9aaa','center',9);text(c,String(v),cx-7,map([0,v])[1]+3,'#8c9aaa','right',9);}
 text(c,tr('Target at the centre · drag the orange point','중심: 목표 속도 · 주황 점을 드래그'),w/2,h-9,'#526a80','center',10);
}
function velocityPoint(e){const r=document.getElementById('velocity-canvas').getBoundingClientRect(),g=velocityGeometry;return[(e.clientX-r.left-g.cx)/g.scale,(e.clientY-r.top-g.cy)/g.scale].map(x=>Math.max(-3,Math.min(3,x)));}

window.CourseStudio={mesh,regression,loss,quadrature,pairboard,pairPoint,velocityLoss,velocityPoint};
})();
