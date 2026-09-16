# BÍBLIA AAA — RETRÔ RACER CHAMPIONSHIP
## Briefing executável para ChatGPT 6 Astra
### Base: V42.2 SEO JPG Hostinger | Autor: Dennys Smaniotto Pavanelli
### Objetivo: levar o jogo de “HTML retrô completo” para qualidade **triplo AAA** sem recomeçar do zero

---

## 0. MISSÃO

Você NÃO vai reescrever o jogo do zero.
Você vai **lapidar a base V42.2** até ela parecer um produto comercial de corrida arcade 16-bit (referências de sensação: Top Gear SNES, OutRun, Ridge Racer, F-Zero GX no juice, Mario Kart 8 no polish de UI, Gran Turismo no meta de garagem).

**Definição de AAA neste projeto:**
1. Cada segundo de jogo comunica velocidade, risco e identidade.
2. Cada tela parece desenhada, não “menu HTML”.
3. Cada pista das 999 parece intencional, não gerada.
4. Feedback (som, câmera, HUD, partículas, haptics) responde a TUDO que o jogador faz.
5. Mobile e desktop jogam como produto, não demo.
6. Progressão dá vontade de “mais uma corrida”.
7. Zero regressão nos sistemas já aprovados.

---

## 1. REGRAS INVIOLÁVEIS

Copie estas regras no topo de cada entrega:

1. Entregar HTML completo jogável + ZIP completo + docs da versão.
2. NÃO trocar `SAVE_KEY = 'retro_racer_championship_v30'` sem migração.
3. Preservar: carreira, 999 pistas, 37 copas / 27 pistas, 5 voltas, 22 rivais, pit, combustível, dano, nitro, draft, garagem, upgrades, semáforo 3-2-1-GO, áudio procedural, parallax V41.6, SEO Hostinger.
4. NÃO reduzir o jogo a uma versão curta.
5. NÃO quebrar rolagem de menus no celular.
6. NÃO voltar o carro para “2 rodas”. `drawCarGeneric()` sempre desenha 4 rodas.
7. Gasolina NÃO pode acabar antes de meia volta em uso normal.
8. IA NÃO pode sofrer pane seca no começo da 1ª volta.
9. Testar retrato + paisagem + teclado + toque.
10. Cada versão mexe em POUCAS frentes, mas entrega o pacote inteiro.
11. Atualizar `README.md`, `CHANGELOG.md`, `docs/REGISTRO_MUDANCAS_...`, `docs/CHECKLIST_TESTE_...`, manifesto JSON.
12. Se algo visual/físico piorar, REVERTER. Nunca “deixar pior e documentar”.

---

## 2. DIAGNÓSTICO DA BASE ATUAL (V42.2)

### O que já é forte
- Motor pseudo-3D funcional estilo OutRun/Top Gear.
- Carreira + economia + 3 carros + 5 upgrades.
- 999 circuitos com bioma, clima, horário, assinatura, pits, paleta.
- Chuva em 3 camadas, neblina, neve, calor, asfalto molhado.
- Parallax por profundidade e por bioma.
- Áudio Web Audio + banco 999 músicas + SFX + música de menu.
- SEO, Open Graph, JSON-LD, imagem social JPG.
- Save com migração de chaves antigas.

### O que impede o selo AAA hoje
- Um único `index.html` de ~1800 linhas concentra UI, física, render, áudio, menus.
- Só 3 carros e 5 upgrades genéricos; garagem rasa.
- Sem seleção de fase/copa, sem replay, sem ghost, sem foto-finish.
- HUD é caixas HTML, não instrumento de corrida.
- Carros são formas vetoriais simples; pouco “sprite 16-bit de revista”.
- IA tem estilos, mas pouco teatro (ultrapassagem, bloqueio, erro espetacular, rival nomeado).
- Clima existe, mas não muda o JOGO (água, gelo, vento, aquaplanagem).
- 999 pistas no papel; na prática o olho ainda vê família de templates.
- Sem PWA, sem gamepad, sem haptics, sem acessibilidade real.
- Sem modo arcade / time trial / endurance / desafio diário.
- Pit stop sem teatro (barra, equipe, risco de overshoot).
- Transições de menu secas.
- Performance não tem LOD / quality tiers.
- Conteúdo musical/pista é volume; AAA pede **autoria perceptível**.

