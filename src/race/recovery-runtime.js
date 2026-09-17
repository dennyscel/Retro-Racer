// GAMEPLAY RECOVERY C01 — camada de contenção para contratos críticos sem reescrever a física-base.
// Carregada depois de physics.js: envolve update() e mantém os sistemas existentes compatíveis.
const baseUpdate = globalThis.update;
const basePollGamepad = globalThis.pollGamepad;
const baseUpdatePitHud = globalThis.updatePitHud;
if (typeof baseUpdate !== 'function') throw new Error('Recovery runtime: physics.update ausente');

const NitroState = Object.freeze({ CHARGING:'CHARGING', READY:'READY', FIRING:'FIRING', EMPTY:'EMPTY', LOCKED:'LOCKED' });
const PitState = Object.freeze({
  NONE:'PIT_NONE', ENTRY:'PIT_ENTRY', LANE:'PIT_LANE', ALIGN:'PIT_ALIGN',
  FUEL:'PIT_SERVICE_FUEL', REPAIR:'PIT_SERVICE_REPAIR', FINAL:'PIT_SERVICE_FINAL',
  RELEASE:'PIT_RELEASE', EXIT:'PIT_EXIT', REJOIN:'PIT_REJOIN'
});

const nitroSM={state:NitroState.READY,rawHeld:false,lastUseLap:0,activations:0};
const pitSM={state:PitState.NONE,timer:0,serviceFuelStart:0,serviceDamageStart:0,released:false};
const contactSM={active:new Set(),last:new Set()};
let lastCountdownActive=false;

