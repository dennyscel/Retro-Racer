# REGISTRO DE MUDANÇAS — AAA FINAL

Data: 2026-09-14  
Base: Retrô Racer Championship V43 Juice  
Autor do jogo: Dennys Smaniotto Pavanelli

## Regra estrutural

A base não foi reescrita. O renderer pseudo-3D, física-base, catálogo V40, parallax V41.6, áudio V39/999 e SEO V42.2 foram preservados. As novas camadas foram integradas ao mesmo `index.html` e ao mesmo `SAVE_KEY`.

## OURO 0 — Juice estabilizado

A V43 foi tratada como base e auditada antes da expansão. Permanecem FOV dinâmico 100→112, lookahead 8–14 segmentos, shake com decay, nitro armado em 0,12 s, speed lines em perspectiva, draft recarregando nitro, volta limpa +12%, pit +40%, colisão leve/forte e freeze de 90 ms, pit com barra e recusa de alta velocidade, jump start de 0,4 s e perfect start de 0,35 s.

## OURO 1 — Copas

Foram adicionadas 37 copas renderizadas do catálogo real. Cada copa usa seus 27 circuitos, libera pela fórmula `(N-1)*27+1`, mostra ouro/progresso, e abre a lista de pistas com clima, horário, medalha e recorde. Replay antigo não muda `career.level` e usa multiplicador 0,55 nos prêmios. A pré-corrida desenha ribbon diretamente de `sections[]`.

## OURO 2 — Garagem

A frota passou de 3 para 12 carros. Saves antigos continuam válidos; novos campos são mesclados. A garagem mostra seis stats e três pinturas. Os upgrades novos são Suspensão, Freio, Radiador, ECU e Aero. Aero/turbo/pneus passam a gerar detalhes visuais no sprite e o dano permanece visível por arranhões/fumaça.

## OURO 3 — Clima

`currentWeather()` converte também contexto do catálogo: `Vale nevado` pode produzir neve jogável e `Cânion seco`/deserto claro produz calor. Chuva e tempestade mudam grip por pneu; neve reduz grip; fog reduz draw distance; storm aplica vento; heat aumenta carga térmica do nitro. Reduzir Flash elimina o clarão da tempestade.

## OURO 4 — IA

O grid continua com 22 rivais. GHOST foi fixado como carro preto/dourado, estilo rival. REX assume papel blocker. Instáveis erram lateralmente de forma limitada. O modo IA Campeonato usa somente correções leves. Rádio comunica VIPER colando, GHOST atacando, pit, última volta, clima e eventos lendários.

## OURO 5 — Modos

Carreira segue como eixo. Corrida Rápida agora passa pela seleção de copa/pista e permite 3/5/8/12 voltas. Time Trial remove rivais e grava ghost a ~20 Hz. Endurance usa 15 voltas e exige 2 pits. Daily escolhe a fase por `YYYYMMDD`. Boss enfrenta apenas GHOST na final da copa atual.

## OURO 6 — Audiovisual

O motor musical premium foi preservado. A pista recebeu placas com nome real, spray de chuva e tratamento de set pieces. Não foram introduzidos MP3s ou sprites comerciais.

## OURO 7 — Plataforma

Gamepad: stick esquerdo, R2 acelera, L2 freia, botões 1/2 nitro e Start pausa. Haptics funcionam quando o dispositivo expõe `vibrationActuator`. O mobile ganha botões virtuais opcionais. A qualidade suporta LOW/MED/HIGH/CRT e cai para LOW se `dt > 22 ms` por 20 amostras. Partículas usam pool de reaproveitamento. `visibilitychange` pausa a corrida de verdade.

PWA: `manifest.webmanifest`, ícones 192/512 e `sw.js`. O SW faz cache do shell e não intercepta `/assets/tracks/` ou `/assets/music/` para pré-cache pesado.

## OURO 8 — Lendário/economia

Os `pits[]` oficiais continuam posicionando boxes e placas PIT 200m/100m. Como o catálogo não traz `feature` preenchido, a autoria perceptível é derivada de `environment` e IDs especiais sem alterar os JSONs: porto, cânion, viaduto, túnel, ponte, arquibancada. 27, 333, 666 e 999 recebem zonas especiais. A fase 999 é Horizonte Zero e libera créditos.

