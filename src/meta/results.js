// ES module nativo — bindings compartilhados explícitos via globalThis durante a migração arquitetural.
globalThis.addDamage = function addDamage(v) { const id = currentCar().id; career.carDamage[id] = MathUtils.limit((Number(career.carDamage[id]) || 0) + v, 0, 1); }
globalThis.updateHud = function updateHud(pos, total) {
    const mods = calcMods();
    speedDisplay.innerText = Math.round((speed / maxSpeed) * 285);
    posDisplay.innerText = MathUtils.limit(pos || 1, 1, total || cars.length + 1);
    totalRacersDisplay.innerText = String(total || cars.length + 1);
    nitroDisplay.innerText = Math.round(nitro * 100);
    fuelDisplay.innerText = Math.round(MathUtils.limit(fuel / mods.fuelCapacity, 0, 1) * 100);
    damageDisplay.innerText = Math.round((career.carDamage[currentCar().id] || 0) * 100);
    lapDisplay.innerText = MathUtils.limit(currentLap, 1, totalLaps);
    moneyDisplay.innerText = Math.floor(career.money).toLocaleString('pt-BR');
    timeDisplay.innerText = formatTime(currentLapTime);
    const best = career.records[raceLevel] ? Number(career.records[raceLevel]) : Infinity;
    bestTimeDisplay.innerText = 'BEST: ' + formatTime(best);
    const fuelPct = MathUtils.limit(fuel / mods.fuelCapacity, 0, 1);
    if (fuelHudBox) { fuelHudBox.classList.toggle('warning', fuelPct < .25 && fuelPct >= .12); fuelHudBox.classList.toggle('critical', fuelPct < .12); }
    const dmgPct = MathUtils.limit(career.carDamage[currentCar().id] || 0, 0, 1);
    if (damageHudBox) { damageHudBox.classList.toggle('warning', dmgPct > .50 && dmgPct <= .70); damageHudBox.classList.toggle('critical', dmgPct > .70); }
    if (nitroHudBox) nitroHudBox.classList.toggle('warning', nitro < .15);
}

