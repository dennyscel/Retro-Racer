---
document_id: RR-PLAN-001
title: Plano Mestre de Qualidade do Retro Racer
version: 1.1.0
status: active
canonical: true
language: pt-BR
owner: dennyscel
repository: https://github.com/dennyscel/Retro-Racer
public_game: https://dennyscel.github.io/Retro-Racer/
last_updated: 2026-09-17
editable_by: human_and_ai
workflow_status_values:
  - todo
  - doing
  - blocked
  - done
  - verified
severity_values:
  - blocker
  - critical
  - major
  - moderate
  - minor
---

# Plano Mestre de Qualidade do Retro Racer

## Especificação de produto jogabilidade arte áudio desempenho e validação

**Versão:** 1.1.0  
**Data:** 17 de setembro de 2026  
**Produto:** Retrô Racer Championship  
**Status:** Linha de base obrigatória para execução e aceite

## Como humanos e IAs devem usar este arquivo

Este Markdown é a fonte oficial de requisitos, ordem de execução e aceite do projeto. Ele foi escrito para leitura direta no GitHub e para atualização segura por agentes de IA.

- Os identificadores `RR-*` são permanentes. Não devem ser renumerados nem reutilizados.
- `todo` significa ainda não implementado; `doing`, em execução; `blocked`, impedido; `done`, implementado e validado localmente; `verified`, validado na versão pública do GitHub Pages.
- Uma tarefa só pode chegar a `verified` depois de publicação, carregamento da URL pública e execução dos testes indicados.
- Ao mudar um estado, preencher a coluna **Evidência** com teste, commit, captura ou URL verificável.
- Novos defeitos devem receber identificador, severidade, critério de saída e posição na ordem de execução.
- Texto de contexto pode ser refinado, mas nenhum requisito obrigatório pode ser removido sem decisão explícita do proprietário.
- A implementação deve seguir a ordem de dependências da tabela abaixo. Itens independentes podem ser agrupados no mesmo ciclo.

## Registro executável

Esta tabela é o painel principal para leitura e escrita automatizada. As seções posteriores contêm os detalhes de cada item.

| ID | Prioridade | Estado | Dependências | Entrega verificável | Evidência |
| --- | --- | --- | --- | --- | --- |
| RR-DOC-001 | P0 | doing | Nenhuma | Especificação canônica publicada no repositório | Pendente |
| RR-AUD-001 | P0 | todo | RR-DOC-001 | Auditoria do código e lista de defeitos reproduzíveis | Pendente |
| RR-NIT-001 | P0 | todo | RR-AUD-001 | Máquina de estados do nitro e testes de gesto mantido | Pendente |
| RR-COL-001 | P0 | todo | RR-AUD-001 | Colisões estáveis entre carros, bordas e barreiras | Pendente |
| RR-STA-001 | P0 | todo | RR-AUD-001 | Grid, semáforo e lançamento competitivo | Pendente |
| RR-AI-001 | P0 | todo | RR-COL-001, RR-STA-001 | Rivais competitivos e dificuldades calibradas | Pendente |
| RR-INP-001 | P0 | todo | RR-NIT-001 | Toques, gestos, rotação e retomada sem entradas fantasmas | Pendente |
| RR-FUN-001 | P0 | todo | RR-AI-001, RR-INP-001 | Corridas curtas e longas divertidas em vitória, derrota e recuperação | Pendente |
| RR-UI-001 | P0 | todo | RR-AUD-001 | Menu móvel curto, legível e navegável | Pendente |
| RR-HUD-001 | P0 | todo | RR-UI-001 | HUD sem sobreposição em vertical e horizontal | Pendente |
| RR-CAR-001 | P1 | todo | RR-COL-001 | Carros com silhueta, escala, sombra e dano coerentes | Pendente |
| RR-ENV-001 | P1 | todo | RR-HUD-001 | Ambientes em camadas sem vazios ou blocos sem origem | Pendente |
| RR-LVL-001 | P1 | todo | RR-AI-001, RR-ENV-001 | Campanha inicial curada e pistas repetitivas retiradas | Pendente |
| RR-PWR-001 | P1 | todo | RR-LVL-001 | Power-ups restritos a modos próprios e balanceados | Pendente |
| RR-AUD-002 | P0 | todo | RR-AUD-001 | Áudio contínuo durante corrida, pausa e troca de aba | Pendente |
| RR-PERF-001 | P0 | todo | RR-HUD-001, RR-ENV-001 | Simulação 60 Hz e qualidade gráfica adaptativa | Pendente |
| RR-QA-001 | P0 | todo | Todos os itens P0 | Matriz vertical e horizontal sem falha grave | Pendente |
| RR-REL-001 | P0 | todo | RR-QA-001 | Versão pública sem defeitos bloqueadores, críticos ou graves | Pendente |

