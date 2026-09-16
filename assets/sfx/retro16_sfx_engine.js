/*
Retro Racer Championship - V38 Premium Audio FX Engine
Motor procedural, pneus, nitro, colisões, largada, UI e jingles.
Direção sonora: 16 bits clássico, médio-grave, sem assobios agudos irritantes.
*/
(function(){
  'use strict';

  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
  function midiToHz(m){ return 440 * Math.pow(2, (m - 69) / 12); }

  class Retro16SFXEngine {
    constructor(bank){
      this.bank = bank || window.RETRO16_SFX_BANK || null;
      this.ctx = null;
      this.master = null;
      this.masterTone = null; this.adaptiveCutoff = 6200; this.muffleTimer = null;
      this.engineBus = null;
      this.sfxBus = null;
      this.uiBus = null;
      this.ambientBus = null;
      this.noiseBuffer = null;
      this.profile = this.bank && this.bank.getProfile ? this.bank.getProfile(1) : this.defaultProfile(1);
      this.started = false;
      this.engine = null;
      this.nitro = null;
      this.wind = null;
      this.lastGear = -1;
      this.lastNitro = false;
      this.nextSkidTime = 0;
      this.nextRoadTick = 0;
      this.beepIndex = 0;
      this.lastLevel = 1;
      this.masterVolume = 0.88;
    }

    defaultProfile(level){
      return { level, family:'city_night', label:'Cidade/Noite', engineBase:38, engineRange:150, engineGrit:.45, roadNoise:.22, windTone:560, tireTone:900, uiRoot:220, impact:1, seed:'default' };
    }

    setLevel(level){
      const n = clamp(Number(level || 1) | 0, 1, 999);
      this.lastLevel = n;
      this.profile = this.bank && this.bank.getProfile ? this.bank.getProfile(n) : this.defaultProfile(n);
      return this.profile;
    }

    init(){
      if (this.ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.noiseBuffer = this.createNoiseBuffer(2.0);

      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -13;
      compressor.knee.value = 10;
      compressor.ratio.value = 3.6;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.18;

      const tone = this.ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.value = 6200; // escurece para evitar fadiga no ouvido
      tone.Q.value = 0.45; this.masterTone = tone;

      const saturator = this.makeSaturator(1.18);
      this.master = this.ctx.createGain();
      this.master.gain.value = this.masterVolume;
      this.master.connect(tone);
      tone.connect(saturator);
      saturator.connect(compressor);
      compressor.connect(this.ctx.destination);

      this.engineBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.uiBus = this.ctx.createGain();
      this.ambientBus = this.ctx.createGain();
      this.engineBus.gain.value = 0.68;
      this.sfxBus.gain.value = 0.82;
      this.uiBus.gain.value = 0.58;
      this.ambientBus.gain.value = 0.18;
      this.engineBus.connect(this.master);
      this.sfxBus.connect(this.master);
      this.uiBus.connect(this.master);
      this.ambientBus.connect(this.master);

      this.createEngineLayers();
      this.createNitroLayer();
      this.createWindLayer();
      if (this.setMix) this.setMix(this.mix || {});
      return true;
    }

    resume(){
      if (!this.init()) return false;
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(()=>{});
      return true;
    }

    createNoiseBuffer(seconds){
      const len = Math.floor(this.ctx.sampleRate * seconds);
      const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let brown = 0;
      for (let i=0; i<len; i++){
        const white = ((window.RRCore&&window.RRCore.rng)?window.RRCore.rng.random('audio'):0.5) * 2 - 1;
        brown = (brown + 0.035 * white) / 1.035;
        data[i] = clamp(brown * 3.2 + white * 0.18, -1, 1);
      }
      return buffer;
    }

    makeSaturator(amount){
      const shaper = this.ctx.createWaveShaper();
      const n = 4096;
      const curve = new Float32Array(n);
      for (let i=0; i<n; i++){
        const x = (i * 2) / n - 1;
        curve[i] = Math.tanh(x * amount);
      }
      shaper.curve = curve;
      shaper.oversample = '2x';
      return shaper;
    }

    connectFiltered(source, dest, type, freq, q){
      const f = this.ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q || 0.7;
      source.connect(f);
      f.connect(dest);
      return f;
    }

    createEngineLayers(){
      const ctx = this.ctx;
      const base = ctx.createOscillator();
      const mid = ctx.createOscillator();
      const grit = ctx.createOscillator();
      const subGain = ctx.createGain();
      const midGain = ctx.createGain();
      const gritGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const out = ctx.createGain();

      base.type = 'sawtooth';
      mid.type = 'triangle';
      grit.type = 'square';
      base.frequency.value = 38;
      mid.frequency.value = 76;
      grit.frequency.value = 114;
      subGain.gain.value = 0;
      midGain.gain.value = 0;
      gritGain.gain.value = 0;
      filter.type = 'lowpass';
      filter.frequency.value = 520;
      filter.Q.value = 1.05;
      out.gain.value = 0;

      base.connect(subGain); mid.connect(midGain); grit.connect(gritGain);
      subGain.connect(filter); midGain.connect(filter); gritGain.connect(filter);
      filter.connect(out); out.connect(this.engineBus);
      base.start(); mid.start(); grit.start();

      this.engine = { base, mid, grit, subGain, midGain, gritGain, filter, out };
    }

    createNitroLayer(){
      const src = this.ctx.createBufferSource();
      const bp = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      src.buffer = this.noiseBuffer;
      src.loop = true;
      bp.type = 'bandpass';
      bp.frequency.value = 760;
      bp.Q.value = 1.1;
      gain.gain.value = 0;
      src.connect(bp); bp.connect(gain); gain.connect(this.sfxBus);
      src.start();
      this.nitro = { src, bp, gain };
    }

    createWindLayer(){
      const src = this.ctx.createBufferSource();
      const lp = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      src.buffer = this.noiseBuffer;
      src.loop = true;
      lp.type = 'bandpass';
      lp.frequency.value = 420;
      lp.Q.value = 0.65;
      gain.gain.value = 0;
      src.connect(lp); lp.connect(gain); gain.connect(this.ambientBus);
      src.start();
      this.wind = { src, lp, gain };
    }

    envelope(dest, t, volume, attack, hold, release){
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), t + Math.max(0.001, attack));
      g.gain.setValueAtTime(Math.max(0.0002, volume), t + Math.max(0.001, attack) + Math.max(0.001, hold));
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.001, attack) + Math.max(0.001, hold) + Math.max(0.001, release));
      g.connect(dest);
      return g;
    }

    osc(freq, t, dur, options){
      options = options || {};
      const o = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const bus = options.bus || this.sfxBus;
      const gain = this.envelope(bus, t, options.gain || 0.08, options.attack || 0.004, options.hold || Math.max(0.015, dur * 0.38), options.release || 0.07);
      o.type = options.type || 'triangle';
      o.frequency.setValueAtTime(freq, t);
      if (options.slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(1, options.slideTo), t + Math.max(0.01, dur));
      if (options.detune) o.detune.value = options.detune;
      filter.type = options.filterType || 'lowpass';
      filter.frequency.value = options.filter || 1800;
      filter.Q.value = options.q || 0.8;
      o.connect(filter); filter.connect(gain);
      o.start(t); o.stop(t + dur + (options.release || 0.07) + 0.05);
      return o;
    }

    noise(t, dur, options){
      options = options || {};
      const src = this.ctx.createBufferSource();
      const filter = this.ctx.createBiquadFilter();
      const bus = options.bus || this.sfxBus;
      const gain = this.envelope(bus, t, options.gain || 0.08, options.attack || 0.003, options.hold || Math.max(0.01, dur * 0.32), options.release || 0.08);
      src.buffer = this.noiseBuffer;
      filter.type = options.filterType || 'bandpass';
      filter.frequency.value = options.filter || 900;
      filter.Q.value = options.q || 1;
      src.connect(filter); filter.connect(gain);
      src.start(t); src.stop(t + dur + (options.release || 0.08) + 0.05);
      return src;
    }

    updateFromGame(state){
      this.resume();
      this.setLevel(state && state.level ? state.level : this.lastLevel);
      this.updateEngine(state || {});
      return true;
    }

    stopEngineFromGame(){
      if (!this.ctx || !this.engine) return;
      const t = this.ctx.currentTime;
      this.engine.out.gain.setTargetAtTime(0, t, 0.08);
      if (this.nitro) this.nitro.gain.gain.setTargetAtTime(0, t, 0.08);
      if (this.wind) this.wind.gain.gain.setTargetAtTime(0, t, 0.12);
    }

    updateEngine(state){
      if (!this.engine || !this.ctx) return false;
      const p = this.profile || this.defaultProfile(1);
      const now = this.ctx.currentTime;
      const speedRatio = clamp(Number(state.speedRatio != null ? state.speedRatio : (state.maxSpeed ? state.speed / state.maxSpeed : 0)) || 0, 0, 1.32);
      const race = !!state.race;
      const accel = !!state.accel;
      const brake = !!state.brake;
      const nitro = !!state.nitro && race;
      const offroad = !!state.offroad && race;
      const damage = clamp(Number(state.damage || 0), 0, 1);
      const rpm = clamp(speedRatio + (accel ? 0.08 : 0) + (nitro ? 0.16 : 0) - (brake ? 0.05 : 0), 0, 1.38);

      const baseFreq = p.engineBase + p.engineRange * rpm;
      this.engine.base.frequency.setTargetAtTime(baseFreq, now, 0.055);
      this.engine.mid.frequency.setTargetAtTime(baseFreq * (1.985 + damage * 0.025), now, 0.06);
      this.engine.grit.frequency.setTargetAtTime(baseFreq * (2.96 + p.engineGrit * 0.05), now, 0.065);
      this.engine.filter.frequency.setTargetAtTime(420 + rpm * 1450 + (nitro ? 260 : 0), now, 0.09);
      this.engine.filter.Q.setTargetAtTime(0.95 + rpm * 0.55, now, 0.1);

      const targetVol = race ? (0.04 + rpm * 0.13 + (accel ? 0.035 : 0) + (nitro ? 0.035 : 0)) : 0;
      this.engine.out.gain.setTargetAtTime(targetVol, now, 0.12);
      this.engine.subGain.gain.setTargetAtTime(0.58 + rpm * 0.15, now, 0.08);
      this.engine.midGain.gain.setTargetAtTime(0.21 + rpm * 0.16, now, 0.08);
      this.engine.gritGain.gain.setTargetAtTime((0.06 + rpm * 0.10 + damage * 0.04) * p.engineGrit, now, 0.09);

      if (this.wind){
        this.wind.lp.frequency.setTargetAtTime(p.windTone + speedRatio * 520, now, 0.16);
        this.wind.gain.gain.setTargetAtTime(race ? speedRatio * p.roadNoise * 0.22 : 0, now, 0.2);
      }
      if (this.nitro){
        this.nitro.bp.frequency.setTargetAtTime(540 + speedRatio * 460, now, 0.12);
        this.nitro.gain.gain.setTargetAtTime(nitro ? 0.145 : 0, now, 0.08);
      }

      if (nitro && !this.lastNitro) this.playNitroHit(now);
      this.lastNitro = nitro;

      const gear = clamp(Math.floor(rpm * 5.25), 0, 6);
      if (race && accel && speedRatio > 0.18 && gear !== this.lastGear && this.lastGear >= 0) this.playShift(now);
      if (race) this.lastGear = gear; else this.lastGear = -1;

      if ((brake && speedRatio > 0.18) || offroad){
        if (now > this.nextSkidTime){
          this.playSkid(now, offroad ? 'offroad' : 'brake', speedRatio);
          this.nextSkidTime = now + (offroad ? 0.18 : 0.26);
        }
      }
      if (race && speedRatio > 0.48 && now > this.nextRoadTick){
        this.playRoadTick(now, speedRatio);
        this.nextRoadTick = now + 0.22 + ((window.RRCore&&window.RRCore.rng)?window.RRCore.rng.random('audio'):0.5) * 0.24;
      }
      return true;
    }

    playFromGame(type, data){
      this.resume();
      if (data && data.level) this.setLevel(data.level);
      this.play(type, data || {});
      return true;
    }

    play(type, data){
      this.resume();
      const t = this.ctx.currentTime;
      const p = this.profile || this.defaultProfile(1);
      switch(type){
        case 'beep': return this.playCountdown(t);
        case 'go': return this.playGo(t);
        case 'nitro': return this.playNitroHit(t);
        case 'crash': return this.playCrash(t, data && data.impact || p.impact);
        case 'skid': return this.playSkid(t, 'brake', data && data.speedRatio || 0.6);
        case 'pit': return this.playPit(t);
        case 'alarm': return this.playAlarm(t);
        case 'buy': return this.playBuy(t);
        case 'win': return this.playWin(t);
        case 'fail': return this.playFail(t);
        case 'shift': return this.playShift(t);
        case 'uiMove': return this.playUIMove(t);
        case 'uiConfirm': return this.playUIConfirm(t);
        case 'uiBack': return this.playUIBack(t);
        case 'unlock': return this.playUnlock(t);
        case 'lap': return this.playLap(t);
        default: return this.playUIMove(t);
      }
    }

    playCountdown(t){
      const tones = [330, 370, 415];
      const f = tones[this.beepIndex % tones.length];
      this.beepIndex++;
      this.osc(f, t, 0.13, {type:'square', gain:0.085, filter:1200, q:0.7, bus:this.uiBus, release:0.08});
      this.osc(f/2, t, 0.12, {type:'triangle', gain:0.035, filter:700, bus:this.uiBus, release:0.06});
    }

    playGo(t){
      this.osc(98, t, 0.20, {type:'sine', gain:0.18, slideTo:54, filter:500, bus:this.sfxBus, release:0.08});
      [261.63, 329.63, 392].forEach((f,i)=>this.osc(f, t + i*0.035, 0.20, {type:'sawtooth', gain:0.075, filter:1600, bus:this.uiBus, release:0.10}));
      this.noise(t, 0.18, {gain:0.065, filterType:'bandpass', filter:900, q:1.4, bus:this.sfxBus, release:0.12});
    }

    playNitroHit(t){
      this.osc(72, t, 0.30, {type:'sawtooth', gain:0.12, slideTo:138, filter:760, q:1.2, bus:this.sfxBus, release:0.12});
      this.noise(t, 0.42, {gain:0.12, filterType:'bandpass', filter:720, q:1.1, bus:this.sfxBus, release:0.20});
      this.osc(220, t+0.025, 0.16, {type:'triangle', gain:0.045, slideTo:330, filter:1200, bus:this.sfxBus, release:0.08});
    }

    playCrash(t, impact){
      impact = clamp(impact || 1, 0.65, 1.4);
      this.noise(t, 0.30, {gain:0.18*impact, filterType:'lowpass', filter:1350, q:0.8, bus:this.sfxBus, release:0.18});
      this.noise(t+0.018, 0.16, {gain:0.10*impact, filterType:'bandpass', filter:720, q:2.2, bus:this.sfxBus, release:0.13});
      this.osc(128, t, 0.22, {type:'square', gain:0.10*impact, slideTo:44, filter:620, q:1, bus:this.sfxBus, release:0.18});
      this.osc(64, t+0.028, 0.26, {type:'sawtooth', gain:0.08*impact, slideTo:38, filter:390, q:0.8, bus:this.sfxBus, release:0.18});
    }

    playSkid(t, mode, speedRatio){
      const p = this.profile || this.defaultProfile(1);
      const f = (mode === 'offroad' ? p.tireTone * 0.72 : p.tireTone) + speedRatio * 180;
      this.noise(t, mode === 'offroad' ? 0.18 : 0.13, {gain:mode === 'offroad' ? 0.075 : 0.055, filterType:'bandpass', filter:f, q:mode === 'offroad' ? 1.2 : 1.9, bus:this.sfxBus, release:0.12});
      if (mode === 'offroad') this.osc(80, t, 0.09, {type:'triangle', gain:0.022, filter:320, bus:this.sfxBus, release:0.07});
    }

    playRoadTick(t, speedRatio){
      this.noise(t, 0.035, {gain:0.010 + speedRatio*0.014, filterType:'bandpass', filter:380 + speedRatio*220, q:0.9, bus:this.ambientBus, release:0.035});
    }

    playShift(t){
      this.noise(t, 0.055, {gain:0.055, filterType:'bandpass', filter:620, q:1.3, bus:this.sfxBus, release:0.045});
      this.osc(132, t, 0.07, {type:'triangle', gain:0.050, slideTo:86, filter:520, bus:this.sfxBus, release:0.05});
    }

    playPit(t){
      [196, 246.94, 293.66, 246.94].forEach((f,i)=>this.osc(f, t+i*0.045, 0.08, {type:'triangle', gain:0.045, filter:1200, bus:this.uiBus, release:0.05}));
      this.noise(t, 0.20, {gain:0.032, filterType:'bandpass', filter:520, q:0.7, bus:this.ambientBus, release:0.16});
    }

    playAlarm(t){
      this.osc(294, t, 0.15, {type:'square', gain:0.055, filter:950, bus:this.uiBus, release:0.08});
      this.osc(220, t+0.11, 0.15, {type:'square', gain:0.047, filter:850, bus:this.uiBus, release:0.08});
    }

    playBuy(t){
      const base = (this.profile && this.profile.uiRoot) || 220;
      [0,4,7,12].forEach((s,i)=>this.osc(base*Math.pow(2,s/12), t+i*0.055, 0.14, {type:'triangle', gain:0.050, filter:1500, bus:this.uiBus, release:0.08}));
    }

    playWin(t){
      const seq = [0,4,7,12,16,19,24];
      const base = 196;
      seq.forEach((s,i)=>this.osc(base*Math.pow(2,s/12), t+i*0.07, 0.22, {type:i%2?'sawtooth':'triangle', gain:0.062, filter:1700, bus:this.uiBus, release:0.12}));
      this.noise(t+0.38, 0.30, {gain:0.045, filterType:'bandpass', filter:980, q:1.2, bus:this.sfxBus, release:0.22});
    }

    playFail(t){
      this.osc(196, t, 0.62, {type:'sawtooth', gain:0.075, slideTo:49, filter:720, q:0.8, bus:this.uiBus, release:0.28});
      this.noise(t+0.05, 0.35, {gain:0.035, filterType:'lowpass', filter:620, bus:this.sfxBus, release:0.25});
    }

    playUIMove(t){
      const root = (this.profile && this.profile.uiRoot) || 220;
      this.osc(root, t, 0.045, {type:'triangle', gain:0.035, filter:950, bus:this.uiBus, release:0.035});
    }

    playUIConfirm(t){
      const root = (this.profile && this.profile.uiRoot) || 220;
      this.osc(root, t, 0.08, {type:'triangle', gain:0.040, filter:1000, bus:this.uiBus, release:0.04});
      this.osc(root*1.5, t+0.045, 0.10, {type:'triangle', gain:0.038, filter:1200, bus:this.uiBus, release:0.05});
    }

    playUIBack(t){
      const root = (this.profile && this.profile.uiRoot) || 220;
      this.osc(root*1.2, t, 0.07, {type:'triangle', gain:0.034, slideTo:root*0.75, filter:900, bus:this.uiBus, release:0.05});
    }

    playUnlock(t){
      const seq = [0,7,12,16,19,24];
      const root = 174.61;
      seq.forEach((s,i)=>this.osc(root*Math.pow(2,s/12), t+i*0.06, 0.18, {type:'sawtooth', gain:0.048, filter:1600, bus:this.uiBus, release:0.10}));
    }

    playLap(t){
      [392, 523.25, 659.25].forEach((f,i)=>this.osc(f, t+i*0.06, 0.16, {type:'triangle', gain:0.045, filter:1500, bus:this.uiBus, release:0.08}));
    }
  }



  // V39: controle fino de volumes por categoria, modo silencioso e perfil mobile.
  Retro16SFXEngine.prototype.setMix = function(mix){
    mix = mix || {};
    this.mix = Object.assign({ master: 0.82, engine: 0.50, sfx: 0.74, ui: 0.60, ambient: 0.12, muted: false }, this.mix || {}, mix);
    const now = this.ctx ? this.ctx.currentTime : 0;
    const silent = this.mix.muted ? 0.0001 : 1;
    const set = (node, value, tc) => {
      if (!node || !node.gain || !this.ctx) return;
      try { node.gain.cancelScheduledValues(now); node.gain.setTargetAtTime(Math.max(0.0001, value), now, tc || 0.08); } catch(e) {}
    };
    if (this.master) set(this.master, silent * this.mix.master, 0.10);
    if (this.engineBus) set(this.engineBus, silent * this.mix.engine, 0.10);
    if (this.sfxBus) set(this.sfxBus, silent * this.mix.sfx, 0.06);
    if (this.uiBus) set(this.uiBus, silent * this.mix.ui, 0.05);
    if (this.ambientBus) set(this.ambientBus, silent * this.mix.ambient, 0.14);
    return this.mix;
  };

  Retro16SFXEngine.prototype.setToneCutoff = function(hz, tc){
    this.adaptiveCutoff = Math.max(700, Math.min(9000, Number(hz)||6200));
    if(this.masterTone&&this.ctx){try{this.masterTone.frequency.setTargetAtTime(this.adaptiveCutoff,this.ctx.currentTime,tc||0.08);}catch(e){}}
    return this.adaptiveCutoff;
  };

  Retro16SFXEngine.prototype.muffle = function(hz, holdMs){
    if(!this.masterTone||!this.ctx)return;clearTimeout(this.muffleTimer);const now=this.ctx.currentTime;
    try{this.masterTone.frequency.cancelScheduledValues(now);this.masterTone.frequency.setTargetAtTime(Math.max(500,Number(hz)||780),now,.015);}catch(e){}
    this.muffleTimer=setTimeout(()=>{if(this.masterTone&&this.ctx)try{this.masterTone.frequency.setTargetAtTime(this.adaptiveCutoff,this.ctx.currentTime,.12);}catch(e){}},Math.max(80,Number(holdMs)||300));
  };

  Retro16SFXEngine.prototype.setMuted = function(flag){
    this.mix = this.mix || {};
    this.mix.muted = !!flag;
    return this.setMix(this.mix);
  };

  Retro16SFXEngine.prototype.getMix = function(){
    return Object.assign({ master: 0.82, engine: 0.50, sfx: 0.74, ui: 0.60, ambient: 0.12, muted: false }, this.mix || {});
  };

  window.Retro16SFXEngine = Retro16SFXEngine;
})();
