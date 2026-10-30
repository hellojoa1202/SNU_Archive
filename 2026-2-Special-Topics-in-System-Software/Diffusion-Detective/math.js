/* Fourier density relative to dθ/(2π): p=1+Σ(a_k cos kθ+b_k sin kθ).
   D=1, k≤24. Shared by the browser and Node tests. No dependencies. */
(function(root){
  'use strict';
  const K=24,TAU=2*Math.PI;
  const blank=()=>({a:Array(K+1).fill(0),b:Array(K+1).fill(0)});
  function rng(seed){let n=seed>>>0;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};}
  function candidates(level){
    const k=[6,9,12][level];
    return [0,1,2].map(j=>{const c=blank();c.a[1]=.26;c.b[2]=.15;c.a[3]=-.13;c.a[k]=j===0?.14:j===1?-.14:0;if(j===2){c.a[1]=-.18;c.b[2]=-.22;}return c;});
  }
  function initial(preset,k,amplitude,phase){
    const c=blank();
    if(preset==='asymmetric'){c.a[1]=.26;c.b[2]=.15;c.a[3]=-.13;}
    if(preset==='twin'){c.a[2]=.32;c.b[3]=.14;}
    if(preset==='single'){c.a[1]=.42;c.b[2]=.08;}
    c.a[k]+=amplitude;
    for(let j=1;j<=K;j++){const a=c.a[j],b=c.b[j],s=Math.sin(j*phase),co=Math.cos(j*phase);c.a[j]=a*co-b*s;c.b[j]=a*s+b*co;}
    return c;
  }
  function forward(c,t){const o=blank();for(let k=1;k<=K;k++){const h=Math.exp(-k*k*t);o.a[k]=h*c.a[k];o.b[k]=h*c.b[k];}return o;}
  function observe(c,t,epsilon,seed){const o=forward(c,t),r=rng(seed);for(let k=1;k<=K;k++){o.a[k]+=epsilon*(2*r()-1);o.b[k]+=epsilon*(2*r()-1);}return o;}
  function gain(k,t,cutoff,lambda,method){if(k>cutoff)return 0;const h=Math.exp(-k*k*t);return method==='tikhonov'?h/(h*h+lambda):1/h;}
  function restore(y,t,cutoff,lambda,method){const o=blank();for(let k=1;k<=K;k++){const g=gain(k,t,cutoff,lambda,method);o.a[k]=y.a[k]*g;o.b[k]=y.b[k]*g;}return o;}
  function value(c,x){let p=1;for(let k=1;k<=K;k++)p+=c.a[k]*Math.cos(k*x)+c.b[k]*Math.sin(k*x);return p;}
  function score(c,x){const s=Math.sin(x),co=Math.cos(x);let sk=s,ck=co,p=1,dp=0;for(let k=1;k<=K;k++){p+=c.a[k]*ck+c.b[k]*sk;dp+=k*(-c.a[k]*sk+c.b[k]*ck);const next=sk*co+ck*s;ck=ck*co-sk*s;sk=next;}return dp/p;}
  function sample(c,n=256){return Array.from({length:n},(_,i)=>value(c,TAU*i/(n-1)));}
  function error(c,d){let s=0;for(let k=1;k<=K;k++)s+=(c.a[k]-d.a[k])**2+(c.b[k]-d.b[k])**2;return Math.sqrt(s/2);}
  function residual(y,c,t){const z=forward(c,t);let m=0;for(let k=1;k<=K;k++)m=Math.max(m,Math.abs(y.a[k]-z.a[k]),Math.abs(y.b[k]-z.b[k]));return m;}
  function compatible(y,cs,t,eps){return cs.map((c,i)=>residual(y,c,t)<=eps+1e-12?i:-1).filter(i=>i>=0);}
  function risk(c,t,eps,cutoff,lambda,method){let bias2=0,variance=0;for(let k=1;k<=K;k++){const g=gain(k,t,cutoff,lambda,method),h=Math.exp(-k*k*t);bias2+=.5*(g*h-1)**2*(c.a[k]**2+c.b[k]**2);variance+=eps**2/3*g*g;}return {bias2,variance,rmse:Math.sqrt(bias2+variance)};}
  function histogram(xs,bins=32){const counts=Array(bins).fill(0);for(const x of xs)counts[Math.min(bins-1,Math.floor(((x%TAU+TAU)%TAU)/TAU*bins))]++;return counts.map(n=>n*bins/xs.length);}
  function momentError(xs,c,modes=6){let s=0;for(let k=1;k<=modes;k++){let a=0,b=0;for(const x of xs){a+=Math.cos(k*x);b+=Math.sin(k*x);}s+=(2*a/xs.length-c.a[k])**2+(2*b/xs.length-c.b[k])**2;}return Math.sqrt(s/2);}
  function simulate(c,T,steps,seed,N=512){
    const r=rng(seed),prior=forward(c,T),bound=1+prior.a.reduce((s,v,k)=>s+Math.hypot(v,prior.b[k]),0);
    const start=[];while(start.length<N){const x=r()*TAU;if(r()*bound<value(prior,x))start.push(x);}
    const ode=[Float64Array.from(start)],sde=[Float64Array.from(start)],dt=T/steps;
    for(let j=0;j<steps;j++){
      const ct=forward(c,T-j*dt),o=new Float64Array(N),s=new Float64Array(N);
      for(let i=0;i<N;i++){
        const xo=ode[j][i],xs=sde[j][i],z=Math.sqrt(-2*Math.log(Math.max(1e-12,r())))*Math.cos(TAU*r());
        o[i]=((xo+score(ct,xo)*dt)%TAU+TAU)%TAU;
        s[i]=((xs+2*score(ct,xs)*dt+Math.sqrt(2*dt)*z)%TAU+TAU)%TAU;
      }
      ode.push(o);sde.push(s);
    }
    return {ode,sde};
  }
  const api={K,TAU,blank,rng,candidates,initial,forward,observe,gain,restore,value,score,sample,error,residual,compatible,risk,histogram,momentError,simulate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Spectral=api;
})(typeof globalThis!=='undefined'?globalThis:this);