---

## 3. PLANO DE VERSÕES (NÃO FAZER TUDO DE UMA VEZ)

Execute NESTA ORDEM. Cada versão = 1 ZIP + 1 HTML principal + docs.

| Versão | Nome | Foco | Critério de ouro |
|---|---|---|---|
| V43 | Juice de corrida | Feel + câmera + pit + HUD | “parece videogame, não canvas” |
| V44 | Identidade de copas | Seleção, preview, troféus, ranking local | Jogador escolhe e reconhece cada copa |
| V45 | Garagem AAA | 8–12 carros, pinturas, upgrades visíveis | Carro diferente SE SENTE e SE VÊ |
| V46 | Clima jogável | Chuva/gelo/vento/areia afetam física | Clima muda a linha de corrida |
| V47 | IA teatral | Personalidades, rival negro, radio chatter | Grid parece campeonato de verdade |
| V48 | Modos extra | Arcade, time trial, ghost, endurance, daily | 4 razões para reabrir o jogo |
| V49 | Audiovisual 2 | Neve/calor/túnel/neon + música por família | Cada bioma tem trilha e look próprio |
| V50 | Plataforma AAA | PWA, gamepad, haptics, settings, quality | Instala no celular e joga com controle |
| V51 | Conteúdo lendário | Pistas autorais 1/27/999 + eventos | Fase 27, 333, 666, 999 são inesquecíveis |
| V52 | Ship | Balance 999, QA, i18n, analytics leve, store page | Pronto para vitrine |

---

## 4. PACOTE DE IDEIAS — O QUE IMPLEMENTAR

Abaixo está o backlog completo. Marque cada item como `V43…V52` na entrega.

========================================
A. JUICE / FEEL DE CORRIDA (prioridade máxima)
========================================

A1. Câmera cinematográfica
- FOV aumenta levemente com velocidade (ex.: 100 → 112).
- Câmera atrasa 1 frame nas curvas (body roll).
- Lookahead: aponta 8–14 segmentos à frente.
- Shake só em impacto/off-road/nitro, com decay exponencial. Nunca shake constante.
- Landing squash quando o relevo desce forte.

A2. Direção com peso
- Steer speed escala inversa à velocidade (rápido = vira menos).
- Countersteer assist leve no toque (já existe interpolação; tornar explícita e tunável).
- “Snap” mínimo ao centrar o stick/tecla (deadzone + retorno).
- Derrapagem controlada: se |curva * speed| > grip, gera ângulo visual + fumaça + skid, sem perder 100% controle.
- Assistência de linha fantasma OPCIONAL no modo fácil.

A3. Nitro com personalidade
- Folga de 0.12s no acionamento + flare no escapamento.
- Speed lines alinhadas à perspectiva (hoje são aleatórias; devem sumir no vanishing point).
- Aberração cromática / vinheta só no pico do nitro.
- Recarga: draft recarrega 8–14%; pit recarrega 40%; volta limpa recarrega 12%.
- Overheat: nitro contínuo > 2.4s começa a consumir extra e esquentar o motor (HUD).

A4. Draft / vácuo visível
- Fantasma de ar atrás do rival (losango alongado).
- Som de “whoosh” ao colar.
- Bonus de 4–7% speed, não só accel.
- Sair do vácuo com explosão curta (“slingshot”).

A5. Colisão AAA
- Distinguir toque lateral, traseira, parede, off-road.
- Toque leve: spark + 1–2% dano.
- Batida forte: spark + fumaça + steer kick + 6–12% dano.
- NÃO teleportar o carro. Empurrar no eixo X com cooldown já existente.
- Foto da batida: freeze-frame 90ms em impacto > limiar.

A6. Off-road
- Terra/grama/areia/neve com decel diferente por bioma.
- Pedras/poças geram shake + dano lento.
- Trilha de sujeira no para-lama até o próximo pit.

