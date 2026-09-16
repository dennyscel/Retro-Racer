# ANEXO A — BÍBLIA VISUAL, UI E CERIMÔNIA
## Retrô Racer Championship — Horizonte Zero
**Desenvolvido por Dennys Pavanelli**

> **Como usar:** cole este anexo inteiro junto com o PROMPT ÚNICO, ou mande depois dizendo:
> `ANEXO A — BÍBLIA VISUAL. Aplique integralmente nos ouros de identidade, UI e cerimônia.
> Nada aqui é sugestão. É especificação.`

---

# 0. LEI ZERO DA ARTE

**Tudo é desenhado em canvas 2D por código.** Zero PNG, zero sprite sheet, zero fonte
externa, zero vídeo, zero biblioteca. Toda a identidade sai de primitivas: retângulos,
paths, gradientes, ruído procedural e tipografia desenhada em vetor. Isso mantém o
shell abaixo de 350 KB, funciona offline, escala em qualquer tela e nunca tem problema
de licença. Se um efeito não puder ser feito em canvas 2D, ele não entra.

---

# 1. A IDEIA CENTRAL — "O HORIZONTE É A MARCA"

O jogo inteiro é organizado em torno de **uma linha de horizonte na altura 38% da tela**.

- Na corrida, é o ponto de fuga da pista.
- No menu, é onde o céu encontra o chão, com a estrada correndo embaixo.
- Nas premiações, é a linha onde o pódio se apoia.
- Nas transições, é ela que desliza e empurra a tela de fora.
- No logo, é o traço que corta o título.
- No final do jogo, é para onde o jogador vai embora.

**Regra dura:** nenhuma tela do jogo pode existir sem a linha de horizonte visível ou
implícita na altura `H*0.38`. É isso que faz 15 telas diferentes parecerem um produto só.

## 1.1 Os três pilares estéticos

**P1 — "Cartucho de 1993 que nunca existiu."**
Referência emocional: Top Gear, OutRun, Lotus Turbo Challenge, F-Zero. Mas com
polimento que aquela época não tinha: câmera com peso, pós-processamento, animação
com easing, hierarquia tipográfica moderna.

**P2 — Contraste de cadência.**
*Gameplay roda liso a 60 fps. UI anima em degraus de 16-bit.* Botões, painéis e
números se movem em 6 a 8 quadros discretos, como sprite animado, nunca com
interpolação contínua. Esse contraste é a assinatura do jogo — parece emulador
rodando um cartucho, mas dirige como jogo moderno.

**P3 — Colecionável.**
Copas são cartuchos. Pistas são selos. Pinturas são adesivos. Troféus ficam numa
estante. O jogador não está "progredindo numa barra", está **montando uma coleção**.

## 1.2 Cor é linguagem, não decoração

| Cor | Hex | Significado ÚNICO em todo o jogo |
|---|---|---|
| Amarelo-farol | `#FFCC00` | **Você.** Seu carro, sua linha no placar, seu recorde, botão primário |
| Magenta-sombra | `#FF3D9A` | **GHOST.** Rival, fantasma, desafio recebido, perigo elegante |
| Ciano-painel | `#14D8FF` | **Informação.** HUD neutro, dicas, tutorial, dados |
| Vermelho-alerta | `#E4402D` | **Perigo real.** Combustível crítico, dano crítico, eliminação |
| Verde-pista | `#29D862` | **Sucesso.** Recorde batido, meta cumprida, compra aprovada |
| Ouro | `#FFD65A` | **Conquista.** 1º lugar, troféu, copa, desbloqueio |
| Prata / Bronze | `#C8D2DC` / `#C87A3C` | 2º e 3º lugar |
| Preto-asfalto | `#0B0E14` | Fundo base |
| Azul-noite | `#131A2B` | Painéis, cartões |
| Branco-bandeira | `#F2F4F8` | Texto principal |

**Proibido** usar qualquer uma dessas cores fora do seu significado. Se o botão de
"voltar" for amarelo, o amarelo deixa de querer dizer "você" e a linguagem morre.

**Paletas de pista sobrepõem o fundo, nunca a HUD.** Cada uma das 999 pistas tem
`palette{}` própria no JSON — ela colore céu, montanha, grama e asfalto. A HUD
mantém as cores da tabela acima sempre, em qualquer pista, para não virar ilegível
num bioma claro.

---

# 2. TIPOGRAFIA — três famílias, desenhadas em código

## 2.1 `TITAN` — display, títulos, logo
Condensada, itálica 12°, extrabold, com extrusão 3D de 4 px para baixo-direita em
`#7A4A00` e contorno de 2 px em `#0B0E14`. Usada só em: logo, nome da copa, "1º LUGAR",
"ÚLTIMA VOLTA", "CAMPEÃO". Tamanho mínimo 32 px — se precisar ser menor, não é TITAN.
Gradiente cromado vertical: `#FFF9E0 → #FFCC00 → #B87800 → #FFE89A`, com uma faixa
branca de brilho que varre da esquerda para a direita a cada 6 s em 0,5 s.

## 2.2 `HUD7` — bitmap monoespaçada 7×9, para NÚMEROS
Velocidade, tempo, posição, dinheiro, contagem regressiva. Largura fixa por dígito
(sem tremer quando o número muda). Sem antialiasing — pixel duro. Isso é o que dá
leitura instantânea a 200 km/h e cheiro de 16-bit ao mesmo tempo.

## 2.3 `CORPO` — leitura, descrições, diálogo, créditos
Sans-serif limpa, peso 500/700, entrelinha 1,45. Tamanho mínimo 15 px no celular.
Aqui pode usar a fonte do sistema como fallback — é a única exceção da Lei Zero,
porque legibilidade de texto corrido vale mais que purismo.

## 2.4 Escala tipográfica (base 8 px)
`12 · 15 · 18 · 22 · 28 · 36 · 48 · 64 · 96`. Nada fora dessa escala.

---

# 3. SISTEMA DE LAYOUT E MOVIMENTO

