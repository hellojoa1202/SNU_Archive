/* Focused interactions identify the terms they change. */
(function(){
for(const e of document.querySelectorAll('.time-control'))e.addEventListener('focus',()=>FlowLab.highlight('time'));
for(const e of document.querySelectorAll('.piece-select,#destination'))e.addEventListener('focus',()=>FlowLab.highlight('connection'));
document.getElementById('budget').addEventListener('focus',()=>FlowLab.highlight('budget'));
document.getElementById('mass-cut').addEventListener('focus',()=>FlowLab.highlight('region'));
document.getElementById('use-mean').addEventListener('focus',()=>FlowLab.highlight('prediction'));
document.querySelectorAll('[data-link]').forEach(e=>e.addEventListener('pointerenter',()=>FlowLab.highlight(e.dataset.link.split(' ')[0])));
})();
