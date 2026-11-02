/* Independent Gaussian piece positions. The known reference layout is the prior mean.
   Forward dX = sqrt(2D)dW; p_t = N(mu, (sigma0² + 2Dt)I).
   Exact reverse Gaussian transitions and probability-flow ODE, plus Euler/EM. */
(function(root){
'use strict';
const D=.03,SIGMA=.004;
function rng(seed){let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)+.5)/4294967296;}
function normal(r){return Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r());}
function create(cols,rows){const mu=new Float64Array(2*cols*rows);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const i=2*(y*cols+x);mu[i]=(x+.5)/cols*1.5-.75;mu[i+1]=(y+.5)/rows-.5;}return{cols,rows,n:cols*rows,mu};}
const variance=t=>SIGMA**2+2*D*t;
function forward(m,t,seed){const r=rng(seed);return Float64Array.from(m.mu,x=>x+SIGMA*normal(r)+Math.sqrt(2*D*t)*normal(r));}
function score(m,x,t){const v=variance(t);return Float64Array.from(x,(a,i)=>(m.mu[i]-a)/v);}
function exactODE(m,x,t,T){const q=Math.sqrt(variance(t)/variance(T));return Float64Array.from(x,(a,i)=>m.mu[i]+q*(a-m.mu[i]));}
function simulate(m,start,T,steps,seed,solver='exact'){
 const times=Array.from({length:steps+1},(_,i)=>i===0?T:i===steps?0:Math.max(0,Math.min(T,(Math.exp(Math.log(variance(T))+(Math.log(variance(0))-Math.log(variance(T)))*i/steps)-SIGMA**2)/(2*D))));
 const ode=[Float64Array.from(start)],sde=[Float64Array.from(start)],r=rng(seed+9347);
 for(let j=0;j<steps;j++){const dt=Math.max(0,times[j]-times[j+1]),v=variance(times[j]),vn=variance(times[j+1]),q=vn/v,a=new Float64Array(start.length),b=new Float64Array(start.length);
  for(let i=0;i<a.length;i++){const u=ode[j][i]-m.mu[i],w=sde[j][i]-m.mu[i],z=normal(r);a[i]=m.mu[i]+(solver==='exact'?Math.sqrt(q)*u:u-D*dt*u/v);b[i]=m.mu[i]+(solver==='exact'?q*w+Math.sqrt(Math.max(0,vn*(1-q)))*z:w-2*D*dt*w/v+Math.sqrt(2*D*dt)*z);}ode.push(a);sde.push(b);
 }return{times,ode,sde};
}
const rms=(a,b)=>Math.sqrt(a.reduce((s,x,i)=>s+(x-b[i])**2,0)/a.length);
const api={D,SIGMA,rng,normal,create,variance,forward,score,exactODE,simulate,rms};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PuzzleMath=api;
})(globalThis);
