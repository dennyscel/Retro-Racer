// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
window.RRCore.runtime.bind('canvas',document.getElementById('gameCanvas'));
window.RRCore.runtime.bind('ctx',canvas.getContext('2d', { alpha: false }));
window.RRCore.runtime.bind('wrapper',document.getElementById('game-wrapper'));
window.RRCore.runtime.bind('speedDisplay',document.getElementById('speedDisplay'));
window.RRCore.runtime.bind('posDisplay',document.getElementById('posDisplay'));
window.RRCore.runtime.bind('totalRacersDisplay',document.getElementById('totalRacersDisplay'));
window.RRCore.runtime.bind('nitroDisplay',document.getElementById('nitroDisplay'));
window.RRCore.runtime.bind('fuelDisplay',document.getElementById('fuelDisplay'));
window.RRCore.runtime.bind('fuelHudBox',document.getElementById('fuelHudBox'));
window.RRCore.runtime.bind('damageHudBox',document.getElementById('damageHudBox'));
window.RRCore.runtime.bind('nitroHudBox',document.getElementById('nitroHudBox'));
window.RRCore.runtime.bind('curveHud',document.getElementById('curveHud'));
window.RRCore.runtime.bind('curveArrow',document.getElementById('curveArrow'));
window.RRCore.runtime.bind('curveLabel',document.getElementById('curveLabel'));
window.RRCore.runtime.bind('pitHud',document.getElementById('pitHud'));
window.RRCore.runtime.bind('pitStageText',document.getElementById('pitStageText'));
window.RRCore.runtime.bind('pitPct',document.getElementById('pitPct'));
window.RRCore.runtime.bind('pitBarFill',document.getElementById('pitBarFill'));
window.RRCore.runtime.bind('damageDisplay',document.getElementById('damageDisplay'));
window.RRCore.runtime.bind('lapDisplay',document.getElementById('lapDisplay'));
window.RRCore.runtime.bind('moneyDisplay',document.getElementById('moneyDisplay'));
window.RRCore.runtime.bind('timeDisplay',document.getElementById('timeDisplay'));
window.RRCore.runtime.bind('bestTimeDisplay',document.getElementById('bestTimeDisplay'));
window.RRCore.runtime.bind('comboHud',document.getElementById('comboHud'));
window.RRCore.runtime.bind('fullscreenBtn',document.getElementById('fullscreenBtn'));
window.RRCore.runtime.bind('touchHint',document.getElementById('touchHint'));
window.RRCore.runtime.bind('garageCarCanvas',document.getElementById('garageCarCanvas'));
window.RRCore.runtime.bind('garageCtx',garageCarCanvas.getContext('2d'));

window.RRCore.runtime.bind('width',480);
window.RRCore.runtime.bind('height',360);

globalThis.resizeCanvas = function resizeCanvas() {
    const rect = wrapper.getBoundingClientRect();
    const cssW = Math.max(320, Math.floor(rect.width));
    const cssH = Math.max(240, Math.floor(rect.height));
    const logicalW = 480;
    const logicalH = Math.max(270, Math.round(logicalW * (cssH / cssW)));
    canvas.width = logicalW;
    canvas.height = logicalH;
    width = canvas.width;
    height = canvas.height;
    ctx.imageSmoothingEnabled = false;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 120);
    setTimeout(resizeCanvas, 420);
    setTimeout(resizeCanvas, 800);
});
resizeCanvas();

// Estado, save e catálogo de carros agora vêm dos ES modules nativos do núcleo.
window.RRCore.runtime.bind('SAVE_KEY',(window.RRCore.state).SAVE_KEY); window.RRCore.runtime.bind('OLD_KEYS',(window.RRCore.state).OLD_KEYS); window.RRCore.runtime.bind('defaultCareer',(window.RRCore.state).defaultCareer); window.RRCore.runtime.bind('career',(window.RRCore.state).career); window.RRCore.runtime.bind('clampNumber',(window.RRCore.state).clampNumber); window.RRCore.runtime.bind('saveCareer',(window.RRCore.state).saveCareer); window.RRCore.runtime.bind('loadCareer',(window.RRCore.state).loadCareer);
window.RRCore.runtime.bind('CARS',(window.RRCore.cars).CARS); window.RRCore.runtime.bind('CAR_SKINS',(window.RRCore.cars).CAR_SKINS); window.RRCore.runtime.bind('SKIN_VARIANTS',(window.RRCore.cars).SKIN_VARIANTS); window.RRCore.runtime.bind('UPG',(window.RRCore.cars).UPG);
globalThis.rrRandom = function rrRandom(channel='visual') { return window.RRCore.rng.random(channel); }
globalThis.money = function money(n) { return 'CR$ ' + Math.floor(n).toLocaleString('pt-BR'); }

