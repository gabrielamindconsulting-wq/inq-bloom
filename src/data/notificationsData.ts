export type NotifModulo =
  | "Faturamento"
  | "Glosas"
  | "Guias"
  | "Financeiro"
  | "Repasse";

export type NotifStatus = "nao_lido" | "lido" | "resolvido";
export type NotifSeveridade = "verde" | "amarelo" | "vermelho";

export interface Notificacao {
  id: string;
  modulo: NotifModulo;
  gatilho: string;
  descricao: string;
  referencia: string;
  data: string;
  prazo: string;
  diasRestantes: number;
  severidade: NotifSeveridade;
  status: NotifStatus;
  rota: string;
}

export const SEVERIDADE_CLASS: Record<NotifSeveridade, string> = {
  verde: "bg-emerald-100 text-emerald-800",
  amarelo: "bg-amber-100 text-amber-800",
  vermelho: "bg-red-100 text-red-800",
};

export const SEVERIDADE_LABEL: Record<NotifSeveridade, string> = {
  verde: "Dentro do prazo",
  amarelo: "Atenção",
  vermelho: "Crítico",
};

export const STATUS_NOTIF_LABEL: Record<NotifStatus, string> = {
  nao_lido: "Não lido",
  lido: "Lido",
  resolvido: "Resolvido",
};

/** Regra de cor por prazo: >30d verde, <=30d amarelo, <=15d ou vencido vermelho */
export function severidadePorPrazo(dias: number): NotifSeveridade {
  if (dias <= 15) return "vermelho";
  if (dias <= 30) return "amarelo";
  return "verde";
}

