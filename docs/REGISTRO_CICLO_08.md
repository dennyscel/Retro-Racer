# REGISTRO — CICLO 08 — COMBO DE RISCO

## Diagnóstico
Dirigir bonito ainda não tinha valor próprio. Tempo final e posição premiavam eficiência, mas quase-colisão, drift, draft, zebra e relevo não formavam uma linguagem de perícia.

## Mini-GDD
O jogador deve perceber em menos de 5 segundos que arriscar com controle gera um multiplicador. Quase-colisão, drift sustentado, vácuo, tempo no ar e corte limpo de zebra somam RISCO. A batida quebra a cadeia para x0.0. O placar acumulado converte em FICHAS no fim da prova, com teto por corrida. FICHAS jamais compram performance: nesta versão compram apenas rastros de nitro cosméticos.

## Implementação
- HUD RISCO com multiplicador, score e evento atual;
- quase-colisão detectada na passagem real pelo rival;
- drift/draft/airtime sustentados pontuam em janelas, não por frame;
- zebra só pontua quando o carro ainda está dentro da pista;
- colisão zera a cadeia/multiplicador, preservando score já ganho;
- conversão `floor(score/900)`, teto 75 FICHAS por corrida;
- moeda `career.fichas` separada de CR$;
- quatro rastros cosméticos: Clássico, Ion Cyan, Neon Magenta e Ouro Horizonte;
- estatísticas de melhor combo, risco acumulado e fichas;
- save v59→v60 com merge completo.

## Evidência de QA
- QUASE, ZEBRA, VÁCUO, DRIFT e NO AR testados individualmente;
- batida: multiplicador x1.75 → x0.0 e chainScore → 0;
- corrida sintética: 33 FICHAS; CR$ inalterado;
- compra de Ion Cyan descontou apenas FICHAS;
- save v59→v60 preservou fase 77, CR$ 54.321 e carro;
- 29 módulos JS válidos, nenhum >400 linhas;
- 196 IDs HTML únicos; zero asset local faltando;
- 999 pistas + sentinelas 1/27/333/666/999;
- determinismo físico 3×: PASS;
- 0 `Math.random()` em `src/`;
- shell 83,4 KB gzip;
- Chromium ~59,88 FPS, zero pageerror/console.error.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,7/10:** agora o carro convida a brincar com o limite, não só a obedecer a linha.
- **VC mobile — 9,0/10:** FICHAS criam sink cosmético limpo, mas ainda falta um modo curto que transforme essa perícia em hábito diário.
- **Jogador de 14 anos — 9,6/10:** quase bater e ver o x subir dá vontade de tentar de novo na hora.

**Crítica mais dura:** o jogo ganhou “jogada bonita”, mas ainda falta uma sessão curta com tensão crescente, escolhas ruins de propósito e morte de run — o loop de nove minutos da Fenda.
