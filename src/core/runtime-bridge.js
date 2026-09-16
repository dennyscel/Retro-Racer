// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
// Ponte temporária: expõe callbacks do runtime legado para o kernel ES module.
globalThis.rrDeterminismProbe = function rrDeterminismProbe(frames,seed='probe'){
    const savedMode=gameMode,savedLevel=raceLevel,savedContext={...raceContext},savedDamage={...career.carDamage},savedStats={...career.stats};
    career.carDamage[currentCar().id]=0;
    raceContext={mode:'timeTrial',selectedLevel:1,replay:false,laps:5,dailySeed:null,ghost:false,boss:false,insurance:false};raceLevel=1;window.RRCore.rng.beginRace(seed);buildTrack();resetRaceStateOnly();initCars();cars=[];gameMode='race';gamePaused=false;countdownActive=false;raceStarted=true;finished=false;gameOver=false;
    for(const f of frames){keys.ArrowUp=!!f.accel;keys.ArrowDown=!!f.brake;keys.Nitro=!!f.nitro;keys.ArrowLeft=(f.steer||0)<-.25;keys.ArrowRight=(f.steer||0)>.25;update(step);}
    const out={progress:+playerProgress.toFixed(6),x:+playerX.toFixed(6),speed:+speed.toFixed(6),fuel:+fuel.toFixed(6),time:+totalRaceTime.toFixed(6),lap:currentLap};
    clearKeys();career.carDamage={...savedDamage};career.stats={...career.stats,...savedStats};gameMode=savedMode;raceLevel=savedLevel;raceContext=savedContext;return out;
}
globalThis.rrLoopUpdate = function rrLoopUpdate(dt){update(dt);if(photoFinishSlowmo>0)photoFinishSlowmo=Math.max(0,photoFinishSlowmo-step);}
window.RRGameAPI={
    update:rrLoopUpdate,render,renderGarage(){if(gameMode==='garage')drawGarageCarPreview();},getFpsCap(){return career.settings.fpsCap===30?30:60;},getTimeScale(){return photoFinishSlowmo>0?.45:1;},onSlowFrame(){if(effectiveQuality()!=='LOW'){runtimeQuality='LOW';if(gameMode==='race')radio('QUALIDADE DINÂMICA: LOW',1.5);}},
    boot(){loadCareer();setupDailyContracts();setupVirtualControls();applyUiSettings();raceContext.selectedLevel=career.level;raceLevel=career.level;buildTrack();initCars();updateStartBadges();updateHud(cars.length+1,cars.length+1);const shadowLink=!!(globalThis.shadowHasBootLink&&shadowHasBootLink());const instant=!shadowLink&&globalThis.shouldRunFtue&&shouldRunFtue();if(shadowLink){shadowHandleBootLink();touchHint.classList.add('hidden');}else if(instant)startFtuePrologue();else if(globalThis.identityBootStart)identityBootStart(()=>showMenu('start'));else showMenu('start');setTimeout(()=>{applyV43AudioSettings();renderSettings();},900);if(!shadowLink&&!instant&&!career.flags.touchHintSeen)setTimeout(()=>touchHint.classList.add('hidden'),6500);else touchHint.classList.add('hidden');},
    debug:{snapshot:()=>({level:career.level,money:career.money,car:career.selectedCar,trackCount:getCircuits().length,mode:gameMode}),probe:rrDeterminismProbe,setKey}
};
