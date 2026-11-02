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
function integrate(m,start,method='rk4',steps=1024){
 if(!['euler','heun','rk4'].includes(method)||!Number.isInteger(steps)||steps<1)throw new RangeError('Invalid solver');
 const h=1/steps,path=[start.slice()];let x=start.slice();
 const add=(a,b,s)=>[a[0]+s*b[0],a[1]+s*b[1]];
 for(let k=0;k<steps;k++){const t=k*h,k1=field(m,x,t);if(method==='euler')x=add(x,k1,h);
 else if(method==='heun'){const k2=field(m,add(x,k1,h),t+h);x=[x[0]+h*(k1[0]+k2[0])/2,x[1]+h*(k1[1]+k2[1])/2];}
 else{const k2=field(m,add(x,k1,h/2),t+h/2),k3=field(m,add(x,k2,h/2),t+h/2),k4=field(m,add(x,k3,h),t+h);x=x.map((v,j)=>v+h*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6);}
 path.push(x);
 }return{path,end:x,nfe:steps*({euler:1,heun:2,rk4:4}[method])};
}
function at(path,t){const s=Math.max(0,Math.min(1,t))*(path.length-1),i=Math.min(path.length-2,Math.floor(s)),w=s-i;return path[i].map((x,j)=>x*(1-w)+path[i+1][j]*w);}
function rng(seed){let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)+.5)/4294967296;}
function samples(m,count=96,seed=17){const r=rng(seed),normal=()=>Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r());return Array.from({length:count},(_,i)=>m.a[i%m.a.length].map(x=>x+m.tau*normal()));}
function conditionalRisk(m,x,t,pred){const f=field(m,x,t,true);let irreducible=0,total=0;for(let i=0;i<f.weights.length;i++)for(let j=0;j<2;j++){irreducible+=f.weights[i]*(f.components[i][j]-f.v[j])**2;total+=f.weights[i]*(f.components[i][j]-pred[j])**2;}return{total,irreducible,excess:(pred[0]-f.v[0])**2+(pred[1]-f.v[1])**2};}
const api={create,component,field,density,swap,integrate,at,samples,conditionalRisk};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FlowMath=api;
})(globalThis);