A7. Pit stop teatral
- Faixa direita + velocidade < 28% max.
- Se entrar rápido: mensagem “REDUZA PARA ABASTECER” + recusa + pneu cantando.
- Barra de pit 0→100 com etapas: pneu / gasolina / água / go.
- Tempo de pit 1.6–2.4s (armor/tank alteram).
- Crew sprites 16-bit nas laterais.
- Risco: sair antes de 70% = tanque parcial.

A8. Semáforo
- SFX distinto para 3, 2, 1, GO (já pedido no roadmap V34).
- Jump start: se acelerar antes do GO, wheelspin + 0.4s delay + 2% dano pneu.
- Perfect start: soltar no frame do GO = boost 0.35s.

A9. Foto de chegada
- Banner xadrez atravessa a tela.
- Replay 2.5s da reta final em slow-mo 0.45x se a diferença para o 2º for < 0.35s.
- Confetes / fumaça de pneu se 1º lugar.

========================================
B. HUD E UI COM CARA DE CONSOLE
========================================

B1. HUD de instrumento, não de site
- Agrupar: POS+VOLTA | VEL+MARCHA | NITRO+GAS | DANO | TEMPO.
- Velocímetro analógico + digital.
- Marcha simulada (1–5 + N) só visual/sonora, sem mudar física de forma injusta.
- Barras de nitro/gas/dano com cor e pulse:
  - gas < 25% âmbar, < 12% vermelho + beep.
  - dano > 70% HUD treme.
- Mini-mapa fita (ribbon) da próxima curva: esquerda/direita + intensidade.
- Setas de curva no horizonte (estilo Rally / Ridge).
- Nome da pista + clima no canto por 2.2s após o GO.

B2. Menus
- Intro 1.8s: logo “Clássicos dos Games” → título Retrô Racer com scanlines.
- Transição: fade + slide 180ms, som de confirmação.
- Cards com borda CRT, grain 4%, scanline 8%.
- Fonte pixel (Press Start 2P ou similar via @font-face local, sem CDN bloqueável).
- Botão focado visível para teclado/gamepad.
- Confirmação de “zerar save” com digitar CORRIDA, não só confirm().

B3. Tela pré-corrida AAA
- Preview da pista: render estático do primeiro horizonte + fita de curvatura.
- Clima, horário, copa, assinatura, pits.
- Previsão: “Cuidado: hairpin cego no 2º setor”.
- Escolha de pneu: slick / misto / chuva (afeta grip por clima).
- Countdown na própria tela ao confirmar.

B4. Resultado
- Tabela 23 posições com tempo de volta, pit, melhores setor.
- Medalha ouro/prata/bronze animada.
- Comparativo vs recorde pessoal.
- Botão: REVANCHE / GARAGEM / PRÓXIMA / FOTO.

B5. Estatísticas
- Gráfico simples de posições nas últimas 20 corridas (canvas sparkline).
- Taxa de pits, km rodados, nitro usado, colisões.
- Hall da fama local por copa.

========================================
C. GARAGEM E PROGRESSÃO
========================================

C1. Expandir frota para 8–12 carros (desbloqueio por copa/dinheiro)
Sugestão de roster (manter Stallion/Banshee/Goliath):
1. Stallion — all-rounder
2. Banshee — speed glass
3. Goliath — tank
4. Firefly — econômico, curva
5. Nightshade — noturno/neon, nitro
6. Duna — deserto, grip areia
7. Avalanche — neve, peso baixo
8. Viper Black — rival desbloqueável após vencer o Ghost 3 vezes
9. Kartz Junior — arcade, leve, pouco tanque (easter)
10. Titan — endurance
11. Pulse — cidade, aceleração
12. Eclipse — lendário fase 999

C2. Cada carro precisa de
- 3 views: 3/4 garagem, traseira, sideline.
- Stats em hexágono: SPEED / ACCEL / GRIP / FUEL / ARMOR / NITRO.
- Frase de piloto / nacionalidade fictícia.
- Preço + condição de unlock (copa X ou CR$).
- Dano visual: arranhões, fumaça, farol quebrado.