- **Grade base 8 px.** Todo espaçamento é múltiplo de 8.
- **Zonas seguras:** respeitar `env(safe-area-inset-*)`. Nada interativo nos 24 px
  superiores (notch) nem nos 16 px inferiores (barra de gesto).
- **Zona do polegar:** todo botão que o jogador aperta com frequência fica nos
  **40% inferiores** da tela. O topo é só informação.
- **Alvo mínimo de toque: 48×48 px.** Sem exceção, nem em menu de ajustes.
- **Curvas de animação:** só três, nomeadas.
  `SNAP` = 120 ms, easeOutBack leve (entrada de painel)
  `SLIDE` = 220 ms, easeOutCubic (transição de tela)
  `STEP` = 6 quadros discretos (números subindo, HUD, barras)
- **Animação em degraus:** números de recompensa, barras de progresso e contadores
  nunca interpolam suave. Sobem em passos com um tique sonoro por passo.

## 3.1 Pós-processamento (ligável/desligável em Ajustes)
1. **Scanlines** — linhas escuras a 8% de opacidade, 1 px sim / 1 px não.
2. **Curvatura CRT** — distorção de barril sutil nas bordas (só em qualidade CRT).
3. **Vinheta** — escurecimento radial 18% nas bordas, aumenta para 32% acima de 240 km/h.
4. **Aberração cromática** — separação de 1 px dos canais R e B acima de 240 km/h,
   e de 3 px durante o nitro.
5. **Grão** — ruído de 4% animado a 12 fps (não a 60, senão vira chuvisco moderno).
6. **Bloom barato** — recorte das áreas acima de 85% de luminância, blur de caixa
   de 2 passes, somado por cima a 35%.

`prefers-reduced-motion` e o ajuste "Sem flash" desligam 3, 4 e 6 e reduzem toda a
tremida de câmera a 30%.

---

# 4. ABERTURA — OS PRIMEIROS 9 SEGUNDOS

Isto é o que separa "protótipo" de "produto". Roteiro com timecode exato.

### 4.1 Cartão do desenvolvedor — 0,0 s a 3,2 s

```
0,00  Tela preta absoluta. Silêncio total.
0,30  Um único par de FARÓIS aparece no ponto de fuga, no horizonte (H*0,38),
      a 6 px de distância um do outro. Som: motor distante, grave, com doppler.
0,30→1,60  Os faróis crescem em perspectiva e vêm em direção à câmera.
      O feixe de luz varre o chão, revelando asfalto em gradiente.
1,60  Os faróis PASSAM pela câmera e saem pelos lados. Flash branco de 2 quadros.
      Som: doppler passando (whoosh grave→agudo→grave) + rajada de vento.
1,62  Na queimadura de retina deixada pelo flash, o nome aparece QUEIMADO na tela,
      em branco quente que esfria para amarelo-farol:

              D E N N Y S   P A V A N E L L I

      Espaçamento de letra 0,22em. TITAN, 42 px, sem itálico aqui — sóbrio.
      Uma linha fina de 1 px atravessa o nome na altura do horizonte.
2,20  Abaixo, pequeno, em CORPO 14 px, cor #6E7A90:
              CLÁSSICOS DOS GAMES   ·   APRESENTA
2,90  O nome desvanece para preto com dissolve por pixels (não fade linear):
      blocos de 4 px somem em ordem aleatória ao longo de 300 ms.
3,20  Preto.
```

**Por que assim:** o logo do estúdio não é uma placa parada — é a primeira coisa que
ensina a linguagem do jogo (velocidade, horizonte, farol amarelo). Em 3 segundos o
jogador já sabe o que é esse jogo.

**Botão de pular:** qualquer toque depois de 0,8 s pula para o título. Nunca prender
o jogador. Na segunda abertura em diante, a sequência roda em 1,6 s (versão curta).

### 4.2 Cartucho entrando — 3,2 s a 4,0 s
Som seco de plástico encaixando + estalo. A tela dá um tranco vertical de 6 px.
Três quadros de estática de vídeo. É a piada interna que todo mundo de 30+ entende
na hora e todo mundo de 14 acha estiloso.

### 4.3 Revelação do título — 4,0 s a 9,0 s

```
4,00  O céu desenha de cima para baixo em bandas horizontais de 8 px
      (gradiente #1B1040 → #6B2A7A → #FF6B3D → #FFB84D), estilo pôr do sol OutRun.
4,40  O SOL sobe do horizonte: disco de 180 px em gradiente #FFE24B → #FF3D6B,
      cortado por 9 faixas horizontais vazadas que ficam mais finas em cima.
4,80  A LINHA DE HORIZONTE se desenha do centro para os lados, em 200 ms,
      em amarelo-farol brilhante que esfria para branco.
5,00  A ESTRADA se desenha do horizonte em direção à câmera, em perspectiva,
      e começa a rolar. Faixas laterais vermelho/branco alternando.
5,20  Silhuetas de paralaxe entram em 3 camadas (montanha, prédios/pinheiros, placas).
      A silhueta é SORTEADA entre os biomas das 999 pistas a cada abertura —
      o jogador vê um cenário diferente toda vez e entende sozinho que o jogo é grande.
5,60  O LOGO CAI de cima com peso, ultrapassa 12 px a posição final e volta (SNAP).
      No impacto: tremida de 8 px, poeira de pixels saindo dos dois lados,
      som de impacto grave + prato.
6,20  Varredura cromada percorre o logo em 500 ms.
6,60  Subtítulo aparece com dissolve por pixels:  H O R I Z O N T E   Z E R O
7,20  Rodapé, CORPO 12 px, #6E7A90:
        © Dennys Smaniotto Pavanelli   ·   v[versão]   ·   999 PISTAS   ·   37 COPAS
7,60  "TOQUE PARA COMEÇAR" começa a pulsar (opacidade 0,45→1,0 em 900 ms, senoidal).
9,00  Estado ocioso. A música-tema de menu já está tocando desde 4,0 s.
```

