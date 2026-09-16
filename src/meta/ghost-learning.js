// OURO 5 — GHOST aprende o jogador 100% offline. Telemetria agregada, sem dado pessoal.
const learn={time:0,lastBrake:false,lastNitro:false,lightLead:0,lightN:0,midLead:0,midN:0,hairLead:0,hairN:0,brakeSpeed:0,brakeN:0,slipSeconds:0,offroadSeconds:0,collisions:0,overtakes:0,nitroPoint:0,nitroN:0,lineBias:0,lineSamples:0};
function resetLearn(){for(const k in learn){if(typeof learn[k]==='boolean')learn[k]=false;else learn[k]=0;}}
function ema(oldV,newV,races,weight=.24){return races<=0?newV:oldV*(1-weight)+newV*weight;}
function curveClass(strength){return strength>2.15?'hairpin':strength>.72?'medium':'light';}

globalThis.ghostLearningStart=function ghostLearningStart(){resetLearn();};
globalThis.ghostLearnEvent=function ghostLearnEvent(type,value=1){if(type==='collision')learn.collisions+=value;else if(type==='overtake')learn.overtakes+=value;else if(type==='offroad')learn.offroadSeconds+=value;};
globalThis.ghostLearningObserve=function ghostLearningObserve(dt,playerSeg,steerIntent,isBrake,nitroRequested){
  if(gameMode!=='race'||!raceStarted||finished||gameOver||!playerSeg)return;
  learn.time+=dt;const sp=MathUtils.limit(speed/maxSpeed,0,1.2);learn.lineBias+=playerX;learn.lineSamples++;
  if(isBrake&&!learn.lastBrake){const hint=lastCurveHint||getNextCurveHint(),cl=curveClass(hint.strength||Math.abs(playerSeg.curve||0)),lead=MathUtils.limit(Number(hint.distance||14),1,20);if(cl==='hairpin'){learn.hairLead+=lead;learn.hairN++;}else if(cl==='medium'){learn.midLead+=lead;learn.midN++;}else{learn.lightLead+=lead;learn.lightN++;}learn.brakeSpeed+=sp;learn.brakeN++;}
  const slip=Math.max(Math.abs(steerIntent)*sp,Math.abs(playerSeg.curve||0)*sp*.22);if(sp>.45&&slip>.58)learn.slipSeconds+=dt;
  if(nitroRequested&&!learn.lastNitro){learn.nitroPoint+=MathUtils.percentRemaining(playerProgress+playerZ,Math.max(1,trackZLength));learn.nitroN++;}
  learn.lastBrake=!!isBrake;learn.lastNitro=!!nitroRequested;
};

globalThis.ghostLearningFinish=function ghostLearningFinish(){
  if(learn.time<8)return career.ghostProfile;const p=career.ghostProfile,r=Number(p.races||0);
  if(learn.lightN)p.braking.light=ema(Number(p.braking.light||10),learn.lightLead/learn.lightN,r);
  if(learn.midN)p.braking.medium=ema(Number(p.braking.medium||10),learn.midLead/learn.midN,r);
  if(learn.hairN)p.braking.hairpin=ema(Number(p.braking.hairpin||11),learn.hairLead/learn.hairN,r);
  if(learn.brakeN)p.brakeSpeed=ema(Number(p.brakeSpeed||.62),learn.brakeSpeed/learn.brakeN,r);
  const slipRate=MathUtils.limit(learn.slipSeconds/Math.max(1,learn.time)*5,0,1);p.slipTolerance=ema(Number(p.slipTolerance||.45),.30+slipRate*.65,r);
  const aggr=MathUtils.limit(.36+learn.overtakes*.055-learn.collisions*.035, .22,.94);p.aggression=ema(Number(p.aggression||.5),aggr,r);
  if(learn.nitroN)p.nitroPoint=ema(Number(p.nitroPoint||.5),learn.nitroPoint/learn.nitroN,r);
  p.lineBias=ema(Number(p.lineBias||0),learn.lineBias/Math.max(1,learn.lineSamples),r);
  p.errors.offroad=ema(Number(p.errors.offroad||0),learn.offroadSeconds,r);p.errors.collisions=ema(Number(p.errors.collisions||0),learn.collisions,r);
  p.races=r+1;p.lastRace={overtakes:learn.overtakes,collisions:learn.collisions,offroad:Number(learn.offroadSeconds.toFixed(2)),nitroStarts:learn.nitroN};
  p.dominantError=p.errors.offroad>Math.max(1,p.errors.collisions*.9)?'SAÍDA DE PISTA':p.errors.collisions>.75?'CONTATO':'FRENAGEM CEDO';
  p.lastInsight=ghostProfileInsight(p);career.flags.c05GhostLearns=true;saveCareer();return p;
};