function resetRecoveryRace(){
  nitroSM.state=nitro>=.9995?NitroState.READY:NitroState.CHARGING;
  nitroSM.rawHeld=false;nitroSM.lastUseLap=0;nitroSM.activations=0;
  pitSM.state=PitState.NONE;pitSM.timer=0;pitSM.serviceFuelStart=0;pitSM.serviceDamageStart=0;pitSM.released=false;
  contactSM.active.clear();contactSM.last.clear();
}
function currentDamage(){try{return Number(career.carDamage[currentCar().id]||0);}catch(e){return 0;}}
function setDamage(v){try{career.carDamage[currentCar().id]=MathUtils.limit(Number(v)||0,0,1);}catch(e){}}
function pitDisabled(){return !!(globalThis.riftPitDisabled&&riftPitDisabled());}
function pitBlocksControl(){return [PitState.ALIGN,PitState.FUEL,PitState.REPAIR,PitState.FINAL,PitState.RELEASE].includes(pitSM.state);}
function pitBlocksNitro(){return pitSM.state!==PitState.NONE&&pitSM.state!==PitState.REJOIN;}
function rawVirtual(){try{return globalThis.virtualState?virtualState():null;}catch(e){return null;}}
function captureInputs(){
  const v=rawVirtual();
  return {
    keys:{up:!!keys.ArrowUp,down:!!keys.ArrowDown,left:!!keys.ArrowLeft,right:!!keys.ArrowRight,nitro:!!keys.Nitro},
    touch:{active:!!touchDrive.active,brake:!!touchDrive.brake,nitro:!!touchDrive.nitro},
    pad:{steer:Number(gamepadIntent.steer||0),accel:!!gamepadIntent.accel,brake:!!gamepadIntent.brake,nitro:!!gamepadIntent.nitro},
    virtual:v?{ref:v,left:!!v.left,right:!!v.right,accel:!!v.accel,brake:!!v.brake,nitro:!!v.nitro}:null
  };
}
function restoreInputs(s){
  keys.ArrowUp=s.keys.up;keys.ArrowDown=s.keys.down;keys.ArrowLeft=s.keys.left;keys.ArrowRight=s.keys.right;keys.Nitro=s.keys.nitro;
  touchDrive.active=s.touch.active;touchDrive.brake=s.touch.brake;touchDrive.nitro=s.touch.nitro;
  gamepadIntent.steer=s.pad.steer;gamepadIntent.accel=s.pad.accel;gamepadIntent.brake=s.pad.brake;gamepadIntent.nitro=s.pad.nitro;
  if(s.virtual){const v=s.virtual.ref;v.left=s.virtual.left;v.right=s.virtual.right;v.accel=s.virtual.accel;v.brake=s.virtual.brake;v.nitro=s.virtual.nitro;}
}
function rawNitroPressed(s){return !!(s.keys.nitro||s.touch.nitro||s.pad.nitro||(s.virtual&&s.virtual.nitro));}
function rawBrakePressed(s){return !!(s.keys.down||s.touch.brake||s.pad.brake||(s.virtual&&s.virtual.brake));}
function forceInputs(s,nitroOn,lock){
  if(lock){keys.ArrowUp=false;keys.ArrowDown=false;keys.ArrowLeft=false;keys.ArrowRight=false;touchDrive.active=false;touchDrive.brake=false;gamepadIntent.steer=0;gamepadIntent.accel=false;gamepadIntent.brake=false;if(s.virtual){const v=s.virtual.ref;v.left=false;v.right=false;v.accel=false;v.brake=false;}}
  keys.Nitro=!!nitroOn;touchDrive.nitro=!!nitroOn;gamepadIntent.nitro=!!nitroOn;if(s.virtual)s.virtual.ref.nitro=!!nitroOn;
}
function currentPlayerSegment(){try{return getSegment(position+playerZ);}catch(e){return null;}}
function crewOnSegment(seg){return !!(seg&&Array.isArray(seg.decorations)&&seg.decorations.some(d=>d&&d.type==='pitCrew'));}
function pitEnterState(next){pitSM.state=next;pitSM.timer=0;}
function pitPre(seg){
  if(pitDisabled()){if(pitSM.state!==PitState.NONE)pitEnterState(PitState.NONE);return;}
  const onPit=!!(seg&&seg.pit),inLane=onPit&&playerX>.78;
  if(pitSM.state===PitState.NONE){if(inLane)pitEnterState(PitState.ENTRY);return;}
  if([PitState.ENTRY,PitState.LANE].includes(pitSM.state)&&!onPit){setRaceMessage('PIT ABORTADO','#ffcc00',.7);pitEnterState(PitState.NONE);return;}
  if(pitSM.state===PitState.ENTRY&&speed<maxSpeed*.28)pitEnterState(PitState.LANE);
  if(pitSM.state===PitState.LANE&&crewOnSegment(seg)&&speed<maxSpeed*.20)pitEnterState(PitState.ALIGN);
}
function pitPost(dt,seg,preFuel,preDamage){
  pitSM.timer+=dt;
  const cap=calcMods().fuelCapacity;
  switch(pitSM.state){
    case PitState.NONE: return;
    case PitState.ENTRY:
      speed=Math.min(speed,maxSpeed*.34);playerX=MathUtils.interpolate(playerX,Math.max(.86,playerX),Math.min(1,dt*3));
      pitServiceActive=false;pitServiceProgress=0;pitServiceDone=false;
      if(speed>=maxSpeed*.28)setRaceMessage('PIT · REDUZA A VELOCIDADE','#ffb52b',.28);
      return;
    case PitState.LANE:
      speed=Math.min(speed,maxSpeed*.23);playerX=MathUtils.interpolate(playerX,1.02,Math.min(1,dt*3.4));
      pitServiceActive=false;pitServiceProgress=.04;pitServiceDone=false;setRaceMessage('PIT LANE · PROCURE O BOX','#38d5ff',.24);return;
    case PitState.ALIGN:
      speed=MathUtils.interpolate(speed,0,Math.min(1,dt*9));playerX=MathUtils.interpolate(playerX,1.05,Math.min(1,dt*7));
      pitServiceActive=true;pitServiceProgress=.08;pitServiceDone=false;setRaceMessage('BOX · ALINHANDO','#ffcc00',.24);
      if(speed<maxSpeed*.012||pitSM.timer>.9){pitSM.serviceFuelStart=fuel;pitSM.serviceDamageStart=currentDamage();pitEnterState(PitState.FUEL);}
      return;
    case PitState.FUEL:{
      speed=0;playerX=1.05;pitServiceActive=true;pitServiceDone=false;
      fuel=MathUtils.limit(preFuel+dt*.68,0,cap);const denom=Math.max(.01,cap-pitSM.serviceFuelStart);const f=MathUtils.limit((fuel-pitSM.serviceFuelStart)/denom,0,1);pitServiceProgress=.12+f*.38;
      setRaceMessage('PIT · ABASTECENDO','#55ff88',.24);
      if(fuel>=cap-.005||pitSM.timer>2.4){fuel=cap;pitEnterState(PitState.REPAIR);}
      return;}
    case PitState.REPAIR:{
      speed=0;playerX=1.05;pitServiceActive=true;pitServiceDone=false;
      const repaired=Math.max(0,preDamage-dt*.22);setDamage(repaired);const start=Math.max(.001,pitSM.serviceDamageStart);const f=1-MathUtils.limit(repaired/start,0,1);pitServiceProgress=.52+f*.28;
      setRaceMessage(start>.01?'PIT · REPARANDO':'PIT · CHECAGEM MECÂNICA','#55ff88',.24);
      if(repaired<=.005||pitSM.timer>3.2){setDamage(0);pitEnterState(PitState.FINAL);}
      return;}
    case PitState.FINAL:
      speed=0;playerX=1.05;pitServiceActive=true;pitServiceDone=false;pitServiceProgress=.88+MathUtils.limit(pitSM.timer/.75,0,1)*.08;setRaceMessage('PIT · AJUSTE FINAL','#38d5ff',.24);
      if(pitSM.timer>=.75)pitEnterState(PitState.RELEASE);return;
    case PitState.RELEASE:
      speed=0;playerX=1.05;pitServiceActive=true;pitServiceProgress=1;pitServiceDone=true;setRaceMessage('PIT · LIBERADO · GO!','#55ff55',.35);
      if(!pitSM.released){pitSM.released=true;racePits++;career.stats.pits=(career.stats.pits||0)+1;try{saveCareer();}catch(e){};if(globalThis.raceRadioEvent)raceRadioEvent('pitPerfect');}
      if(pitSM.timer>=.38)pitEnterState(PitState.EXIT);return;
    case PitState.EXIT:
      pitServiceActive=false;pitServiceProgress=1;pitServiceDone=true;if(seg&&seg.pit){speed=Math.min(speed,maxSpeed*.28);playerX=Math.max(playerX,.78);setRaceMessage('PIT EXIT · LIMITE DE VELOCIDADE','#ffcc00',.24);}else pitEnterState(PitState.REJOIN);return;
    case PitState.REJOIN:
      pitServiceActive=false;pitServiceProgress=0;pitServiceDone=false;if(pitSM.timer>.55){pitSM.released=false;pitEnterState(PitState.NONE);}return;
  }
}
function nitroPre(raw,blocked){
  const infinite=!!(globalThis.riftNitroInfinite&&riftNitroInfinite());if(infinite){nitroSM.rawHeld=raw;return raw;}
  const rising=raw&&!nitroSM.rawHeld;nitroSM.rawHeld=raw;
  if(nitroSM.state===NitroState.EMPTY)nitroSM.state=NitroState.LOCKED;
  if(nitro<.9995&&nitroSM.state===NitroState.READY)nitroSM.state=NitroState.CHARGING;
  if(nitro>=.9995){nitro=1;if([NitroState.CHARGING,NitroState.LOCKED,NitroState.EMPTY].includes(nitroSM.state)&&!raw)nitroSM.state=NitroState.READY;}
  if(nitroSM.state===NitroState.FIRING&&blocked){nitro=0;nitroSM.state=NitroState.LOCKED;setRaceMessage('NITRO INTERROMPIDO','#ffb52b',.65);return false;}
  const careerLimit=raceContext&&raceContext.mode==='career'&&nitroSM.lastUseLap===currentLap;
  if(rising&&nitroSM.state===NitroState.READY&&!blocked&&!careerLimit){nitroSM.state=NitroState.FIRING;nitroSM.lastUseLap=currentLap;nitroSM.activations++;setRaceMessage('NITRO · CARGA TOTAL','#38d5ff',.55);}
  return nitroSM.state===NitroState.FIRING;
}
function nitroPost(dt,before,raw,beforeRank,seg,braking){
  if(globalThis.riftNitroInfinite&&riftNitroInfinite())return;
  const blocked=pitBlocksNitro()||countdownActive||impactFreeze>0||finished||gameOver||fuel<=.01;
  if(nitroSM.state===NitroState.FIRING){
    if(blocked){nitro=0;nitroSM.state=NitroState.LOCKED;return;}
    nitro=Math.max(0,before-dt*.25);
    if(nitro<=.0001){nitro=0;nitroSM.state=NitroState.LOCKED;setRaceMessage('NITRO ESGOTADO','#ffcc00',.55);}
    return;
  }
  // Retira apenas a recarga passiva do physics.js; preserva ganhos de vácuo, volta limpa e outros eventos.
  const passive=dt*(speed<maxSpeed*.38?.028:.012);if(nitro>before)nitro=Math.max(before,nitro-passive);
  const roadEdge=seg?MathUtils.limit(seg.roadScale||1,.72,1.28):1;const cleanCurve=seg&&Math.abs(seg.curve||0)>.65&&Math.abs(playerX)<roadEdge*.93&&speed>maxSpeed*.34&&!braking;
  if(cleanCurve)nitro=MathUtils.limit(nitro+dt*.022*Math.min(1.4,Math.abs(seg.curve)/2),0,1);
  if(Number.isFinite(beforeRank)&&Number.isFinite(lastRacePosition)&&lastRacePosition<beforeRank)nitro=MathUtils.limit(nitro+.055*Math.min(2,beforeRank-lastRacePosition),0,1);
  if(nitro>=.9995){nitro=1;if(!raw)nitroSM.state=NitroState.READY;else if(nitroSM.state!==NitroState.READY)nitroSM.state=NitroState.LOCKED;}
  else if(nitroSM.state!==NitroState.LOCKED)nitroSM.state=NitroState.CHARGING;
}
function computeContacts(){
  const out=new Set();if(!cars||!cars.length||!trackZLength)return out;const pcp=playerProgress+playerZ;
  for(const car of cars){const dist=car.progress-pcp;if(dist>-80&&dist<260&&MathUtils.overlap(playerX,.42,car.offset,.44,.82))out.add(car.id);}
  return out;
}
function contactPre(){
  const now=computeContacts();let continuing=false;for(const id of now)if(contactSM.active.has(id)){continuing=true;break;}
  if(continuing)playerCollisionCooldown=Math.max(playerCollisionCooldown,.12);
  contactSM.last=now;
}
function contactPost(){contactSM.active=computeContacts();}