### 4.4 Logo — construção exata
Duas linhas empilhadas, alinhadas à esquerda com recuo progressivo:

```
    R E T R Ô
  R A C E R
CHAMPIONSHIP
```
- "RETRÔ" e "RACER": TITAN itálico, cromado, com extrusão.
- "CHAMPIONSHIP": HUD7 espaçada, 40% da altura, em `#14D8FF`, dentro de uma faixa
  escura com cantos cortados em 45°.
- Um traço amarelo de 3 px atravessa "RACER" de ponta a ponta — **é a linha do horizonte**.
- Três riscos de velocidade saem do lado direito do logo, comprimentos 40/28/16 px.

### 4.5 ATTRACT MODE — depois de 12 s parado
O jogo **se joga sozinho**. Reproduz um replay real gravado (inputs + seed), numa pista
sorteada, com HUD reduzida e a palavra `DEMO` piscando no canto superior direito a
cada 2 s. Troca de pista a cada 20 s. Qualquer toque volta ao título instantaneamente.

> Um jogo que tem attract mode parece um produto de prateleira. Um que não tem parece
> uma página web. Isso custa quase nada porque o sistema de replay já existe.

---

# 5. MENUS — ARQUITETURA E COMPORTAMENTO

## 5.1 O modelo mental: a garagem e o mural

Nada de lista vertical de botões cinzas. O menu principal é um **mural de cartões**
sobre o cenário vivo, como um quadro de avisos de box de corrida.

```
┌──────────────────────────────────────────────┐
│ ▸ NÍVEL 247/999   CR$ 128.400   ◈ 340 FICHAS │ ← barra fixa, 48 px, sempre presente
├──────────────────────────────────────────────┤
│                                              │
│        [céu + sol + horizonte + estrada      │ ← cenário vivo, rolando a 30% da
│         rolando, paralaxe em movimento]      │   velocidade de corrida
│                                              │
│  ╭────────────╮ ╭────────────╮ ╭──────────╮ │
│  │  CARREIRA  │ │   FENDA    │ │ GARAGEM  │ │ ← carrossel horizontal de cartões
│  │  Copa 10   │ │ roguelite  │ │ Banshee  │ │   grandes, arrastável com o polegar
│  │  12/27  ▰▰▱│ │  NOVO ●    │ │  ▰▰▰▱▱   │ │
│  ╰────────────╯ ╰────────────╯ ╰──────────╯ │
│         ● ○ ○ ○ ○ ○ ○                        │ ← indicador de página
│                                              │
│  [COPAS] [MODOS] [ALMANAQUE] [TROFÉUS] [⚙]  │ ← trilho inferior, zona do polegar
└──────────────────────────────────────────────┘
```

**Regras de comportamento:**
1. O cartão central é sempre o **próximo passo óbvio** do jogador — se ele está no
   meio de uma copa, é "CONTINUAR CARREIRA — Pista 13/27". O jogo nunca faz o jogador
   pensar onde clicar.
2. Arrastar horizontalmente com inércia. O cartão central fica 8% maior e com brilho;
   os laterais ficam a 70% de opacidade e levemente rotacionados (−4° e +4°).
3. **Botão físico de voltar / gesto de arrastar da borda esquerda** sempre volta um nível.
4. Todo menu rola verticalmente se o conteúdo não couber — nunca cortar conteúdo.
5. Nenhum menu tem mais de **6 escolhas visíveis por vez**.

## 5.2 Anatomia de um cartão

Cantos cortados em 45° (chanfro de 10 px) no canto superior direito e inferior esquerdo
— é a forma-assinatura do jogo e aparece em TODO painel, botão e moldura.

```
Moldura: 2 px sólida, cor = significado do cartão
Fundo:   #131A2B a 92% + 1 linha diagonal de hachura a 4% (textura)
Topo:    faixa de 28 px com o nome em HUD7, fundo na cor do significado, texto #0B0E14
Corpo:   ilustração procedural (silhueta da pista, carro, troféu)
Rodapé:  progresso em barra segmentada (não contínua — 27 blocos para 27 pistas)
Selo:    se tem novidade, um selo circular "NOVO" girando lentamente no canto
```

## 5.3 Transições entre telas — cada uma tem a sua

| De → Para | Transição | Duração |
|---|---|---|
| Título → Menu | Horizonte desce e empurra a tela | 320 ms |
| Menu → Submenu | Deslize lateral com paralaxe (fundo anda 30%) | 220 ms |
| Submenu → Menu | Deslize inverso | 220 ms |
| Qualquer → Pré-corrida | Bandeira quadriculada varre da direita | 400 ms |
| Pré-corrida → Corrida | Iris fechando no capô do carro, abre na pista | 600 ms |
| Corrida → Resultado | Congela, dessatura 60%, painel sobe de baixo | 500 ms |
| Resultado → Próxima | Cartão de pista vira como uma carta (flip 3D falso) | 450 ms |
| Qualquer → Cerimônia | Corte seco + flash branco + holofotes acendendo | 200 ms |

**Nunca usar fade preto genérico.** Fade preto é o som do silêncio: só serve para
morte, fim de jogo e créditos.

## 5.4 Micro-interações (o que faz parecer caro)
- **Toque em botão:** desce 2 px, 1 quadro de flash branco, clique seco de 30 ms,
  vibração de 8 ms.
- **Foco/seleção:** dois chevrons `▸ ◂` aparecem nas laterais e pulsam em degraus.
- **Desabilitado:** 35% de opacidade + hachura diagonal por cima. Ao tocar, treme
  3 px para os lados e mostra o motivo ("Precisa de 3 ouros seguidos").
- **Aparecimento de lista:** itens entram escalonados a cada 40 ms, de baixo para cima.
- **Rolagem:** com overscroll elástico e um tique sonoro a cada item que passa.
- **Compra confirmada:** o valor desce em degraus com tique por passo, a moeda pisca
  verde, e um selo "PAGO" carimba na diagonal.

