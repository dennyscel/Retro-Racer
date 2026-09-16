// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
globalThis.fadeAudioOut = function fadeAudioOut() {
    if (window.RetroRacerSFX && window.RetroRacerSFX.stopEngineFromGame) { try { window.RetroRacerSFX.stopEngineFromGame(); } catch (e) {} }
    if (!audioInitialized || !audioCtx || !engineGain) return;
    try { engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, .08); } catch (e) {}
}

window.RRCore.runtime.bind('keys',{ ArrowUp:false, ArrowDown:false, ArrowLeft:false, ArrowRight:false, Nitro:false });
window.RRCore.runtime.bind('KEY_ALIAS',{ KeyW:'ArrowUp', KeyS:'ArrowDown', KeyA:'ArrowLeft', KeyD:'ArrowRight', Space:'Nitro', ShiftLeft:'Nitro', ShiftRight:'Nitro' });
window.RRCore.runtime.bind('touchDrive',{ active:false, pointerId:null, startX:0, startY:0, currentX:0, currentY:0, carStartX:0, targetX:0, brake:false, nitro:false, moved:false });
globalThis.setKey = function setKey(code, val) { if (Object.prototype.hasOwnProperty.call(keys, code)) keys[code] = val; }
globalThis.clearKeys = function clearKeys() { Object.keys(keys).forEach(k => keys[k] = false); touchDrive.active = false; touchDrive.pointerId = null; touchDrive.brake = false; touchDrive.nitro = false; touchDrive.moved = false; lastTouchSteer = 0; fadeAudioOut(); }
document.addEventListener('pointerdown', () => resumeAudio(), { passive:true });
window.addEventListener('keydown', (e) => {
    resumeAudio();
    const code = KEY_ALIAS[e.code] || e.code;
    if (Object.prototype.hasOwnProperty.call(keys, code)) { e.preventDefault(); setKey(code, true); }
    if (e.code === 'KeyR') startRace();
    if (e.code === 'KeyP' || e.code === 'Escape') { if (gameMode === 'race') togglePause(); }
}, { passive:false });
window.addEventListener('keyup', (e) => { const code = KEY_ALIAS[e.code] || e.code; if (Object.prototype.hasOwnProperty.call(keys, code)) { e.preventDefault(); setKey(code, false); } }, { passive:false });
window.addEventListener('blur', clearKeys);
document.addEventListener('visibilitychange', () => { if (document.hidden) { clearKeys(); if(gameMode==='race'&&!gamePaused){ gamePaused=true; fadeAudioOut(); if(window.RetroRacerMusic999Bridge) try{window.RetroRacerMusic999Bridge.pause();}catch(e){} showMenu('pause'); } } });
document.addEventListener('touchmove', e => { if (e.target && e.target.closest && e.target.closest('.menu-card')) return; e.preventDefault(); }, { passive:false });

globalThis.updateTouchTarget = function updateTouchTarget(e) {
    const rect = wrapper.getBoundingClientRect();
    touchDrive.currentX = e.clientX;
    touchDrive.currentY = e.clientY;
    const deltaX = touchDrive.currentX - touchDrive.startX;
    const deltaY = touchDrive.currentY - touchDrive.startY;
    const sens = Math.max(85, rect.width * .31);
    touchDrive.targetX = MathUtils.limit(touchDrive.carStartX + deltaX / sens, -1.35, 1.35);
    touchDrive.brake = deltaY > Math.max(58, rect.height * .085);
    touchDrive.nitro = deltaY < -Math.max(46, rect.height * .065);
    touchDrive.moved = Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5;
}
wrapper.addEventListener('pointerdown', (e) => {
    if (e.target === fullscreenBtn || e.target.closest('.menu-overlay')) return;
    e.preventDefault();
    resumeAudio();
    if (gameMode !== 'race') return;
    wrapper.setPointerCapture(e.pointerId);
    touchDrive.active = true;
    touchDrive.pointerId = e.pointerId;
    touchDrive.startX = e.clientX; touchDrive.startY = e.clientY;
    touchDrive.currentX = e.clientX; touchDrive.currentY = e.clientY;
    touchDrive.carStartX = playerX; touchDrive.targetX = playerX;
    touchDrive.brake = false; touchDrive.nitro = false; touchDrive.moved = false;
    if (!countdownActive) raceStarted = true;
    touchHint.classList.add('hidden');
}, { passive:false });
wrapper.addEventListener('pointermove', (e) => { if (!touchDrive.active || e.pointerId !== touchDrive.pointerId) return; e.preventDefault(); updateTouchTarget(e); }, { passive:false });
globalThis.releaseTouch = function releaseTouch(e) { if (!touchDrive.active || e.pointerId !== touchDrive.pointerId) return; e.preventDefault(); touchDrive.active = false; touchDrive.pointerId = null; touchDrive.brake = false; touchDrive.nitro = false; touchDrive.moved = false; lastTouchSteer = 0; }
wrapper.addEventListener('pointerup', releaseTouch, { passive:false });
wrapper.addEventListener('pointercancel', releaseTouch, { passive:false });
wrapper.addEventListener('pointerleave', releaseTouch, { passive:false });
fullscreenBtn.addEventListener('pointerdown', e => e.stopPropagation());
fullscreenBtn.addEventListener('click', async (e) => {
    e.stopPropagation(); resumeAudio();
    try {
        const t = document.documentElement;
        if (!document.fullscreenElement && t.requestFullscreen) {
            await t.requestFullscreen();
            if (screen.orientation && screen.orientation.lock) { try { await screen.orientation.lock('landscape'); } catch (er) {} }
        } else if (document.exitFullscreen) await document.exitFullscreen();
        setTimeout(resizeCanvas, 120); setTimeout(resizeCanvas, 420);
    } catch (er) {}
});


