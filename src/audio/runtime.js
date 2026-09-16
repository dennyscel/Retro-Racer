// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
window.RRCore.runtime.bind('fps',60);
window.RRCore.runtime.bind('step',1 / fps);
window.RRCore.runtime.bind('roadWidth',2000);
window.RRCore.runtime.bind('segmentLength',200);
window.RRCore.runtime.bind('rumbleLength',3);
window.RRCore.runtime.bind('drawDistanceHigh',300);
window.RRCore.runtime.bind('drawDistanceLow',180);
window.RRCore.runtime.bind('fieldOfView',100);
window.RRCore.runtime.bind('cameraHeight',1000);
window.RRCore.runtime.bind('cameraDepth',1 / Math.tan((fieldOfView / 2) * Math.PI / 180));
window.RRCore.runtime.bind('renderCameraDepth',cameraDepth);
window.RRCore.runtime.bind('renderLookaheadX',0);
window.RRCore.runtime.bind('maxSpeed',segmentLength / step);
window.RRCore.runtime.bind('accel',maxSpeed / 4.45);
window.RRCore.runtime.bind('breaking',-maxSpeed * 1.12);
window.RRCore.runtime.bind('decel',-maxSpeed / 5.15);
window.RRCore.runtime.bind('offRoadDecel',-maxSpeed / 2.1);
window.RRCore.runtime.bind('offRoadLimit',maxSpeed / 4);
window.RRCore.runtime.bind('centrifugal',0.34);
window.RRCore.runtime.bind('totalLaps',5);

window.RRCore.runtime.bind('segments',[]);
window.RRCore.runtime.bind('cars',[]);
window.RRCore.runtime.bind('particles',[]); window.RRCore.runtime.bind('particlePool',[]);
window.RRCore.runtime.bind('trackZLength',0);
window.RRCore.runtime.bind('playerProgress',0);
window.RRCore.runtime.bind('position',0);
window.RRCore.runtime.bind('speed',0);
window.RRCore.runtime.bind('playerX',0);
window.RRCore.runtime.bind('playerZ',cameraHeight * cameraDepth);
window.RRCore.runtime.bind('skyOffset',0);
window.RRCore.runtime.bind('hillOffset',0);
window.RRCore.runtime.bind('treeOffset',0);
// V42: parallax urbano assinado e amortecido. Diferente do parallax das montanhas,
// ele acumula deslocamento em pixels para os prédios não ficarem parados nem rodopiarem.
window.RRCore.runtime.bind('cityParallaxSpeed',0);
window.RRCore.runtime.bind('cityFarOffset',0);
window.RRCore.runtime.bind('cityMidOffset',0);
window.RRCore.runtime.bind('cityNearOffset',0);
window.RRCore.runtime.bind('cityDeckOffset',0);

