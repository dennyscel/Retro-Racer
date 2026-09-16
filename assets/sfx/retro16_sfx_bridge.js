/* Retro Racer Championship - V39 Audio FX Bridge */
(function(){
  'use strict';
  if (!window.RetroRacerSFX && window.Retro16SFXEngine) {
    window.RetroRacerSFX = new window.Retro16SFXEngine(window.RETRO16_SFX_BANK);
  }
  window.RetroRacerSFXBridge = {
    version: 'v39-final-audio-manager-ready',
    play: function(type, data){ return window.RetroRacerSFX && window.RetroRacerSFX.playFromGame(type, data || {}); },
    updateEngine: function(data){ return window.RetroRacerSFX && window.RetroRacerSFX.updateFromGame(data || {}); },
    stopEngine: function(){ return window.RetroRacerSFX && window.RetroRacerSFX.stopEngineFromGame(); },
    setLevel: function(level){ return window.RetroRacerSFX && window.RetroRacerSFX.setLevel(level); },
    setMix: function(mix){ return window.RetroRacerSFX && window.RetroRacerSFX.setMix(mix || {}); },
    setMuted: function(flag){ return window.RetroRacerSFX && window.RetroRacerSFX.setMuted(!!flag); },
    setToneCutoff: function(hz,tc){ return window.RetroRacerSFX && window.RetroRacerSFX.setToneCutoff && window.RetroRacerSFX.setToneCutoff(hz,tc); },
    muffle: function(hz,ms){ return window.RetroRacerSFX && window.RetroRacerSFX.muffle && window.RetroRacerSFX.muffle(hz,ms); }
  };
})();
