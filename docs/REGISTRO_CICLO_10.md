# REGISTRO — CICLO 10 — TEMPORADA HORIZONTE

## Diagnóstico
A Fenda criou sessão curta e retenção, mas o calendário ainda era solitário: dois jogadores não tinham um “hoje” em comum sem servidor.

## Mini-GDD
Temporadas duram 28 dias e são calculadas só pela data. Todos recebem o mesmo modificador, a mesma pista destaque e o mesmo gauntlet semanal. A diária premia apenas a melhoria do melhor resultado, evitando farm. O gauntlet tem 3 pistas/1 volta e só paga XP no fechamento. Um passe gratuito de 40 níveis entrega FICHAS automaticamente. Códigos de Sombra da pista do dia alimentam um placar local compartilhável.

## Implementação
- `src/meta/season.js` com calendário determinístico de 28 dias;
- 8 modificadores sazonais que afetam apenas provas de temporada;
- pista destaque diária determinística entre 999 pistas;
- gauntlet semanal de 3 pistas únicas;
- passe gratuito 40 níveis, 100 XP/nível, recompensa automática em FICHAS;
- anti-farm: repetição paga somente delta de melhoria;
- rollover preserva histórico das últimas 4 temporadas;
- placar diário combina recorde local + ghosts recebidos por Código de Sombra;
- Shadow library agora persiste resumo alias/fase/tempo/carro para o placar;
- resultado sazonal mostra XP/FICHAS;
- save v61→v62 mantendo `SAVE_KEY`;
- Service Worker C10 inclui os 21 módulos runtime.

## Evidência de QA
- HZ-0010 repetido gerou exatamente o mesmo dia/pista/gauntlet/modificador;
- diária 2º: +92 XP; repetição 2º: +0; melhoria 1º: só delta +23 XP;
- passe nível 40: PASS; recompensa nível 40: +100 FICHAS;
- gauntlet 989→469→463, 3 pistas únicas; XP somente após terceira prova;
- rollover 28 dias: HZ-0010→HZ-0011, XP zerado, histórico preservado;
- Código de Sombra real importado alimentou placar da diária;
- 31 JS/SW válidos, nenhum módulo >400 linhas;
- 219 IDs HTML únicos; zero asset local ausente;
- 999 pistas + sentinelas 1/27/333/666/999;
- determinismo físico 3×: PASS;
- 0 `Math.random()` em `src/`;
- shell 93,1 KB gzip;
- Chromium ~59,88 FPS, zero pageerror/console.error.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,6/10:** agora existe um ritual diário sem transformar o jogo em agenda de obrigações.
- **VC mobile — 9,7/10:** calendário compartilhado + Código de Sombra cria D1/D7 e competição sem backend.
- **Jogador de 14 anos — 9,4/10:** dá para abrir, ver “a pista de hoje” e comparar com o amigo sem cadastro.

**Crítica mais dura:** o jogo já tem muita profundidade, mas um novato ainda aprende por tentativa. As Licenças precisam ensinar domínio em desafios de 20–40 s e transformar onboarding em conteúdo que também desbloqueia coisas.
