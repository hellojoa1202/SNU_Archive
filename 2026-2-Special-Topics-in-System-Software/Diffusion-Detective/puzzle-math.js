/* Exact Gaussian diffusion of a jigsaw's 2N positions.
   Q = (I + gamma L)/sigma0², L = rectangular-grid graph Laplacian.
   Forward: dx = sqrt(2D) dW. Covariance: Q^-1 + 2Dt I.
   Shared eigensystem for x and y; no learned score and no snapping. */
(function(root){
'use strict';
const D=.18,SIGMA=.012,T=.8;
function rng(seed){let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)+.5)/4294967296;}
function normal(random){return Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());}
function create(cols,rows,gamma=2){
 const n=cols*rows,modes=[],mu=new Float64Array(2*n),edges=[];
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const i=y*cols+x;mu[2*i]=(x+.5)/cols*1.5-.75;mu[2*i+1]=(y+.5)/rows- .5;
  if(x+1<cols)edges.push([i,i+1]);if(y+1<rows)edges.push([i,i+cols]);
 }
 for(let q=0;q<rows;q++)for(let k=0;k<cols;k++){
  const lambda=4*Math.sin(Math.PI*k/(2*cols))**2+4*Math.sin(Math.PI*q/(2*rows))**2;
  const u=new Float64Array(n);
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)u[y*cols+x]=Math.sqrt((k?2:1)/cols)*Math.cos(Math.PI*k*(x+.5)/cols)*Math.sqrt((q?2:1)/rows)*Math.cos(Math.PI*q*(y+.5)/rows);
  modes.push({lambda,u,k,q});
 }
 modes.sort((a,b)=>a.lambda-b.lambda||a.q-b.q||a.k-b.k);
 return{cols,rows,n,gamma,mu,edges,modes,v0:Float64Array.from(modes,m=>SIGMA**2/(1+gamma*m.lambda))};
}
function variance(model,t){return Float64Array.from(model.v0,v=>v+2*D*t);}
function toModes(model,positions){const z=new Float64Array(2*model.n);for(let k=0;k<model.n;k++)for(let i=0;i<model.n;i++){z[2*k]+=model.modes[k].u[i]*(positions[2*i]-model.mu[2*i]);z[2*k+1]+=model.modes[k].u[i]*(positions[2*i+1]-model.mu[2*i+1]);}return z;}
function fromModes(model,z,addMean=true){const x=addMean?Float64Array.from(model.mu):new Float64Array(2*model.n);for(let k=0;k<model.n;k++)for(let i=0;i<model.n;i++){x[2*i]+=model.modes[k].u[i]*z[2*k];x[2*i+1]+=model.modes[k].u[i]*z[2*k+1];}return x;}
function forward(model,t,seed){const random=rng(seed),z=new Float64Array(2*model.n);for(let k=0;k<model.n;k++)for(let a=0;a<2;a++)z[2*k+a]=Math.sqrt(model.v0[k])*normal(random)+Math.sqrt(2*D*t)*normal(random);return fromModes(model,z);}
function score(model,x,t){const z=toModes(model,x),v=variance(model,t);for(let k=0;k<model.n;k++){z[2*k]/=-v[k];z[2*k+1]/=-v[k];}return fromModes(model,z,false);}
function energy(model,x){let e=0;const d=Float64Array.from(x,(v,i)=>v-model.mu[i]);for(const v of d)e+=v*v;for(const [i,j] of model.edges)for(let a=0;a<2;a++)e+=model.gamma*(d[2*i+a]-d[2*j+a])**2;return e/(2*SIGMA**2);}
function logDensity(model,x,t){const z=toModes(model,x),v=variance(model,t);let log=0;for(let k=0;k<model.n;k++)log-=Math.log(2*Math.PI*v[k])+(z[2*k]**2+z[2*k+1]**2)/(2*v[k]);return log;}
function simulate(model,start,totalTime,steps,seed,method='exact'){
 const random=rng(seed+7919),initial=toModes(model,start),ode=[initial],sde=[Float64Array.from(initial)],times=[totalTime];
 // Uniform spacing in log(smallest variance) resolves the stiff endpoint.
 const min=Math.min(...model.v0),end=min+2*D*totalTime;
 for(let j=1;j<=steps;j++)times.push(j===steps?0:(Math.exp(Math.log(end)+(Math.log(min)-Math.log(end))*j/steps)-min)/(2*D));
 for(let j=0;j<steps;j++){
  const a=variance(model,times[j]),b=variance(model,times[j+1]),dt=times[j]-times[j+1],o=new Float64Array(2*model.n),s=new Float64Array(2*model.n);
  for(let k=0;k<model.n;k++)for(let axis=0;axis<2;axis++){
   const i=2*k+axis;
   if(method==='exact'){o[i]=ode[j][i]*Math.sqrt(b[k]/a[k]);s[i]=sde[j][i]*b[k]/a[k]+Math.sqrt(Math.max(0,b[k]*(1-b[k]/a[k])))*normal(random);}
   else{o[i]=ode[j][i]*(1-D*dt/a[k]);s[i]=sde[j][i]*(1-2*D*dt/a[k])+Math.sqrt(2*D*dt)*normal(random);}
  }
  ode.push(o);sde.push(s);
 }
 return{ode,sde,times};
}
function exactODE(model,start,t,totalTime){const z=toModes(model,start),v=variance(model,t),vT=variance(model,totalTime);for(let k=0;k<model.n;k++)for(let a=0;a<2;a++)z[2*k+a]*=Math.sqrt(v[k]/vT[k]);return fromModes(model,z);}
function rms(a,b){return Math.sqrt(a.reduce((s,x,i)=>s+(x-b[i])**2,0)/a.length);}
function seamError(model,x){let s=0;for(const [i,j]of model.edges)for(let a=0;a<2;a++)s+=((x[2*i+a]-x[2*j+a])-(model.mu[2*i+a]-model.mu[2*j+a]))**2;return Math.sqrt(s/(2*model.edges.length));}
const api={D,SIGMA,T,rng,normal,create,variance,toModes,fromModes,forward,score,energy,logDensity,simulate,exactODE,rms,seamError};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Jigsaw=api;
})(typeof globalThis!=='undefined'?globalThis:this);
