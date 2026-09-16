
"use strict";
(function(){
class Retro16DistinctTracker {
    constructor(track, ui = {}) {
        this.track = track;
        this.ui = ui;
        this.ctx = null;
        this.isPlaying = false;
        this.timer = null;
        this.step = 0;
        this.bar = 0;
        this.startTime = 0;
        this.nextStepTime = 0;
        this.lookaheadMs = 22;
        this.scheduleAhead = 0.14;
        this.noiseBuffer = null;
        this.master = null;
        this.masterFade = null;
        this.delay = null;
        this.delaySend = null;
        this.sidechainBus = null;
        this.channelGains = [];
        this.raceFilter = null; this.raceWet = null; this.raceDelay = null; this.adaptivePitchSemitones = 0;
        this.lastLeadNote = 0;
        this.pausedByGame = false;
    }
    get quarterDur(){ return 60 / this.track.bpm; }
    get stepDur(){ return this.quarterDur / 4; }
    get barDur(){ return this.quarterDur * 4; }
    midiToFreq(midi){ return 440 * Math.pow(2, (midi + (this.adaptivePitchSemitones||0) - 69) / 12); }
    setTrack(track){ const was = this.isPlaying; if (was) this.stop(true); this.track = track; if (was) setTimeout(()=>this.start(), 120); }
    createNoiseBuffer(){
        const length = Math.floor(this.ctx.sampleRate * 2.0);
        const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < length; i++) { const white = ((window.RRCore&&window.RRCore.rng)?window.RRCore.rng.random('audio'):0.5) * 2 - 1; last = last * 0.42 + white * 0.58; data[i] = last; }
        return buffer;
    }
    makeSaturator(amount = 1.30){
        const shaper = this.ctx.createWaveShaper();
        const n = 2048; const curve = new Float32Array(n);
        for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; curve[i] = Math.tanh(x * amount); }
        shaper.curve = curve; shaper.oversample = "2x"; return shaper;
    }
    initAudio(){
        if (this.ctx) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.noiseBuffer = this.createNoiseBuffer();
        this.masterFade = this.ctx.createGain(); this.masterFade.gain.value = 0.0001;
        const snesLowpass = this.ctx.createBiquadFilter(); snesLowpass.type = "lowpass"; snesLowpass.frequency.value = this.track.snesToneHz || 5900; snesLowpass.Q.value = 0.42;
        const saturator = this.makeSaturator((this.track.timbre && this.track.timbre.saturation) || 1.30);
        const compressor = this.ctx.createDynamicsCompressor(); compressor.threshold.value = -14; compressor.knee.value = 8; compressor.ratio.value = 4.0; compressor.attack.value = 0.003; compressor.release.value = 0.15;
        this.master = this.ctx.createGain(); this.master.gain.value = this.track.masterVolume || 0.8;
        this.raceFilter=this.ctx.createBiquadFilter();this.raceFilter.type="lowpass";this.raceFilter.frequency.value=20000;this.raceFilter.Q.value=.25;
        this.raceDelay=this.ctx.createDelay(.35);this.raceDelay.delayTime.value=.075;this.raceWet=this.ctx.createGain();this.raceWet.gain.value=0;const raceFb=this.ctx.createGain();raceFb.gain.value=.18;
        this.master.connect(this.raceFilter);this.master.connect(this.raceDelay);this.raceDelay.connect(raceFb);raceFb.connect(this.raceDelay);this.raceDelay.connect(this.raceWet);this.raceWet.connect(this.raceFilter);
        this.raceFilter.connect(snesLowpass); snesLowpass.connect(saturator); saturator.connect(compressor); compressor.connect(this.masterFade); this.masterFade.connect(this.ctx.destination);
        const levels = (this.track.timbre && this.track.timbre.channelLevels) || [1.0, 0.82, 0.34, 0.84, 0.24, 0.66, 0.52, 0.32];
        this.channelGains = levels.map(level => { const g = this.ctx.createGain(); g.gain.value = level; g.connect(this.master); return g; });
        this.sidechainBus = this.ctx.createGain(); this.sidechainBus.gain.value = 1; this.sidechainBus.connect(this.channelGains[5]);
        this.delay = this.ctx.createDelay(1.6); this.delay.delayTime.value = this.stepDur * ((this.track.timbre && this.track.timbre.delaySteps) || 3);
        const fb = this.ctx.createGain(); fb.gain.value = (this.track.timbre && this.track.timbre.delayFeedback) || 0.34;
        const fbFilter = this.ctx.createBiquadFilter(); fbFilter.type = "bandpass"; fbFilter.frequency.value = (this.track.timbre && this.track.timbre.delayFilterHz) || 930; fbFilter.Q.value = 0.8;
        this.delaySend = this.ctx.createGain(); this.delaySend.gain.value = (this.track.timbre && this.track.timbre.delaySend) || 0.55;
        this.delaySend.connect(this.delay); this.delay.connect(fbFilter); fbFilter.connect(fb); fb.connect(this.delay); fbFilter.connect(this.master);
    }
    getSection(bar){ return this.track.sections.find(sec => bar >= sec.from && bar <= sec.to) || this.track.sections[1]; }
    getChordForBar(bar){ const sec = this.getSection(bar); const local = bar - sec.from; const name = sec.progression[local % sec.progression.length]; return { sec, name, chord: this.track.chords[name], local }; }
    triggerSidechain(t){ if (!this.sidechainBus) return; const g = this.sidechainBus.gain; g.cancelScheduledValues(t); g.setValueAtTime(Math.max(0.75, g.value || 1), t); g.exponentialRampToValueAtTime(0.20, t + 0.015); g.linearRampToValueAtTime(1.0, t + 0.28); }
    meter(ch, power = 1){
        if (!this.ui || !this.ui.meter) return;
        const delay = Math.max(0, (this.nextStepTime - this.ctx.currentTime) * 1000);
        window.setTimeout(() => this.ui.meter(ch, power), delay);
    }
    playKick(t, accent = 1){
        const timbre = this.track.timbre || {};
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = "sine"; osc.frequency.setValueAtTime(timbre.kickStart || 180, t); osc.frequency.exponentialRampToValueAtTime(45, t + 0.07); osc.frequency.exponentialRampToValueAtTime(Math.max(20, timbre.kickEnd || 32), t + 0.22);
        gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime(1.15 * accent, t + 0.01); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.connect(gain); gain.connect(this.channelGains[0]); osc.start(t); osc.stop(t + 0.35);
        const click = this.ctx.createBufferSource(); const clickGain = this.ctx.createGain(); const clickFilter = this.ctx.createBiquadFilter(); click.buffer = this.noiseBuffer; clickFilter.type = "highpass"; clickFilter.frequency.value = 3500;
        clickGain.gain.setValueAtTime(0.001, t); clickGain.gain.linearRampToValueAtTime(0.23 * accent, t + 0.002); clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
        click.connect(clickFilter); clickFilter.connect(clickGain); clickGain.connect(this.channelGains[0]); click.start(t); click.stop(t + 0.03);
        this.triggerSidechain(t); this.meter(0, accent);
    }
    playSnare(t, accent = 1){
        const timbre = this.track.timbre || {};
        const tone = this.ctx.createOscillator(); const toneGain = this.ctx.createGain(); tone.type = "triangle"; tone.frequency.setValueAtTime(timbre.snareTone || 260, t); tone.frequency.exponentialRampToValueAtTime(130, t + 0.08);
        toneGain.gain.setValueAtTime(0.001, t); toneGain.gain.linearRampToValueAtTime(0.55 * accent, t + 0.005); toneGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14); tone.connect(toneGain); toneGain.connect(this.channelGains[1]); tone.start(t); tone.stop(t + 0.16);
        const noise = this.ctx.createBufferSource(); const filter = this.ctx.createBiquadFilter(); const gain = this.ctx.createGain(); noise.buffer = this.noiseBuffer; filter.type = "bandpass"; filter.frequency.setValueAtTime(2800, t); filter.Q.value = 1.1;
        gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime(0.75 * accent, t + 0.005); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.20); noise.connect(filter); filter.connect(gain); gain.connect(this.channelGains[1]); gain.connect(this.delaySend); noise.start(t); noise.stop(t + 0.25); this.meter(1, accent);
    }
    playHat(t, open = false, accent = 1){ const timbre=this.track.timbre||{}; const noise = this.ctx.createBufferSource(); const filter = this.ctx.createBiquadFilter(); const gain = this.ctx.createGain(); noise.buffer = this.noiseBuffer; filter.type = "highpass"; filter.frequency.value = open ? (timbre.hatOpenHz||5200) : (timbre.hatClosedHz||5800); const dur = open ? 0.13 : 0.032; const lvl=(timbre.hatLevel||0.60); gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime((open ? 0.18 : 0.095) * accent * lvl, t + 0.004); gain.gain.exponentialRampToValueAtTime(0.001, t + dur); noise.connect(filter); filter.connect(gain); gain.connect(this.channelGains[2]); if (open) gain.connect(this.delaySend); noise.start(t); noise.stop(t + dur + 0.04); this.meter(2, accent * (open ? .85 : .55)); }
    playTom(t, midi = 48, accent = 1){ const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); osc.type = "sine"; osc.frequency.setValueAtTime(this.midiToFreq(midi), t); osc.frequency.exponentialRampToValueAtTime(this.midiToFreq(midi - 10), t + 0.18); gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime(0.55 * accent, t + 0.006); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22); osc.connect(gain); gain.connect(this.channelGains[1]); gain.connect(this.delaySend); osc.start(t); osc.stop(t + 0.25); this.meter(1, accent); }
    playBass(midi, t, dur, accent = 1){ if (!midi) return; const timbre=this.track.timbre||{}; const osc1 = this.ctx.createOscillator(); const osc2 = this.ctx.createOscillator(); const filter = this.ctx.createBiquadFilter(); const gain = this.ctx.createGain(); osc1.type = "sawtooth"; osc2.type = "square"; osc1.frequency.setValueAtTime(this.midiToFreq(midi), t); osc2.frequency.setValueAtTime(this.midiToFreq(midi), t); osc2.detune.value = timbre.bassDetune || -4; filter.type = "lowpass"; filter.frequency.setValueAtTime((timbre.bassCutoff||2200) + accent * 320, t); filter.frequency.exponentialRampToValueAtTime(150, t + dur * 0.72); filter.Q.value = timbre.bassQ || 1.25; gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime(0.62 * accent * (timbre.bassLevel||0.82), t + 0.006); gain.gain.exponentialRampToValueAtTime(0.001, t + dur); osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(this.channelGains[3]); osc1.start(t); osc2.start(t); osc1.stop(t + dur + 0.05); osc2.stop(t + dur + 0.05); this.meter(3, accent); }
    playArp(midi, t, dur, accent = 1){ if (!midi) return; const timbre=this.track.timbre||{}; const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); const filter = this.ctx.createBiquadFilter(); osc.type = timbre.arpWave || "triangle"; osc.frequency.setValueAtTime(this.midiToFreq(midi), t); filter.type = "lowpass"; filter.frequency.setValueAtTime((timbre.arpCutoff||1150) + accent * 260, t); filter.Q.value = 0.35; gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime((timbre.arpLevel||0.045) * accent, t + 0.006); gain.gain.exponentialRampToValueAtTime(0.001, t + dur); osc.connect(filter); filter.connect(gain); gain.connect(this.channelGains[4]); gain.connect(this.delaySend); osc.start(t); osc.stop(t + dur + 0.05); this.meter(4, accent * 0.45); }
    playPad(chordNotes, t, dur, intensity = 1){ if (!chordNotes || !chordNotes.length) return; const timbre=this.track.timbre||{}; chordNotes.forEach((midi, idx)=>{ [-3,3].forEach(detune=>{ const osc=this.ctx.createOscillator(); const filter=this.ctx.createBiquadFilter(); const gain=this.ctx.createGain(); osc.type = idx % 2 ? "triangle" : "sawtooth"; osc.frequency.setValueAtTime(this.midiToFreq(midi), t); osc.detune.value=detune; filter.type="lowpass"; filter.frequency.setValueAtTime((timbre.padCutoff||1050)+intensity*350,t); filter.Q.value=0.45; const vol=0.034*intensity*(timbre.padLevel||0.86); gain.gain.setValueAtTime(0.001,t); gain.gain.linearRampToValueAtTime(vol,t+0.28); gain.gain.setValueAtTime(vol,Math.max(t+0.3,t+dur-0.25)); gain.gain.linearRampToValueAtTime(0.001,t+dur); osc.connect(filter); filter.connect(gain); gain.connect(this.sidechainBus); gain.connect(this.delaySend); osc.start(t); osc.stop(t+dur+0.15); }); }); this.meter(5,intensity*.72); }
    playLead(midi, t, dur, accent = 1, glideFrom = 0){ if (!midi) return; const timbre = this.track.timbre || {}; const osc1 = this.ctx.createOscillator(); const osc2 = this.ctx.createOscillator(); const filter = this.ctx.createBiquadFilter(); const gain = this.ctx.createGain(); const lfo = this.ctx.createOscillator(); const lfoGain = this.ctx.createGain(); osc1.type = timbre.leadWaveA || "triangle"; osc2.type = timbre.leadWaveB || "sine"; const target = this.midiToFreq(midi); if (glideFrom) { const from = this.midiToFreq(glideFrom); osc1.frequency.setValueAtTime(from, t); osc2.frequency.setValueAtTime(from, t); osc1.frequency.exponentialRampToValueAtTime(target, t + 0.045); osc2.frequency.exponentialRampToValueAtTime(target, t + 0.045); } else { osc1.frequency.setValueAtTime(target, t); osc2.frequency.setValueAtTime(target, t); } osc2.detune.value = timbre.leadDetune || 4; lfo.type = "sine"; lfo.frequency.value = 5.1; lfoGain.gain.setValueAtTime(0, t); lfoGain.gain.linearRampToValueAtTime(0, t + (timbre.leadVibratoDelay || 0.18)); lfoGain.gain.linearRampToValueAtTime(timbre.leadVibratoDepth || 5.2, t + 0.32); lfo.connect(lfoGain); lfoGain.connect(osc1.detune); lfoGain.connect(osc2.detune); filter.type = "lowpass"; filter.frequency.setValueAtTime((timbre.leadCutoff || 2500) + accent * 260, t); filter.Q.value = 0.48; const lv = timbre.leadLevel || 0.62; gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime(0.18 * accent * lv, t + 0.025); gain.gain.setValueAtTime(0.14 * accent * lv, Math.max(t + 0.03, t + dur - 0.08)); gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04); osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(this.channelGains[6]); if ((timbre.leadDelaySend||0.25)>0.01) gain.connect(this.delaySend); lfo.start(t); lfo.stop(t + dur + 0.1); osc1.start(t); osc2.start(t); osc1.stop(t + dur + 0.1); osc2.stop(t + dur + 0.1); this.meter(6, accent*.72); }
    playCounter(midi, t, dur, accent = 1){ if (!midi) return; const timbre=this.track.timbre||{}; const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); const filter = this.ctx.createBiquadFilter(); osc.type = "triangle"; osc.frequency.setValueAtTime(this.midiToFreq(midi), t); filter.type = "bandpass"; filter.frequency.value = 1800; filter.Q.value = 1.0; gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime(0.12 * accent * (timbre.counterLevel||0.42), t + 0.012); gain.gain.exponentialRampToValueAtTime(0.001, t + dur); osc.connect(filter); filter.connect(gain); gain.connect(this.channelGains[7]); gain.connect(this.delaySend); osc.start(t); osc.stop(t + dur + 0.05); this.meter(7, accent * 0.35); }
    playRiser(t, dur = 1.4, accent = 1){ const timbre=this.track.timbre||{}; const noise = this.ctx.createBufferSource(); const filter = this.ctx.createBiquadFilter(); const gain = this.ctx.createGain(); noise.buffer = this.noiseBuffer; filter.type = "bandpass"; filter.frequency.setValueAtTime(300, t); filter.frequency.exponentialRampToValueAtTime(timbre.riserTopHz || 3800, t + dur); filter.Q.value = 1.8; gain.gain.setValueAtTime(0.001, t); gain.gain.linearRampToValueAtTime(0.22 * accent * (timbre.riserLevel||0.55), t + dur * 0.75); gain.gain.exponentialRampToValueAtTime(0.001, t + dur); noise.connect(filter); filter.connect(gain); gain.connect(this.channelGains[7]); gain.connect(this.delaySend); noise.start(t); noise.stop(t + dur + 0.05); this.meter(7, accent*.55); }
    getDrumHit(sec, bar, step){
        const style = this.track.rhythm.drumStyle; const local = bar - sec.from; const isFill = local % 8 === 7 || (sec.key === "build" && local % 4 === 3) || bar === this.track.totalBars - 1;
        if (sec.key === "breakdown") { if (local < 12) return step === 0 && local % 4 === 0 ? "kickSoft" : null; if ([0,4,8,10,12,14,15].includes(step)) return step % 4 === 0 ? "kick" : "snareSoft"; return null; }
        if (sec.key === "intro" && local < 4) { if (step === 0 || step === 10) return "kickSoft"; if (step === 12 && local % 2 === 1) return "snareSoft"; return null; }
        if (bar === this.track.totalBars - 1 || isFill) { if ([0,4,8].includes(step)) return "kick"; if ([12,14,15].includes(step)) return "snare"; if ([10,11,13].includes(step)) return "tom"; return null; }
        if (style === "machine") { if ([0,3,6,8,11].includes(step)) return "kick"; if ([4,12].includes(step)) return "snare"; }
        else if (style === "sparse") { if ([0,8].includes(step)) return "kick"; if ([4,12].includes(step)) return "snare"; }
        else if (style === "stomp") { if ([0,6,8,10].includes(step)) return "kick"; if ([4,12].includes(step)) return "snare"; }
        else if (style === "bright" || style === "openroad") { if ([0,7,10].includes(step)) return "kick"; if ([4,12].includes(step)) return "snare"; }
        else if (style === "anthem") { if ([0,8].includes(step)) return "kick"; if ([4,12,14].includes(step)) return "snare"; }
        else { if ([0,8,10].includes(step)) return "kick"; if ([4,12].includes(step)) return "snare"; }
        return null;
    }
    getBassNote(chord, sec, bar, step){
        if (sec.key === "breakdown") return step === 0 && (bar - sec.from) % 4 === 0 ? chord.bass : 0;
        const style = this.track.rhythm.bassStyle; const pDrive=[chord.bass,0,chord.bass,0,chord.root,0,chord.fifth,chord.bass,chord.root,0,chord.bass,0,chord.fifth,0,chord.root,0];
        const pFast=[chord.bass,0,chord.root,0,chord.fifth,0,chord.root,chord.bass,chord.root,0,chord.fifth,0,chord.root,0,chord.fifth,chord.root];
        const pBounce=[chord.bass,0,0,chord.root,0,chord.fifth,0,0,chord.root,0,chord.bass,0,chord.fifth,0,chord.root,0];
        const pStutter=[chord.bass,chord.bass,0,0,chord.root,0,chord.fifth,0,chord.bass,0,chord.root,chord.root,0,chord.fifth,0,chord.root];
        const pHeavy=[chord.bass,0,0,0,chord.root,0,chord.bass,0,chord.fifth,0,0,0,chord.root,0,chord.fifth,0];
        let p = style === "fast" ? pFast : style === "bounce" ? pBounce : style === "stutter" ? pStutter : style === "heavy" ? pHeavy : pDrive;
        if (sec.key === "climax" || sec.key === "themeA2") p = pFast;
        if (sec.key === "intro" && bar - sec.from < 4) return step === 0 ? chord.bass : 0;
        return p[step];
    }
    getLeadNote(sec, bar, step){ if (sec.key === "intro" || sec.key === "breakdown") return 0; const bank = this.track.melodies[sec.key] || this.track.melodies.themeA; const local = bar - sec.from; const phrase = bank[local % bank.length]; return phrase[step] || 0; }
    getCounterNote(sec, bar, step, chord){ const timbre=this.track.timbre||{}; if (!(sec.key === "themeB" || sec.key === "climax" || sec.key === "build")) return 0; const steps=timbre.counterSteps||[6,14]; if (!steps.includes(step)) return 0; const local = bar - sec.from; const notes = chord.arp; const idx = (local * 2 + step) % notes.length; const add = sec.key === "climax" ? (timbre.counterOctaveClimax||0) : (timbre.counterOctaveTheme||0); return notes[idx] + add; }
    scheduleStep(){
        const {sec, chord, local} = this.getChordForBar(this.bar); const t = this.nextStepTime + ((this.track.rhythm.swing && this.step % 2) ? this.track.rhythm.swing : 0); const step = this.step; const intensity = sec.intensity; const stepDur = this.stepDur;
        if (this.ui && this.ui.update) window.setTimeout(()=>this.ui.update(this, sec), Math.max(0,(t-this.ctx.currentTime)*1000));
        const hit = this.getDrumHit(sec, this.bar, step); if (hit === "kick") this.playKick(t, 1.0 + intensity * 0.15); if (hit === "kickSoft") this.playKick(t, 0.65); if (hit === "snare") this.playSnare(t, 0.95 + intensity * 0.15); if (hit === "snareSoft") this.playSnare(t, 0.50); if (hit === "tom") this.playTom(t, [48,46,44,41][step % 4], 0.90);
        if (sec.key !== "breakdown") { const dens = (this.track.rhythm.hatDensity || 0.56); if (sec.key === "intro") { if ([2,10].includes(step)) this.playHat(t,false,0.50); } else if (sec.key === "build") { if (step % 4 === 0 || (local > 8 && step % 2 === 0)) this.playHat(t, step === 15, 0.68); } else if (sec.key === "climax") { if (step % 2 === 0) this.playHat(t, step === 15, step % 4 === 0 ? 0.78 : 0.55); } else { if (step % 4 === 0 || (dens > .58 && step === 10)) this.playHat(t, step === 15, 0.55); } }
        const bass = this.getBassNote(chord, sec, this.bar, step); if (bass) this.playBass(bass, t, stepDur * 1.35, 0.75 + intensity * 0.45);
        if (sec.key !== "intro" || local >= 4) { const timbre=this.track.timbre||{}; const every=timbre.arpEvery||2; const allowArp = (sec.key === "breakdown") ? step % 4 === 0 : ((step + local) % every === 0 && step % 2 === 0); if (allowArp) { const arpNote = chord.arp[(step + local * 2) % chord.arp.length]; const octave = 0; this.playArp(arpNote + octave, t, stepDur * 0.92, 0.45 + intensity * 0.28); } }
        if (step === 0) { let dur = this.barDur * 0.98; if (sec.key === "breakdown") dur = this.barDur * 1.45; this.playPad(chord.chord, t, dur, 0.65 + intensity * 0.40); }
        const lead = this.getLeadNote(sec, this.bar, step); if (lead) { const glide = this.lastLeadNote && step > 0 ? this.lastLeadNote : 0; this.playLead(lead, t, stepDur * (sec.key === "build" ? 1.55 : 3.05), 0.62 + intensity * 0.32, glide); this.lastLeadNote = lead; } else if (step === 0) this.lastLeadNote = 0;
        const counter = this.getCounterNote(sec, this.bar, step, chord); if (counter) this.playCounter(counter, t, stepDur * 1.2, 0.65 + intensity * 0.45);
        if ((this.bar === 119 || this.bar === 135 || this.bar === 159) && step === 0) this.playRiser(t, this.barDur * 0.95, 0.95);
        this.nextStepTime += stepDur; this.step++;
        if (this.step >= this.track.stepsPerBar) { this.step = 0; this.bar++; if (this.bar >= this.track.totalBars) { this.bar = this.track.loopStartBar; this.lastLeadNote = 0; } }
    }
    scheduler(){ if (!this.isPlaying) return; if (this.pausedByGame) { this.nextStepTime = this.ctx.currentTime + 0.08; this.timer = window.setTimeout(()=>this.scheduler(), this.lookaheadMs); return; } while (this.nextStepTime < this.ctx.currentTime + this.scheduleAhead) this.scheduleStep(); this.timer = window.setTimeout(()=>this.scheduler(), this.lookaheadMs); }
    async start(){ if (this.isPlaying) return; this.initAudio(); if (this.ctx.state === "suspended") await this.ctx.resume(); this.isPlaying = true; this.pausedByGame = false; this.step = 0; this.bar = 0; this.lastLeadNote = 0; this.startTime = this.ctx.currentTime; this.nextStepTime = this.ctx.currentTime + 0.085; this.masterFade.gain.cancelScheduledValues(this.ctx.currentTime); this.masterFade.gain.setValueAtTime(0.0001, this.ctx.currentTime); this.masterFade.gain.exponentialRampToValueAtTime(1.0, this.ctx.currentTime + 0.8); if (this.ui && this.ui.state) this.ui.state("STARTING"); this.scheduler(); }
    pause(){ if (!this.isPlaying) return; this.pausedByGame = true; if (this.masterFade) this.masterFade.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.12); }
    resume(){ if (!this.isPlaying) return; this.pausedByGame = false; if (this.masterFade) this.masterFade.gain.setTargetAtTime(1.0, this.ctx.currentTime, 0.20); }
    stop(quick=false){ if (!this.isPlaying) return; this.isPlaying = false; window.clearTimeout(this.timer); if (!this.ctx) return; const now = this.ctx.currentTime; this.masterFade.gain.cancelScheduledValues(now); this.masterFade.gain.setValueAtTime(Math.max(0.0001, this.masterFade.gain.value), now); this.masterFade.gain.exponentialRampToValueAtTime(0.0001, now + (quick ? 0.08 : 0.55)); const closeDelay = quick ? 120 : 760; window.setTimeout(async()=>{ if (this.ctx) { try { await this.ctx.close(); } catch(e) {} this.ctx = null; } if (this.ui && this.ui.state) this.ui.state("OFFLINE"); }, closeDelay); }
}
window.Retro16DistinctTracker = Retro16DistinctTracker;
})();

window.Retro16ClassicTracker = window.Retro16DistinctTracker;
