## AAA_R2+C17 — Identidade e Boot AAA
- Boot de 4 s para saves existentes; save novo mantém direção instantânea.
- Wordmark 5×7 original e ignição procedural.
- Attract mode usa replay real/sombra com fallback determinístico.
- Wipe 16-bit respeita reduced-motion.

# CHANGELOG

## AAA_R2+C14 — Ciclo 14 — Copiloto + Lendário — 2026-09-15

- Controle COPILOTO: aceleração automática após o GO, freio/direção manuais.
- Dificuldade LENDÁRIO: sem rubber-band e sem seta de curva.
- GHOST aprendido +8% no LENDÁRIO.
- Dano 1,42× e consumo 1,20× no LENDÁRIO.
- Save schema v66 mantendo SAVE_KEY.

## AAA_R2+C13 — Ciclo 13 — Treinador Pós-Corrida — 2026-09-15

- Traço de volta compacto com 30 marcos por melhor referência.
- S1/S2/S3 comparados contra a melhor volta local.
- Uma única dica acionável baseada no pior setor.
- Painel visual desktop/mobile na tela de resultado.
- Save schema v65 mantendo SAVE_KEY.

## AAA_R2+C13 — Ciclo 13 — Treinador Pós-Corrida — 2026-09-15

- Traço de volta compacto com 30 marcos por melhor referência.
- S1/S2/S3 comparados contra a melhor volta local.
- Uma única dica acionável baseada no pior setor.
- Painel visual desktop/mobile na tela de resultado.
- Save schema v65 mantendo SAVE_KEY.

## AAA_R2+C12 — Ciclo 12 — Oficina de Pintura — 2026-09-15

- 12 padrões vetoriais originais e até 3 camadas por carro.
- Cor base, número 0–99 e 8 patrocinadores fictícios.
- Aplicação da livery no sprite da garagem e corrida.
- Código compartilhável `RRP1-...` com checksum; sem backend.
- Importação entre modelos sem efeito em performance.
- Save schema v64 mantendo SAVE_KEY.

# AAA_R2+C12 — Oficina de Pintura — 2026-09-15

- Editor procedural de librés com 12 padrões e 3 camadas.
- Cor base/camadas livres, número 0–99 e 8 patrocinadores fictícios.
- Código `RRP1-...` curto, offline, com checksum e importação entre carros.
- Pintura personalizada pode alternar com Stock/Midnight/Chrome sem apagar nenhum preset.
- Save migrado v63→v64; `SAVE_KEY` intacto.
- QA: 59,88 FPS laboratório, determinismo 3×, zero erro de runtime.

# CHANGELOG

## AAA_R2+C10 — Ciclo 10 — Temporada Horizonte — 2026-09-15

- Temporadas determinísticas de 28 dias.
- Pista destaque diária e gauntlet semanal de 3 provas.
- Passe gratuito de 40 níveis com FICHAS automáticas.
- Anti-farm por delta do melhor resultado.
- Placar diário alimentado por Códigos de Sombra importados.
- Save schema v62 mantendo SAVE_KEY.

## AAA_R2+C09 — Ciclo 09 — Fenda Horizonte — 2026-09-15

- Nova Fenda: 5 pistas, 1 volta cada, dano/combustível persistentes.
- 40 cartas, 4 lendárias, sinergias e uma oferta lendária por run.
- Banco em risco: só paga após a quinta prova.
- Pit não repara e garagem é bloqueada entre etapas.
- Service Worker atualizado para todos os módulos runtime C09.
- Save schema v61 mantendo SAVE_KEY.

## AAA_R2+C08 — Ciclo 08 — Combo de Risco — 2026-09-15

- Sistema RISCO: quase-colisão, drift, draft, airtime e zebra limpa.
- Batida quebra combo para x0.0.
- Nova moeda FICHAS, exclusivamente cosmética.
- 4 rastros de nitro cosméticos na garagem.
- Estatísticas de melhor combo/risco/fichas.
- Save schema v60 mantendo SAVE_KEY.

## AAA_R2+C07 — Ciclo 07 — Rádio Vivo e Música Reativa — 2026-09-14

