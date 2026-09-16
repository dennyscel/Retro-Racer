# CICLO 17 — OURO 17 — IDENTIDADE E BOOT AAA

## Diagnóstico
O produto já tinha gameplay e sistemas sociais fortes, mas ainda entrava como “menu de jogo”. Faltava um momento de marca e um attract mode que demonstrasse corrida sem roubar os primeiros 8 segundos do jogador novo.

## Mini-GDD
- Save novo continua entrando direto no FTUE dirigível do Ouro 2.
- Save existente recebe boot de marca de 4 s, reduzido para ~650 ms com `prefers-reduced-motion`.
- Wordmark RETRO RACER é desenhado em bitmap 5×7 próprio, sem fonte/CDN.
- Som de ignição procedural toca no primeiro gesto permitido pelo navegador.
- Menu inicial ocioso por ~4,6 s entra em ATTRACT MODE.
- Prioridade do attract: replay real do jogador → Código de Sombra → demo determinística.
- Qualquer interação encerra o attract imediatamente.
- Wipe 16-bit acompanha navegação; reduced-motion o desliga.

## Evidência
- boot visível em 1 s e encerrado após ~4,4 s.
- attract carregou `SEU REPLAY · FASE 005`, 240 frames reais.
- pointerdown encerrou attract sem erro.
- fallback `playSFX('engine')` agora possui ignição procedural própria.
- migração v68→v69 preservou fase 333, CR$ 76.543, Goliath, história, clipe e libré.
- determinismo 3× idêntico.
- 999 pistas + sentinelas 1/27/333/666/999; 4 rodas; zero `Math.random()` em `src/`.

## Decisão travada
**Boot não aparece para save novo.** O FTUE instantâneo é mais importante que a vinheta para aquisição. A identidade de 4 s entra a partir da segunda sessão/save existente.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,8/10:** agora o jogo tem entrada e attract mode de produto, sem matar o primeiro contato.
- **VC mobile — 9,7/10:** o título finalmente demonstra sozinho o conteúdo e o replay social.
- **14 anos / celular fraco — 9,6/10:** se já joguei, vejo a marca; se sou novo, já dirijo.

**Crítica mais dura:** a marca agora é memorável, mas acessibilidade ainda é parcial: faltam paletas daltônicas completas, mão esquerda e escala real dos botões.
