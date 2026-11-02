const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('./dial-math.js');
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} ≈ ${b}`);
test('wrapped density is normalized, periodic, positive and has the analytic log gradient',()=>{
 for(const m of [1,2,3,4])for(const time of [0,.55,1.5])for(const sigma of [.08,.4]){
  let sum=0;for(let i=0;i<4096;i++)sum+=M.profile(i/4096*M.TAU,time,m,sigma).density;near(sum/4096,1,1e-10);
  const x=.237,p=M.profile(x,time,m,sigma),h=1e-6;
  assert.ok(p.density>=0);near(p.density,M.profile(x+M.TAU/m,time,m,sigma).density,1e-9);
  near(p.score,(M.profile(x+h,time,m,sigma).logDensity-M.profile(x-h,time,m,sigma).logDensity)/(2*h),1e-6);
 }
});
test('symmetry removes nonmultiple frequencies and surviving modes follow heat attenuation',()=>{
 for(const m of [1,3,4])for(const k of [1,2,3,4,6,8]){
  let sum=0;for(let i=0;i<4096;i++){const x=i/4096*M.TAU;sum+=M.profile(x,.13,m,.2).density*Math.cos(k*x);}
  near(2*sum/4096,M.coefficient(k,.13,m,.2),1e-10);
  near(M.coefficient(k,.13,m,.2),M.coefficient(k,0,m,.2)*Math.exp(-k*k*.13));
 }
});
test('forward marginals have the expected circular moment and reproducible initial conditions',()=>{
 for(const m of [1,3]){const f=M.forward(12000,.24,m,.2,35);near(M.moment(f.angles,m),Math.exp(-.5*m*m*(.04+.48)),.025);near(M.moment(f.source,m),Math.exp(-.5*m*m*.04),.01);assert.deepEqual(M.forward(6,.24,m,.2,35),M.forward(6,.24,m,.2,35));}
});
test('Euler and Heun converge; no angle snapping; zero-time state is preserved',()=>{
 const T=.55,m=3,sigma=.14,start=[.17,-.45,1.32,2.84,-2.8,.72],ref=M.simulate(start,T,m,sigma,4096,12,'heun').ode.at(-1);
 const err=s=>Math.sqrt(s.reduce((a,x,i)=>a+M.wrap(x-ref[i])**2,0)/s.length);
 let previous=Infinity;
 for(const steps of [32,128,512]){const sim=M.simulate(start,T,m,sigma,steps,12,'euler');const error=err(sim.ode.at(-1));assert.ok(error<previous);previous=error;assert.deepEqual(sim.ode[0],sim.sde[0]);assert.ok(sim.ode.flat().every(Number.isFinite));}
 const heun=M.simulate(start,T,m,sigma,512,12,'heun');assert.ok(err(heun.ode.at(-1))<previous*.1);assert.ok(M.error(heun.ode.at(-1),m)>0);
 const zero=M.simulate(start,0,m,sigma,32,12);for(const type of ['ode','sde'])for(let i=0;i<6;i++)near(zero[type].at(-1)[i],start[i]);
});
test('ODE retains an exact symmetry boundary; SDE leaves it with Brownian increments',()=>{
 for(const m of [1,2,3,4]){const x=Math.PI/m;near(M.profile(x,.55,m,.14).score,0);assert.ok(M.profile(x-.001,.1,m,.14).score<0);assert.ok(M.profile(x+.001,.1,m,.14).score>0);
  const sim=M.simulate([x],.55,m,.14,128,12);for(const row of sim.ode)near(M.wrap(row[0]-x),0,1e-10);assert.ok(Math.abs(M.wrap(sim.sde.at(-1)[0]-x))>.1);
 }
});
test('reverse samplers approximately reproduce target moments and mode weights',()=>{
 const n=2200,m=3,sigma=.2,T=.55,start=M.forward(n,T,m,sigma,819).angles,sim=M.simulate(start,T,m,sigma,256,819);
 for(const type of ['ode','sde']){const end=sim[type].at(-1);near(M.moment(end,m),Math.exp(-.5*m*m*sigma*sigma),.035);const counts=[0,0,0];for(const x of end)counts[((Math.round(x/M.TAU*m)%m)+m)%m]++;for(const count of counts)near(count/n,1/m,.045);}
});
