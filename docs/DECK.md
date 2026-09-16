# DECK — Retrô Racer Championship: Horizonte Zero

> Formato: 12 slides. Os números de produto abaixo são fatos do build; métricas de mercado/retensão são metas até existirem dados reais.

## Slide 1 — Problema
Jogos de corrida mobile tendem a cair em dois extremos: produção cara com backend pesado ou arcade raso que perde novidade rápido. Para um projeto independente, o desafio é criar profundidade, retorno e compartilhamento sem depender de servidores caros.

## Slide 2 — Insight
O conteúdo mais interessante não precisa vir só de novas pistas. **O próprio jogador pode virar conteúdo**: seu estilo vira GHOST, sua volta vira Código de Sombra, sua pintura vira código e seu melhor momento vira clipe.

## Slide 3 — Produto
Arcade pseudo-3D 16-bit, web/PWA, offline-first. Hoje o build contém **999 pistas**, **37 copas/capítulos**, **12 carros**, carreira, modos rápidos, Time Trial, Endurance, Daily, Boss, Fenda roguelite, Temporada, Licenças e Oficina de Pintura.

## Slide 4 — Momento “uau”
1. O jogo aprende onde você freia e como usa nitro.  
2. O GHOST volta pilotando uma versão melhor do seu perfil.  
3. O rádio comenta o vício real.  
4. Uma volta boa gera um Código de Sombra compartilhável.  
5. O amigo corre contra você sem login/backend obrigatório.

## Slide 5 — Demonstração em 90 segundos
- 0–8 s: FTUE já dirigindo.
- 8–25 s: ultrapassagem, juice e rádio.
- 25–40 s: Dossiê do GHOST.
- 40–55 s: Código de Sombra + QR/link.
- 55–70 s: amigo/importação + múltiplos ghosts.
- 70–90 s: Fenda, Oficina, clipe vertical e Temporada.

## Slide 6 — Mercado / entrada
Entrada proposta: **racing casual mobile e web, LatAm primeiro**, com pt-BR nativo e estrutura i18n. O deck não atribui TAM/SAM/SOM sem pesquisa externa validada. A hipótese é que nostalgia 16-bit + sessões curtas + compartilhamento sem login reduzem fricção de aquisição.

## Slide 7 — Loop viral
**Corrida → momento forte → Código de Sombra/clipe → WhatsApp/social → amigo importa → revanche → novo código.**  
Métrica central: `k = shares_por_jogador × taxa_de_abertura × taxa_de_primeira_corrida`.  
Meta de experimento inicial: elevar `ghost_import / share_click` e `race_start / ghost_import`; não há k-factor real declarado antes de teste com usuários.

## Slide 8 — Retenção e medição
Hipóteses de retorno: GHOST adaptativo, temporada de 28 dias, pista diária, gauntlet, Fenda de ~sessão curta, licenças e treinador pós-corrida. Telemetria local já possui taxonomia de `app_open`, FTUE, corrida, garagem, compartilhamento e sessão. Metas D1/D7/D30 estão em `METRICAS_ALVO.md`; não são resultados históricos.

## Slide 9 — Economia e unit economics
Três moedas de design: **CR$** (performance, nunca vendida), **FICHAS** (perícia/cosmético) e **MARCAS** (temporada/cosmético). Monetização fica por feature flag e admite apenas fundador/ad-free, passe cosmético, cosméticos avulsos e anúncio recompensado opcional. Sem loot box paga, sem venda de carro, upgrade, XP ou progresso.

## Slide 10 — Roadmap 12 meses
1–3 meses: teste fechado, telemetria consentida, performance em hardware real e localização en-US/es-419.  
4–6: loja/PWA madura, pipeline de conteúdo, comunidade e ferramentas de moderação de códigos.  
7–9: protótipo de criador de pista e campeonato assíncrono.  
10–12: avaliar multiplayer real/lojas nativas com dados de retenção comprovados.

## Slide 11 — Time
Projeto criado por **Dennys Smaniotto Pavanelli**, com direção de produto centrada em preservar o pseudo-3D 16-bit e construir tecnologia própria/procedural. Necessidades de escala: arte/QA mobile, distribuição/ASO, community/growth e engenharia de plataforma se o teste provar retenção.

## Slide 12 — Pedido
Financiar/viabilizar **validação de produto e distribuição**, não reconstrução do jogo: QA em matriz de aparelhos, testes de retenção, localização, ASO/criativos e instrumentação consentida. Marco de decisão: dados reais de FTUE, D1/D7, compartilhamento, ghost import e tempo de sessão suficientes para decidir escala.
