importScripts('model.js');
// Keep the initial samples/noise for the active seed and three recent experiments.
// Cached frames are cloned when posted, so revisiting a setting needs no solve.
let cachedSeed=null,data=null;
const cache=new Map();
self.onmessage=({data:{id,seed,bias,window,steps}})=>{
 const M=LightMath,key=JSON.stringify([seed,bias,window,steps]);
 if(cache.has(key)){
  const result=cache.get(key);cache.delete(key);cache.set(key,result);
  self.postMessage({id,result,config:{seed,bias,window,steps},cached:true});return;
 }
 if(seed!==cachedSeed){data=M.dataset(384,seed);cachedSeed=seed;cache.clear();}
 const result={};
 for(const kind of ['sde','ode'])result[kind]=M.pack(M.solve(data,{kind,bias,window,steps}));
 cache.set(key,result);while(cache.size>3)cache.delete(cache.keys().next().value);
 self.postMessage({id,result,config:{seed,bias,window,steps},cached:false});
};