## 5.5 Telas específicas

**COPAS (37 cartuchos).** Grade de 2 colunas de cartuchos de videogame com rótulo
impresso: nome da copa, bioma dominante, número, e uma faixa colorida por região.
Copa concluída ganha **selo dourado em relevo**. Copa bloqueada fica em cinza com
o rótulo em branco e um cadeado. Rolagem vertical suave, com a copa atual destacada
e já centralizada ao abrir.

**PISTAS (27 selos por copa).** Grade 3×9 de selos quadrados, cada um mostrando a
**silhueta real do traçado** desenhada a partir do `sections[]` do JSON da pista.
Pista com ouro = borda dourada. Com recorde pessoal = pequeno cronômetro no canto.
Não jogada = silhueta em contorno pontilhado. **Isso é o Almanaque 999 sendo
preenchido — é a coleção visível.**

**GARAGEM.** O carro no centro sobre um **prato giratório** com grade de chão em
perspectiva e luz de estúdio. Gira sozinho 8°/s; arrastar gira manualmente.
À esquerda, 6 barras de atributo segmentadas (velocidade, aceleração, grip, tanque,
blindagem, nitro) que **animam em degraus quando o jogador compara carros ou compra
upgrade** — verde para ganho, vermelho para perda, comparação fantasma do carro
anterior em cinza. Embaixo, abas: PINTURA · MELHORIAS · REPARO. O preço fica sempre
visível e o botão de compra é o maior elemento da tela.

**PRÉ-CORRIDA (briefing).** Cartão-postal da pista:
silhueta do traçado grande, nome, bioma, previsão do tempo com ícone animado,
horário do dia, `signature` e `dominantFeature` como duas frases curtas, seu recorde,
o tempo do ouro, os 3 prêmios, e um aviso de rival se GHOST ou REX estiverem no grid
(esse aviso vem em magenta com uma tarja atravessada). Botão gigante `CORRER`.

**AJUSTES.** Agrupado em cartões: IMAGEM · SOM · CONTROLE · ACESSIBILIDADE · DADOS.
Todo controle deslizante mostra o valor numérico e **aplica na hora**, com uma
prévia ao vivo (mexer no volume da música toca a música; mexer na sensibilidade
mostra um carrinho virando na pré-visualização).

---

# 6. HUD DE CORRIDA — a estrada é a estrela

## 6.1 Princípio
**Os 60% centrais da tela são sagrados.** Nenhum elemento de HUD entra ali, nunca.
Tudo abraça as bordas. Se um elemento precisa aparecer no centro (aviso de última
volta, foto-finish), ele aparece por no máximo 1,2 s e sai.

## 6.2 Mapa da tela

```
┌─────────────────────────────────────────────────┐
│ 3ª/23          VOLTA 2/5                 ⛽▮▮▮▯ │ ← 12% superior
│ ▰▰▰▰▱ combo  01:24.918              🔧▮▮▮▮▯ │
│                    ▲▲                    ⚡▮▮▮▮ │
│                  (chevron de curva)              │
│                                                  │
│              [ E S T R A D A ]                   │ ← 60% central intocável
│                                                  │
│                                                  │
│ ┌────────┐                              ╭──────╮ │
│ │  ◀  ▶  │      « rádio: fala do        │ 247  │ │ ← 28% inferior,
│ └────────┘        engenheiro »          │ km/h │ │   zona do polegar
│              [NITRO]  [FREIO]           ╰──────╯ │
└─────────────────────────────────────────────────┘
```

## 6.3 Elementos, um a um

**VELOCÍMETRO (inferior direito).** O elemento mais importante. HUD7 em 64 px,
amarelo-farol. Ao redor, um **arco analógico** de 200° que preenche conforme a
velocidade; acima de 85% da máxima o arco fica vermelho e pulsa. Durante o nitro,
os dígitos ganham contorno ciano e o arco estoura além do limite com faíscas.
Os dígitos têm largura fixa — nunca "pulam" quando trocam de casa.

**POSIÇÃO (superior esquerdo).** `3ª/23` em HUD7 36 px. Quando muda de posição:
o número **rola verticalmente** como painel de aeroporto, em 4 quadros, verde se
subiu, vermelho se caiu, com um tique. Em 1º lugar, o número fica dourado e ganha
um brilho pulsante lento.

**VOLTA E TEMPO (superior centro).** `VOLTA 2/5` pequeno em cima, tempo grande embaixo.
O tempo da volta atual fica branco; quando cruza o setor, mostra por 1,5 s o **delta
contra o seu recorde** em verde (`−0.412`) ou vermelho (`+0.180`), deslizando de baixo.

**BARRAS DE ESTADO (borda direita, verticais).** Combustível, dano e nitro, empilhadas,
14 px de largura, **segmentadas em 10 blocos** (nunca barra contínua — barra contínua
é linguagem de jogo moderno, bloco é linguagem de 16-bit).
- Combustível abaixo de 20%: pisca em vermelho a cada 1 s + ícone de bomba.
- Dano acima de 70%: barra treme e a borda da tela ganha um filete vermelho.
- Nitro cheio: a barra fica dourada e emite uma faísca a cada 2 s, chamando o jogador.

**CHEVRON DE CURVA (centro-superior, abaixo do tempo).** Uma a três setas indicando
direção e severidade da próxima curva, com a distância em metros. Uma seta = suave,
três = grampo. Cor: ciano normal, amarelo quando é hora de frear, vermelho se está
rápido demais. **Este é o elemento que mais melhora a jogabilidade de um pseudo-3D**,
porque a curva não é visível até o último instante.

**COMBO DE RISCO (esquerda, abaixo da posição).** Barra segmentada + multiplicador
`×3.4`. Sobe com quase-colisão, drift, vácuo e voo. Ao subir de nível, o número dá
um pulo com clarão. Ao zerar numa batida, estilhaça em pixels e cai da tela com
um som de vidro.

