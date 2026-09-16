const values=Object.create(null);
const bound=new Set();
export function bind(name,initial){
  values[name]=initial;
  if(bound.has(name))return initial;
  const d=Object.getOwnPropertyDescriptor(globalThis,name);
  if(d&&!d.configurable){globalThis[name]=initial;return initial;}
  Object.defineProperty(globalThis,name,{configurable:true,enumerable:false,get(){return values[name];},set(v){values[name]=v;}});
  bound.add(name);return initial;
}
export function get(name){return values[name];}
export function set(name,value){if(bound.has(name))globalThis[name]=value;else bind(name,value);return value;}
export function snapshot(keys=null){const out={};const list=keys||Object.keys(values);for(const k of list)out[k]=values[k];return out;}
export function has(name){return bound.has(name);}
export const store=values;