- Tracker premium preservado e estendido com stems adaptativos, filtro/wet e transposição.
- CHASE reforça base e seca leads; PODIUM abre lead; FINAL intensifica mix.
- Pit: low-pass/reverb curto; motor/SFX também escurecem.
- Hitstop: música + motor/SFX abafados por 300 ms.
- Última volta: +1 semitom.
- 84 falas contextuais em 14 bancos; GHOST/REX/VIPER ganham personalidade.
- Save schema v59 sem alterar SAVE_KEY.

## AAA_R2+C06 — Ciclo 06 — Código de Sombra — 2026-09-14

- Replay determinístico compactado automaticamente em RAW/RLE.
- Novo payload binário com seed, pista, carro, pintura, alias, tempo e checksum.
- Código humano `RR7-…` como fingerprint e link completo em `#g=`.
- Importação antes do FTUE; desafio abre direto no menu de Sombra.
- Biblioteca local de até 12 sombras e corrente de até 4 ghosts.
- Revanche incorpora a melhor volta do receptor.
- Modo Sombra de 1 volta isolado da economia.
- Render usa carro/pintura/cor/faixa do remetente e evita alocação temporária nova por frame.
- QR real Version 20-L com ECC Reed-Solomon, validado por decoder externo.
- Rádio anuncia o alias do remetente.
- Migração de save schema para v58 sem alterar `SAVE_KEY`.
- QA: checksum, corrupção, 4-chain, ranking, economia, hash boot, determinismo, sentinelas e runtime Chromium aprovados.

## AAA_R2+C05 — Ciclo 5 — GHOST que aprende você — 2026-09-14

### Adicionado
- `src/meta/ghost-learning.js`: perfil offline de frenagem, slip, agressividade, nitro, linha e erros.
- Tela **DOSSIÊ DO GHOST** com evidências reais do perfil aprendido.
- Ajuste do GHOST com vantagem progressiva e cap rígido de +4%.
- Rádio contextual baseado no dado dominante aprendido.
- Migração de save v57 preservando perfis antigos e defaults aninhados.

### Preservado
- `SAVE_KEY = retro_racer_championship_v30`.
- 999 pistas, 37 copas, 4 rodas, parallax, FTUE, juice C03 e hápticos C04.

### QA
- Node/sintaxe: PASS.
- 999 pistas / 37×27 / sentinelas: PASS.
- GHOST learning / dossier / rádio / cap +4%: PASS.
- Runtime Chromium de laboratório: 59,88 FPS medianos; zero pageerror/console.error.
- Hardware físico/PWA HTTPS: NÃO TESTADO.

# CHANGELOG — Retrô Racer Championship

## AAA_R2+C04 — CICLO 4 / OURO 4 — Háptico como Linguagem

- Novo `src/ui/haptics.js` com vocabulário tátil sem dependência externa.
- Zebra 8 ms; grip duplo; nitro em rampa; impacto 40 ms; bandeirada em três pulsos.
- Mesmo evento roteado para `navigator.vibrate` e Gamepad vibration actuator.
- Cooldowns impedem spam de zebra/perda de grip.
- Nitro, colisões, road edge e finish integrados à física/resultado.
- Save schema 56, mantendo a mesma `SAVE_KEY`.
- Runtime lab = 59,88 FPS, zero pageerror.

---

## AAA_R2+C03 — CICLO 3 / OURO 3 — Juice Até Doer

- Pool fixo de 96 marcas de pneu com fade/lifetime de 6 s.
- Câmera passa a usar alvo atrasado em 2 frames nas curvas.
- Aberração cromática leve acima de 240 km/h em HIGH/CRT.
- Raspada de guard-rail/barreiras em cidade, montanha e set pieces gera faíscas.
- Perfect Start recebe flash branco de exatamente 1 frame renderizado.
- CRT ganha grão leve sem assets externos.
- `prefers-reduced-motion` desliga todos os efeitos de movimento do ouro, inclusive hitstop/shake/FOV dinâmico/speed lines.
- Pós-processo foi mantido leve; probe Chromium = 59,88 FPS medianos.
- Primeiro QA revelou boot quebrado apenas em reduced-motion; ordem de inicialização foi corrigida antes do fechamento.

---

## AAA_R2+C02 — CICLO 2 / OURO 2 — Os Primeiros 8 Segundos