### Ordem dos ciclos

1. Publicar este documento e auditar o comportamento atual.
2. Corrigir nitro, colisões, largada, entrada e inteligência artificial.
3. Refazer menu, tipografia, HUD e adaptação de orientação.
4. Melhorar carros, pistas, ambientes, campanha e modos arcade.
5. Estabilizar áudio, memória e desempenho adaptativo.
6. Publicar, jogar a versão pública, registrar evidências e repetir até `RR-REL-001` ficar `verified`.

## Decisão de qualidade

Este documento fixa os requisitos para reconstruir o Retrô Racer como um arcade de corrida web consistente, responsivo e divertido. A versão atual apresenta falhas graves de apresentação e jogabilidade: menu excessivamente longo, tipografia inadequada, HUD cobrindo a pista, mensagens duplicadas, carros com pouca definição, colisões instáveis, largada sem impacto, inteligência artificial permissiva, cenários vazios, áudio sujeito a cortes e comportamento incorreto do nitro.

O produto não será considerado concluído enquanto houver falha conhecida que impeça jogar, prejudique uma corrida, esconda informação importante ou quebre a apresentação em celular vertical ou horizontal. O padrão AAA deste projeto significa rigor de produção, consistência visual, resposta imediata, testes repetíveis e ausência de defeitos graves conhecidos. Não significa prometer fotorrealismo ou 60 quadros por segundo em hardware incapaz de sustentar essa carga.

## Objetivos do produto

- Entregar uma corrida arcade compreensível nos primeiros segundos e dominável com prática.
- Fazer cada ultrapassagem, curva, colisão e uso de nitro produzir resposta visual, sonora e mecânica coerente.
- Preservar leitura da pista e controle mesmo em telas pequenas.
- Diferenciar carros, rivais, copas e ambientes por comportamento e identidade visual.
- Manter simulação determinística em 60 Hz e buscar renderização estável em 60 FPS nos dispositivos compatíveis.
- Reduzir a qualidade gráfica antes de permitir instabilidade perceptível.
- Proteger o progresso salvo durante atualizações, rotação e recuperação de cache.

## Diagnóstico da versão atual

As capturas em celular mostram problemas que afetam diretamente a experiência:

- A tipografia usa espaçamento excessivo e aparência de máquina de escrever, reduzindo legibilidade e qualidade percebida.
- O menu principal é uma lista vertical extensa, sem agrupamento nem visão rápida das opções mais importantes.
- Os botões ocupam altura demais e empurram funções básicas para fora da primeira tela.
- O HUD forma uma parede de caixas no topo e disputa espaço com indicador de curva, mensagens e controles.
- Mensagens de engenheiro, ultrapassagem e risco aparecem ao mesmo tempo e repetem informação.
- Elementos flutuantes se sobrepõem no canto inferior direito.
- Faixas e retângulos escuros atravessam a pista sem justificativa visual clara.
- O cenário tem grandes áreas vazias, montanhas semelhantes a manchas e pista aparentemente suspensa.
- Os carros adversários parecem blocos coloridos, variam de escala de forma abrupta e não se integram ao piso.
- O jogador ultrapassa grande parte do pelotão rapidamente, o que elimina tensão e progressão.
- Colisões e contatos não comunicam peso, direção nem consequência de forma confiável.
- O nitro pode responder ao gesto mantido de forma repetitiva e pouco estratégica.

## Princípios de diversão

O núcleo da corrida será acelerar, ler a curva, escolher o risco, executar a manobra e receber uma resposta imediata. Toda mecânica deve reforçar esse ciclo.