**RÁDIO (faixa inferior, acima dos controles).** Tarja preta translúcida com o
retrato falado do interlocutor em 24×24 px desenhado em pixel (engenheiro, GHOST, REX,
direção de prova) e o texto em CORPO 15 px, digitando letra a letra a 40 ms/caractere.
Cor da borda = quem está falando. Sai deslizando para baixo depois de 2,5 s.

**CONTROLES VIRTUAIS.** Só aparecem em toque. Volante: duas metades invisíveis da
tela inferior + um indicador visual translúcido que **acende onde o dedo está**.
Botões de nitro e freio: círculos de 72 px, translúcidos a 30%, sobem para 70% e
crescem 8% ao serem pressionados. Reposicionáveis nos Ajustes. Modo canhoto espelha tudo.

## 6.4 HUD dinâmica (a regra que torna tudo elegante)
Quando nada de importante acontece por 3 s, **toda a HUD desce para 40% de opacidade**
em 600 ms. Qualquer evento (mudança de posição, combustível baixo, curva forte, rival
colado, última volta) devolve 100% instantaneamente com um leve pulso de escala.
O jogador sente que a tela respira e enxerga mais estrada.

## 6.5 Estados especiais de tela

**ÚLTIMA VOLTA.** Banner em TITAN atravessa a tela da direita para a esquerda em 700 ms.
A borda inteira da tela ganha um filete amarelo pulsante. A música sobe meio tom.

**RIVAL COLADO (GHOST a menos de 2 carros).** Filete magenta na borda esquerda ou
direita, do lado por onde ele vem, pulsando na frequência da proximidade.

**NITRO.** FOV de 100 para 112 em 120 ms, linhas de velocidade saindo do ponto de fuga,
aberração cromática em 3 px, vinheta fecha 8%, chama procedural no escapamento,
rastro amarelo atrás do carro, motor sobe uma oitava.

**BATIDA FORTE.** Hitstop de 90 ms (tudo congela, só a HUD treme), flash branco de
2 quadros, tremida com decaimento exponencial, faíscas em leque, dois quadros de
estática, vibração de 40 ms.

**FOTO-FINISH (< 0,35 s de diferença).** Câmera lateral, 0,45× de velocidade por 2,5 s,
linha de chegada desenhada como uma fita branca real que o carro rompe, e um zoom
na roda dianteira no instante do cruzamento.

---

# 7. CUTSCENES E PASSAGENS DE FASE

Zero vídeo. Tudo canvas. Três formatos, usados em momentos diferentes.

## 7.1 CARTÃO DE COPA — abertura de cada uma das 37 copas
Três quadrinhos 16-bit desenhados por primitivas, entrando um a um a cada 900 ms,
com balões de fala digitando o texto. Seis linhas de roteiro por capítulo, no máximo.
Conta a história do Campeonato Horizonte Zero, a origem do GHOST, a traição do REX
e o que existe depois da pista 999. Cada quadrinho tem borda irregular de traço e
uma trama de meio-tom (bolinhas) como impressão de revista antiga.
Botão `PULAR` sempre visível no canto. Capítulo já visto nunca se repete sem pedido.

## 7.2 CARTÃO DE PISTA — antes de cada corrida (2,4 s)
```
0,0  Fundo escurece. Uma folha de papel-postal desliza de baixo com SLIDE.
0,3  A SILHUETA DO TRAÇADO se desenha sozinha, como caneta traçando,
     em 800 ms, seguindo os sections[] reais da pista.
0,9  Nome da pista carimba na diagonal com selo de borracha (som de carimbo).
1,2  Ícone do clima anima (chuva caindo, neblina passando, sol nascendo).
1,6  Bandeirinha do bioma + horário + "hairpin forte" como legenda manuscrita.
2,0  Selo de recorde pessoal aparece no canto, se houver.
2,4  Sai deslizando. Entra o flyover.
```

## 7.3 FLYOVER — 2 segundos de cinema por 0 byte de asset
A câmera percorre a pista real em altíssima velocidade, do fim para o começo,
a 4× a velocidade normal, com FOV alargado e desfoque de movimento por rastro.
Termina descendo suavemente até a posição do grid. **Usa a geometria que já existe** —
é a coisa mais barata e mais cinematográfica que o jogo pode ter.

## 7.4 GRID E LARGADA
```
0,0  Câmera na lateral do grid 2×2. Panorâmica lenta da última fila até a primeira.
0,8  Ao passar pelo GHOST: a câmera hesita 200 ms, o nome dele aparece em magenta
     com uma tarja, e o som abafa tudo menos o motor dele.
1,4  Câmera assenta atrás do seu carro. Nome do piloto e número.
1,8  Semáforo desce do topo. Três luzes vermelhas acendem uma a uma (600 ms cada),
     com o motor subindo de rotação a cada uma.
3,6  APAGA TUDO. Meio segundo de silêncio absoluto e imagem congelada.
4,1  VERDE. Flash, música entra com a batida no downbeat, todos arrancam.
     LARGADA PERFEITA (janela de 0,35 s): flash branco, "PERFEITA!" em TITAN dourado,
     +nitro instantâneo, som de acorde ascendente.
     QUEIMA A LARGADA: tarja vermelha, penalidade de 0,4 s, motor engasga.
```

## 7.5 CARREGAMENTO — nunca um spinner
Enquanto carrega, mostra **a etiqueta do cartucho daquela copa sendo impressa**:
o rótulo aparece linha por linha, de cima para baixo, como impressora matricial,
com som de impressora. Ao terminar, o rótulo "seca" e ganha brilho. Se carregar
rápido demais, mantém 400 ms mínimo — carregamento rápido demais parece bug.

---

# 8. PÓS-CORRIDA — PLACAR, PREMIAÇÃO E PRÓXIMA ETAPA

Esta é a sequência mais importante do jogo inteiro, porque é onde o jogador decide
se joga de novo. **Regra mestra: do cruzar a linha até estar correndo de novo,
no máximo 2 toques e 8 segundos.**

