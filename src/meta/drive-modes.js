// CICLO 14 — dois públicos, mesma física-base: COPILOTO casual e LENDÁRIO sem borracha.
globalThis.isCopilotMode=function isCopilotMode(){return career.settings.controlMode==='COPILOTO';};
globalThis.isLegendaryMode=function isLegendaryMode(){return career.settings.difficulty==='LENDA';};
globalThis.copilotAutoThrottle=function copilotAutoThrottle(){return isCopilotMode()&&raceStarted&&!countdownActive&&!finished&&!gameOver;};
globalThis.championshipRubberBandEnabled=function championshipRubberBandEnabled(){return career.settings.aiMode==='CAMPEONATO'&&!isLegendaryMode();};
globalThis.legendaryGhostMultiplier=function legendaryGhostMultiplier(){return isLegendaryMode()?1.08:1;};
globalThis.driveModeSnapshot=function driveModeSnapshot(){const df=difficultyFactors();return{control:career.settings.controlMode,difficulty:career.settings.difficulty,copilot:isCopilotMode(),legendary:isLegendaryMode(),rubberBand:championshipRubberBandEnabled(),ghostMultiplier:legendaryGhostMultiplier(),damage:df.damage,fuel:df.fuel,ai:df.ai};};
