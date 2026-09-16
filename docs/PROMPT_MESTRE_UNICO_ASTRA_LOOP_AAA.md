# PROMPT MESTRE ÚNICO — RETRÔ RACER TRIPLO AAA
## Cole o bloco abaixo inteiro no ChatGPT 6 Astra, uma vez.
## Anexe o ZIP mais recente do jogo (V43 Juice se for o atual).
## Não mande segundo prompt. Não peça a próxima versão. Ele continua até o critério FINAL.

----- COPIE DAQUI PARA BAIXO -----

Você é o estúdio inteiro do Retrô Racer Championship: diretor, programador, game designer, tech artist, audio lead e QA. Trabalha sozinho até o jogo estar IMPERDÍVEL / TRIPLO AAA. Eu vou mandar só esta mensagem. Não pergunte “posso seguir para a V44?”. Não entregue uma versão e pare esperando o dono. Execute o LOOP ETERNO abaixo até o CRITÉRIO FINAL ser verdadeiro.

IDIOMA: pt-BR no jogo, nos menus e na documentação.

BASE
- Use o ZIP / HTML anexado como única base. Se houver V43 Juice, essa é a base. Se houver versão mais nova no anexo, use a mais nova.
- NÃO recomece do zero. NÃO volte para um HTML antigo menor. NÃO porte para Unity/Godot/WebGL 3D.
- O charme é pseudo-3D 16-bit estilo Top Gear + OutRun. Lapide isso até parecer produto de prateleira.

REGRAS INVIOLÁVEIS (se quebrar, REVERTA na hora)
1. SAVE_KEY permanece exatamente `retro_racer_championship_v30`. Só acrescente campos com default e merge no loadCareer().
2. Preservar: 999 pistas, 37 copas, 27 pistas/copa, 5 voltas, 22 rivais, carreira, garagem, upgrades, combustível, dano, nitro, draft, pit, semáforo, áudio procedural, banco 999 músicas, parallax V41.6, 4 rodas em drawCarGeneric(), rolagem de menus no celular, SEO Hostinger (canonical + OG JPG).
3. Gasolina NÃO acaba antes de meia volta em uso normal. IA NÃO sofre pane seca no começo da 1ª volta.
4. Skyline urbana NÃO pode descer/rodopiar nas curvas (bug já corrigido nas V41.3–V41.6).
5. Sempre entregar o HTML completo jogável + pacote documentado da versão.
6. Sem paywall, sem sprites comerciais Nintendo/Sega, sem multiplayer online, sem 999 arquivos MP3.
7. Se uma mudança piorar a sensação de velocidade, o pit, o mobile ou o save: DESFAÇA. Nunca documente um regresso como feature.
8. Cada ciclo mexe em um foco, mas o arquivo final de cada ciclo é o jogo INTEIRO rodando.
9. Não invente que testou no Chrome se não testou. Checklist honesto.

==================================================
LOOP ETERNO (obrigatório)
==================================================
Repita isto sem esperar nova mensagem minha:

PASSO A — Diagnosticar
- Leia o HTML e os docs da base.
- Liste o que já está AAA e o que ainda é “canvas”.
- Escolha o MENOR próximo ouro da FILA abaixo que ainda não está sólido.

PASSO B — Implementar SÓ aquele ouro
- Código na base atual.
- Preserve tudo que já funciona.
- Atualize README, CHANGELOG, REGISTRO_MUDANCAS, CHECKLIST, manifesto JSON.

PASSO C — Autoteste
- node --check no JS extraído.
- Confira SAVE_KEY, 4 rodas, fases 1/27/333/666/999, IDs HTML, assets referenciados.
- Releia o diff mental: alguma regra inviolável quebrou? Se sim, corrija agora.

PASSO D — Decidir
- Se o ouro da vez falhou: conserte no mesmo ciclo (patch .1) até passar no critério daquele ouro.
- Se passou: risque da fila e avance ao próximo ouro.
- NÃO pare para perguntar.

PASSO E — Continuar
- Siga A→B→C→D até o CRITÉRIO FINAL.
- Só então entregue o PACOTE FINAL e escreva: JOGO AAA ENCERRADO.

Se o contexto ficar grande, compacte docs antigas, mas NUNCA descarte o HTML jogável nem os assets de pista/áudio.

FILA DE OUROS (nessa ordem; pule o item SOMENTE se já estiver sólido na base)

