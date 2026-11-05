/* Control focus and hover reveal the corresponding lecture term. */
(function(){
for(const el of document.querySelectorAll('.time-control'))el.addEventListener('focus',()=>FlowLab.highlight(el.id==='time-cnf'?'density-integral':'time'));
for(const el of document.querySelectorAll('.piece-select,#destination,#pairing,#initial'))el.addEventListener('focus',()=>FlowLab.highlight(el.id==='piece-cnf'?'initial-density':'connection'));
for(const id of ['prediction-x','prediction-y','candidate-offset','use-target','use-mean'])document.getElementById(id).addEventListener('focus',()=>FlowLab.highlight('prediction'));
for(const[id,key]of [['budget','euler'],['coordinate','integral'],['sample-position','target']])document.getElementById(id).addEventListener('focus',()=>FlowLab.highlight(key));
document.querySelectorAll('[data-link]').forEach(el=>el.addEventListener('pointerenter',()=>FlowLab.highlight(el.dataset.link.split(' ')[0])));
})();
