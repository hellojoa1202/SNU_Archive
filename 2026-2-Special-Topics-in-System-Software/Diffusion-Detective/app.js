'use strict';
const M=Spectral;
const t=DiffusionI18n.text;
const $=id=>document.getElementById(id);
const colors={teal:'#227e70',orange:'#be835d',slate:'#a5b4c1',dark:'#384e5b',grid:'#eaf0f2'};
const state={source:null,observed:null,seed:1701,simulation:null,simulationKey:''};
const puzzles=[];
const read=id=>Number($(id).value);
const format=n=>n===0?'0':Math.abs(n)>=10000||Math.abs(n)<.0001?n.toExponential(1):n.toFixed(3);
const scientific=n=>n===0?'0':n.toExponential(1);
const width=svg=>Math.max(280,Math.min(960,svg.getBoundingClientRect().width||760));
const values=c=>M.sample(c,257);
function path(data,X,Y){return data.map((p,i)=>(i?'L':'M')+X(i).toFixed(2)+','+Y(p).toFixed(2)).join(' ');}
function plot(svg,series,options={}){
  const W=width(svg),H=options.height||220,L=45,R=14,T=20,B=30;
  const all=series.flatMap(s=>s.data).filter(Number.isFinite);
  const log=options.log===true;
  let lo=options.min??Math.min(0,...all),hi=options.max??Math.max(1.65,...all);
  if(log){lo=options.min??Math.max(1e-6,Math.min(...all.filter(v=>v>0))*.65);hi=options.max??Math.max(...all)*1.2;}
  else {const pad=Math.max(.01,hi-lo)*.06;lo-=pad;hi+=pad;}
  if(hi<=lo)hi=lo+1;
  const tx=v=>log?Math.log10(Math.max(lo,v)):v;
  const Y=v=>T+(tx(hi)-tx(v))/(tx(hi)-tx(lo))*(H-T-B);
  const X=i=>L+i/(Math.max(2,series[0].data.length)-1)*(W-L-R);
  let out='';
  if(log){
    for(let p=Math.ceil(Math.log10(lo));p<=Math.floor(Math.log10(hi));p++){
      if(Math.floor(Math.log10(hi))-Math.ceil(Math.log10(lo))>10&&p%3!==0)continue;
      const yy=Y(10**p);out+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="${colors.grid}"/><text x="${L-8}" y="${yy+3}" text-anchor="end">1e${p}</text>`;
    }
  }else{
    for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4,yy=Y(v);out+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="${colors.grid}"/><text x="${L-7}" y="${yy+3}" text-anchor="end">${Math.abs(v)>1000?v.toExponential(0):v.toFixed(1)}</text>`;}
  }
  const labels=options.labels||['0','π/2','π','3π/2','2π'];
  labels.forEach((v,i)=>{out+=`<text x="${L+i/(labels.length-1)*(W-L-R)}" y="${H-8}" text-anchor="middle">${v}</text>`;});
  for(const s of series){
    const d=path(s.data,X,Y);
    out+=`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.width||1.8}" ${s.dashed?'stroke-dasharray="4 4"':''} stroke-linejoin="round"/>`;
  }
  if(options.marker!==undefined){const x=L+options.marker*(W-L-R);out+=`<line x1="${x}" x2="${x}" y1="${T}" y2="${H-B}" stroke="${colors.teal}" stroke-dasharray="3 4" stroke-opacity=".6"/>`;}
  out+=`<text x="${L}" y="11" style="font-size:8px">${options.ylabel||'p(θ)'}</text>`;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=out;
}
function controls(){
  $('phase-out').textContent=read('phase')+'°';
  $('detail-k-out').textContent=read('detail-k');
  $('amplitude-out').textContent=read('amplitude').toFixed(3);
  $('time-out').textContent=read('time').toFixed(3);
  $('noise-out').textContent=read('noise').toFixed(4);
  $('cutoff-out').textContent=read('cutoff');
  $('lambda-out').textContent=read('lambda').toFixed(1);
  $('risk-lambda-out').textContent=read('lambda').toFixed(1);
}
function heatmap(){
  const svg=$('heatmap'),W=width(svg),H=206,L=29,R=15,T=12,B=27,cols=40;
  const cellW=(W-L-R)/cols,cellH=(H-T-B)/24;
  let out='';
  for(let k=1;k<=24;k++)for(let j=0;j<cols;j++){
    const a=Math.exp(-k*k*(j+.5)/cols*.12);
    out+=`<rect x="${L+j*cellW}" y="${T+(k-1)*cellH}" width="${cellW+.2}" height="${cellH+.2}" fill="${colors.teal}" opacity="${.035+.965*a}"><title>k=${k}, t=${((j+.5)/cols*.12).toFixed(3)}, h=${a.toExponential(2)}</title></rect>`;
  }
  const x=L+read('time')/.12*(W-L-R),k=read('detail-k');
  out+=`<rect x="${L}" y="${T+(k-1)*cellH}" width="${W-L-R}" height="${cellH}" fill="none" stroke="${colors.orange}" stroke-width="1.2"/><line x1="${x}" x2="${x}" y1="${T}" y2="${H-B}" stroke="#3e5951" stroke-dasharray="3 3"/>`;
  [1,6,12,18,24].forEach(k=>{out+=`<text x="${L-8}" y="${T+(k-.5)*cellH+3}" text-anchor="end">${k}</text>`;});
  ['0','.03','.06','.09','.12'].forEach((v,j)=>{out+=`<text x="${L+j/4*(W-L-R)}" y="${H-7}" text-anchor="middle">${v}</text>`;});
  out+=`<text x="4" y="9" style="font-size:8px">k</text>`;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=out;
}
function renderForward(){
  const T=read('time'),k=read('detail-k'),h=Math.exp(-k*k*T);
  plot($('forward-chart'),[{data:values(state.source),color:colors.orange,dashed:true},{data:values(M.forward(state.source,T)),color:colors.teal}],{height:250});
  heatmap();
  $('attenuation-heading').textContent=t(`${(h*100).toFixed(2)}% of mode ${k} remains`,`주파수 ${k} 성분이 ${(h*100).toFixed(2)}% 남습니다`);
  $('attenuation-text').textContent=t(`At T = ${T.toFixed(3)}, hₖ = ${scientific(h)}. Reversing this decay multiplies measurement error in the same mode by ${format(1/h)}.`,`T = ${T.toFixed(3)}에서 hₖ = ${scientific(h)}입니다. 이 감쇠를 역산하면 같은 주파수의 측정 오차도 ${format(1/h)}배 증폭됩니다.`);
}
function spectrum(restored){
  const svg=$('spectrum'),W=width(svg),H=205,L=38,R=12,T=15,B=30;
  const amplitudes=Array.from({length:24},(_,i)=>Math.hypot(state.observed.a[i+1],state.observed.b[i+1]));
  const recovered=Array.from({length:24},(_,i)=>Math.hypot(restored.a[i+1],restored.b[i+1]));
  const min=1e-6,max=Math.max(1,...amplitudes,...recovered),hi=Math.ceil(Math.log10(max));
  const Y=v=>T+(hi-Math.log10(Math.max(min,v)))/(hi+6)*(H-T-B);
  let out='';
  for(let p=-6;p<=hi;p++){const yy=Y(10**p);out+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="${colors.grid}"/><text x="${L-6}" y="${yy+3}" text-anchor="end" style="font-size:8px">1e${p}</text>`;}
  const cell=(W-L-R)/24,bw=Math.max(2,cell*.2);
  for(let i=0;i<24;i++){
    const xx=L+(i+.5)*cell;
    out+=`<rect x="${xx-bw-1}" y="${Y(amplitudes[i])}" width="${bw}" height="${Math.max(0,H-B-Y(amplitudes[i]))}" rx="1" fill="${colors.slate}"><title>k=${i+1} ${t('observed','관측')} ${scientific(amplitudes[i])}</title></rect><rect x="${xx+1}" y="${Y(recovered[i])}" width="${bw}" height="${Math.max(0,H-B-Y(recovered[i]))}" rx="1" fill="${colors.teal}"><title>k=${i+1} ${t('recovered','복원')} ${scientific(recovered[i])}</title></rect>`;
    if(W>550||i%2===1)out+=`<text x="${xx}" y="${H-10}" text-anchor="middle" style="font-size:8px">${i+1}</text>`;
  }
  if(read('noise')>0){const yy=Y(Math.SQRT2*read('noise'));out+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="${colors.orange}" stroke-dasharray="4 4"/>`;}
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=out;
}
function renderInverse(){
  const T=read('time'),lambda=10**read('lambda'),K=read('cutoff');
  const configs=[['raw',t('Direct inverse','단순 역산'),t('All 24 modes','24개 모드 전체'),24,0,'cutoff'],['cut',t('Spectral cutoff','주파수 제한'),t(`Modes k ≤ ${K}`,`k ≤ ${K} 모드 유지`),K,0,'cutoff'],['tik','Tikhonov',t(`λ = ${scientific(lambda)} · all 24 modes`,`λ = ${scientific(lambda)} · 24개 모드 전체`),24,lambda,'tikhonov']];
  let tik;
  for(const [id,title,description,k,lam,method] of configs){
    const c=M.restore(state.observed,T,k,lam,method),samples=values(c),min=Math.min(...samples),maxgain=Math.max(...Array.from({length:24},(_,j)=>M.gain(j+1,T,k,lam,method)));
    if(id==='tik')tik=c;
    $(`method-${id}-description`).textContent=description;
    plot($(`method-${id}`),[{data:values(state.source),color:colors.orange,dashed:true},{data:samples,color:colors.teal}],{height:185});
    $(`method-${id}-error`).textContent=format(M.error(c,state.source));
    $(`method-${id}-gain`).textContent=format(maxgain)+'×';
    $(`method-${id}-min`).textContent=format(min);
    $(`method-${id}-min`).classList.toggle('danger',min<0);
  }
  spectrum(tik);
  $('inverse-note').textContent=t(`At λ = ${scientific(lambda)}, the Tikhonov L² error is ${format(M.error(tik,state.source))}. Each panel keeps its own vertical scale, including any negative values or amplified oscillations.`,`λ = ${scientific(lambda)}에서 Tikhonov의 L² 오차는 ${format(M.error(tik,state.source))}입니다. 패널마다 독립적인 세로축을 사용하며, 음수 값과 증폭된 진동도 그대로 표시합니다.`);
}
function renderRisk(){
  const T=read('time'),eps=read('noise'),lambda=10**read('lambda');
  const rows=Array.from({length:81},(_,i)=>{const lam=10**(-8+i/10),r=M.risk(state.source,T,eps,24,lam,'tikhonov');return {bias:Math.sqrt(r.bias2),noise:Math.sqrt(r.variance),expected:r.rmse,actual:M.error(M.restore(state.observed,T,24,lam,'tikhonov'),state.source)};});
  plot($('risk-chart'),[{data:rows.map(r=>r.expected),color:colors.teal,width:2.3},{data:rows.map(r=>r.bias),color:colors.orange},{data:rows.map(r=>r.noise),color:colors.slate},{data:rows.map(r=>r.actual),color:colors.dark,dashed:true}],{log:true,min:1e-5,height:255,labels:['−8','−6','−4','−2','0'],ylabel:t('L² error · log scale','L² 오차 · 로그 축'),marker:(read('lambda')+8)/8});
  const r=M.risk(state.source,T,eps,24,lambda,'tikhonov');
  const stats=[[t('Expected RMSE','기대 RMSE'),r.rmse],[t('Bias','편향'),Math.sqrt(r.bias2)],[t('Noise RMS','노이즈 RMS'),Math.sqrt(r.variance)],[t('Realized error','현재 실제 오차'),M.error(M.restore(state.observed,T,24,lambda,'tikhonov'),state.source)]];
  $('risk-metrics').innerHTML=stats.map(([name,v])=>`<div><span>${name}</span><strong>${format(v)}</strong></div>`).join('');
}
function buildPuzzles(){
  const definitions=[{level:0,title:t('01 · A missing detail','01 · 사라진 작은 무늬'),T:.025,truth:0,text:t('Three sources, each with a different fine-scale pattern. Which one fits this observation?','서로 다른 미세 무늬를 가진 세 원본입니다. 어떤 후보가 이 관측과 맞을까요?')},{level:1,title:t('02 · A shared trace','02 · 같은 흔적'),T:.075,truth:1,text:t('More time has passed. Does the observation still separate the candidates, or do several fit?','확산 시간이 더 길어졌습니다. 후보를 여전히 구분할 수 있을까요, 아니면 여러 후보가 함께 맞을까요?')}];
  $('puzzles').innerHTML=definitions.map((p,i)=>`<div class="experiment puzzle-card" id="puzzle-${i}"><div class="experiment-heading"><div><span class="eyebrow">${t('INDEPENDENT PUZZLE','독립 퍼즐')} ${i+1}</span><h3>${p.title}</h3></div><span class="puzzle-status" id="puzzle-${i}-status"></span></div><p class="puzzle-intro">${p.text}</p><div class="chart-legend"><span><i class="legend-dot slate"></i>${t('Observed','관측')}</span><span><i class="legend-dot teal"></i>${t('Tikhonov · λ = 10⁻⁴','Tikhonov 복원 · λ = 10⁻⁴')}</span><span id="puzzle-${i}-truth" hidden><i class="legend-dot orange"></i>${t('Source','원본')}</span></div><svg id="puzzle-${i}-chart" class="plot" role="img" aria-label="${t(`Observation and reconstruction for puzzle ${i+1}`,`퍼즐 ${i+1}의 관측과 복원`)}"></svg><div class="puzzle-options" id="puzzle-${i}-options"></div><div class="puzzle-actions"><button class="hint-button" id="puzzle-${i}-hint">${t('＋ Use an earlier observation','＋ 더 이른 관측으로 바꾸기')}</button><span class="small">${t('Choose a candidate to see the residuals.','후보를 선택하면 잔차를 볼 수 있습니다.')}</span></div><div class="feedback" id="puzzle-${i}-feedback" role="status" aria-live="polite" hidden></div></div>`).join('');
  definitions.forEach((p,i)=>{
    if(puzzles[i])Object.assign(p,puzzles[i]);
    else {p.cs=M.candidates(p.level);p.eps=.003;p.seed=1701+p.level*911;p.revealed=false;p.choice=null;p.hinted=false;p.y=M.observe(p.cs[p.truth],p.T,p.eps,p.seed);}
    puzzles[i]=p;
    $(`puzzle-${i}-options`).innerHTML=p.cs.map((c,j)=>`<button class="puzzle-choice" data-choice="${j}" aria-pressed="false"><span>${t('Candidate','후보')} ${'ABC'[j]}</span><svg viewBox="0 0 180 60" aria-label="${t(`Source density for candidate ${'ABC'[j]}`,`후보 ${'ABC'[j]}의 원본 밀도`)}"><path d="${path(M.sample(c,128),j=>j/127*180,v=>53-(v-.3)*34)}" fill="none" stroke="#839d92" stroke-width="1.5"/></svg></button>`).join('')+`<button class="puzzle-choice" data-choice="3" aria-pressed="false"><span>${t('Several fit','여러 후보가 가능')}</span><div class="unknown-mark">?</div><small>${t('More than one possible source','단서로 원본을 구분하기 어려움')}</small></button>`;
    $(`puzzle-${i}-options`).querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{p.choice=Number(b.dataset.choice);p.revealed=true;renderPuzzle(i);}));
    $(`puzzle-${i}-hint`).addEventListener('click',()=>{p.T*=.3;p.seed+=101;p.hinted=true;p.revealed=false;p.choice=null;p.y=M.observe(p.cs[p.truth],p.T,p.eps,p.seed);$(`puzzle-${i}-hint`).disabled=true;$(`puzzle-${i}-hint`).textContent=t('✓ Earlier observation','✓ 더 이른 관측으로 변경됨');renderPuzzle(i);});
    if(p.hinted){$(`puzzle-${i}-hint`).disabled=true;$(`puzzle-${i}-hint`).textContent=t('✓ Earlier observation','✓ 더 이른 관측으로 변경됨');}
    renderPuzzle(i);
  });
}
function renderPuzzle(i){
  const p=puzzles[i],rec=M.restore(p.y,p.T,24,.0001,'tikhonov'),feasible=M.compatible(p.y,p.cs,p.T,p.eps);
  const series=[{data:values(p.y),color:colors.slate},{data:values(rec),color:colors.teal}];
  if(p.revealed)series.push({data:values(p.cs[p.truth]),color:colors.orange,dashed:true});
  plot($(`puzzle-${i}-chart`),series,{height:210});
  $(`puzzle-${i}-status`).textContent=`T = ${p.T.toFixed(4)} · ε = ${p.eps}`;
  $(`puzzle-${i}-truth`).hidden=!p.revealed;
  $(`puzzle-${i}-options`).querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.choice)===p.choice));
  const feedback=$(`puzzle-${i}-feedback`);feedback.hidden=!p.revealed;
  if(!p.revealed)return;
  const correct=p.choice===(feasible.length>1?3:feasible[0]);
  feedback.classList.toggle('wrong',!correct);
  feedback.innerHTML=`<strong>${feasible.length>1?t('Two possible sources','가능한 원본이 두 개입니다'):t('One matching source','관측과 맞는 원본이 하나입니다')}</strong>${feasible.length>1?t(`${feasible.map(j=>'ABC'[j]).join(' and ')} both fit within ε. The observation leaves more than one possible source.`,`${feasible.map(j=>'ABC'[j]).join(', ')} 모두 오차 한계 ε 안에서 관측과 맞습니다. 현재 단서로는 원본을 하나로 구분하기 어렵습니다.`):t(`Only ${'ABC'[feasible[0]]} fits within ε across every coefficient.`,`${'ABC'[feasible[0]]}만 모든 계수에서 오차 한계 ε를 만족합니다.`)} ${t(`Source used: ${'ABC'[p.truth]}.`,`관측 생성에 사용한 원본: ${'ABC'[p.truth]}.`)}<div class="residuals">${p.cs.map((c,j)=>{const r=M.residual(p.y,c,p.T),compatible=r<=p.eps+1e-12;return `<div class="${compatible?'':'incompatible'}">${t('Candidate','후보')} ${'ABC'[j]} · ${compatible?t('fits','가능'):t('outside bound','범위 초과')}<br>r = ${r.toFixed(5)} ${compatible?'≤':'>'} ε</div>`;}).join('')}</div>`;
}
function densityHistogram(svg,xs,target){
  const W=width(svg),H=220,L=37,R=12,T=17,B=30,bins=32,hist=M.histogram(xs,bins),truth=values(target),max=Math.max(2,...hist,...truth)*1.08;
  const X=x=>L+x/M.TAU*(W-L-R),Y=v=>T+(max-v)/max*(H-T-B);
  let out='';
  for(let i=0;i<=3;i++){const v=max*i/3;out+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${colors.grid}"/><text x="${L-6}" y="${Y(v)+3}" text-anchor="end">${v.toFixed(1)}</text>`;}
  hist.forEach((v,i)=>{out+=`<rect x="${X(i/bins*M.TAU)+1}" y="${Y(v)}" width="${(W-L-R)/bins-1.5}" height="${H-B-Y(v)}" fill="${colors.teal}" opacity=".28" rx="1"/>`;});
  out+=`<path d="${path(truth,i=>X(i/256*M.TAU),Y)}" fill="none" stroke="${colors.orange}" stroke-width="1.7"/>`;
  ['0','π','2π'].forEach((v,i)=>{out+=`<text x="${X(i/2*M.TAU)}" y="${H-8}" text-anchor="middle">${v}</text>`;});
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=out;
}
function trajectories(svg,snapshots,step){
  const W=width(svg),H=145,L=37,R=12,T=17,B=25,total=snapshots.length-1;
  const X=j=>L+j/total*(W-L-R),Y=x=>T+(1-x/M.TAU)*(H-T-B);
  let out='';
  [0,Math.PI,M.TAU].forEach(v=>{out+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${colors.grid}"/><text x="${L-6}" y="${Y(v)+3}" text-anchor="end">${v===0?'0':v===Math.PI?'π':'2π'}</text>`;});
  for(let i=0;i<16;i++){
    let d='';for(let j=0;j<=step;j++){const x=snapshots[j][i],jump=j>0&&Math.abs(x-snapshots[j-1][i])>Math.PI;d+=(j===0||jump?'M':'L')+X(j).toFixed(2)+','+Y(x).toFixed(2);}
    out+=`<path d="${d}" fill="none" stroke="${colors.teal}" stroke-width=".9" opacity=".43"/>`;
  }
  out+=`<text x="${L}" y="${H-6}" style="font-size:8px">r = 0</text><text x="${W-R}" y="${H-6}" text-anchor="end" style="font-size:8px">r = T</text><text x="${L}" y="9" style="font-size:8px">${t('16 sample paths · θ','입자 16개 궤적 · θ')}</text>`;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=out;
}
function renderGeneration(){
  const T=read('time'),steps=read('steps'),seed=read('sample-seed');
  const key=[$('preset').value,read('phase'),read('detail-k'),read('amplitude'),T,steps,seed].join('|');
  if(state.simulationKey!==key){state.simulation=M.simulate(state.source,T,steps,seed);state.simulationKey=key;}
  const step=Math.round(read('reverse-progress')/100*steps),target=M.forward(state.source,T*(1-step/steps));
  $('progress-out').textContent=read('reverse-progress')+'%';$('steps-out').textContent=steps;$('seed-out').textContent=seed;
  for(const type of ['sde','ode']){
    const samples=state.simulation[type][step];
    densityHistogram($(`${type}-chart`),samples,target);
    trajectories($(`${type}-paths`),state.simulation[type],step);
    $(`${type}-metric`).textContent=t(`Moment error Δ₆ = ${M.momentError(samples,target).toFixed(3)} · target time t = ${(T*(1-step/steps)).toFixed(4)}`,`모멘트 오차 Δ₆ = ${M.momentError(samples,target).toFixed(3)} · 목표 시점 t = ${(T*(1-step/steps)).toFixed(4)}`);
  }
}
let generationTimer;
function refreshSource(){
  state.source=M.initial($('preset').value,read('detail-k'),read('amplitude'),read('phase')/360*M.TAU);
  state.observed=M.observe(state.source,read('time'),read('noise'),state.seed);
  controls();renderForward();renderInverse();renderRisk();
  clearTimeout(generationTimer);generationTimer=setTimeout(renderGeneration,100);
}
function refreshInverse(){state.observed=M.observe(state.source,read('time'),read('noise'),state.seed);controls();renderInverse();renderRisk();}
function hero(){
  let out='';for(let layer=0;layer<4;layer++){
    const data=Array.from({length:300},(_,i)=>{const x=i/299,a=.4*(1-x)+.03;return 60+22*Math.sin(x*15)+22*a*Math.sin(x*70+layer*.5);});
    out+=`<path d="${path(data,i=>i/299*900,v=>v+layer*5)}" fill="none" stroke="${layer===0?colors.teal:'#b4c3c7'}" opacity="${layer===0?1:.35}" stroke-width="${layer===0?1.8:1}"/>`;
  }$('hero-art').innerHTML=out;
}
function buildMethods(){
$('methods').innerHTML=[['raw',t('Direct inverse','단순 역산')],['cut',t('Spectral cutoff','주파수 제한')],['tik','Tikhonov']].map(([id,title])=>`<div class="method-card"><h4>${title}</h4><p class="method-description" id="method-${id}-description"></p><svg id="method-${id}" class="plot" role="img" aria-label="${t(`${title} reconstruction and source`,`${title} 복원과 원본`)}"></svg><div class="metric"><span>${t('L² error','L² 오차')}</span><strong id="method-${id}-error"></strong></div><div class="metric"><span>${t('Max. gain','최대 이득')}</span><strong id="method-${id}-gain"></strong></div><div class="metric"><span>${t('Min. density','최소 밀도')}</span><strong id="method-${id}-min"></strong></div></div>`).join('');
}
buildMethods();
['preset','phase','detail-k','amplitude','time'].forEach(id=>$(id).addEventListener('input',refreshSource));
['noise','cutoff','lambda'].forEach(id=>$(id).addEventListener('input',()=>{$('risk-lambda').value=$('lambda').value;refreshInverse();}));
$('risk-lambda').addEventListener('input',()=>{$('lambda').value=$('risk-lambda').value;refreshInverse();});
['reverse-progress','steps','sample-seed'].forEach(id=>$(id).addEventListener('input',renderGeneration));
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.contents a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}},{rootMargin:'-10% 0px -65% 0px',threshold:0});
document.querySelectorAll('.chapter').forEach(s=>observer.observe(s));
window.addEventListener('scroll',()=>{const available=document.documentElement.scrollHeight-innerHeight;$('reading-progress').style.width=(available>0?scrollY/available*100:0)+'%';},{passive:true});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{renderForward();renderInverse();renderRisk();renderGeneration();puzzles.forEach((_,i)=>renderPuzzle(i));},100);});
hero();refreshSource();buildPuzzles();renderGeneration();

// Indicate scrollable formulas on narrow screens without hiding their content.
function markOverflow(){document.querySelectorAll('.equation').forEach(el=>{const overflow=el.scrollWidth>el.clientWidth+2;el.classList.toggle('scrollable-formula',overflow);if(overflow){el.setAttribute('tabindex','0');el.setAttribute('aria-label',t('Equation. Scroll horizontally to read the full expression.','수식. 좌우로 스크롤하여 전체 식을 확인할 수 있습니다.'));}else{el.removeAttribute('tabindex');el.removeAttribute('aria-label');}});}
markOverflow();window.addEventListener('resize',markOverflow);

window.addEventListener('diffusionlanguagechange',()=>{
  buildMethods();buildPuzzles();refreshSource();renderGeneration();markOverflow();
});
