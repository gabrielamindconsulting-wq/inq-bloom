## Escopo

Grande expansão do sistema INQ existente. Vou manter tudo que já foi construído (design system verde, sidebar, páginas de Rastreio, Clínica, Salas, Pacientes, Profissionais, Check-in, Usuários) e adicionar as camadas que faltam, ajustando o que precisa mudar.

## Mudanças no que já existe

1. **Design system (`index.css` + `tailwind.config.ts`)**
   - Adicionar tokens semânticos por especialidade (Fono azul, TO âmbar, Psicologia roxo, Fisio verde, Psicopedagogia rosa, Neuropsicologia teal) — texto + fundo.
   - Fundo do app: `#eef1ef` (cinza-esverdeado). Cards brancos, borda `#e7ebe8`, sombra sutil.
   - Fonte: adicionar Nunito para títulos (700–800); Inter para corpo.
   - KPIs com filete verde à esquerda.

2. **Sidebar (`Layout.tsx`)**
   - Reorganizar em 8 seções: RASTREIO, CLÍNICA, FATURAMENTO, FINANCEIRO, CLÍNICO+, OPERAÇÕES, INSTITUCIONAL, SISTEMA.
   - Cada item com ícone Lucide único (sem repetir).
   - Rodapé com avatar NQ + "Administrador".

3. **Salas (`RoomsPage.tsx`)**
   - Adicionar coluna e campo **Capacidade (profissionais simultâneos)** com texto explicativo ligando à Agenda.

4. **Agenda (`AgendaPage.tsx`) — reconstrução completa**
   - Trocar grade "dia da semana × horário" por **grade sala × horário** de uma unidade.
   - Segmented control Asa Sul / Águas Claras no topo.
   - Colunas = salas da unidade (cabeçalho: nome + capacidade).
   - Linhas = slots de 15 min, das 07:00 às 19:00. Linhas de hora cheia destacadas.
   - Cada célula (sala × slot) renderiza `capacidade` sub-quadrados: ocupado (colorido pela especialidade, mostra 1º nome do paciente no bloco inicial, tooltip com detalhes) ou vazio (tracejado = vaga livre).
   - Uma sessão preenche a mesma vaga ao longo da duração inteira.
   - Cabeçalho de salas fixo verticalmente, coluna de horário fixa horizontalmente.
   - Toolbar: unidade, navegação de data, filtro de especialidade, legenda, "Nova Sessão".
   - Manter modal de detalhe existente (com botão "Substituição").

## Novos dados mockados

Em `src/data/clinicalMockData.ts` (extensão) e novos arquivos:
- `Unidade`, `Sala { capacidade }`, `Sessao { salaId, vaga, inicio, duracaoMin }`.
- Mocks de convênios, guias, faturamento, glosas, repasses, fluxo de caixa, margem, DRE, avaliações, PTS, relatórios, ocupação, metas, grade convênio, RH, CRM, IA base, governança.

## Novas páginas (todas com dados mockados, seguindo padrão visual)

FATURAMENTO
- `/convenios` — Convênios & Valores
- `/guias` — Guias & Autorizações
- `/faturamento` — Faturamento
- `/glosas` — Glosas
- `/repasses` — Repasses

FINANCEIRO
- `/fluxo-caixa` — Fluxo de Caixa
- `/margem` — Margem de Contribuição
- `/dre` — DRE Gerencial

CLÍNICO+
- `/protocolos` — Protocolos & Avaliações
- `/pts` — PTS
- `/relatorios` — Relatórios Automáticos

OPERAÇÕES
- `/ocupacao` — Ocupação de Salas (parede interativa sala × horário)
- `/metas-agenda` — Metas de Agenda
- `/grade-convenio` — Grade p/ Convênio

INSTITUCIONAL
- `/rh` — RH
- `/crm` — CRM Comercial
- `/ia` — IA Institucional
- `/governanca` — Governança

Cada página segue o mesmo shell: KPIs no topo (com filete verde nos principais), gráficos Recharts proporcionais, tabelas densas com hover, botões de exportação PDF/Excel (mock — apenas UI). Sem emojis, apenas ícones Lucide.

## Detalhes técnicos

- Rotas registradas em `App.tsx`.
- Novos componentes reutilizáveis: `KpiCard` (com filete opcional), `PageSection`, `ExportButtons`.
- Recharts para todos os gráficos, cores da paleta.
- Todas as tabelas usam shadcn `Table`.
- Nenhum backend — estado local + mock estático.
- 100% PT-BR, formato DD/MM/AAAA, HH:MM 24h.

## Ordem de execução

1. Design system + Layout/sidebar reorganizada.
2. Página Agenda (grade por sala) + ajuste de Salas (capacidade) + mocks Unidade/Sala/Sessao.
3. Mocks das demais áreas.
4. Componentes compartilhados (KpiCard, ExportButtons).
5. Páginas de Faturamento (5).
6. Páginas de Financeiro (3).
7. Páginas de Clínico+ (3).
8. Páginas de Operações (3).
9. Páginas Institucionais (4).
10. Rotas em App.tsx.

## Fora de escopo

- Backend / persistência (Lovable Cloud não é habilitado nesta fase).
- Exportação real de PDF/Excel — apenas os botões e toast de confirmação.
- IA Institucional é UI de chat mockada, sem chamadas reais.
- Permissões por perfil (mostradas na UI onde relevante, mas sem enforcement).