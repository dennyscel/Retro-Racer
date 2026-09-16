# CHECKLIST — CICLO 1 / OURO 1

| Verificação | Estado | Evidência |
|---|---|---|
| L1 SAVE_KEY exata | PASS | `src/core/state.js` = `retro_racer_championship_v30` |
| Save v52 preserva progresso | PASS | nível 123, CR$45.678, carro 2, wins 7 |
| L2 Canvas 2D pseudo-3D | PASS | renderer preservado; sem WebGL/engine externo |
| L3 zero CDN/framework runtime | PASS | refs externas do HTML são apenas SEO/schema/canonical |
| L4 sem asset comercial novo | PASS | nenhum asset de terceiros foi adicionado |
| L5 HIGH >=55 FPS | PASS NO LAB | Chromium headless 59,9 FPS mediana; **Moto G físico NÃO TESTADO** |
| L6 shell <=350 KB gzip | PASS | ~111 KB gzip somado |
| L6 first-playable <=4 s em 3G simulado | PASS NO LAB | 3,835 s no modelo 100 ms + ~1,6 Mbps/recurso |
| L7 sem pay-to-win | PASS | nenhum sistema pago novo |
| L8 sem dark pattern | PASS | nenhum timer/lootbox/energia |
| L9 feel/pit/toque/save preservados | PASS AUTOMATIZADO | mesma física determinística; runtime sem erro; avaliação humana continua recomendada |
| L10 mobile retrato/paisagem + scroll | PASS LAB | 390×560: scroll efetivo 329 px; PWA orientation any preservada |
| L11 testes honestos | PASS | hardware real marcado como não testado |
| L12 não terminar com pergunta | PASS | protocolo de estado aponta próximo ciclo |
| ES modules nativos | PASS | `src/compat` removido; módulos por domínio |
| JS <=400 linhas | PASS | maior = 351 linhas |
| RuntimeStore | PASS | `src/core/runtime-store.js` |
| `Math.random()` no runtime JS | PASS | 0 ocorrências em `src` + engines JS de assets |
| Fixed timestep | PASS | `src/core/loop.js` 60 Hz |
| Replay canônico por inputs | PASS | novos ghosts salvam `inputReplay`, não posições |
| Replay <2 KB/volta | PASS | ~56 s = 238 bytes |
| Determinismo kernel 3× | PASS | outputs idênticos |
| Determinismo física real 3× | PASS | outputs idênticos |
| Pistas 1/27/333/666/999 | PASS | carregadas e JSON válido |
| 999 pistas / 37 copas | PASS | catálogo completo lazy |
| Copa 1 = 27 pistas | PASS | cards no runtime |
| IDs HTML únicos | PASS | 158 / zero duplicados (auditoria estrutural R2 preservada) |
| Chromium pageerror | PASS | 0 |
| Chromium console error | PASS | 0 |
| 4 rodas | PASS ESTRUTURAL | quatro chamadas explícitas em `drawCarGeneric()` |
| Parallax V41.6 | PRESERVADO | algoritmo não redesenhado neste ouro |
| Gamepad/haptics físicos | NÃO TESTADO | requer hardware |
| Áudio Android/iPhone | NÃO TESTADO | requer hardware |
| Instalação PWA HTTPS | NÃO TESTADO NESTE CICLO | requer origem HTTPS real |
