# REGISTRO — CICLO 04 / OURO 4

## Mini-GDD
O jogador deve distinguir superfície, perda de controle, potência e impacto pelo tato antes mesmo de olhar o HUD. O haptic não acompanha cada frame: é pontuação semântica de eventos.

## Evidência
Padrões testados no Chromium com stubs de `navigator.vibrate` e `vibrationActuator`. Sete eventos produziram sete chamadas em cada backend. Nitro foi testado pela própria física, não só por chamada direta.

## Conselho dos três críticos
- Kyoto: **9/10** — feedback tátil tem gramática, não ruído.
- VC mobile: **6/10** — aumenta percepção de qualidade, ainda não cria compartilhamento.
- 14 anos/celular: **9/10** — funciona sem exigir leitura e não custa frame.

**Crítica mais dura:** agora o jogo reage ao jogador, mas o antagonista ainda não o conhece; GHOST precisa transformar telemetria em personalidade.
