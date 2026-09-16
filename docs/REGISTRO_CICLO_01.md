# REGISTRO — CICLO 1
## OURO 1 — MODULARIZAÇÃO + DETERMINISMO

**Versão:** `AAA_R2+C01`  
**Base:** AAA FINAL R2  
**SAVE_KEY:** `retro_racer_championship_v30`

## Diagnóstico

A base R2 já era um jogo amplo, mas o motor permanecia concentrado num bloco clássico grande. Isso encarecia qualquer evolução e impedia tratar replay/ghost como dado verificável. O Ciclo 1 atacou essa fundação sem redesenhar física, parallax, pit ou conteúdo.

## Mini-GDD do ouro

O jogador não deve perceber a arquitetura; deve perceber que nada que já funcionava quebrou. A vantagem aparece nos próximos ciclos: corrida reprodutível por seed/input, ghost verificável, módulos pequenos e carregamento inicial mais leve. O risco principal era modularizar e alterar ordem/escopo do JS, causando regressões invisíveis. Por isso cada mudança foi seguida de sintaxe, runtime Chromium e determinismo 3×.

## Implementado

1. `index.html` reduzido a shell e marcação; CSS separado.
2. ES modules nativos por domínio: core, race, render, audio, meta e ui.
3. `runtime-store.js` como backing store dos valores mutáveis; bindings globais permanecem somente como ponte transitória entre módulos.
4. Loop de timestep fixo 60 Hz com acumulador e render independente.
5. RNG `mulberry32` seedável por canais; todos os `Math.random()` de runtime removidos.
6. Carregamento lazy da pista ativa; catálogo 999 em idle/demanda; banco musical 999 somente quando necessário.
7. Replay de inputs a ~20 Hz, quantizado em 1 byte e comprimido por RLE/base64url.
8. Time Trial novo persiste apenas input replay como formato canônico do ghost; saves antigos com samples posicionais continuam aceitos.
9. Probe determinístico da física real com isolamento/restauração de dano e stats.
10. Hot path reduzido: pools/caches para partículas, parallax, curva e carros visíveis; sem `filter().sort()` em ultrapassagens.

## Evidências de QA

- Pure kernel: 3 outputs idênticos (`time=60`, `progress=675704.5`, `x=-0.549859`, `speed=8570`, `fuel=0.523099`).
- Física real: 3 outputs idênticos com 1.200 inputs (`progress=118242.817501`, `x=1.543391`, `speed=3000`, `fuel=0.842978`, `time=20`, `lap=1`).
- Replay: 1.120 amostras (~56 s) = 238 bytes / 119 runs.
- Migração v52: nível 123, CR$45.678, carro 2 e 7 vitórias preservados; 10 upgrades presentes após merge.
- 37 cards de copa + 27 cards da Copa 1.
- Sentinelas: 1=16 seções, 27=17, 333=19, 666=20, 999=28.
- Scroll mobile 390×560: 889 px de conteúdo / 560 px viewport / `scrollTop` chegou a 329.
- Chromium HIGH: 59,9 FPS mediana; p95 16,8 ms (laboratório, não Moto G físico).
- Rede laboratório: first-playable 3,835 s com 100 ms + ~1,6 Mbps por recurso.
- `pageerror=0`, `console error=0`.

## Regressões encontradas e corrigidas no ciclo

- O primeiro probe de física divergia porque o próprio teste acumulava dano entre execuções. O probe foi isolado e passou 3×.
- A primeira tentativa de paralelizar slices por injeção inline falhou no boot por base URL do ambiente de QA. A estratégia foi descartada; a solução final usa imports ES nativos sequenciais e passou no runtime.
- Cache de carros visíveis foi inicialmente declarado sem ser usado; foi corrigido para pool fixo de 22 entradas.

## Dívida técnica não bloqueante

- Os módulos ainda usam bindings `globalThis` como ponte. Os valores mutáveis já são respaldados pelo RuntimeStore, mas funções serão migradas gradualmente para imports explícitos durante os próximos ouros.
- O ghost visual reconstruído do replay de inputs usa uma curva de movimento determinística normalizada ao tempo do recorde; o verificador físico completo do recorde será endurecido no OURO 21 (anti-trapaça).
- Moto G real, haptics/gamepad físico e áudio móvel continuam exigindo hardware.
