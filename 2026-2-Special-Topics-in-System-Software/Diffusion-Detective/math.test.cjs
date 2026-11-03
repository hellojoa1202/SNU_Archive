const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('./math');
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} vs ${b}`);
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
test('Swapping a coupling preserves both endpoint densities, changes intermediate density',()=>{const a=M.create(),b=M.create();M.swap(b,0,8);assert.equal(new Set(b.pi).size,12);let change=0;for(let x=-1;x<1;x+=.17)for(let y=-.8;y<.8;y+=.17){near(M.density(a,[x,y],0),M.density(b,[x,y],0));near(M.density(a,[x,y],1),M.density(b,[x,y],1));change+=Math.abs(M.density(a,[x,y],.5)-M.density(b,[x,y],.5));}assert.ok(change>1);});
test('Posterior weights normalize even far outside the density; velocity is their mean',()=>{const m=M.create();for(const x of [[0,0],[2,-2],[100,-100]])for(const t of [0,.5,1]){const f=M.field(m,x,t,true);near(f.weights.reduce((a,b)=>a+b),1);for(let j=0;j<2;j++)near(f.v[j],f.weights.reduce((a,w,i)=>a+w*f.components[i][j],0));assert.ok(f.v.every(Number.isFinite));}});
test('Analytic mixture and conditional velocity satisfy continuity equation numerically',()=>{const m=M.create(),h=1e-5;for(const t of [.1,.5,.9])for(const x of [[0,0],[-.3,.25],[.6,-.4]]){const dt=(M.density(m,x,t+h)-M.density(m,x,t-h))/(2*h);let div=0;for(let j=0;j<2;j++){const lo=x.slice(),hi=x.slice();lo[j]-=h;hi[j]+=h;const a=M.field(m,lo,t,true),b=M.field(m,hi,t,true);div+=(b.density*b.v[j]-a.density*a.v[j])/(2*h);}near(dt+div,0,2e-7);}});
test('Conditional loss decomposes into marginal error plus a predictor-independent term',()=>{const m=M.create();for(const t of [.1,.5,.9])for(const p of [[0,0],[.2,-.7],[-2,3]]){const r=M.conditionalRisk(m,[.1,.2],t,p);near(r.total,r.irreducible+r.excess);const f=M.field(m,[.1,.2],t);near(M.conditionalRisk(m,[.1,.2],t,f).total,r.irreducible);}});
test('A single translated Gaussian is integrated exactly and has constant velocity',()=>{const m={a:[[0,0]],b:[[1,-2]],pi:[0],tau:.16};for(const method of ['euler','heun']){const r=M.integrate(m,[.2,.3],method,8);near(r.end[0],1.2);near(r.end[1],-1.7);}});
test('Euler and Heun converge at their expected orders on the shared smooth field',()=>{const m=M.create(),x=m.a[1],ref=M.integrate(m,x,'heun',32768).end;const e=n=>dist(M.integrate(m,x,'euler',n).end,ref),h=n=>dist(M.integrate(m,x,'heun',n).end,ref);assert.ok(e(128)/e(256)>1.8&&e(128)/e(256)<2.2);assert.ok(h(128)/h(256)>3.5&&h(128)/h(256)<4.5);assert.equal(M.integrate(m,x,'euler',64).nfe,M.integrate(m,x,'heun',32).nfe);assert.ok(dist(M.integrate(m,x,'heun',8192).end,ref)<1e-7);});
test('ODE endpoints need not equal the centers assigned by the coupling',()=>{const m=M.create();let max=0;for(let i=0;i<12;i++)max=Math.max(max,dist(M.integrate(m,m.a[i],'heun',1024).end,m.b[m.pi[i]]));assert.ok(max>.1);});
test('Seeded mixture samples include a Gaussian offset, not only tile centers',()=>{const m=M.create(),a=M.samples(m),b=M.samples(m);assert.deepEqual(a,b);assert.equal(a.length,96);assert.ok(a.some((p,i)=>dist(p,m.a[i%12])>.1));});
test('English and Korean share all controls and paired prose',()=>{const fs=require('node:fs'),en=fs.readFileSync(__dirname+'/English ver/index.html','utf8'),ko=fs.readFileSync(__dirname+'/Korean ver/index.html','utf8'),src=fs.readFileSync(__dirname+'/i18n.js','utf8'),prose=JSON.parse(src.split('const prose=')[1].split(';\nlet language=')[0]);assert.equal(ko.replace('<html lang="ko">','<html lang="en">'),en);const blocks=[...en.matchAll(/<([a-z0-9]+)\b[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)];assert.equal(blocks.length,Object.keys(prose).length);for(const[,tag,key,text]of blocks){assert.equal(prose[key].en,text,key);assert.ok(/[가-힣]/.test(prose[key].ko),key);}const ids=[...en.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size);});
test('Normal CDF and region probabilities agree with independent reference values',()=>{for(const[x,p]of[[0,.5],[1,.841344746068543],[2,.977249868051821],[3,.99865010196837],[-4,.000031671241833]])near(M.normalCDF(x),p,8e-8);const m=M.create();near(M.regionMass(m,.5,-10),0);near(M.regionMass(m,.5,10),1);for(const t of [0,.5,1]){let last=0;for(let cut=-1.2;cut<=1.2;cut+=.1){const p=M.regionMass(m,t,cut);assert.ok(p>=last&&p<=1);last=p;}}const other=M.create();M.swap(other,0,9);for(const t of [0,1])near(M.regionMass(m,t,.13),M.regionMass(other,t,.13));});
test('Half-plane mass derivative equals the analytic probability flux',()=>{const m=M.create(),h=1e-4;for(const t of [.1,.5,.9])for(const c of [-.5,0,.4]){const derivative=(M.regionMass(m,t+h,c)-M.regionMass(m,t-h,c))/(2*h);near(derivative,M.regionRate(m,t,c),4e-6);}});

test('Displayed equations match the audited lecture-only catalog',()=>{
 const fs=require('node:fs'),catalog=JSON.parse(fs.readFileSync(__dirname+'/course-equations.json','utf8'));
 const html=fs.readFileSync(__dirname+'/English ver/index.html','utf8');
 const equations=[...html.matchAll(/<div class="equation" role="math" data-equation="([^"]+)">([\s\S]*?)<\/div>/g)];
 assert.equal(equations.length,Object.keys(catalog).length);
 for(const [,key,content] of equations){assert.equal(content,catalog[key].html);assert.ok(catalog[key].pdf_page>0);}
 assert.equal((html.match(/role="math"/g)||[]).length,equations.length);
 assert.ok(!/RK4|minimum-cost|material acceleration|velocityEnergy/.test(html));
});

test('Signed velocity areas reproduce numerical displacement for both coordinates and solvers',()=>{
 for(const axis of [0,1])for(const method of ['euler','heun'])for(const n of [8,32,128])for(const i of [0,5,11]){
  const m=M.create();M.swap(m,2,8);const q=M.quadrature(m,m.a[i],method,n,axis);
  near(q.area,q.displacement,2e-14);near(q.area,q.path.at(-1)[axis]-q.path[0][axis],2e-14);
  assert.equal(q.nfe,n*(method==='heun'?2:1));assert.equal(q.segments.length,n);
  for(let k=0;k<n;k++)near(q.segments[k].area,q.path[k+1][axis]-q.path[k][axis],2e-14);
 }
});
test('Gate ledger counts repeated crossings and agrees with particle positions',()=>{
 const paths=[[[-1,0],[1,0],[-1,0],[1,0]]];const history=M.boundaryHistory(paths,0);
 assert.deepEqual(M.boundaryCounts(history,1),{initial:1,entered:1,left:2,current:0});
 assert.equal(M.boundaryCounts(history,1/6).current,1);
 assert.equal(M.boundaryCounts(history,.5).current,1);
 const m=M.create(),cloud=M.samples(m,24).map(x=>M.integrate(m,x,'heun',128).path);
 for(const cut of [-.6,0,.4]){const h=M.boundaryHistory(cloud,cut);for(let k=0;k<=100;k++){
  const t=k/100,count=M.boundaryCounts(h,t);assert.equal(count.current,cloud.filter(path=>M.at(path,t)[0]<=cut).length);
  assert.equal(count.current,count.initial+count.entered-count.left);
 }}
});


test('Analytic velocity derivatives agree with independent spatial differences',()=>{
 const m=M.create(),h=1e-5;
 for(const t of [.1,.5,.9])for(const x of [[-.4,.2],[0,0],[.7,-.2]]){
  const d=M.differential(m,x,t);let div=0;
  for(let j=0;j<2;j++){const a=x.slice(),b=x.slice();a[j]-=h;b[j]+=h;
   const va=M.field(m,a,t),vb=M.field(m,b,t);
   for(let k=0;k<2;k++)near(d.jacobian[k][j],(vb[k]-va[k])/(2*h),2e-7);
   div+=(vb[j]-va[j])/(2*h);
  }near(d.divergence,div,2e-7);
 }
});
test('Integrated divergence reconstructs the independently evaluated log density',()=>{
 const m=M.create();M.swap(m,2,9);
 for(const i of [0,5,11]){const trace=M.likelihoodTrace(m,m.a[i],4096);
  for(const t of [0,.25,.5,.75,1])near(M.scalarAt(trace.logp,t),M.logDensity(m,M.at(trace.path,t),t),2e-5);
 }
 const translation={a:[[0,0]],b:[[1,-2]],pi:[0],tau:.16},tr=M.likelihoodTrace(translation,[.1,.1],16);
 for(const v of tr.logp)near(v,tr.logp0);
 for(const v of tr.divergences)near(v,0);
});
test('A conditional training pair has shared offsets and the stated path derivative',()=>{
 const m=M.create();M.swap(m,2,7);
 for(const i of [0,2,11])for(const t of [0,.31,1]){const q=M.trainingPair(m,t,i,49),eps=1e-5;
  const a=M.trainingPair(m,t-eps,i,49),b=M.trainingPair(m,t+eps,i,49);
  for(let j=0;j<2;j++){
   near(q.start[j]-m.a[i][j],q.end[j]-m.b[m.pi[i]][j]);
   near(q.velocity[j],(b.position[j]-a.position[j])/(2*eps));
  }
 }
});
