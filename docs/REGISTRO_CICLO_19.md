# CICLO 19 — OURO 19 — ECONOMIA E MONETIZAÇÃO ÉTICA

## Diagnóstico
CR$ e FICHAS já existiam, mas não havia um modelo formal de três moedas, sources/sinks documentados nem uma fronteira técnica que impedisse monetização de invadir performance.

## Mini-GDD
- CR$: só gameplay; compra carros, upgrades e reparo. Nunca vendida.
- FICHAS: perícia/Combo de Risco; só cosmético.
- MARCAS: temporada; 3 por melhoria diária e 10 por melhoria semanal; só cosmético sazonal.
- `career.flags.monetization=false` por padrão.
- Passe cosmético, Fundador, cosméticos avulsos e anúncios opcionais dependem de adaptador externo e da flag.
- Fundador remove anúncios e concede apenas selo/rótulo cosmético.
- Anúncio recompensado pode dobrar UM prêmio ou dar UM continue por run da Fenda.
- Zero loot box paga, zero energia, zero carro/upgrade/XP/progresso vendido.

## Evidência
- compra real com flag OFF retorna `MONETIZAÇÃO DESATIVADA`.
- MARCAS 50 → Nitro Ciano 45 → saldo 5.
- adaptador simulado confirmou Fundador/ad-free, dobro exato de 1000 CR$ e um continue de Fenda.
- curva de 1º lugar: fase 1=2.020; 27=2.858; 100=7.659; 400=30.337; 999=82.921 CR$.
- planilha `docs/ECONOMIA_C19.xlsx` contém moedas, sources/sinks, regras e corrida estimada até cada carro.

## Conselho dos três críticos
- **Produtor de Kyoto — 9,7/10:** progressão continua vindo da pista; cosmético não contamina handling.
- **VC mobile — 9,8/10:** monetização pode ser ligada sem reescrever o jogo nem criar pay-to-win.
- **14 anos / celular fraco — 9,8/10:** nada me obriga a ver anúncio ou pagar para continuar a carreira.

**Crítica mais dura:** agora falta medir tudo isso no próprio produto; sem telemetria, retenção e funil ainda são opinião.
