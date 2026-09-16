# Retrô Racer Championship: Horizonte Zero — AAA_R2+C22

**Status:** CRITÉRIO FINAL ATINGIDO  
**Ciclo:** 22 — Pacote de Vitrine  
**SAVE_KEY:** `retro_racer_championship_v30`

Arcade pseudo-3D 16-bit offline-first com 999 pistas, 37 copas/capítulos, 12 carros, GHOST adaptativo, Código de Sombra, Fenda, Temporada, Licenças, Oficina de Pintura, Treinador, Clipe de Destaque e integridade de replay.

## Pacote investidor
Comece por `docs/INDEX_PACOTE_INVESTIDOR.md`. O pacote contém pitch, deck de 12 slides, trailers 15/45 s, ASO pt-BR/en-US/es-419, press kit, métricas-alvo, economia e roadmap 12 meses.

## QA final
- 999 pistas e sentinelas 1/27/333/666/999.
- 304 IDs HTML, sem duplicação.
- 41 módulos ES em `src/`; maior módulo 358 linhas.
- Zero `Math.random()` em `src/`.
- 4 rodas explícitas em `drawCarGeneric()`.
- 133,6 KB gzip de shell crítico.
- Rubrica final: **118/120**, todos os 12 eixos >= 9.

## Limites honestos
O C22 não altera gameplay e não inventa novo teste jogado. Validação em Moto G/hardware equivalente, gamepad físico, instalação PWA HTTPS e áudio em aparelhos iOS/Android permanece necessária antes de uma publicação comercial ampla.

## Abrir
Use Hostinger/HTTPS ou um servidor local simples para ES modules/PWA. `index.html` é a entrada do jogo.