A premiação usa `1800 + 220 * log2(level+1) * cupTier`. Há seguro de dano opcional com custo de 15% do prêmio, patrocínio de top-5 sem colisão (+12%), contratos diários e streak de 3 ouros registrado.

## OURO 9 — Final polish

Dificuldade, HUD size, reduzir flash, FPS, deadzone, sensibilidade, IA e qualidade persistem no save. Reset exige `CORRIDA`. Resultado exibe tempo total, melhor volta, medalha, prêmio e ranking. SEO canonical/OG JPG, PWA, robots e sitemap estão incluídos.

## Preservação auditada

- SAVE_KEY exato.
- 999 pistas / 37 copas / `sections[]` e `pits[]` em 999 registros.
- Sentinelas 1, 27, 333, 666, 999 presentes.
- 4 rodas explícitas em `drawCarGeneric()`.
- Catálogo de pistas, bridge musical, bridge SFX e OG JPG têm SHA-256 idêntico à V43 de entrada.
- Nenhum `console.error` no HTML final.


---

# REVISÃO AAA FINAL R2 — QA PÓS-FINAL

Data: 2026-09-14

A R2 surgiu de uma auditoria independente sobre o primeiro pacote AAA FINAL. O objetivo não foi ampliar escopo, e sim corrigir pontos em que a implementação final ainda divergia do Prompt Mestre ou tinha comportamento de borda incorreto.

## Correções de progressão

- Copa 1: progresso inicial corrigido de 1/27 para 0/27.
- Fase 999: a vitória final marca a 37ª copa como concluída mesmo sem existir fase 1000 para disparar transição.
- Eclipse: desbloqueio real por chegada à fase 999.
- Chrome: desbloqueio real por 3 ouros seguidos, preservando saves antigos que já selecionavam a skin.
- Almanac 999: interface própria com 37 copas × 27 silhuetas e progressão por `career.level`.

## Correções de modos/economia

- Time Trial deixa de explorar a ausência de rivais: só há bônus quando o tempo total melhora o ghost/recorde anterior.
- Time Trial e Endurance passam pela seleção de pista liberada.
- Endurance continua em 15 voltas e exige 2 pits para prêmio/patrocínio.
- Contratos diários usam data local e recompensa única com flag `rewarded`.
- Foto-finish implementado com diferença estimada menor que 0,35 s: 2,5 s em 0,45× antes do resultado.

## Correções de IA e apresentação

- Grid de rivais transformado em 2-by-2 real mantendo 22 rivais.
- Rádio `PIT ABERTO` deixa de ser string órfã e dispara no primeiro ponto de pit de cada volta.
- Cards das copas mostram biomas e contagem ouro/prata/bronze.

## Plataforma/PWA

- PWA deixa de forçar landscape e aceita retrato/paisagem.
- SW v2 cacheia somente shell essencial. O banco musical pesado não entra no pré-cache; JSONs individuais de pista também não.
- O SW não substitui recurso JS ausente por `index.html`.
- Music bridge falha de forma segura caso o banco musical pesado ainda não esteja disponível offline.
- Gamepad alinhado à regra do projeto: stick vira, R2 acelera, L2 freia, A/X nitro, Start pausa.
- Detector de queda de performance respeita o alvo selecionado: ~22 ms em 60 FPS e ~45 ms em 30 FPS.

## Áudio

O ponto de partida aprovado foi restaurado no Audio Manager: Música 0,53; Motor 0,25; Efeitos 0,37; UI/Menu 0,56. A chave de preferência foi renovada para `retro_racer_audio_v40_preferences` para impedir que um mix antigo substitua silenciosamente o novo padrão.

## Preservação confirmada na R2

- `SAVE_KEY = 'retro_racer_championship_v30'`.
- 999 IDs únicos no catálogo, 1→999.
- Sentinelas 1, 27, 333, 666 e 999.
- Quatro rodas explícitas em `drawCarGeneric()`.
- Catálogo V40, bridge SFX e OG JPG sem alteração de bytes em relação ao AAA FINAL anterior.
- Parallax V41.6 não reescrito.
- Zero IDs HTML duplicados e zero referência local ausente.
- Zero `pageerror` nos cenários automatizados de Almanac, save/fase999, modos e gamepad.
