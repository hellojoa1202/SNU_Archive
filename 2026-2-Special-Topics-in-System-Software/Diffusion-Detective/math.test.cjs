const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('./math.js');
const near=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<tol,`${a} ≈ ${b}`);
test('grid eigenvectors are orthonormal and diagonalize the actual adjacency Laplacian',()=>{
 const m=M.create(6,4,2);
 for(let a=0;a<m.n;a++)for(let b=0;b<m.n;b++)near(m.modes[a].u.reduce((s,u,i)=>s+u*m.modes[b].u[i],0),a===b?1:0);
 for(const mode of m.modes){const Lu=new Float64Array(m.n);for(const [i,j]of m.edges){Lu[i]+=mode.u[i]-mode.u[j];Lu[j]+=mode.u[j]-mode.u[i];}for(let i=0;i<m.n;i++)near(Lu[i],mode.lambda*mode.u[i]);}
 const x=M.forward(m,.2,12);assert.ok(M.rms(M.fromModes(m,M.toModes(m,x)),x)<1e-12);
});
test('displayed energy and covariance define the same prior; score is the log-density gradient',()=>{
 const m=M.create(6,4,3),x=M.forward(m,.001,18),z=M.toModes(m,x);
 near(M.energy(m,x),z.reduce((s,v,i)=>s+v*v/(2*m.v0[Math.floor(i/2)]),0),1e-8);
 for(const time of [0,.08]){const score=M.score(m,x,time),h=1e-7;for(const i of [0,5,19,37]){const plus=Float64Array.from(x),minus=Float64Array.from(x);plus[i]+=h;minus[i]-=h;near(score[i],(M.logDensity(m,plus,time)-M.logDensity(m,minus,time))/(2*h),.0001);}}
});
test('forward samples have graph-mode covariance v0 + 2Dt',()=>{
 const m=M.create(3,2,2),time=.15,count=6000,sum=new Float64Array(12),square=new Float64Array(12);
 for(let seed=1;seed<=count;seed++){const z=M.toModes(m,M.forward(m,time,seed));for(let i=0;i<12;i++){sum[i]+=z[i];square[i]+=z[i]**2;}}
 for(let i=0;i<12;i++){assert.ok(Math.abs(sum[i]/count)<.015);assert.ok(Math.abs(square[i]/count/(m.v0[Math.floor(i/2)]+2*M.D*time)-1)<.06);}
});
test('exact reverse ODE solves the covariance flow and both processes preserve Gaussian target marginals',()=>{
 const m=M.create(3,2,2),time=.2,counts=4000,sums={ode:0,sde:0};
 for(let seed=1;seed<=counts;seed++){const start=M.forward(m,time,seed),sim=M.simulate(m,start,time,16,seed);
  assert.deepEqual(sim.ode[0],sim.sde[0]);
  if(seed===1){for(let j=0;j<sim.times.length;j++)assert.ok(M.rms(M.fromModes(m,sim.ode[j]),M.exactODE(m,start,sim.times[j],time))<1e-12);}
  for(const type of ['ode','sde'])for(let i=0;i<12;i++)sums[type]+=sim[type][16][i]**2/m.v0[Math.floor(i/2)];
 }
 for(const type of ['ode','sde'])assert.ok(Math.abs(sums[type]/(12*counts)-1)<.035);
});
test('Euler converges to exact ODE, and all 150-piece configurations stay finite without snapping',()=>{
 const m=M.create(15,10,8),start=M.forward(m,.8,12),exact=M.exactODE(m,start,0,.8);let prev=Infinity;
 for(const steps of [16,64,256]){const sim=M.simulate(m,start,.8,steps,12,'euler'),x=M.fromModes(m,sim.ode[steps]),err=M.rms(x,exact);assert.ok(err<prev);prev=err;for(const type of ['sde','ode'])assert.ok(sim[type].every(xs=>xs.every(Number.isFinite)));}
 const sim=M.simulate(m,start,.8,64,12),end=M.fromModes(m,sim.ode[64]);assert.ok(M.seamError(m,end)<M.seamError(m,start));assert.ok(M.rms(end,m.mu)>0);
 const zero=M.simulate(m,m.mu,0,16,12);for(const type of ['ode','sde'])assert.ok(M.rms(M.fromModes(m,zero[type][16]),m.mu)<1e-12);
});
test('English and Korean entries share experiments, assets, and paired concise copy',()=>{
 const fs=require('node:fs'),path=require('node:path');
 const en=fs.readFileSync(path.join(__dirname,'English ver/index.html'),'utf8'),ko=fs.readFileSync(path.join(__dirname,'Korean ver/index.html'),'utf8');
 assert.equal(en,ko.replace('<html lang="ko">','<html lang="en">'));
 const source=fs.readFileSync(path.join(__dirname,'i18n.js'),'utf8'),copy=JSON.parse(source.split('const prose=')[1].split(';\nconst query=')[0]);
 for(const [,tag,key,text]of en.matchAll(/<([a-z0-9]+)\b[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)){assert.equal(copy[key].en,text,key);assert.ok(copy[key].ko);assert.ok(!/<(?:input|select|canvas)\b/.test(copy[key].ko));}
 for(const asset of ['app.js','math.js','i18n.js','style.css'])assert.ok(en.includes('"../'+asset+'"'));
 assert.ok(!en.includes('puzzle-0-options'));
});
