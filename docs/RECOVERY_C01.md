# CICLO RECOVERY 1 — checkpoint R0

- FOCO: inventário parcial da versão pública e consolidação do Loop Mestre.
- BUGS ENCONTRADOS: RR-BUG-0001/0002 observados; 0003–0007 UNCONFIRMED.
- BUGS CORRIGIDOS: nenhum; não houve alteração de gameplay.
- REGRESSÕES: não avaliadas; não declarar ausência.
- TESTES AUTOMÁTICOS: validação estrutural dos JSON/documentos; não é teste do jogo.
- TESTES INTERATIVOS: URL pública abriu; DOM inicial mostrou menu; sessão posteriormente mostrou corrida ativa. Clique MODO CARREIRA retornou timeout/no_matches; transição não controlada, portanto fluxo menu→corrida NÃO aprovado.
- EVIDÊNCIA: dois snapshots na corrida com a mensagem de rádio repetida em duas regiões status. Captura 1363×936 mostrou faixas no cenário. Sem evidência persistida de vídeo; capturas observadas na sessão.
- RETRATO / PAISAGEM OBRIGATÓRIOS: NOT_RUN (captura desktop não cobre matriz).
- SAVE / FPS / ÁUDIO / PIT / NITRO / IA: NOT_RUN.
- LOGS: um erro de extensão chrome-extension, não atribuído ao jogo. Ausência de outros erros nesta amostra não aprova runtime.
- CRITICAL: 0 confirmados; MAJOR: 0 confirmados; MEDIUM: 2 confirmados; MINOR: 0 confirmados; UNCONFIRMED: 5. Inventário incompleto.
- STATUS: BLOCKED.
- PRÓXIMO FOCO: estabelecer fluxo reproduzível, completar R0 e evidências nas configurações obrigatórias antes de corrigir.

## Entrega deste checkpoint

Documentação e registros apenas. Preservadas regras SAVE_KEY/999/Canvas2D. Plano antigo marcado como subordinado; removida autorização de reduzir pistas, corrigida ordem adaptativa e dependência circular de QA. Sem claim de build final, melhoria aplicada ou teste humano.