C3. Pinturas e decalques
- 6 skins por carro (stock, midnight, flame, chrome, sponsor, gold).
- Desbloqueio por medalha ouro na copa.
- Stripe custom: 8 cores.

C4. Upgrades visíveis
Além dos 5 atuais, adicionar:
- Suspensão (estabilidade em relevo)
- Freio (breaking mais forte, menos lock)
- Radiador (nitro overheat)
- ECU (resposta de accel)
- Aero (draft e estabilidade em alta)
Níveis 0–5. Custo exponencial já existente.
Na pista: escapamento maior, asa, pneu mais largo, capô com entrada de ar.

C5. Economia AAA
- Apostas opcionais pré-corrida (2x prêmio se top 3).
- Seguro de dano (paga 15% do prêmio, reduz custo de reparo).
- Patrocínio por copa (missão: terminar sem pit / sem colisão).
- Inflação suave após fase 200 para o dinheiro não estourar.
- Cap de money visual 999.999.999 já existe; adicionar notação CR$ 1.2M.

C6. Árvore de copas
- 37 copas visíveis em mapa-mundo 2D.
- Cada copa 27 pistas, 3 medalhas, troféu 16-bit.
- Copa secreta após 12 troféus.
- Fase 999 = “Circuito Lendário Eclipse” com intro própria.

========================================
D. PISTAS E CONTEÚDO
========================================

D1. Autoria perceptível (mesmo com 999)
- 12 “set pieces” reutilizados com variação: túnel, ponte, viaduto, praia, canyon, cidade alta, lago congelado, desfiladeiro, porto, autódromo, serra, circuito noturno de neon.
- Cada 27ª pista da copa tem set piece exclusivo.
- Fingerprint visual: placar com NOME da pista na entrada da reta.

D2. Setores
- Dividir cada pista em S1 S2 S3.
- Tempo de setor no HUD.
- Roxo = recorde de setor (estilo F1).

D3. Largura variável já existe (`w`). Usar de verdade
- Estreita em serra (0.72–0.84).
- Larga em deserto (1.05–1.18).
- Split de pista (offset de road) em 20 circuitos especiais.

D4. Props por bioma (não só árvore/cacto/placa)
- Grass: celeiro, cerca, plateia, balão.
- Desert: pedra, duna, ossos, torre de petróleo.
- City: outdoor animado, metrô elevado, neon kanji/pt.
- Mountain: pinheiro, placa de altitude, bandeira de neve.
- Extra biomas a criar sem quebrar os 4 atuais: beach, industrial, ruins, space-night (só copas finais).

D5. Mini-mapa / preview
- Gerar polyline da curvatura a partir de `sections[]`.
- Mostrar na pré-corrida e no resultado.

D6. Pits múltiplos
JSON já tem `pits: [0.22,0.58,0.87]`. HOJE o código marca pits de forma genérica.
- LER o array `pits` do circuito e posicionar boxes reais.
- Placa “PIT 200m / 100m / IN”.

D7. Horário do dia jogável
- Dawn / day / dusk / night já no JSON (`timeOfDay`).
- Paleta de céu + faróis + bloom noturno + ciclistas? não.
- Night: headlights do player em cone; rivais com lanternas.

========================================
E. CLIMA JOGÁVEL
========================================

E1. Rain
- Grip * 0.86 slick / 1.02 chuva.
- Spray atrás dos carros.
- Poças = aquaplanagem 0.2s se speed > 80% e pneu slick.

E2. Storm
- Rain + vento lateral senoidal.
- Raios iluminam o canvas 80ms.
- Trovão no SFX (já há tempestadade visual).

E3. Fog
- drawDistance efetivo reduz 18–30%.
- Placas de curva ficam essenciais.

E4. Snow / ice
- Grip * 0.80, centrifugal percebido maior.
- Trilha no off-road branca.
- Neve no para-brisa (overlay que some com velocidade).

E5. Heat
- Heat haze no horizonte (displacement fake por scanline offset).
- Motor esquenta mais; nitro overheat mais rápido.

E6. Wind / sand
- Partículas atravessam a câmera.
- Off-road desert consome mais.

