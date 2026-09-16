// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
globalThis.drawPoly = function drawPoly(x1, y1, x2, y2, x3, y3, x4, y4, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath(); ctx.fill(); }
globalThis.drawRoadBand = function drawRoadBand(seg, offset, bw, color) { const p1 = seg.p1.screen; const p2 = seg.p2.screen; drawPoly(p1.x + p1.w * (offset - bw / 2), p1.y, p1.x + p1.w * (offset + bw / 2), p1.y, p2.x + p2.w * (offset + bw / 2), p2.y, p2.x + p2.w * (offset - bw / 2), p2.y, color); }
globalThis.drawTrackSegment = function drawTrackSegment(seg, n) {
    const p1 = seg.p1.screen, p2 = seg.p2.screen, c = seg.colors;
    drawPoly(0, p1.y, width, p1.y, width, p2.y, 0, p2.y, n % 2 === 0 ? c.grass : c.grass2);
    const sh1 = p1.w * 1.30, sh2 = p2.w * 1.30; drawPoly(p1.x - sh1, p1.y, p1.x + sh1, p1.y, p2.x + sh2, p2.y, p2.x - sh2, p2.y, c.shoulder);
    const rb1 = p1.w * 1.14, rb2 = p2.w * 1.14; const rumbleCol = seg.rumbleAlt ? '#c31414' : '#f4f4f4'; drawPoly(p1.x - rb1, p1.y, p1.x + rb1, p1.y, p2.x + rb2, p2.y, p2.x - rb2, p2.y, rumbleCol);
    const rbInner1 = p1.w * 1.08, rbInner2 = p2.w * 1.08; drawPoly(p1.x - rbInner1, p1.y, p1.x + rbInner1, p1.y, p2.x + rbInner2, p2.y, p2.x - rbInner2, p2.y, '#ffffff');
    const roadCol = c.road || (seg.biome === 'city' ? '#4a4a55' : seg.biome === 'mountain' ? '#626b78' : '#5f6066'); const roadCol2 = c.road2 || (seg.biome === 'city' ? '#44444f' : seg.biome === 'mountain' ? '#59626f' : '#5b5c62');
    drawPoly(p1.x - p1.w, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x - p2.w, p2.y, n % 2 === 0 ? roadCol : roadCol2);
    const weatherForRoad = currentWeather();
    if ((weatherForRoad === 'rain' || weatherForRoad === 'storm') && p1.w > 16) {
        const wetA = weatherForRoad === 'storm' ? .16 : .105;
        ctx.save();
        ctx.globalAlpha = wetA;
        drawRoadBand(seg, 0, 1.42, '#9fc6d8');
        ctx.globalAlpha = wetA * 1.25;
        if (n % 5 === 0) drawRoadBand(seg, -.36, .035, '#ffffff');
        if (n % 7 === 0) drawRoadBand(seg, .42, .026, '#ffffff');
        ctx.restore();
    }
    if (seg.pit) {
        drawRoadBand(seg, 1.30, .22, '#f1c40f'); drawRoadBand(seg, 1.07, .045, '#ffffff');
        if (n % 8 < 4) drawRoadBand(seg, 1.30, .055, '#111111');
    }
    if (p1.w > 10) { drawRoadBand(seg, -.925, .018, '#e7e7e7'); drawRoadBand(seg, .925, .018, '#e7e7e7'); }
    if (n > 12 && n % 7 === 0 && p1.w > 20) drawRoadBand(seg, 0, .016, '#f0f0f0');
    if (seg.index <= 3) { const cols = 12; const l1 = p1.x - p1.w, r1 = p1.x + p1.w, l2 = p2.x - p2.w, r2 = p2.x + p2.w; for (let ci = 0; ci < cols; ci++) { const t1 = ci / cols, t2 = (ci + 1) / cols; drawPoly(MathUtils.interpolate(l1, r1, t1), p1.y, MathUtils.interpolate(l1, r1, t2), p1.y, MathUtils.interpolate(l2, r2, t2), p2.y, MathUtils.interpolate(l2, r2, t1), p2.y, (ci + seg.index) % 2 === 0 ? '#111' : '#f2f2f2'); } }
}
globalThis.drawWavyLayer = function drawWavyLayer(baseY, amp, color, off, freq, stepSz) { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, height); for (let x = -60; x <= width + 60; x += stepSz) { const px = x + off * width; const y = baseY + Math.sin(px * freq) * amp + Math.sin(px * freq * 1.9) * amp * .35; ctx.lineTo(x, y); } ctx.lineTo(width, height); ctx.closePath(); ctx.fill(); }