- A direção precisa responder imediatamente, mas frenagem, tangência, vácuo e controle de derrapagem devem separar iniciantes de jogadores experientes.
- A pista deve apresentar uma decisão relevante com frequência. Retas longas e trechos vazios precisam de disputa, preparação de curva ou oportunidade estratégica.
- A inteligência artificial deve competir sem trapacear. O jogador precisa entender por que ganhou ou perdeu uma posição.
- Colisões devem punir o erro sem prender o carro ou destruir vários minutos de corrida.
- A sensação de velocidade deve crescer com câmera, áudio e cenário, sem retirar visibilidade.
- A corrida deve ter largada intensa, disputa intermediária e última volta mais tensa, sem trechos longos sem decisão.
- Largada, curva perfeita, vácuo, raspão, ultrapassagem, nitro e chegada devem possuir feedback audiovisual e háptico distintos, respeitando as preferências de acessibilidade.
- Carros desbloqueados devem alterar a pilotagem, não apenas trocar cor e números.
- Recompensas devem surgir em intervalos claros e não exigir repetição artificial.
- A primeira corrida deve demonstrar o melhor do jogo. Conteúdo inicial não pode parecer uma versão inferior à campanha avançada.

## Interface e menu principal

O menu será reconstruído com prioridade para telas pequenas. A tela inicial mostrará uma ação principal e grupos curtos de funções, sem uma coluna interminável.

### Estrutura obrigatória

- Ação principal visível sem rolagem para continuar a carreira.
- Acesso imediato a corrida, garagem, modos e progresso.
- Funções secundárias agrupadas em telas próprias, incluindo troféus, almanaque, estatísticas, economia e ajustes.
- Estado atual do jogador apresentado em uma faixa compacta com fase, carro e moedas.
- Navegação de retorno consistente em todas as telas.
- Confirmação apenas para ações destrutivas, como zerar o progresso.

### Tipografia e controles

- Fonte sem serifa legível para menus e mensagens.
- Fonte numérica com algarismos tabulares para velocidade, tempo, posição e recursos.
- Espaçamento entre letras limitado a títulos curtos.
- Corpo mínimo confortável em telas de 360 pixels de largura.
- Alvos de toque com pelo menos 48 pixels de altura e separação suficiente para evitar toques acidentais.
- Conteúdo e controles respeitam `safe-area-inset-*`, recortes de câmera, barras do navegador e cantos arredondados.
- Contraste adequado sob céu claro, noite, neve, chuva e túneis.

## HUD de corrida

O HUD deve informar sem esconder a pista. A versão vertical usará uma faixa superior compacta. A versão horizontal distribuirá informações nas laterais e manterá o centro livre.

### Informações permanentes

- Posição e total de competidores.
- Velocidade.
- Volta atual e total.
- Nitro.
- Tempo e melhor volta quando relevantes ao modo.

Combustível e dano permanecem visíveis quando influenciam a corrida, mas podem usar indicadores compactos. Dinheiro não deve ocupar espaço permanente durante a pilotagem.

### Mensagens temporárias

- Apenas uma mensagem prioritária por vez.
- Eventos de ultrapassagem, engenheiro e tutorial entram em uma fila curta.
- Mensagens não podem cobrir o carro do jogador, o ponto de tangência ou o indicador de curva.
- Eventos repetidos em poucos segundos devem ser combinados ou descartados.
- Indicador de risco deve encolher quando não houver combo ativo.
- Controle de áudio e acessibilidade não pode ocupar a área do HUD de risco.

## Celular vertical e horizontal

O jogo precisa adaptar composição, controles e câmera. Girar o aparelho não pode reiniciar corrida, perder áudio, alterar volta, zerar nitro ou apagar entradas de controle.

| Orientação | Resoluções de referência | Organização principal | Critério de aceite |
| --- | --- | --- | --- |
| Vertical | 360 por 800  390 por 844  412 por 915  430 por 932 | HUD superior compacto e controles inferiores | Pista e carro permanecem visíveis sem sobreposição |
| Horizontal | 640 por 360  844 por 390  915 por 412  932 por 430 | HUD lateral compacto e centro livre | Nenhum painel reduz a área útil da pista de forma crítica |

### Casos obrigatórios de rotação

- Menu principal.
- Tela de história.
- Preparação da corrida.
- Contagem regressiva.
- Corrida em andamento.
- Pausa.
- Resultado.

O redimensionamento do canvas deve preservar proporção, recalcular densidade de pixels e reposicionar zonas de toque. A simulação não pode depender das dimensões visuais.