E7. Transição
- 10% das pistas mudam o clima na volta 3 (chuva chegando). Aviso no HUD.

========================================
F. IA E CAMPEONATO VIVO
========================================

F1. 22 rivais com ficha
- Nome, país fictício, carro, frase, rivalidade.
- Ghost (preto) é o antagonista: se você está em 1º na última volta, ele usa nitro scriptado 1 vez.

F2. Estilos reais (já há labels; aprofundar)
- aggressive: fecha a porta, freia tarde.
- blocker: defende linha se você colou < 400z.
- curve: ganha 6% nas curvas, perde no straight.
- straight: slipstream hunter.
- unstable: erro a cada 18–30s (sai 0.12 de faixa).
- rival: rubber-band LEVE (±4%), nunca injusto demais.
- pitter: administra combustível de verdade.

F3. Teatro
- Radio 1 linha: “VIPER COLANDO”, “PIT ABERTO”, “ÚLTIMA VOLTA”.
- Bandeira azul se o líder vai ultrapassar retardatário.
- Yellow flag opcional se 3+ carros batem no mesmo segmento (reduz IA 12% por 4s).

F4. Grid
- Largada em 2 colunas 2-by-2, player na 11ª–23ª conforme skill/elo local.
- Pole desbloqueável no time trial daquela pista.

F5. Rubber-band honesto
- Se player em 15º+ após volta 2, IA líder -3% speed.
- Se player disparou 8s, 3 rivais recebem +2.5%.
- Nunca sugar o player na última curva de forma óbvia.
- Opção em settings: IA Fixa / IA Campeonato.

========================================
G. MODOS DE JOGO
========================================

G1. Carreira (já existe) — manter como eixo.
G2. Corrida rápida — escolhe copa/pista/voltas/clima.
G3. Time Trial — sem rivais ou 1 ghost.
G4. Ghost próprio — grava input/posição a 20 Hz, replay fantasma.
G5. Endurance — 15 voltas, 2 pits obrigatórios, desgaste de pneu.
G6. Eliminator — último a cada 45s sai.
G7. Desafio diário — seed = YYYYMMDD, 1 pista, 1 clima, leaderboard local.
G8. Copa relâmpago — 3 pistas seguidas sem garagem.
G9. Boss race — 1v1 contra Ghost no circuito da copa.
G10. Foto mode — pausa + câmera livre limitada + scanlines + export canvas PNG.

========================================
H. ÁUDIO AAA
========================================

H1. Motor
- Camadas: idle / low / high / limiter.
- Pitch proporcional à speed + carga (subida).
- Backfire no corte de nitro.
- Distinto por modelo de carro.

H2. Pneu
- Skid contínuo proporcional ao slip, não one-shot.
- Mudança de asfalto/terra/água/zebra.

H3. Semáforo / UI
- Beeps musicais 3-2-1-GO na tonalidade da copa.
- Whoosh de confirmação de menu.
- Stinger de vitória / derrota / pane / explosão de motor.

H4. Música
- Manter procedural + banco 999.
- Famílias reais: grass warm, desert twang, city FM, snow choir, final epic.
- Ducking: -7 dB na voz/radio e no semáforo.
- Loop sem costura no ponto já definido do menu (compassos 8–64).
- Faixa de resultados diferente da corrida.

H5. Mixer
- Settings: Música / SFX / Motor / Voz / Mudo.
- Persistência no save.
- Compressor leve no master para não estourar no mobile.

H6. Espacial mínimo
- Rivais à esquerda/direita no stereo conforme offset.
- Túnel = lowpass + reverb curto.

========================================
I. VISUAL 16-BIT DE REVISTA
========================================

I1. Carros
- Paleta 16–22 cores, dithering, highlight especular 1 pixel.
- Rodas giram com speed (já 4 rodas; adicionar rotação de pneu).
- Farol, lanternas de freio, seta de nitro.
- Sombra elíptica no asfalto, some no ar.

I2. Pista
- Zebras mais limpas, cracked asphalt no deserto.
- Molhado: reflection strip no centro (já há brilho; reforçar só à noite/chuva).
- Redutores / taco / capela em circuitos urbanos.

