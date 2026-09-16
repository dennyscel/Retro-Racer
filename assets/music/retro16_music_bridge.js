
"use strict";
(function(){
const Bridge = {
    version: 'v39-final-audio-manager-ready',
    player: null,
    currentLevel: 0,
    enabled: true,
    volume: 0.62,
    muted: false,
    duckLevel: 1,
    duckTimer: null,
    adaptiveState: 'neutral',
    adaptiveTimer: null,
    pitActive: false,
    _adaptiveBase: null,
    getTrack(level){
        const all = window.RETRO16_CLASSIC_TRACKS_999 || window.RETRO16_DISTINCT_TRACKS_999 || [];
        const n = Math.max(1, Math.min(999, Number(level) || 1));
        return all[n-1] || all[0];
    },
    _baseTrackVolume(){
        const track = this.player && this.player.track ? this.player.track : null;
        return track && track.masterVolume ? track.masterVolume : 0.8;
    },
    _effectiveVolume(){
        return this.muted || !this.enabled ? 0.0001 : Math.max(0.0001, this._baseTrackVolume() * this.volume * this.duckLevel);
    },
    applyVolume(timeConstant = 0.10){
        if (!this.player || !this.player.master || !this.player.ctx) return;
        try {
            const now = this.player.ctx.currentTime;
            this.player.master.gain.cancelScheduledValues(now);
            this.player.master.gain.setTargetAtTime(this._effectiveVolume(), now, timeConstant);
        } catch(e) {}
    },
    setVolume(v){
        this.volume = Math.max(0, Math.min(1, Number(v)));
        this.applyVolume(0.08);
        return this.volume;
    },
    setMuted(flag){
        this.muted = !!flag;
        this.applyVolume(0.08);
        return this.muted;
    },
    duck(amount = 0.45, holdMs = 420, releaseMs = 360){
        amount = Math.max(0.12, Math.min(1, Number(amount) || 0.45));
        clearTimeout(this.duckTimer);
        this.duckLevel = amount;
        this.applyVolume(0.018);
        this.duckTimer = setTimeout(() => {
            this.duckLevel = 1;
            this.applyVolume(Math.max(0.08, releaseMs / 1000 / 3));
        }, Math.max(60, holdMs));
    },
    _captureAdaptiveBase(){
        if(!this.player||!Array.isArray(this.player.channelGains)||!this.player.channelGains.length)return null;
        if(!this._adaptiveBase||this._adaptiveBase.length!==this.player.channelGains.length)this._adaptiveBase=this.player.channelGains.map(g=>Math.max(.0001,Number(g.gain.value)||.0001));
        return this._adaptiveBase;
    },
    setAdaptiveState(state='neutral'){
        if(!this.player||!this.player.ctx)return;
        const base=this._captureAdaptiveBase();if(!base)return;
        const map={
            chase:[1.10,1.08,.88,1.18,.48,.54,.16,.48],
            neutral:[1,1,1,1,1,1,1,1],
            podium:[1.04,1.03,1.04,1.02,1.16,1.08,1.38,1.18],
            final:[1.08,1.06,1.08,1.08,1.22,1.12,1.48,1.28]
        };
        const mul=map[state]||map.neutral,now=this.player.ctx.currentTime;
        this.player.channelGains.forEach((g,i)=>{g.gain.cancelScheduledValues(now);g.gain.setTargetAtTime(base[i]*mul[i],now,.12);});
        this.adaptiveState=state;
    },
    setPitMix(active){
        this.pitActive=!!active;if(!this.player||!this.player.ctx)return;const now=this.player.ctx.currentTime;
        if(this.player.raceFilter)this.player.raceFilter.frequency.setTargetAtTime(active?1450:20000,now,active?.06:.20);
        if(this.player.raceWet)this.player.raceWet.gain.setTargetAtTime(active?.24:0,now,active?.07:.22);
    },
    setPitchSemitones(n=0){if(this.player)this.player.adaptivePitchSemitones=Math.max(-2,Math.min(2,Number(n)||0));},
    muffle(cutoff=900,holdMs=300){
        if(!this.player||!this.player.ctx||!this.player.raceFilter)return;clearTimeout(this.adaptiveTimer);const f=this.player.raceFilter.frequency,now=this.player.ctx.currentTime;
        f.cancelScheduledValues(now);f.setTargetAtTime(Math.max(500,cutoff),now,.015);
        this.adaptiveTimer=setTimeout(()=>{if(!this.player||!this.player.ctx||!this.player.raceFilter)return;const t=this.player.ctx.currentTime;this.player.raceFilter.frequency.setTargetAtTime(this.pitActive?1450:20000,t,.12);},Math.max(80,holdMs));
    },
    playForLevel(level){
        if (!this.enabled || !(window.Retro16ClassicTracker || window.Retro16DistinctTracker)) return;
        const n = Math.max(1, Math.min(999, Number(level) || 1));
        const track = this.getTrack(n);
        this.currentLevel = n;
        if (!track) return; // PWA shell pode abrir offline sem pré-cachear o banco musical gigante
        if (this.player) {
            this.player.stop(true);
            this.player = null;
        }
        this.player = new (window.Retro16ClassicTracker || window.Retro16DistinctTracker)(track, {});
        this._adaptiveBase=null;
        this.player.start();
        this.applyVolume(0.08);
        window.dispatchEvent(new CustomEvent('retro16musicchange', { detail: { level:n, track } }));
    },
    stop(){ if (this.player) { this.player.stop(); this.player = null; } },
    pause(){ if (this.player) this.player.pause(); },
    resume(){ if (this.player) { this.player.resume(); setTimeout(()=>this.applyVolume(0.12), 30); } },
    mute(){ this.enabled = false; this.setMuted(true); this.stop(); },
    unmute(){ this.enabled = true; this.setMuted(false); if (this.currentLevel) this.playForLevel(this.currentLevel); }
};
window.RetroRacerMusic999Bridge = Bridge;
})();
