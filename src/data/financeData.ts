export type ModeloPagamento = "sessao" | "pacote_horas" | "paciente" | "lote";

export const MODELO_PAGAMENTO_LABEL: Record<ModeloPagamento, string> = {
  sessao: "Por sessão",
  pacote_horas: "Por pacote de horas",
  paciente: "Por paciente",
  lote: "Por lote/protocolo",
};

export const ESPECIALIDADES_CLINICA = [
  "Fonoaudiologia",
  "Terapia Ocupacional",
  "Psicologia",
  "Fisioterapia",
  "Psicopedagogia",
  "Neuropsicologia",
  "Musicoterapia",
  "Nutrição",
] as const;

export interface EspecialidadeConvenio {
  especialidade: string;
  codigo: string;
  valor: number;
}

export interface Convenio {
  id: string;
  nome: string;
  codigoClinica: string;
  contratos: string[];
  modeloPagamento: ModeloPagamento;
  prazoFaturamento: number;
  prazoRecursoGlosa: number;
  prazoContestacao: number;
  prazoPagamento: number;
  pmr: number;
  taxaAdministracao: number | null;
  aliquotaImposto: number;
  glosaAceitavel: number;
  senhaPorEspecialidade: boolean;
  pagamentoPorPaciente: boolean;
  equivalenciaPacote?: string;
  pacientes: number;
  especialidades: EspecialidadeConvenio[];
}

export const MOCK_CONVENIOS: Convenio[] = [
  {
    id: "cv-gap", nome: "GAP", codigoClinica: "INQ-4471", contratos: ["Contrato GAP 2024.pdf", "Aditivo 01/2025.pdf"],
    modeloPagamento: "sessao", prazoFaturamento: 10, prazoRecursoGlosa: 60, prazoContestacao: 30,
    prazoPagamento: 30, pmr: 38, taxaAdministracao: null, aliquotaImposto: 8.15, glosaAceitavel: 3,
    senhaPorEspecialidade: false, pagamentoPorPaciente: false, pacientes: 42,
    especialidades: [
      { especialidade: "Fonoaudiologia", codigo: "50000470", valor: 145 },
      { especialidade: "Terapia Ocupacional", codigo: "50000623", valor: 150 },
      { especialidade: "Psicologia", codigo: "50000560", valor: 160 },
      { especialidade: "Fisioterapia", codigo: "50000330", valor: 120 },
    ],
  },
  {
    id: "cv-cassi", nome: "Cassi", codigoClinica: "INQ-2210", contratos: ["Contrato Cassi 2023.pdf"],
    modeloPagamento: "sessao", prazoFaturamento: 5, prazoRecursoGlosa: 90, prazoContestacao: 30,
    prazoPagamento: 45, pmr: 52, taxaAdministracao: null, aliquotaImposto: 7.5, glosaAceitavel: 4,
    senhaPorEspecialidade: true, pagamentoPorPaciente: false, pacientes: 28,
    especialidades: [
      { especialidade: "Fonoaudiologia", codigo: "20104090", valor: 138 },
      { especialidade: "Terapia Ocupacional", codigo: "20104120", valor: 142 },
      { especialidade: "Psicologia", codigo: "20104201", valor: 155 },
    ],
  },
  {
    id: "cv-postal", nome: "Postal Saúde", codigoClinica: "INQ-8890", contratos: ["Contrato Postal 2025.pdf"],
    modeloPagamento: "sessao", prazoFaturamento: 8, prazoRecursoGlosa: 60, prazoContestacao: 20,
    prazoPagamento: 30, pmr: 34, taxaAdministracao: null, aliquotaImposto: 6.15, glosaAceitavel: 2.5,
    senhaPorEspecialidade: false, pagamentoPorPaciente: false, pacientes: 19,
    especialidades: [
      { especialidade: "Fonoaudiologia", codigo: "PS-FON-01", valor: 130 },
      { especialidade: "Psicopedagogia", codigo: "PS-PSP-04", valor: 128 },
    ],
  },
  {
    id: "cv-assefaz", nome: "Saúde Caixa (via ASSEFAZ)", codigoClinica: "INQ-3312", contratos: ["Contrato ASSEFAZ.pdf"],
    modeloPagamento: "pacote_horas", prazoFaturamento: 10, prazoRecursoGlosa: 45, prazoContestacao: 30,
    prazoPagamento: 60, pmr: 71, taxaAdministracao: 5, aliquotaImposto: 8.15, glosaAceitavel: 5,
    senhaPorEspecialidade: false, pagamentoPorPaciente: false, equivalenciaPacote: "1 hora de pacote = 2 sessões de 30 min ou 1 sessão de 45 min pareada",
    pacientes: 24,
    especialidades: [
      { especialidade: "Terapia Ocupacional", codigo: "AS-HORA-TO", valor: 210 },
      { especialidade: "Fonoaudiologia", codigo: "AS-HORA-FON", valor: 205 },
    ],
  },
  {
    id: "cv-mhp", nome: "MHP", codigoClinica: "INQ-1180", contratos: ["Contrato MHP 2024.pdf"],
    modeloPagamento: "paciente", prazoFaturamento: 12, prazoRecursoGlosa: 30, prazoContestacao: 15,
    prazoPagamento: 45, pmr: 58, taxaAdministracao: 7, aliquotaImposto: 8.15, glosaAceitavel: 4,
    senhaPorEspecialidade: false, pagamentoPorPaciente: true, pacientes: 11,
    especialidades: [
      { especialidade: "Psicologia", codigo: "MHP-PSI", valor: 165 },
      { especialidade: "Fonoaudiologia", codigo: "MHP-FON", valor: 150 },
    ],
  },
  {
    id: "cv-geap", nome: "GEAP", codigoClinica: "INQ-6620", contratos: ["Contrato GEAP.pdf"],
    modeloPagamento: "lote", prazoFaturamento: 10, prazoRecursoGlosa: 60, prazoContestacao: 30,
    prazoPagamento: 40, pmr: 46, taxaAdministracao: null, aliquotaImposto: 8.15, glosaAceitavel: 3.5,
    senhaPorEspecialidade: false, pagamentoPorPaciente: false, pacientes: 16,
    especialidades: [
      { especialidade: "Fonoaudiologia", codigo: "GE-2210", valor: 142 },
      { especialidade: "Terapia Ocupacional", codigo: "GE-2214", valor: 148 },
      { especialidade: "Neuropsicologia", codigo: "GE-2260", valor: 320 },
    ],
  },
];

