/*
Retro Racer Championship - V39 Final Audio Manager
Fecha as pendências finais do áudio:
- Volume separado: Música / Motor / Efeitos / UI
- Perfil de equilíbrio para celular
- Ducking fino da música em eventos importantes
- Modo silencioso rápido
- Preferências salvas em localStorage
*/
(function(){
  'use strict';

  const STORAGE_KEY = 'retro_racer_audio_v40_preferences';
  const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || Math.min(screen.width || 9999, window.innerWidth || 9999) <= 760;

  const DEFAULT_DESKTOP = { music: 0.53, engine: 0.25, sfx: 0.37, ui: 0.56, masterSfx: 0.82, ambient: 0.12, muted: false, profile: 'desktop-approved' };
  const DEFAULT_MOBILE  = { music: 0.53, engine: 0.25, sfx: 0.37, ui: 0.56, masterSfx: 0.74, ambient: 0.09, muted: false, profile: 'mobile-approved' };

  const DUCK = {
    crash:  { amount: 0.30, hold: 520, release: 520 },
    go:     { amount: 0.38, hold: 360, release: 460 },
    nitro:  { amount: 0.54, hold: 300, release: 380 },
    win:    { amount: 0.22, hold: 1150, release: 900 },
    fail:   { amount: 0.22, hold: 900, release: 850 },
    lap:    { amount: 0.60, hold: 260, release: 360 },
    pit:    { amount: 0.66, hold: 220, release: 300 },
    alarm:  { amount: 0.58, hold: 180, release: 280 },
    unlock: { amount: 0.42, hold: 650, release: 580 },
    buy:    { amount: 0.62, hold: 240, release: 320 }
  };

  function clamp(v, min, max){ return Math.max(min, Math.min(max, Number(v))); }
  function loadPrefs(){
    const base = isMobile() ? DEFAULT_MOBILE : DEFAULT_DESKTOP;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, base);
      const saved = JSON.parse(raw);
      return Object.assign({}, base, saved || {}, { profile: saved.profile || base.profile });
    } catch(e) { return Object.assign({}, base); }
  }
  function savePrefs(prefs){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch(e) {}
  }

  const Manager = {
    version: 'v39-final-audio-manager',
    prefs: loadPrefs(),
    panel: null,
    button: null,
    patched: false,
    _lastDuckAt: 0,

    effective(name){ return this.prefs.muted ? 0 : clamp(this.prefs[name], 0, 1); },

    apply(){
      const p = this.prefs;
      savePrefs(p);
      if (window.RetroRacerMusic999Bridge && window.RetroRacerMusic999Bridge.setVolume) {
        window.RetroRacerMusic999Bridge.setVolume(this.effective('music'));
        window.RetroRacerMusic999Bridge.setMuted(!!p.muted);
      }
      if (window.RetroRacerSFX && window.RetroRacerSFX.setMix) {
        window.RetroRacerSFX.setMix({
          master: this.effective('masterSfx'),
          engine: this.effective('engine'),
          sfx: this.effective('sfx'),
          ui: this.effective('ui'),
          ambient: p.muted ? 0 : clamp(p.ambient, 0, 1),
          muted: !!p.muted
        });
      }
      if (window.RetroRacerSFXBridge && window.RetroRacerSFXBridge.setMix) {
        window.RetroRacerSFXBridge.setMix({
          master: this.effective('masterSfx'),
          engine: this.effective('engine'),
          sfx: this.effective('sfx'),
          ui: this.effective('ui'),
          ambient: p.muted ? 0 : clamp(p.ambient, 0, 1),
          muted: !!p.muted
        });
      }
      this.updateUI();
      window.dispatchEvent(new CustomEvent('retro16audiomixchange', { detail: Object.assign({}, p) }));
    },

    setVolume(name, value){
      if (!['music','engine','sfx','ui','masterSfx','ambient'].includes(name)) return;
      this.prefs[name] = clamp(value, 0, 1);
      this.apply();
    },

    setMuted(flag){
      this.prefs.muted = !!flag;
      this.apply();
    },

    toggleMuted(){ this.setMuted(!this.prefs.muted); },

    applyMobileBalanced(){
      this.prefs = Object.assign({}, this.prefs, DEFAULT_MOBILE, { muted: this.prefs.muted, profile: 'mobile-approved' });
      this.apply();
    },

    applyDesktopBalanced(){
      this.prefs = Object.assign({}, this.prefs, DEFAULT_DESKTOP, { muted: this.prefs.muted, profile: 'desktop-approved' });
      this.apply();
    },

    duckMusic(reason){
      const cfg = DUCK[reason];
      if (!cfg || this.prefs.muted) return;
      const now = performance.now();
      if (now - this._lastDuckAt < 90) return;
      this._lastDuckAt = now;
      if (window.RetroRacerMusic999Bridge && window.RetroRacerMusic999Bridge.duck) {
        window.RetroRacerMusic999Bridge.duck(cfg.amount, cfg.hold, cfg.release);
      }
    },

    patchDucking(){
      if (this.patched) return;
      const tryPatch = () => {
        if (!window.RetroRacerSFX || !window.RetroRacerSFX.playFromGame || window.RetroRacerSFX.__v39DuckingPatched) return false;
        const original = window.RetroRacerSFX.playFromGame.bind(window.RetroRacerSFX);
        window.RetroRacerSFX.playFromGame = (type, data) => {
          this.duckMusic(type);
          return original(type, data || {});
        };
        window.RetroRacerSFX.__v39DuckingPatched = true;
        this.patched = true;
        return true;
      };
      if (!tryPatch()) {
        let attempts = 0;
        const timer = setInterval(() => {
          attempts++;
          if (tryPatch() || attempts > 60) clearInterval(timer);
        }, 100);
      }
    },

    createUI(){
      if (this.panel || document.getElementById('retroAudioV39Panel')) return;
      const css = document.createElement('style');
      css.textContent = `
        .retro-audio-v39-button{position:fixed;right:14px;bottom:14px;z-index:99999;width:54px;height:54px;border:0;border-radius:16px;background:linear-gradient(180deg,#22283c,#0c0e16);color:#fff;font:900 22px/1 system-ui,Arial;box-shadow:0 10px 30px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.12);cursor:pointer}
        .retro-audio-v39-button.muted{background:linear-gradient(180deg,#743041,#210a10);}
        .retro-audio-v39-panel{position:fixed;right:14px;bottom:78px;z-index:99999;width:min(360px,calc(100vw - 28px));background:linear-gradient(180deg,rgba(22,24,38,.98),rgba(7,8,13,.98));border:1px solid rgba(130,150,210,.38);border-radius:18px;padding:16px;color:#f8fbff;box-shadow:0 28px 70px rgba(0,0,0,.72);font-family:"Courier New",monospace;display:none}
        .retro-audio-v39-panel.open{display:block}
        .retro-audio-v39-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:10px}
        .retro-audio-v39-title{font-size:14px;font-weight:900;color:#12e7ff;letter-spacing:.6px}
        .retro-audio-v39-close{background:#1f2434;color:#dfe7ff;border:0;border-radius:10px;padding:8px 10px;font-weight:900;cursor:pointer}
        .retro-audio-v39-row{display:grid;grid-template-columns:98px 1fr 42px;align-items:center;gap:10px;margin:11px 0;font-size:12px;color:#dce5ff}
        .retro-audio-v39-row input[type=range]{width:100%;accent-color:#ffbc2f}
        .retro-audio-v39-val{text-align:right;color:#ffbc2f;font-variant-numeric:tabular-nums}
        .retro-audio-v39-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
        .retro-audio-v39-actions button{border:0;border-radius:12px;padding:11px 8px;font:900 11px/1.15 "Courier New",monospace;cursor:pointer;background:#202638;color:#fff}
        .retro-audio-v39-actions .danger{background:#5b1624}.retro-audio-v39-actions .ok{background:#0c6b2b}.retro-audio-v39-note{font-size:11px;line-height:1.45;color:#8790b1;margin-top:10px}
      `;
      document.head.appendChild(css);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'retroAudioV39Button';
      btn.className = 'retro-audio-v39-button';
      btn.title = 'Áudio / modo silencioso';
      btn.textContent = '🔊';

      const panel = document.createElement('section');
      panel.id = 'retroAudioV39Panel';
      panel.className = 'retro-audio-v39-panel';
      panel.innerHTML = `
        <div class="retro-audio-v39-head">
          <div class="retro-audio-v39-title">MIXER DE ÁUDIO V39</div>
          <button class="retro-audio-v39-close" type="button" data-audio-close>FECHAR</button>
        </div>
        ${this.sliderHtml('music','Música')}
        ${this.sliderHtml('engine','Motor')}
        ${this.sliderHtml('sfx','Efeitos')}
        ${this.sliderHtml('ui','UI/Menu')}
        <div class="retro-audio-v39-actions">
          <button type="button" class="danger" data-audio-mute>MODO SILENCIOSO</button>
          <button type="button" class="ok" data-audio-mobile>PERFIL CELULAR</button>
          <button type="button" data-audio-desktop>PERFIL DESKTOP</button>
        </div>
        <div class="retro-audio-v39-note">As preferências são salvas automaticamente no navegador. Atalho: tecla M alterna o modo silencioso.</div>
      `;
      document.body.appendChild(btn);
      document.body.appendChild(panel);
      this.button = btn;
      this.panel = panel;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.altKey || e.shiftKey) this.toggleMuted();
        else panel.classList.toggle('open');
      });
      panel.querySelector('[data-audio-close]').addEventListener('click', () => panel.classList.remove('open'));
      panel.querySelector('[data-audio-mute]').addEventListener('click', () => this.toggleMuted());
      panel.querySelector('[data-audio-mobile]').addEventListener('click', () => this.applyMobileBalanced());
      panel.querySelector('[data-audio-desktop]').addEventListener('click', () => this.applyDesktopBalanced());
      panel.querySelectorAll('input[data-audio-volume]').forEach(input => {
        input.addEventListener('input', () => this.setVolume(input.dataset.audioVolume, Number(input.value) / 100));
      });
      window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyM' && !e.ctrlKey && !e.metaKey && !e.altKey) this.toggleMuted();
      });
      this.updateUI();
    },

    sliderHtml(name, label){
      const val = Math.round((this.prefs[name] || 0) * 100);
      return `<label class="retro-audio-v39-row"><span>${label}</span><input type="range" min="0" max="100" value="${val}" data-audio-volume="${name}"><span class="retro-audio-v39-val" data-audio-value="${name}">${val}%</span></label>`;
    },

    updateUI(){
      if (this.button) {
        this.button.textContent = this.prefs.muted ? '🔇' : '🔊';
        this.button.classList.toggle('muted', !!this.prefs.muted);
      }
      if (!this.panel) return;
      ['music','engine','sfx','ui'].forEach(name => {
        const pct = Math.round((this.prefs[name] || 0) * 100);
        const input = this.panel.querySelector(`input[data-audio-volume="${name}"]`);
        const val = this.panel.querySelector(`[data-audio-value="${name}"]`);
        if (input && Number(input.value) !== pct) input.value = pct;
        if (val) val.textContent = pct + '%';
      });
      const mute = this.panel.querySelector('[data-audio-mute]');
      if (mute) mute.textContent = this.prefs.muted ? 'REATIVAR SOM' : 'MODO SILENCIOSO';
    },

    start(){
      this.patchDucking();
      this.createUI();
      this.apply();
      window.addEventListener('retro16musicchange', () => setTimeout(() => this.apply(), 30));
      setInterval(() => { this.patchDucking(); this.apply(); }, 2500);
    }
  };

  window.RetroRacerAudioManagerV39 = Manager;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Manager.start());
  else Manager.start();
})();
