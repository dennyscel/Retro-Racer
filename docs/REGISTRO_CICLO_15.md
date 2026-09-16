# CICLO 15 — OURO 15 — NARRATIVA EM 37 CAPÍTULOS

## Diagnóstico
A carreira já tinha 999 pistas, rivalidade e progressão, mas faltava um arco emocional capaz de justificar chegar à Copa 37.

## Mini-GDD
Cada copa abre uma vez com um capítulo de 3 quadros 16-bit desenhados só com primitivas Canvas e 6 linhas curtas. O arco acompanha Campeonato Horizonte Zero, GHOST e REX: descoberta do PROTOCOLO ZERO, traição de REX, aliança instável e chegada à fase 999. O capítulo só entra no caminho da carreira e só é marcado como visto ao pressionar CONTINUAR.

## Implementação
- 37 capítulos distintos, 6 linhas cada.
- 3 painéis por capítulo renderizados por `fillRect`, paths e linhas; zero asset externo.
- Copa calculada por `(fase-1)/27`, com Copa 37 cobrindo a fase 999.
- `career.story.seen{}` persistente e migração v66→v67.
- wrapper de `openPreRace()` apenas para carreira; replay/modos extras não recebem interrupção narrativa.
- mobile 390×844 testado na Copa 37.

## Evidência
- Copa 1: `LINHA DE PARTIDA`, 6 linhas, história abre antes da pré-corrida.
- CONTINUAR: grava `seen[1]=true`, salva e cai na pré-corrida; segunda tentativa não reabre.
- Copa 37: `HORIZONTE ZERO`, 6 linhas, sem erro de Canvas.
- runtime isolado: 0 `pageerror`.
- save legado v66: fase 333, CR$ 76.543, Goliath e libré preservados.
- determinismo do kernel: 3× idêntico.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,8/10:** a carreira agora tem memória e personagens sem virar cutscene longa.
- **VC mobile — 9,6/10:** aumenta completion intent sem adicionar backend ou peso material.
- **14 anos / celular fraco — 9,7/10:** 6 linhas e três quadros são curtos o bastante para não travar a vontade de correr.

**Crítica mais dura:** agora existe história, mas o jogo ainda não transforma seus melhores 8 segundos em mídia compartilhável nativa.
