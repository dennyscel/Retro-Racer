// GAMEPLAY RECOVERY C01 — persistência de contato player↔rival por par.
// Evita reimpactos durante STAY sem bloquear um novo ENTER contra outro rival.
const recoveryCollisionBaseUpdate = globalThis.update;
if(typeof recoveryCollisionBaseUpdate!=='function')throw new Error('Recovery collision: update ausente');

const contactPairs=new Set();
const baseOverlapFn=MathUtils.overlap.bind(MathUtils);

function liveContactIds(){
  const ids=new Set();
  if(!cars||!cars.length||!trackZLength)return ids;
  const pcp=playerProgress+playerZ;
  for(const car of cars){
    const dist=car.progress-pcp;
    if(dist>-80&&dist<260&&baseOverlapFn(playerX,.42,car.offset,.44,.82))ids.add(car.id);
  }
  return ids;
}
function carForCollisionOffset(x2){
  const pcp=playerProgress+playerZ;let best=null,bestD=Infinity;
  for(const car of cars){
    const dist=car.progress-pcp;if(dist<=-80||dist>=260)continue;
    const d=Math.abs(Number(car.offset)-Number(x2));
    if(d<bestD){bestD=d;best=car;}
  }
  return bestD<.02?best:null;
}
function isPlayerCollisionSignature(w1,w2,p){return Math.abs(w1-.42)<1e-9&&Math.abs(w2-.44)<1e-9&&Math.abs(p-.82)<1e-9;}
function currentDamageRecovery(){try{return Number(career.carDamage[currentCar().id]||0);}catch(e){return 0;}}
function setDamageRecovery(v){try{career.carDamage[currentCar().id]=MathUtils.limit(v,0,1);}catch(e){}}

globalThis.recoveryCollisionContacts=()=>new Set(contactPairs);
globalThis.recoveryCollisionReset=()=>contactPairs.clear();

globalThis.update=function recoveryCollisionUpdate(dt){
  const previous=new Set(contactPairs);
  // O recovery-runtime antigo usava cooldown global para STAY. A partir daqui, a filtragem é por par.
  if(globalThis.RRRecovery?.contacts?.active)RRRecovery.contacts.active.clear();

  const beforeSpeed=speed,beforeX=playerX,beforeDamage=currentDamageRecovery(),beforeCrashes=raceCrashes;
  const originalOverlap=MathUtils.overlap;
  MathUtils.overlap=function recoveryOverlap(x1,w1,x2,w2,p=1){
    if(isPlayerCollisionSignature(w1,w2,p)){
      const car=carForCollisionOffset(x2);
      if(car&&previous.has(car.id))return false; // STAY: sem novo impacto
    }
    return baseOverlapFn(x1,w1,x2,w2,p);
  };

  try{recoveryCollisionBaseUpdate(dt);}finally{MathUtils.overlap=originalOverlap;}

  const now=liveContactIds();
  contactPairs.clear();for(const id of now)contactPairs.add(id);

  // Corrige o caso antigo em que dois carros quase na mesma velocidade eram classificados
  // como batida forte apenas porque a velocidade absoluta do jogador era alta.
  if(raceCrashes>beforeCrashes){
    let enteredCar=null;
    for(const car of cars){if(now.has(car.id)&&!previous.has(car.id)){enteredCar=car;break;}}
    if(enteredCar){
      const rel=Math.max(0,(beforeSpeed-enteredCar.speed)/Math.max(1,maxSpeed));
      const lateral=Math.abs(beforeX-enteredCar.offset)>.27;
      const damageDelta=currentDamageRecovery()-beforeDamage;
      if(!lateral&&rel<.12&&damageDelta>.035){
        const armor=Math.max(.35,Number(calcMods().armor||1));
        setDamageRecovery(beforeDamage+.018/armor);
        speed=Math.max(speed,beforeSpeed*.90,enteredCar.speed*.82);
        impactFreeze=0;cameraShake=Math.min(cameraShake,.48);
        setRaceMessage('TOQUE · '+enteredCar.name,'#ffb52b',1.0);
      }
    }
  }
};
