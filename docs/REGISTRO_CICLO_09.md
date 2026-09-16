# REGISTRO — CICLO 09 — FENDA HORIZONTE

## Diagnóstico
O jogo já premiava perícia, mas ainda faltava uma sessão curta com tensão acumulativa, decisões irreversíveis e risco real de perder a recompensa da run.

## Mini-GDD
FENDA HORIZONTE é uma run determinística de 5 pistas, 1 volta cada. Dano e combustível atravessam as etapas; não existe garagem entre provas e o pit não repara dano. Depois das quatro primeiras etapas o jogador escolhe 1 de 3 cartas. Exatamente uma oferta da run contém carta lendária. O banco só entra em CR$ após concluir a quinta pista; pane/abandono perde o banco e restaura o dano pré-run. Alvo de sessão: ~9 minutos.

## Implementação
- módulo `src/meta/rift.js` com 40 cartas (36 normais + 4 lendárias);
- 5 pistas únicas por seed local determinística;
- 4 momentos de escolha, 3 cartas por oferta, 1 oferta lendária por run;
- modificadores de velocidade, aceleração, grip, consumo, dano, nitro, draft, IA, clima, HUD e pit;
- sinergias REDLINE, ECONOMIA, TRILHO, APOSTADOR e FUSÍVEL CURTO;
- dano e combustível persistentes entre as cinco pistas;
- sem reparo de dano no pit e sem garagem entre etapas;
- banco em risco e pagamento somente no encerramento da quinta prova;
- fail/abort restaura dano de entrada e zera banco;
- tela própria FENDA HORIZONTE;
- service worker atualizado para cachear todos os módulos runtime C09;
- save v60→v61 mantendo `SAVE_KEY`.

## Evidência de QA
- 40 cartas / 4 lendárias: PASS;
- 5 pistas únicas: PASS;
- exatamente 1 oferta lendária em 4 escolhas: PASS;
- banco não altera dinheiro antes da quinta etapa: PASS;
- conclusão pagou banco e restaurou dano: PASS;
- falha perdeu banco sem tocar no dinheiro existente: PASS;
- 1 volta por etapa / garagem oculta: PASS;
- save v60→v61 preservou fase 210, CR$ 54.321 e dano;
- 30 arquivos JS + SW válidos; nenhum módulo >400 linhas;
- 206 IDs HTML únicos; zero asset local ausente;
- 999 pistas + sentinelas 1/27/333/666/999;
- determinismo físico 3×: PASS;
- 0 `Math.random()` em `src/`;
- todos os 20 módulos runtime presentes no shell offline do SW;
- shell crítico 89,1 KB gzip;
- Chromium ~59,88 FPS, zero pageerror/console.error.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,8/10:** a escolha ruim de propósito cria histórias; agora existe uma sessão com começo, escalada e medo de perder.
- **VC mobile — 9,4/10:** a Fenda cria retenção de sessão e conteúdo recombinável sem custo de servidor; o próximo salto é um calendário compartilhado para D1/D7.
- **Jogador de 14 anos — 9,8/10:** “só mais uma run” finalmente é literal; a carta lendária no meio muda a decisão na hora.

**Crítica mais dura:** ainda é uma experiência socialmente solitária no calendário. Uma Temporada Horizonte determinística precisa fazer todos os jogadores receberem o mesmo destaque diário/semanal e dar assunto compartilhável sem backend.
