/* Exact smooth conditional-flow model. Component i carries one shared Gaussian
   offset from A_i to B_pi(i). Thus q_i(t)=N((1-t)A_i+tB_pi(i),tau²I),
   u_i=B_pi(i)-A_i and v=sum_i r_i u_i. No fitted network or score model. */
(function(root){
'use strict';
const TAU=.16;
function create(){
 const b=Array.from({length:12},(_,i)=>[(i%4-1.5)*.42,(Math.floor(i/4)-1)*.42]);
 const order=[7,0,10,3,9,2,5,11,1,8,6,4];
 const a=order.map((j,i)=>[b[j][0]*1.22-.18,b[j][1]*1.3+.09]);
 return{a,b,pi:b.map((_,i)=>i),tau:TAU};
}
function component(m,i,t){const a=m.a[i],b=m.b[m.pi[i]],u=[b[0]-a[0],b[1]-a[1]];return{mu:[a[0]+t*u[0],a[1]+t*u[1]],u};}
function field(m,x,t,details=false){
 const n=m.a.length,logs=new Float64Array(n),us=new Array(n);let top=-Infinity;
 for(let i=0;i<n;i++){const {mu,u}=component(m,i,t);us[i]=u;logs[i]=-((x[0]-mu[0])**2+(x[1]-mu[1])**2)/(2*m.tau*m.tau);top=Math.max(top,logs[i]);}
 let z=0,vx=0,vy=0;for(let i=0;i<n;i++){logs[i]=Math.exp(logs[i]-top);z+=logs[i];vx+=logs[i]*us[i][0];vy+=logs[i]*us[i][1];}
 const v=[vx/z,vy/z];if(!details)return v;
 return{v,weights:Array.from(logs,q=>q/z),density:Math.exp(top)*z/(n*2*Math.PI*m.tau*m.tau),components:us};
}
const density=(m,x,t)=>field(m,x,t,true).density;
function swap(m,i,j){const other=m.pi.indexOf(j);[m.pi[i],m.pi[other]]=[m.pi[other],m.pi[i]];}
function integrate(m,start,method='heun',steps=1024){
 if(!['euler','heun'].includes(method)||!Number.isInteger(steps)||steps<1)throw new RangeError('Invalid solver');
 const h=1/steps,path=[start.slice()];let x=start.slice();
 const add=(a,b,s)=>[a[0]+s*b[0],a[1]+s*b[1]];
 for(let k=0;k<steps;k++){const t=k*h,k1=field(m,x,t);if(method==='euler')x=add(x,k1,h);
 else if(method==='heun'){const k2=field(m,add(x,k1,h),t+h);x=[x[0]+h*(k1[0]+k2[0])/2,x[1]+h*(k1[1]+k2[1])/2];}

 path.push(x);
 }return{path,end:x,nfe:steps*({euler:1,heun:2}[method])};
}
function at(path,t){const s=Math.max(0,Math.min(1,t))*(path.length-1),i=Math.min(path.length-2,Math.floor(s)),w=s-i;return path[i].map((x,j)=>x*(1-w)+path[i+1][j]*w);}
function rng(seed){let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)+.5)/4294967296;}
function samples(m,count=96,seed=17){const r=rng(seed),normal=()=>Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r());return Array.from({length:count},(_,i)=>m.a[i%m.a.length].map(x=>x+m.tau*normal()));}
function conditionalRisk(m,x,t,pred){const f=field(m,x,t,true);let irreducible=0,total=0;for(let i=0;i<f.weights.length;i++)for(let j=0;j<2;j++){irreducible+=f.weights[i]*(f.components[i][j]-f.v[j])**2;total+=f.weights[i]*(f.components[i][j]-pred[j])**2;}return{total,irreducible,excess:(pred[0]-f.v[0])**2+(pred[1]-f.v[1])**2};}
// Normal CDF, max absolute approximation error about 7.5e-8.
function normalCDF(x){const z=Math.abs(x)/Math.SQRT2,t=1/(1+.3275911*z),erf=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z);return .5*(1+(x<0?-erf:erf));}
function regionMass(m,t,cut){return m.a.reduce((sum,_,i)=>sum+normalCDF((cut-component(m,i,t).mu[0])/m.tau),0)/m.a.length;}
function regionRate(m,t,cut){return m.a.reduce((sum,_,i)=>{const {mu,u}=component(m,i,t),z=(cut-mu[0])/m.tau;return sum-u[0]*Math.exp(-z*z/2)/(m.tau*Math.sqrt(2*Math.PI));},0)/m.a.length;}
// Stage values expose the lecture update as signed velocity area.
function quadrature(m,start,method,steps,axis=0){
 if(![0,1].includes(axis))throw new RangeError('Invalid coordinate');
 const solve=integrate(m,start,method,steps),h=1/steps,segments=[];
 for(let k=0;k<steps;k++){const x=solve.path[k],t=k*h,v=field(m,x,t),predict=x.map((a,j)=>a+h*v[j]);
  const v0=v[axis],v1=method==='euler'?v0:field(m,predict,t+h)[axis];
  segments.push({t0:t,t1:t+h,v0,v1,area:h*(v0+v1)/2});
 }
 return{segments,area:segments.reduce((sum,s)=>sum+s.area,0),displacement:solve.end[axis]-start[axis],nfe:solve.nfe,path:solve.path};
}
// Count crossings of the piecewise-linear numerical trajectories, including re-entry.
function boundaryHistory(paths,cut){
 const initialInside=paths.filter(p=>p[0][0]<=cut).length,events=[];
 paths.forEach((path,index)=>{const n=path.length-1;for(let k=0;k<n;k++){
  const a=path[k],b=path[k+1],was=a[0]<=cut,is=b[0]<=cut;if(was===is)continue;
  const fraction=(cut-a[0])/(b[0]-a[0]);events.push({time:(k+fraction)/n,enter:is,index,y:a[1]+fraction*(b[1]-a[1])});
 }});events.sort((a,b)=>a.time-b.time);return{initialInside,events};
}
function boundaryCounts(history,t){let entered=0,left=0;for(const e of history.events){if(e.time>t)break;if(e.time===t&&!e.enter)continue;e.enter?entered++:left++;}return{initial:history.initialInside,entered,left,current:history.initialInside+entered-left};}
// Analytic spatial derivative of the toy mixture's marginal velocity.
// Used internally to evaluate the lecture divergence integral.
function differential(m,x,t){
 const f=field(m,x,t,true),mean=[0,0],J=[[0,0],[0,0]];
 const centers=m.a.map((_,i)=>component(m,i,t).mu);
 for(let i=0;i<f.weights.length;i++)for(let j=0;j<2;j++)mean[j]+=f.weights[i]*centers[i][j];
 for(let i=0;i<f.weights.length;i++)for(let a=0;a<2;a++)for(let b=0;b<2;b++)
  J[a][b]+=f.weights[i]*(f.components[i][a]-f.v[a])*(centers[i][b]-mean[b])/(m.tau*m.tau);
 return{v:f.v,jacobian:J,divergence:J[0][0]+J[1][1]};
}
function logDensity(m,x,t){
 const logs=m.a.map((_,i)=>{const c=component(m,i,t).mu;return-((x[0]-c[0])**2+(x[1]-c[1])**2)/(2*m.tau*m.tau);});
 const top=Math.max(...logs);
 return top+Math.log(logs.reduce((s,q)=>s+Math.exp(q-top),0))-Math.log(m.a.length*2*Math.PI*m.tau*m.tau);
}
function likelihoodTrace(m,start,steps=2048){
 if(!Number.isInteger(steps)||steps<1)throw new RangeError('Invalid trace resolution');
 const h=1/steps,path=[start.slice()],logp0=logDensity(m,start,0),logp=[logp0],divergences=[];
 let x=start.slice(),value=logp0;
 for(let k=0;k<steps;k++){
  const t=k*h,a=differential(m,x,t),predict=x.map((q,j)=>q+h*a.v[j]),b=differential(m,predict,t+h);
  divergences.push(a.divergence);x=x.map((q,j)=>q+h*(a.v[j]+b.v[j])/2);
  value-=h*(a.divergence+b.divergence)/2;path.push(x);logp.push(value);
 }
 divergences.push(differential(m,x,1).divergence);
 return{path,logp,divergences,logp0,steps};
}
function scalarAt(values,t){const q=Math.max(0,Math.min(1,t))*(values.length-1),i=Math.min(values.length-2,Math.floor(q)),w=q-i;return values[i]*(1-w)+values[i+1]*w;}
function trainingPair(m,t,index,seed=17){
 const start=samples(m,m.a.length,seed)[index],offset=start.map((x,j)=>x-m.a[index][j]);
 const end=m.b[m.pi[index]].map((x,j)=>x+offset[j]);
 return{start,end,position:start.map((x,j)=>(1-t)*x+t*end[j]),velocity:end.map((x,j)=>x-start[j])};
}
const api={differential,logDensity,likelihoodTrace,scalarAt,trainingPair,create,component,field,density,swap,integrate,at,samples,conditionalRisk,normalCDF,regionMass,regionRate,quadrature,boundaryHistory,boundaryCounts};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FlowMath=api;
})(globalThis);
