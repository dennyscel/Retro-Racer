// C11 — Licenças Horizonte: onboarding como conteúdo curto, usando a física real.
const MEDAL_ORDER={none:0,bronze:1,silver:2,gold:3};
const TYPE_META={
  curve:{code:'C',name:'CURVA LIMPA',icon:'↪',verb:'Fique no asfalto'},
  overtake:{code:'U',name:'ULTRAPASSAGEM',icon:'⚡',verb:'Ganhe posições'},
  draft:{code:'V',name:'VÁCUO',icon:'💨',verb:'Mantenha o vácuo'},
  pit:{code:'P',name:'PIT STOP',icon:'⛽',verb:'Complete o serviço'}
};
function levelFor(type,i){const base={curve:1,overtake:10,draft:20,pit:5}[type];const step={curve:7,overtake:11,draft:13,pit:17}[type];return 1+((base+i*step-1)%999);}
function makeLicense(type,i){
  const m=TYPE_META[type],id=`${m.code}-${String(i+1).padStart(2,'0')}`,level=levelFor(type,i);
  if(type==='curve')return{id,type,index:i,level,title:`${m.icon} ${m.name}`,duration:24+(i%4)*2,target:.15,desc:`${m.verb} por ${24+(i%4)*2}s. Ouro: sem batida e quase zero off-road.`};
  if(type==='overtake'){const target=2+Math.floor(i/5);return{id,type,index:i,level,title:`${m.icon} ${m.name}`,duration:26+(i%3)*2,target,desc:`${m.verb}: ultrapasse ${target} rival${target>1?'es':''} antes do tempo.`};}
  if(type==='draft'){const target=4.5+(i%5)*.6;return{id,type,index:i,level,title:`${m.icon} ${m.name}`,duration:24+(i%4)*2,target:+target.toFixed(1),desc:`${m.verb} por ${target.toFixed(1)}s atrás do rival.`};}
  const duration=24+(i%4)*2;return{id,type,index:i,level,title:`${m.icon} ${m.name}`,duration,target:1,desc:`${m.verb} entrando devagar à direita. Ouro exige serviço rápido.`};
}
export const LICENSES=['curve','overtake','draft','pit'].flatMap(type=>Array.from({length:15},(_,i)=>makeLicense(type,i)));
let active=null,lastUiSecond=-1;
function defById(id){return LICENSES.find(x=>x.id===id)||LICENSES[0];}
function medalIcon(m){return m==='gold'?'🥇':m==='silver'?'🥈':m==='bronze'?'🥉':'·';}
function goldCount(){return Object.values(career.licenses?.medals||{}).filter(v=>v==='gold').length;}
globalThis.licenseCurrentDef=function licenseCurrentDef(){return activeDef();};
function activeDef(){return defById(raceContext?.licenseId||career.licenses?.activeId);}
function curveSegment(){let best=null,bestAbs=0;for(const s of segments){const a=Math.abs(s.curve||0);if(a>bestAbs){best=s;bestAbs=a;}}return best;}
function straightSegment(){for(const s of segments)if(Math.abs(s.curve||0)<.12&&s.index>20)return s;return segments[20]||segments[0];}
function movePlayerBefore(seg,count=6){if(!seg)return;playerProgress=Math.max(0,(seg.index-count)*segmentLength-playerZ);position=posMod(playerProgress,trackZLength);}
function restoreCareerNoise(){if(!active)return;career.carDamage[active.carId]=active.startDamage;career.stats.crashes=active.statsCrashes;career.stats.pits=active.statsPits;}
function updateGoldCount(){career.licenses.goldCount=goldCount();}
function unlockText(){const g=goldCount(),milestones=[[5,'Firefly'],[15,'Nightshade'],[30,'Duna'],[45,'Avalanche'],[60,'Pulse']];const next=milestones.find(x=>g<x[0]);return next?`PRÓXIMO CARRO: ${next[1].toUpperCase()} · ${g}/${next[0]} OUROS`:'TODOS OS DESBLOQUEIOS DE LICENÇA CONCLUÍDOS';}
function renderMenu(){
  updateGoldCount();const grid=document.getElementById('licensesGrid'),sum=document.getElementById('licenseSummary'),last=document.getElementById('licenseLastResult');if(!grid)return;
  sum.textContent=`${career.licenses.goldCount}/60 OUROS · ${unlockText()}`;last.textContent=career.licenses.lastResult||'Escolha uma licença.';grid.innerHTML='';
  for(const d of LICENSES){const medal=career.licenses.medals[d.id]||'none',c=document.createElement('button');c.className='license-card';c.innerHTML=`<span class="lic-id">${d.id} · FASE ${String(d.level).padStart(3,'0')}</span><span class="lic-medal">${medalIcon(medal)}</span><b>${d.title}</b><small>${d.desc}</small>`;c.onclick=()=>licenseSelect(d.id);grid.appendChild(c);}
}
function medalFor(d){
  if(!active)return'none';
  if(d.type==='curve'){if(active.crashes===0&&active.offroad<=.15)return'gold';if(active.crashes<=1&&active.offroad<=.65)return'silver';if(active.offroad<=1.5)return'bronze';return'none';}
  if(d.type==='overtake'){if(active.bestPass>=d.target)return'gold';if(active.bestPass>=Math.max(1,d.target-1))return'silver';if(active.bestPass>=1)return'bronze';return'none';}
  if(d.type==='draft'){if(active.draft>=d.target)return'gold';if(active.draft>=d.target*.70)return'silver';if(active.draft>=d.target*.45)return'bronze';return'none';}
  if(active.pitDone){const goldLimit=8.5+d.index*.05;if(active.pitTime<=goldLimit)return'gold';if(active.pitTime<=14)return'silver';return'bronze';}return'none';
}
function metricText(d){if(!active)return'';if(d.type==='curve')return`OFF ${active.offroad.toFixed(1)}s · BAT ${active.crashes}`;if(d.type==='overtake')return`${active.bestPass}/${d.target} PASS`;if(d.type==='draft')return`${active.draft.toFixed(1)}/${d.target.toFixed(1)}s`;return active.pitDone?`PIT ${active.pitTime.toFixed(1)}s`:'PROCURE O PIT →';}
function finishLicense(reason='TEMPO'){
  if(!active||active.done)return;active.done=true;const d=active.def,medal=medalFor(d),old=career.licenses.medals[d.id]||'none';restoreCareerNoise();career.licenses.attempts=(career.licenses.attempts||0)+1;if(MEDAL_ORDER[medal]>MEDAL_ORDER[old])career.licenses.medals[d.id]=medal;updateGoldCount();career.licenses.lastResult=`${d.id} · ${medal==='none'?'SEM MEDALHA':medal.toUpperCase()} · ${metricText(d)} · ${reason}`;career.flags.c11Licenses=true;saveCareer();
  finished=true;raceStarted=false;gamePaused=false;fadeAudioOut();playSFX(medal==='none'?'fail':'win');const hud=document.getElementById('licenseHud');if(hud)hud.classList.add('hidden');setRaceMessage(medal==='gold'?'LICENÇA OURO!':medal==='silver'?'LICENÇA PRATA!':medal==='bronze'?'LICENÇA BRONZE!':'LICENÇA NÃO CONCLUÍDA',medal==='none'?'#ff4b4b':'#ffcc00',1.3);setTimeout(()=>openLicenses(),550);
}
globalThis.openLicenses=function openLicenses(){gameMode='licenses';active=null;renderMenu();showMenu('licenses');};
globalThis.licenseSelect=function licenseSelect(id){const d=defById(id);career.licenses.activeId=id;raceContext={mode:'license',selectedLevel:d.level,replay:false,laps:1,licenseId:id,insurance:false};openPreRace(d.level,'license');};
globalThis.licensePreRaceText=function licensePreRaceText(){const d=activeDef();return`${d.id} · ${d.desc} · ${d.duration}s`;};
globalThis.licenseRaceStart=function licenseRaceStart(){
  if(raceContext.mode!=='license')return;const d=activeDef();active={def:d,elapsed:0,draft:0,bestPass:0,pitDone:false,pitTime:0,done:false,warm:false,startRank:1,startOffroad:raceOffroadSeconds,startCrashes:raceCrashes,startPits:racePits,offroad:0,crashes:0,carId:currentCar().id,startDamage:Number(career.carDamage[currentCar().id]||0),statsCrashes:career.stats.crashes||0,statsPits:career.stats.pits||0};
  runtimeWeather=null;dynamicWeatherArmed=false;totalLaps=1;raceInsurance=false;if(d.type==='curve'){cars=[];movePlayerBefore(curveSegment(),8);totalRacersDisplay.textContent='1';}
  else if(d.type==='overtake'){cars=cars.slice(0,5);const base=playerZ+850;cars.forEach((c,i)=>{c.progress=base+i*480;c.z=posMod(c.progress,trackZLength);c.offset=[-.42,.36,-.12,.52,.08][i];c.laneBias=c.offset;c.baseSpeed=maxSpeed*(.54+i*.012);c.speed=c.baseSpeed;});active.startRank=6;lastRacePosition=6;totalRacersDisplay.textContent='6';movePlayerBefore(straightSegment(),4);}
  else if(d.type==='draft'){cars=cars.slice(0,1);const lead=cars[0];movePlayerBefore(straightSegment(),4);lead.progress=playerProgress+playerZ+820;lead.z=posMod(lead.progress,trackZLength);lead.offset=0;lead.laneBias=0;lead.baseSpeed=maxSpeed*.68;lead.speed=lead.baseSpeed;active.startRank=2;lastRacePosition=2;totalRacersDisplay.textContent='2';playerX=0;}
  else {cars=[];const pit=segments.find(s=>s.pit)||segments[Math.floor(segments.length*.25)];movePlayerBefore(pit,6);playerX=.12;totalRacersDisplay.textContent='1';}
  const hud=document.getElementById('licenseHud');if(hud){hud.classList.remove('hidden');document.getElementById('licenseHudTitle').textContent=d.id+' · '+TYPE_META[d.type].name;document.getElementById('licenseHudMetric').textContent='PRONTO';document.getElementById('licenseHudTimer').textContent=d.duration.toFixed(1);}
};
globalThis.licenseTick=function licenseTick(dt,curPos){
  if(raceContext.mode!=='license'||!active||active.done||!raceStarted||finished||gameOver)return;const d=active.def;active.elapsed+=dt;if(!active.warm){active.warm=true;speed=Math.max(speed,maxSpeed*(d.type==='pit'?.42:.52));if(d.type==='pit')setRaceMessage('PIT À DIREITA · ENTRE DEVAGAR','#ffcc00',1.7);else setRaceMessage(d.desc,'#38d5ff',1.7);}
  active.offroad=Math.max(0,raceOffroadSeconds-active.startOffroad);active.crashes=Math.max(0,raceCrashes-active.startCrashes);if(d.type==='overtake')active.bestPass=Math.max(active.bestPass,active.startRank-curPos);if(d.type==='draft'&&draftBoost>.35)active.draft+=dt;if(d.type==='pit'&&racePits>active.startPits&&!active.pitDone){active.pitDone=true;active.pitTime=active.elapsed;}
  const sec=Math.floor(active.elapsed*10);if(sec!==lastUiSecond){lastUiSecond=sec;const metric=document.getElementById('licenseHudMetric'),timer=document.getElementById('licenseHudTimer');if(metric)metric.textContent=metricText(d);if(timer)timer.textContent=Math.max(0,d.duration-active.elapsed).toFixed(1);}
  if(d.type==='overtake'&&active.bestPass>=d.target)return finishLicense('ALVO ATINGIDO');if(d.type==='draft'&&active.draft>=d.target)return finishLicense('ALVO ATINGIDO');if(d.type==='pit'&&active.pitDone)return finishLicense('SERVIÇO COMPLETO');if(active.elapsed>=d.duration)return finishLicense('TEMPO');
};
globalThis.licenseCompleteByLap=function licenseCompleteByLap(){finishLicense('TRECHO CONCLUÍDO');};
globalThis.licenseFail=function licenseFail(reason){if(!active)return;active.offroad=Math.max(0,raceOffroadSeconds-active.startOffroad);active.crashes=Math.max(0,raceCrashes-active.startCrashes);finishLicense(reason||'FALHOU');};
globalThis.licenseSnapshot=function licenseSnapshot(){const d=active?.def||activeDef();return{count:LICENSES.length,gold:goldCount(),active:d?.id||null,runtime:active?{elapsed:active.elapsed,draft:active.draft,bestPass:active.bestPass,pitDone:active.pitDone,offroad:active.offroad,crashes:active.crashes}:null,medals:{...(career.licenses?.medals||{})}};};
const back=document.getElementById('btnLicensesBack');if(back)back.onclick=()=>openModes();
