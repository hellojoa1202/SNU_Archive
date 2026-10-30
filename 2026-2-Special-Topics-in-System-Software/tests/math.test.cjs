const assert=require('node:assert/strict');const M=require('../dist/math.js');
for(let level=0;level<3;level++)for(const c of M.candidates(level)){
 assert.ok(Math.min(...M.sample(c,2048))>0,'candidate density stays positive');
 const clean=M.forward(c,.025);const restored=M.restore(clean,.025,24,0,'cutoff');assert.ok(M.error(c,restored)<1e-12,'exact inverse recovers clean coefficients');
 const evolved=M.forward(M.forward(c,.02),.03);assert.ok(M.error(evolved,M.forward(c,.05))<1e-12,'heat semigroup');
}
for(let level=0;level<3;level++){
 const t=[.025,.075,.065][level],cs=M.candidates(level),truth=[0,1,0][level],eps=.003,seed=1701+level*911;
 const y=M.observe(cs[truth],t,eps,seed),feasible=M.compatible(y,cs,t,eps);assert.ok(feasible.includes(truth));
 assert.equal(feasible.length,level===0?1:2,'puzzle identifiability matches intended case');
 const early=M.observe(cs[truth],t*.3,eps,seed+101);assert.deepEqual(M.compatible(early,cs,t*.3,eps),[truth],'earlier observation disambiguates');
}
const cs=M.candidates(0),y=M.observe(cs[0],.075,.003,7);const raw=M.restore(y,.075,24,0,'cutoff'),reg=M.restore(y,.075,24,.001,'tikhonov');assert.ok(M.error(reg,cs[0])<M.error(raw,cs[0]),'regularization suppresses amplified noise');
assert.ok(Math.abs(M.sample(reg,2048).reduce((a,b)=>a+b,0)/2048-1)<1e-10,'mean preserved');
console.log('PASS: positivity, exact inversion, semigroup, puzzle identification, hint, regularization, mass conservation.');