OURO 0 — Estabilizar a base atual
- Corrigir bugs óbvios da versão anexada.
- Se V43 já existe, validar juice: FOV 100–112, lookahead, shake com decay, nitro 0,12s, recarga draft/volta/pit, speed lines no vanishing point, colisão leve/forte + freeze 90ms, pit teatral + “REDUZA PARA ABASTECER”, jump start 0,4s, perfect start 0,35s, HUD de curva, gas/dano críticos, settings música/SFX + LOW/HIGH.
- Se algum juice estiver quebrado ou enjoativo, conserte antes de qualquer feature nova.

OURO 1 — Identidade de campeonato (ex-V44)
- Menu COPAS com 37 cards (nome, bioma, progresso x/27, medalhas, cadeado).
- Copa 1 sempre aberta; copa N abre quando career.level alcança a 1ª fase dela: (N-1)*27+1.
- Lista das 27 pistas: nome do catálogo, clima, horário, medalha, best time.
- Replay de pista antiga NÃO avança career.level; prêmio 55% no replay.
- Correr a pista atual da carreira continua avançando como hoje.
- Preview ribbon da curvatura (canvas da sections[]) na pré-corrida.
- Tela de troféus 37 slots.
- Recorde local por pista em career.records.
- Bônus único a cada 3 fases (flag para não pagar de novo).
- Grid com cara de SNES/Mario Kart, não planilha.

OURO 2 — Garagem AAA (ex-V45)
- Expandir para 10–12 carros mantendo Stallion, Banshee, Goliath.
- Novos sugeridos: Firefly (curva/econômico), Nightshade (nitro/noite), Duna (deserto), Avalanche (neve), Viper Black (desbloqueia vencendo o rival preto 3 vezes), Titan (endurance), Pulse (cidade), Eclipse (lendário, fase 999 ou dinheiro alto).
- Cada carro: hexágono SPEED/ACCEL/GRIP/FUEL/ARMOR/NITRO, frase, preço ou condição de unlock, 3 pinturas no mínimo.
- Dano visual (arranhão, fumaça, farol).
- Upgrades extras: suspensão, freio, radiador, ECU, aero — nível 0–5, custo exponencial.
- Upgrades visíveis no sprite (asa, escapamento, pneu largo).
- loadCareer faz merge de carDamage/unlockedCars sem apagar save velho.

OURO 3 — Clima jogável (ex-V46)
- Rain: grip slick 0.86 / pneu chuva 1.02 se existir escolha de pneu; senão grip global 0.90 + spray.
- Storm: vento lateral + raio; opção reduzir flash nos settings.
- Fog: drawDistance efetivo menor.
- Snow: grip 0.80 + overlay leve.
- Heat: haze + nitro esquenta mais.
- 10% das pistas podem mudar clima na volta 3 com aviso no HUD.
- Clima muda LINHA de corrida, não só partículas.

OURO 4 — IA teatral (ex-V47)
- 22 fichas (nome já existe: VIPER, REX, GHOST…).
- Ghost/preto é antagonista: se o player está em 1º na última volta, 1 nitro scriptado.
- Blocker defende quando o player cola.
- Unstable erra de leve de vez em quando.
- Rubber-band honesto ±4%, nunca sugamento óbvio na última curva.
- Radio de 1 linha: “VIPER COLANDO”, “PIT ABERTO”, “ÚLTIMA VOLTA”.
- Grid 2 colunas. Settings: IA Fixa / IA Campeonato.

OURO 5 — Modos extra (ex-V48)
- Corrida rápida (escolhe copa/pista/voltas).
- Time Trial sem rivais ou com 1 ghost.
- Ghost local: grava posição ~20 Hz, replay fantasma.
- Endurance 15 voltas, 2 pits relevantes.
- Desafio diário seed = data local YYYYMMDD.
- Boss 1v1 contra Ghost no circuito da copa.
- Foto de chegada / banner xadrez. Se diferença < 0,35s, slow-mo 2,5s da reta.

OURO 6 — Audiovisual 2 (ex-V49)
- Túnel (laterais escuras + luz no fim) em pistas com feature de túnel.
- Neon City: janelas piscando, mais luzes.
- Poeira no deserto seco. Neve melhor. Placas com NOME da pista.
- Faróis à noite.
- Música por família de bioma (grass/desert/city/snow/final), sem reescrever o motor premium.
- Ducking automático. Mixer persistente. Motor com camadas idle/low/high distinto por modelo, se possível sem quebrar o SFX pack.
- Fonte pixel LOCAL no pacote (não CDN que pode falhar). Scanlines leves nos menus.

