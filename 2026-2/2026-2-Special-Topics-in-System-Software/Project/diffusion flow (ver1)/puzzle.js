/* Shared photograph and drawing geometry. All four experiments use this plane. */
(function(){
'use strict';
const blue='#6085ad',red='#ae4c54',ink='#17283e';
const art=new Image();art.src=new URL('assets/cat-photo.jpg',document.currentScript.src).href;
const paths=Array.from({length:48},(_,i)=>{
 const w=.22,h=.22,x=i%8,y=Math.floor(i/8),p=new Path2D(),sign=n=>n%2?1:-1;
 const sides=[y?-sign(i-8+331):0,x<7?sign(i+17):0,y<5?sign(i+331):0,x?-sign(i-1+17):0];p.moveTo(-w/2,-h/2);
 function edge(ax,ay,bx,by,s){const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy),d=.046*s,q=(u,v)=>[ax+u*dx+dy/len*v*d,ay+u*dy-dx/len*v*d];if(!s){p.lineTo(bx,by);return;}p.lineTo(...q(.35,0));p.bezierCurveTo(...q(.46,0),...q(.31,1),...q(.5,1));p.bezierCurveTo(...q(.69,1),...q(.54,0),...q(.65,0));p.lineTo(bx,by);}
 edge(-w/2,-h/2,w/2,-h/2,sides[0]);edge(w/2,-h/2,w/2,h/2,sides[1]);edge(w/2,h/2,-w/2,h/2,sides[2]);edge(-w/2,h/2,-w/2,-h/2,sides[3]);p.closePath();return p;
});
function frame(canvas){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(r.width*d)||canvas.height!==Math.round(r.height*d)){canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);}const c=canvas.getContext('2d'),scale=Math.min((r.width-20)/3,(r.height-20)/2);c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,r.width,r.height);c.fillStyle='#ffffff';c.fillRect(0,0,r.width,r.height);c.translate(r.width/2,r.height/2);c.scale(scale,scale);return{c,scale,w:r.width,h:r.height};}
function point(canvas,e){const r=canvas.getBoundingClientRect(),scale=Math.min((r.width-20)/3,(r.height-20)/2);return[(e.clientX-r.left-r.width/2)/scale,(e.clientY-r.top-r.height/2)/scale];}
function line(f,points,color=blue,width=1,dash=[]){const{c,scale}=f;c.save();c.strokeStyle=color;c.lineWidth=width/scale;c.setLineDash(dash.map(v=>v/scale));c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();c.restore();}
function dot(f,p,color=blue,r=3){const{c,scale}=f;c.fillStyle=color;c.beginPath();c.arc(...p,r/scale,0,Math.PI*2);c.fill();}
function text(f,label,p,color='#82909c',size=10){const{c,scale}=f;c.fillStyle=color;c.font=`${size/scale}px -apple-system,BlinkMacSystemFont,Arial,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(label,...p);}
function arrow(f,x,v,color=blue,width=1,factor=.32){const end=[x[0]+v[0]*factor,x[1]+v[1]*factor],l=Math.hypot(v[0],v[1]);if(l<1e-8){dot(f,x,color,2);return;}line(f,[x,end],color,width);const a=Math.atan2(v[1],v[0]),r=5/f.scale;line(f,[[end[0]-r*Math.cos(a-.5),end[1]-r*Math.sin(a-.5)],end,[end[0]-r*Math.cos(a+.5),end[1]-r*Math.sin(a+.5)]],color,width);}
function targets(f,m){const{c,scale}=f;c.save();c.strokeStyle='#dce6ed';c.lineWidth=.7/scale;const cell=m.cell||.22;for(const p of m.b)c.strokeRect(p[0]-cell/2,p[1]-cell/2,cell,cell);c.restore();}
function piece(f,m,i,p,selected=false,alpha=1){const{c,scale}=f;c.save();c.globalAlpha=alpha;c.translate(...p);c.fillStyle='#fff';c.fill(paths[i]);if(art.naturalWidth){c.save();c.clip(paths[i]);const sw=Math.min(art.naturalWidth,art.naturalHeight*4/3),sh=sw*3/4;c.drawImage(art,(art.naturalWidth-sw)/2,(art.naturalHeight-sh)/2,sw,sh,-.88-m.b[i][0],-.66-m.b[i][1],1.76,1.32);c.restore();}c.strokeStyle=selected?red:'rgba(255,255,255,.86)';c.lineWidth=(selected?2.4:.7)/scale;c.stroke(paths[i]);if(selected){c.strokeStyle=ink;c.lineWidth=.55/scale;c.stroke(paths[i]);}c.restore();}
let contourKey='',contourLines;
function heat(f,m,t,revision){
 // Density is encoded by nested lines; every pixel outside a line stays white.
 const key=revision+':'+t;if(key!==contourKey){contourKey=key;const nx=80,ny=54,values=[];let max=0;
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){const d=FlowMath.density(m,[i/nx*3-1.5,j/ny*2-1],t);values.push(d);max=Math.max(max,d);}
  contourLines=[.12,.3,.55,.8].map(frac=>{const lines=[],level=max*frac;
   for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
    const pos=[[i/nx*3-1.5,j/ny*2-1],[(i+1)/nx*3-1.5,j/ny*2-1],[(i+1)/nx*3-1.5,(j+1)/ny*2-1],[i/nx*3-1.5,(j+1)/ny*2-1]];
    const val=[values[j*(nx+1)+i],values[j*(nx+1)+i+1],values[(j+1)*(nx+1)+i+1],values[(j+1)*(nx+1)+i]],cross=[];
    for(let k=0;k<4;k++){const l=(k+1)%4;if((val[k]>=level)===(val[l]>=level))continue;const u=(level-val[k])/(val[l]-val[k]);cross.push(pos[k].map((x,d)=>x+u*(pos[l][d]-x)));}
    for(let k=0;k+1<cross.length;k+=2)lines.push([cross[k],cross[k+1]]);
   }return lines;
  });
 }
 const c=f.c;c.save();c.lineWidth=.8/f.scale;contourLines.forEach((segments,i)=>{c.strokeStyle=['#c9e5e2','#a7d3cf','#78b8b1','#4a978f'][i];c.beginPath();for(const[a,b]of segments){c.moveTo(...a);c.lineTo(...b);}c.stroke();});c.restore();
}
art.onload=()=>window.dispatchEvent(new Event('puzzlephotoload'));art.onerror=()=>window.dispatchEvent(new Event('puzzlephotoerror'));
window.PuzzleView={frame,point,line,dot,text,arrow,targets,piece,heat,blue,red,ink,get loaded(){return art.naturalWidth>0;}};
})();
