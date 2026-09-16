# Métricas-alvo e método de validação

> Estes valores são **metas de produto**, não resultados observados. O build atual não possui coorte pública suficiente para declarar retenção real.

| Métrica | Meta inicial | Como medir | Ouros que contribuem |
|---|---:|---|---|
| FTUE: completar 1ª corrida | ≥ 85% | `ftue_step` → `race_finish` | 2, 3, 4, 18 |
| Tempo até dirigir | ≤ 3 s percebidos | boot/FTUE local | 2, 17 |
| D1 | ≥ 30% | coorte consentida após lançamento | 5, 9, 10, 13 |
| D7 | ≥ 12% | coorte consentida | 9, 10, 11, 15 |
| D30 | ≥ 5% | coorte consentida | 10, 12, 15 |
| Sessão mediana | 8–15 min | `session_end.duration` | 9, 10, 11 |
| Share click / sessões | ≥ 8% | `share_click / session` | 6, 16 |
| Ghost import / share click | ≥ 25% | `ghost_import / share_click` | 6, 16 |
| Primeira corrida após import | ≥ 70% | `race_start / ghost_import` | 6, 2 |
| k-factor experimental | ≥ 0,20 para primeira rodada | shares × opens × starts | 6, 16 |
| Crash-free sessions | ≥ 99% | erro de runtime por sessão | 1, 7, 20, 21 |
| 60 FPS aparelho alvo | mediana ≥55 FPS | matriz Moto G/classe similar | 1, 3, 7 |
| 30 FPS aparelho fraco | mediana ≥28 FPS | hardware real | 7 |

## Funil mínimo de experimento
`app_open → ftue_start → race_start → race_finish → garage_open → share_click → ghost_import → race_start(shadow) → session_end`

## Regras de interpretação
1. Não usar telemetria sem consentimento/configuração adequada.
2. Não chamar meta de “resultado”.
3. D1/D7/D30 exigem coortes reais; painel local só estima fluxo, não retenção populacional.
4. Separar usuários orgânicos, convidados por sombra e retorno direto.
5. Só calcular LTV/CAC quando houver gasto e receita reais.
