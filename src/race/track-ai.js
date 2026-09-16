// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
globalThis.posMod = function posMod(n, max) { return ((n % max) + max) % max; }
window.RRCore.runtime.bind('parallaxPhasePool',Array.from({length:8}, () => ({phase:0, baseIndex:0})));
window.RRCore.runtime.bind('parallaxPhaseCursor',0);
globalThis.parallaxPhase = function parallaxPhase(offset, tile) {
    const phase = posMod(offset, tile);
    const out = parallaxPhasePool[parallaxPhaseCursor++ & 7];
    out.phase = phase;
    out.baseIndex = Math.floor((offset - phase) / tile);
    return out;
}
globalThis.getSegment = function getSegment(z) { if (!segments.length || trackZLength <= 0) return null; const idx = Math.floor(posMod(z, trackZLength) / segmentLength) % segments.length; return segments[idx]; }
globalThis.hashNumber = function hashNumber(n) { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); }
globalThis.project = function project(p, camX, camY, camZ, camD, cw, ch, frw) {
    p.camera.x = (p.world.x || 0) - camX;
    p.camera.y = (p.world.y || 0) - camY;
    p.camera.z = (p.world.z || 0) - camZ;
    p.screen.scale = camD / p.camera.z;
    p.screen.x = Math.floor(cw / 2 + p.screen.scale * p.camera.x * cw / 2);
    p.screen.y = Math.floor(ch / 2 - p.screen.scale * p.camera.y * ch / 2);
    p.screen.w = Math.floor(p.screen.scale * frw * cw / 2);
}
globalThis.formatTime = function formatTime(sec) { if (!Number.isFinite(sec)) return '--:--.-'; const m = Math.floor(sec / 60); const s = Math.floor(sec % 60); const d = Math.floor((sec % 1) * 10); return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}.${d}`; }

window.RRCore.runtime.bind('BIOME_ORDER',['grass','desert','city','mountain']);
globalThis.getCircuitDefinition = function getCircuitDefinition(level = raceLevel) {
    const list = window.RetroRacerCircuits999 || [];
    const idx = MathUtils.limit(Math.floor(Number(level) || 1), 1, 999) - 1;
    return list[idx] || null;
}
globalThis.raceBiome = function raceBiome() { const c = getCircuitDefinition(); return c && c.biome ? c.biome : BIOME_ORDER[Math.floor((raceLevel - 1) / 3) % BIOME_ORDER.length]; }
globalThis.biomeLabel = function biomeLabel(b) { const c = getCircuitDefinition(); if (c) return c.cupName || c.environment || c.name; return b === 'grass' ? 'Copa Iniciante' : b === 'desert' ? 'Deserto Árido' : b === 'city' ? 'Neon City' : 'Vale Nevado'; }
globalThis.circuitSubtitle = function circuitSubtitle(c) { if (!c) return `Fase ${raceLevel} · Prepare o carro e vá para a pista.`; return `Fase ${raceLevel} · ${c.cupName} · ${c.environment} · ${c.timeOfDay} · ${c.weatherLabel} · ${c.signature}`; }
globalThis.getBiomeColors = function getBiomeColors(biome) {
    const c = activeCircuit || getCircuitDefinition();
    if (c && c.palette) return c.palette;
    switch (biome) {
        case 'grass': return { grass:'#16a821', grass2:'#119d1a', shoulder:'#3e842d', skyTop:'#58d1ef', skyBot:'#a7f2ff', mountColor:'#1b8a25', mountSnow:false, road:'#5f6066', road2:'#5b5c62' };
        case 'desert': return { grass:'#d4a843', grass2:'#c99a3a', shoulder:'#b8852f', skyTop:'#ffb347', skyBot:'#ffe0a0', mountColor:'#c48b3c', mountSnow:false, road:'#67605d', road2:'#5f5956' };
        case 'mountain': return { grass:'#dfe8f2', grass2:'#cdd9e6', shoulder:'#96a9b8', skyTop:'#89cff0', skyBot:'#d4eefc', mountColor:'#5c6b7a', mountSnow:true, road:'#626b78', road2:'#59626f' };
        case 'city': return { grass:'#454558', grass2:'#383848', shoulder:'#303040', skyTop:'#1f1f44', skyBot:'#5c507a', mountColor:'#29293d', mountSnow:false, road:'#4a4a55', road2:'#44444f' };
        default: return { grass:'#16a821', grass2:'#119d1a', shoulder:'#3e842d', skyTop:'#58d1ef', skyBot:'#a7f2ff', mountColor:'#1b8a25', mountSnow:false, road:'#5f6066', road2:'#5b5c62' };
    }
}
globalThis.lastY = function lastY() { return segments.length === 0 ? 0 : segments[segments.length - 1].p2.world.y; }
globalThis.addSegment = function addSegment(curve, y, meta = {}) {
    const n = segments.length;
    const circuit = activeCircuit || getCircuitDefinition();
    const biome = meta.biome || (circuit && circuit.biome) || raceBiome();
    const c = meta.palette || getBiomeColors(biome);
    const isRumble = Math.floor(n / rumbleLength) % 2;
    const roadScale = MathUtils.limit(Number(meta.width || meta.w || 1), .72, 1.28);
    segments.push({ index:n, p1:{ world:{ y:lastY(), z:n * segmentLength }, camera:{}, screen:{} }, p2:{ world:{ y, z:(n + 1) * segmentLength }, camera:{}, screen:{} }, curve, biome, colors:c, rumbleAlt:isRumble, decorations:[], pit:false, roadScale, feature:meta.feature || '' });
}
globalThis.addRoad = function addRoad(enter, hold, leave, curve, y, meta = {}) {
    const startY = lastY();
    const endY = startY + y * segmentLength;
    const total = Math.max(1, enter + hold + leave);
    enter = Math.max(1, Math.floor(enter)); hold = Math.max(1, Math.floor(hold)); leave = Math.max(1, Math.floor(leave));
    for (let i = 0; i < enter; i++) addSegment(MathUtils.easeIn(0, curve, i / enter), MathUtils.easeInOut(startY, endY, i / total), meta);
    for (let i = 0; i < hold; i++) addSegment(curve, MathUtils.easeInOut(startY, endY, (enter + i) / total), meta);
    for (let i = 0; i < leave; i++) addSegment(MathUtils.easeInOut(curve, 0, i / leave), MathUtils.easeInOut(startY, endY, (enter + hold + i) / total), meta);
}
globalThis.closeTrackHeight = function closeTrackHeight() { const curY = lastY(); if (Math.abs(curY) < .001) { if (segments.length) segments[segments.length - 1].p2.world.y = 0; return; } addRoad(90, 130, 90, 0, -curY / segmentLength, { width:1, feature:'fechamento de altitude' }); if (segments.length) segments[segments.length - 1].p2.world.y = 0; }
globalThis.addDecoration = function addDecoration(index, offset, type) { const seg = segments[index]; if (!seg) return; seg.decorations.push({ offset, type }); }
globalThis.markPit = function markPit(start, len) {
    start = MathUtils.limit(Math.floor(start), 18, Math.max(18, segments.length - len - 8));
    for (let i = start; i < start + len && i < segments.length; i++) segments[i].pit = true;
    addDecoration(Math.max(0,start-30), 1.72, 'pit200'); addDecoration(Math.max(0,start-15),1.78,'pit100'); addDecoration(start, 1.92, 'pitSign');
    addDecoration(start + Math.floor(len * .55), 1.82, 'pitCrew');
}
globalThis.markFeatureRange = function markFeatureRange(start,len,name){ const a=Math.max(0,Math.floor(start)),b=Math.min(segments.length,a+Math.max(1,Math.floor(len))); for(let i=a;i<b;i++){ if(segments[i]&&!segments[i].pit) segments[i].feature=name; } }
globalThis.authorSetPieces = function authorSetPieces(circuit){
    if(!circuit||!segments.length)return; const env=String(circuit.environment||'').toLowerCase(), n=segments.length, id=Number(circuit.id||0);
    if(env.includes('porto')) markFeatureRange(n*.28,n*.07,'porto');
    if(env.includes('cânion')||env.includes('canion')) markFeatureRange(n*.42,n*.08,'canyon');
    if(env.includes('cidade')||env.includes('megacidade')){ markFeatureRange(n*.24,n*.055,'viaduto'); markFeatureRange(n*.63,n*.06,'túnel'); }
    if(env.includes('vale nevado')) markFeatureRange(n*.48,n*.055,'ponte');
    if(env.includes('costa')) markFeatureRange(n*.36,n*.055,'ponte costeira');
    if(id%27===0) markFeatureRange(n*.78,n*.07,'arquibancada final');
    if(id===27) markFeatureRange(n*.12,n*.065,'ponte campeonato');
    if(id===333) markFeatureRange(n*.18,n*.075,'canyon lendário');
    if(id===666) markFeatureRange(n*.32,n*.075,'túnel neon');
    if(id===999){ markFeatureRange(n*.14,n*.06,'porto eclipse'); markFeatureRange(n*.56,n*.075,'túnel eclipse'); markFeatureRange(n*.82,n*.08,'arquibancada lendária'); }
}
globalThis.decorateTrack = function decorateTrack(circuit = activeCircuit) {
    const decoStep = circuit ? MathUtils.limit(30 + Math.floor((1 - circuit.difficulty) * 12), 26, 42) : 36;
    for (let i = 30; i < segments.length - 28; i += decoStep) {
        const biome = segments[i].biome;
        if (biome === 'city') { addDecoration(i, -1.42, 'lampPost'); addDecoration(i + Math.floor(decoStep/2), 1.42, 'lampPost'); }
        else { addDecoration(i, -1.42, 'marker'); addDecoration(i + Math.floor(decoStep/2), 1.42, 'marker'); }
    }
    for (let i = 55 + ((circuit && circuit.id) ? circuit.id % 40 : 0); i < segments.length - 40; i += 105 + (((circuit && circuit.id) || 0) % 37)) {
        const biome = segments[i].biome;
        if (biome === 'desert') { addDecoration(i, -1.9, 'cactus'); addDecoration(i + 30, 1.9, 'cactus'); }
        else if (biome === 'city') { addDecoration(i, -1.9, 'billboard'); addDecoration(i + 45, 1.9, 'billboard'); }
        else { addDecoration(i, -1.9, 'tree'); addDecoration(i + 60, 1.9, 'pine'); }
    }
    for (let i = 80; i < segments.length - 70; i += 160 + (((circuit && circuit.id) || 0) % 50)) { addDecoration(i, -2.0, 'flag'); addDecoration(i + 35, 2.0, 'flag'); }
    for (let i = 45; i < segments.length - 16; i += 22 + (((circuit && circuit.id) || 0) % 11)) { const cv = segments[i].curve; if (Math.abs(cv) > 1.8) { const side = cv > 0 ? 1.68 : -1.68; addDecoration(i, side, cv > 0 ? 'chevronRight' : 'chevronLeft'); } }
    for (let i = 60; i < segments.length - 50; i += 135 + (((circuit && circuit.id) || 0) % 65)) { addDecoration(i, -2.15, 'signPost'); addDecoration(i + 70, 2.15, 'signPost'); }
    const pits = circuit && Array.isArray(circuit.pits) ? circuit.pits : [.18,.52,.82];
    pits.forEach((p, ix) => markPit(Math.floor(segments.length * p), 48 + (((circuit && circuit.id) || ix) % 18)));
    authorSetPieces(circuit);
}
globalThis.buildTrack = function buildTrack() {
    segments = [];
    activeCircuit = getCircuitDefinition();
    if (activeCircuit && Array.isArray(activeCircuit.sections) && activeCircuit.sections.length) {
        activeCircuit.sections.forEach(s => addRoad(s.e, s.h, s.l, s.c, s.y, { width:s.w, feature:s.f }));
        closeTrackHeight();
        decorateTrack(activeCircuit);
        trackZLength = segments.length * segmentLength;
        targetGoldTime = totalLaps * trackZLength / (maxSpeed * (activeCircuit.goldSpeedFactor || .68));
        return;
    }
    const diff = Math.min(1.25, 1 + (raceLevel - 1) * .018);
    addRoad(50, 80, 50, 0, 0);
    addRoad(45, 80, 45, 3.0 * diff, 15);
    addRoad(40, 70, 40, -4.2 * diff, -12);
    addRoad(60, 100, 60, 0, 32);
    addRoad(50, 90, 50, 5.0 * diff, -22);
    addRoad(50, 90, 50, -5.0 * diff, 10);
    addRoad(80, 80, 80, 2.2 * diff, 0);
    addRoad(65, 100, 65, 0, 0);
    closeTrackHeight();
    decorateTrack();
    trackZLength = segments.length * segmentLength;
    targetGoldTime = totalLaps * trackZLength / (maxSpeed * .68);
}

globalThis.initCars = function initCars() {
    cars = [];
    const names = ['VIPER','REX','NOVA','BLAZE','FALCON','TURBO','RAY','ATOM','VENOM','FLASH','KARTZ','NITRO','DRACO','JET','BOLT','RUSH','NEON','STORM','AXEL','RAVEN','FOX','GHOST'];
    const templates = [
        { color:'#161616', model:'sport', stripe:'#ffcc00', base:.650, offset:-.66, style:'rival', fuel:.95 },
        { color:'#ff245d', model:'sport', stripe:'#ffffff', base:.500, offset:-.66, style:'blocker', fuel:1 },
        { color:'#1f7cff', model:'coupe', stripe:'#ffcc00', base:.515, offset:.62, style:'balanced', fuel:1 },
        { color:'#29d862', model:'rally', stripe:'#111111', base:.530, offset:-.42, style:'curve', fuel:1 },
        { color:'#ff8a16', model:'muscle', stripe:'#ffffff', base:.545, offset:.38, style:'straight', fuel:1 },
        { color:'#b84dff', model:'sport', stripe:'#00f0ff', base:.560, offset:-.18, style:'unstable', fuel:1 },
        { color:'#00d5ff', model:'coupe', stripe:'#ffffff', base:.575, offset:.16, style:'balanced', fuel:1 },
        { color:'#ff4bd8', model:'rally', stripe:'#111111', base:.590, offset:-.58, style:'curve', fuel:1 },
        { color:'#a8ff00', model:'muscle', stripe:'#222222', base:.605, offset:.55, style:'straight', fuel:1 },
        { color:'#ff3838', model:'sport', stripe:'#ffffff', base:.620, offset:-.32, style:'aggressive', fuel:1 },
        { color:'#00ffaa', model:'coupe', stripe:'#111111', base:.635, offset:.30, style:'balanced', fuel:1 },
        { color:'#ffd000', model:'rally', stripe:'#222222', base:.650, offset:-.72, style:'curve', fuel:1 },
        { color:'#6f8cff', model:'muscle', stripe:'#ffffff', base:.665, offset:.70, style:'straight', fuel:1 },
        { color:'#ff6b2b', model:'sport', stripe:'#101010', base:.610, offset:-.50, style:'unstable', fuel:1 },
        { color:'#55ff55', model:'coupe', stripe:'#ffffff', base:.625, offset:.48, style:'balanced', fuel:1 },
        { color:'#ff9edb', model:'rally', stripe:'#111111', base:.640, offset:-.08, style:'curve', fuel:1 },
        { color:'#22aaff', model:'muscle', stripe:'#ffcc00', base:.655, offset:.08, style:'straight', fuel:1 },
        { color:'#c8ff3d', model:'sport', stripe:'#000000', base:.670, offset:-.60, style:'aggressive', fuel:1 },
        { color:'#d45cff', model:'coupe', stripe:'#ffffff', base:.685, offset:.58, style:'balanced', fuel:1 },
        { color:'#ffb000', model:'rally', stripe:'#ffffff', base:.700, offset:-.36, style:'curve', fuel:1 },
        { color:'#00c27a', model:'muscle', stripe:'#111111', base:.715, offset:.34, style:'straight', fuel:1 },
        { color:'#8bd6ff', model:'coupe', stripe:'#111111', base:.705, offset:.22, style:'unstable', fuel:1 }
    ];
    const ghostTune=globalThis.getGhostLearnedTune?getGhostLearnedTune():{speedBonus:0,lineBias:.22,aggression:.5,curveConfidence:1,nitroPoint:.5,races:0};
    for (let i = 0; i < templates.length; i++) {
        const t = names[i] === 'GHOST' ? {...templates[i], color:'#080808', stripe:'#ffcc00', style:'rival', base:.735, offset:.22} : templates[i];
        const gridRow=Math.floor(i/2), gridOffset=(i%2===0?-.58:.58); const prog = playerZ + 1200 + gridRow * 1120;
        cars.push({
            id:i, name:names[i], progress:prog, z:posMod(prog, trackZLength), offset:gridOffset, originalOffset:t.offset, laneBias:gridOffset,
            color:t.color, model:t.model, stripe:t.stripe, aiStyle:t.style, baseSpeed:maxSpeed * t.base * (1 + Math.min(.16, (raceLevel - 1) * .012)) * (names[i]==='GHOST'?(1+ghostTune.speedBonus)*(globalThis.legendaryGhostMultiplier?legendaryGhostMultiplier():1):1), speed:maxSpeed * t.base,
            previousSpeed:maxSpeed * t.base, wobble:i * .71, braking:false, steerVisual:0, nitroBurst:0, aggression:names[i]==='GHOST'?MathUtils.limit(1.12+ghostTune.aggression*.34,1.18,1.48):t.style === 'rival' ? 1.45 : t.style === 'blocker' ? 1.42 : t.style === 'aggressive' ? 1.35 : t.style === 'unstable' ? 1.18 : 1,
            curveSkill:t.style === 'curve' ? .65 : t.style === 'straight' ? 1.2 : 1, straightSkill:t.style === 'straight' || t.style === 'rival' ? 1.18 : 1,
            fuel:1.35, maxFuel:1.35, ghostLearned:names[i]==='GHOST'?ghostTune:null, ghostNitroLap:0, profileRadioUsed:false, pitted:false, out:false, country:['BRX','JPN','USA','ITA','FRA','ESP','GBR','ARG','MEX','CAN','KOR'][i%11], quote:['Sem espaço.','Freio é opcional.','Caçando vácuo.','Curva é território.','Reta é minha.'][i%5], radioCooldown:0
        });
    }
    totalRacersDisplay.innerText = String(cars.length + 1);
    posDisplay.innerText = String(cars.length + 1);
    lastRacePosition = cars.length + 1;
}
globalThis.updateCars = function updateCars(dt, playerCarProgress) {
    cars.forEach(car => {
        const seg = getSegment(car.z);
        const curve = seg ? Math.abs(seg.curve) : 0;
        car.previousSpeed = car.speed;
        if (car.out) { car.speed = MathUtils.interpolate(car.speed, 0, dt * 2); car.progress += car.speed * dt; car.z = posMod(car.progress, trackZLength); return; }
        const personality = 1 + Math.sin(car.progress * .00035 + car.wobble) * .018;
        const curveSlow = curve * .018 * car.curveSkill;
        const straightBonus = curve < .45 ? car.straightSkill : 1;
        const df=difficultyFactors(); const riftAI=globalThis.riftModifierSnapshot&&raceContext.mode==='rift'?riftModifierSnapshot().ai:1; const seasonAI=globalThis.seasonModifierSnapshot?(seasonModifierSnapshot()?.ai||1):1; let targetSpd = car.baseSpeed * personality * straightBonus * (1 - curveSlow) * df.ai * riftAI * seasonAI; if((globalThis.championshipRubberBandEnabled?championshipRubberBandEnabled():career.settings.aiMode==='CAMPEONATO')){const playerRankHint=lastRacePosition||12;if(playerRankHint>=15&&currentLap>=2)targetSpd*=.97;else if(playerRankHint<=3&&car.progress<playerCarProgress-7000)targetSpd*=1.025;}
        const distToPlayer = car.progress - playerCarProgress; car.radioCooldown=Math.max(0,(car.radioCooldown||0)-dt); if(car.name==='VIPER'&&Math.abs(distToPlayer)<1500&&totalRaceTime>5&&car.radioCooldown<=0){globalThis.raceRadioEvent?raceRadioEvent('viper'):radio(STRINGS['pt-BR'].viperClosing,1.35);car.radioCooldown=11;}
        if (car.fuel < car.maxFuel * .34 && seg && seg.pit) { car.laneBias = .94; targetSpd *= .38; car.fuel = MathUtils.limit(car.fuel + dt * .85, 0, car.maxFuel); if (car.fuel > car.maxFuel * .82) car.pitted = true; }
        else if (car.fuel < car.maxFuel * .30) { car.laneBias = .88; }
        else { car.laneBias = car.name==='GHOST'&&car.ghostLearned&&car.ghostLearned.races>0?MathUtils.limit(car.ghostLearned.lineBias*.82,-.72,.72):car.originalOffset; }
        if (car.fuel <= 0.01) { targetSpd = 0; car.out = true; }
        if (car.aiStyle === 'aggressive' || car.aiStyle === 'rival') targetSpd *= 1.018; if(car.aiStyle==='blocker') targetSpd*=1.006;
        if (car.aiStyle === 'unstable') { targetSpd *= 1 + Math.sin(car.progress*.0012+car.wobble)*.022; if(Math.sin(totalRaceTime*.29+car.wobble)>.997) car.laneBias=MathUtils.limit(car.originalOffset+(Math.sin(totalRaceTime*3+car.wobble)>.0?.16:-.16),-.95,.95); }
        if(car.name==='GHOST'&&currentLap===totalLaps&&(lastRacePosition||2)===1&&!car.ghostAttackUsed&&totalRaceTime>8){car.ghostAttackUsed=true;car.nitroBurst=1.15;globalThis.raceRadioEvent?raceRadioEvent('ghost'):radio('GHOST ATACANDO',1.6);}
        if (curve > 2.4 && car.aiStyle !== 'curve') targetSpd *= car.name==='GHOST'&&car.ghostLearned?(.955*car.ghostLearned.curveConfidence):.955; if(car.name==='GHOST'&&car.ghostLearned&&car.ghostLearned.races>0&&!car.profileRadioUsed&&totalRaceTime>3){car.profileRadioUsed=true;radio(ghostRadioLine(),2.2);}
        car.speed = MathUtils.interpolate(car.speed, targetSpd, dt * 1.35);
        if(car.name==='REX'&&Math.abs(distToPlayer)<1250&&totalRaceTime>6&&car.radioCooldown<=0){if(globalThis.raceRadioEvent)raceRadioEvent('rex');car.radioCooldown=10;}
        if (distToPlayer > 0 && distToPlayer < 2600 && MathUtils.overlap(playerX, .44, car.offset, .44, 1.18)) { const closeDir = playerX > car.offset ? -1 : 1; const blockDir = car.aiStyle === 'aggressive' || car.aiStyle === 'rival' || car.aiStyle === 'blocker' ? -closeDir * (car.aiStyle==='blocker'?.65:.45) : closeDir; car.offset += blockDir * dt * 1.35 * car.aggression; car.speed *= .996; }
        for (const other of cars) { if (other.id === car.id) continue; const dz = other.progress - car.progress; if (dz > -420 && dz < 620 && MathUtils.overlap(car.offset, .34, other.offset, .34, 1.0)) { const side = car.offset >= other.offset ? 1 : -1; car.offset += side * dt * .72; car.speed *= dz > 0 ? .996 : 1.001; } }
        const weave = car.aiStyle === 'unstable' ? .11 : car.aiStyle === 'aggressive' || car.aiStyle === 'rival' || car.aiStyle==='blocker' ? .075 : .045;
        car.offset += Math.sin(car.progress * .00075 + car.wobble) * dt * weave;
        if (seg) car.offset -= seg.curve * dt * .018;
        car.offset = MathUtils.interpolate(car.offset, car.laneBias, dt * .18);
        car.offset = MathUtils.limit(car.offset, -.98, .98);
        car.steerVisual = MathUtils.interpolate(car.steerVisual, seg ? MathUtils.limit(seg.curve * .22, -1, 1) : 0, dt * 5);
        car.braking = car.previousSpeed > car.speed * 1.003 || curve > 2.6 || (distToPlayer > 0 && distToPlayer < 1200 && Math.abs(playerX - car.offset) < .22);
        if(car.name==='GHOST'&&car.ghostLearned&&car.ghostLearned.races>0&&curve<.45&&car.ghostNitroLap!==currentLap){const frac=MathUtils.percentRemaining(car.progress,trackZLength);if(Math.abs(frac-car.ghostLearned.nitroPoint)<.026){car.ghostNitroLap=currentLap;car.nitroBurst=.48;car.fuel=Math.max(0,car.fuel-.014);}} else if (curve < .35 && Math.sin(car.progress * .00022 + car.wobble) > .992 && car.fuel > .18) { car.nitroBurst = .38; car.fuel = Math.max(0, car.fuel - .012); }
        if(car.nitroBurst>0) car.speed=Math.min(maxSpeed*1.16,car.speed+maxSpeed*.18*dt); car.nitroBurst = Math.max(0, car.nitroBurst - dt);
        car.fuel = MathUtils.limit(car.fuel - dt * (.0022 + (car.speed / maxSpeed) * .0038 + (car.nitroBurst > 0 ? .012 : 0)), 0, car.maxFuel);
        car.progress += car.speed * dt;
        car.z = posMod(car.progress, trackZLength);
    });
}

