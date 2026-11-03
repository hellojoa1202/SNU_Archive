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
 for(const curve of data.grid)V.line(f,curve.map(path=>M.at(path,t)),'#c8d6df',.85);
 for(const path of data.cloud)V.dot(f,M.at(path,t),'#96adbd',1.8);
 const patch=data.patch.map(path=>M.at(path,t));c.beginPath();patch.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle='rgba(55,95,135,.16)';c.fill();c.strokeStyle=V.blue;c.lineWidth=1.2/f.scale;c.stroke();
 const trace=data.trace,upto=Math.floor(t*trace.steps);V.line(f,trace.path.slice(0,upto+1),V.orange,2);
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
 for(let y=-.65;y<=.65;y+=.26)for(let x=-1.15;x<=1.15;x+=.28)V.arrow(f,[x,y],M.field(model,[x,y],state.time),'#d7e0e6',.65,.22);
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
window.CourseStudio={mesh,regression,loss,quadrature};
})();
