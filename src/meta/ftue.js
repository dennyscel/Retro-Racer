// OURO 2 — primeiro contato dirigível: sem texto, sem menu e sem resetar saves existentes.
const ftueState={active:false,phase:'idle',elapsed:0,handoff:0,firstOvertake:false,firstOvertakeAt:null,maxSteer:0,leadName:'NOVA'};
function freshCareer(){return career.level===1&&(career.stats.starts||0)===0&&(career.stats.races||0)===0&&!career.flags.ftueComplete;}
function clearFtueUi(){document.body.classList.remove('ftue-prologue','ftue-transition');const r=document.getElementById('radioHud');if(r)r.classList.remove('show');}
function placePrologueLead(){
  const lead=cars.find(c=>c.name===ftueState.leadName)||cars[0];
  if(!lead)return;
  lead.progress=playerZ+2200;lead.z=posMod(lead.progress,trackZLength);lead.offset=-.08;lead.laneBias=-.08;lead.originalOffset=-.08;
  lead.baseSpeed=maxSpeed*.235;lead.speed=lead.baseSpeed;lead.previousSpeed=lead.speed;lead.aiStyle='balanced';lead.aggression=.82;lead.curveSkill=1;lead.straightSkill=.94;
  cars=[lead];totalRacersDisplay.innerText='2';posDisplay.innerText='2';lastRacePosition=2;
}
function primeFirstRaceOvertake(){
  const target=cars.find(c=>c.name==='REX')||cars[1]||cars[0];if(!target)return;
  target.progress=playerZ+760;target.z=posMod(target.progress,trackZLength);target.offset=MathUtils.limit(playerX+.52,-.72,.72);target.laneBias=target.offset;
  target.baseSpeed=maxSpeed*.405;target.speed=target.baseSpeed;target.previousSpeed=target.speed;target.aiStyle='balanced';target.aggression=.82;
}
globalThis.shouldRunFtue=function shouldRunFtue(){return freshCareer();};
globalThis.isFtuePrologue=function isFtuePrologue(){return ftueState.phase==='prologue';};
globalThis.isFtueSilent=function isFtueSilent(){return ftueState.phase==='prologue';};
globalThis.ftueAutoAccel=function ftueAutoAccel(){return ftueState.phase==='prologue'||ftueState.phase==='handoff';};
globalThis.ftueMarkOvertake=function ftueMarkOvertake(){if(!ftueState.active||ftueState.firstOvertake)return;ftueState.firstOvertake=true;ftueState.firstOvertakeAt=ftueState.phase==='prologue'?ftueState.elapsed:8+totalRaceTime;};
globalThis.startFtuePrologue=function startFtuePrologue(){
  if(!freshCareer())return false;
  raceContext={mode:'career',selectedLevel:1,replay:false,laps:5,dailySeed:null,ghost:false,boss:false,insurance:false};raceLevel=1;totalLaps=5;gameMode='race';gamePaused=false;finished=false;gameOver=false;raceAwarded=false;finalRankingLocked=false;
  window.RRCore.rng.beginRace('ftue|1');buildTrack();resetRaceStateOnly();initCars();placePrologueLead();
  playerX=-.16;speed=maxSpeed*.255;position=0;raceStarted=false;countdownActive=false;countdownTimer=0;countdownText='';raceMessage='';raceMessageTimer=0;touchHint.classList.add('hidden');
  if(globalThis.telemetryEvent)telemetryEvent('ftue_step',{step:'prologue_start'});ftueState.active=true;ftueState.phase='prologue';ftueState.elapsed=0;ftueState.handoff=0;ftueState.firstOvertake=false;ftueState.firstOvertakeAt=null;ftueState.maxSteer=0;
  showMenu(null);document.body.classList.add('ftue-prologue');applyUiSettings();return true;
};
globalThis.launchFtueFirstRace=function launchFtueFirstRace(){
  if(ftueState.phase!=='prologue')return false;const carryX=playerX;
  document.body.classList.remove('ftue-prologue');document.body.classList.add('ftue-transition');
  career.flags.ftueComplete=true;career.flags.ftuePrologueSeen=true;if(globalThis.telemetryEvent)telemetryEvent('ftue_step',{step:'handoff_8s'});saveCareer();
  raceContext={mode:'career',selectedLevel:1,replay:false,laps:5,dailySeed:null,ghost:false,boss:false,insurance:false};
  startRace();countdownActive=false;countdownTimer=0;countdownText='';goFlashTimer=0;raceStarted=true;career.stats.starts=(career.stats.starts||0)+1;
  playerX=MathUtils.limit(carryX*.55,-.72,.72);speed=maxSpeed*.50;raceMessage='';raceMessageTimer=0;touchHint.classList.add('hidden');primeFirstRaceOvertake();lastRacePosition=cars.length+1;saveCareer();
  ftueState.phase='handoff';ftueState.handoff=2.35;setTimeout(()=>document.body.classList.remove('ftue-transition'),260);return true;
};
globalThis.updateFtue=function updateFtue(dt){
  if(ftueState.phase==='prologue'){
    ftueState.elapsed+=dt;ftueState.maxSteer=Math.max(ftueState.maxSteer,Math.abs(playerX+.16));
    const lead=cars[0],pcp=playerProgress+playerZ;if(lead&&pcp>lead.progress+40)ftueMarkOvertake();
    if(ftueState.elapsed>=8){launchFtueFirstRace();return true;}return false;
  }
  if(ftueState.phase==='handoff'){
    ftueState.handoff=Math.max(0,ftueState.handoff-dt);if(ftueState.handoff<=0){ftueState.phase='idle';ftueState.active=false;if(globalThis.telemetryEvent)telemetryEvent('ftue_step',{step:'first_race_control'});clearFtueUi();}
  }
  return false;
};
window.RRFTUE={state:ftueState,shouldRun:shouldRunFtue,start:startFtuePrologue,snapshot:()=>({...ftueState,careerStarts:career.stats.starts,careerRaces:career.stats.races,flag:!!career.flags.ftueComplete,mode:gameMode,level:raceLevel,speed:+speed.toFixed(2),playerX:+playerX.toFixed(3),cars:cars.length})};
