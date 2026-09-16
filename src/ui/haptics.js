// OURO 4 — Haptics como linguagem. Eventos raros; nenhum polling aloca objetos.
const PATTERN_ZEBRA=8;
const PATTERN_GRIP=Object.freeze([12,28,12]);
const PATTERN_NITRO=Object.freeze([4,16,7,16,11]);
const PATTERN_IMPACT=40;
const PATTERN_TOUCH=18;
const PATTERN_FINISH=Object.freeze([18,35,18,35,32]);
let zebraCooldown=0,gripCooldown=0;
const stats={zebra:0,grip:0,nitroCharge:0,nitroOn:0,impact:0,touch:0,finish:0,mobileCalls:0,gamepadCalls:0,last:''};

function firstGamepad(){
  try{const pads=navigator.getGamepads?navigator.getGamepads():null;if(!pads)return null;for(let i=0;i<pads.length;i++)if(pads[i])return pads[i];}catch(e){}
  return null;
}
function gamepadPulse(strong,duration,weak=0){
  try{
    const gp=firstGamepad();const a=gp&&(gp.vibrationActuator||(gp.hapticActuators&&gp.hapticActuators[0]));if(!a)return false;
    if(a.playEffect){a.playEffect('dual-rumble',{duration,strongMagnitude:strong,weakMagnitude:weak||strong*.55});stats.gamepadCalls++;return true;}
    if(a.pulse){a.pulse(strong,duration);stats.gamepadCalls++;return true;}
  }catch(e){}
  return false;
}
function mobileVibrate(pattern){
  try{if(typeof navigator.vibrate==='function'){navigator.vibrate(pattern);stats.mobileCalls++;return true;}}catch(e){}
  return false;
}

globalThis.hapticEvent=function hapticEvent(kind,intensity=1){
  const k=String(kind||'');stats.last=k;if(k in stats&&typeof stats[k]==='number')stats[k]++;
  const m=Math.max(.2,Math.min(1,Number(intensity)||1));
  if(k==='zebra'){mobileVibrate(PATTERN_ZEBRA);gamepadPulse(.10*m,8,.18*m);return;}
  if(k==='grip'){mobileVibrate(PATTERN_GRIP);gamepadPulse(.28*m,64,.48*m);return;}
  if(k==='nitroCharge'){mobileVibrate(PATTERN_NITRO);gamepadPulse(.16*m,92,.38*m);return;}
  if(k==='nitroOn'){mobileVibrate(16);gamepadPulse(.24*m,120,.22*m);return;}
  if(k==='impact'){mobileVibrate(PATTERN_IMPACT);gamepadPulse(.95*m,40,.72*m);return;}
  if(k==='touch'){mobileVibrate(PATTERN_TOUCH);gamepadPulse(.45*m,20,.28*m);return;}
  if(k==='finish'){mobileVibrate(PATTERN_FINISH);gamepadPulse(.58*m,155,.42*m);return;}
};

globalThis.hapticRoadTick=function hapticRoadTick(dt,playerSeg,steerIntent,roadEdge){
  zebraCooldown=Math.max(0,zebraCooldown-dt);gripCooldown=Math.max(0,gripCooldown-dt);
  if(!playerSeg||gameMode!=='race'||finished||gameOver)return;
  const sp=MathUtils.limit(speed/maxSpeed,0,1.2),edge=Math.abs(playerX);
  if(sp>.20&&playerSeg.rumbleAlt&&edge>roadEdge*.80&&edge<roadEdge*1.045&&zebraCooldown<=0){hapticEvent('zebra');if(edge<roadEdge*.995&&globalThis.riskComboZebra)riskComboZebra();zebraCooldown=.105;}
  const slip=Math.max(Math.abs(steerIntent)*sp,Math.abs(playerSeg.curve||0)*sp*.22);
  if(sp>.48&&slip>.73&&gripCooldown<=0){hapticEvent('grip',MathUtils.limit(slip,0,1));gripCooldown=.52;}
};

globalThis.gamepadVibrate=function gamepadVibrate(strong=.5,dur=90){gamepadPulse(strong,dur,strong*.55);};
globalThis.resetHaptics=function resetHaptics(){zebraCooldown=0;gripCooldown=0;};
window.RRHaptics={snapshot(){return{...stats,zebraCooldown:Number(zebraCooldown.toFixed(3)),gripCooldown:Number(gripCooldown.toFixed(3))};},reset(){for(const k of ['zebra','grip','nitroCharge','nitroOn','impact','touch','finish','mobileCalls','gamepadCalls'])stats[k]=0;stats.last='';resetHaptics();}};