export const MOCK_NOTIFICACOES: Notificacao[] = [
  {
    id: "N-001", modulo: "Guias", gatilho: "Guia próxima do vencimento",
    descricao: "Guia GA-2026-0421 (Lucas Mendes · GAP) vence em 11 dias — padrão do convênio: alerta 15 dias.",
    referencia: "GA-2026-0421", data: "01/04/2026", prazo: "12/04/2026", diasRestantes: 11,
    severidade: "vermelho", status: "nao_lido", rota: "/guias",
  },
  {
    id: "N-002", modulo: "Guias", gatilho: "Guia próxima do vencimento",
    descricao: "Guia GA-2026-0301 (Pedro Henrique · Postal Saúde) vence em 22 dias.",
    referencia: "GA-2026-0301", data: "28/02/2026", prazo: "22/03/2026", diasRestantes: 22,
    severidade: "amarelo", status: "nao_lido", rota: "/guias",
  },
  {
    id: "N-003", modulo: "Guias", gatilho: "Senha por especialidade pendente",
    descricao: "Cassi — faltam 2 senhas por especialidade para a competência 03/2026 (Fono e TO).",
    referencia: "Cassi 03/2026", data: "02/03/2026", prazo: "10/03/2026", diasRestantes: 8,
    severidade: "vermelho", status: "lido", rota: "/guias",
  },
  {
    id: "N-004", modulo: "Faturamento", gatilho: "Prazo de faturamento próximo",
    descricao: "Lote GEAP competência 02/2026 deve ser enviado até 10/03 — 3 dias restantes.",
    referencia: "L-2026-03-GEA", data: "05/03/2026", prazo: "10/03/2026", diasRestantes: 3,
    severidade: "vermelho", status: "nao_lido", rota: "/faturamento",
  },
  {
    id: "N-005", modulo: "Faturamento", gatilho: "Prazo de faturamento próximo",
    descricao: "Lote Embrapa 02/2026 sem número de protocolo informado.",
    referencia: "Embrapa 02/2026", data: "05/03/2026", prazo: "15/03/2026", diasRestantes: 8,
    severidade: "vermelho", status: "nao_lido", rota: "/faturamento",
  },
  {
    id: "N-006", modulo: "Faturamento", gatilho: "Recebimento parcial sem justificativa",
    descricao: "Lote L-2026-02-BRA recebido parcialmente (R$ 38.200 de R$ 42.880) — observação obrigatória pendente.",
    referencia: "L-2026-02-BRA", data: "03/03/2026", prazo: "08/03/2026", diasRestantes: 5,
    severidade: "vermelho", status: "lido", rota: "/faturamento",
  },
  {
    id: "N-007", modulo: "Glosas", gatilho: "Prazo de recurso próximo do vencimento",
    descricao: "Glosa 1708 (falta de assinatura) · GAP · R$ 1.240 — prazo de recurso em 12 dias.",
    referencia: "GL-2026-018", data: "20/02/2026", prazo: "17/03/2026", diasRestantes: 12,
    severidade: "vermelho", status: "nao_lido", rota: "/glosas",
  },
  {
    id: "N-008", modulo: "Glosas", gatilho: "Prazo de contestação próximo",
    descricao: "Recurso negado pela Cassi — contestação deve ser enviada em até 26 dias.",
    referencia: "GL-2026-011", data: "25/02/2026", prazo: "01/04/2026", diasRestantes: 26,
    severidade: "amarelo", status: "nao_lido", rota: "/glosas",
  },
  {
    id: "N-009", modulo: "Glosas", gatilho: "Taxa de glosa acima do aceitável",
    descricao: "Bradesco Saúde: 5,8% de glosa no mês contra 3,0% aceitável cadastrado.",
    referencia: "Bradesco 02/2026", data: "01/03/2026", prazo: "—", diasRestantes: 45,
    severidade: "verde", status: "resolvido", rota: "/glosas",
  },
  {
    id: "N-010", modulo: "Financeiro", gatilho: "Pagamento previsto vencido",
    descricao: "SulAmérica — R$ 18.400 previstos para 28/02 sem recebimento. Inadimplência acionada.",
    referencia: "L-2026-01-SUL", data: "01/03/2026", prazo: "28/02/2026", diasRestantes: -6,
    severidade: "vermelho", status: "nao_lido", rota: "/inadimplencia",
  },
  {
    id: "N-011", modulo: "Financeiro", gatilho: "Particular pós-pago vencido",
    descricao: "3 boletos particulares do dia 10 sem baixa há mais de 5 dias.",
    referencia: "Particular 02/2026", data: "16/02/2026", prazo: "10/02/2026", diasRestantes: -20,
    severidade: "vermelho", status: "lido", rota: "/inadimplencia",
  },
  {
    id: "N-012", modulo: "Financeiro", gatilho: "Conciliação bancária pendente",
    descricao: "Extrato da semana 09 (Águas Claras) com 14 lançamentos não conciliados.",
    referencia: "Semana 09", data: "02/03/2026", prazo: "09/03/2026", diasRestantes: 7,
    severidade: "vermelho", status: "nao_lido", rota: "/conciliacao",
  },
  {
    id: "N-013", modulo: "Repasse", gatilho: "Nota fiscal do prestador pendente após o dia 10",
    descricao: "Dra. Carla Dias não enviou a NF da competência 02/2026.",
    referencia: "Fev/2026 · Carla Dias", data: "11/03/2026", prazo: "10/03/2026", diasRestantes: -1,
    severidade: "vermelho", status: "nao_lido", rota: "/repasses",
  },
  {
    id: "N-014", modulo: "Repasse", gatilho: "Sessões sem evolução bloqueando repasse",
    descricao: "Dra. Beatriz Rosa: 36 sessões realizadas, 31 evoluídas — 5 sessões bloqueadas.",
    referencia: "Fev/2026 · Beatriz Rosa", data: "01/03/2026", prazo: "10/03/2026", diasRestantes: 9,
    severidade: "vermelho", status: "nao_lido", rota: "/repasses",
  },
];

export function contarPendencias(modulo: NotifModulo) {
  return MOCK_NOTIFICACOES.filter(n => n.modulo === modulo && n.status !== "resolvido").length;
}

export const CONTADORES: Record<NotifModulo, number> = {
  Faturamento: contarPendencias("Faturamento"),
  Glosas: contarPendencias("Glosas"),
  Guias: contarPendencias("Guias"),
  Financeiro: contarPendencias("Financeiro"),
  Repasse: contarPendencias("Repasse"),
};

export const TOTAL_PENDENCIAS = Object.values(CONTADORES).reduce((a, b) => a + b, 0);
