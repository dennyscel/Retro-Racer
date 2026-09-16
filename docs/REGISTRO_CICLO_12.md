# CICLO 12 — OURO 12 — OFICINA DE PINTURA

## Diagnóstico
O carro já tinha progressão, skins e cosméticos, mas ainda era visualmente “do jogo”. O C12 torna a identidade do carro autoria do jogador e faz essa autoria viajar offline.

## Mini-GDD
Em menos de 30 s o jogador muda base, combina até três camadas vetoriais, escolhe número e patrocinador fictício e vê o resultado no mesmo sprite usado na corrida. A pintura gera um código curto verificável que outro jogador pode importar sem login ou servidor. Nenhum byte da pintura altera performance.

## Entregue
- 12 padrões vetoriais originais: faixas, laterais, diagonal, chevron, chamas, xadrez, gradiente, blocos, raio, meio-a-meio e onda;
- até 3 camadas, cores livres, número 0–99 e 8 patrocinadores fictícios;
- preview usando `drawCarGeneric()` e aplicação real na garagem/pista;
- codec compacto `RRP1-...` com checksum FNV; exemplo QA: 35 caracteres;
- importar/copiar/compartilhar sem backend;
- save schema v64 com `career.liveries`, mantendo a SAVE_KEY histórica.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,6/10:** o carro agora tem assinatura visual própria sem abandonar a linguagem 16-bit.
- **VC mobile — 9,7/10:** Código de Sombra + código de pintura cria UGC compartilhável sem custo de servidor.
- **14 anos / celular fraco — 9,6/10:** dá para montar “meu carro” rápido e mandar o código para um amigo.

**Crítica mais dura:** a autoria visual está forte, mas depois da corrida o jogador ainda sabe pouco sobre *onde* perdeu tempo. O próximo ciclo precisa transformar replay/telemetria em uma única dica acionável.