## 8.1 Linha 1 — A CHEGADA (0,0 s a 2,2 s)
```
0,0  Bandeira quadriculada varre a tela de cima. Som: multidão + buzinas.
0,2  Câmera troca para lateral, o carro passa em câmera lenta a 0,6×.
0,5  Chuva de confete em PIXELS (quadrados de 3 px) nas cores do seu carro,
     com física simples e rotação.
0,9  Se 1º: o carro faz um donut automático com fumaça; se pódio: empina a frente.
1,4  Cartaz gigante em TITAN desce e bate:  1º  L U G A R
     Com fanfarra procedural de 6 notas.
2,2  Transição para o placar.
```

## 8.2 Linha 2 — O PLACAR (2,2 s a 6,0 s)
Tabela de classificação dos 23 pilotos, **entrando de baixo para cima, uma linha a
cada 70 ms**, com um tique por linha (como placar mecânico virando).

```
┌─────────────────────────────────────────────┐
│  CLASSIFICAÇÃO FINAL · SERPENTINA VULCANO   │
├──┬──────────────┬───────────┬──────────────┤
│ 1│ ▮ VOCÊ       │ 04:38.210 │  ●●●  +25 pts│ ← linha amarela, 2 px de brilho,
│ 2│ ▮ GHOST      │ 04:38.544 │       +18 pts│   pulsando lentamente
│ 3│ ▮ REX        │ 04:41.002 │       +15 pts│ ← GHOST sempre em magenta
│ 4│ ▮ Valentina  │ 04:44.870 │       +12 pts│
│ …│              │           │              │
└──┴──────────────┴───────────┴──────────────┘
     MELHOR VOLTA: 00:54.118  (você) ★ RECORDE
     COMBO MÁXIMO: ×6.2        MÉDIA: 198 km/h
```

- Sua linha entra **por último**, com meio segundo de pausa dramática antes, e
  chega com um impacto e brilho.
- Se bateu recorde: o tempo pisca verde 3 vezes e um selo `RECORDE` carimba na diagonal.
- Diferença para o 1º/2º exibida em delta, não em tempo absoluto.
- **Toque em qualquer lugar acelera toda a animação para o fim.** Sempre. Em todas
  as sequências deste documento.

## 8.3 Linha 3 — A PREMIAÇÃO (6,0 s a 10,0 s)
Os números **sobem em degraus com um tique de moeda por passo**. Itemizado, linha
por linha, cada uma entrando com 250 ms de intervalo:

```
     PRÊMIO BASE          CR$   4.500  ▲
     BÔNUS DE OURO        CR$   2.250  ▲
     MELHOR VOLTA         CR$     800  ▲
     COMBO ×6.2           ◈      62    ▲
     CONTRATO: CLIMA      CR$   1.200  ▲
     SEGURO DE DANOS      CR$  −  340  ▼   ← perdas em vermelho, sempre mostradas
  ───────────────────────────────────────
     TOTAL                CR$   8.410
```
O TOTAL não sobe em degraus: ele **carimba** de uma vez, grande, dourado, com
impacto, tremida de 4 px e um acorde. Depois, a carteira no topo da tela sobe
até o novo valor em degraus, para o jogador VER o dinheiro entrando.

## 8.4 Linha 4 — PROGRESSÃO E DESBLOQUEIOS (10,0 s a 13,0 s)
- Barra segmentada da copa preenchendo `12/27 → 13/27`, um bloco de cada vez.
- Se desbloqueou algo, entra um **envelope lacrado** que gira e se abre, revelando:
  carro novo (com a silhueta e 3 atributos), pintura nova, pista nova, carta da
  Fenda, ou página do Almanaque. Som de selo rompendo. Máximo de 3 envelopes por vez;
  o resto fica guardado para a próxima tela.
- Se completou uma página do Almanaque: a silhueta da pista se preenche com cor
  e um "click" de encaixe de álbum de figurinhas.

## 8.5 Linha 5 — ANÚNCIO DA PRÓXIMA CORRIDA (13,0 s em diante)
Esta tela é o motor de retenção. Ela **nunca** é um menu — é um convite.

```
┌─────────────────────────────────────────────┐
│           P R Ó X I M A   E T A P A         │
│                                             │
│    [silhueta do traçado desenhando-se]      │
│                                             │
│        CANYON ESCARLATE  ·  13/27           │
│        ☀ ENTARDECER   ·   PNEU: MISTO       │
│        "descida cega e duas chicanes"       │
│                                             │
│        ⚠ GHOST ESTARÁ NO GRID               │ ← em magenta, se for o caso
│        ▸ recorde a bater: 01:02.440         │
│                                             │
│   ╭──────────────────────────────────────╮  │
│   │           C O R R E R   ▶             │  │ ← 30% da largura da tela,
│   ╰──────────────────────────────────────╯  │   amarelo sólido, impossível de errar
│                                             │
│      [ GARAGEM ]        [ MENU ]            │ ← secundários, pequenos, discretos
└─────────────────────────────────────────────┘
```

**Detalhe que muda a métrica:** se o carro está com dano acima de 40% ou upgrade
disponível e dinheiro suficiente, aparece um aviso discreto `🔧 sua garagem tem
novidade` — mas o botão CORRER continua sendo o maior. Nunca bloquear o caminho de
volta à pista.

---

# 9. CERIMÔNIAS — COPA, TEMPORADA E CAMPEONATO

## 9.1 CERIMÔNIA DE COPA (a cada 27 pistas — 37 vezes no jogo)
Momento grande, **10 segundos, pulável depois de 2 s**.

