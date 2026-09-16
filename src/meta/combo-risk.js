// OURO 8 — Combo de Risco. Perícia -> FICHAS cosméticas; nunca altera física/CR$.
const TRAILS=Object.freeze([
  Object.freeze({id:'classic',name:'CLÁSSICO',price:0,a:'rgba(255,140,0,.88)',b:'rgba(80,210,255,.78)'}),
  Object.freeze({id:'cyan',name:'ION CYAN',price:80,a:'rgba(60,245,255,.96)',b:'rgba(170,255,255,.78)'}),
  Object.freeze({id:'magenta',name:'NEON MAGENTA',price:180,a:'rgba(255,55,205,.95)',b:'rgba(174,80,255,.82)'}),
  Object.freeze({id:'gold',name:'OURO HORIZONTE',price:360,a:'rgba(255,214,70,.98)',b:'rgba(255,145,35,.88)'})
]);
const prevDist=new Float32Array(32);for(let i=0;i<prevDist.length;i++)prevDist[i]=999999;
let multiplier=1,score=0,chainScore=0,bestMultiplier=1,earned=0,eventTimer=0,breakTimer=0;
let driftClock=0,draftClock=0,airClock=0,lastEvent='',lastEventValue=0;
const snap={multiplier:1,score:0,chainScore:0,bestMultiplier:1,earned:0,lastEvent:'',lastEventValue:0};
function active(){return gameMode==='race'&&raceStarted&&!finished&&!gameOver&&!(globalThis.isFtuePrologue&&isFtuePrologue());}
function hud(){const box=document.getElementById('comboHud');if(!box)return;const mult=document.getElementById('comboMultiplier'),pts=document.getElementById('comboScore'),evt=document.getElementById('comboEvent');box.classList.toggle('hot',multiplier>=3);box.classList.toggle('broken',breakTimer>0);mult.textContent=breakTimer>0?'x0.0':'x'+Math.max(1,multiplier).toFixed(1);pts.textContent=String(Math.floor(score)).padStart(5,'0');evt.textContent=eventTimer>0?lastEvent:'';}
function add(kind,base,gain){if(!active())return 0;if(breakTimer>0)breakTimer=0;if(multiplier<1)multiplier=1;const value=Math.round(base*multiplier);score+=value;chainScore+=value;multiplier=Math.min(8,multiplier+gain);bestMultiplier=Math.max(bestMultiplier,multiplier);lastEvent=kind;lastEventValue=value;eventTimer=1.05;if(globalThis.highlightMark&&multiplier>=2.2)highlightMark('combo',kind+Math.max(1,multiplier).toFixed(1),Math.min(88,55+multiplier*4+value/80));if(multiplier>=4&&globalThis.hapticEvent)hapticEvent('grip',.28);hud();return value;}
function slopeAir(seg){if(!seg||speed<maxSpeed*.70)return false;const next=getSegment(playerProgress+playerZ+segmentLength);if(!next)return false;const a=(seg.p2.world.y-seg.p1.world.y),b=(next.p2.world.y-next.p1.world.y);return a>12&&b<-8;}
globalThis.riskComboTick=function riskComboTick(dt,seg,steerIntent,isBrake){
  eventTimer=Math.max(0,eventTimer-dt);breakTimer=Math.max(0,breakTimer-dt);
  if(!active()){hud();return;}
  const sp=MathUtils.limit(speed/maxSpeed,0,1.2),slip=Math.max(Math.abs(steerIntent)*sp,Math.abs(seg?.curve||0)*sp*.22)+(isBrake&&sp>.52?.18:0);
  if(sp>.55&&slip>.62){driftClock+=dt;if(driftClock>=.42){driftClock-=.42;add('DRIFT +',105,.12);}}else driftClock=Math.max(0,driftClock-dt*.8);
  if(draftBoost>.46&&sp>.45){draftClock+=dt;if(draftClock>=.70){draftClock-=.70;add('VÁCUO +',90,.10);}}else draftClock=Math.max(0,draftClock-dt*.9);
  if(slopeAir(seg)){airClock+=dt;if(airClock>=.22){airClock-=.22;add('NO AR +',140,.16);}}else airClock=Math.max(0,airClock-dt);
  if(eventTimer<=0&&multiplier>1)multiplier=Math.max(1,multiplier-dt*.045);
  hud();
};
globalThis.riskComboNearMiss=function riskComboNearMiss(car,dist,lateral,sp){const id=car&&Number.isInteger(car.id)?car.id:0,prev=prevDist[id];prevDist[id]=dist;if(!active()||sp<.58)return false;if(prev>0&&dist<=0&&lateral>.43&&lateral<.88){add('QUASE! +',220,.28);return true;}return false;};
globalThis.riskComboZebra=function riskComboZebra(){if(active())add('ZEBRA LIMPA +',85,.09);};
globalThis.riskComboCrash=function riskComboCrash(){if(!active())return;career.stats.bestCombo=Math.max(career.stats.bestCombo||0,bestMultiplier);multiplier=0;chainScore=0;driftClock=draftClock=airClock=0;breakTimer=.78;lastEvent='COMBO QUEBRADO';lastEventValue=0;eventTimer=.92;hud();};
globalThis.resetRiskCombo=function resetRiskCombo(){multiplier=1;score=0;chainScore=0;bestMultiplier=1;earned=0;eventTimer=0;breakTimer=0;driftClock=draftClock=airClock=0;lastEvent='';lastEventValue=0;for(let i=0;i<prevDist.length;i++)prevDist[i]=999999;hud();};
globalThis.finishRiskCombo=function finishRiskCombo(){career.stats.bestCombo=Math.max(career.stats.bestCombo||0,bestMultiplier);career.stats.riskScore=(career.stats.riskScore||0)+Math.floor(score);earned=Math.min(75,Math.floor(score/900));if(earned>0){career.fichas=(career.fichas||0)+earned;career.stats.fichasEarned=(career.stats.fichasEarned||0)+earned;}hud();return earned;};
globalThis.riskTrailParticleColor=function riskTrailParticleColor(alt=false){const id=career.cosmetics?.selectedTrail||'classic',t=TRAILS.find(x=>x.id===id)||TRAILS[0];return alt?t.b:t.a;};
globalThis.buyRiskTrail=function buyRiskTrail(id){const t=TRAILS.find(x=>x.id===id);if(!t)return false;career.cosmetics=career.cosmetics||{trails:['classic'],selectedTrail:'classic'};career.cosmetics.trails=career.cosmetics.trails||['classic'];if(!career.cosmetics.trails.includes(id)){if((career.fichas||0)<t.price)return false;career.fichas-=t.price;career.cosmetics.trails.push(id);}career.cosmetics.selectedTrail=id;saveCareer();return true;};
globalThis.renderRiskCosmetics=function renderRiskCosmetics(){const bal=document.getElementById('garageFichas'),wrap=document.getElementById('garageTrails');if(bal)bal.textContent='FICHAS '+Math.floor(career.fichas||0).toLocaleString('pt-BR');if(!wrap)return;const owned=career.cosmetics?.trails||['classic'],sel=career.cosmetics?.selectedTrail||'classic';wrap.innerHTML=TRAILS.map(t=>`<button class="trail-chip ${sel===t.id?'active':''}" data-trail="${t.id}" ${!owned.includes(t.id)&&(career.fichas||0)<t.price?'disabled':''}><i style="background:linear-gradient(90deg,${t.a},${t.b})"></i><span>${t.name}</span><b>${owned.includes(t.id)?(sel===t.id?'ATIVO':'USAR'):(t.price+' FICHAS')}</b></button>`).join('');wrap.querySelectorAll('[data-trail]').forEach(b=>b.onclick=()=>{if(buyRiskTrail(b.dataset.trail)){renderRiskCosmetics();if(globalThis.renderGarage)renderGarage();}});};
globalThis.getRiskComboSnapshot=function getRiskComboSnapshot(){snap.multiplier=multiplier;snap.score=score;snap.chainScore=chainScore;snap.bestMultiplier=bestMultiplier;snap.earned=earned;snap.lastEvent=lastEvent;snap.lastEventValue=lastEventValue;return snap;};
globalThis.RR_RISK_TRAILS=TRAILS;
if(career&&career.flags&&!career.flags.c08RiskCombo){career.flags.c08RiskCombo=true;saveCareer();}
