// OURO 3 — Juice visual determinístico e respeitoso com reduced-motion.
// Pool fixo: zero alocação por frame no caminho crítico.
const MARK_COUNT=96;
const marks=Array.from({length:MARK_COUNT},()=>({active:false,z:0,offset:0,life:0,maxLife:6,side:0}));
let markCursor=0,markClock=0,frameLagIndex=0,lastChromatic=0,perfectFlashFrames=0;
const lagQueue=new Float32Array(3);
const motionQuery=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
let reducedMotion=!!(motionQuery&&motionQuery.matches);

globalThis.resetJuiceEffects=function resetJuiceEffects(){
  markClock=0;markCursor=0;frameLagIndex=0;lastChromatic=0;perfectFlashFrames=0;
  lagQueue[0]=lagQueue[1]=lagQueue[2]=0;
  for(let i=0;i<MARK_COUNT;i++)marks[i].active=false;
};

function syncMotionPreference(){
  reducedMotion=!!(motionQuery&&motionQuery.matches);
  document.body.classList.toggle('reduced-motion',reducedMotion);
  if(reducedMotion) resetJuiceEffects();
}
if(motionQuery){if(motionQuery.addEventListener)motionQuery.addEventListener('change',syncMotionPreference);else if(motionQuery.addListener)motionQuery.addListener(syncMotionPreference);}
syncMotionPreference();

globalThis.motionEffectsEnabled=function motionEffectsEnabled(){return !reducedMotion;};
globalThis.requestPerfectStartFlash=function requestPerfectStartFlash(){if(!reducedMotion&&!career.settings.reducedFlash)perfectFlashFrames=1;};

function addMark(z,offset,side){
  const m=marks[markCursor];markCursor=(markCursor+1)%MARK_COUNT;
  m.active=true;m.z=z;m.offset=offset;m.life=6;m.maxLife=6;m.side=side;
}

globalThis.updateJuiceEffects=function updateJuiceEffects(dt,playerSeg,steerIntent,isBrake){
  for(let i=0;i<MARK_COUNT;i++){const m=marks[i];if(!m.active)continue;m.life-=dt;if(m.life<=0)m.active=false;}
  if(reducedMotion||!playerSeg||gameMode!=='race'||finished||gameOver)return;
  const sp=MathUtils.limit(speed/maxSpeed,0,1.2);
  const curveSlip=Math.abs(playerSeg.curve||0)*sp*.20;
  const steerSlip=Math.abs(steerIntent)*sp;
  const slip=Math.max(curveSlip,steerSlip)+(isBrake&&sp>.48?.34:0);
  if(sp>.43&&slip>.56){
    markClock-=dt;
    if(markClock<=0){
      const z=playerProgress+playerZ+segmentLength*.08;
      addMark(z,playerX-.145,-1);addMark(z,playerX+.145,1);
      markClock=.085;
    }
  }else markClock=Math.max(0,markClock-dt*.35);
};

globalThis.drawTireMarks=function drawTireMarks(){
  if(reducedMotion)return;
  ctx.save();ctx.lineCap='round';
  for(let i=0;i<MARK_COUNT;i++){
    const m=marks[i];if(!m.active)continue;
    const dist=m.z-(playerProgress+playerZ);
    if(dist<-segmentLength*1.2||dist>activeDrawDistance()*segmentLength)continue;
    const seg=getSegment(m.z);if(!seg||!seg.p1.screen||!seg.p2.screen||!seg.p1.camera||seg.p1.camera.z<=renderCameraDepth)continue;
    const cp=MathUtils.percentRemaining(m.z,segmentLength);
    const sx=MathUtils.interpolate(seg.p1.screen.x,seg.p2.screen.x,cp)+MathUtils.interpolate(seg.p1.screen.w,seg.p2.screen.w,cp)*m.offset;
    const sy=MathUtils.interpolate(seg.p1.screen.y,seg.p2.screen.y,cp);
    const rw=MathUtils.interpolate(seg.p1.screen.w,seg.p2.screen.w,cp);
    if(sy<0||sy>height+8||rw<5)continue;
    const alpha=MathUtils.limit(m.life/m.maxLife,0,1)*.34;
    ctx.globalAlpha=alpha;ctx.strokeStyle='#080808';ctx.lineWidth=MathUtils.limit(rw*.012,.65,3.0);
    const lean=m.side*(1+rw*.004);ctx.beginPath();ctx.moveTo(sx-lean,sy+Math.max(2,rw*.018));ctx.lineTo(sx+lean*.25,sy-Math.max(2,rw*.026));ctx.stroke();
  }
  ctx.restore();
};

globalThis.cameraLag2Frames=function cameraLag2Frames(target){
  if(reducedMotion){lagQueue[0]=lagQueue[1]=lagQueue[2]=target;return target;}
  lagQueue[frameLagIndex]=target;
  frameLagIndex=(frameLagIndex+1)%3;
  return lagQueue[frameLagIndex];
};

globalThis.emitGuardrailSparks=function emitGuardrailSparks(screenX,screenY,intensity=1){
  if(reducedMotion)return;
  const n=qualityHigh()?4:2;
  for(let i=0;i<n;i++)emitParticle(screenX,screenY,rrRandom('visual')>.32?'rgba(255,205,70,.96)':'rgba(255,110,25,.92)',1,.70+intensity*.55);
};

globalThis.drawJuicePostFX=function drawJuicePostFX(){
  if(reducedMotion){lastChromatic=0;return;}
  const kmh=(speed/maxSpeed)*285;
  const chroma=qualityHigh()?MathUtils.limit((kmh-240)/65,0,1):0;
  lastChromatic=chroma;
  if(chroma>.01){
    ctx.save();
    const shift=.55+chroma*.95;
    ctx.globalCompositeOperation='screen';ctx.globalAlpha=.026+.025*chroma;
    ctx.drawImage(canvas,-shift,0,width,height);ctx.drawImage(canvas,shift,0,width,height);
    ctx.globalCompositeOperation='source-over';
    const edge=Math.max(2,Math.round(width*.006));ctx.globalAlpha=.018+.018*chroma;ctx.fillStyle='#ff2a44';ctx.fillRect(0,0,edge,height);ctx.fillStyle='#00dcff';ctx.fillRect(width-edge,0,edge,height);
    ctx.restore();
  }
  if(effectiveQuality()==='CRT'){
    ctx.save();ctx.globalAlpha=.045;ctx.fillStyle='#fff';const count=20;
    for(let i=0;i<count;i++)ctx.fillRect((rrRandom('visual')*width)|0,(rrRandom('visual')*height)|0,1,1);
    ctx.restore();
  }
  if(perfectFlashFrames>0){ctx.save();ctx.globalAlpha=.22;ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);ctx.restore();perfectFlashFrames--;}
};

window.RRJuice={snapshot(){let active=0;for(let i=0;i<MARK_COUNT;i++)if(marks[i].active)active++;return{reducedMotion,activeTireMarks:active,cameraLag:[lagQueue[0],lagQueue[1],lagQueue[2]],chromatic:Number(lastChromatic.toFixed(3)),perfectFlashFrames};},reset:resetJuiceEffects};
