---
document_id: RR-RECOVERY-001
version: 1.0.0
canonical: true
language: pt-BR
release_status: BLOCKED
updated: 2026-09-17
source: Loop Mestre fornecido pelo proprietário nesta conversa
---

# Retrô Racer — Gameplay Recovery → Perfect Ship

## Autoridade e missão

Este documento consolida o Loop Mestre do proprietário e prevalece sobre o plano anterior em caso de conflito. O detalhamento compatível em `PLANO_MESTRE_QUALIDADE_RETRO_RACER.md` continua válido. Requisitos não são evidências de implementação.

Corrigir → jogar → quebrar → corrigir → polir → validar → repetir. Nenhuma feature grande antes da estabilização. Uma corrida completa de cinco voltas deve funcionar repetidamente com grid, IA, colisões, nitro, combustível, pit, clima, áudio, rotação e resultado. Diversão e pilotagem são critérios obrigatórios; console limpo não basta.

## Invariantes

- `SAVE_KEY = 'retro_racer_championship_v30'`, sem reset de fase, dinheiro, carros, pinturas, upgrades, recordes, Ghost, história, temporada, configurações ou conquistas. Novos campos usam migrações e defaults seguros.
- Continuar Canvas 2D, pseudo-3D, módulos e assets originais/procedurais. Sem Unity, Godot, WebGL 3D ou framework externo.
- Preservar **999 pistas**, sem retirar pistas para mascarar problemas. Sentinelas: **1, 27, 333, 666, 999**.
- Congelar expansão de monetização, temporada, Fenda, Ghost social, editor, pacote investidor, modos e moedas. Recursos existentes podem continuar funcionando.
- Nunca afirmar zero bugs universal, 60 FPS em qualquer hardware ou QA humano a partir de automação.

## Protocolo de trabalho e dados

1. OBSERVAR: executar cenário real antes de implementar; R0 não adiciona features.
2. REPRODUZIR: registrar passos, estado, aparelho, orientação, dependência de FPS e save.
3. CAUSA: distinguir projeção, interpolação, wrap, física e ordenação; não corrigir somente aparência.
4. CORRIGIR: menor alteração suficiente; preservar trabalho alheio.
5. TESTAR: cenário falho, normal, orientação oposta, save antigo e corrida completa relacionada.
6. REGRESSÃO: testar sistemas que a alteração pode afetar.
7. DECIDIR: KEEP com evidência; REVERT somente alterações próprias que introduziram regressão, sem apagar trabalho do usuário.

`GAMEPLAY_RECOVERY_STATE.json` é o checkpoint. `BUG_REGISTRY.json` registra cada defeito. Status de bug: UNCONFIRMED, OPEN, FIXED, VERIFIED, REOPENED. FIXED exige correção identificada; VERIFIED exige reteste. Relatos e suspeitas sem reprodução própria permanecem UNCONFIRMED, sem causa ou solução inventada. Contagens incluem OPEN/REOPENED; pendências não confirmadas são contadas separadamente e não significam ausência de risco.

Severidades: CRITICAL (crash, save, controle impossível, rotação reinicia, corrida não termina, pit prende, áudio completamente quebrado); MAJOR (atravessamento, nitro repetido, IA explorável, HUD obstrui, consumo errado, contato repetido, pit quebrado); MEDIUM (cenário, mensagens, animações, alinhamento, áudio irregular); MINOR (acabamento sem prejuízo funcional).

Prioridade de defeitos: crash/save → controle → física → IA → pit → nitro → mobile → HUD → áudio → performance → visual → polimento. Essa urgência prevalece sobre a sequência temática abaixo.

## Etapas obrigatórias

