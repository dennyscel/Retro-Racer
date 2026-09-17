// GAMEPLAY RECOVERY C01 — ownership explícito de ponteiros em mobile.
// Carregado depois de input.js e antes do boot para impedir que um segundo dedo roube direção
// ou que soltar um dedo cancele outro controle ainda pressionado.
const inputWrapper = globalThis.wrapper || document.getElementById('wrapper');
const virtualControlsEl = document.getElementById('virtualControls');
const recoveryPointerState = {
  drivePointer: null,
  controlByPointer: new Map(),
  pointerByControl: new Map()
};

function ensureVirtualState(){
  if(!virtualControlsEl)return {left:false,right:false,accel:false,brake:false,nitro:false};
  if(!virtualControlsEl._state)virtualControlsEl._state={left:false,right:false,accel:false,brake:false,nitro:false};
  return virtualControlsEl._state;
}
function clearControl(k){const s=ensureVirtualState();if(k&&Object.prototype.hasOwnProperty.call(s,k))s[k]=false;}
function setControl(k,v){const s=ensureVirtualState();if(k&&Object.prototype.hasOwnProperty.call(s,k))s[k]=!!v;}
function releaseDrivePointer(){
  recoveryPointerState.drivePointer=null;
  touchDrive.active=false;touchDrive.pointerId=null;touchDrive.brake=false;touchDrive.nitro=false;touchDrive.moved=false;lastTouchSteer=0;
}
function releaseControlPointer(pointerId){
  const k=recoveryPointerState.controlByPointer.get(pointerId);if(!k)return;
  if(recoveryPointerState.pointerByControl.get(k)===pointerId){clearControl(k);recoveryPointerState.pointerByControl.delete(k);}
  recoveryPointerState.controlByPointer.delete(pointerId);
}
function releaseAllPointers(){
  releaseDrivePointer();
  for(const id of [...recoveryPointerState.controlByPointer.keys()])releaseControlPointer(id);
  const s=ensureVirtualState();Object.keys(s).forEach(k=>s[k]=false);
}

const baseClearKeys=globalThis.clearKeys;
globalThis.clearKeys=function recoveryClearKeys(){if(typeof baseClearKeys==='function')baseClearKeys();releaseAllPointers();};

globalThis.setupVirtualControls=function recoverySetupVirtualControls(){ensureVirtualState();};

globalThis.recoveryInputPointers=()=>({drivePointer:recoveryPointerState.drivePointer,controls:Object.fromEntries(recoveryPointerState.pointerByControl.entries())});
globalThis.recoveryReleaseAllPointers=releaseAllPointers;

if(inputWrapper){
  inputWrapper.addEventListener('pointerdown',e=>{
    if(e.target===globalThis.fullscreenBtn||e.target?.closest?.('.menu-overlay'))return;
    const control=e.target?.closest?.('[data-vctrl]');
    if(control&&virtualControlsEl&&virtualControlsEl.contains(control)){
      e.preventDefault();e.stopImmediatePropagation();
      if(gameMode!=='race')return;
      resumeAudio();
      const k=control.dataset.vctrl;if(!k)return;
      const existing=recoveryPointerState.pointerByControl.get(k);
      if(existing!==undefined&&existing!==e.pointerId)return;
      recoveryPointerState.controlByPointer.set(e.pointerId,k);recoveryPointerState.pointerByControl.set(k,e.pointerId);setControl(k,true);
      try{control.setPointerCapture(e.pointerId);}catch(err){}
      return;
    }
    if(gameMode!=='race')return;
    e.preventDefault();e.stopImmediatePropagation();resumeAudio();
    if(recoveryPointerState.drivePointer!==null)return;
    recoveryPointerState.drivePointer=e.pointerId;
    try{inputWrapper.setPointerCapture(e.pointerId);}catch(err){}
    touchDrive.active=true;touchDrive.pointerId=e.pointerId;
    touchDrive.startX=e.clientX;touchDrive.startY=e.clientY;touchDrive.currentX=e.clientX;touchDrive.currentY=e.clientY;
    touchDrive.carStartX=playerX;touchDrive.targetX=playerX;touchDrive.brake=false;touchDrive.nitro=false;touchDrive.moved=false;
    if(!countdownActive)raceStarted=true;
    if(globalThis.touchHint)touchHint.classList.add('hidden');
  },true);

  inputWrapper.addEventListener('pointermove',e=>{
    if(recoveryPointerState.controlByPointer.has(e.pointerId)){e.preventDefault();e.stopImmediatePropagation();return;}
    if(e.pointerId!==recoveryPointerState.drivePointer){if(gameMode==='race'){e.preventDefault();e.stopImmediatePropagation();}return;}
    e.preventDefault();e.stopImmediatePropagation();
    if(globalThis.updateTouchTarget)updateTouchTarget(e);
  },true);

  const release=e=>{
    if(recoveryPointerState.controlByPointer.has(e.pointerId)){e.preventDefault();e.stopImmediatePropagation();releaseControlPointer(e.pointerId);return;}
    if(e.pointerId===recoveryPointerState.drivePointer){e.preventDefault();e.stopImmediatePropagation();releaseDrivePointer();return;}
    if(gameMode==='race'){e.preventDefault();e.stopImmediatePropagation();}
  };
  inputWrapper.addEventListener('pointerup',release,true);
  inputWrapper.addEventListener('pointercancel',release,true);
  inputWrapper.addEventListener('lostpointercapture',release,true);
}

window.addEventListener('blur',releaseAllPointers);
document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAllPointers();});
