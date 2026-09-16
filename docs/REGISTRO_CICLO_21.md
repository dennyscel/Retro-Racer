# REGISTRO — CICLO 21 — ANTI-TRAPAÇA E INTEGRIDADE

## Entrega
- Recordes novos só entram como verificados com replay de inputs válido, seed, carro, tempo e checksum.
- A taxa real do replay foi corrigida para 20 Hz; uma volta de 60 s exige aproximadamente 1.200 amostras.
- Recordes antigos continuam preservados em `integrity.legacyRecords`, mas não recebem selo de verificação.
- Time Trial novo guarda a prova junto do ghost.
- Código de Sombra mantém checksum e rejeição de payload corrompido.
- Conteúdo diário usa relógio monotônico best-effort: rollback >5 min ou salto grosseiro na sessão marca o relógio como suspeito e fixa o último dia confiável.

## Limite honesto
Isto é integridade local/offline, não segurança criptográfica contra um usuário que modifica o próprio JavaScript. Sem servidor, não existe autoridade externa. O objetivo é impedir corrupção acidental, edição trivial de save/tempo e placares locais sem replay reproduzível.

## Migração
Save v72 → v73 preservado; `SAVE_KEY` inalterada.