/* ---------------- Faturamento por lote ---------------- */

export type StatusPagamento = "pendente" | "recebido_integral" | "recebido_parcial" | "vencido";

export const STATUS_PAGAMENTO_LABEL: Record<StatusPagamento, string> = {
  pendente: "Pendente",
  recebido_integral: "Recebido integral",
  recebido_parcial: "Recebido parcial",
  vencido: "Vencido",
};

export const STATUS_PAGAMENTO_CLASS: Record<StatusPagamento, string> = {
  pendente: "bg-blue-100 text-blue-800",
  recebido_integral: "bg-emerald-100 text-emerald-800",
  recebido_parcial: "bg-amber-100 text-amber-800",
  vencido: "bg-red-100 text-red-800",
};

export interface GuiaDoLote {
  paciente: string;
  senha: string;
  sessoes: number;
  valor: number;
}

export interface Lote {
  id: string;
  convenio: string;
  protocolo: string;
  unidade: "Asa Sul" | "Águas Claras";
  competencia: string;
  dataEnvio: string;
  qtdGuias: number;
  valorBruto: number;
  glosa: number;
  taxaAdm: number;
  imposto: number;
  dataPrevista: string;
  dataPmr: string;
  dataRealPagamento: string | null;
  valorRecebido: number | null;
  status: StatusPagamento;
  observacao?: string;
  guias: GuiaDoLote[];
}

export const liquidoLote = (l: Lote) => l.valorBruto - l.glosa - l.taxaAdm - l.imposto;

