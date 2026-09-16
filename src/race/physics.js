// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
const PARALLAX_SAMPLES=Object.freeze([0,3,7,12,19,28,40]);
globalThis.getTouchSteerIntent = function getTouchSteerIntent(dt) { if (!touchDrive.active) { lastTouchSteer = MathUtils.interpolate(lastTouchSteer, 0, dt * 10); return lastTouchSteer; } const err = touchDrive.targetX - playerX; const raw = MathUtils.limit(err * 2.65, -1, 1); lastTouchSteer = MathUtils.interpolate(lastTouchSteer, raw, dt * 15); return lastTouchSteer; }
globalThis.setRaceMessage = function setRaceMessage(text, color = '#ffffff', time = 1.45) { raceMessage = text; raceMessageColor = color; raceMessageTimer = time; }
globalThis.emitParticle = function emitParticle(x, y, color, amount = 1, power = 1) { const maxP = activeParticleCap(); for (let i = 0; i < amount; i++) { if (particles.length >= maxP) { const old=particles.shift(); if(old) particlePool.push(old); } const p=particlePool.pop()||{}; p.x=x+(rrRandom('visual')*30-15);p.y=y+(rrRandom('visual')*10-2);p.vx=(rrRandom('visual')-.5)*80*power;p.vy=(-28-rrRandom('visual')*70)*power;p.life=.66+rrRandom('visual')*.24;p.size=2.6+rrRandom('visual')*5.2;p.grow=12+rrRandom('visual')*14;p.color=color; particles.push(p); } }
globalThis.updateParticles = function updateParticles(dt) { for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .985; p.vy += 55 * dt; p.size += p.grow * dt; p.life -= dt * 1.55; if (p.life <= 0) { particles.splice(i,1); if(particlePool.length<220) particlePool.push(p); } } }
globalThis.drawParticles = function drawParticles() { for (const p of particles) { ctx.globalAlpha = Math.max(0, Math.min(1, p.life)); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
globalThis.updateDraft = function updateDraft(dt, playerCarProgress) { let bestDraft = 0; for (const car of cars) { const dist = car.progress - playerCarProgress; if (dist > 180 && dist < 1200 && Math.abs(playerX - car.offset) < .24 && speed > maxSpeed * .34) bestDraft = Math.max(bestDraft, 1 - dist / 1200); } if (bestDraft > 0) draftTimer = MathUtils.limit(draftTimer + dt * (.65 + bestDraft), 0, 1.35); else draftTimer = MathUtils.limit(draftTimer - dt * 1.6, 0, 1.35); draftBoost = MathUtils.limit(draftTimer / 1.35, 0, 1); if (bestDraft > .08) nitro = MathUtils.limit(nitro + dt * (.018 + bestDraft * .055), 0, 1); }
globalThis.effectiveQuality = function effectiveQuality(){return runtimeQuality||career.settings.quality||'HIGH';}
globalThis.qualityHigh = function qualityHigh(){return ['HIGH','CRT'].includes(effectiveQuality());}
globalThis.activeDrawDistance = function activeDrawDistance(){let q=effectiveQuality(),d=q==='LOW'?180:q==='MED'?240:q==='CRT'?270:300;const w=currentWeather();if(w==='fog')d=Math.floor(d*.74);return d;}
globalThis.activeParticleCap = function activeParticleCap(){const q=effectiveQuality();return q==='LOW'?48:q==='MED'?88:q==='CRT'?112:150;}
window.RRCore.runtime.bind('nextCurveHintCache',{ dir:0, strength:0, distance:14 });
globalThis.getNextCurveHint = function getNextCurveHint() {
    let sum = 0, wsum = 0, first = 0;
    for (let i = 8; i <= 14; i++) { const seg = getSegment(position + playerZ + i * segmentLength); if (!seg) continue; const w = 1 / (1 + (i - 8) * .23); sum += (seg.curve || 0) * w; wsum += w; if (!first && Math.abs(seg.curve || 0) > .55) first = i; }
    const curve = wsum ? sum / wsum : 0;
    nextCurveHintCache.dir = curve > .35 ? 1 : curve < -.35 ? -1 : 0;
    nextCurveHintCache.strength = Math.abs(curve);
    nextCurveHintCache.distance = first || 14;
    return nextCurveHintCache;
}
globalThis.updateCurveHud = function updateCurveHud() {
    lastCurveHint = getNextCurveHint();
    if (!curveHud) return;
    if ((globalThis.isLegendaryMode&&isLegendaryMode()) || !lastCurveHint.dir || speed < maxSpeed * .12 || gameMode !== 'race' || finished || gameOver) { curveHud.classList.remove('show'); return; }
    const hard = lastCurveHint.strength > 2.2;
    curveArrow.textContent = lastCurveHint.dir > 0 ? (hard ? '↪' : '↗') : (hard ? '↩' : '↖');
    curveLabel.textContent = (hard ? 'CURVA FORTE ' : 'CURVA ') + (lastCurveHint.dir > 0 ? 'DIREITA' : 'ESQUERDA');
    curveHud.classList.add('show');
}
globalThis.updatePitHud = function updatePitHud() {
    if (!pitHud) return;
    const pct = Math.round(MathUtils.limit(pitServiceProgress,0,1) * 100);
    pitBarFill.style.width = pct + '%'; pitPct.textContent = pct + '%';
    const stages = pitHud.querySelectorAll('[data-pit-stage]');
    const idx = pct < 25 ? 0 : pct < 62 ? 1 : pct < 88 ? 2 : 3;
    for(let i=0;i<stages.length;i++) stages[i].classList.toggle('active', i <= idx);
    pitStageText.textContent = idx === 0 ? 'PNEUS' : idx === 1 ? 'ABASTECENDO' : idx === 2 ? 'ÁGUA / MOTOR' : 'LIBERANDO';
    pitHud.classList.toggle('show', pitServiceActive || (pitServiceProgress > 0 && pitServiceProgress < 1));
}

globalThis.update = function update(dt) {
    if(globalThis.adaptiveAudioTick)adaptiveAudioTick(dt);
    if (gameMode !== 'race' || gamePaused) { updateAudio(false, false); return; }
    const playerSeg = getSegment(position + playerZ);
    if (!playerSeg) return;
    if (globalThis.updateFtue && updateFtue(dt)) { updateAudio(true,false); return; }
    if (impactFreeze > 0) { impactFreeze = Math.max(0, impactFreeze - dt); if(motionEffectsEnabled()) cameraShake = Math.max(cameraShake, .42); updateAudio(false, false); return; }
    if (goFlashTimer > 0) goFlashTimer = Math.max(0, goFlashTimer - dt);
    if (perfectStartWindow > 0) perfectStartWindow = Math.max(0, perfectStartWindow - dt);
    if (perfectStartBoost > 0) perfectStartBoost = Math.max(0, perfectStartBoost - dt);
    if (jumpStartPenalty > 0) jumpStartPenalty = Math.max(0, jumpStartPenalty - dt);
    if (pitRejectCooldown > 0) pitRejectCooldown = Math.max(0, pitRejectCooldown - dt);
    if (countdownActive) {
        pollGamepad(); const launchVState=virtualState();
        const launchInput = !!(keys.ArrowUp || touchDrive.active || gamepadIntent.accel || launchVState.accel);
        if (launchInput && countdownTimer < .62 && !jumpStartQueued) { jumpStartQueued = true; playSFX('skid'); setRaceMessage('QUEIMOU A LARGADA!', '#ff4b4b', .75); }
        const prevText = countdownText;
        countdownTimer -= dt;
        if (countdownTimer > 2.1) countdownText = '3';
        else if (countdownTimer > 1.1) countdownText = '2';
        else if (countdownTimer > 0.1) countdownText = '1';
        else {
            countdownActive = false;
            countdownText = 'GO!';
            goFlashTimer = .72;
            raceStarted = true;
            career.stats.starts=(career.stats.starts||0)+1; saveCareer();
            playSFX('go'); if(globalThis.raceRadioEvent)raceRadioEvent('start');
            if (jumpStartQueued) { jumpStartPenalty = .40; setRaceMessage('QUEIMOU A LARGADA · +0,4s', '#ff4b4b', 1.05); }
            else { perfectStartWindow = .18; setRaceMessage('GO! · ACERTE O START', '#ffcc00', .72); }
            if(tutorialHintThisRace){touchHint.classList.remove('hidden');setTimeout(() => touchHint.classList.add('hidden'), 3600);tutorialHintThisRace=false;}
        }
        if (countdownActive && countdownText !== prevText) playSFX('beep');
        updateHud(cars.length + 1, cars.length + 1);
        updateAudio(false, false);
        return;
    }
    pollGamepad(); updateRadio(dt); const vstate=virtualState();
    const mods = calcMods();
    const spPct = speed / maxSpeed;
    const kbDx = dt * 2.08 * MathUtils.limit(spPct, 0, 1.2) * mods.grip * (career.settings.sensitivity||1);
    const ftuePrologue=globalThis.isFtuePrologue&&isFtuePrologue();
    const isBrake = !ftuePrologue && (keys.ArrowDown || touchDrive.brake || gamepadIntent.brake || vstate.brake);
    const copilotThrottle=!isBrake&&globalThis.copilotAutoThrottle&&copilotAutoThrottle();
    const isAccel = (globalThis.ftueAutoAccel&&ftueAutoAccel()) || copilotThrottle || keys.ArrowUp || touchDrive.active || gamepadIntent.accel || vstate.accel;
    const nitroRequested = !ftuePrologue && (keys.Nitro || touchDrive.nitro || gamepadIntent.nitro || vstate.nitro);
    if (nitroRequested && !nitroWasRequested) { nitroArmTimer = .12; if(globalThis.hapticEvent)hapticEvent('nitroCharge'); }
    nitroWasRequested = nitroRequested;
    if (nitroArmTimer > 0) nitroArmTimer = Math.max(0, nitroArmTimer - dt);
    const nitroBlocked=globalThis.riftNitroDisabled&&riftNitroDisabled();const nitroInfinite=globalThis.riftNitroInfinite&&riftNitroInfinite();const nitroActive = !nitroBlocked && !finished && !gameOver && nitroRequested && nitroArmTimer <= 0 && (nitroInfinite||nitro > .02) && fuel > .01 && speed > maxSpeed * .16 && !isBrake;
    if (!nitroWasActive && nitroActive) { playSFX('nitro'); if(globalThis.hapticEvent)hapticEvent('nitroOn'); }
    nitroWasActive = nitroActive;
    if (perfectStartWindow > 0 && isAccel && !jumpStartQueued) { perfectStartWindow = 0; perfectStartBoost = .35; speed = Math.max(speed, maxSpeed * .12); if(globalThis.requestPerfectStartFlash)requestPerfectStartFlash(); playSFX('go'); setRaceMessage('PERFECT START!', '#55ff55', .95); }
    const scrBaseX = width / 2;
    const scrBaseY = height - Math.max(34, height * .072);
    let replaySteerIntent = 0;
    if ((isAccel || isBrake || keys.ArrowLeft || keys.ArrowRight || nitroActive) && !finished && !gameOver) raceStarted = true;
    if (playerCollisionCooldown > 0) playerCollisionCooldown -= dt;
    if (raceMessageTimer > 0) raceMessageTimer -= dt;
    if (pitTimer > 0) pitTimer -= dt;

    if (!finished && !gameOver) {
        playerX -= kbDx * MathUtils.limit(spPct, 0, 1.2) * playerSeg.curve * centrifugal / Math.max(.75, mods.grip);
        let steerIntent = touchDrive.active ? getTouchSteerIntent(dt) : MathUtils.limit(gamepadIntent.steer+(vstate.left?-1:0)+(vstate.right?1:0),-1,1);
        if(!touchDrive.active){if(keys.ArrowLeft)steerIntent=-1;if(keys.ArrowRight)steerIntent=1;}
        const assistSteer=globalThis.a11ySteerAssist?a11ySteerAssist(playerSeg,spPct,playerX,steerIntent):0;steerIntent=MathUtils.limit(steerIntent+assistSteer,-1,1);
        if(touchDrive.active) playerX += steerIntent * dt * (.85 + MathUtils.limit(spPct,0,1.3)*2.35)*mods.grip; else if(Math.abs(steerIntent)>.001) playerX+=steerIntent*kbDx;
        replaySteerIntent = steerIntent;
        if(currentWeather()==='storm') playerX += Math.sin(totalRaceTime*1.7+raceLevel)*dt*.085;
        playerX = MathUtils.limit(playerX, -2, 2);
        if (fuel <= .001) { speed = MathUtils.limit(speed + decel * 1.65 * dt, 0, maxSpeed); }
        else if (isBrake) speed = MathUtils.limit(speed + breaking * mods.brakePower * dt, 0, maxSpeed * 1.18);
        else if (isAccel && jumpStartPenalty <= 0) speed = MathUtils.limit(speed + mods.accel * dt, 0, mods.maxSpeed);
        else speed = MathUtils.limit(speed + decel * dt, 0, maxSpeed * 1.18);
        if(ftuePrologue) speed=Math.min(speed,maxSpeed*.30);
        if (perfectStartBoost > 0) speed = MathUtils.limit(speed + maxSpeed * .62 * dt, 0, maxSpeed * 1.08);
        updateDraft(dt, playerProgress + playerZ);
        if (draftBoost > .05 && speed > maxSpeed * .32 && fuel > .01) speed = MathUtils.limit(speed + maxSpeed * .105 * draftBoost * dt, 0, maxSpeed * 1.10);
        if (nitroActive) { const heatMult=(currentWeather()==='heat'?1.18:1)*mods.heatControl; if(!nitroInfinite)nitro = MathUtils.limit(nitro - dt * .34 * heatMult, 0, 1); fuel = MathUtils.limit(fuel - dt * .020 * mods.fuelUse, 0, mods.fuelCapacity); speed = MathUtils.limit(speed + maxSpeed * .48 * mods.nitroPower * dt, 0, maxSpeed * (1.18 + career.upgrades.turbo * .015)); if(motionEffectsEnabled()) cameraShake = Math.max(cameraShake, .28); nitroFlamePulse += dt * 16; if (rrRandom('visual') < .45) emitParticle(scrBaseX + (rrRandom('visual') * 24 - 12), scrBaseY + 3, globalThis.riskTrailParticleColor?riskTrailParticleColor(rrRandom('visual')>.45):(rrRandom('visual') > .45 ? 'rgba(255,140,0,0.88)' : 'rgba(80,210,255,0.78)'), 1, 1.0); }
        else { const regen = speed < maxSpeed * .38 ? .028 : .012; nitro = MathUtils.limit(nitro + dt * regen, 0, 1); }
        cameraShake *= Math.pow(.045, dt);
        const fuelSpend = ((speed / maxSpeed) * .0048 + (isAccel ? .0036 : .0016)) * mods.fuelUse;
        if(!ftuePrologue) fuel = MathUtils.limit(fuel - fuelSpend * dt, 0, mods.fuelCapacity);
        const inPitLane = playerSeg.pit && playerX > .84;
        if (inPitLane && speed >= maxSpeed * .28) { pitServiceActive = false; if (pitRejectCooldown <= 0) { pitRejectCooldown = .55; playSFX('skid'); } setRaceMessage('REDUZA PARA ABASTECER', '#ff4b4b', .28); }
        else if (inPitLane && speed < maxSpeed * .28) {
            if(globalThis.riftPitDisabled&&riftPitDisabled()){pitServiceActive=false;setRaceMessage('FENDA · BOX BLOQUEADO','#ff4b4b',.35);speed*=.97;} else {
            pitServiceActive = true; speed *= .935;
            const pitDuration = MathUtils.limit(2.25 - career.upgrades.tank * .08, 1.72, 2.25);
            pitServiceProgress = MathUtils.limit(pitServiceProgress + dt / pitDuration, 0, 1);
            if (pitTimer <= 0) { playSFX('pit'); pitTimer = .34; }
            if (pitServiceProgress > .22) fuel = MathUtils.limit(fuel + dt * 1.25, 0, mods.fuelCapacity);
            setRaceMessage(pitServiceProgress < .25 ? 'PIT · PNEUS' : pitServiceProgress < .62 ? 'PIT · GASOLINA' : pitServiceProgress < .88 ? 'PIT · ÁGUA / MOTOR' : 'PIT · LIBERANDO', '#55ff55', .24);
            if (pitServiceProgress >= 1 && !pitServiceDone) { pitServiceDone = true; racePits++; career.stats.pits=(career.stats.pits||0)+1; nitro = MathUtils.limit(nitro + .40, 0, 1); if(raceContext.mode!=='rift')addDamage(-.08); setRaceMessage('PIT PERFEITO · GO!', '#55ff55', .9); globalThis.raceRadioEvent?raceRadioEvent('pitPerfect'):radio('PIT PERFEITO',1.0); }}
        } else {
            if (pitServiceActive && pitServiceProgress < .70) setRaceMessage('PIT PARCIAL', '#ffcc00', .55);
            pitServiceActive = false;
            if (!playerSeg.pit && (pitServiceDone || pitServiceProgress > 0)) { pitServiceProgress = 0; pitServiceDone = false; }
            if (playerSeg.pit && playerX < .72) { setRaceMessage('PIT STOP À DIREITA', '#ffcc00', .2); if(lastPitRadioLap!==currentLap){lastPitRadioLap=currentLap;globalThis.raceRadioEvent?raceRadioEvent('pitOpen'):radio(STRINGS['pt-BR'].pitOpen,1.35);} }
        }
        updatePitHud();
        if (fuel <= .001 && speed < maxSpeed * .025) { triggerGameOver('PANE SECA: você ficou sem combustível. Use o Pit Stop à direita em baixa velocidade.'); }
        const roadEdge = MathUtils.limit(playerSeg.roadScale || 1, .72, 1.28); if(globalThis.hapticRoadTick)hapticRoadTick(dt,playerSeg,steerIntent,roadEdge); if(globalThis.ghostLearningObserve)ghostLearningObserve(dt,playerSeg,steerIntent,isBrake,nitroRequested); if ((playerX < -roadEdge || playerX > roadEdge) && speed > offRoadLimit) { cleanLapEligible = false; if(motionEffectsEnabled()) cameraShake = Math.max(cameraShake, .36); speed = MathUtils.limit(speed + offRoadDecel * dt, offRoadLimit, maxSpeed * 1.16); raceOffroadSeconds+=dt; if(globalThis.ghostLearnEvent)ghostLearnEvent('offroad',dt); addDamage(dt * .0022 / mods.armor); emitParticle(scrBaseX + (playerX < 0 ? -32 : 32), scrBaseY, 'rgba(139,82,36,0.70)', 2, .9); const edgeDelta=Math.abs(playerX)-roadEdge, feat=String(playerSeg.feature||'').toLowerCase(), guardBiome=['city','mountain'].includes(playerSeg.biome); if(edgeDelta<.24&&(guardBiome||feat.includes('ponte')||feat.includes('viaduto')||feat.includes('túnel')||feat.includes('canyon')))emitGuardrailSparks(scrBaseX+(playerX<0?-38:38),scrBaseY-5,MathUtils.limit(speed/maxSpeed,0,1.2)); }
        if (isBrake && speed > maxSpeed * .08) emitParticle(scrBaseX + steerIntent * 18, scrBaseY - 4, 'rgba(235,235,235,0.58)', 1, .75);
        if(globalThis.updateJuiceEffects)updateJuiceEffects(dt,playerSeg,steerIntent,isBrake);if(globalThis.riskComboTick)riskComboTick(dt,playerSeg,steerIntent,isBrake);
        if (career.carDamage[currentCar().id] >= 1) triggerGameOver('PERDA TOTAL: o chassi chegou a 100% de dano. Repare o carro na garagem.');
    } else speed = MathUtils.limit(speed + decel * dt * 1.4, 0, maxSpeed);

    playerProgress += speed * dt;
    position = posMod(playerProgress, trackZLength);
    if (raceStarted && !finished && !gameOver) {
        currentLapTime += dt; totalRaceTime += dt; if(globalThis.coachTick)coachTick(dt); ghostSampleTimer+=dt; if(ghostSampleTimer>=.05){
                        ghostSampleTimer=0;
                        if(window.RRCore&&window.RRCore.replay) window.RRCore.replay.recordValues(replaySteerIntent,!!isAccel,!!isBrake,!!nitroRequested); if(window.RRCore&&window.RRCore.lapReplay) window.RRCore.lapReplay.recordValues(replaySteerIntent,!!isAccel,!!isBrake,!!nitroRequested); if(globalThis.highlightCaptureInput)highlightCaptureInput(replaySteerIntent,!!isAccel,!!isBrake,!!nitroRequested);
                    }
        if(dynamicWeatherArmed && !dynamicWeatherAnnounced && currentLap>=3){runtimeWeather='rain';dynamicWeatherAnnounced=true;globalThis.raceRadioEvent?raceRadioEvent('weather'):radio(STRINGS['pt-BR'].rainComing,2.1);setRaceMessage('🌧 CHUVA CHEGANDO · AJUSTE A LINHA', '#38d5ff', 2.0);}

        const newLap = Math.floor((playerProgress + playerZ) / trackZLength) + 1;
        if (newLap > currentLap) {
            if (currentLapTime > 5 && globalThis.integrityAcceptLapRecord) integrityAcceptLapRecord(raceLevel,currentLapTime);
            if (currentLapTime > 5 && globalThis.shadowLapComplete) shadowLapComplete(currentLapTime);
            if (currentLapTime > 5 && globalThis.coachLapComplete) coachLapComplete(currentLapTime);
            currentLapTime = 0;
            currentLap = newLap; if(currentLap===totalLaps){if(globalThis.raceRadioEvent)raceRadioEvent('finalLap');else radio(STRINGS['pt-BR'].lastLap,1.8);}
            nitro = MathUtils.limit(nitro + (cleanLapEligible ? .12 : .05), 0, 1);
            if (cleanLapEligible) setRaceMessage('VOLTA LIMPA · NITRO +12%', '#38d5ff', 1.05);
            cleanLapEligible = true;
            addDamage(-.035);
            setRaceMessage('VOLTA ' + MathUtils.limit(currentLap, 1, totalLaps), '#ffcc00', 1.2);
        }
        if (currentLap > totalLaps) finishRace();
    }
    skyOffset = posMod(skyOffset + playerSeg.curve * spPct * .0011, 1);
    hillOffset = posMod(hillOffset + playerSeg.curve * spPct * .0021, 1);
    treeOffset = posMod(treeOffset + playerSeg.curve * spPct * .0035, 1);

    // V42: parallax por camadas reais para todos os biomas.
    // A leitura usa a curva atual + a curva à frente para seguir o carro sem zig-zag.
    let lookAheadCurve = 0;
    let lookAheadWeight = 0;
    for (let i = 0; i < PARALLAX_SAMPLES.length; i++) {
        const s = getSegment(position + PARALLAX_SAMPLES[i] * segmentLength);
        const w = 1 / (1 + i * .42);
        if (s) { lookAheadCurve += (s.curve || 0) * w; lookAheadWeight += w; }
    }
    lookAheadCurve = lookAheadWeight ? lookAheadCurve / lookAheadWeight : (playerSeg.curve || 0);

    const activeBiome = playerSeg ? playerSeg.biome : raceBiome();
    const curvePower = MathUtils.limit(((playerSeg.curve || 0) * .34 + lookAheadCurve * .66) * spPct, -3.35, 3.35);
    const cityCurvePower = curvePower;
    const cityEase = MathUtils.limit(dt * 2.9, 0, 1);
    cityParallaxSpeed += (cityCurvePower - cityParallaxSpeed) * cityEase;
    if (Math.abs(cityCurvePower) < 0.025) cityParallaxSpeed *= Math.pow(0.22, dt);

    cityFarOffset += cityParallaxSpeed * dt * 14.0;
    cityMidOffset += cityParallaxSpeed * dt * 25.0;
    cityNearOffset += cityParallaxSpeed * dt * 43.0;
    cityDeckOffset += cityParallaxSpeed * dt * 56.0;

    // Nos demais biomas, um pouco mais lento que a cidade e sem rodopio.
    const globalCurvePower = MathUtils.limit(curvePower, -2.85, 2.85);
    const globalEase = MathUtils.limit(dt * 2.35, 0, 1);
    globalParallaxSpeed += (globalCurvePower - globalParallaxSpeed) * globalEase;
    if (Math.abs(globalCurvePower) < 0.025) globalParallaxSpeed *= Math.pow(0.28, dt);

    const tune = biomeParallaxTuning(activeBiome);
    const globalBaseSpeed = activeBiome === 'city' ? 0 : 44.0;
    globalSkyPx += globalParallaxSpeed * dt * globalBaseSpeed * tune.sky;
    globalMountainFarPx += globalParallaxSpeed * dt * globalBaseSpeed * tune.far;
    globalMountainMidPx += globalParallaxSpeed * dt * globalBaseSpeed * tune.mid;
    globalGroundNearPx += globalParallaxSpeed * dt * globalBaseSpeed * tune.near;

    const pcp = playerProgress + playerZ;
    updateCars(dt, pcp);
    if(!finished&&!gameOver) for (const car of cars) {
        const dist = car.progress - pcp; if(globalThis.riskComboNearMiss)riskComboNearMiss(car,dist,Math.abs(playerX-car.offset),MathUtils.limit(speed/maxSpeed,0,1.2));
        if (dist > -80 && dist < 260 && MathUtils.overlap(playerX, .42, car.offset, .44, .82)) {
            if (speed > car.speed * .65 && playerCollisionCooldown <= 0) {
                if(ftuePrologue){speed=Math.max(car.speed*.96,speed*.91);playerX=MathUtils.limit(playerX+(playerX>=car.offset ? .12 : -.12),-1.1,1.1);if(motionEffectsEnabled())cameraShake=Math.max(cameraShake,.18);playerCollisionCooldown=.18;continue;}
                const rel = MathUtils.limit((speed - car.speed) / Math.max(1, maxSpeed), 0, 1);
                const lateral = Math.abs(playerX - car.offset) > .27;
                const strong = rel > .24 || (!lateral && speed > maxSpeed * .72);
                const push = strong ? .31 : .16;
                speed = Math.max(car.speed * (strong ? .58 : .82), speed * (strong ? .72 : .90), 0);
                playerX = MathUtils.limit(playerX + (playerX > car.offset ? push : -push), -2, 2);
                addDamage((strong ? .085 : .018) / mods.armor); raceCrashes++; career.stats.crashes=(career.stats.crashes||0)+1; if(globalThis.ghostLearnEvent)ghostLearnEvent('collision',1); if(globalThis.hapticEvent)hapticEvent(strong?'impact':'touch',strong?1:.65);
                cleanLapEligible = false; if(globalThis.riskComboCrash)riskComboCrash();
                if(motionEffectsEnabled()) cameraShake = strong ? 1 : .48;
                if (strong && motionEffectsEnabled()) impactFreeze = .09; if(strong&&globalThis.raceRadioEvent)raceRadioEvent('crash');
                playerCollisionCooldown = strong ? .52 : .30;
                setRaceMessage((strong ? 'BATIDA FORTE · ' : 'TOQUE · ') + car.name, strong ? '#ff4b4b' : '#ffb52b', 1.0);
                playSFX('crash');
                emitParticle(scrBaseX, scrBaseY - 22, 'rgba(255,185,40,0.94)', strong ? 12 : 5, strong ? 1.35 : .80);
                if (strong) emitParticle(scrBaseX, scrBaseY - 15, 'rgba(245,245,245,0.72)', 5, 1.0);
            }
        }
    }
    if (career.carDamage[currentCar().id] > .45 && speed > maxSpeed * .22 && rrRandom('visual') < career.carDamage[currentCar().id] * .12) emitParticle(scrBaseX + (rrRandom('visual') * 20 - 10), scrBaseY - 24, 'rgba(45,45,45,0.62)', 1, .7);
    if (!ftuePrologue && fuel / mods.fuelCapacity < .15 && rrRandom('visual') < .01) { setRaceMessage('COMBUSTÍVEL BAIXO', '#ff4444', .4); playSFX('alarm'); }
    updateParticles(dt);
    updateAudio(isAccel || nitroActive, isBrake);
    let curPos = 1;
    for (const car of cars) if (car.progress > pcp) curPos++;
    const totalRacers = cars.length + 1;
    if (lastRacePosition !== null && raceStarted && !finished && !gameOver) {
        if (curPos < lastRacePosition) { if(globalThis.ftueMarkOvertake)ftueMarkOvertake(); if(globalThis.ghostLearnEvent)ghostLearnEvent('overtake',lastRacePosition-curPos); let overtaken=null, best=-Infinity; for (const car of cars) if (car.progress < pcp && car.progress > best) { best=car.progress; overtaken=car; } setRaceMessage(overtaken ? 'ULTRAPASSOU: ' + overtaken.name : 'ULTRAPASSAGEM!', '#55ff55', 1.25); if(globalThis.highlightMark)highlightMark(overtaken&&overtaken.name==='GHOST'?'ghost':'overtake',overtaken&&overtaken.name==='GHOST'?'ULTRAPASSOU GHOST':'ULTRAPASSAGEM'); if(globalThis.raceRadioEvent)raceRadioEvent('overtake'); }
        else if (curPos > lastRacePosition) { let ahead=null, best=Infinity; for (const car of cars) if (car.progress > pcp && car.progress < best) { best=car.progress; ahead=car; } setRaceMessage(ahead ? 'PASSOU VOCÊ: ' + ahead.name : 'PERDEU POSIÇÃO!', '#ff4444', 1.25); if(globalThis.raceRadioEvent)raceRadioEvent('lost'); }
    }
    lastRacePosition = curPos;
    if(globalThis.licenseTick)licenseTick(dt,curPos);
    updateCurveHud();
    updateHud(curPos, totalRacers);
}
