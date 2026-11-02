/* Data-grounded visual metaphors. No additional displayed mathematical formulas. */
(function(){
'use strict';
const M=FlowMath,V=PuzzleView,tr=(en,ko)=>DiffusionI18n.text(en,ko),palette=['#b27b56','#537e75','#7787ab','#9c8099'];
function setup(id){const canvas=document.getElementById(id),r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);const c=canvas.getContext('2d');c.scale(d,d);c.fillStyle='#fff';c.fillRect(0,0,r.width,r.height);c.font='11px Arial';c.lineJoin='round';return{c,w:r.width,h:r.height};}
function line(c,points,color,width=1,dash=[]){c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();c.setLineDash([]);}
function dot(c,p,color,r=3){c.fillStyle=color;c.beginPath();c.arc(...p,r,0,Math.PI*2);c.fill();}
function text(c,value,x,y,color='#6a7a85',align='left',size=11){c.font=size+'px Arial';c.fillStyle=color;c.textAlign=align;c.fillText(value,x,y);}
function arrow(c,a,b,color,width=1.6){line(c,[a,b],color,width);const angle=Math.atan2(b[1]-a[1],b[0]-a[0]);line(c,[[b[0]-5*Math.cos(angle-.5),b[1]-5*Math.sin(angle-.5)],b,[b[0]-5*Math.cos(angle+.5),b[1]-5*Math.sin(angle+.5)]],color,width);}
function score(model,state){const{c,w,h}=setup('score-canvas'),project=(p,t)=>[w*.43+p[0]*w*.22+p[1]*w*.11,h*.18+(1-t)*h*.59+p[1]*h*.09];
 const plane=(t,fill)=>{const ps=[[-1.4,-.8],[1.4,-.8],[1.4,.8],[-1.4,.8]].map(p=>project(p,t));c.beginPath();ps.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();if(fill){c.fillStyle=fill;c.fill();}c.strokeStyle='#dce5eb';c.lineWidth=1;c.stroke();};
 plane(0);plane(1);for(let i=0;i<12;i++){const a=project(model.a[i],0),b=project(model.b[model.pi[i]],1);line(c,[a,b],i===state.selected?V.orange:'#ccd9e1',i===state.selected?2.5:1);dot(c,a,'#9eafbb',2);dot(c,b,'#9eafbb',2);}
 plane(state.time,'rgba(55,95,135,.07)');for(let i=0;i<12;i++){const p=project(M.component(model,i,state.time).mu,state.time);dot(c,p,i===state.selected?V.orange:V.blue,i===state.selected?5:2.6);if(i===state.selected)text(c,'xₜ',p[0]+8,p[1]-8,V.orange);}
 const ax=w*.91,top=h*.18,bottom=h*.77;line(c,[[ax,top],[ax,bottom]],'#b8c7d1');for(const t of [0,.5,1]){const y=bottom-t*(bottom-top);line(c,[[ax-4,y],[ax+4,y]],'#9caebc');text(c,t.toFixed(1),ax-8,y+4,'#7e909e','right',10);}const y=bottom-state.time*(bottom-top);dot(c,[ax,y],V.blue,5);text(c,tr('time','시간'),ax,top-16,V.blue,'center');
 text(c,tr('Source plane','출발 평면'),12,h-15);text(c,tr('Destination plane','도착 평면'),12,20);text(c,tr('Slope: conditional velocity','기울기: 조건부 속도'),w/2,h-15,V.orange,'center',10);
}
function layers(info){const{c,w,h}=setup('layers-canvas'),rank=info.weights.map((weight,i)=>({weight,i})).sort((a,b)=>b.weight-a.weight),cardW=w*.27,cardH=h*.43;
 rank.slice(0,3).forEach(({weight,i},j)=>{const x=w*(.17+j*.33),y=30+Math.abs(j-1)*12;c.save();c.translate(x,y+cardH/2);c.rotate((j-1)*.04);c.fillStyle=`rgba(55,95,135,${.025+.14*weight})`;c.strokeStyle='#ccd8e0';c.lineWidth=1;c.beginPath();c.rect(-cardW/2,-cardH/2,cardW,cardH);c.fill();c.stroke();text(c,tr('Plan ','계획 ')+(i+1),-cardW/2+8,-cardH/2+17,palette[j], 'left',10);text(c,(weight*100).toFixed(1)+'%',-cardW/2+8,-cardH/2+33,palette[j],'left',11);
 const v=info.components[i],unit=Math.min(cardW,cardH)*.34;arrow(c,[0,16],[v[0]*unit,16+v[1]*unit],'#b3c1cb',1);arrow(c,[0,16],[v[0]*unit*weight,16+v[1]*unit*weight],palette[j],2.3);c.restore();});
 const chain=[[0,0]];for(const {weight,i} of rank){const last=chain.at(-1);chain.push([last[0]+info.components[i][0]*weight,last[1]+info.components[i][1]*weight]);}
 const minX=Math.min(...chain.map(p=>p[0])),maxX=Math.max(...chain.map(p=>p[0])),minY=Math.min(...chain.map(p=>p[1])),maxY=Math.max(...chain.map(p=>p[1]));
 const unit=Math.min(w*.58/Math.max(.3,maxX-minX),h*.22/Math.max(.18,maxY-minY)),project=p=>[w/2+(p[0]-(minX+maxX)/2)*unit,h*.77+(p[1]-(minY+maxY)/2)*unit];
 chain.slice(1).forEach((p,j)=>{const color=palette[j]||'#bbc8d0';arrow(c,project(chain[j]),project(p),color,2.3);dot(c,project(p),'#96aab9',1.5);});
 const start=project(chain[0]),end=project(chain.at(-1));arrow(c,[start[0],start[1]+10],[end[0],end[1]+10],V.ink,2);dot(c,start,V.ink,3);text(c,tr('All 12 weighted contributions → mean','12개 가중 기여의 누적 → 평균'),w/2,h-15,V.ink,'center',10);

}
function loss(info,state){const{c,w,h}=setup('loss-canvas'),risk=M.conditionalRisk(state.model,state.probe,state.time,state.prediction),left=48,right=w-22,top=28,bottom=h-40,range=1.3,maxY=range*range+risk.irreducible+.12;
 const map=(offset,y)=>[left+(offset+range)/(range*2)*(right-left),bottom-y/maxY*(bottom-top)];
 for(const frac of [0,.5,1]){const y=frac*maxY;line(c,[map(-range,y),map(range,y)],'#e7edf1');text(c,y.toFixed(1),left-7,map(0,y)[1]+3,'#83939f','right',10);}
 const lower=[],upper=[];for(let i=0;i<=100;i++){const x=-range+2*range*i/100;lower.push(map(x,x*x));upper.push(map(x,x*x+risk.irreducible));}
 c.beginPath();upper.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));lower.slice().reverse().forEach(p=>c.lineTo(...p));c.closePath();c.fillStyle='rgba(83,126,117,.13)';c.fill();line(c,upper,'#537e75',2);line(c,lower,V.blue,2);
 line(c,[map(0,0),map(0,maxY)],'#bdc9d2',1,[3,4]);const x=state.candidateOffset;line(c,[map(x,0),map(x,x*x+risk.irreducible)],'#8f7a9a',1,[3,3]);dot(c,map(x,x*x+risk.irreducible),'#537e75',4);dot(c,map(x,x*x),V.blue,4);
 for(const x of [-1,0,1])text(c,(info.v[0]+x).toFixed(2),map(x,0)[0],bottom+17,'#7c8d99','center',10);
 text(c,tr('Candidate horizontal velocity','후보 가로속도'),(left+right)/2,h-7,'#6a7a85','center');text(c,tr('Conditional error','조건부 오차'),left,15,'#537e75');text(c,tr('Error from mean','평균과의 오차'),right,15,V.blue,'right');
 const label=tr('Same minimum','같은 최솟값 위치');text(c,label,map(0,0)[0]+8,bottom-9,V.ink,'left',10);
 return risk;
}
function gate(model,state,paths,history,reference){const f=V.frame(document.getElementById('transport-canvas')),c=f.c,counts=M.boundaryCounts(history,state.time);V.heat(f,model,state.time,state.revision);const recent=history.events.filter(e=>e.time<=state.time&&e.time>state.time-.045);
 c.fillStyle='rgba(83,126,117,.035)';c.fillRect(-1.45,-.9,state.cut+1.45,1.8);V.line(f,[[state.cut,-.9],[state.cut,.9]],'#738c83',1.7);
 for(const event of recent){const color=event.enter?'#487e60':V.orange,alpha=1-(state.time-event.time)/.045;c.save();c.globalAlpha=Math.max(.15,alpha);V.line(f,[[state.cut,event.y-.055],[state.cut,event.y+.055]],color,5);V.arrow(f,[state.cut+(event.enter?.12:-.12),event.y],[event.enter?-1:1,0],color,2,.24);c.restore();}
 paths.forEach((path,index)=>{const p=M.at(path,state.time),past=M.at(path,Math.max(0,state.time-.045)),event=recent.find(e=>e.index===index),color=event?(event.enter?'#487e60':V.orange):p[0]<=state.cut?V.blue:'#b1bdc5';V.line(f,[past,p],color,event?1.5:.7);V.dot(f,p,color,event?3.7:2.3);});
 V.text(f,tr('Inside','안쪽'),[-1.1,-.96],V.blue,10);V.text(f,tr('Outside','바깥쪽'),[1.1,-.96],'#8697a4',10);V.text(f,tr('Probability gate','확률 출입문'),[state.cut,.98],'#55786c',10);
 const ref=reference.fine;V.line(f,[model.a[state.selected],model.b[model.pi[state.selected]]],V.orange,1,[4,4]);V.line(f,ref.path.slice(0,Math.floor(state.time*4096)+1),V.blue,1.4);V.dot(f,M.at(ref.path,state.time),V.ink,4);return counts;
}
function quadrature(model,state,reference,profiles){const{c,w,h}=setup('quadrature-canvas'),left=48,right=w-20,panelH=(h-80)/2;const samples=Array.from({length:101},(_,k)=>{const t=k/100,p=M.at(reference.fine.path,t);return[t,M.field(model,p,t)[state.axis]];});const values=[0,...samples.map(p=>p[1]),...profiles.flatMap(p=>p.segments.flatMap(s=>[s.v0,s.v1]))];let low=Math.min(...values),high=Math.max(...values);const pad=Math.max(.06,(high-low)*.12);low-=pad;high+=pad;
 profiles.forEach((profile,i)=>{const top=24+i*(panelH+28),bottom=top+panelH-20,color=i?V.blue:V.orange,map=(t,v)=>[left+t*(right-left),bottom-(v-low)/(high-low)*(bottom-top)];
 text(c,i?'Heun':'Euler',left,top-8,color,'left',12);for(const y of [low,0,high]){line(c,[map(0,y),map(1,y)],y===0?'#a9bbc8':'#edf1f4',y===0?1.2:.7);text(c,y.toFixed(2),left-7,map(0,y)[1]+3,'#8293a0','right',9);}
 profile.segments.forEach(seg=>{const current=state.time>=seg.t0&&state.time<seg.t1,points=[map(seg.t0,0),map(seg.t0,seg.v0),map(seg.t1,seg.v1),map(seg.t1,0)];c.beginPath();points.forEach((p,j)=>j?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=i?(current?'rgba(55,95,135,.3)':'rgba(55,95,135,.09)'):(current?'rgba(188,128,86,.32)':'rgba(188,128,86,.10)');c.fill();c.strokeStyle=i?'rgba(55,95,135,.36)':'rgba(188,128,86,.38)';c.lineWidth=current?1.5:.65;c.stroke();});
 line(c,samples.map(([t,v])=>map(t,v)),'#6f7f8c',1.1);line(c,[map(state.time,low),map(state.time,high)],'#a5b4be',1,[3,4]);for(const t of [0,.5,1])text(c,String(t),map(t,0)[0],bottom+15,'#81939f','center',10);
 });text(c,tr('Time · signed area accumulates displacement','시간 · 부호 있는 면적을 누적하면 변위'),w/2,h-5,V.ink,'center',10);
}
window.CourseStudio={score,layers,loss,gate,quadrature};
})();
