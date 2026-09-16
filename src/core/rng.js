function hashSeed(input){let h=2166136261>>>0;const s=String(input);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function mulberry32(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export class RngHub{
  constructor(seed='retro-racer'){this.beginRace(seed);}
  beginRace(seed){this.seed=String(seed);this.channels=new Map();return this.seed;}
  random(channel='sim'){if(!this.channels.has(channel))this.channels.set(channel,mulberry32(hashSeed(`${this.seed}|${channel}`)));return this.channels.get(channel)();}
  int(max,channel='sim'){return Math.floor(this.random(channel)*Math.max(1,max));}
  pick(list,channel='sim'){return list&&list.length?list[this.int(list.length,channel)]:undefined;}
  fork(label){return mulberry32(hashSeed(`${this.seed}|${label}`));}
}
export function deterministicSequence(seed,count=8){const r=new RngHub(seed);return Array.from({length:count},()=>r.random('test'));}
