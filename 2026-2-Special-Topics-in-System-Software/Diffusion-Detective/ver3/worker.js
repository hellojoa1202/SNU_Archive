importScripts('model.js');
self.onmessage=({data:{id,seed,bias,window,steps}})=>{
 const M=LightMath,data=M.dataset(384,seed),result={};
 for(const kind of ['sde','ode']){const paths=M.solve(data,{kind,bias,window,steps});result[kind]={points:paths.map(p=>p.at(-1)),curve:M.errorCurve(paths)};}
 self.postMessage({id,result});
};