As zonas de toque para acelerar, frear, virar e ativar nitro serão independentes, não sobrepostas e verificadas em ambas as orientações. Trocar de orientação com um toque ativo deve cancelar a entrada antiga para impedir aceleração, direção ou nitro fantasma.

## Modelo de direção

- Entrada horizontal deve usar curva de resposta progressiva e zona morta configurável.
- Aderência precisa variar com velocidade, pneu, clima, dano e superfície.
- Frear antes da curva deve produzir vantagem mensurável sobre simplesmente manter aceleração.
- Sair da pista deve reduzir aderência e velocidade de forma gradual, sem prender o jogador.
- Derrapagem deve ser curta, controlável e legível. Não pode ocorrer como rotação aleatória.
- Assistência de direção deve corrigir erros leves sem pilotar toda a corrida, exceto no modo copiloto explicitamente escolhido.
- Controles de toque precisam distinguir aceleração, direção, freio e gesto de nitro sem ativação acidental.

## Sistema de nitro

O nitro será um recurso raro de decisão tática. O jogador deve escolher entre reta longa, saída de curva, ultrapassagem, defesa ou última volta.

### Regras obrigatórias

- Barra única de 0 a 100 por cento.
- Ativação somente quando a barra estiver em 100 por cento.
- Uma carga completa armazenada por vez.
- Duração inicial de balanceamento próxima de quatro segundos.
- Uma ativação por volta no modo carreira.
- Nitro bloqueado durante largada, colisão e recuperação do carro.
- Recarga por curvas limpas, vácuo, ultrapassagens e manobras de risco válidas.
- Sem recarga passiva suficiente para premiar apenas espera.
- A inteligência artificial obedece às mesmas regras de disponibilidade.
- Modos arcade podem alterar limites, desde que apresentem a regra antes da corrida.

### Estados do nitro

| Estado | Entrada aceita | Comportamento | Saída |
| --- | --- | --- | --- |
| Carregando | Nenhuma ativação | Ações válidas elevam a barra até 100 | A barra chega a 100 |
| Pronto | Novo gesto para cima ou botão dedicado | Mantém uma carga completa | O jogador inicia o nitro |
| Ativo | Entradas adicionais são ignoradas | A carga é consumida continuamente até zero | A carga termina ou ocorre colisão forte |
| Bloqueado na volta | Nenhuma ativação | A barra pode indicar progresso, mas não dispara | O jogador inicia a próxima volta |
| Aguardando liberação | Gesto mantido é ignorado | Impede nova ativação automática | O jogador solta o toque |

Manter o dedo para cima não poderá disparar o nitro novamente. Uma nova ativação exige barra completa, volta elegível e uma nova borda de entrada depois que o jogador soltar o controle.

## Colisões e dano

O sistema de colisão será calculado no plano da pista usando posição longitudinal, deslocamento lateral, largura, comprimento, ângulo de contato e velocidade relativa.

- Cada par de carros terá controle de contato para impedir múltiplos impactos no mesmo instante.
- Contato leve gera raspão, pequeno deslocamento e perda limitada de velocidade.
- Impacto lateral forte gera impulso lateral, perda de aderência e dano proporcional.
- Impacto traseiro transfere velocidade dentro de limites e não lança carros para posições impossíveis.
- Barreiras e bordas usam resposta diferente de colisão entre veículos.
- Nenhum carro pode atravessar, grudar, vibrar indefinidamente ou teleportar.
- A câmera usa tremor curto e limitado. O efeito nunca pode impedir a leitura da pista.
- Faíscas, som e marcas visuais refletem a intensidade do impacto.
- Vibração é curta, proporcional e opcional; contatos leves não podem produzir resposta de explosão.
- Nitro ativo é interrompido por impacto forte e permanece bloqueado durante a recuperação.
- Jogador e inteligência artificial recebem consequências equivalentes.

O dano precisa afetar controle, velocidade máxima e estabilidade dentro de limites jogáveis. A corrida deve oferecer recuperação por pilotagem cuidadosa ou pit quando o modo permitir.

## Largada

A largada será uma sequência curta, clara e competitiva.

