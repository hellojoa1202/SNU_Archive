/* Shared photograph and drawing geometry. All four experiments use this plane. */
(function(){
'use strict';
const blue='#375f87',orange='#bc8056',ink='#293e50';
const art=new Image();art.src=new URL('assets/cat-photo.jpg',document.currentScript.src).href;
const paths=Array.from({length:12},(_,i)=>{
 const w=.42,h=.42,x=i%4,y=Math.floor(i/4),p=new Path2D(),sign=n=>n%2?1:-1;
 const sides=[y?-sign(i-4+331):0,x<3?sign(i+17):0,y<2?sign(i+331):0,x?-sign(i-1+17):0];p.moveTo(-w/2,-h/2);
 function edge(ax,ay,bx,by,s){const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy),d=.085*s,q=(u,v)=>[ax+u*dx+dy/len*v*d,ay+u*dy-dx/len*v*d];if(!s){p.lineTo(bx,by);return;}p.lineTo(...q(.35,0));p.bezierCurveTo(...q(.46,0),...q(.31,1),...q(.5,1));p.bezierCurveTo(...q(.69,1),...q(.54,0),...q(.65,0));p.lineTo(bx,by);}
 edge(-w/2,-h/2,w/2,-h/2,sides[0]);edge(w/2,-h/2,w/2,h/2,sides[1]);edge(w/2,h/2,-w/2,h/2,sides[2]);edge(-w/2,h/2,-w/2,-h/2,sides[3]);p.closePath();return p;
});
function frame(canvas){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(r.width*d)||canvas.height!==Math.round(r.height*d)){canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);}const c=canvas.getContext('2d'),scale=Math.min((r.width-20)/3,(r.height-20)/2);c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,r.width,r.height);c.fillStyle='#ffffff';c.fillRect(0,0,r.width,r.height);c.translate(r.width/2,r.height/2);c.scale(scale,scale);return{c,scale,w:r.width,h:r.height};}
function point(canvas,e){const r=canvas.getBoundingClientRect(),scale=Math.min((r.width-20)/3,(r.height-20)/2);return[(e.clientX-r.left-r.width/2)/scale,(e.clientY-r.top-r.height/2)/scale];}
function line(f,points,color=blue,width=1,dash=[]){const{c,scale}=f;c.save();c.strokeStyle=color;c.lineWidth=width/scale;c.setLineDash(dash.map(v=>v/scale));c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();c.restore();}
function dot(f,p,color=blue,r=3){const{c,scale}=f;c.fillStyle=color;c.beginPath();c.arc(...p,r/scale,0,Math.PI*2);c.fill();}
function text(f,label,p,color='#82909c',size=10){const{c,scale}=f;c.fillStyle=color;c.font=`${size/scale}px -apple-system,BlinkMacSystemFont,Arial,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(label,...p);}
function arrow(f,x,v,color=blue,width=1,factor=.32){const end=[x[0]+v[0]*factor,x[1]+v[1]*factor],l=Math.hypot(v[0],v[1]);if(l<1e-8){dot(f,x,color,2);return;}line(f,[x,end],color,width);const a=Math.atan2(v[1],v[0]),r=5/f.scale;line(f,[[end[0]-r*Math.cos(a-.5),end[1]-r*Math.sin(a-.5)],end,[end[0]-r*Math.cos(a+.5),end[1]-r*Math.sin(a+.5)]],color,width);}
function targets(f,m){const{c,scale}=f;c.save();c.strokeStyle='#d9e0e7';c.lineWidth=1/scale;for(let i=0;i<12;i++){const p=m.b[i];c.strokeRect(p[0]-.21,p[1]-.21,.42,.42);text(f,String(i+1),[p[0]+.15,p[1]-.15],'#a2acb5',9);}c.restore();}
function piece(f,m,i,p,selected=false,alpha=1){const{c,scale}=f;c.save();c.globalAlpha=alpha;c.translate(...p);c.fillStyle='#e4eaf0';c.fill(paths[i]);if(art.naturalWidth){c.save();c.clip(paths[i]);const sw=Math.min(art.naturalWidth,art.naturalHeight*4/3),sh=sw*3/4;c.drawImage(art,(art.naturalWidth-sw)/2,(art.naturalHeight-sh)/2,sw,sh,-.84-m.b[i][0],-.63-m.b[i][1],1.68,1.26);c.restore();}c.strokeStyle=selected?orange:'rgba(40,49,60,.45)';c.lineWidth=(selected?2.3:.7)/scale;c.stroke(paths[i]);c.restore();if(selected){dot(f,[p[0],p[1]-.12], '#fff',9);text(f,String(i+1),[p[0],p[1]-.12],ink,10);}}
let heatKey='',heatCanvas;
function heat(f,m,t,revision){const key=revision+':'+t;if(key!==heatKey){heatKey=key;heatCanvas=document.createElement('canvas');heatCanvas.width=90;heatCanvas.height=60;const ctx=heatCanvas.getContext('2d'),im=ctx.createImageData(90,60);for(let j=0;j<60;j++)for(let i=0;i<90;i++){const density=FlowMath.density(m,[(i+.5)/90*3-1.5,(j+.5)/60*2-1],t),k=4*(j*90+i);im.data[k]=80;im.data[k+1]=124;im.data[k+2]=159;im.data[k+3]=Math.min(100,density*28);}ctx.putImageData(im,0,0);}f.c.save();f.c.imageSmoothingEnabled=true;f.c.drawImage(heatCanvas,-1.5,-1,3,2);f.c.restore();}
art.onload=()=>window.dispatchEvent(new Event('puzzlephotoload'));art.onerror=()=>window.dispatchEvent(new Event('puzzlephotoerror'));
window.PuzzleView={frame,point,line,dot,text,arrow,targets,piece,heat,blue,orange,ink,get loaded(){return art.naturalWidth>0;}};
})();