- Save novo entra diretamente na pista 1, sem menu antes da primeira sensação de controle.
- Próximo de 0,9 s no laboratório: carro já correndo, HUD/textos ocultos e aceleração automática.
- Primeira ação útil é virar; teclado, toque e gamepad continuam aceitos.
- Rival NOVA roteirizado na reta inicial; primeira ultrapassagem medida em ~2,1 s no teste com direção.
- Aos ~8,02 s o prólogo se funde na primeira corrida real com 22 rivais, sem reset de progresso.
- `career.flags.ftueComplete` torna o prólogo one-shot; saves existentes não são desviados para o FTUE.
- Durante o prólogo: sem consumo de combustível, alarme de tanque ou dano punitivo; colisão é amortecida.
- Handoff curto mantém aceleração por ~2,35 s para evitar quebra de ritmo após a transição.
- `PARALLAX_SAMPLES` removido de alocação repetida e polling de gamepad sem spread por frame.
- Zero `Math.random()` em `src/`; determinismo da física repetido 3× com estado final idêntico.
- Chromium de laboratório: ~59,88 FPS medianos no cenário FTUE.
- Save v52 fase 123 / CR$ 45.678 / carro 2 preservado e abriu no menu normal.
- Mobile 390×844: prólogo, steering por pointer e ultrapassagem passaram sem `pageerror`.
- 999 pistas, 37×27, sentinelas, 4 rodas, SAVE_KEY e assets validados.

---

## AAA_R2+C01 — CICLO 1 / OURO 1 — Modularização + Determinismo

- `index.html` virou shell de ~23 KB; CSS separado em `styles/app.css`.
- Gameplay dividido em ES modules nativos (`core`, `race`, `render`, `audio`, `meta`, `ui`); `src/compat` removido.
- Nenhum JS em `src/` passa de 400 linhas (maior: 351).
- `runtime-store.js` centraliza valores mutáveis usados pelos bindings de transição.
- Timestep fixo 60 Hz com acumulador; render desacoplado.
- RNG `mulberry32` seedável por canais; zero `Math.random()` no runtime JS.
- Replay canônico por inputs com RLE/base64url; amostra de ~56 s = 238 bytes.
- Novos ghosts de Time Trial não persistem posições; a trilha visual é reconstruída do input replay. Saves antigos com `samples` continuam compatíveis.
- Pista ativa carrega lazy; catálogo 999 e banco de música 999 continuam sob demanda.
- Save v52 testado: fase 123 / CR$ 45.678 / carro 2 / stats preservados na migração para schema 53.
- Determinismo do kernel e da física real passou 3× com outputs idênticos.
- Otimizações do caminho quente: cache de curva, parallax pool, cache dos carros visíveis, remoção de `filter/sort` para mensagem de posição e remoção de gravação posicional do ghost.
- Shell crítico medido em ~111 KB gzip.
- Chromium HIGH: 59,9 FPS de mediana no laboratório.
- Rede simulada do laboratório: first-playable 3,835 s (<4 s).
- 37 copas, 27 pistas/Copa 1, sentinelas 1/27/333/666/999, mobile scroll, 4 rodas e save preservados.

---

## AAA FINAL R2 — 2026-09-14 — QA pós-final

### Progressão e meta
- Copa 1 em save novo agora inicia corretamente em `0/27`, não `1/27`.
- Vitória na fase 999 fecha corretamente a 37ª copa e registra 37 copas concluídas.
- Eclipse passa a ser realmente liberado ao alcançar a fase 999, sem exigir compra impossível após o final.
- Criado o **Almanaque 999** real: 37 páginas de copa, 27 silhuetas por copa, desbloqueio por progressão.
- Chrome agora exige streak de 3 ouros; compatibilidade preservada para saves antigos que já utilizavam a pintura.
- Contratos diários usam data local `YYYYMMDD` e pagam recompensa uma única vez.

### Modos e economia
- Time Trial deixou de pagar prêmio cheio por uma corrida sem rivais; agora paga apenas bônus de recorde novo.
- Time Trial e Endurance podem selecionar qualquer pista já liberada.
- Endurance mantém 15 voltas e não paga prêmio/patrocínio se terminar com menos de 2 pits.
- Adicionado foto-finish: diferença estimada < 0,35 s ativa 2,5 s em 0,45× antes do resultado.