- Grid visível e espaçado, com carros posicionados sem sobreposição.
- Apresentação breve da pista e do rival principal.
- Semáforo de três estágios com sincronização entre áudio, luz e simulação.
- Aceleração progressiva dos rivais, sem pelotão quase parado.
- Janela de lançamento que concede pequena vantagem por bom timing.
- Entrada antecipada é ignorada nos modos acessíveis e pode causar perda leve de tração nos modos avançados.
- Nitro permanece bloqueado até a largada terminar e o carro percorrer a distância mínima definida.
- A câmera passa para controle do jogador sem corte brusco.

## Inteligência artificial e dificuldade

A dificuldade deve alterar competência, tomada de decisão e tolerância a erros. Não pode depender apenas de aumentar velocidade máxima.

| Perfil | Linha de corrida | Defesa e ultrapassagem | Erros | Assistência dinâmica |
| --- | --- | --- | --- | --- |
| Fácil | Conservadora | Baixa pressão | Frequentes e recuperáveis | Limitada para manter disputa |
| Normal | Competitiva | Defende linhas e usa vácuo | Ocasionais | Pequena e limitada |
| Herói | Próxima da ideal | Ataques planejados e defesa firme | Raros | Mínima |
| Lendário | Ideal com estilos por rival | Sem concessões artificiais | Muito raros | Nenhuma borracha de aproximação |

### Requisitos de comportamento

- Rivais possuem perfis de frenagem, agressividade, defesa e uso de nitro.
- A inteligência artificial reconhece espaço ocupado antes de mudar de linha.
- O pelotão não pode colapsar na primeira curva.
- Ultrapassagens devem ocorrer entre rivais sem depender do jogador.
- Rivais evitam obstáculos e recuperam a linha após contato.
- O modo normal não pode permitir que uma corrida limpa comum saia de último para primeiro em poucos segundos.
- Tempos de referência por pista devem orientar o balanceamento de cada dificuldade.

## Carros e apresentação visual

Os carros deixam de ser blocos coloridos e passam a ter silhueta, material e movimento reconhecíveis.

- Proporções consistentes entre largura, altura e distância aparente.
- Variações de ângulo para direção lateral e derrapagem.
- Rodas, vidros, lanternas, placas, entradas de ar e detalhes próprios por modelo.
- Sombras de contato que prendem o carro ao piso.
- Reflexos e luzes coerentes com clima e horário.
- Estados visuais de dano sem deformações incompreensíveis.
- Escala por distância contínua, evitando saltos de tamanho.
- Paletas distintas que preservam contraste contra neve, asfalto, chuva e noite.
- Atlas e níveis de detalhe para evitar custo excessivo por carro.

Cada carro jogável terá diferenças perceptíveis de aceleração, velocidade final, aderência, frenagem, resistência e resposta do nitro. Nenhum atributo isolado poderá tornar um carro universalmente superior.

## Ambientes e pista

Os ambientes precisam fornecer identidade e também ajudar o jogador a ler velocidade, direção e distância.

### Biomas previstos

- Região alpina e neve.
- Floresta e serra.
- Litoral.
- Deserto e cânions.
- Cidade diurna e noturna.
- Região industrial.
- Vulcão e terreno extremo.

### Construção visual

- Fundo em camadas com céu, horizonte, cenário intermediário e elementos próximos.
- Parallax calibrado por distância e velocidade.
- Terreno acompanhando as bordas da pista para eliminar a aparência de estrada flutuante.
- Montanhas, árvores, prédios e formações com contornos coerentes.
- Barreiras, placas, postes, arquibancadas e marcos visuais específicos de cada pista.
- Túneis e pontes com entrada, interior, iluminação e saída completas.
- Clima com transições graduais e efeitos limitados pela visibilidade.
- Iluminação, névoa, sombra e paleta coerentes com horário e bioma.
- Pontos de referência antes de curvas importantes.

Retângulos escuros sem origem, áreas brancas vazias, montanhas genéricas repetidas e mudanças abruptas de cenário são defeitos bloqueadores de qualidade visual.

## Níveis copas e campanha

O número de pistas não substitui curadoria. As 999 pistas serão avaliadas por variedade, legibilidade e qualidade, com prioridade para uma campanha inicial forte.