globalThis.triggerGameOver = function triggerGameOver(reason) {
    if(raceContext.mode==='license'&&globalThis.licenseFail){licenseFail(reason);return;}
    if (gameOver || finished) return;
    const riftRewardOffer=raceContext.mode==='rift'&&globalThis.economyCanRiftContinue&&economyCanRiftContinue();if(raceContext.mode==='rift'&&!riftRewardOffer&&globalThis.riftFail)riftFail(reason);const rc=document.getElementById('btnRewardContinue');if(rc)rc.classList.toggle('hidden',!riftRewardOffer);const retry=document.getElementById('btnRetry');if(retry)retry.classList.toggle('hidden',raceContext.mode==='rift');const gg=document.getElementById('btnGameOverGarage');if(gg)gg.classList.toggle('hidden',raceContext.mode==='rift');
    gameOver = true; gameMode = 'gameover'; raceStarted = false; fadeAudioOut(); playSFX('fail'); setRaceMessage('GAME OVER', '#ff4444', 1.2); saveCareer();
    document.getElementById('gameOverReason').innerText = reason;if(globalThis.telemetryEvent)telemetryEvent('race_finish',{mode:raceContext.mode,level:raceLevel,rank:99,time:totalRaceTime||0,combo:Number(career.stats.bestCombo||0),abandon:true});
    setTimeout(() => showMenu('gameover'), 900);
}
globalThis.finishRace = function finishRace() {
    if(raceContext.mode==='license'&&globalThis.licenseCompleteByLap){licenseCompleteByLap();return;}
    if (finished || raceAwarded) return;
    finished=true; raceAwarded=true; fadeAudioOut(); playSFX('win'); if(globalThis.hapticEvent)hapticEvent('finish'); buildFinalRanking();
    const playerEntry=finalRanking.find(x=>x.isPlayer), rivals=finalRanking.filter(x=>!x.isPlayer); const nearestGap=raceContext.mode==='shadow'&&shadowGhosts.length?Math.min(...shadowGhosts.map(g=>Math.abs(g.lapTime-finalTotalTime))):(rivals.length&&playerEntry?Math.min(...rivals.map(x=>Math.abs(x.progress-playerEntry.progress)))/Math.max(1,maxSpeed):Infinity); const photoFinish=nearestGap<.35; photoFinishSlowmo=photoFinish?2.5:0; finishBannerTimer=photoFinish?2.5:.9; const finishEl=document.getElementById('finishBanner'); if(finishEl)finishEl.textContent=photoFinish?`🏁 FOTO FINISH · ${nearestGap.toFixed(2)}s 🏁`:'🏁 CHEGADA 🏁'; if(photoFinish)setRaceMessage(`FOTO FINISH · ${nearestGap.toFixed(2)}s`,'#ffcc00',2.4);
    const rank=finalPlayerRank; if(globalThis.highlightRaceFinish)highlightRaceFinish(photoFinish,nearestGap,rank); const prizes=racePrizes(raceLevel,!!raceContext.replay), oldGhost=career.ghosts[raceLevel], oldGhostTime=Number((oldGhost&&(!oldGhost.proof||globalThis.integrityGhostValid?.(oldGhost))&&oldGhost.time)||Infinity), timeTrialRecord=raceContext.mode==='timeTrial'&&finalTotalTime<oldGhostTime; let prize=rank===1?prizes[0]:rank===2?prizes[1]:rank===3?prizes[2]:rank<=8?prizes[3]:0;const riftBasePrize=prize; if(raceContext.mode==='timeTrial')prize=timeTrialRecord?Math.round(prizes[0]*.20):0;if(raceContext.mode==='shadow')prize=0;
    const enduranceValid=!(raceContext.mode==='endurance'&&racePits<2); if(!enduranceValid){prize=0;setRaceMessage('ENDURANCE: 2 PITS OBRIGATÓRIOS', '#ff4b4b',2);} const sponsorBonus=(enduranceValid&&!['timeTrial','shadow'].includes(raceContext.mode)&&rank<=5&&raceCrashes===0)?Math.round(prizes[0]*.12):0; prize+=sponsorBonus; if(raceInsurance){prize=Math.round(prize*.85);const cid=currentCar().id,newD=Number(career.carDamage[cid]||0);career.carDamage[cid]=MathUtils.limit(raceDamageStart+Math.max(0,newD-raceDamageStart)*.45,0,1);}
    const riftBanked=raceContext.mode==='rift'&&globalThis.riftStageFinish?riftStageFinish(rank,riftBasePrize):0;if(raceContext.mode==='rift')prize=0;const medal=['shadow','rift'].includes(raceContext.mode)?'none':(rank===1&&finalTotalTime<=targetGoldTime?'gold':rank<=2?'silver':rank===3?'bronze':'none');
    career.money+=prize;career.stats.earned+=prize;career.stats.races+=1;if(rank===1&&!['timeTrial','shadow','rift'].includes(raceContext.mode))career.stats.wins+=1;
    if(medal!=='none'){const old=career.medals[raceLevel],order={none:0,bronze:1,silver:2,gold:3};if(!old||order[medal]>order[old])career.medals[raceLevel]=medal;} if(medal==='gold'){career.stats.goldStreak=(career.stats.goldStreak||0)+1;if(career.stats.goldStreak>=3){career.skins.chromeUnlocked=true;}}else career.stats.goldStreak=0;
    if(rank===1&&raceContext.mode==='boss'){career.stats.ghostWins=(career.stats.ghostWins||0)+1;career.stats.bossWins=(career.stats.bossWins||0)+1;refreshCarUnlocks();}
    if(rank===1&&raceContext.mode==='daily')career.stats.dailyWins=(career.stats.dailyWins||0)+1;
    const careerCurrent=!raceContext.replay&&raceContext.mode==='career'&&raceLevel===career.level;
    if(rank===1&&careerCurrent){ const prevCup=Math.ceil(career.level/27); if(raceLevel<999) career.level=Math.min(999,raceLevel+1); else {career.trophies[37]=true;career.stats.cups=Math.max(career.stats.cups||0,37);} const newCup=Math.ceil(career.level/27); if(newCup>prevCup){career.stats.cups=Math.max(career.stats.cups,newCup-1);career.trophies[prevCup]=true;prize+=2500*prevCup;career.money+=2500*prevCup;career.stats.earned+=2500*prevCup;} if(raceLevel%3===0&&!career.bonuses[raceLevel]){const bonus=750+Math.ceil(raceLevel/27)*225;career.bonuses[raceLevel]=true;career.money+=bonus;career.stats.earned+=bonus;prize+=bonus;} }
    if(timeTrialRecord){const rep=(window.RRCore&&window.RRCore.replay)?window.RRCore.replay.finish():null,proof=globalThis.integrityMakeProof?integrityMakeProof(raceLevel,finalTotalTime,rep,window.RRCore?.rng?.seed,career.selectedCar):null;if(proof)career.ghosts[raceLevel]={time:finalTotalTime,inputReplay:rep,format:'inputs-v1',proof};else timeTrialRecord=false;}
    const carKey=String(currentCar().id);career.recordsByCar[carKey]=career.recordsByCar[carKey]||{};const oldCarRec=Number(career.recordsByCar[carKey][raceLevel]||0);if(!oldCarRec||finalTotalTime<oldCarRec)career.recordsByCar[carKey][raceLevel]=finalTotalTime;
    if(!['shadow','rift'].includes(raceContext.mode)&&career.contracts&&career.contracts.items){let contractBonus=0;const tier=Math.max(1,Math.ceil(raceLevel/27));career.contracts.items.forEach(c=>{if(c.id==='top5'&&rank<=5)c.done=true;if(c.id==='pit'&&racePits>=1)c.done=true;if(c.id==='clean'&&raceCrashes<2)c.done=true;if(c.done&&!c.rewarded){c.rewarded=true;contractBonus+=300+tier*25;}});if(contractBonus>0){career.money+=contractBonus;career.stats.earned+=contractBonus;prize+=contractBonus;setRaceMessage(`CONTRATOS +${money(contractBonus)}`,'#55ff55',1.8);}}
    const fichasRace=globalThis.finishRiskCombo?finishRiskCombo():0;const seasonResult=globalThis.seasonRaceFinish?seasonRaceFinish(rank,finalTotalTime):null;const coachResult=globalThis.coachRaceFinish?coachRaceFinish():null;if(globalThis.economyPrepareRaceReward)economyPrepareRaceReward(prize);recordTelemetry(rank,prize);if(globalThis.telemetryEvent)telemetryEvent('race_finish',{mode:raceContext.mode,level:raceLevel,rank,time:finalTotalTime,combo:Number(career.stats.bestCombo||0),abandon:false}); if(globalThis.ghostLearningFinish)ghostLearningFinish(); refreshCarUnlocks(); saveCareer(); updateStartBadges(); renderResults(rank,prize,medal,fichasRace,seasonResult); const resultDelay=photoFinish?2500:650; setTimeout(()=>{photoFinishSlowmo=0;gameMode='results';showMenu('results');},resultDelay);
}
globalThis.buildFinalRanking = function buildFinalRanking() {
    if (finalRankingLocked) return;
    const playerAbsoluteProgress = playerProgress + playerZ;
    const finishLineProgress = totalLaps * trackZLength;
    if(raceContext.mode==='shadow'&&shadowGhosts&&shadowGhosts.length){
        const ranking=[{name:PLAYER_RACER_NAME,color:carPaint(currentCar()).color,progress:finishLineProgress,isPlayer:true,status:formatTime(totalRaceTime),finishTime:totalRaceTime}];
        shadowGhosts.forEach(g=>ranking.push({name:'👻 '+g.alias,color:g.color||'#7be9ff',progress:finishLineProgress,isPlayer:false,status:formatTime(g.lapTime),finishTime:g.lapTime}));
        ranking.sort((a,b)=>a.finishTime-b.finishTime);ranking.forEach((item,index)=>item.rank=index+1);const pe=ranking.find(x=>x.isPlayer);finalPlayerRank=pe?pe.rank:1;finalRanking=ranking;finalTotalTime=totalRaceTime;finalBestLap=career.records[raceLevel]||Infinity;finalRankingLocked=true;return;
    }
    const ranking = [{ name:PLAYER_RACER_NAME, color:carPaint(currentCar()).color, progress:playerAbsoluteProgress, isPlayer:true, status:formatTime(totalRaceTime) }];
    cars.forEach(car => {
        let status = '';
        if (car.out) status = 'PANE SECA';
        else if (car.progress >= finishLineProgress) status = 'FINALIZOU';
        else { const missing = Math.max(0, finishLineProgress - car.progress); status = '-' + Math.max(.1, missing / 1000).toFixed(1) + ' KM'; }
        ranking.push({ name:car.name || ('CPU ' + (car.id + 1)), color:car.color || '#fff', progress:car.progress, isPlayer:false, status });
    });
    ranking.sort((a,b) => b.progress - a.progress); ranking.forEach((item, index) => item.rank = index + 1);
    const playerEntry = ranking.find(item => item.isPlayer); finalPlayerRank = playerEntry ? playerEntry.rank : 1; finalRanking = ranking; finalTotalTime = totalRaceTime; finalBestLap = career.records[raceLevel] || Infinity; finalRankingLocked = true;
}
globalThis.renderResults = function renderResults(rank, prize, medal, fichasRace=0, seasonResult=null) {
    const rd=document.getElementById('btnRewardDouble');if(rd){const e=career.economy?.rewarded?.lastRace;rd.classList.toggle('hidden',!(career.flags.monetization&&!career.economy?.adFree&&e&&!e.claimed&&e.amount>0));}
    document.getElementById('resultTitle').innerText = rank === 1 ? 'VITÓRIA!' : rank <= 3 ? 'PÓDIO!' : 'CORRIDA FINALIZADA';
    document.getElementById('resultRank').innerText = rank + 'º';document.getElementById('btnResultShadow').innerText=raceContext.mode==='shadow'?'↩ REVANCHE + SOMBRA':'🧬 CÓDIGO DE SOMBRA';
    document.getElementById('resultPrize').innerText = raceContext.mode==='rift'?(career.fenda?.completed?career.fenda.lastResult:('BANCO '+money(career.fenda?.bank||0))):money(prize); const rf=document.getElementById('resultFichas');if(rf)rf.innerText=seasonResult&&seasonResult.gain?`+${seasonResult.gain.xp} XP · +${seasonResult.gain.fichas||0} FICHAS`:'+'+Math.floor(fichasRace||0)+' FICHAS';
    document.getElementById('resultMedal').innerText = medal === 'gold' ? 'OURO' : medal === 'silver' ? 'PRATA' : medal === 'bronze' ? 'BRONZE' : '---';
    document.getElementById('resultTime').innerText = formatTime(finalTotalTime);if(globalThis.coachRenderResult)coachRenderResult();document.getElementById('resultBestLap').innerText=raceContext.mode==='shadow'?('DESAFIO DE SOMBRA · '+shadowGhosts.length+' RIVAL'+(shadowGhosts.length===1?'':'IS')):('MELHOR VOLTA '+formatTime(Number(career.records[raceLevel]||Infinity))+(raceCrashes===0&&rank<=5?' · PATROCÍNIO ✓':'')); if(raceContext.replay)document.getElementById('resultTitle').innerText += ' · REPLAY 55%'; const riftMode=raceContext.mode==='rift',seasonMode=['seasonDaily','seasonGauntlet'].includes(raceContext.mode);document.getElementById('btnResultsGarage').classList.toggle('hidden',riftMode);document.getElementById('btnResultShadow').classList.toggle('hidden',riftMode);if(riftMode)document.getElementById('btnNextRace').innerText=career.fenda?.completed?'RESUMO FENDA ▶':'ESCOLHER CARTA ▶';else if(seasonMode)document.getElementById('btnNextRace').innerText=raceContext.mode==='seasonGauntlet'&&career.season.gauntlet.active?'PRÓXIMA DO GAUNTLET ▶':'TEMPORADA ▶';else if(raceLevel===999&&rank===1)document.getElementById('btnNextRace').innerText='CRÉDITOS ▶'; else document.getElementById('btnNextRace').innerText=raceContext.mode==='career'?'PRÓXIMA ▶':'NOVAMENTE ▶';
    const list = document.getElementById('resultRanking'); list.innerHTML = '';
    finalRanking.slice(0, 12).forEach(item => {
        const row = document.createElement('div'); row.className = 'rank-row' + (item.isPlayer ? ' player' : '');
        row.innerHTML = `<b>${item.rank}º</b><span><i class="swatch" style="background:${item.color}"></i>${item.name}</span><b>${item.status}</b>`;
        list.appendChild(row);
    });
}

