/* Analytic experiments, independent of the DOM. Noise time t decreases from 1 to 0.
   Internal toy: constant forward Brownian coefficient, smooth Gaussian mixture.
   The starting law is the exact p_1, not a standard-normal approximation. */
(function(root){
'use strict';
function random(seed){let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)+.5)/4294967296;}
function gaussian(r){return Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r());}
function create(){return{means:[[-.8,-.4],[.7,-.5],[.15,.65]],sigma:.18,g:.9};}
function variance(m,t){return m.sigma*m.sigma+m.g*m.g*t;}
function density(m,x,t){const v=variance(m,t);return m.means.reduce((s,a)=>s+Math.exp(-((x[0]-a[0])**2+(x[1]-a[1])**2)/(2*v)),0)/(m.means.length*2*Math.PI*v);}
function score(m,x,t){const v=variance(m,t),logs=m.means.map(a=>-((x[0]-a[0])**2+(x[1]-a[1])**2)/(2*v)),top=Math.max(...logs);let z=0,sx=0,sy=0;
 for(let i=0;i<logs.length;i++){const w=Math.exp(logs[i]-top);z+=w;sx+=w*(m.means[i][0]-x[0])/v;sy+=w*(m.means[i][1]-x[1])/v;}return[sx/z,sy/z];}
function initial(m,count,seed){const r=random(seed),sd=Math.sqrt(variance(m,1));return Array.from({length:count},()=>{const a=m.means[Math.floor(r()*m.means.length)];return a.map(q=>q+sd*gaussian(r));});}
function solve(m,starts,kind='ode',seed=71,steps=512){
 if(!['ode','sde'].includes(kind)||!Number.isInteger(steps)||steps<1)throw new RangeError('Invalid transport solver');
 const h=1/steps,g2=m.g*m.g,r=random(seed),noise=m.g*Math.sqrt(h);
 return starts.map(start=>{let x=start.slice();const path=[x.slice()];for(let k=0;k<steps;k++){
  const t=1-k*h,a=score(m,x,t);
  if(kind==='sde')x=x.map((q,j)=>q+h*g2*a[j]+noise*gaussian(r));
  else{const pred=x.map((q,j)=>q+h*.5*g2*a[j]),b=score(m,pred,t-h);x=x.map((q,j)=>q+h*.25*g2*(a[j]+b[j]));}
  path.push(x);
 }return path;});
}
function cdf(m,x,t,normalCDF){const s=Math.sqrt(variance(m,t));return m.means.reduce((sum,a)=>sum+normalCDF((x-a[0])/s),0)/m.means.length;}
function projection(m,x,t){const v=variance(m,t);return m.means.reduce((sum,a)=>sum+Math.exp(-((x-a[0])**2)/(2*v)),0)/(m.means.length*Math.sqrt(2*Math.PI*v));}
function discrepancy(points,cdf){const xs=points.map(x=>x[0]).sort((a,b)=>a-b);let d=0;xs.forEach((x,i)=>{const q=cdf(x);d=Math.max(d,Math.abs(i/xs.length-q),Math.abs((i+1)/xs.length-q));});return d;}
const api={create,variance,density,score,initial,solve,cdf,projection,discrepancy};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TransportMath=api;
})(globalThis);