```
0,0   Corte seco para preto. Silêncio.
0,3   Holofotes acendem um a um (3 cones de luz volumétrica falsa, em gradiente).
0,8   Pódio de três degraus se desenha de baixo para cima, sobre a linha do horizonte.
1,2   Multidão em silhueta preenche o fundo, com movimento senoidal e flashes de
      câmera aleatórios (pontos brancos de 2 px piscando).
1,6   Os três carros sobem ao pódio, um por vez, do 3º ao 1º. O seu chega por último.
2,4   Confete e serpentina em pixels, dois canhões laterais.
2,8   O TROFÉU desce do alto, girando, com sombreamento cromado por gradiente animado.
3,4   Ele assenta nas mãos (o carro "levanta" a frente). Clarão dourado.
3,8   Banner: C A M P E Ã O   D A   C O P A  +  nome da copa em TITAN cromado.
4,4   Hino procedural de 8 compassos (a música da copa em versão orquestrada-16bit).
5,0   Painel de resumo da copa: 27 pistas, medalhas obtidas (ouro/prata/bronze em
      linha), tempo total, pontos, e o selo dourado sendo carimbado no cartucho da copa.
7,0   Recompensa da copa: dinheiro grande, fichas, e sempre UM item exclusivo
      (pintura, peça, ou carta lendária) revelado em envelope dourado.
8,5   "CERTIFICADO" gerado: uma imagem quadrada, montada no canvas, com o nome do
      jogador, a copa, o troféu, a data e o código de sombra da melhor volta.
      Botão COMPARTILHAR ao lado. Isso vira post.
10,0  Volta ao mapa de copas, com a próxima copa se destravando na sua frente
      (o cadeado estilhaça em pixels).
```

## 9.2 FIM DE TEMPORADA (a cada 28 dias)
Visual diferente da copa, para não cansar: em vez de pódio, uma **tabela de
classificação da temporada** que sobe rolando como créditos, com sua posição
destacada, seguida de:
- Faixa de recompensas do passe, com cada nível abrindo em sequência rápida.
- Estatísticas da temporada: km rodados, ultrapassagens, tempo no vácuo, batidas,
  combo máximo, pista favorita — apresentadas como um "retrospecto" com números
  grandes entrando um a um.
- O modificador da nova temporada é revelado no fim, como um trailer de 3 s.

## 9.3 CAMPEONATO / RIVALIDADE COM O GHOST
O GHOST lidera a classificação do campeonato o ano inteiro. Depois de cada corrida,
a tabela de pontos aparece por 2 s no canto, com a distância de pontos para ele.
Isso cria o arco: **ele está sempre à sua frente até a última corrida.** A vitória
do campeonato não é ganhar uma corrida, é tirar 2 pontos dele na 27ª.

---

# 10. DERROTA E FIM DE JOGO

## 10.1 Não existe "GAME OVER" grosseiro
Três causas, três apresentações, todas com o mesmo fluxo rápido.

```
SEM COMBUSTÍVEL  → o motor morre, o som some por camadas (primeiro o agudo,
                    depois o médio, depois o grave), o carro desliza em silêncio.
                    Rádio: "Acabou a gasolina, piloto. A gente conversa no box."
CARRO DESTRUÍDO  → batida final em hitstop longo (200 ms), fumaça preta,
                    a tela racha com linhas brancas em vidro quebrado, estática.
ELIMINADO        → bandeira preta, a tela desaturada, sua posição riscada na tabela.
```

Em todos: a imagem **dessatura para sépia** e depois faz o **desligamento de CRT**
(a imagem colapsa numa linha horizontal, depois num ponto branco que some) em 500 ms.
Isso é muito melhor do que um fade preto e reforça a identidade.

Cartão que aparece depois, sóbrio e curto:
```
       NÃO DESTA VEZ
   Você estava em 5º, a 3,2 s do pódio.
   Melhor volta: 01:02.980 (seu 2º melhor)

   ╭────────────────────────╮
   │   T E N T A R  DE NOVO │  ← primário, gigante
   ╰────────────────────────╯
     [ GARAGEM ]   [ MENU ]
```
**Regra crítica de UX:** "Tentar de novo" reinicia em menos de 1,2 s, sem recarregar
nada, sem flyover, sem cartão de pista, direto no grid. A fricção depois da derrota
é o que mata retenção.

## 10.2 FIM DA FENDA (roguelite)
Diferente: mostra a **run inteira em retrospecto** — as 5 pistas em linha, onde
morreu, quais cartas pegou, o combo máximo, e a recompensa proporcional ao quanto
avançou. Nunca sai de mãos vazias. Botão `NOVA RUN` com uma seed nova já visível.

---

# 11. ZERAR O JOGO — A PISTA 999

Este é o momento que as pessoas vão filmar e postar. Ele precisa ser estranho e
memorável, não só "grande".

## 11.1 A corrida final — "HORIZONTE ZERO"
```
Voltas 1–2   Pista normal, 22 rivais, tempestade forte, noite fechada.
Volta 3      A chuva para de repente. As nuvens abrem. Começa a clarear.
             Um a um, os rivais vão ficando para trás e SOMEM da pista —
             não são ultrapassados, eles simplesmente deixam de existir,
             dissolvendo em pixels. A HUD deixa de mostrar posição.
Volta 4      A decoração lateral desaparece: árvores, placas, prédios.
             Depois some a grama. Sobra a estrada suspensa no branco.
             A música perde instrumentos a cada 8 compassos, até sobrar
             só um arpejo e uma linha de baixo.
Volta 5      Só você e o GHOST, lado a lado, no branco absoluto.
             Ele não te bloqueia. Ele corre junto. O rádio fica mudo.
             Nos últimos 300 m, ele desacelera de propósito e fica atrás.
             Você cruza a linha sozinho.
```

## 11.2 A dissolução do GHOST
O carro preto e dourado do GHOST se desmonta em pixels que **voam até o seu carro**
e são absorvidos. Seu carro ganha um contorno dourado permanente. Uma única fala,
em texto branco sobre o branco (contorno fino), sem voz:

> `— Eu só existia porque você ainda não era rápido o bastante.`

## 11.3 OS CRÉDITOS JOGÁVEIS  ★ o momento que vira vídeo no TikTok
A corrida **não termina**. A câmera se afasta, o jogo entra em velocidade baixa e
constante, e você continua dirigindo, para sempre, numa estrada reta em céu branco
que vai virando pôr do sol, depois noite estrelada, depois amanhecer.

