// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
globalThis.drawDistantAtmosphere = function drawDistantAtmosphere(horizon, playerSeg) {
    const c = activeCircuit || getCircuitDefinition();
    if (!c) return;
    const weather = currentWeather();
    if (weather !== 'fog' && weather !== 'rain' && weather !== 'storm' && weather !== 'snow') return;
    ctx.save();
    if (weather === 'fog') {
        const g = ctx.createLinearGradient(0, horizon - 20, 0, height);
        g.addColorStop(0, 'rgba(226,235,245,.50)');
        g.addColorStop(.30, 'rgba(226,235,245,.28)');
        g.addColorStop(.62, 'rgba(226,235,245,.10)');
        g.addColorStop(1, 'rgba(226,235,245,.00)');
        ctx.fillStyle = g;
        ctx.fillRect(0, Math.max(0, horizon - 30), width, height - horizon + 40);
        for (let i = 0; i < 7; i++) {
            const y = horizon + 10 + i * 22 + Math.sin(totalRaceTime * .45 + i * 1.7) * 6;
            const a = Math.max(0, .18 - i * .018);
            ctx.globalAlpha = a;
            ctx.fillStyle = '#edf5ff';
            ctx.fillRect(-40 + Math.sin(totalRaceTime * .25 + i) * 55, y, width + 80, 9 + i * 2);
        }
    } else if (weather === 'rain' || weather === 'storm') {
        const a = weather === 'storm' ? .16 : .09;
        const g = ctx.createLinearGradient(0, horizon, 0, height);
        g.addColorStop(0, `rgba(180,205,225,${a})`);
        g.addColorStop(.50, `rgba(130,160,180,${a * .55})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, horizon, width, height - horizon);
    } else if (weather === 'snow') {
        const g = ctx.createLinearGradient(0, horizon - 20, 0, height);
        g.addColorStop(0, 'rgba(255,255,255,.25)');
        g.addColorStop(.55, 'rgba(255,255,255,.08)');
        g.addColorStop(1, 'rgba(255,255,255,.00)');
        ctx.fillStyle = g;
        ctx.fillRect(0, Math.max(0, horizon - 20), width, height - horizon + 20);
    }
    ctx.restore();
}

globalThis.drawRainLayer = function drawRainLayer(count, speedPx, length, alpha, lineW, wind, nearBias) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#dff6ff';
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    for (let i = 0; i < count; i++) {
        const seed = raceLevel * 97 + i * 13.37 + nearBias * 101;
        const phase = totalRaceTime * speedPx + hashNumber(seed) * 9000;
        const x = (i * (37 + nearBias * 11) + phase * (0.38 + nearBias * .18)) % (width + 180) - 90;
        const y = (i * (53 + nearBias * 17) + phase) % (height + 120) - 60;
        const localLen = length * (.72 + hashNumber(seed + 4) * .65);
        const lean = wind * (.78 + hashNumber(seed + 8) * .35);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - lean, y + localLen);
        ctx.stroke();
    }
    ctx.restore();
}

globalThis.drawRainSplashes = function drawRainSplashes(strength) {
    ctx.save();
    ctx.strokeStyle = '#e9fbff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = .10 + strength * .06;
    const baseY = height * .64;
    const count = Math.floor(28 + strength * 22);
    for (let i = 0; i < count; i++) {
        const seed = raceLevel * 53 + i * 19.2;
        const x = (hashNumber(seed) * width + totalRaceTime * (80 + i % 7)) % width;
        const y = baseY + hashNumber(seed + 2) * height * .28;
        const s = 2 + hashNumber(seed + 9) * 5;
        ctx.beginPath();
        ctx.moveTo(x - s, y);
        ctx.lineTo(x + s, y - 1 - strength * 2);
        ctx.stroke();
    }
    ctx.restore();
}

globalThis.drawSnowLayer = function drawSnowLayer() {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 72; i++) {
        const seed = raceLevel * 41 + i * 5.7;
        const drift = Math.sin(totalRaceTime * .8 + i) * 22;
        const x = (hashNumber(seed) * width + drift) % (width + 24) - 12;
        const y = (hashNumber(seed + 1) * height + totalRaceTime * (28 + hashNumber(seed + 3) * 38)) % (height + 18) - 9;
        const s = 1 + hashNumber(seed + 2) * 2;
        ctx.globalAlpha = .18 + hashNumber(seed + 4) * .36;
        ctx.fillRect(x, y, s, s);
    }
    ctx.restore();
}

globalThis.drawWeatherOverlay = function drawWeatherOverlay() {
    const c = activeCircuit || getCircuitDefinition();
    if (!c) return;
    const weather = currentWeather();
    if (weather === 'rain' || weather === 'storm') {
        const strong = weather === 'storm' ? 1 : .62;
        // Três planos de chuva: fundo fino, médio e gotas próximas.
        drawRainLayer(Math.floor(58 + strong * 18), 360 + strong * 170, 18 + strong * 10, .10 + strong * .035, 1, 9 + strong * 8, 0);
        drawRainLayer(Math.floor(34 + strong * 14), 520 + strong * 220, 30 + strong * 14, .15 + strong * .055, 1.2, 16 + strong * 11, 1);
        drawRainLayer(Math.floor(16 + strong * 10), 720 + strong * 240, 48 + strong * 18, .22 + strong * .075, 1.6, 24 + strong * 16, 2);
        drawRainSplashes(strong);
        if (weather === 'storm' && !career.settings.reducedFlash) {
            const flash = Math.max(0, Math.sin(totalRaceTime * 1.65 + raceLevel) - .985) * 5.5;
            if (flash > .01) { ctx.save(); ctx.globalAlpha = Math.min(.20, flash); ctx.fillStyle = '#dff3ff'; ctx.fillRect(0,0,width,height); ctx.restore(); }
        }
    } else if (weather === 'fog') {
        ctx.save();
        for (let i = 0; i < 9; i++) {
            const y = height * (.30 + i * .068) + Math.sin(totalRaceTime * .30 + i * 1.9) * 9;
            const h = 12 + i * 3;
            const x = -80 + Math.sin(totalRaceTime * .18 + i) * 70;
            ctx.globalAlpha = Math.max(.025, .135 - i * .010);
            ctx.fillStyle = '#edf6ff';
            ctx.fillRect(x, y, width + 160, h);
        }
        ctx.restore();
    } else if (weather === 'snow') {
        drawSnowLayer();
    } else if (weather === 'heat') {
        ctx.save(); ctx.globalAlpha = .10; ctx.fillStyle = '#ffd16b';
        for (let y = Math.floor(height * .42); y < height; y += 28) ctx.fillRect(0, y + Math.sin(totalRaceTime * 4 + y) * 3, width, 3);
        ctx.restore();
    }
}


globalThis.drawSetPieceOverlay = function drawSetPieceOverlay(playerSeg,horizon){
    const f=String(playerSeg&&playerSeg.feature||'').toLowerCase(); if(!f)return; ctx.save();
    if(f.includes('túnel')){ctx.fillStyle='rgba(0,0,0,.56)';ctx.fillRect(0,0,width,horizon*.80);ctx.fillRect(0,horizon*.78,width*.14,height);ctx.fillRect(width*.86,horizon*.78,width*.14,height);ctx.fillStyle='rgba(255,230,150,.24)';for(let i=0;i<7;i++)ctx.fillRect(width*.18+i*width*.105,horizon*.68,18,4);}
    else if(f.includes('ponte')){ctx.fillStyle='rgba(80,155,205,.20)';ctx.fillRect(0,horizon+22,width,height-horizon-22);ctx.strokeStyle='#d5d5d5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(width*.08,horizon);ctx.lineTo(width*.08,height);ctx.moveTo(width*.92,horizon);ctx.lineTo(width*.92,height);ctx.stroke();}
    else if(f.includes('viaduto')){ctx.fillStyle='rgba(20,20,24,.38)';ctx.fillRect(0,horizon*.88,width,16);ctx.fillStyle='rgba(255,210,90,.20)';for(let x=0;x<width;x+=48)ctx.fillRect(x,horizon*.88+5,24,4);}
    else if(f.includes('porto')){ctx.fillStyle='rgba(0,20,35,.20)';ctx.fillRect(0,horizon,width,height-horizon);ctx.strokeStyle='rgba(80,220,255,.38)';ctx.lineWidth=3;for(let i=0;i<4;i++){const x=width*(.08+i*.28);ctx.beginPath();ctx.moveTo(x,horizon*.72);ctx.lineTo(x+width*.08,horizon*.42);ctx.lineTo(x+width*.15,horizon*.72);ctx.stroke();}}
    else if(f.includes('canyon')){ctx.fillStyle='rgba(125,65,28,.22)';ctx.beginPath();ctx.moveTo(0,horizon*.68);ctx.lineTo(width*.18,horizon*.45);ctx.lineTo(width*.31,horizon*.75);ctx.lineTo(0,height);ctx.fill();ctx.beginPath();ctx.moveTo(width,horizon*.64);ctx.lineTo(width*.82,horizon*.42);ctx.lineTo(width*.69,horizon*.76);ctx.lineTo(width,height);ctx.fill();}
    else if(f.includes('arquibancada')){ctx.fillStyle='rgba(25,25,32,.52)';ctx.fillRect(0,horizon*.70,width*.20,height-horizon*.70);ctx.fillRect(width*.80,horizon*.70,width*.20,height-horizon*.70);for(let i=0;i<18;i++){ctx.fillStyle=i%3===0?'#ffcc00':i%3===1?'#38d5ff':'#ff4b7d';ctx.fillRect((i%9)*width*.021,horizon*.76+Math.floor(i/9)*8,3,3);ctx.fillRect(width*.81+(i%9)*width*.021,horizon*.76+Math.floor(i/9)*8,3,3);}}
    ctx.restore();
}
function drawOneGhost(samples,color,stripe,model,alpha=.34){if(!samples||!samples.length)return;const t=totalRaceTime;let lo=0,hi=samples.length-1;while(lo<hi){const m=(lo+hi)>>1;if(samples[m][0]<t)lo=m+1;else hi=m;}const sm=samples[lo];if(!sm)return;const dist=sm[1]-playerProgress;if(dist<-600||dist>activeDrawDistance()*segmentLength)return;const seg=getSegment(sm[1]);if(!seg||!seg.p1.screen||!seg.p2.screen)return;const a=seg.p1.screen,b=seg.p2.screen;if(!Number.isFinite(a.scale)||!Number.isFinite(b.scale)||!Number.isFinite(a.x)||!Number.isFinite(b.x)||!Number.isFinite(a.y)||!Number.isFinite(b.y)||!Number.isFinite(a.w)||!Number.isFinite(b.w)||!Number.isFinite(sm[2]))return;const cp=MathUtils.percentRemaining(sm[1],segmentLength),sc=MathUtils.interpolate(seg.p1.screen.scale,seg.p2.screen.scale,cp),sx=MathUtils.interpolate(seg.p1.screen.x,seg.p2.screen.x,cp)+sc*sm[2]*roadWidth*width/2,sy=MathUtils.interpolate(seg.p1.screen.y,seg.p2.screen.y,cp),rh=MathUtils.interpolate(seg.p1.screen.w,seg.p2.screen.w,cp);if(![sc,sx,sy,rh].every(Number.isFinite))return;ctx.save();ctx.globalAlpha=alpha;drawCar(sx,sy,MathUtils.limit(rh*.38,8,width*.145),color||'#7be9ff',false,0,{model:model||'sport',stripe:stripe||'#fff'});ctx.restore();}
globalThis.drawGhostReplay = function drawGhostReplay(){if(raceContext.mode==='timeTrial'){drawOneGhost(ghostReplay,'#7be9ff','#fff','sport',.34);return;}if(raceContext.mode==='shadow'&&shadowGhosts&&shadowGhosts.length){for(let i=shadowGhosts.length-1;i>=0;i--){const g=shadowGhosts[i],car=CARS[g.car]||CARS[0];drawOneGhost(g.samples,g.color,g.stripe,car.model,.28+i*.035);}}}
globalThis.drawLegendaryIntro = function drawLegendaryIntro(){ if(!raceStarted&&[27,333,666,999].includes(raceLevel)){ctx.save();ctx.globalAlpha=.9;ctx.fillStyle='rgba(0,0,0,.48)';ctx.fillRect(0,height*.58,width,height*.11);ctx.textAlign='center';ctx.font=`900 ${Math.max(12,width*.035)}px monospace`;ctx.fillStyle='#ffcc00';ctx.fillText(raceLevel===999?'CIRCUITO LENDÁRIO ECLIPSE · HORIZONTE ZERO':`EVENTO LENDÁRIO · FASE ${raceLevel}`,width/2,height*.65);ctx.restore();}}

window.RRCore.runtime.bind('visibleCarsCache',Array.from({length:22},()=>({car:null,dist:-Infinity})));
globalThis.render = function render() {
    const baseSeg = getSegment(position); const playerSeg = getSegment(position + playerZ); if (!baseSeg || !playerSeg) { ctx.fillStyle='#000'; ctx.fillRect(0,0,width,height); return; }
    const drawDistance = activeDrawDistance();
    const speedRatioCamera = MathUtils.limit(speed / maxSpeed, 0, 1.18);
    const dynamicFov = fieldOfView + (motionEffectsEnabled()?12 * MathUtils.limit(speedRatioCamera,0,1):0);
    renderCameraDepth = 1 / Math.tan((dynamicFov / 2) * Math.PI / 180);
    let lookCurve = 0, lookWeight = 0;
    for (let i=8;i<=14;i++){ const ls=getSegment(position + playerZ + i*segmentLength); if(ls){ const w=1/(1+(i-8)*.25); lookCurve+=(ls.curve||0)*w; lookWeight+=w; } }
    lookCurve = lookWeight ? lookCurve/lookWeight : 0;
    const lookTarget=MathUtils.limit(lookCurve*.09,-.34,.34); const laggedLook=globalThis.cameraLag2Frames?cameraLag2Frames(lookTarget):lookTarget; renderLookaheadX = MathUtils.interpolate(renderLookaheadX, laggedLook, motionEffectsEnabled()?.12:.34);
    const basePct = MathUtils.percentRemaining(position, segmentLength); const playerPct = MathUtils.percentRemaining(position + playerZ, segmentLength); const playerY = MathUtils.interpolate(playerSeg.p1.world.y, playerSeg.p2.world.y, playerPct); let maxy = height; let dx = -(baseSeg.curve * basePct); let x = renderLookaheadX * roadWidth; const horizon = Math.floor(MathUtils.limit(height * .46 - playerY * .045, height * .24, height * .68));
    drawBackground(horizon, playerSeg);
    for (let n = 0; n < drawDistance; n++) { const seg = getSegment(position + n * segmentLength); const looped = seg.index < baseSeg.index; project(seg.p1, (playerX * roadWidth) - x, playerY + cameraHeight, position - (looped ? trackZLength : 0), renderCameraDepth, width, height, roadWidth * (seg.roadScale || 1)); project(seg.p2, (playerX * roadWidth) - x - dx, playerY + cameraHeight, position - (looped ? trackZLength : 0), renderCameraDepth, width, height, roadWidth * (seg.roadScale || 1)); x += dx; dx += seg.curve; if (seg.p1.camera.z <= renderCameraDepth || seg.p2.camera.z <= renderCameraDepth || seg.p2.screen.y >= maxy || seg.p2.screen.y >= seg.p1.screen.y) continue; drawTrackSegment(seg, n); maxy = seg.p1.screen.y; }
    drawDistantAtmosphere(horizon, playerSeg); drawSetPieceOverlay(playerSeg,horizon); if(globalThis.drawTireMarks)drawTireMarks();
    for (let n = drawDistance - 1; n > 0; n--) { const seg = getSegment(position + n * segmentLength); if (!seg || !seg.decorations || !seg.decorations.length) continue; if (!seg.p1.camera || seg.p1.camera.z <= renderCameraDepth) continue; for (const dec of seg.decorations) drawDecoration(seg, dec, horizon); }
    let visibleCount=0;
    for (const car of cars) { const dist = car.progress - playerProgress; if (dist <= 0 || dist >= drawDistance * segmentLength) continue; const item=visibleCarsCache[visibleCount++]; item.car=car; item.dist=dist; }
    for(let i=visibleCount;i<visibleCarsCache.length;i++){visibleCarsCache[i].car=null;visibleCarsCache[i].dist=-Infinity;}
    visibleCarsCache.sort((a,b) => b.dist - a.dist);
    for (let i=0;i<visibleCount;i++) { const item=visibleCarsCache[i], car = item.car; const seg = getSegment(car.z); if (!seg || !seg.p1.screen || !seg.p2.screen || !seg.p1.camera || seg.p1.camera.z <= renderCameraDepth) continue; const cp=MathUtils.percentRemaining(car.z,segmentLength); const sc=MathUtils.interpolate(seg.p1.screen.scale,seg.p2.screen.scale,cp); const sx=MathUtils.interpolate(seg.p1.screen.x,seg.p2.screen.x,cp)+sc*car.offset*roadWidth*width/2; const sy=MathUtils.interpolate(seg.p1.screen.y,seg.p2.screen.y,cp); const rh=MathUtils.interpolate(seg.p1.screen.w,seg.p2.screen.w,cp); if(sy>-20&&sy<height+40) drawCar(sx,sy,MathUtils.limit(rh*.38,8,width*.145),car.color,false,car.steerVisual,car); }
    drawGhostReplay(); drawSpeedLines(); drawParticles(); drawWeatherOverlay();
    let steerRot = 0; if (touchDrive.active) steerRot = lastTouchSteer; else if (keys.ArrowLeft) steerRot = -1; else if (keys.ArrowRight) steerRot = 1; else steerRot = playerSeg.curve * (speed / maxSpeed) * .42;
    const allowMotion=motionEffectsEnabled(); const shakeX = allowMotion&&cameraShake > 0 ? (rrRandom('visual') - .5) * 5 * cameraShake : 0; const shakeY = allowMotion&&cameraShake > 0 ? (rrRandom('visual') - .5) * 3 * cameraShake : 0;
    {const pc=currentCar(),paint=carPaint(pc);drawCar(width/2+shakeX,height-Math.max(34,height*.072)+shakeY,Math.max(76,Math.min(108,width*.175)),paint.color,true,steerRot,{model:pc.model,stripe:paint.stripe,livery:carLivery(pc.id),damage:career.carDamage[pc.id]||0,upgradeVisuals:career.upgrades});}
    drawLegendaryIntro(); drawRaceMessage(); drawCountdown(); if(globalThis.drawJuicePostFX)drawJuicePostFX(); if(finishBannerTimer>0){finishBannerTimer-=step;document.getElementById('finishBanner').classList.add('show');}else document.getElementById('finishBanner').classList.remove('show');
}