const pitStageLabel={
  [PitState.ENTRY]:'ENTRADA',[PitState.LANE]:'PIT LANE',[PitState.ALIGN]:'ALINHANDO',[PitState.FUEL]:'ABASTECENDO',
  [PitState.REPAIR]:'REPARANDO',[PitState.FINAL]:'AJUSTE FINAL',[PitState.RELEASE]:'LIBERANDO',[PitState.EXIT]:'PIT EXIT',[PitState.REJOIN]:'REENTRADA'
};
if(typeof baseUpdatePitHud==='function')globalThis.updatePitHud=function recoveryPitHud(){baseUpdatePitHud();if(globalThis.pitStageText&&pitSM.state!==PitState.NONE)pitStageText.textContent=pitStageLabel[pitSM.state]||pitSM.state;};

globalThis.recoveryResetRaceSystems=resetRecoveryRace;
globalThis.recoveryPitState=()=>pitSM.state;
globalThis.recoveryNitroState=()=>nitroSM.state;
globalThis.recoveryPitLocksControl=pitBlocksControl;
globalThis.recoveryPitBlocksNitro=pitBlocksNitro;
globalThis.RRRecovery={NitroState,PitState,nitro:nitroSM,pit:pitSM,contacts:contactSM};

globalThis.update=function recoveryUpdate(dt){
  if(countdownActive&&!lastCountdownActive)resetRecoveryRace();lastCountdownActive=!!countdownActive;
  if(typeof basePollGamepad==='function')try{basePollGamepad();}catch(e){}
  const input=captureInputs(),rawNitro=rawNitroPressed(input),rawBrake=rawBrakePressed(input),segBefore=currentPlayerSegment();
  pitPre(segBefore);contactPre();
  const nitroBefore=nitro,fuelBefore=fuel,damageBefore=currentDamage(),rankBefore=lastRacePosition;
  const blockedNitro=countdownActive||pitBlocksNitro()||impactFreeze>0||finished||gameOver||fuel<=.01;
  const nitroForce=nitroPre(rawNitro,blockedNitro),lock=pitBlocksControl();
  forceInputs(input,nitroForce,lock);
  const savedPoll=globalThis.pollGamepad;globalThis.pollGamepad=()=>{};
  try{baseUpdate(dt);}finally{globalThis.pollGamepad=savedPoll;restoreInputs(input);}
  const segAfter=currentPlayerSegment();pitPost(dt,segAfter,fuelBefore,damageBefore);nitroPost(dt,nitroBefore,rawNitro,rankBefore,segAfter,rawBrake);contactPost();
};