// V42: parallax global por bioma.
// Mantém o movimento aprovado da cidade e aplica camadas suaves aos demais biomas.
window.RRCore.runtime.bind('globalParallaxSpeed',0);
window.RRCore.runtime.bind('globalSkyPx',0);
window.RRCore.runtime.bind('globalMountainFarPx',0);
window.RRCore.runtime.bind('globalMountainMidPx',0);
window.RRCore.runtime.bind('globalGroundNearPx',0);
window.RRCore.runtime.bind('finished',false);
window.RRCore.runtime.bind('raceStarted',false);
window.RRCore.runtime.bind('gameMode','menu');
window.RRCore.runtime.bind('garageReturn','start');
window.RRCore.runtime.bind('garageCarView',0);
window.RRCore.runtime.bind('lastTouchSteer',0);
window.RRCore.runtime.bind('currentLap',1);
window.RRCore.runtime.bind('currentLapTime',0);
window.RRCore.runtime.bind('totalRaceTime',0);
window.RRCore.runtime.bind('nitro',1);
window.RRCore.runtime.bind('fuel',1);
window.RRCore.runtime.bind('draftTimer',0);
window.RRCore.runtime.bind('draftBoost',0);
window.RRCore.runtime.bind('raceMessage','');
window.RRCore.runtime.bind('raceMessageColor','#ffffff');
window.RRCore.runtime.bind('raceMessageTimer',0);
window.RRCore.runtime.bind('lastRacePosition',null);
window.RRCore.runtime.bind('cameraShake',0);
window.RRCore.runtime.bind('playerCollisionCooldown',0);
window.RRCore.runtime.bind('nitroFlamePulse',0);
window.RRCore.runtime.bind('pitTimer',0);
window.RRCore.runtime.bind('pitServiceProgress',0);
window.RRCore.runtime.bind('pitServiceActive',false);
window.RRCore.runtime.bind('pitServiceDone',false);
window.RRCore.runtime.bind('pitRejectCooldown',0);
window.RRCore.runtime.bind('nitroArmTimer',0);
window.RRCore.runtime.bind('nitroWasRequested',false);
window.RRCore.runtime.bind('nitroWasActive',false);
window.RRCore.runtime.bind('cleanLapEligible',true);
window.RRCore.runtime.bind('perfectStartWindow',0);
window.RRCore.runtime.bind('perfectStartBoost',0);
window.RRCore.runtime.bind('jumpStartQueued',false);
window.RRCore.runtime.bind('jumpStartPenalty',0);
window.RRCore.runtime.bind('impactFreeze',0);
window.RRCore.runtime.bind('lastCurveHint',{ dir:0, strength:0, distance:0 });
window.RRCore.runtime.bind('gamePaused',false);
window.RRCore.runtime.bind('countdownActive',false);
window.RRCore.runtime.bind('countdownTimer',0);
window.RRCore.runtime.bind('countdownText','');
window.RRCore.runtime.bind('goFlashTimer',0);
window.RRCore.runtime.bind('gameOver',false);
window.RRCore.runtime.bind('finalRanking',[]);
window.RRCore.runtime.bind('finalPlayerRank',1);
window.RRCore.runtime.bind('finalTotalTime',0);
window.RRCore.runtime.bind('finalBestLap',Infinity);
window.RRCore.runtime.bind('finalRankingLocked',false);
window.RRCore.runtime.bind('raceLevel',1);
window.RRCore.runtime.bind('targetGoldTime',0);
window.RRCore.runtime.bind('raceAwarded',false);
window.RRCore.runtime.bind('activeCircuit',null);
window.RRCore.runtime.bind('PLAYER_RACER_NAME','VOCÊ');

window.RRCore.runtime.bind('raceContext',{ mode:'career', selectedLevel:1, replay:false, laps:5, dailySeed:null, ghost:false, boss:false, insurance:false });
window.RRCore.runtime.bind('selectedCup',1); window.RRCore.runtime.bind('selectedTrackLevel',1); window.RRCore.runtime.bind('trackSelectionMode','career'); window.RRCore.runtime.bind('runtimeWeather',null); window.RRCore.runtime.bind('dynamicWeatherArmed',false); window.RRCore.runtime.bind('dynamicWeatherAnnounced',false);
window.RRCore.runtime.bind('racePits',0); window.RRCore.runtime.bind('raceCrashes',0); window.RRCore.runtime.bind('raceOffroadSeconds',0); window.RRCore.runtime.bind('raceInsurance',false); window.RRCore.runtime.bind('raceDamageStart',0); window.RRCore.runtime.bind('ghostSampleTimer',0); window.RRCore.runtime.bind('ghostReplay',[]); window.RRCore.runtime.bind('shadowGhosts',[]); window.RRCore.runtime.bind('radioTimer',0); window.RRCore.runtime.bind('radioText',''); window.RRCore.runtime.bind('finishBannerTimer',0); window.RRCore.runtime.bind('photoFinishSlowmo',0); window.RRCore.runtime.bind('tutorialHintThisRace',false); window.RRCore.runtime.bind('lastPitRadioLap',0); window.RRCore.runtime.bind('runtimeQuality',null); window.RRCore.runtime.bind('slowFrameCount',0); window.RRCore.runtime.bind('lastFrameRender',0);
window.RRCore.runtime.bind('gamepadIntent',{ steer:0, accel:false, brake:false, nitro:false, connected:false });
window.RRCore.runtime.bind('STRINGS',{ 'pt-BR': { pitOpen:'PIT ABERTO', lastLap:'ÚLTIMA VOLTA', viperClosing:'VIPER COLANDO', rainComing:'CHUVA CHEGANDO' }, 'en-US': {} });

