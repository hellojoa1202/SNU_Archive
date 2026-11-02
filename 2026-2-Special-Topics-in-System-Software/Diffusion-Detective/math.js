/* Analytic two-point data model for course concepts, not a trained network.
   X0 in {-1,+1}, equal mass. Y=a X0+sigma epsilon; epsilon~N(0,1).
   DDPM notation follows lecture 1: a=alpha_bar (amplitude), sigma²=1-a².
   NCSN corruption uses a=1. */
(function(root){
'use strict';
function coefficients(sigma,scheme='ddpm'){
 if(!(sigma>0&&sigma<1))throw new RangeError('sigma must be in (0,1)');
 if(!['ddpm','ncsn'].includes(scheme))throw new RangeError('unknown corruption scheme');
 return{a:scheme==='ddpm'?Math.sqrt(1-sigma*sigma):1,sigma};
}
function logDensity(y,sigma,scheme='ddpm'){
 const{a}=coefficients(sigma,scheme),l=-.5*((y+a)/sigma)**2,r=-.5*((y-a)/sigma)**2,m=Math.max(l,r);
 return m+Math.log(Math.exp(l-m)+Math.exp(r-m))-Math.log(2*sigma*Math.sqrt(2*Math.PI));
}
const density=(y,sigma,scheme)=>Math.exp(logDensity(y,sigma,scheme));
function posterior(y,sigma,scheme='ddpm'){
 const{a}=coefficients(sigma,scheme),mean=Math.tanh(a*y/(sigma*sigma)),plus=(1+mean)/2,minus=1-plus;
 const noise=(y-a*mean)/sigma,score=(a*mean-y)/(sigma*sigma);
 return{a,sigma,plus,minus,mean,variance:Math.max(0,1-mean*mean),noise,score,reconstructed:(y+sigma*sigma*score)/a};
}
const risk=(u,p)=>p.minus*(u+1)**2+p.plus*(u-1)**2;
function rng(seed){let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)+.5)/4294967296;}
function normal(r){return Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r());}
function samples(sigma,scheme,seed,count=80){const{a}=coefficients(sigma,scheme),r=rng(seed);return Array.from({length:count},()=>{const x0=r()<.5?-1:1,epsilon=normal(r);return{x0,epsilon,y:a*x0+sigma*epsilon};});}
function conditionalSample(p,seed){return rng(seed)()<p.plus?1:-1;}
const api={coefficients,logDensity,density,posterior,risk,rng,normal,samples,conditionalSample};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DiffusionMath=api;
})(globalThis);
