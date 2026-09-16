# REGISTRO DE MUDANÇAS — CICLO 02

## Ouro
**OURO 2 — OS PRIMEIROS 8 SEGUNDOS**

## Mini-GDD
O jogador novo não precisa entender um menu antes de sentir o carro. Um save novo cai direto numa reta de demonstração, com aceleração automática, um rival visível e direção ativa. O objetivo do desenho é ensinar por affordance: mover lateralmente é a única ação útil e a primeira ultrapassagem acontece cedo. Aos 8 s o prólogo deixa de ser demonstração e vira a primeira corrida real.

## Implementação
- `src/meta/ftue.js`: máquina de estados `prologue → handoff → idle`.
- Detecção estrita de save novo: nível 1, zero starts/races e flag FTUE ainda falsa.
- Auto-aceleração no prólogo; freio/nitro bloqueados apenas nesta janela silenciosa.
- Rival inicial roteirizado e lento para provocar ultrapassagem natural.
- HUD, rádio, touch hint, virtual controls e mensagens textuais ocultos durante o prólogo.
- Colisões do prólogo não causam dano punitivo; combustível não é consumido.
- Handoff aos ~8 s para a corrida de carreira real, com 22 rivais.
- Saves existentes preservam o fluxo clássico.

## Ajustes durante QA
1. A primeira versão permitia ultrapassagem em ~1 s; foi revertida/tunada porque o jogador não tinha tempo de perceber o rival.
2. Rival foi afastado para ~2200 unidades e a velocidade do prólogo limitada a ~30% da máxima.
3. `PARALLAX_SAMPLES` virou constante de módulo e polling do gamepad deixou de alocar spread por frame.

## Evidência de runtime
- ~0,9 s: prólogo ativo, menu oculto, HUD oculto, 1 rival, velocidade > 0.
- primeira ultrapassagem: ~2,1 s com steering deliberado.
- ~8,02 s: `career.stats.starts=1`, 22 rivais, flag FTUE completa e corrida real ativa.
- save v52: fase 123, CR$ 45.678, carro 2 e stats preservados.
- mobile 390×844: steering por pointer e ultrapassagem funcionaram.
- zero `pageerror`/erro de console nos cenários automatizados.

## Conselho dos três críticos
- Produtor sênior de Kyoto: **9/10** — agora o carro vem antes do menu; falta uma assinatura visual ainda mais própria em alta velocidade.
- Analista de VC mobile: **6/10** — FTUE melhora conversão, mas ainda não existe loop social/viral; isso virá nos Ouros 5/6.
- Jogador de 14 anos/celular fraco: **9/10** — é possível mexer no carro imediatamente e a tela não vira tutorial.

**Crítica mais dura:** a entrada finalmente entrega direção antes de explicação, mas a velocidade ainda pode parecer “bom retrô” e não “meu Deus, que jogo é esse?”; o próximo ouro precisa transformar alta velocidade em assinatura sem virar poluição visual.