| Etapa | Escopo e aceite |
|---|---|
| R0 Inventário | Executar menu, história, garagem, copas, pré-corrida, largada, primeira curva, nitro, colisão, off-road, combustível, pit, clima, pausa, rotação, chegada, resultado, replay e próxima corrida. Classificar defeitos sem novas features. |
| R1 Mobile/UI | Tipografia legível e consistente, categorias, poucos botões simultâneos, alvos mínimos de 48 px, safe-area, scroll natural, foco visível. Sem lista interminável. |
| R2 HUD | Retrato superior compacto: posição, volta, velocidade, combustível, nitro e dano essencial. Paisagem lateral/compacto. Uma fila de alertas: pane/dano crítico > combustível > pit > última volta > curva > rádio > combo. Sem caixas concorrentes sobre pista/carros. |
| R3 Carros | Silhuetas distintas, carroceria, vidro, teto, quatro rodas representadas coerentemente com o ângulo, lanternas, sombra, iluminação, dano. Escala contínua por distância, sem flutuar ou saltar de tamanho. |
| R4 Colisões | Hitboxes por largura/comprimento, velocidade relativa e ângulo. Contato por par ENTER/STAY/EXIT, impacto em ENTER, sem repetir em STAY. Raspão, lateral, traseira, frontal, zebra, barreira e off-road. Leve: pequeno impulso/som/faísca/perda; forte: dano, perda relevante, kick, hitstop curto e shake controlado. Sem atravessar, grudar ou teleportar. |
| R5 IA/posições | Separar posição física, classificação e ordem de desenho. Sem spawn sobre jogador, sumiço ou troca instantânea de faixa. Acelerar, frear, defender, ultrapassar, vácuo, leitura de curvas e erros plausíveis. |
| R6 Dificuldade | Fácil acessível; Normal competitivo, sem 23º→top5 apenas acelerando nos primeiros segundos; Herói exige linha/estratégia; Lenda rápida e justa sem rubber-band favorável. Medir tempos-alvo por dificuldade. |
| R7 Largada | Grid em duas colunas, espaçado, apresentação breve, motores, 3–2–1–GO. Mesmas regras para IA/jogador, jump start penalizado, perfect start com vantagem pequena. Sem colapso na primeira curva. |
| R8 Nitro | Máquina e regras abaixo; limite estratégico igual para IA. |
| R9 Pit | Cena física e máquina abaixo; sem controle durante serviço nem teleporte. |
| R10 Combustível/dano | Auditar cinco voltas, Stallion stock com pit viável; IA sem pane seca prematura. Consumo por velocidade/nitro, tanque, dificuldade e abastecimento coerentes. |
| R11 Áudio | Uma autoridade/AudioContext. Pools motor, colisão, skid, UI, nitro e rádio, polifonia limitada e ganhos suaves. Sem recriação contínua. Perda de foco fade/suspend; retorno resume; rotação não reinicia música. Investigar a causa real de cortes, não presumir. |
| R12 Cenários | Horizonte, camada intermediária, proximidade. Biomas alpino, floresta, litoral, deserto, cidade noturna, industrial, vulcânico. Vegetação/neve/pedras junto à pista, paleta/luz/sombra/neblina coerentes, marcos memoráveis. Sem manchas, pista flutuante ou retângulos atravessando a tela. |
| R13 Set pieces | Túnel com entrada/interior/saída; ponte com aproximação/estrutura/travessia/saída; viaduto com suportes/profundidade/fim coerente. |
| R14 Clima | Chuva: grip/spray/superfície; neve: terreno/pista/grip; neblina: visibilidade; calor: haze. Transições graduais e curvas legíveis. |
| R15 Pistas | Todas as 999, assinatura por copa: bioma, luz, largura, relevo, sequência de curvas, landmark, set piece. Campanha ensina gradualmente, rivais e corridas especiais dão identidade. Não só mudança de cor. |
| R16 Game feel | Direção, contraesterço, aceleração, freio, drift, vácuo, off-road e recuperação. Meta de decisão interessante a cada cinco segundos, validada jogando. Carros diferentes de pilotar, feedback claro, recompensas relevantes sem grind excessivo. |
| R17 Performance | Simulação fixa60Hz e render desacoplado. Meta60FPS; reduzir pós-processo → partículas → props → distância → resolução; só então30 estáveis. Sem alocação evitável no hot loop; pools partículas/faíscas/skid/chuva/decor. Medir frame times e stutter, não só contadorFPS. |
| R18 PWA/cache | Versão por build, assets novos e remoção de caches antigos do próprio jogo; nunca apagar saves ou caches de outros apps. `atualizar.html`: FORÇAR ATUALIZAÇÃO e confirmação da versão instalada. Query na URL não prova atualização do service worker. |
| R19 Saves | Fixtures A novo, B meio, C avançado, D fase999. Comparar antes/depois level, money, cars, skins, upgrades, records, Ghost, story, season, settings e conquistas. Zero perda. |
| R20 Diversão | Jogar primeira corrida, curta, cinco voltas, vitória, derrota, recuperação, pit estratégico e última volta disputada. Avaliação humana obrigatória; automação não aprova diversão. |

### Nitro: contrato

Estados explícitos: CHARGING → READY → FIRING → EMPTY → LOCKED → CHARGING. READY só com carga integral100%; exibição arredondada não autoriza. Uma carga armazenada, consumo100→0 sem cancelamento para guardar, alvo aproximado4s. No máximo um uso/volta carreira. Recarga por curva limpa, vácuo e ultrapassagem, não apenas tempo. Não recarregar indefinidamente por exploração do mesmo evento. Gesto mantido não repete; após carga completa é preciso soltar e fazer novo gesto. Bloquear ativação em largada, impacto forte, recuperação e pit. Interrupção por eventos especiais deve consumir/invalidar o restante de modo documentado, nunca devolver carga grátis. IA segue mesmos limites. Arcade pode diferir somente com regras identificadas.

### Pit: contrato

Estados: PIT_NONE → PIT_ENTRY → PIT_LANE → PIT_ALIGN → PIT_SERVICE_FUEL → PIT_SERVICE_REPAIR → PIT_SERVICE_FINAL → PIT_RELEASE → PIT_EXIT → PIT_REJOIN → PIT_NONE.