globalThis.drawStableWavyLayer = function drawStableWavyLayer(baseY, amp, color, pxOffset, freq, stepSz) {
    // V42: camada panorâmica com deslocamento em pixels.
    // O desenho não troca fase bruscamente e segue a curva de forma contínua.
    const offset = ((pxOffset % width) + width) % width;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = -80; x <= width + 80; x += stepSz) {
        const sampleX = x + offset;
        const y = baseY + Math.sin(sampleX * freq) * amp + Math.sin(sampleX * freq * 1.9) * amp * .35;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
}

window.RRCore.runtime.bind('PARALLAX_TUNE',{desert:{sky:.12,far:.20,mid:.34,near:.58,object:.50},mountain:{sky:.10,far:.16,mid:.27,near:.46,object:.40},grass:{sky:.11,far:.22,mid:.36,near:.60,object:.52},city:{sky:.11,far:.20,mid:.34,near:.56,object:.48}});
globalThis.biomeParallaxTuning = function biomeParallaxTuning(biome) { return PARALLAX_TUNE[biome]||PARALLAX_TUNE.city; }
globalThis.drawCloud = function drawCloud(cx, cy, sc, alpha = .78) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.fillRect(cx, cy, 24 * sc, 5 * sc);
    ctx.fillRect(cx + 7 * sc, cy - 4 * sc, 12 * sc, 4 * sc);
    ctx.fillRect(cx + 18 * sc, cy + 2 * sc, 10 * sc, 4 * sc);
    ctx.restore();
}
globalThis.drawSkyPixelStars = function drawSkyPixelStars(horizon, seed) {
    const c = activeCircuit || getCircuitDefinition();
    if (!c || (c.weather !== 'night' && c.timeOfDay !== 'Noite')) return;
    ctx.save();
    for (let i = 0; i < 46; i++) {
        const hx = hashNumber(seed * 17 + i * 3.71);
        const hy = hashNumber(seed * 29 + i * 5.13);
        const x = Math.floor(hx * width);
        const y = Math.floor(12 + hy * Math.max(24, horizon * .55));
        const a = .16 + hashNumber(seed + i * 9.7) * .42;
        ctx.globalAlpha = a;
        ctx.fillStyle = i % 7 === 0 ? '#ffdc7a' : '#dcecff';
        ctx.fillRect(x, y, i % 11 === 0 ? 2 : 1, 1);
    }
    ctx.restore();
}
globalThis.drawBackground = function drawBackground(horizon, playerSeg) {
    const biome = playerSeg ? playerSeg.biome : raceBiome();
    const c = getBiomeColors(biome);
    const circuit = activeCircuit || getCircuitDefinition();
    const weather = currentWeather();
    const seed = circuit ? circuit.id : raceLevel;

    // V42: a cidade não deve descer junto com a curva, mas também não pode ficar congelada.
    // O horizonte urbano é amortecido e as camadas têm parallax em pixels, suave e progressivo.
    if (biome === 'city') {
        const targetHorizon = height * .46;
        horizon = Math.floor(MathUtils.limit(targetHorizon + (horizon - targetHorizon) * .14, height * .40, height * .52));
    }

    const tune = biomeParallaxTuning(biome);
    const bgSkyOffset = biome === 'city' ? cityFarOffset / Math.max(1, width) * .08 : globalSkyPx / Math.max(1, width);
    const bgHillOffset = biome === 'city' ? cityFarOffset / Math.max(1, width) * .13 : globalMountainFarPx / Math.max(1, width);
    const bgTreeOffset = biome === 'city' ? cityMidOffset / Math.max(1, width) * .16 : globalMountainMidPx / Math.max(1, width);
    const scenicNearPx = biome === 'city' ? cityDeckOffset : globalGroundNearPx;

    const skyGrad = ctx.createLinearGradient(0, 0, 0, Math.max(1, horizon));
    skyGrad.addColorStop(0, c.skyTop);
    skyGrad.addColorStop(.62, c.skyBot);
    skyGrad.addColorStop(1, weather === 'fog' ? 'rgba(226,235,245,1)' : c.skyBot);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    drawSkyPixelStars(horizon, seed);

    const isNight = weather === 'night' || (circuit && circuit.timeOfDay === 'Noite');
    const sunX = width * .72 + Math.sin(bgSkyOffset * Math.PI * 2) * 60;
    const sunY = Math.max(18, horizon - 118);
    ctx.save();
    if (!isNight) {
        ctx.globalAlpha = weather === 'fog' ? .48 : .86;
        ctx.fillStyle = biome === 'desert' ? '#fff5c0' : '#fff06b';
        ctx.fillRect(sunX - 16, sunY, 32, 5);
        ctx.fillRect(sunX - 10, sunY - 5, 20, 4);
        ctx.globalAlpha = .18;
        ctx.fillRect(sunX - 28, sunY + 8, 56, 3);
    } else if (biome === 'city') {
        ctx.globalAlpha = .62;
        ctx.fillStyle = '#ff6bd6';
        ctx.fillRect(sunX - 22, sunY + 5, 44, 5);
        ctx.fillRect(sunX - 12, sunY - 1, 24, 4);
    }
    ctx.restore();

    if (biome !== 'city') {
        const cloudAlpha = weather === 'fog' ? .42 : weather === 'storm' || weather === 'rain' ? .32 : .68;
        drawCloud(28 + bgSkyOffset * 60, horizon - 95, 1, cloudAlpha);
        drawCloud(145 - bgSkyOffset * 80, horizon - 120, 1.2, cloudAlpha);
        drawCloud(310 + bgSkyOffset * 70, horizon - 105, 1, cloudAlpha);
        drawCloud(400 - bgSkyOffset * 90, horizon - 82, .9, cloudAlpha * .9);
    }

    const mCol1 = c.mountColor;
    const mCol2 = biome === 'desert' ? '#b07830' : biome === 'mountain' ? '#4a5a6a' : biome === 'city' ? '#2a2a3a' : '#1b8a25';
    const mCol3 = biome === 'mountain' ? '#3d4d5a' : biome === 'city' ? '#171725' : '#004b12';
    if (biome === 'city') {
        drawWavyLayer(horizon - 78, 29, mCol1, bgHillOffset, .026 + hashNumber(seed) * .008, 8);
        drawWavyLayer(horizon - 54, 22, mCol2, bgHillOffset * 1.5, .035 + hashNumber(seed + 2) * .009, 8);
        drawWavyLayer(horizon - 25, 14, mCol3, bgTreeOffset * .6, .052 + hashNumber(seed + 5) * .010, 5);
        if (c.mountSnow) drawWavyLayer(horizon - 68, 12, '#ffffff', bgHillOffset * .9, .032, 8);
    } else {
        drawStableWavyLayer(horizon - 78, 29, mCol1, globalMountainFarPx, .026 + hashNumber(seed) * .008, 8);
        drawStableWavyLayer(horizon - 54, 22, mCol2, globalMountainMidPx, .035 + hashNumber(seed + 2) * .009, 8);
        drawStableWavyLayer(horizon - 25, 14, mCol3, globalGroundNearPx * .72, .052 + hashNumber(seed + 5) * .010, 5);
        if (c.mountSnow) drawStableWavyLayer(horizon - 68, 12, '#ffffff', globalMountainFarPx * .82, .032, 8);
    }

    const ridgeColor = biome === 'city' ? '#252532' : biome === 'desert' ? '#9b702d' : biome === 'mountain' ? '#778899' : '#003d0d';
    ctx.fillStyle = ridgeColor;
    ctx.fillRect(0, horizon - 8, width, 14);

    if (biome === 'city') {
        ctx.save();
        const skylineBase = horizon - 8;
        const farTile = 27;
        const nearTile = 44;
        const deckTile = 86;
        const farP = parallaxPhase(cityFarOffset, farTile);
        const midP = parallaxPhase(cityMidOffset, nearTile);
        const nearP = parallaxPhase(cityNearOffset, nearTile);
        const deckP = parallaxPhase(cityDeckOffset, deckTile);

        // V42: skyline com rolagem contínua. A seed acompanha o tile que entra na tela,
        // então os prédios passam de verdade em curvas longas sem parecer rodopio.
        for (let i = -4; i < Math.ceil(width / farTile) + 5; i++) {
            const tileIndex = i + farP.baseIndex;
            const localSeed = seed * 19 + tileIndex * 11;
            const bw = 10 + Math.floor(hashNumber(localSeed + 2) * 10);
            const bh = 9 + Math.floor(hashNumber(localSeed + 3) * 19);
            const baseX = i * farTile + Math.floor(hashNumber(localSeed + 15) * 8);
            const bx = baseX - farP.phase;
            const by = skylineBase - bh - 8 - Math.floor(hashNumber(localSeed + 4) * 9);
            ctx.fillStyle = hashNumber(localSeed) > .5 ? '#202031' : '#26263a';
            ctx.globalAlpha = .48;
            ctx.fillRect(bx, by, bw, bh);
            ctx.globalAlpha = isNight ? .26 : .12;
            ctx.fillStyle = hashNumber(localSeed + 8) > .58 ? '#9fe8ff' : '#ffe2a0';
            for (let wy = by + 6; wy < by + bh - 3; wy += 9) {
                if (hashNumber(localSeed + wy * .09) > .50) ctx.fillRect(bx + 2, wy, Math.max(2, bw - 4), 2);
            }
        }

        // Skyline principal: move mais que as montanhas, mas ainda amortecida e natural.
        for (let i = -4; i < Math.ceil(width / nearTile) + 5; i++) {
            const tileIndex = i + nearP.baseIndex;
            const localSeed = seed * 23 + tileIndex * 17;
            const bw = 16 + Math.floor(hashNumber(localSeed + 5) * 18);
            const baseX = i * nearTile + Math.floor(hashNumber(localSeed + 6) * 14);
            const bx = baseX - nearP.phase;
            let bh = 16 + Math.floor(hashNumber(localSeed + 7) * 32);
            if (hashNumber(localSeed + 11) > .90) bh += 7 + Math.floor(hashNumber(localSeed + 12) * 9);
            bh = Math.min(bh, Math.max(28, height * .14));
            const by = skylineBase - bh;
            ctx.globalAlpha = .88;
            ctx.fillStyle = hashNumber(localSeed + 9) > .53 ? '#29293a' : '#313148';
            ctx.fillRect(bx, by, bw, bh);
            // Silhueta traseira curta para dar profundidade sem massa contínua.
            if (hashNumber(localSeed + 16) > .58) {
                ctx.globalAlpha = .30;
                ctx.fillStyle = '#181824';
                ctx.fillRect(bx - 8, by + 8, Math.max(5, bw * .45), Math.max(10, bh - 8));
            }
            ctx.globalAlpha = isNight ? .48 : .20;
            ctx.fillStyle = hashNumber(localSeed + 10) > .62 ? '#ffdd88' : '#8fe8ff';
            const inset = Math.max(2, Math.floor(bw * .16));
            for (let wy = by + 7; wy < by + bh - 4; wy += 10) {
                if (hashNumber(localSeed + wy * .1) > .34) ctx.fillRect(bx + inset, wy, Math.max(2, bw - inset * 2), 2);
            }
        }

        // Véu atmosférico leve para integrar a skyline.
        const cityFade = ctx.createLinearGradient(0, skylineBase - 80, 0, skylineBase + 8);
        cityFade.addColorStop(0, 'rgba(92,80,122,.06)');
        cityFade.addColorStop(.58, 'rgba(52,52,68,.045)');
        cityFade.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = cityFade;
        ctx.fillRect(0, skylineBase - 86, width, 96);

        // Viaduto/fundo urbano: ancorado e com parallax lento, sem "descer" junto com curva.
        const deckY = horizon + 14;
        const deckH = Math.max(10, height * .030);
        ctx.fillStyle = 'rgba(22,22,27,.58)';
        ctx.fillRect(0, deckY, width, deckH);
        ctx.fillStyle = 'rgba(108,108,116,.34)';
        ctx.fillRect(0, deckY, width, 2);
        ctx.fillStyle = 'rgba(0,0,0,.15)';
        ctx.fillRect(0, deckY + deckH - 2, width, 2);
        ctx.fillStyle = 'rgba(80,80,88,.25)';
        for (let i = -3; i < Math.ceil(width / deckTile) + 4; i++) {
            const px = i * deckTile - deckP.phase;
            ctx.fillRect(px, deckY + deckH, 5, Math.max(16, height * .085));
        }
        ctx.restore();
    }

    // Base do cenário com gradiente e microvariação para cada bioma.
    const groundTop = biome === 'desert' ? '#d9ad4a' : biome === 'city' ? '#454550' : biome === 'mountain' ? '#dfe8f2' : '#0f9b1a';
    const groundBot = biome === 'desert' ? '#c28f32' : biome === 'city' ? '#33333d' : biome === 'mountain' ? '#c8d6e4' : '#087812';
    const gGrad = ctx.createLinearGradient(0, horizon + 3, 0, height);
    gGrad.addColorStop(0, groundTop);
    gGrad.addColorStop(1, groundBot);
    ctx.fillStyle = gGrad;
    ctx.fillRect(0, horizon + 3, width, height - horizon);
    for (let y = horizon + 12; y < height; y += 16) {
        const wave = Math.sin((y + seed) * .035 + (biome === 'city' ? bgTreeOffset * 7 : scenicNearPx * .018)) * 8;
        ctx.globalAlpha = .13 + (y % 48 === 0 ? .10 : 0);
        ctx.fillStyle = biome === 'desert' ? '#ffe082' : biome === 'city' ? '#70707a' : biome === 'mountain' ? '#ffffff' : '#46d653';
        ctx.fillRect(wave - 18, y, width + 36, y % 32 === 0 ? 3 : 2);
    }
    ctx.globalAlpha = 1;

    // Pequenos detalhes distantes, baratos e variados por fase.
    ctx.save();
    ctx.globalAlpha = biome === 'city' ? .34 : .26;
    for (let i = 0; i < 30; i++) {
        const hx = hashNumber(seed * 31 + i * 7.1);
        const x = (hx * width + (biome === 'city' ? bgTreeOffset * width * (.08 + (i % 4) * .03) : scenicNearPx * tune.object)) % (width + 50) - 25;
        const y = horizon + 26 + hashNumber(seed * 47 + i) * Math.max(18, height * .16);
        const s = .55 + hashNumber(seed * 13 + i) * .65;
        if (biome === 'desert') {
            ctx.fillStyle = '#8f6429'; ctx.fillRect(x, y - 6 * s, 12 * s, 6 * s);
        } else if (biome === 'mountain') {
            ctx.fillStyle = '#8aa0ad'; ctx.fillRect(x, y - 4 * s, 8 * s, 4 * s);
        } else if (biome === 'city') {
            ctx.fillStyle = isNight ? '#f3c56a' : '#777'; ctx.fillRect(x, y - 10 * s, 2 * s, 10 * s);
        } else {
            ctx.fillStyle = '#075512'; ctx.fillRect(x, y - 10 * s, 3 * s, 10 * s); ctx.fillRect(x - 4 * s, y - 13 * s, 11 * s, 5 * s);
        }
    }
    ctx.restore();

    if (weather === 'fog') {
        ctx.save();
        const fogGrad = ctx.createLinearGradient(0, horizon - 70, 0, horizon + 110);
        fogGrad.addColorStop(0, 'rgba(230,238,247,.00)');
        fogGrad.addColorStop(.35, 'rgba(230,238,247,.30)');
        fogGrad.addColorStop(.75, 'rgba(230,238,247,.20)');
        fogGrad.addColorStop(1, 'rgba(230,238,247,.00)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, Math.max(0, horizon - 90), width, 220);
        ctx.restore();
    }
}