I3. Fundo
- Manter parallax V41.6. Não reabrir o bug do “prédios descendo”.
- Camada de nuvens lenta.
- Sol/lua alinhados ao timeOfDay.
- Plateia em arquibancada a cada 80 segmentos nas copas finais.

I4. Pós-processo (toggle)
- Scanlines 6–10%.
- Chromatic 0.6px nas bordas em alta speed.
- Vignette.
- Palette quantize opcional “SNES mode”.
- Pixel scale 2x/3x com integer scaling.

I5. Efeitos que ainda faltam (roadmap antigo)
- Faíscas em colisão forte.
- Poeira em pista seca.
- Neve melhor.
- Calor/deserto melhor.
- Túnel (escurece laterais + luz no fim).
- Neon City com janelas piscando.
- Placas exclusivas por campeonato.

========================================
J. CONTROLES E PLATAFORMA
========================================

J1. Teclado
- WASD + setas + Space/Shift nitro + P pausa + Esc menu + C câmera + M mapa.
- Remapeamento no settings.

J2. Toque
- Manter o esquema atual (segurar acelera, drag vira, up nitro, down freio).
- Adicionar modo “botões virtuais” opcional (acelera / freia / nitro / setas) para quem odeia drag.
- Deadzone e sensibilidade sliders.
- Hint some após 1ª corrida e nunca mais (flag no save), com botão para reexibir.

J3. Gamepad
- Standard Gamepad API.
- Stick esquerdo vira, R2 acelera, L2 freia, A/X nitro, Start pausa.
- Vibra: grass  (fraco), impacto (forte), nitro (contínuo baixo), zebra (staccato).

J4. PWA
- manifest.webmanifest + ícones 192/512.
- service worker só para shell (HTML/CSS/JS/fonte/og). NÃO cachear 999 JSONs pesados de uma vez.
- “Adicionar à tela inicial”.
- theme-color já existe.

J5. Performance
- Quality: LOW / MED / HIGH / CRT.
  - LOW: drawDistance 180, sem chuva 3 camadas, sem particles > 40.
  - HIGH: 300, weather full, particles 160.
- Dynamic resolution se dt > 22ms por 20 frames.
- Não alocar arrays no hot loop (particles pool).
- Object pool para decorações on-screen.
- Evitar JSON.parse de 999 fases de uma vez: carregar circuito sob demanda.

J6. Mobile
- landscape lock opcional via Fullscreen + overlay “vire o celular”.
- safe-area já existe; HUD não pode cobrir notch.
- 30/60 fps cap setting para não quentar o aparelho.
- Pause automático quando a aba some (`visibilitychange`) — já fade audio; garantir pause de verdade.

========================================
K. ACESSIBILIDADE E OPÇÕES
========================================

K1. Daltonismo: paletas protanopia/deuteranopia no HUD e rivais.
K2. Tamanho de HUD: S / M / L.
K3. Reduzir flash (raios/storm).
K4. Assistências: ABS visual, linha fantasma, auto-nitro off, auto-brake em curva hard (fácil).
K5. Dificuldade: Fácil / Normal / Herói / Lenda (IA, consumo, dano, gold time).
K6. Idioma: pt-BR completo agora; estrutura `strings` para en-US depois.
K7. Contraste do menu ≥ 4.5:1.
K8. Não depender só de cor: ícones + texto.

========================================
L. META, RETENÇÃO, “MAIS UMA CORRIDA”
========================================

L1. Contratos diários (3): “termine no top 5”, “1 pit perfeito”, “volte sem off-road”.
L2. Passe de copa cosmético (não pay-to-win): decalques.
L3. Streak de ouro: 3 ouros seguidos = pintura chrome.
L4. Almanaque de pistas: 999 silhuetas a desbloquear.
L5. Recorde por carro por pista (roadmap V35).
L6. Tela “Copas concluídas” com troféus.
L7. Premiação extra a cada 3 fases (já citado no roadmap — implementar de fato).
L8. Foto de pódio compartilhavel (canvas → PNG) para WhatsApp/X.

========================================
M. ARQUITETURA (PARA NÃO MORRER EM 1800 LINHAS)
========================================

