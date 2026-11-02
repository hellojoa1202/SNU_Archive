/* Link a focused control to the corresponding terms in the main essay. */
(function(){
const mapping={sigma:'sigma',scheme:'scheme',y:'y',h:'h',u:'u'};
function activate(key){document.querySelectorAll('[data-link]').forEach(el=>el.classList.toggle('active',el.dataset.link.split(' ').includes(key)));}
for(const [id,key] of Object.entries(mapping))document.getElementById(id).addEventListener('focus',()=>activate(key));
document.querySelectorAll('[data-link]').forEach(el=>el.addEventListener('pointerenter',()=>activate(el.dataset.link.split(' ')[0])));
})();