export const MOCK_LOTES: Lote[] = [
  {
    id: "lt1", convenio: "GAP", protocolo: "PRT-2026-03-0041", unidade: "Asa Sul", competencia: "Fev/2026",
    dataEnvio: "05/03/2026", qtdGuias: 38, valorBruto: 59740, glosa: 0, taxaAdm: 0, imposto: 4869,
    dataPrevista: "04/04/2026", dataPmr: "12/04/2026", dataRealPagamento: null, valorRecebido: null,
    status: "pendente",
    guias: [
      { paciente: "Lucas Mendes", senha: "8829410023", sessoes: 16, valor: 2320 },
      { paciente: "Marina Souza", senha: "8829410031", sessoes: 12, valor: 1740 },
      { paciente: "Felipe Cardoso", senha: "8829410048", sessoes: 20, valor: 3000 },
    ],
  },
  {
    id: "lt2", convenio: "Cassi", protocolo: "PRT-2026-03-0042", unidade: "Águas Claras", competencia: "Fev/2026",
    dataEnvio: "05/03/2026", qtdGuias: 26, valorBruto: 42880, glosa: 1240, taxaAdm: 0, imposto: 3216,
    dataPrevista: "19/04/2026", dataPmr: "26/04/2026", dataRealPagamento: "22/04/2026", valorRecebido: 38200,
    status: "recebido_parcial", observacao: "Diferença referente a 8 sessões glosadas por falta de assinatura (cód. 1708).",
    guias: [
      { paciente: "Ana Beatriz", senha: "CS-771204", sessoes: 14, valor: 1932 },
      { paciente: "Pedro Henrique", senha: "CS-771219", sessoes: 10, valor: 1380 },
    ],
  },
  {
    id: "lt3", convenio: "Postal Saúde", protocolo: "PRT-2026-03-0043", unidade: "Asa Sul", competencia: "Fev/2026",
    dataEnvio: "05/03/2026", qtdGuias: 18, valorBruto: 24570, glosa: 0, taxaAdm: 0, imposto: 1511,
    dataPrevista: "04/04/2026", dataPmr: "08/04/2026", dataRealPagamento: "06/04/2026", valorRecebido: 23059,
    status: "recebido_integral",
    guias: [{ paciente: "Sofia Almeida", senha: "PS-004412", sessoes: 18, valor: 2340 }],
  },
  {
    id: "lt4", convenio: "MHP", protocolo: "PRT-2026-02-0038", unidade: "Águas Claras", competencia: "Jan/2026",
    dataEnvio: "08/02/2026", qtdGuias: 1, valorBruto: 3300, glosa: 0, taxaAdm: 231, imposto: 269,
    dataPrevista: "25/03/2026", dataPmr: "07/04/2026", dataRealPagamento: null, valorRecebido: null,
    status: "vencido",
    guias: [{ paciente: "Rafael Torres", senha: "MHP-9901", sessoes: 20, valor: 3300 }],
  },
  {
    id: "lt5", convenio: "Saúde Caixa (via ASSEFAZ)", protocolo: "PRT-2026-03-0044", unidade: "Asa Sul", competencia: "Fev/2026",
    dataEnvio: "06/03/2026", qtdGuias: 12, valorBruto: 31500, glosa: 620, taxaAdm: 1575, imposto: 2567,
    dataPrevista: "05/05/2026", dataPmr: "16/05/2026", dataRealPagamento: null, valorRecebido: null,
    status: "pendente",
    guias: [
      { paciente: "Isabela Nunes", senha: "AS-33120", sessoes: 8, valor: 1680 },
      { paciente: "Théo Barbosa", senha: "AS-33128", sessoes: 10, valor: 2100 },
    ],
  },
];

/* ---------------- Glosas e contestações ---------------- */

export type StatusGlosa = "em_analise" | "correcao" | "recurso_enviado" | "recuperada" | "perdida";

export const STATUS_GLOSA_LABEL: Record<StatusGlosa, string> = {
  em_analise: "Em análise",
  correcao: "Correção",
  recurso_enviado: "Recurso enviado",
  recuperada: "Recuperada",
  perdida: "Perdida",
};

export const STATUS_GLOSA_CLASS: Record<StatusGlosa, string> = {
  em_analise: "bg-blue-100 text-blue-800",
  correcao: "bg-amber-100 text-amber-800",
  recurso_enviado: "bg-violet-100 text-violet-800",
  recuperada: "bg-emerald-100 text-emerald-800",
  perdida: "bg-red-100 text-red-800",
};

export interface Glosa {
  id: string;
  convenio: string;
  unidade: "Asa Sul" | "Águas Claras";
  competencia: string;
  mesFaturamento: string;
  protocoloOriginal: string;
  valorFaturado: number;
  valorGlosado: number;
  motivoCodigo: string;
  motivoDescricao: string;
  dataIdentificacao: string;
  prazoRecurso: string;
  diasParaPrazo: number;
  dataEnvioRecurso: string | null;
  protocoloRecurso: string | null;
  valorSolicitado: number;
  valorAceito: number;
  valorNegado: number;
  dataPagamentoRecurso: string | null;
  status: StatusGlosa;
}