globalThis.pollGamepad = function pollGamepad(){
    const pads=navigator.getGamepads?navigator.getGamepads():[]; let gp=null; for(let i=0;i<pads.length;i++){if(pads[i]){gp=pads[i];break;}} if(!gp){gamepadIntent.connected=false;gamepadIntent.steer=0;gamepadIntent.accel=false;gamepadIntent.brake=false;gamepadIntent.nitro=false;return;}
    gamepadIntent.connected=true; const dz=career.settings.deadzone||.08; const raw=gp.axes&&gp.axes.length?gp.axes[0]:0; gamepadIntent.steer=Math.abs(raw)>dz?Math.sign(raw)*((Math.abs(raw)-dz)/(1-dz)):0;
    gamepadIntent.accel=!!(gp.buttons[7]&&gp.buttons[7].value>.2); gamepadIntent.brake=!!(gp.buttons[6]&&gp.buttons[6].value>.2); gamepadIntent.nitro=!!((gp.buttons[0]&&gp.buttons[0].pressed)||(gp.buttons[2]&&gp.buttons[2].pressed));
    if(gp.buttons[9]&&gp.buttons[9].pressed&&!gamepadIntent._pauseHeld){gamepadIntent._pauseHeld=true;if(gameMode==='race')togglePause();} if(!(gp.buttons[9]&&gp.buttons[9].pressed)) gamepadIntent._pauseHeld=false;
}
globalThis.setupVirtualControls = function setupVirtualControls(){ const el=document.getElementById('virtualControls'); if(!el)return; const state={left:false,right:false,accel:false,brake:false,nitro:false}; el.querySelectorAll('[data-vctrl]').forEach(b=>{const k=b.dataset.vctrl; const on=e=>{e.preventDefault();state[k]=true;resumeAudio();}; const off=e=>{e.preventDefault();state[k]=false;}; b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('pointerleave',off);}); el._state=state; }
globalThis.virtualState = function virtualState(){ const el=document.getElementById('virtualControls');return el&&el._state?el._state:{left:false,right:false,accel:false,brake:false,nitro:false}; }
globalThis.radio = function radio(msg,time=1.5){ radioText=msg;radioTimer=time;const el=document.getElementById('radioHud');if(el){el.textContent='📻 '+msg;el.classList.add('show');}if(globalThis.a11yRadioCaption)a11yRadioCaption(msg); }
globalThis.updateRadio = function updateRadio(dt){ if(radioTimer>0){radioTimer-=dt;if(radioTimer<=0){const el=document.getElementById('radioHud');if(el)el.classList.remove('show');}} }
globalThis.racePrizes = function racePrizes(level,replay=false){ const tier=Math.max(1,Math.ceil(level/27)); const p1=Math.round(1800+220*Math.log2(level+1)*tier); const mult=replay?.55:1; return [Math.round(p1*mult),Math.round(p1*.56*mult),Math.round(p1*.32*mult),Math.round(p1*.12*mult)]; }
globalThis.localDateKey = function localDateKey(d=new Date()){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
globalThis.dailyLevel = function dailyLevel(){ const seed=Number(localDateKey().replaceAll('-','')); return (seed%999)+1; }
globalThis.getCircuits = function getCircuits(){ return Array.isArray(window.RetroRacerCircuits999)?window.RetroRacerCircuits999:[]; }
globalThis.getCupCircuits = function getCupCircuits(cup){ return getCircuits().filter(c=>Number(c.championship)===Number(cup)); }
globalThis.cupUnlocked = function cupUnlocked(cup){ return career.level >= ((cup-1)*27+1); }
globalThis.medalSymbol = function medalSymbol(m){ return m==='gold'?'🥇':m==='silver'?'🥈':m==='bronze'?'🥉':'·'; }
globalThis.drawRibbon = function drawRibbon(canvas,circuit){ if(!canvas||!circuit)return; const g=canvas.getContext('2d'); const w=canvas.width,h=canvas.height; g.clearRect(0,0,w,h);g.fillStyle='#05070d';g.fillRect(0,0,w,h); const secs=circuit.sections||[]; if(!secs.length)return; let total=secs.reduce((a,x)=>a+(x.e||0)+(x.h||0)+(x.l||0),0)||1,prog=0,x=w*.06,y=h*.56;g.strokeStyle='#38d5ff';g.lineWidth=6;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(x,y); secs.forEach(sec=>{const len=((sec.e||0)+(sec.h||0)+(sec.l||0))/total*(w*.86);prog+=len;const c=Number(sec.c||0);y=Math.max(h*.18,Math.min(h*.84,y+c*4));x=w*.06+prog;g.lineTo(x,y);});g.stroke();g.fillStyle='#ffcc00';g.fillRect(w*.05,h*.51,5,14);g.fillStyle='#fff';g.font='900 12px monospace';g.fillText(`${circuit.id} · ${circuit.name}`,12,17);g.fillStyle='#9fb4c9';g.font='10px monospace';g.fillText(`${circuit.weatherLabel} · ${circuit.timeOfDay} · ${circuit.signature}`,12,h-9); }
globalThis.applyUiSettings = function applyUiSettings(){ document.body.classList.toggle('aaa-hud-s',career.settings.hudSize==='S');document.body.classList.toggle('aaa-hud-l',career.settings.hudSize==='L');document.body.classList.toggle('copilot-mode',career.settings.controlMode==='COPILOTO');document.body.classList.toggle('legendary-mode',career.settings.difficulty==='LENDA');wrapper.classList.toggle('crt-mode',career.settings.quality==='CRT'); const v=document.getElementById('virtualControls');if(v)v.classList.toggle('show',!!career.settings.virtualButtons&&gameMode==='race');const h=document.getElementById('touchHint');if(h)h.innerHTML=career.settings.controlMode==='COPILOTO'?'COPILOTO acelera sozinho · arraste para virar<br>arraste para cima: nitro · para baixo: freio':'Toque e segure para acelerar · arraste para virar<br>arraste para cima: nitro · arraste para baixo: freio';if(globalThis.applyAccessibilitySettings)applyAccessibilitySettings(); }
globalThis.recordTelemetry = function recordTelemetry(rank,prize){ career.telemetry.lastRaces.unshift({level:raceLevel,mode:raceContext.mode,rank,time:Number(finalTotalTime.toFixed(2)),pits:racePits,crashes:raceCrashes,date:new Date().toISOString()});career.telemetry.lastRaces=career.telemetry.lastRaces.slice(0,20); }
globalThis.setupDailyContracts = function setupDailyContracts(){ const key=localDateKey(); if(career.contracts.date===key){ if(Array.isArray(career.contracts.items)) career.contracts.items.forEach(c=>{if(c.rewarded===undefined)c.rewarded=false;}); return; } career.contracts={date:key,items:[{id:'top5',text:'Termine no TOP 5',done:false,rewarded:false},{id:'pit',text:'Faça 1 pit perfeito',done:false,rewarded:false},{id:'clean',text:'Complete uma corrida com < 2 colisões',done:false,rewarded:false}]};saveCareer(); }

globalThis.MathUtils = {
    limit(v, min, max) { return Math.max(min, Math.min(v, max)); },
    percentRemaining(n, total) { return (n % total) / total; },
    interpolate(a, b, p) { return a + (b - a) * p; },
    easeIn(a, b, p) { return a + (b - a) * Math.pow(p, 2); },
    easeOut(a, b, p) { return a + (b - a) * (1 - Math.pow(1 - p, 2)); },
    easeInOut(a, b, p) { return a + (b - a) * ((-Math.cos(p * Math.PI) / 2) + .5); },
    overlap(x1, w1, x2, w2, p = 1) { const h = p / 2; return !((x1 + w1 * h < x2 - w2 * h) || (x1 - w1 * h > x2 + w2 * h)); }
};