- Cada copa terá identidade visual, rival, dificuldade e combinação própria de curvas.
- Pistas repetitivas, vazias, injustas ou visualmente quebradas serão refeitas ou removidas da progressão principal.
- A campanha introduzirá uma mecânica por vez.
- Curvas, clima e obstáculos precisam formar combinações intencionais.
- Marcos visuais ajudam a memorizar pistas e pontos de frenagem.
- Corridas especiais, chefes e eventos substituem variações puramente numéricas.
- Repetição para obter recursos não pode ser requisito dominante de progresso.

## Power ups e modos arcade

O modo carreira usará sistemas coerentes com corrida: nitro, vácuo, aderência, combustível, dano, reparo e pit. Bônus aleatórios não podem decidir o resultado.

- Power ups fantasiosos ficam restritos a modos arcade identificados.
- Ícones e efeitos usam linguagem visual coerente com o arcade retrô premium, sem aparência infantil ou ruído exagerado.
- Coletas não podem surgir fora da pista, dentro de carros ou em pontos sem rota segura.
- Efeitos possuem duração, limite de acúmulo e sinalização clara.
- O jogador entende o efeito antes de precisar reagir.
- A inteligência artificial segue as mesmas possibilidades e limites.
- Nenhum power up substitui habilidade de frenagem, direção ou escolha de linha.

## Áudio

O áudio precisa permanecer contínuo sob carga e durante mudanças de tela.

- Um único contexto de áudio por sessão.
- Barramentos separados para música, motor, efeitos, interface e voz.
- Reutilização de nós e vozes para reduzir criação e coleta de lixo.
- Limite de polifonia por categoria e prioridade para sons críticos.
- Transições de ganho suaves para evitar estalos.
- Motor baseado em camadas ou síntese agendada, sem reinício a cada quadro.
- Crossfade entre música de menu, corrida, pausa e resultado.
- Suspensão e retomada corretas quando o navegador perde visibilidade.
- Desbloqueio de áudio após gesto do usuário conforme exigência do navegador.
- Teste contínuo de pelo menos dez minutos sem cortes perceptíveis.

## Desempenho e estabilidade

A simulação usará passo fixo de 60 Hz separado da renderização. O acumulador terá limite para impedir que um atraso cause uma sequência de atualizações impossível de recuperar.

### Orçamento técnico

| Sistema | Meta principal | Proteção |
| --- | --- | --- |
| Simulação | 60 atualizações por segundo | Limite de recuperação por quadro |
| Renderização | 60 FPS em aparelhos compatíveis | Qualidade adaptativa antes de reduzir FPS |
| Quadro | Mediana próxima de 16,7 ms | Identificar travamentos acima de 50 ms |
| Memória | Sem crescimento contínuo durante corrida | Pools e descarte controlado |
| Áudio | Sem cortes sob carga de corrida | Vozes reutilizadas e polifonia limitada |
| Entrada | Resposta no próximo quadro disponível | Sem trabalho pesado no evento de toque |

- Laços de corrida não podem criar arrays, objetos, nós de áudio ou elementos de interface a cada quadro quando reutilização for possível.
- A densidade de pixels interna terá teto por perfil de qualidade para evitar custo desproporcional em telas móveis de alta resolução.
- Carros, partículas, mensagens e efeitos temporários usarão pools ou estruturas reutilizáveis quando isso reduzir pausas de coleta de lixo.

### Escalonamento de qualidade

1. Reduzir densidade interna do canvas.
2. Reduzir partículas e reflexos.
3. Reduzir detalhes de cenário distante.
4. Reduzir frequência de efeitos não essenciais.
5. Usar 30 FPS estáveis apenas quando o hardware não sustentar 60 FPS após as reduções.

O perfil não pode oscilar rapidamente. A decisão usará média de desempenho e período mínimo antes de trocar novamente.

## Matriz de testes