M1. Continuar 1 `index.html` jogável (regra do projeto), MAS organizar o JS em blocos rotulados:
```
/* ==== 00 boot ==== */
/* ==== 01 save ==== */
/* ==== 02 cars & upgrades ==== */
/* ==== 03 audio ==== */
/* ==== 04 input ==== */
/* ==== 05 track ==== */
/* ==== 06 ai ==== */
/* ==== 07 physics ==== */
/* ==== 08 render background ==== */
/* ==== 09 render track ==== */
/* ==== 10 render sprites ==== */
/* ==== 11 weather ==== */
/* ==== 12 ui/hud ==== */
/* ==== 13 modes ==== */
/* ==== 14 loop ==== */
```
M2. Se Astra puder splitar em `/js/*.js` + index que funciona offline, melhor. O ZIP deve abrir no Chrome sem servidor SE possível. Se splitar, documentar “precisa de localhost”.
M3. NÃO carregar `fase_001.json` … `fase_999.json` todos. Usar `circuitos_999_v40.js` / catálogo + lazy.
M4. Feature flags no save: `career.flags.v43Juice = true` para rollback.
M5. Debug overlay (ativar com `~`): fps, segment, curve, fuel, ai target, draw calls.

========================================
N. SEO / PRODUTO / HOSTINGER
========================================

N1. Manter canonical `https://red-otter-848116.hostingersite.com/retroracer/`.
N2. Página `/retroracer/` com:
- título certo, descrição, OG JPG 1200×630.
- FAQ schema (como jogar, se precisa instalar, mobile).
- Screenshot real do jogo (não só OG).
- Botão Jogar agora acima da dobra.
N3. favicon + apple-touch-icon.
N4. sitemap.xml + robots.txt.
N5. Compactar og-retro-racer.jpg < 180 KB.
N6. Preload da fonte pixel.
N7. Não bloquear first paint com 999 tracks JSON.
N8. Crédito do autor permanece discreto no footer.

========================================
O. QUALIDADE, QA, BALANCE
========================================

O1. Checklist por versão (obrigatório)
- Abrir index no Chrome desktop.
- Correr 1 volta completa sem erro de console.
- Pit funciona.
- Pane seca / game over ainda existem.
- Save persiste após F5.
- Menu rola no iPhone retrato.
- 4 rodas visíveis na pista e na garagem.
- Áudio resume no gesto.
- Parallax urbano NÃO desce nas curvas.
- Fase 1, 27, 333, 666, 999 abrem.

O2. Balance pass (V52, mas ir medindo)
- Gold time = 5 * trackLength / (maxSpeed * goldSpeedFactor) já existe; auditar 20 pistas por copa.
- Consumo: 5 voltas + 1 pit confortável no Stallion stock.
- Banshee: 1 pit quase obrigatório.
- Goliath: 0 pit possível se limpo.
- Prêmio 1º = 2000 * level hoje explode em fase 400. Rebalancear para curva log:
  `prize1 = 1800 + 220 * Math.log2(level + 1) * cupTier`.

O3. Telemetria local (sem servidor obrigatório)
- `career.telemetry.lastRaces[]` com pos, time, pits, crashes.
- Export JSON no menu stats (botão).

O4. Nunca deixar console.error no ship.

========================================
P. IDEIAS “WOW” (usar com parcimônia)
========================================

P1. Replay do último setor com ghost do recorde.
P2. Câmera TV: corte para o rival preto quando ele passa.
P3. Comentarista procedural de 12 falas (texto + beep), sem voice real.
P4. Clima dinâmico na volta 3.
P5. Circuito espelho (reverse) nas copas pares.
P6. Safety car fake (yellow) raro.
P7. Pintura que muda com o dano (sujeira acumulada).
P8. Estrelas cadentes no Vale Nevado.
P9. Outdoor com “Clássicos dos Games” e recorde do player.
P10. Segredo: Konami-like no menu libera Kartz chrome.
P11. Foto finish pixel-perfect.
P12. Modo 2 jogadores hot-seat (mesmo teclado, reveza corrida).
P13. Split-screen só se fps HIGH desktop ≥ 56 — senão não.
P14. “Radio SNES” no menu: equalizer 8 barras.
P15. Encerramento após fase 999: rolagem de créditos + gallery das copas.