### IA, grid e rádio
- Largada corrigida para grid visual 2-by-2 de verdade.
- REX mantém comportamento blocker; GHOST permanece antagonista preto/dourado.
- `PIT ABERTO` agora é disparado no primeiro ponto de pit de cada volta.

### Plataforma e controles
- PWA alterada de `landscape` forçado para `orientation: any`, preservando retrato e paisagem.
- Service worker refeito para cache de shell; não devolve HTML como fallback de JS ausente e não pré-cacheia banco musical pesado/JSONs individuais de pista.
- Music bridge tolera ausência do banco pesado offline sem quebrar o shell.
- Gamepad corrigido: R2 acelera, L2 freia, A/X nitro; A não acelera mais.
- Botão para reexibir dica de controles e flag persistente para não mostrar tutorial a cada corrida.
- Detector de performance usa limiar adequado a 30 FPS; escolher 30 FPS saudável não força LOW.

### Áudio
- Restaurado o ponto de partida aprovado: Música 53%, Motor 25%, Efeitos 37%, UI/Menu 56%.
- Preferências passam a usar `retro_racer_audio_v40_preferences` para não reaproveitar mix antigo incompatível.

### QA R2
- 158 IDs HTML únicos, zero duplicados.
- Zero referência local ausente em `script/link/img`.
- 999/999 pistas confirmadas; sentinelas 1/27/333/666/999 presentes.
- `node --check` aprovado no JS principal, SW, tracks, music, SFX e audio manager.
- Runtime Chromium: Almanac, save legado, fase 999, Chrome, modos, gamepad simulado e 30 FPS passaram sem `pageerror`.

---

## AAA FINAL — 2026-09-14

### OURO 0 — Estabilização V43
- Validado e preservado o juice V43: FOV, lookahead, shake com decay, nitro 0,12 s, recargas, colisões, freeze forte, pit teatral, jump/perfect start, HUD e LOW/HIGH.

### OURO 1 — Identidade de campeonato
- 37 copas navegáveis e 27 pistas por copa.
- Replay antigo sem avançar carreira, prêmio em 55%.
- Ribbon do traçado, troféus, recordes locais e bônus único a cada 3 fases.

### OURO 2 — Garagem AAA
- Frota ampliada para 12 carros.
- 3 pinturas por carro, stats, unlocks, dano visual.
- Suspensão, freio, radiador, ECU e aero adicionados aos 5 upgrades originais.

### OURO 3 — Clima jogável
- Grip por chuva/tempestade/neve, pneu escolhido e spray.
- Neblina reduz alcance; calor acelera consumo de nitro; tempestade aplica vento lateral.
- 10% das provas elegíveis podem receber chuva a partir da volta 3.

### OURO 4 — IA teatral
- GHOST preto como antagonista e ataque scriptado controlado.
- REX blocker, instáveis com erro leve, rubber-band de campeonato limitado.
- Rádio de prova com VIPER, pit, última volta, clima e eventos.

### OURO 5 — Modos
- Corrida Rápida com copa/pista/3–12 voltas.
- Time Trial com ghost local ~20 Hz.
- Endurance de 15 voltas com 2 pits, desafio diário e boss 1v1.
- Banner xadrez de chegada preservado.

### OURO 6 — Audiovisual 2
- Placas usam nome real da pista.
- Spray, chuva/neve/calor e set pieces reforçados.
- Banco musical procedural premium e ducking existentes preservados.

### OURO 7 — Plataforma
- Gamepad API + haptics quando disponível.
- Botões virtuais opcionais, sensibilidade e deadzone.
- PWA, pause em `visibilitychange`, qualidade LOW/MED/HIGH/CRT e pool de partículas.

### OURO 8 — Conteúdo lendário + economia
- Túnel, ponte, viaduto, porto, cânion e arquibancada derivados do ambiente oficial.
- 27/333/666/999 com tratamento especial; 999 termina em créditos.
- Prêmio logarítmico, seguro opcional, patrocínio top-5 limpo e contratos diários.

