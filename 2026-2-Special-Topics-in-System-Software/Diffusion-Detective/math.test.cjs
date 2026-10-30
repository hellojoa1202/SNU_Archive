const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('./math.js');
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<tol,`${a} ≈ ${b}`);

test('all initial distributions are positive and preserve uniform mean',()=>{
  for(const preset of ['asymmetric','twin','single'])for(const k of [4,9,16])for(const phase of [0,.3,2.4]){
    const c=M.initial(preset,k,.18,phase);
    assert.ok(Math.min(...M.sample(c,1025))>0);
    near(Array.from({length:1024},(_,i)=>M.value(c,i/1024*M.TAU)).reduce((a,b)=>a+b,0)/1024,1);
  }
});
test('heat semigroup, exact inverse, and phase translation',()=>{
  const c=M.initial('asymmetric',9,.14,.3),clean=M.forward(c,.025);
  assert.ok(M.error(M.restore(clean,.025,24,0,'cutoff'),c)<1e-12);
  assert.ok(M.error(M.forward(M.forward(c,.02),.03),M.forward(c,.05))<1e-12);
  const base=M.initial('asymmetric',9,.14,0);
  near(M.value(c,1.5),M.value(base,1.5-.3));
});
test('exact score equals the derivative of log density',()=>{
  const c=M.forward(M.initial('twin',12,.18,.5),.04),h=1e-6;
  for(let x=.1;x<6;x+=.17)near(M.score(c,x),(Math.log(M.value(c,x+h))-Math.log(M.value(c,x-h)))/(2*h),1e-8);
});
test('puzzles distinguish identifiable and ambiguous observations; hints resolve ambiguity',()=>{
  for(let level=0;level<2;level++){
    const T=[.025,.075][level],cs=M.candidates(level),truth=level,seed=1701+level*911,eps=.003;
    const y=M.observe(cs[truth],T,eps,seed),compatible=M.compatible(y,cs,T,eps);
    assert.ok(compatible.includes(truth));assert.equal(compatible.length,level===0?1:2);
    assert.deepEqual(M.compatible(M.observe(cs[truth],T*.3,eps,seed+101),cs,T*.3,eps),[truth]);
  }
});
test('bias variance risk matches Monte Carlo squared L2 error',()=>{
  const c=M.initial('asymmetric',9,.14,0),T=.04,eps=.003,lambda=.001;
  const r=M.risk(c,T,eps,24,lambda,'tikhonov');let total=0;
  for(let seed=1;seed<=6000;seed++)total+=M.error(M.restore(M.observe(c,T,eps,seed),T,24,lambda,'tikhonov'),c)**2;
  assert.ok(Math.abs(total/6000-r.rmse**2)/(r.rmse**2)<.03);
  near(r.rmse**2,r.bias2+r.variance);
  const raw=M.restore(M.observe(c,T,eps,7),T,24,0,'cutoff');
  const reg=M.restore(M.observe(c,T,eps,7),T,24,lambda,'tikhonov');
  assert.ok(M.error(reg,c)<M.error(raw,c));
});
test('score-based simulations use the same prior and approximate target moments',()=>{
  const c=M.initial('twin',6,.12,.2),sim=M.simulate(c,.05,160,7,2048);
  assert.deepEqual(sim.ode[0],sim.sde[0]);
  assert.ok(M.momentError(sim.ode[160],c)<.2);
  assert.ok(M.momentError(sim.sde[160],c)<.2);
  for(const type of ['ode','sde']){
    const xs=sim[type][160];assert.ok(xs.every(x=>x>=0&&x<M.TAU));
    near(M.histogram(xs).reduce((s,v)=>s+v,0)/32,1);
  }
  const fixed=M.simulate(c,0,20,3,64);
  for(let i=0;i<64;i++){near(fixed.ode[0][i],fixed.ode[20][i]);near(fixed.sde[0][i],fixed.sde[20][i]);}
});

test('English and Korean prose stay paired without duplicating equations or controls',()=>{
  const fs=require('node:fs'),path=require('node:path');
  const html=fs.readFileSync(path.join(__dirname,'English','index.html'),'utf8');
  const source=fs.readFileSync(path.join(__dirname,'i18n.js'),'utf8');
  const translations=JSON.parse(source.split('const prose=')[1].split(';\n  const ui=')[0]);
  const blocks=[...html.matchAll(/<([a-z0-9]+)\b[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)];
  assert.equal(blocks.length,Object.keys(translations).length);
  for(const [,tag,key,english] of blocks){
    assert.equal(translations[key].en,english,`English prose drift: ${key}`);
    assert.ok(/[가-힣]/.test(translations[key].ko),`Korean prose missing: ${key}`);
    assert.ok(!/<(?:input|select|math)\b/.test(translations[key].ko),'shared controls and math remain outside prose translation');
  }
  assert.ok(html.indexOf('src="../i18n.js"')<html.indexOf('src="../app.js"'));
});


test('language folders share identical experiments and reference the same assets',()=>{
  const fs=require('node:fs'),path=require('node:path');
  const english=fs.readFileSync(path.join(__dirname,'English','index.html'),'utf8');
  const korean=fs.readFileSync(path.join(__dirname,'Korean','index.html'),'utf8');
  assert.equal(korean.replace('<html lang="ko">','<html lang="en">'),english);
  for(const filename of ['app.js','math.js','i18n.js','style.css'])assert.ok(english.includes('"../'+filename+'"'));
});