export const MOCK_GLOSAS: Glosa[] = [
  {
    id: "GL-2026-018", convenio: "GAP", unidade: "Asa Sul", competencia: "Fev/2026", mesFaturamento: "Mar/2026",
    protocoloOriginal: "PRT-2026-03-0041", valorFaturado: 59740, valorGlosado: 1240,
    motivoCodigo: "1708", motivoDescricao: "Falta de assinatura do responsável",
    dataIdentificacao: "20/02/2026", prazoRecurso: "17/03/2026", diasParaPrazo: 12,
    dataEnvioRecurso: null, protocoloRecurso: null, valorSolicitado: 0, valorAceito: 0, valorNegado: 0,
    dataPagamentoRecurso: null, status: "correcao",
  },
  {
    id: "GL-2026-011", convenio: "Cassi", unidade: "Águas Claras", competencia: "Jan/2026", mesFaturamento: "Fev/2026",
    protocoloOriginal: "PRT-2026-02-0031", valorFaturado: 41200, valorGlosado: 2380,
    motivoCodigo: "1402", motivoDescricao: "Sessão fora da autorização",
    dataIdentificacao: "05/02/2026", prazoRecurso: "06/05/2026", diasParaPrazo: 26,
    dataEnvioRecurso: "18/02/2026", protocoloRecurso: "REC-88214", valorSolicitado: 2380, valorAceito: 900,
    valorNegado: 1480, dataPagamentoRecurso: "12/03/2026", status: "recurso_enviado",
  },
  {
    id: "GL-2026-007", convenio: "Postal Saúde", unidade: "Asa Sul", competencia: "Jan/2026", mesFaturamento: "Fev/2026",
    protocoloOriginal: "PRT-2026-02-0027", valorFaturado: 22800, valorGlosado: 520,
    motivoCodigo: "0901", motivoDescricao: "Código de procedimento incorreto",
    dataIdentificacao: "02/02/2026", prazoRecurso: "03/04/2026", diasParaPrazo: 42,
    dataEnvioRecurso: "09/02/2026", protocoloRecurso: "REC-55102", valorSolicitado: 520, valorAceito: 520,
    valorNegado: 0, dataPagamentoRecurso: "01/03/2026", status: "recuperada",
  },
  {
    id: "GL-2026-004", convenio: "MHP", unidade: "Águas Claras", competencia: "Dez/2025", mesFaturamento: "Jan/2026",
    protocoloOriginal: "PRT-2026-01-0019", valorFaturado: 3300, valorGlosado: 330,
    motivoCodigo: "2201", motivoDescricao: "Duplicidade de lançamento",
    dataIdentificacao: "10/01/2026", prazoRecurso: "09/02/2026", diasParaPrazo: -25,
    dataEnvioRecurso: "20/01/2026", protocoloRecurso: "REC-31007", valorSolicitado: 330, valorAceito: 0,
    valorNegado: 330, dataPagamentoRecurso: null, status: "perdida",
  },
  {
    id: "GL-2026-021", convenio: "Saúde Caixa (via ASSEFAZ)", unidade: "Asa Sul", competencia: "Fev/2026", mesFaturamento: "Mar/2026",
    protocoloOriginal: "PRT-2026-03-0044", valorFaturado: 31500, valorGlosado: 620,
    motivoCodigo: "1105", motivoDescricao: "Pacote de horas excedido",
    dataIdentificacao: "01/03/2026", prazoRecurso: "15/04/2026", diasParaPrazo: 38,
    dataEnvioRecurso: null, protocoloRecurso: null, valorSolicitado: 0, valorAceito: 0, valorNegado: 0,
    dataPagamentoRecurso: null, status: "em_analise",
  },
];

export interface Contestacao {
  id: string;
  glosaId: string;
  convenio: string;
  competencia: string;
  dataNegativa: string;
  valorEmDisputa: number;
  prazoContestacao: string;
  diasParaPrazo: number;
  dataEnvioContestacao: string | null;
  observacao: string;
  recuperou: "sim" | "nao" | "negociacao" | null;
  valorRecuperado: number;
}

export const MOCK_CONTESTACOES: Contestacao[] = [
  {
    id: "CT-2026-003", glosaId: "GL-2026-011", convenio: "Cassi", competencia: "Jan/2026",
    dataNegativa: "25/02/2026", valorEmDisputa: 1480, prazoContestacao: "27/03/2026", diasParaPrazo: 22,
    dataEnvioContestacao: null,
    observacao: "Convênio alegou ausência de autorização prévia. Anexadas as senhas por especialidade e a agenda do paciente.",
    recuperou: null, valorRecuperado: 0,
  },
  {
    id: "CT-2026-001", glosaId: "GL-2026-004", convenio: "MHP", competencia: "Dez/2025",
    dataNegativa: "05/02/2026", valorEmDisputa: 330, prazoContestacao: "20/02/2026", diasParaPrazo: -14,
    dataEnvioContestacao: "12/02/2026",
    observacao: "Contestação negada. Tentativa de negociação com o responsável sem sucesso.",
    recuperou: "nao", valorRecuperado: 0,
  },
  {
    id: "CT-2026-002", glosaId: "GL-2026-018", convenio: "GAP", competencia: "Dez/2025",
    dataNegativa: "30/01/2026", valorEmDisputa: 860, prazoContestacao: "01/03/2026", diasParaPrazo: -4,
    dataEnvioContestacao: "10/02/2026",
    observacao: "Responsável assinou termo retroativo; valor acordado diretamente com a família.",
    recuperou: "negociacao", valorRecuperado: 860,
  },
];