---

## 5. O QUE NÃO FAZER (ANTI-BRIEFING)

- Não portar para Unity/Godot agora.
- Não adicionar multiplayer online nesta fase (netcode mata o escopo).
- Não gerar 999 MP3. Procedural + JSON de notes já é o caminho.
- Não trocar o renderer por WebGL 3D real. O charme É o pseudo-3D.
- Não inflar partículas até dropar mobile.
- Não resetar o visual da skyline urbana (V41.3–V41.6 foram correções doloridas).
- Não esconder o pit atrás de regra nova sem tutorial.
- Não fazer paywall.
- Não copiar sprites comerciais da Nintendo/Sega. Tudo original.

---

## 6. PROMPT PRONTO PARA A ASTRA EXECUTAR (COPIAR)

```
Você é lead de gameplay + tech artist de Retrô Racer Championship.
Base aprovada: V42.2 (index.html + assets/tracks + audio + SEO Hostinger).
Leia este briefing inteiro e execute SOMENTE a versão V43 — Juice de corrida.

Escopo V43:
- Câmera com FOV por velocidade, lookahead, shake com decay.
- Nitro com flare, recarga por draft/volta limpa, speed lines perspectivos.
- Distinção de colisão leve vs forte + faíscas.
- Pit stop com barra, recusa se rápido, mensagem “reduza para abastecer”.
- SFX distinto 3, 2, 1, GO + jump start / perfect start.
- HUD: aviso de gasolina baixa, dano crítico pisca, seta de próxima curva.
- Settings mínimos: volume música/SFX, qualidade LOW/HIGH.
- Preservar SAVE_KEY, 999 pistas, física base, IA, parallax V41.6, SEO.

Entrega:
1) index.html completo jogável
2) README.md + CHANGELOG + docs/REGISTRO_MUDANCAS_V43.md + docs/CHECKLIST_TESTE_V43.md + manifesto JSON
3) lista do que foi preservado
4) não quebrar mobile scroll nem as 4 rodas

Se uma melhoria piorar a sensação de velocidade, desfaça.
```

Depois da V43, repita o prompt trocando o número e o escopo da tabela da seção 3.

---

## 7. CRITÉRIO FINAL “TRIPLO AAA”

O jogo só pode ser chamado de AAA neste contexto quando:

1. Um estranho entende os controles em 10 segundos.
2. A 1ª reta dá vontade de ligar o som.
3. Errar o pit dói, acertar o pit dá tesão de corrida.
4. O rival preto é odiado e respeitado.
5. Cada copa tem cara, cor e música.
6. O celular aguenta 30–60 fps no LOW sem esquentar absurdo.
7. A garagem dá motivo para farmar.
8. A fase 999 parece final de campeonato, não “mais um JSON”.
9. Nenhuma tela parece formulário web.
10. O autor aparece no crédito, o produto aparece na vitrine.

---

## 8. ORDEM DE ATAQUE SE A ASTRA SÓ PUDER FAZER UMA SESSÃO LONGA

Se for obrigada a entregar um único salto grande (não recomendado, mas realista):

**Pacote “V43-Lite AAA” (máximo impacto, mínimo risco):**
1. Juice de câmera + nitro + colisão + pit teatral + semáforo SFX.
2. Tela de seleção de copas (37 ícones) + preview de fita da pista.
3. 3 carros novos + 3 pinturas + upgrades visíveis na silhueta.
4. Clima: grip da chuva/neve + spray + raio.
5. Modo Time Trial + ghost local.
6. Settings + gamepad + quality LOW/HIGH.
7. HUD de curva + gasolina crítica + foto de chegada.
8. Rebalance da premiação logarítmica.
9. PWA manifest + ícones.
10. Docs e checklist.

Isso sozinho já muda a percepção de “projeto de canvas” para “jogo”.

---

Fim do briefing. Executar com disciplina de estúdio: uma versão, um ouro, um ZIP.