### OURO 9 — Polimento final
- Dificuldade Fácil/Normal/Herói/Lenda, HUD S/M/L e Reduzir Flash.
- Strings pt-BR centralizadas para mensagens críticas + stub en-US.
- Reset exige digitar `CORRIDA`.
- favicon/PWA icons, sitemap, robots e SEO preservados.
- Tela de resultado mostra melhor volta e patrocínio.


## AAA_R2+C11 — Licenças Horizonte — 2026-09-15
- 60 licenças de 20–40 s: curva, ultrapassagem, vácuo e pit.
- Bronze/Prata/Ouro persistentes em `career.licenses`.
- Licenças usam fases reais e não pagam CR$.
- Dano/crashes/pits da licença são restaurados ao final.
- 5/15/30/45/60 ouros antecipam disponibilidade de compra de cinco carros.
- HUD contextual e pré-corrida sem informação econômica irrelevante.
- Save schema v63 mantendo `SAVE_KEY` original.
- Service worker atualizado para C11.

## AAA_R2+C15 — Narrativa em 37 capítulos — 2026-09-15
- 37 capítulos de carreira, um por copa, com 6 linhas curtas cada.
- 3 quadros 16-bit por capítulo desenhados em Canvas, sem asset externo.
- Arco Horizonte Zero / GHOST / REX até a fase 999.
- História aparece uma vez por copa antes da pré-corrida da carreira.
- Save v66→v67 com `career.story.seen` e `flags.c15Story`.

## AAA_R2+C16 — Clipe de Destaque — 2026-09-15
- Buffer circular de 8 segundos a 20 Hz por inputs/estado quantizado.
- Seleção automática de combo, ultrapassagem do GHOST e foto-finish.
- Preview vertical 9:16 com marca Retrô Racer e Código de Sombra.
- Exportação WebM local via canvas.captureStream + MediaRecorder.
- Compartilhamento de arquivo quando Web Share API suporta files; fallback para download/PNG.
- Save v67→v68 com estatísticas de clipe.


## AAA_R2+C18 — Acessibilidade de verdade — 2026-09-16
- Paletas PROTAN, DEUTER e TRITAN.
- Modo canhoto e escala 80–140% dos controles virtuais.
- Alvo mínimo de toque de 48 px.
- Assistência de direção OFF/LEVE/MÉDIA/FORTE, independente da recompensa.
- Legendas para SFX e rádio.
- Reduzir Flash + prefers-reduced-motion integrados ao juice.
- Save v69→v70 mantendo SAVE_KEY original.


## AAA_R2+C19 — Economia e monetização ética — 2026-09-16
- CR$, FICHAS e MARCAS separados por função.
- `flags.monetization=false` por padrão.
- Passe/Fundador/avulsos apenas cosméticos; rewarded opcional.
- Planilha ECONOMIA_C19.xlsx com sources/sinks e tempo estimado até cada carro.
- Save v70→v71.


## AAA_R2+C20 — Telemetria e painel — 2026-09-16
- Taxonomia local sem PII e ring buffer 500.
- Envio opcional opt-in para endpoint HTTPS.
- Dashboard oculto com proxy local D1/D7/D30, sessão, FTUE, conclusão e dificuldade.
- Save v71→v72.


## AAA_R2+C21 — Anti-trapaça e integridade
- Recordes verificados por replay 20 Hz + seed + checksum.
- Relógio diário com rollback best-effort.
- Time Trial grava prova de integridade.

## AAA_R2+C22 — Pacote de Vitrine — 2026-09-16
- Adicionados `PITCH_UMA_PAGINA.md`, `DECK.md`, trailers 15/45 s, ASO em 3 idiomas, press kit, métricas-alvo e roadmap 12 meses.
- Adicionado índice do pacote investidor e pasta `docs/press/` com 6 screenshots reais + 2 GIFs compostos de evidências reais.
- Atualizado cache do service worker para `retro-racer-shell-c22-v1`; nenhum gameplay/hot loop alterado.
- QA global: 999 pistas, 304 IDs únicos, 42 JS/SW válidos, maior módulo 358 linhas, zero `Math.random()` em `src/`, shell 133,6 KB gzip.
- Rubrica final: 118/120; todos os eixos >=9.
- Hardware real e novo teste jogado C22 permanecem explicitamente NÃO TESTADOS.

