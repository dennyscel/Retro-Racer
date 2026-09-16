# REGISTRO — CICLO 05 — GHOST QUE APRENDE VOCÊ

## Diagnóstico
O GHOST já era visualmente reconhecível, mas ainda pilotava um arquétipo. Faltava memória comportamental: ele precisava observar o jogador, encontrar vícios reais e devolver uma cópia ligeiramente superior — sem IA externa e sem servidor.

## Mini-GDD
Nos primeiros segundos o GHOST continua sendo um rival preto/dourado. Depois de cada prova, porém, o jogo consolida telemetria local em um perfil: onde o jogador freia por tipo de curva, quanto tolera slip/off-road, quão agressivo ultrapassa, onde usa nitro, qual linha prefere e qual erro repete. O GHOST aplica esse perfil com vantagem progressiva, limitada a +4%, e fala sobre a evidência mais relevante. O Dossiê transforma a mecânica em narrativa legível.

## Implementação
- novo `src/meta/ghost-learning.js`;
- coleta por evento durante a corrida;
- consolidação no `career.ghostProfile`;
- migração save schema v57;
- tune determinístico com cap +4%;
- integração com `track-ai.js`, `physics.js`, `results.js` e `screens.js`;
- tela Dossiê e barras de leitura;
- rádio contextual baseado no insight real.

## Evidência de QA
Perfil controlado de laboratório resultou em hairpin 12,0 segmentos, nitro 49%, agressividade 60%, erro dominante SAÍDA DE PISTA e insight coerente. O mesmo perfil alimentou o GHOST; após 1 corrida o bônus foi +1,95% e, após forçar 50 corridas, permaneceu em +4,00%.

## Conselho dos três críticos
- **Produtor de Kyoto — 10/10:** agora o rival tem alma porque devolve um reflexo reconhecível do próprio jogador.
- **VC mobile — 8/10:** existe uma história de produto forte, mas ela ainda não distribui o jogo sozinha.
- **Jogador de 14 anos — 9/10:** “ele aprendeu meu jeito” é imediatamente mais interessante do que apenas “IA difícil”.

**Crítica mais dura:** GHOST aprende você, mas ainda existe só dentro do seu aparelho; sem um jeito de mandar sua sombra para outra pessoa, a ideia não se transforma em distribuição.

## Decisão travada
O aprendizado permanece 100% local/determinístico. Nenhuma conta, backend, modelo externo ou dado pessoal é necessário.