window.RRCore.runtime.bind('AudioContextClass',window.AudioContext || window.webkitAudioContext);
window.RRCore.runtime.bind('audioCtx',null);
window.RRCore.runtime.bind('engineOsc',null);
window.RRCore.runtime.bind('engineGain',null);
window.RRCore.runtime.bind('engineFilter',null);
window.RRCore.runtime.bind('musicGain',null);
window.RRCore.runtime.bind('sfxGain',null);
window.RRCore.runtime.bind('musicTimer',null);
window.RRCore.runtime.bind('nextMusicTime',0);
window.RRCore.runtime.bind('musicStep',0);
window.RRCore.runtime.bind('noiseBuffer',null);
window.RRCore.runtime.bind('audioInitialized',false);
window.RRCore.runtime.bind('MENU_MUSIC_LOOP_START',8 * 16);
window.RRCore.runtime.bind('MENU_MUSIC_LOOP_END',64 * 16);

globalThis.createNoiseBuffer = function createNoiseBuffer() {
    if (!audioCtx) return null;
    const len = Math.floor(audioCtx.sampleRate * .7);
    const buffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = rrRandom('audio') * 2 - 1;
    return buffer;
}
globalThis.initAudio = function initAudio() {
    if (audioInitialized || !AudioContextClass) return;
    try {
        audioCtx = new AudioContextClass();
        const master = audioCtx.createDynamicsCompressor();
        master.threshold.value = -18;
        master.knee.value = 18;
        master.ratio.value = 4;
        master.attack.value = .003;
        master.release.value = .22;
        master.connect(audioCtx.destination);
        musicGain = audioCtx.createGain();
        sfxGain = audioCtx.createGain();
        musicGain.gain.value = .36;
        sfxGain.gain.value = .70;
        musicGain.connect(master);
        sfxGain.connect(master);
        noiseBuffer = createNoiseBuffer();
        engineOsc = audioCtx.createOscillator();
        engineGain = audioCtx.createGain();
        engineFilter = audioCtx.createBiquadFilter();
        engineOsc.type = 'sawtooth';
        engineOsc.frequency.value = 45;
        engineFilter.type = 'lowpass';
        engineFilter.frequency.value = 520;
        engineFilter.Q.value = 1.2;
        engineGain.gain.value = 0;
        engineOsc.connect(engineFilter);
        engineFilter.connect(engineGain);
        engineGain.connect(sfxGain);
        engineOsc.start();
        audioInitialized = true;
        // V36: música procedural premium externa substitui a música interna simples.
        if (window.RetroRacerMusic999Bridge) { /* bridge pronto após o carregamento dos scripts */ }
    } catch (err) { audioInitialized = false; }
}
globalThis.resumeAudio = function resumeAudio() {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    startMusic();
}
globalThis.env = function env(dest, t, g, a, h, r) {
    const node = audioCtx.createGain();
    node.gain.setValueAtTime(.0001, t);
    node.gain.exponentialRampToValueAtTime(Math.max(.0002, g), t + a);
    node.gain.setValueAtTime(Math.max(.0002, g), t + a + h);
    node.gain.exponentialRampToValueAtTime(.0001, t + a + h + r);
    node.connect(dest);
    return node;
}
globalThis.note = function note(root, semi) { return root * Math.pow(2, semi / 12); }
globalThis.synth = function synth(freq, t, dur, opt = {}) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const f = audioCtx.createBiquadFilter();
    const g = env(opt.bus || musicGain, t, opt.gain || .05, opt.attack || .006, Math.max(.015, dur * .45), opt.release || .08);
    osc.type = opt.type || 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    if (opt.slideTo) osc.frequency.exponentialRampToValueAtTime(opt.slideTo, t + dur);
    f.type = opt.filterType || 'lowpass';
    f.frequency.setValueAtTime(opt.filter || 1600, t);
    f.Q.value = opt.q || 1;
    osc.connect(f); f.connect(g);
    osc.start(t); osc.stop(t + dur + .18);
}
globalThis.noise = function noise(t, dur, opt = {}) {
    if (!audioCtx || !noiseBuffer) return;
    const src = audioCtx.createBufferSource();
    const f = audioCtx.createBiquadFilter();
    const g = env(opt.bus || sfxGain, t, opt.gain || .05, opt.attack || .002, Math.max(.01, dur * .3), opt.release || .06);
    src.buffer = noiseBuffer;
    f.type = opt.filterType || 'highpass';
    f.frequency.setValueAtTime(opt.filter || 5000, t);
    f.Q.value = opt.q || .7;
    src.connect(f); f.connect(g);
    src.start(t); src.stop(t + dur + .12);
}
globalThis.kick = function kick(t) { synth(126, t, .16, { type:'sine', gain:.09, slideTo:42, filter:400, bus:musicGain, release:.08 }); }
globalThis.snare = function snare(t) { noise(t, .12, { gain:.05, filterType:'bandpass', filter:1700, bus:musicGain }); synth(190, t, .06, { type:'triangle', gain:.025, filter:700, bus:musicGain }); }
globalThis.hat = function hat(t) { noise(t, .035, { gain:.022, filterType:'highpass', filter:7200, bus:musicGain, release:.025 }); }

