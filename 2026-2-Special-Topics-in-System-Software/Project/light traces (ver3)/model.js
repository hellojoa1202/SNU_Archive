/* One marginal family throughout: X_t=(1-t) epsilon+t Y, independent
   epsilon~N(0,I), Y a smooth three-component Gaussian mixture.
   Generation clock t runs .05 -> .95. No endpoint singularity is evaluated.
   This is an analytic teaching model, not a trained network or optical physics. */
(function(root){
'use strict';
const T0=.05,T1=.95,MASTER=1024;
const means=[[-1.05,-.42],[.9,-.48],[.05,.92]],sigma=.18;
const rng=seed=>{let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)+.5)/4294967296;};
const normal=r=>Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r());
function stats(t){return{a:1-t,b:t,v:(1-t)**2+(t*sigma)**2};}
function posterior(x,t){const {b,v}=stats(t),logs=means.map(m=>-((x[0]-b*m[0])**2+(x[1]-b*m[1])**2)/(2*v)),hi=Math.max(...logs),w=logs.map(l=>Math.exp(l-hi)),z=w.reduce((a,b)=>a+b,0);return w.map(q=>q/z);}
function density(x,t){const {b,v}=stats(t);return means.reduce((z,m)=>z+Math.exp(-((x[0]-b*m[0])**2+(x[1]-b*m[1])**2)/(2*v)),0)/(6*Math.PI*v);}
function score(x,t){const {b,v}=stats(t),w=posterior(x,t);return [0,1].map(j=>w.reduce((s,r,i)=>s+r*(b*means[i][j]-x[j])/v,0));}
function conditional(x,t){const {a,b,v}=stats(t),w=posterior(x,t),sd=sigma*a/Math.sqrt(v),candidates=[];
 means.forEach((m,i)=>{const mu=m.map((q,j)=>q+b*sigma*sigma/v*(x[j]-b*q));for(let k=0;k<8;k++){
  const angle=k*Math.PI/4,y=mu.map((q,j)=>q+Math.SQRT2*sd*(j===0?Math.cos(angle):Math.sin(angle))),e=x.map((q,j)=>(q-b*y[j])/a);
  candidates.push({y,e,u:y.map((q,j)=>q-e[j]),weight:w[i]/8,component:i});
 }});
 return {candidates,mean:[0,1].map(j=>candidates.reduce((sum,c)=>sum+c.weight*c.u[j],0)),weights:w};
}
function terms(x,t){const s=score(x,t),linear=x.map(q=>q/t),correction=s.map(q=>(1-t)/t*q);return {linear,correction,v:linear.map((q,j)=>q+correction[j])};}
function velocity(x,t){return terms(x,t).v;}
function dataset(count=384,seed=17){const r=rng(seed),h=(T1-T0)/MASTER,{a,b}=stats(T0),starts=[],noise=[];
 for(let i=0;i<count;i++){
  const m=means[Math.floor(r()*3)],y=m.map(q=>q+sigma*normal(r)),e=[normal(r),normal(r)];starts.push(e.map((q,j)=>a*q+b*y[j]));
  const increments=new Float64Array(2*MASTER);for(let k=0;k<increments.length;k++)increments[k]=Math.sqrt(h)*normal(r);noise.push(increments);
 }return{starts,noise,seed};
}
function gate(t,window){return window==='early'?(t<.5?1:0):window==='late'?(t>=.5?1:0):1;}
function perturbedScore(x,t,bias=0,window='all'){const s=score(x,t);s[0]+=bias*gate(t,window);return s;}
function solve(data,{kind='ode',steps=512,bias=0,window='all'}={}){
 if(!['ode','sde'].includes(kind)||!Number.isInteger(steps)||steps<1||MASTER%steps)throw new RangeError('Steps must divide 1024; choose ode or sde.');
 const stride=MASTER/steps,h=(T1-T0)/steps;
 return data.starts.map((start,i)=>{let x=start.slice();const path=[x.slice()];for(let k=0;k<steps;k++){
  const t=T0+k*h,s=perturbedScore(x,t,bias,window),c=(1-t)/t;
  if(kind==='sde'){
   const dw=[0,0];for(let z=k*stride;z<(k+1)*stride;z++){dw[0]+=data.noise[i][2*z];dw[1]+=data.noise[i][2*z+1];}
   x=x.map((q,j)=>q+h*(q/t+2*c*s[j])+Math.sqrt(2*c)*dw[j]);
  }else{
   const v=x.map((q,j)=>q/t+c*s[j]),pred=x.map((q,j)=>q+h*v[j]),tn=t+h,sn=perturbedScore(pred,tn,bias,window);
   x=x.map((q,j)=>q+h/2*(v[j]+pred[j]/tn+(1-tn)/tn*sn[j]));
  }path.push(x.slice());
 }return path;});
}
// Samples are shown at solver grid points, not Brownian interpolations.
function frame(paths,t){const n=paths[0].length-1,k=Math.max(0,Math.min(n,Math.round((t-T0)/(T1-T0)*n)));return{points:paths.map(p=>p[k]),index:k,time:T0+(T1-T0)*k/n};}
function cdfNormal(x){const z=Math.abs(x)/Math.SQRT2,t=1/(1+.3275911*z),erf=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z);return .5*(1+(x<0?-erf:erf));}
function cdf(x,t){const{b,v}=stats(t);return means.reduce((s,m)=>s+cdfNormal((x-b*m[0])/Math.sqrt(v)),0)/3;}
function projection(x,t){const{b,v}=stats(t);return means.reduce((s,m)=>s+Math.exp(-((x-b*m[0])**2)/(2*v))/Math.sqrt(2*Math.PI*v),0)/3;}
function discrepancy(points,t){const xs=points.map(p=>p[0]).sort((a,b)=>a-b);let d=0;xs.forEach((x,i)=>{const q=cdf(x,t);d=Math.max(d,Math.abs(i/xs.length-q),Math.abs((i+1)/xs.length-q));});return d;}
function errorCurve(paths){return Array.from({length:33},(_,i)=>{const f=frame(paths,T0+(T1-T0)*i/32);return{t:f.time,d:discrepancy(f.points,f.time)};});}
// Time-major frames keep scrubbing cheap and worker messages compact.
function pack(paths){
 const count=paths.length,steps=paths[0].length-1,frames=new Float32Array((steps+1)*count*2);
 for(let k=0;k<=steps;k++)for(let i=0;i<count;i++)for(let j=0;j<2;j++)frames[(k*count+i)*2+j]=paths[i][k][j];
 return{count,steps,frames,curve:errorCurve(paths)};
}
function packedFrame(film,t){
 const index=Math.max(0,Math.min(film.steps,Math.round((t-T0)/(T1-T0)*film.steps))),offset=index*film.count*2;
 return{index,time:T0+(T1-T0)*index/film.steps,points:Array.from({length:film.count},(_,i)=>[film.frames[offset+2*i],film.frames[offset+2*i+1]])};
}
const api={pack,packedFrame,T0,T1,MASTER,means,sigma,rng,stats,posterior,density,score,conditional,terms,velocity,dataset,solve,frame,projection,cdf,discrepancy,errorCurve};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LightMath=api;
})(globalThis);