PIT300/200/100, faixa dedicada, muro e corredor de entrada; limite de velocidade, boxes e circulação visíveis. Alinhar e parar completamente. Mecânico conecta mangueira enquanto combustível sobe; equipe lateral repara enquanto dano diminui; pneus/ajuste com animação; chefe controla saída. Jogador sem controle durante trabalho. Liberar somente após serviço completo, mangueira retirada, equipe afastada e sinal verde. Saída com corredor, muro, linha e junção progressiva. Rotação não cancela serviço. Definir transições/guardas e recuperação de estados inválidos antes de implementar.

### Power-ups e ritmo

Carreira usa recursos coerentes: vácuo, nitro, aderência, reparo e pit. Fantasia apenas em arcade separado, sem expandir modos durante recovery. Sem bônus aleatório decidir corrida, coleta fora da pista/dentro de carro/inacessível ou acúmulo infinito. Ícones claros, efeitos contidos. Núcleo: velocidade → leitura da curva → risco → ultrapassagem → feedback. Entrada rápida, IA justa/legível, derrota instrutiva, vitória conquistada, menus sem interromper fluxo.

## Matriz obrigatória (tudo começa NOT_RUN)

| Orientação | Viewports CSS |
|---|---|
| Retrato | 360×800; 390×844; 412×915; 430×932 |
| Paisagem | 640×360; 844×390; 915×412; 932×430 |

Para cada tamanho testar menu, história, pré-corrida, largada, corrida, nitro, colisão, pit, pausa, rotação, última volta e resultado. Registrar build, navegador, aparelho/DPR, emulação ou físico, save, pista, dificuldade, passos, resultado e evidência. Nunca copiar PASS da tabela de requisitos para o relatório.

Rotacionar em menu/história/pré-corrida/largada/corrida/nitro/colisão/pit/pausa/última volta; parado, veloz e em curva. Comparar estado lógico antes/depois sem confundir avanço normal da simulação com reset. Não reiniciar corrida, volta, IA, combustível ou música; não alterar posição artificialmente, cancelar pit, recarregar página ou duplicar input. Canvas/HUD/controles apenas se reorganizam. Preservar safe-area, pista sem distorção e carro sem corte.

Input: acelerar+virar, frear+virar, acelerar+nitro, virar+nitro; dois/três/cinco dedos, pointercancel, dedo saindo da tela, minimizar pressionando. Nenhuma entrada presa. Testar teclado/gamepad existentes sem regressão.

Destruição: batidas repetidas, segurar nitro, entrar torto/sair errado do pit, pane seca, rotação contínua e no pit, minimizar/retomar, trocar qualidade correndo, pausar no GO, cinco dedos, atualizar no resultado, retomar corrida antiga e save velho. Defeito reabre loop.

## Gate de lançamento

BLOCKED enquanto houver CRITICAL, MAJOR, MEDIUM na corrida principal, regressão de save, crash/carregamento, rotação, pit, nitro, IA explorável, HUD obstrutivo, áudio quebrado, PWA antiga ou teste obrigatório pendente. Ausência de reprodução não é PASS.

RC somente após gates técnicos demonstrados; PERFECT_SHIP somente com todas as oito resoluções, orientações, cinco voltas completas, quatro saves, sentinelas e preservação999, áudio/performance aceitáveis, nenhuma falha impeditiva e corrida completa **jogada e aprovada por humano**. Declarar limitações reais de acesso a dispositivos/áudio, nunca simulá-las como aprovação.

Perguntas humanas: decisões relevantes? diversão? IA justa? derrota ensina? vitória satisfaz? nitro estratégico? pit cria tensão? corrida tem ritmo? Correções reabrem os testes afetados.

## Relatório por ciclo

```text
CICLO RECOVERY N
FOCO:
BUGS ENCONTRADOS:
BUGS CORRIGIDOS:
REGRESSÕES:
TESTES AUTOMÁTICOS:
TESTES MANUAIS:
RETRATO:
PAISAGEM:
SAVE:
FPS:
ÁUDIO:
PIT:
NITRO:
IA:
CRITICAL:
MAJOR:
MEDIUM:
MINOR:
STATUS: BLOCKED / RC / PERFECT_SHIP
PRÓXIMO FOCO:
```

Continuar sem pedir autorização repetida dentro do escopo, preservando checkpoints. Parar e informar bloqueios reais de permissão/acesso/capacidade; não prometer execução infinita em segundo plano. Publicações de teste ficam identificadas como BLOCKED/preview, nunca final. Não substituir build jogável por regressão conhecida.

Somente no gate final gerar build, ZIP completo, changelog, registro final, matrizQA, relatório de performance, migração de saves, corrida completa, versão de cache, atualizar.html e checksums. Só então declarar `PERFECT_SHIP = TRUE` e “RETRÔ RACER — PERFECT SHIP APROVADO”.
