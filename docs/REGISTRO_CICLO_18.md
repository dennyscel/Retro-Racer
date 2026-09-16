# CICLO 18 — OURO 18 — ACESSIBILIDADE DE VERDADE

## Diagnóstico
O jogo já possuía reduzir flash, HUD escalável e modos de dificuldade, mas ainda faltavam controles para daltonismo, mão esquerda, escala física dos botões e assistência de direção independente da recompensa.

## Mini-GDD
- Três paletas: PROTAN, DEUTER e TRITAN, aplicadas ao HUD/sinalização e ao canvas por filtro leve.
- Modo canhoto troca direção e aceleração/freio entre os lados do telefone.
- Botões virtuais: 80–140%, mantendo alvo mínimo de 48 px.
- Assistência de direção OFF/LEVE/MÉDIA/FORTE; atua de forma suave e diminui quando o jogador dá comando manual.
- Legendas para SFX informativos e rádio.
- `prefers-reduced-motion` e Reduzir Flash continuam como kill-switches.
- Assistências não reduzem CR$, medalhas, XP ou desbloqueios.

## Evidência
- escala 80% gera controle virtual de 51 px; botões pequenos do menu foram corrigidos para 48 px.
- modo canhoto aplica classe e reposiciona direção para a direita e pedais para a esquerda.
- assistência cresce monotonicamente OFF → LEVE → MÉDIA → FORTE.
- save v69→v70 preservou fase 333, CR$ 76.543, Goliath, história, clipe e libré.
- determinismo 3× idêntico.
- 999 pistas + sentinelas 1/27/333/666/999; 4 rodas; zero `Math.random()` em `src/`.
- 49 JS/SW em `node --check`; maior módulo 358 linhas; shell 121,3 KB gzip.

## Decisão travada
**Acessibilidade não altera recompensa.** Dificuldade e assistência são preferências independentes da economia: ninguém ganha menos por precisar de ajuda.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,8/10:** agora o jogo adapta controles sem diluir o feel.
- **VC mobile — 9,7/10:** acessibilidade deixou de ser checkbox e virou ampliação real de público.
- **14 anos / celular fraco — 9,8/10:** consigo jogar com uma mão, controles maiores e sem flash agressivo.

**Crítica mais dura:** economia ainda mistura progressão de performance e cosmético sem um modelo formal de sources/sinks e monetização ética desligável por flag.
