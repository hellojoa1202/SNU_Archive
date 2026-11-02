/* Focused interactions identify the terms they change. */
(function(){
for(const e of document.querySelectorAll('.time-control'))e.addEventListener('focus',()=>FlowLab.highlight('time'));
for(const e of document.querySelectorAll('.piece-select,#destination'))e.addEventListener('focus',()=>FlowLab.highlight('connection'));
document.getElementById('budget').addEventListener('focus',()=>FlowLab.highlight('budget'));
document.querySelectorAll('[data-link]').forEach(e=>e.addEventListener('pointerenter',()=>FlowLab.highlight(e.dataset.link.split(' ')[0])));
})();