Os créditos aparecem **em outdoors à beira da pista**, passando por você, um a um,
na perspectiva real do jogo. O jogador dirige através dos próprios créditos.

```
outdoor  1: RETRÔ RACER CHAMPIONSHIP
outdoor  2: HORIZONTE ZERO
outdoor  3: DIREÇÃO, PROGRAMAÇÃO, DESIGN
outdoor  4: DENNYS PAVANELLI
outdoor  5: MOTOR GRÁFICO PSEUDO-3D
outdoor  6: DENNYS PAVANELLI
outdoor  7: 999 CIRCUITOS
outdoor  8: DENNYS PAVANELLI
outdoor  9: 999 TRILHAS PROCEDURAIS 16-BIT
outdoor 10: DENNYS PAVANELLI
   …
último  : OBRIGADO POR DIRIGIR ATÉ AQUI.
```
A repetição do nome é intencional e é uma piada de carinho: mostra que foi uma
pessoa só que fez tudo. Isso é história, e história é marketing.

Depois do último outdoor, o horizonte à frente fica dourado, a tela satura devagar,
e o jogo simplesmente continua rodando em silêncio até o jogador tocar a tela.
**Sem "FIM". Sem tela preta.** Ele sai quando quiser.

## 11.4 O que acontece depois
Ao tocar, aparece o **CERTIFICADO FINAL**, montado em canvas e compartilhável:
```
   ┌─────────────────────────────────────┐
   │  ★ CAMPEÃO DO HORIZONTE ZERO ★      │
   │                                     │
   │  [silhueta do carro com aura dourada]│
   │                                     │
   │  999 pistas  ·  37 copas  ·  1.204 corridas
   │  Tempo total ao volante: 61h 22min   │
   │  Melhor volta da carreira: 00:48.112 │
   │  Ultrapassagens: 14.882              │
   │  Vitórias sobre o GHOST: 211         │
   │                                     │
   │  código de sombra: RR9-ZERO-0001     │
   │  Retrô Racer Championship            │
   │  por Dennys Pavanelli                │
   └─────────────────────────────────────┘
```
E desbloqueia, de uma vez:
- **Eclipse** (o carro lendário).
- **MODO HORIZONTE** — estrada procedural infinita, sem fim, sem rivais, só você,
  a música e a distância. É o modo de relaxar que as pessoas deixam ligado.
- **NOVA CARREIRA+** — as 999 pistas de novo, com o GHOST calibrado no seu nível
  final, clima mais duro e prêmios dobrados.
- **Troféu 37/37** e a estante de troféus completa, com iluminação especial.
- Uma pintura exclusiva: **branca com filete dourado**, chamada "Horizonte".

---

# 12. LISTA DO QUE NUNCA FAZER

1. Nunca usar fonte do sistema em título, número de HUD ou botão principal.
2. Nunca usar um spinner de carregamento circular.
3. Nunca usar modal branco genérico com cantos arredondados de 12 px — é a cara
   de todo site do mundo. Aqui é chanfro de 45° e fundo azul-noite.
4. Nunca usar gradiente roxo-para-azul diagonal. É o visual padrão de coisa feita
   por IA e queima a credibilidade na hora.
5. Nunca centralizar botão importante fora da zona do polegar.
6. Nunca fazer uma animação que não possa ser pulada com um toque.
7. Nunca mostrar uma recompensa sem animar o número subindo.
8. Nunca deixar o jogador sem saber qual é o próximo passo.
9. Nunca colocar HUD nos 60% centrais.
10. Nunca usar barra de progresso contínua onde cabe barra segmentada.
11. Nunca repetir a mesma transição entre telas diferentes.
12. Nunca punir visualmente quem usa recursos de acessibilidade.

---

# 13. ACESSIBILIDADE VISUAL (obrigatória, não opcional)

- **3 paletas para daltonismo** (protanopia, deuteranopia, tritanopia): trocam os
  pares problemáticos e adicionam **forma** como redundância — o combustível crítico
  não fica só vermelho, ganha um ícone triangular; o GHOST não é só magenta, tem
  padrão xadrez na barra.
- **Contraste mínimo 4.5:1** em todo texto de interface sobre o seu fundo.
- **Modo sem flash:** remove todo flash de mais de 3 Hz, reduz tremida a 30%,
  remove o grão e a estática.
- **Tamanho de HUD em 3 níveis** (P/M/G), já existente — expandir para incluir
  a fonte dos menus.
- **Legendas para tudo que é informação sonora** (rádio, avisos de pit, alertas).
- **Modo canhoto** espelha os controles virtuais.
- **Assistência de direção em 4 níveis**, de "nenhuma" a "só vire", e — regra de ouro —
  **nenhum nível reduz a recompensa**. Quem precisa de ajuda não paga por isso.

---

# 14. CHECKLIST DE ACEITE VISUAL

Um ciclo de arte só fecha quando todas estas forem verdadeiras:

- [ ] Dá para reconhecer o jogo em **1 screenshot mudo**, sem o logo aparecer.
- [ ] A linha de horizonte está na mesma altura em todas as telas.
- [ ] Nenhuma cor é usada fora do seu significado da tabela 1.2.
- [ ] Todo número que muda anima em degraus com som.
- [ ] Toda animação pode ser pulada com um toque.
- [ ] Todo botão principal está na zona do polegar e tem no mínimo 48 px.
- [ ] O caminho "terminou a corrida → está correndo de novo" leva ≤ 2 toques.
- [ ] Nenhum elemento de HUD invade os 60% centrais.
- [ ] O jogo tem attract mode e ele mostra uma pista diferente a cada 20 s.
- [ ] O nome **DENNYS PAVANELLI** aparece na abertura, nos créditos e no certificado.
- [ ] Em modo "sem flash" o jogo continua bonito, não só tolerável.
- [ ] A tela de fim de jogo devolve o jogador à pista em menos de 1,2 s.
