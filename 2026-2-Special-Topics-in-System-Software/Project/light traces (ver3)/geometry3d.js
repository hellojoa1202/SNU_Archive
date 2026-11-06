/* Orthographic views of the existing two-dimensional experiment.
   Space-time uses z=time; the separate surface uses z=analytic density. */
(function(root){
'use strict';
const BLUE='#73b9df',RED='#ae4c54',INK='#344652',MUTED='#84919c';
const round=x=>Number(x.toFixed(2));
function rotate(p,yaw=35,tilt=25){const a=yaw*Math.PI/180,e=tilt*Math.PI/180,u=Math.cos(a)*p[0]-Math.sin(a)*p[1],d=Math.sin(a)*p[0]+Math.cos(a)*p[1];return[u,Math.sin(e)*d-Math.cos(e)*p[2],Math.cos(e)*d+Math.sin(e)*p[2]];}
function camera({bound,height,width=460,pixels=390,yaw=35,tilt=25}){
 const corners=[];for(const x of[-bound,bound])for(const y of[-bound,bound])for(const z of[0,height])corners.push(rotate([x,y,z],yaw,tilt));
 const xmin=Math.min(...corners.map(q=>q[0])),xmax=Math.max(...corners.map(q=>q[0])),ymin=Math.min(...corners.map(q=>q[1])),ymax=Math.max(...corners.map(q=>q[1]));
 const scale=Math.min((width-86)/(xmax-xmin),(pixels-72)/(ymax-ymin));
 return p=>{const q=rotate(p,yaw,tilt);return[width/2+(q[0]-(xmin+xmax)/2)*scale,pixels/2+(q[1]-(ymin+ymax)/2)*scale,q[2]];};
}
function path(points,project,color,width=1,dash=''){
 const d=points.map((p,i)=>{const q=project(p);return(i?'L':'M')+round(q[0])+','+round(q[1]);}).join(' ');
 return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
}
function label(p,project,text,color=MUTED,dy=0){const q=project(p);return `<text x="${round(q[0]+4)}" y="${round(q[1]+dy)}" fill="${color}" font-size="10">${text}</text>`;}
function dot(p,project,color,r=2,ring=false){const q=project(p);return `<circle cx="${round(q[0])}" cy="${round(q[1])}" r="${r}" fill="${ring?'white':color}" stroke="${color}" stroke-width="${ring?1.8:.2}"/>`;}
function axes(project,B,H,vertical,ticks){let s='';
 for(const z of[0,H])s+=path([[-B,-B,z],[B,-B,z],[B,B,z],[-B,B,z],[-B,-B,z]],project,'#e1e6eb',.8);
 for(const x of[-B,B])for(const y of[-B,B])s+=path([[x,y,0],[x,y,H]],project,'#e1e6eb',.8);
 s+=path([[-B,-B,0],[B,-B,0]],project,'#9aa8b2')+path([[-B,-B,0],[-B,B,0]],project,'#9aa8b2')+path([[-B,-B,0],[-B,-B,H]],project,'#9aa8b2');
 s+=label([B,-B,0],project,'x',INK,12)+label([-B,B,0],project,'y',INK,12)+label([-B,-B,H],project,vertical,INK,-10);
 for(const [z,value]of ticks)s+=label([-B,-B,z],project,value,MUTED,4);
 return s;
}
function sampleIds(count,n,selected){const ids=new Set(Array.from({length:Math.min(n,count)},(_,i)=>Math.floor(i*count/Math.min(n,count))));ids.add(selected);return [...ids];}
function vertices(path,index,stride=1){const n=path.length-1,ids=[];for(let k=0;k<=index;k+=stride)ids.push(k);if(ids.at(-1)!==index)ids.push(index);return ids.map(k=>[path[k][0],path[k][1],k/n]);}
function contours(density,t,B,n=40){const g=[],segments=[];let peak=0;
 for(let j=0;j<=n;j++){g[j]=[];for(let i=0;i<=n;i++){const v=density([-B+2*B*i/n,-B+2*B*j/n],t);g[j][i]=v;peak=Math.max(peak,v);}}
 for(const level of[.18,.5,.82].map(v=>v*peak))for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const v=[g[j][i],g[j][i+1],g[j+1][i+1],g[j+1][i]],c=[[i,j],[i+1,j],[i+1,j+1],[i,j+1]],hits=[];
  for(let k=0;k<4;k++){const l=(k+1)%4;if((v[k]<level)===(v[l]<level))continue;const a=(level-v[k])/(v[l]-v[k]);hits.push(c[k].map((q,d)=>-B+2*B*(q+a*(c[l][d]-q))/n));}
  for(let k=0;k+1<hits.length;k+=2)segments.push([hits[k],hits[k+1]]);
 }return segments;
}
function spacetime({paths,frame,bound=3.5,yaw=35,tilt=25,count=24,selected=0,color=BLUE,density,contourLines}){
 const B=bound,H=2*B*1.1,project=camera({bound:B,height:H,yaw,tilt}),z=frame.index/(paths[0].length-1)*H;
 let s=axes(project,B,H,'t',[[0,'0.05'],[H/2,'0.50'],[H,'0.95']]);
 const ids=sampleIds(paths.length,count,selected).filter(i=>i!==selected);
 function trajectory(i,selectedPath){const p=paths[i],stride=selectedPath?1:8,points=vertices(p,frame.index,stride).map(q=>[q[0],q[1],q[2]*H]);
  const future=[];for(let k=frame.index;k<p.length;k+=stride)future.push([p[k][0],p[k][1],k/(p.length-1)*H]);const last=p.at(-1);future.push([last[0],last[1],H]);
  return path(future,project,selectedPath?color+'55':color+'22',selectedPath?1:.55,'2 4')+path(points,project,selectedPath?color:color+'66',selectedPath?1.9:.7);
 }
 for(const i of ids)s+=trajectory(i,false);
 s+=path([[-B,-B,z],[B,-B,z],[B,B,z],[-B,B,z],[-B,-B,z]],project,'#657e91',1,'4 3');
 for(const seg of contourLines||contours(density,frame.time,B))s+=path(seg.map(q=>[q[0],q[1],z]),project,'#aebbc5',.65,'2 3');
 const points=frame.points.map((p,i)=>({p:[p[0],p[1],z],i})).sort((a,b)=>project(a.p)[2]-project(b.p)[2]);
 for(const q of points)s+=dot(q.p,project,color+'b5',1.7);
 s+=trajectory(selected,true)+dot([frame.points[selected][0],frame.points[selected][1],z],project,color,4,true);
 s+=dot([paths[selected][0][0],paths[selected][0][1],0],project,INK,2.4);
 s+=`<text x="16" y="375" fill="${INK}" font-size="10">t : ${frame.time.toFixed(3)} · #${selected+1}</text>`;
 return s;
}
function surface({density,t,yaw=35,tilt=25,bound=2.2,maxDensity=2,n=48}){
 const B=bound,H=2.8,project=camera({bound:B,height:H,width:900,pixels:360,yaw,tilt}),grid=[];let peak=0;
 for(let j=0;j<=n;j++){grid[j]=[];for(let i=0;i<=n;i++){const x=-B+2*B*i/n,y=-B+2*B*j/n,p=density([x,y],t);peak=Math.max(peak,p);grid[j][i]=[x,y,p/maxDensity*H];}}
 let s=axes(project,B,H,'density',[[0,'0'],[H/2,'1'],[H,'2']]);
 for(const seg of contours(density,t,B,48))s+=path(seg.map(q=>[q[0],q[1],0]),project,'#b7c4ce',.7,'2 3');
 for(let j=0;j<=n;j++)s+=path(grid[j],project,BLUE+'c0',.75);
 for(let i=0;i<=n;i++)s+=path(grid.map(row=>row[i]),project,'#5187a6a0',.65);
 s+=`<text x="20" y="344" fill="${INK}" font-size="10">t : ${t.toFixed(3)} · peak : ${peak.toFixed(3)} · density axis : 0–2</text>`;
 return s;
}
const api={rotate,camera,sampleIds,vertices,contours,spacetime,surface};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LightGeometry3D=api;
})(globalThis);
