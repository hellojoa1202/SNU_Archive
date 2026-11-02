/* Lecture 1 noise/x prediction identity, using the lecture's amplitude notation.
   x_t = a x_0 + sigma epsilon, a² + sigma² = 1.
   Synthetic predictor: epsilon_hat = epsilon + eta z. No learned model.
   The exact error identity is x0_hat - x0 = -(sigma/a) (epsilon_hat-epsilon). */
(function(root){
'use strict';
function rng(seed){let s=seed>>>0;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)+.5)/4294967296;}
function normal(r){return Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r());}
function create(cols,rows){const mu=new Float64Array(2*cols*rows);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const i=2*(y*cols+x);mu[i]=(x+.5)/cols*1.5-.75;mu[i+1]=(y+.5)/rows-.5;}return{cols,rows,n:cols*rows,mu};}
function coefficients(sigma){if(!Number.isFinite(sigma)||sigma<0||sigma>=1)throw new RangeError('sigma must lie in [0,1)');const a=Math.sqrt(1-sigma*sigma);return{a,sigma,gain:sigma/a,snr:sigma===0?Infinity:a*a/(sigma*sigma)};}
function reconstruct(observed,predicted,sigma){const{a}=coefficients(sigma);return Float64Array.from(observed,(x,i)=>(x-sigma*predicted[i])/a);}
function evaluate(m,sigma,eta,seed){
 const {a,gain,snr}=coefficients(sigma),r=rng(seed),q=rng(seed+9347);
 const epsilon=Float64Array.from(m.mu,()=>normal(r)),delta=Float64Array.from(m.mu,()=>eta*normal(q));
 const predicted=Float64Array.from(epsilon,(e,i)=>e+delta[i]),observed=Float64Array.from(m.mu,(x,i)=>a*x+sigma*epsilon[i]);
 const estimate=reconstruct(observed,predicted,sigma);
 return{a,sigma,gain,snr,epsilon,delta,predicted,observed,estimate,noiseError:rms(predicted,epsilon),positionError:rms(estimate,m.mu)};
}
const rms=(a,b)=>Math.sqrt(a.reduce((s,x,i)=>s+(x-b[i])**2,0)/a.length);
const api={rng,normal,create,coefficients,reconstruct,evaluate,rms};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PuzzleMath=api;
})(globalThis);