globalThis.getGhostLearnedTune=function getGhostLearnedTune(){const p=career.ghostProfile||defaultCareer.ghostProfile,r=Number(p.races||0),bonus=Math.min(.04,.018+r*.0015);return{speedBonus:bonus,lineBias:MathUtils.limit(Number(p.lineBias||0),-.72,.72),aggression:MathUtils.limit(Number(p.aggression||.5)+.04,.30,1),curveConfidence:MathUtils.limit(.96+(Number(p.slipTolerance||.45)-.45)*.045,.94,1.01),nitroPoint:MathUtils.limit(Number(p.nitroPoint||.5),.08,.92),races:r};};

globalThis.ghostProfileInsight=function ghostProfileInsight(p=career.ghostProfile){
  if(!p||!p.races)return 'AINDA NÃO TENHO DADOS. CORRA E EU VOU APRENDER.';
  if(Number(p.braking.hairpin||0)>=11.5)return `VOCÊ FREIA CEDO NAS HAIRPINS · ${Number(p.braking.hairpin).toFixed(1)} SEGMENTOS.`;
  if(Number(p.nitroPoint||.5)>.62)return `VOCÊ GUARDA NITRO PARA O FIM DA VOLTA · ${Math.round(p.nitroPoint*100)}%.`;
  if(p.dominantError==='SAÍDA DE PISTA')return `SEU ERRO MAIS CARO É A SAÍDA DE PISTA · ${Number(p.errors.offroad||0).toFixed(1)}s.`;
  if(Number(p.aggression||0)>.68)return `VOCÊ ATACA CEDO. EU ATACO 4% MELHOR.`;
  return `EU JÁ LI ${p.races} CORRIDA${p.races===1?'':'S'} SUA${p.races===1?'':'S'}. SUA LINHA NÃO É MAIS SEGREDO.`;
};

globalThis.ghostRadioLine=function ghostRadioLine(){const s=ghostProfileInsight();return 'GHOST: '+s.replace(/ ·.*$/,'').slice(0,58);};

globalThis.openGhostDossier=function openGhostDossier(){
  const p=career.ghostProfile,t=getGhostLearnedTune();gameMode='ghost';
  document.getElementById('ghostDossierLead').textContent=ghostProfileInsight(p);
  document.getElementById('ghostDossierRaces').textContent=String(p.races||0);
  document.getElementById('ghostDossierHairpin').textContent=(Number(p.braking.hairpin||0)).toFixed(1)+' seg';
  document.getElementById('ghostDossierNitro').textContent=Math.round(Number(p.nitroPoint||.5)*100)+'% da volta';
  document.getElementById('ghostDossierAggro').textContent=Math.round(Number(p.aggression||.5)*100)+'%';
  document.getElementById('ghostDossierSlip').textContent=Math.round(Number(p.slipTolerance||.45)*100)+'%';document.getElementById('ghostDossierErrorMirror').textContent=p.dominantError||'SEM DADOS';
  document.getElementById('ghostDossierBonus').textContent='+'+Math.round(t.speedBonus*1000)/10+'%';
  for(const [id,val] of [['ghostBarBrake',MathUtils.limit((14-Number(p.braking.hairpin||11))/8,0,1)],['ghostBarAggro',Number(p.aggression||.5)],['ghostBarSlip',Number(p.slipTolerance||.45)],['ghostBarNitro',Number(p.nitroPoint||.5)]]){const el=document.getElementById(id);if(el)el.style.width=Math.round(MathUtils.limit(val,0,1)*100)+'%';}
  showMenu('ghost');
};
window.RRGhostLearning={snapshot(){return{race:{...learn},profile:structuredClone(career.ghostProfile),tune:getGhostLearnedTune(),insight:ghostProfileInsight()};},reset:resetLearn};
