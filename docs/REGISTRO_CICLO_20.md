# CICLO 20 — OURO 20 — TELEMETRIA E PAINEL DE MÉTRICAS

## Entrega
- Taxonomia local: app_open, ftue_step, race_start, race_finish, garage_open, purchase_intent, share_click, ghost_import, session_end.
- Ring buffer máximo de 500 eventos.
- Sanitização por allowlist; campos não previstos são descartados.
- Envio externo somente com opt-in e endpoint HTTPS.
- Painel oculto: 5 toques no logo.
- Canvas mostra retorno local D1/D7/D30, sessão média, funil FTUE, conclusão por pista e buckets de dificuldade.
- Texto do painel deixa explícito que retenção é proxy desta instalação.

## Evidência
- 600 eventos resultam em buffer de 500.
- `alias` e `email` de teste foram descartados da carga de corrida.
- opt-out retorna `OPT-OUT` e não envia.
- save v71→v72 preservou fase 333, CR$ 76.543, MARCAS 44, FICHAS 321, Goliath e entitlements econômicos.
- 51 JS válidos, maior módulo 358 linhas, 999 pistas, zero `Math.random()` em `src/`, shell 127,8 KB gzip.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,7/10:** métricas não invadem o feel e continuam invisíveis para quem só quer jogar.
- **VC mobile — 9,9/10:** agora existe instrumentação concreta para discutir aquisição, funil e dificuldade.
- **14 anos / celular fraco — 9,8/10:** nada de login e nenhum painel na minha frente; continua offline.

**Crítica mais dura:** recordes e Códigos de Sombra ainda precisam provar integridade por replay reproduzível antes de qualquer placar ser confiável.