globalThis.menuKick = function menuKick(t, soft = false) {
    synth(92, t, .22, { type:'sine', gain: soft ? .035 : .058, slideTo:36, filter:360, bus:musicGain, release:.12 });
    if (!soft) noise(t, .025, { gain:.010, filterType:'highpass', filter:4800, bus:musicGain, release:.018 });
}
globalThis.menuSnare = function menuSnare(t, soft = false) {
    noise(t, .16, { gain: soft ? .025 : .040, filterType:'bandpass', filter:2100, q:1.1, bus:musicGain, release:.09 });
    synth(176, t, .08, { type:'triangle', gain: soft ? .010 : .018, filter:780, bus:musicGain, release:.05 });
}
globalThis.menuHat = function menuHat(t, open = false) {
    noise(t, open ? .14 : .04, { gain: open ? .018 : .010, filterType:'highpass', filter:7600, bus:musicGain, release: open ? .08 : .022 });
}
globalThis.menuBass = function menuBass(freq, t, dur, accent = 1) {
    synth(freq, t, dur, { type:'sawtooth', gain:.030 * accent, filter:560, q:1.7, bus:musicGain, attack:.004, release:.08 });
    synth(freq * .5, t, dur * .9, { type:'triangle', gain:.018 * accent, filter:360, q:.8, bus:musicGain, attack:.006, release:.08 });
}
globalThis.menuBell = function menuBell(freq, t, dur, gain = .018) {
    synth(freq, t, dur, { type:'triangle', gain, filter:2400, q:1.2, bus:musicGain, attack:.012, release:.18 });
    synth(freq * 2.01, t + .006, dur * .62, { type:'sine', gain:gain * .32, filter:3200, q:.8, bus:musicGain, attack:.010, release:.14 });
}
globalThis.menuPad = function menuPad(freqs, t, dur, gain = .012) {
    freqs.forEach((f, idx) => {
        synth(f, t + idx * .015, dur, { type: idx % 2 ? 'triangle' : 'sawtooth', gain, filter:950, q:.45, bus:musicGain, attack:.12, release:.42 });
    });
}
globalThis.menuLead = function menuLead(freq, t, dur, gain = .024) {
    synth(freq, t, dur, { type:'square', gain, filter:2600, q:.75, bus:musicGain, attack:.010, release:.16 });
    synth(freq * 1.005, t + .004, dur * .95, { type:'triangle', gain: gain * .45, filter:3000, q:.65, bus:musicGain, attack:.014, release:.16 });
}
globalThis.isMenuMusicAllowed = function isMenuMusicAllowed() {
    return audioCtx && audioCtx.state === 'running' && !gamePaused && (gameMode === 'menu' || gameMode === 'help' || gameMode === 'stats');
}
globalThis.musicTick = function musicTick(step, t) {
    // V42: tema de menu próprio. Mais calmo e cinematográfico que corrida, mas ainda 16 bits premium.
    const bpm = 108;
    const pos = step % 16;
    const bar = Math.floor(step / 16) % 64;
    const chordNames = ['Fm', 'Db', 'Ab', 'Eb', 'Fm', 'Db', 'Cm', 'Eb'];
    const chord = chordNames[Math.floor(bar / 2) % chordNames.length];
    const roots = { Fm:87.31, Db:69.30, Ab:103.83, Eb:77.78, Cm:65.41 };
    const thirds = { Fm:103.83, Db:87.31, Ab:130.81, Eb:98.00, Cm:77.78 };
    const fifths = { Fm:130.81, Db:103.83, Ab:155.56, Eb:116.54, Cm:98.00 };
    const sevenths = { Fm:155.56, Db:130.81, Ab:196.00, Eb:146.83, Cm:116.54 };
    const root = roots[chord], third = thirds[chord], fifth = fifths[chord], seventh = sevenths[chord];

    const intro = bar < 8;
    const bridge = bar >= 40 && bar < 48;
    const climax = bar >= 48;

    if (pos === 0) menuPad([root, third, fifth, seventh].map(f => f * 2), t, (60 / bpm) * 3.6, intro ? .006 : .010);
    if (!intro || bar >= 4) {
        if (pos === 0 || pos === 8) menuKick(t, bridge);
        if ((pos === 4 || pos === 12) && !intro) menuSnare(t, bridge);
        if (pos % 2 === 0 && !bridge) menuHat(t, pos === 14 && climax);
    }

    const bassPattern = intro ? [0,0,0,0, 7,0,0,0, 0,0,0,0, 5,0,7,0] : [0,0,7,0, 0,12,7,0, 0,0,7,0, 5,0,3,0];
    const bassSemi = bassPattern[pos];
    if (bassSemi !== 0 || pos === 0) menuBass(note(root, bassSemi), t, (60 / bpm) * .38, pos === 0 ? 1.15 : .82);

    const arpSet = [root*4, third*4, fifth*4, seventh*4, fifth*4, third*4, seventh*2, fifth*4];
    if (!bridge && (pos === 2 || pos === 6 || pos === 10 || pos === 14)) {
        menuBell(arpSet[(Math.floor(step / 4) + bar) % arpSet.length], t, (60 / bpm) * .32, intro ? .010 : .015);
    }

    const leadA = [0,0,5,0, 7,0,12,0, 10,0,7,0, 5,3,0,0];
    const leadB = [12,0,10,0, 8,0,7,0, 5,0,7,0, 10,12,0,0];
    const lead = (bar % 16 < 8 ? leadA : leadB)[pos];
    if (!intro && lead) {
        const base = bar >= 24 ? root * 4 : root * 2;
        menuLead(note(base, lead), t, (60 / bpm) * (climax ? .62 : .46), climax ? .028 : .020);
    }

    if (bridge && (pos === 3 || pos === 7 || pos === 11 || pos === 15)) {
        menuBell(note(root * 4, [12, 10, 7, 5][Math.floor(pos / 4)]), t, (60 / bpm) * .45, .014);
    }

    return (60 / bpm) / 4;
}
globalThis.startMusic = function startMusic() {
    if (!audioCtx || musicTimer) return;
    nextMusicTime = audioCtx.currentTime + .08;
    musicStep = 0;
    musicTimer = setInterval(() => {
        if (!audioCtx || audioCtx.state !== 'running') return;
        if (!isMenuMusicAllowed()) { nextMusicTime = audioCtx.currentTime + .08; return; }
        while (nextMusicTime < audioCtx.currentTime + .18) {
            nextMusicTime += musicTick(musicStep, nextMusicTime);
            musicStep++;
            if (musicStep >= MENU_MUSIC_LOOP_END) musicStep = MENU_MUSIC_LOOP_START;
        }
    }, 28);
}
globalThis.playSFX = function playSFX(type) {
    if(globalThis.a11yCaptionSfx)a11yCaptionSfx(type);
    if (window.RetroRacerSFX && window.RetroRacerSFX.playFromGame) {
        try { window.RetroRacerSFX.playFromGame(type, { level: raceLevel, speedRatio: maxSpeed ? speed / maxSpeed : 0 }); return; } catch (e) {}
    }
    if (!audioCtx || audioCtx.state !== 'running') return;
    const t = audioCtx.currentTime;
    if (type === 'beep') { const f = [330,370,415][Math.floor(performance.now()/250)%3]; synth(f, t, .13, { type:'square', gain:.05, filter:1200, bus:sfxGain }); }
    else if (type === 'go') { [262,330,392].forEach((f,i) => synth(f, t+i*.035, .18, { type:'sawtooth', gain:.045, filter:1600, bus:sfxGain })); }
    else if (type === 'engine') {
        noise(t, .055, { gain:.032, filterType:'bandpass', filter:1450, q:1.4, bus:sfxGain });
        synth(48, t, .28, { type:'sawtooth', gain:.050, slideTo:82, filter:620, q:1.1, bus:sfxGain, release:.12 });
        synth(84, t + .16, .34, { type:'sawtooth', gain:.043, slideTo:138, filter:880, q:1.0, bus:sfxGain, release:.15 });
        synth(132, t + .42, .32, { type:'triangle', gain:.032, slideTo:112, filter:980, q:.8, bus:sfxGain, release:.18 });
    }
    else if (type === 'nitro') { noise(t, .22, { gain:.08, filterType:'bandpass', filter:1200, q:1.2, bus:sfxGain }); synth(120, t, .22, { type:'sawtooth', gain:.055, slideTo:260, filter:900, bus:sfxGain }); }
    else if (type === 'crash') { noise(t, .28, { gain:.13, filterType:'lowpass', filter:1800, bus:sfxGain }); synth(130, t, .24, { type:'square', gain:.07, slideTo:45, filter:600, bus:sfxGain }); }
    else if (type === 'skid') { noise(t, .13, { gain:.042, filterType:'bandpass', filter:2600, q:2.2, bus:sfxGain }); }
    else if (type === 'pit') { synth(1200, t, .045, { type:'sine', gain:.04, filter:2500, bus:sfxGain, release:.025 }); }
    else if (type === 'alarm') { synth(820, t, .12, { type:'square', gain:.045, filter:1500, bus:sfxGain }); synth(620, t + .08, .10, { type:'square', gain:.035, filter:1400, bus:sfxGain }); }
    else if (type === 'buy') { [523,659,784].forEach((f,i) => synth(f, t+i*.055, .12, { type:'triangle', gain:.04, filter:2200, bus:sfxGain })); }
    else if (type === 'win') { [523,659,784,1046].forEach((f,i) => synth(f, t+i*.08, .18, { type:'sawtooth', gain:.05, filter:2300, bus:sfxGain })); }
    else if (type === 'fail') { synth(220, t, .58, { type:'sawtooth', gain:.075, slideTo:45, filter:700, bus:sfxGain, release:.28 }); }
}
globalThis.updateAudio = function updateAudio(isAccel, isBrake) {
    if (window.RetroRacerSFX && window.RetroRacerSFX.updateFromGame) {
        try {
            const nitroActiveNowV38 = !!(keys.Nitro || touchDrive.nitro || gamepadIntent.nitro || virtualState().nitro);
            const damageV38 = (career && typeof currentCar === 'function' && career.carDamage) ? Number(career.carDamage[currentCar().id] || 0) : 0;
            window.RetroRacerSFX.updateFromGame({
                level: raceLevel,
                race: gameMode === 'race' && !gamePaused && !finished && !gameOver,
                speed: speed,
                maxSpeed: maxSpeed,
                speedRatio: maxSpeed ? speed / maxSpeed : 0,
                accel: !!isAccel,
                brake: !!isBrake,
                nitro: nitroActiveNowV38,
                offroad: playerX < -1 || playerX > 1,
                damage: damageV38
            });
            if (engineGain && audioCtx) engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, .06);
            return;
        } catch (e) {}
    }
    if (!audioInitialized || !audioCtx || audioCtx.state !== 'running') return;
    const sr = speed / maxSpeed;
    const nitroActiveNow = keys.Nitro || touchDrive.nitro || gamepadIntent.nitro || virtualState().nitro;
    const targetFreq = 42 + sr * 195 + (isAccel ? 24 : 0) + (isBrake ? -12 : 0) + (nitroActiveNow ? 38 : 0);
    const targetFilter = 420 + sr * 1050 + (nitroActiveNow ? 350 : 0);
    const targetVol = (finished || gameMode !== 'race' || gamePaused) ? 0 : isAccel ? .13 : sr > .08 ? .055 : .015;
    engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, .08);
    engineFilter.frequency.setTargetAtTime(targetFilter, audioCtx.currentTime, .12);
    engineGain.gain.setTargetAtTime(targetVol, audioCtx.currentTime, .12);
}
