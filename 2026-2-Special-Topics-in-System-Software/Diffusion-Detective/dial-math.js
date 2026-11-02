/* Independent circular coordinates with an m-fold wrapped-Gaussian prior.
   Density is relative to dθ/(2π), as in the original Fourier experiment.
   dθ=√2 dW, v(t)=σ0²+2t. Wrapped-image sums truncate beyond 9 standard
   deviations; the score uses scaled weights to avoid underflow. */
(function(root){
'use strict';
const TAU=2*Math.PI;
const wrap=x=>((x+Math.PI)%TAU+TAU)%TAU-Math.PI;
function rng(seed){let n=seed>>>0;return()=>((n=(Math.imul(1664525,n)+1013904223)>>>0)+.5)/4294967296;}
const normal=r=>Math.sqrt(-2*Math.log(r()))*Math.cos(TAU*r());
function profile(theta,t,m,sigma){
 const period=TAU/m,v=sigma*sigma+2*t,d=((theta+period/2)%period+period)%period-period/2;
 const limit=Math.ceil(9*Math.sqrt(v)/period)+1;let sum=0,derivative=0;
 for(let n=-limit;n<=limit;n++){const z=d+n*period,w=Math.exp(-(z*z-d*d)/(2*v));sum+=w;derivative+=z*w;}
 // Exact reflection symmetry: the score vanishes at modes and midpoints.
 const fixed=Math.abs(d)<1e-14||Math.abs(Math.abs(d)-period/2)<1e-14;
 const logp=.5*Math.log(TAU/v)-Math.log(m)-d*d/(2*v)+Math.log(sum);
 return{density:Math.exp(logp),logDensity:logp,score:fixed?0:-derivative/(v*sum)};
}
function coefficient(k,t,m,sigma){return k%m?0:2*Math.exp(-.5*k*k*(sigma*sigma+2*t));}
function forward(count,t,m,sigma,seed){const random=rng(seed),angles=[],source=[];for(let i=0;i<count;i++){const theta=TAU*Math.floor(random()*m)/m+sigma*normal(random),epsilon=normal(random);source.push(wrap(theta));angles.push(wrap(theta+Math.sqrt(2*t)*epsilon));}return{source,angles};}
function simulate(start,T,m,sigma,steps,seed,solver='heun'){
 const random=rng(seed+4919),v0=sigma*sigma,vT=v0+2*T,times=[T],ode=[start.slice()],sde=[start.slice()];
 for(let j=1;j<=steps;j++)times.push(j===steps||T===0?0:Math.max(0,Math.min(times[j-1],(Math.exp(Math.log(vT)+(Math.log(v0)-Math.log(vT))*j/steps)-v0)/2)));
 for(let j=0;j<steps;j++){
  const now=times[j],next=times[j+1],h=now-next,o=[],s=[];
  for(let i=0;i<start.length;i++){
   const xo=ode[j][i],xs=sde[j][i],drift=profile(xo,now,m,sigma).score,predicted=xo+h*drift;
   o.push(wrap(solver==='heun'?xo+h*.5*(drift+profile(predicted,next,m,sigma).score):predicted));
   s.push(wrap(xs+2*h*profile(xs,now,m,sigma).score+Math.sqrt(2*h)*normal(random)));
  }
  ode.push(o);sde.push(s);
 }
 return{ode,sde,times};
}
function error(angles,m){return Math.sqrt(angles.reduce((sum,a)=>sum+(wrap(m*a)/m)**2,0)/angles.length);}
function moment(angles,m){return angles.reduce((s,a)=>s+Math.cos(m*a),0)/angles.length;}
const api={TAU,wrap,rng,normal,profile,coefficient,forward,simulate,error,moment};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CircularDial=api;
})(typeof globalThis!=='undefined'?globalThis:this);
