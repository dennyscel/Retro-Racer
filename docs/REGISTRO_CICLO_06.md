# REGISTRO — CICLO 06 — CÓDIGO DE SOMBRA

## Diagnóstico
O GHOST já aprendia o jogador, mas a experiência social ainda terminava no próprio aparelho. O replay determinístico criado no Ciclo 1 tornou possível transportar uma volta inteira sem servidor; faltavam codec compacto, integridade, importação e UX de revanche.

## Mini-GDD
Uma boa volta gera uma assinatura humana `RR7-XXXX-XXXX` e um link `#g=` contendo seed, pista, carro, pintura, tempo e replay de inputs. O amigo abre o link e corre imediatamente contra aquela sombra. A revanche incorpora a nova volta e uma corrente mantém até quatro ghosts. O código curto é uma fingerprint verificável; o payload completo viaja no link/QR porque 12 caracteres não comportam fisicamente uma volta sem backend.

## Implementação
- codec binário compacto RAW/RLE com seleção automática do menor formato;
- checksum FNV e rejeição de payload corrompido;
- importação por `#g=` antes do FTUE;
- biblioteca local de sombras (máx. 12);
- corrente de até 4 ghosts;
- carro, pintura, cor, faixa, apelido e tempo do remetente;
- modo Sombra de 1 volta sem prêmio/medalha/contrato para impedir farm;
- revanche que adiciona a melhor volta do receptor à corrente;
- QR real Version 20-L com Reed-Solomon, validado por decoder externo;
- compartilhamento por Web Share API/clipboard com fallback local;
- render de ghosts sem alocação temporária nova no hot loop.

## Evidência de QA
- replay sintético de 70 s: payload 240 caracteres;
- corrente de 4 sombras: 908 caracteres;
- corrupção proposital: rejeitada pelo checksum;
- QR decodificado externamente para exatamente o mesmo link;
- ranking de 4 sombras calculado por tempo real;
- dinheiro, vitórias e medalhas permaneceram inalterados no modo Sombra;
- save v57→v58 preservou fase 77, CR$ 54.321 e carro;
- sentinelas 1/27/333/666/999 carregaram e executaram update;
- determinismo repetiu o mesmo estado 3×;
- Chromium de laboratório: ~59,88 FPS, zero pageerror e zero console.error.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,4/10:** a sombra de outra pessoa finalmente parece parte do campeonato, não um arquivo importado.
- **VC mobile — 9,1/10:** existe agora um loop viral sem servidor, com link/QR e revanche mensurável no futuro.
- **Jogador de 14 anos — 9,2/10:** abrir um link e ver o carro do amigo na pista é imediatamente compreensível.

**Crítica mais dura:** o outro humano entrou no jogo, mas o áudio ainda não prova que a corrida percebe a batalha; música e rádio continuam dramáticos de forma limitada e precisam reagir ao estado real da prova.

## Decisão travada
O código curto `RR7-…` é fingerprint, não armazenamento mágico. A volta completa permanece no `#g=`/QR, preservando offline-first, integridade e ausência de backend.
