# CHECKLIST DE TESTE — CICLO 02

## Autoteste

| Item | Resultado | Evidência |
|---|---|---|
| Sintaxe JS de todos os módulos | PASS | `node --check`, zero falhas |
| Save antigo v52 sem perda | PASS | fase 123, CR$ 45.678, carro 2 e stats preservados |
| Save novo entra sem menu | PASS | prólogo ativo ~0,9 s, menu/HUD ocultos |
| Primeira ação = direção | PASS | auto-aceleração; steering teclado/pointer disponível |
| Primeira ultrapassagem ≤20 s | PASS | ~2,1 s no teste dirigido |
| Handoff aos 8 s | PASS | corrida real ativa ~8,02 s |
| Mobile 390×844 | PASS (laboratório) | pointer alterou X e completou ultrapassagem |
| Determinismo 3× | PASS | progress/x/speed/fuel/time/lap idênticos |
| 999 pistas / 37×27 | PASS | CSV + JSON |
| Sentinelas 1/27/333/666/999 | PASS | arquivos presentes |
| IDs HTML únicos | PASS | 158 IDs, zero duplicados |
| Assets locais quebrados | PASS | zero referências ausentes |
| `SAVE_KEY` exato | PASS | `retro_racer_championship_v30` |
| 4 rodas | PASS | quatro `carRoundRect` de roda em `drawCarGeneric()` |
| `Math.random()` em `src/` | PASS | zero ocorrências |
| Maior módulo ≤400 linhas | PASS | 351 linhas |
| Chromium sem pageerror | PASS (injeção do mesmo runtime) | 0 page errors / 0 console errors |
| Navegação HTTP/file normal | NÃO TESTADO | bloqueada por política administrativa do ambiente |
| Moto G físico | NÃO TESTADO | requer hardware |
| Gamepad/haptics físico | NÃO TESTADO | requer hardware |
| PWA instalada em HTTPS | NÃO TESTADO | requer origem HTTPS real |

## Leis L1–L12

| Lei | Status |
|---|---|
| L1 SAVE_KEY/save antigo | PASS |
| L2 Canvas pseudo-3D | PASS |
| L3 Zero dependência externa runtime | PASS |
| L4 Assets originais/procedurais | PASS estrutural |
| L5 Orçamento de frame | PASS laboratório (~59,88 FPS); Moto G NÃO TESTADO |
| L6 Shell ≤350 KB gzip / first race | PASS em tamanho; rede HTTP real NÃO TESTADA neste ambiente |
| L7 Sem pay-to-win | PASS |
| L8 Sem dark pattern | PASS |
| L9 Sem regressão de feel/save | PASS nos testes automatizados |
| L10 Mobile retrato/paisagem | PASS viewport laboratório; hardware NÃO TESTADO |
| L11 Checklist honesto | PASS |
| L12 Continuidade do loop | PASS — próximo alvo OURO 3 |
