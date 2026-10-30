/* Real Fourier convention: p(theta)=1+sum(a_k cos(k theta)+b_k sin(k theta)).
   Density relative to uniform measure dtheta/(2pi). D=1 throughout. */
(function(root){
'use strict';
const K=24;
function blank(){return {a:Array(K+1).fill(0),b:Array(K+1).fill(0)};}
function rng(seed){let n=seed>>>0;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};}
function candidates(level){
 const k=level===0?6:level===1?9:12;
 return [0,1,2].map((j)=>{const c=blank();c.a[1]=.26;c.b[2]=.15;c.a[3]=-.13;c.a[k]=j===0?.14:j===1?-.14:0;if(j===2){c.a[1]=-.18;c.b[2]=-.22;}return c;});
}
function forward(c,t){const o=blank();for(let k=1;k<=K;k++){const h=Math.exp(-k*k*t);o.a[k]=h*c.a[k];o.b[k]=h*c.b[k];}return o;}
function observe(c,t,epsilon,seed){const o=forward(c,t),r=rng(seed);for(let k=1;k<=K;k++){o.a[k]+=epsilon*(2*r()-1);o.b[k]+=epsilon*(2*r()-1);}return o;}
function restore(y,tau,cutoff,lambda,method){const o=blank();for(let k=1;k<=cutoff;k++){const h=Math.exp(-k*k*tau);const gain=method==='tikhonov'?h/(h*h+lambda):1/h;o.a[k]=y.a[k]*gain;o.b[k]=y.b[k]*gain;}return o;}
function value(c,x){let y=1;for(let k=1;k<=K;k++)y+=c.a[k]*Math.cos(k*x)+c.b[k]*Math.sin(k*x);return y;}
function sample(c,n=256){return Array.from({length:n},(_,i)=>value(c,2*Math.PI*i/n));}
function error(c,d){let s=0;for(let k=1;k<=K;k++)s+=(c.a[k]-d.a[k])**2+(c.b[k]-d.b[k])**2;return Math.sqrt(s/2);}
function residual(y,c,t){const z=forward(c,t);let m=0;for(let k=1;k<=K;k++)m=Math.max(m,Math.abs(y.a[k]-z.a[k]),Math.abs(y.b[k]-z.b[k]));return m;}
function compatible(y,cs,t,eps){return cs.map((c,i)=>residual(y,c,t)<=eps+1e-12?i:-1).filter(i=>i>=0);}
const api={K,blank,rng,candidates,forward,observe,restore,value,sample,error,residual,compatible};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Spectral=api;
})(typeof globalThis!=='undefined'?globalThis:this);
