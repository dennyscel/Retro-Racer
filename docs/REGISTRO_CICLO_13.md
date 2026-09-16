# CICLO 13 — OURO 13 — TREINADOR PÓS-CORRIDA

## Diagnóstico
O jogo já premiava resultado e tinha ghost, mas após a bandeirada o jogador ainda precisava adivinhar onde perdeu tempo.

## Mini-GDD
Cada volta válida grava 30 marcos leves de tempo e três setores. A melhor volta anterior da pista vira referência local. No resultado, duas linhas mostram VOCÊ × MELHOR, S1/S2/S3 exibem ganho/perda e o treinador entrega UMA dica escolhida pelo maior problema mensurável. Nada de IA externa, texto aleatório ou múltiplas recomendações.

## Entregue
- referência compacta por pista em `career.coach.traces`;
- 30 marcos de distância por melhor volta + 3 setores;
- comparação cumulativa desenhada no canvas;
- deltas S1/S2/S3;
- uma dica baseada em batida, saída de pista, ausência de nitro ou perda objetiva do pior setor;
- save schema v65 mantendo SAVE_KEY.

## Evidência
No QA, a referência foi 60,0 s (20/20/20). A volta seguinte foi 64,0 s (20/24/20) com 4,7 s fora da pista no segundo setor. O treinador exibiu `S2 +4,00s` e recomendou manter o carro no asfalto no S2. O recorde de 60 s permaneceu intacto.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,7/10:** feedback ensina sem interromper a corrida e respeita a memória do jogador.
- **VC mobile — 9,5/10:** mastery loop melhora retenção sem conteúdo novo caro.
- **14 anos / celular fraco — 9,6/10:** sabe exatamente o que tentar na próxima corrida.

**Crítica mais dura:** o jogo já ensina quem quer melhorar, mas ainda exige aceleração/freio completos de todo mundo. O próximo passo é abrir a porta para casual sem desmontar o modo hardcore.
