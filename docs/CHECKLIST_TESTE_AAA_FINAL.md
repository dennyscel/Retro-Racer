# CHECKLIST DE TESTE — AAA FINAL R2

## A. QA estático automatizado realizado

- [x] `node --check` no JS funcional extraído do `index.html` (JSON-LD excluído corretamente da checagem JS).
- [x] `node --check` em `sw.js`, tracks, music engine/bridge/banco, SFX e audio manager.
- [x] 158 IDs HTML, 158 únicos, zero duplicados.
- [x] Zero referência local ausente em `script/link/img`.
- [x] `SAVE_KEY = 'retro_racer_championship_v30'` exato.
- [x] Zero literal `console.error` no HTML final.
- [x] Catálogo contém exatamente 999 IDs únicos, de 1 a 999.
- [x] Fases 1/27/333/666/999 presentes.
- [x] `drawCarGeneric()` mantém quatro chamadas explícitas de roda: duas traseiras + duas dianteiras.
- [x] `manifest.webmanifest` usa `orientation: any`.
- [x] `sw.js` não inclui o banco `retro16_classic_tracks_999.js` no array de pré-cache e não pré-cacheia JSONs individuais de pista.
- [x] Catálogo V40, bridge SFX e OG JPG permanecem byte a byte iguais ao AAA FINAL anterior.

## B. Runtime Chromium automatizado realizado

O ambiente bloqueia navegação direta para `file://` e `127.0.0.1` com `ERR_BLOCKED_BY_ADMINISTRATOR`. Para não falsificar teste, o mesmo HTML e os mesmos scripts foram carregados diretamente no DOM do Chromium via Playwright.

- [x] Tela inicial abriu sem `pageerror`/erro de console.
- [x] Almanac mostra `1/999` em save novo, 27 cards por copa e bloqueia pistas futuras.
- [x] Copa 1 em save novo mostra `0/27 progresso · ABERTA`.
- [x] Data do Daily/contratos usa data local `2026-09-14` no fuso America/Sao_Paulo do teste.
- [x] Save legado V42 preserva level/dinheiro/carro/upgrades e recebe campos novos por merge.
- [x] Save na fase 999 mostra Copa 37 em `27/27`, troféu e Eclipse `DESBLOQUEADO`.
- [x] Chrome permanece bloqueado sem streak e libera com streak de 3 ouros.
- [x] Time Trial abre seleção de copa/pista e exibe prêmio apenas de recorde (P2/P3 = CR$ 0).
- [x] Endurance abre seleção de pista e mantém 15 voltas.
- [x] Gamepad simulado: A sozinho não acelera; R2 acelera; zero `pageerror`.
- [x] Perfil 30 FPS + HIGH permanece HIGH após corrida simulada; não cai falsamente para LOW.
- [x] Grid 2-by-2 foi renderizado no Chromium sem erro visual estrutural aparente.
- [x] Mobile 390×844: Ajustes com `overflow-y:auto`, rolagem até o fim, Almanac 27 cards e Copas 37 cards; zero `pageerror`.

## C. Verificações funcionais de código

- [x] Foto-finish usa limiar `< 0,35 s`, slow-motion `0,45×` e espera `2,5 s` antes do resultado.
- [x] Time Trial não incrementa vitória normal nem paga prêmio cheio repetível.
- [x] Endurance com menos de 2 pits zera prêmio e bônus de patrocínio.
- [x] `PIT ABERTO` possui disparo real por volta.
- [x] Dica de controle pode ser reexibida e deixa de aparecer automaticamente depois da primeira corrida.
- [x] Mix inicial do audio manager: Música 53%, Motor 25%, Efeitos 37%, UI/Menu 56%.

## D. Itens que ainda exigem hardware/URL real

- [ ] Áudio após gesto real no Android/iPhone, incluindo ducking e retomada.
- [ ] Gamepad físico e vibração/haptics em navegador/dispositivo que exponha actuator.
- [ ] Instalação PWA pelo HTTPS da Hostinger e teste offline do shell.
- [ ] Sensação de direção, nitro, pit e foto-finish durante várias voltas com controle humano.
- [ ] Consumo e estratégia dos 22 rivais numa prova completa de 5 voltas.
- [ ] Parallax urbano em curvas longas no aparelho alvo.
- [ ] Jogar 27, 333, 666 e 999 do início ao fim e confirmar créditos da 999.
- [ ] Validar temperatura/performance prolongada em Android de entrada no LOW/30 FPS.

## E. Veredito técnico

**PASS técnico/runtime automatizado da R2.** Os defeitos concretos encontrados no primeiro AAA FINAL foram corrigidos sem alterar `SAVE_KEY`, catálogo 999, física-base ou parallax V41.6. O pacote ainda precisa do teste humano/hardware listado acima; nada disso foi marcado como aprovado sem evidência.