globalThis.licenseCarRequirement = function licenseCarRequirement(id){return ({3:5,4:15,5:30,6:45,10:60})[id]||0;}
globalThis.carUnlockReason = function carUnlockReason(car){ if(car.id===0) return 'INICIAL'; const lr=licenseCarRequirement(car.id);if(lr)return `LICENÇAS: ${lr} OUROS ou Fase ${car.unlockLevel} + ${money(car.price)}`; if(car.ghostWins) return `Vença GHOST ${car.ghostWins}x`; if(car.unlockLevel>=999) return 'Fase 999 ou CR$ 750.000'; return `Fase ${car.unlockLevel} + ${money(car.price)}`; }
globalThis.carAvailable = function carAvailable(car){ if(career.unlockedCars.includes(car.id)) return true; const lr=licenseCarRequirement(car.id);if(lr&&(career.licenses?.goldCount||0)>=lr)return true; if(car.ghostWins) return (career.stats.ghostWins||0)>=car.ghostWins; if(car.unlockLevel>=999) return career.level>=999 || career.money>=car.price; return career.level>=car.unlockLevel; }
globalThis.refreshCarUnlocks = function refreshCarUnlocks(){ CARS.forEach(car=>{ const earnedGhost=car.ghostWins && (career.stats.ghostWins||0)>=car.ghostWins; const earnedLegend=car.unlockLevel>=999 && career.level>=999; const earnedFree=car.price===0 && career.level>=car.unlockLevel; if(!career.unlockedCars.includes(car.id) && (earnedGhost||earnedLegend||earnedFree)) career.unlockedCars.push(car.id); }); }
globalThis.currentCar = function currentCar() { return CARS[career.selectedCar] || CARS[0]; }
window.RRCore.runtime.bind('carPaintCache',{color:'#fff',stripe:'#000'});
globalThis.carLivery=function carLivery(id){const v=career.liveries&&career.liveries[id];return v&&v.active!==false?v:null;}
globalThis.carPaint = function carPaint(car){ const custom=carLivery(car.id);if(custom&&custom.base){carPaintCache.color=custom.base;const first=(custom.layers||[]).find(x=>x&&Number(x.pattern)>=0);carPaintCache.stripe=first?.color||car.stripe||'#111';return carPaintCache;} const idx=Math.floor(clampNumber(career.selectedSkin[car.id],0,2,0)); const base=CAR_SKINS[car.id]||[car.color,car.stripe]; if(idx===0){carPaintCache.color=base[0];carPaintCache.stripe=base[1];} else if(idx===1){carPaintCache.color='#111820';carPaintCache.stripe=base[0];} else {carPaintCache.color=car.id===11?'#d7b8ff':'#f5f5f5';carPaintCache.stripe=base[0];} return carPaintCache; }
globalThis.upgradeCost = function upgradeCost(k) { return Math.floor(UPG[k].base * Math.pow(UPG[k].mult, career.upgrades[k])); }
globalThis.currentWeather = function currentWeather(){
    if(runtimeWeather) return runtimeWeather;
    const c=activeCircuit;
    if(!c) return 'clear';
    const env=String(c.environment||'').toLowerCase();
    const base=String(c.weather||'clear').toLowerCase();
    if(c.biome==='mountain' && !['rain','storm','fog','night'].includes(base) && (env.includes('nev')||env.includes('gelo')||env.includes('snow'))) return 'snow';
    if(c.biome==='desert' && base==='clear') return 'heat';
    return base;
}
globalThis.weatherGripMultiplier = function weatherGripMultiplier(){ const w=currentWeather(), tire=career.settings.tire||'MISTO'; if(w==='rain'||w==='storm'){ if(tire==='CHUVA') return 1.02; if(tire==='SLICK') return .86; return .93; } if(w==='snow') return tire==='SLICK'?.78:.82; return tire==='CHUVA'?.97:1; }
window.RRCore.runtime.bind('DIFF_FACTORS',{FACIL:{ai:.94,damage:.72,fuel:.88},NORMAL:{ai:1,damage:1,fuel:1},HEROI:{ai:1.035,damage:1.12,fuel:1.06},LENDA:{ai:1.07,damage:1.42,fuel:1.20}});
globalThis.difficultyFactors = function difficultyFactors(){ return DIFF_FACTORS[career.settings.difficulty||'NORMAL']||DIFF_FACTORS.NORMAL; }
window.RRCore.runtime.bind('calcModsCache',{maxSpeed:0,accel:0,grip:1,armor:1,fuelCapacity:1,fuelUse:1,nitroPower:1,brakePower:1,heatControl:1,draftPower:1});
globalThis.calcMods = function calcMods() {
    const car=currentCar(), dmg=clampNumber(career.carDamage[car.id],0,1,0), df=difficultyFactors(), m=calcModsCache;
    m.maxSpeed=maxSpeed*car.speed*(1+career.upgrades.engine*.075)*(1+career.upgrades.aero*.015)*(1-dmg*.20);
    m.accel=accel*(car.accel||car.speed)*(1+career.upgrades.engine*.045+career.upgrades.ecu*.035)*(1-dmg*.16);
    m.grip=car.grip*(1+career.upgrades.tires*.10+career.upgrades.suspension*.035)*weatherGripMultiplier();
    m.armor=car.armor*(1+career.upgrades.armor*.17)/df.damage; m.fuelCapacity=1+career.upgrades.tank*.14;
    m.fuelUse=car.fuel*(1-career.upgrades.tank*.035)*df.fuel; m.nitroPower=car.nitro*(1+career.upgrades.turbo*.12);
    m.brakePower=1+career.upgrades.brakes*.08; m.heatControl=1-career.upgrades.radiator*.08; m.draftPower=1+career.upgrades.aero*.035; const r=globalThis.riftModifierSnapshot&&raceContext&&raceContext.mode==='rift'?riftModifierSnapshot():null;if(r){m.maxSpeed*=r.speed;m.accel*=r.accel;m.grip*=r.grip*(currentWeather()==='rain'||currentWeather()==='storm'?r.wetPenalty:1);m.armor/=Math.max(.25,r.damage);m.fuelUse*=r.fuelUse;m.nitroPower*=r.nitro;m.draftPower*=r.draft;}const sm=globalThis.seasonModifierSnapshot?seasonModifierSnapshot():null;if(sm){m.maxSpeed*=sm.speed||1;m.grip*=sm.grip||1;m.armor/=Math.max(.25,sm.damage||1);m.fuelUse*=sm.fuelUse||1;m.nitroPower*=sm.nitro||1;m.draftPower*=sm.draft||1;} return m;
}