| Área | Cenários obrigatórios | Resultado esperado |
| --- | --- | --- |
| Inicialização | Primeira visita atualização cache e retorno | Jogo abre sem erro e preserva save |
| Menu | Vertical horizontal e rotação | Ações principais visíveis sem sobreposição |
| História | Avançar voltar e girar aparelho | Estado preservado e texto legível |
| Pré corrida | Pneus seguro garagem e retorno | Seleções preservadas |
| Largada | Todas as dificuldades | Grid estável contagem sincronizada e disputa justa |
| Nitro | Toque curto gesto mantido colisão e nova volta | Uma ativação válida sem repetição automática |
| Colisão | Lateral traseira barreira e múltiplos rivais | Resposta estável sem atravessar ou vibrar |
| Corrida | Cinco voltas pausa rotação e retomada | Volta tempo posição e áudio preservados |
| IA | Pelotão curva ultrapassagem e recuperação | Rivais competitivos sem colapso |
| Áudio | Dez minutos troca de aba e retorno | Sem estalo corte ou duplicação |
| Desempenho | Clima pelotão cheio e efeitos | Qualidade adapta sem travamento grave |
| Resultado | Vitória derrota retry e próxima corrida | Recompensa única e navegação correta |
| Diversão | Corrida curta longa vitória derrota e recuperação | Decisões frequentes resposta clara e vontade de tentar novamente |
| Orientação | Girar em menu história pré corrida largada corrida pausa e resultado | Estado preservado controles rearmados e áreas seguras respeitadas |

## Severidade de defeitos

| Nível | Definição | Exemplos | Regra de publicação |
| --- | --- | --- | --- |
| Bloqueador | Impede jogar ou acessar fluxo principal | Tela presa save perdido corrida não inicia | Publicação proibida |
| Crítico | Corrompe corrida ou progresso | Volta errada nitro infinito colisão impossível | Publicação proibida |
| Grave | Prejudica controle leitura ou estabilidade | HUD cobrindo pista áudio cortando queda severa | Publicação proibida |
| Moderado | Falha visível com contorno possível | Alinhamento secundário animação inconsistente | Corrigir antes da versão final |
| Leve | Polimento sem impacto funcional | Pequena diferença de espaçamento | Pode entrar em lista final documentada |

## Ciclo de implementação e publicação

Cada ciclo seguirá a mesma sequência:

1. Selecionar um conjunto coerente de requisitos desta especificação.
2. Registrar o comportamento atual e criar teste de regressão quando possível.
3. Implementar a correção sem alterar sistemas não relacionados.
4. Validar sintaxe, dados, integridade e fluxo local.
5. Testar em viewport vertical e horizontal.
6. Publicar no repositório GitHub com descrição objetiva.
7. Aguardar o GitHub Pages concluir a implantação.
8. Jogar a versão pública e registrar erros visuais, funcionais e de desempenho.
9. Corrigir regressões e repetir o ciclo.

Cada versão destinada ao teste no celular deve informar a URL pública do jogo, o commit implantado e o link de recuperação de cache. O link de recuperação deve atualizar os arquivos do jogo sem apagar o progresso salvo.

As primeiras etapas de execução serão:

- Estabilizar nitro, colisões, largada, IA e dificuldade.
- Refazer menu, tipografia, HUD e comportamento responsivo.
- Melhorar carros, pista e ambientes.
- Estabilizar áudio e desempenho.
- Executar campanha curta completa antes de ampliar a validação.

## Critérios finais de aceite

O Retrô Racer será considerado pronto quando todos os itens abaixo forem verdadeiros:

- Nenhum defeito bloqueador, crítico ou grave conhecido.
- Menu e corrida funcionam nos tamanhos verticais e horizontais definidos.
- Rotação não reinicia nem altera o estado da corrida.
- Nitro segue integralmente a máquina de estados documentada.
- Colisões não atravessam, prendem, teleportam nem repetem dano por quadro.
- Largada apresenta grid, contagem sincronizada e aceleração competitiva.
- Dificuldade normal exige pilotagem limpa e não entrega o primeiro lugar rapidamente.
- Carros apresentam silhueta, escala, sombra e dano coerentes.
- Ambientes não possuem vazios, blocos sem origem ou transições abruptas.
- Mensagens e HUD não escondem informações críticas.
- Áudio permanece contínuo nos testes de estresse.
- Desempenho adapta a qualidade antes de comprometer a fluidez.
- Save permanece intacto após atualização e recuperação de cache.
- O fluxo completo de carreira foi testado na versão pública publicada.
- Corridas curtas e longas foram jogadas em vitória, derrota e recuperação, com problemas de diversão registrados e corrigidos.
- A entrega final inclui URL pública, commit verificado e link funcional de recuperação de cache para celular.

Esta especificação é a referência para decisões de implementação. Alterações futuras podem ajustar valores de balanceamento, mas não podem reduzir os requisitos de estabilidade, clareza, justiça e qualidade definidos aqui.