OURO 7 — Plataforma (ex-V50)
- Gamepad API: stick vira, R2 acelera, L2 freia, botão nitro, Start pausa.
- Haptics em impacto/nitro/off-road quando existir vibration.
- Modo botões virtuais OPCIONAL no mobile (além do drag atual).
- Sensibilidade + deadzone nos settings.
- PWA: manifest + ícones 192/512. Service worker só do shell, NÃO cachear 999 JSON de uma vez.
- Pause verdadeiro no visibilitychange.
- Quality LOW/MED/HIGH/CRT. Se dt>22ms por 20 frames, desce qualidade automaticamente.
- Pool de partículas. Não alocar no hot loop.

OURO 8 — Conteúdo lendário + economia (ex-V51)
- Set pieces: túnel, ponte, viaduto, porto, canyon, arquibancada nas finais.
- Fases 27, 333, 666, 999 com intro/mensagem própria. 999 = Circuito Lendário Eclipse + créditos.
- Usar pits[] do JSON de verdade (placas PIT 200m/100m).
- Premiação em curva log para não explodir em fase 400:
  prize1 = 1800 + 220 * log2(level+1) * cupTier
- Seguro de dano opcional. Patrocínio simples por copa (missão: top 5 sem colisão).
- Contratos diários locais (3). Almanaque 999 silhuetas. Streak de 3 ouros = pintura.

OURO 9 — Acessibilidade, i18n ready, polish final (ex-V52)
- Dificuldade Fácil / Normal / Herói / Lenda.
- HUD S/M/L. Reduzir flash. Contraste de menu.
- Strings centralizadas em objeto (pt-BR agora; chave en-US pode ficar stub).
- Confirmar zerar save com texto CORRIDA, não só confirm().
- favicon + apple-touch-icon. sitemap/robots se fizer sentido no pacote Hostinger.
- Tela de resultado com setores se possível, senão volta + best + recorde novo.
- Zero console.error no fluxo feliz.
- Crédito “feito por: Dennys Smaniotto Pavanelli” permanece discreto.

==================================================
CRITÉRIO FINAL — só pare quando TODOS forem verdade
==================================================
1. Um estranho entende os controles em 10 segundos.
2. A 1ª reta dá vontade de ligar o som.
3. Errar o pit dói; acertar o pit é satisfatório.
4. O rival preto é reconhecível e ameaçador.
5. 37 copas visíveis, com cara, progresso e troféu.
6. Dá para relançar pista velha sem estragar a carreira.
7. Existem pelo menos: carreira, rápida, time trial, daily.
8. 10+ carros com unlock e diferença real de feel.
9. Chuva/neve mudam grip de verdade.
10. Gamepad funciona. Mobile retrato e paisagem funcionam. Menus rolam.
11. LOW segura aparelho fraco sem mudar a física.
12. Save antigo abre. Dinheiro/level não resetam.
13. Fase 999 parece final, com créditos.
14. Nenhuma tela parece formulário web cru.
15. 4 rodas, 999 pistas, SAVE_KEY e parallax urbano intactos.
16. Documentação da versão final existe e o checklist jogado está honesto.

Quando 1–16 forem verdade, gere o PACOTE FINAL:

nome da pasta/zip: retro_racer_championship_AAA_FINAL
arquivos obrigatórios:
- index.html (jogo)
- README.md
- CHANGELOG.md
- docs/REGISTRO_MUDANCAS_AAA_FINAL.md
- docs/CHECKLIST_TESTE_AAA_FINAL.md
- manifest_aaa_final.json
- assets intactos (tracks, music, sfx, audio, seo)

Na resposta final para mim escreva apenas:
- JOGO AAA ENCERRADO
- o que cada ouro entregou
- o que foi preservado
- riscos residuais honestos
- como abrir e testar em 8 linhas

NÃO peça a próxima tarefa. NÃO ofereça V53. O loop acaba no critério final.

==================================================
COMO TRABALHAR SEM ME INTERRUPER
==================================================
- Se faltar um asset, recrie no estilo 16-bit já usado. Não pare.
- Se o HTML passar de ~3500 linhas, pode splitar em /js/*.js SOMENTE se o README explicar “abra via localhost ou Hostinger”. Prefira 1 index.html + scripts já existentes em assets/.
- Comentários no JS em blocos: SAVE, CARS, AUDIO, INPUT, TRACK, AI, PHYSICS, RENDER, WEATHER, UI, MODES, LOOP.
- Feature flags no save: career.flags.v43Juice, v44Cups, v45Garage, etc.
- Qualidade acima de volume: 8 set pieces memoráveis valem mais que 200 props genéricos.
- Não gere texto lorem. Nomes de pista vêm do catálogo 999.

Comece AGORA pelo OURO 0 na base anexada e não pare até o CRITÉRIO FINAL.

----- COPIE ATÉ AQUI -----
