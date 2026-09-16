# CICLO 16 — OURO 16 — CLIPE DE DESTAQUE

## Diagnóstico
O jogo já possuía replay por inputs e Código de Sombra, mas o melhor momento morria dentro da corrida. Faltava transformar habilidade em mídia vertical compartilhável.

## Mini-GDD
O runtime mantém um buffer circular de 8 s a 20 Hz, sem alocação por frame. Eventos recebem prioridade: combo alto < ultrapassagem comum < GHOST < foto-finish. O melhor momento é renderizado novamente em Canvas 9:16 a partir dos inputs e metadados, com marca discreta e Código de Sombra. Chromium exporta WebM via `captureStream`/`MediaRecorder`; navegadores sem suporte recebem pôster PNG.

## Evidência
- buffer travado em 160 frames mesmo após 220 amostras.
- prioridade testada: combo 82 → GHOST 95 → foto-finish 110.
- foto-finish de 0,12 s foi escolhido como destaque.
- WebM VP9 real produzido pelo Chromium: 1.138.384 bytes.
- mobile 390×844: painel 859 px, rolagem preservada, zero `pageerror`.
- Código de Sombra aparece no rodapé do clipe.
- save v67→v68 preservou fase 333, CR$ 76.543, Goliath, história e libré.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,7/10:** o replay vira lembrança sem contaminar o handling.
- **VC mobile — 10/10:** agora cada bom momento pode virar aquisição orgânica com código jogável.
- **14 anos / celular fraco — 9,6/10:** o botão aparece no resultado e não exige editar vídeo.

**Crítica mais dura:** o clipe agora vende o jogo, mas o primeiro boot ainda parece tela de menu antes de parecer uma marca memorável.
