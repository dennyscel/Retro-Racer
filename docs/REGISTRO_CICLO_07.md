# REGISTRO — CICLO 07 — RÁDIO VIVO E MÚSICA REATIVA

## Diagnóstico
O áudio procedural já era forte, mas ainda tocava como trilha paralela. A corrida não mudava suficientemente a música conforme posição, pit, impacto ou última volta, e o rádio tinha poucas falas repetíveis.

## Mini-GDD
A trilha continua sendo as mesmas 999 composições premium. A direção musical passa a operar stems e processamento: quando o jogador cai para 15º+, bateria/baixo ficam secos e leads recuam; no top 3 os leads entram; pit aplica low-pass + ambiente wet; hitstop abafa música e motor/SFX por 300 ms; última volta sobe 1 semitom e usa o mix FINAL. O rádio reage a eventos, nunca a timers aleatórios.

## Implementação
- tracker expõe `raceFilter`, `raceWet`, `raceDelay` e `adaptivePitchSemitones`;
- bridge ganhou `setAdaptiveState`, `setPitMix`, `setPitchSemitones` e `muffle`;
- SFX engine ganhou filtro master adaptativo + muffling do hitstop;
- novo `src/audio/adaptive.js` dirige CHASE / NEUTRAL / PODIUM / FINAL / PIT / HITSTOP;
- novo `src/audio/radio-live.js` com 84 falas em 14 bancos;
- falas de engenheiro, GHOST, REX e VIPER são disparadas por evento concreto;
- migração save v58→v59 e `c07ReactiveAudio`.

## Evidência de QA
- 84 falas / 14 bancos e seleção determinística por evento;
- sequência testada: CHASE → PODIUM → PIT → FINAL → HITSTOP;
- alvo de pit: música 1450 Hz, wet 24%, motor/SFX 1900 Hz;
- última volta: `adaptivePitchSemitones = 1`;
- hitstop: música 780 Hz + SFX 720 Hz por 300 ms, com restauração;
- tracker real inicializou 8 canais + filtro/wet/delay adaptativos;
- save v58→v59 preservou fase 77, CR$ 54.321, carro e C06;
- laboratório ~59,88 FPS; zero pageerror/console.error;
- sentinelas 1/27/333/666/999 e determinismo 3×: PASS.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,6/10:** a corrida finalmente “respira” junto com o jogador sem destruir as músicas aprovadas.
- **VC mobile — 8,8/10:** o áudio elevou identidade, mas a perícia ainda não gera uma economia/loop assistível próprio.
- **Jogador de 14 anos — 9,4/10:** entrar no top 3 e ouvir a música abrir é recompensa instantânea.

**Crítica mais dura:** dirigir bonito ainda não vale nada além do tempo final; quase-colisão, drift, vácuo e zebra precisam virar risco visível, combo e moeda cosmética para criar jogadas que dê vontade de repetir e mostrar.
