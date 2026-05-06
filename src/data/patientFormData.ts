// Extended patient form types + localStorage persistence (mock)
import { z } from "zod";
import { Especialidade } from "./clinicalMockData";

export const CID_OPTIONS = [
  { code: "F84.0", label: "F84.0 — Autismo infantil" },
  { code: "F84.1", label: "F84.1 — Autismo atípico" },
  { code: "F84.5", label: "F84.5 — Síndrome de Asperger" },
  { code: "F84.9", label: "F84.9 — TEA não especificado" },
  { code: "F90.0", label: "F90.0 — Distúrbios da atividade e atenção (TDAH)" },
  { code: "F90.1", label: "F90.1 — Transtorno hipercinético de conduta" },
  { code: "F80.0", label: "F80.0 — Transtorno fonológico" },
  { code: "F80.1", label: "F80.1 — Transtorno expressivo da linguagem" },
  { code: "F80.2", label: "F80.2 — Transtorno receptivo da linguagem" },
  { code: "F81.0", label: "F81.0 — Dislexia" },
  { code: "F81.2", label: "F81.2 — Discalculia" },
  { code: "F82",   label: "F82 — Transtorno do desenvolvimento motor" },
  { code: "F70",   label: "F70 — Deficiência intelectual leve" },
  { code: "F71",   label: "F71 — Deficiência intelectual moderada" },
  { code: "F72",   label: "F72 — Deficiência intelectual grave" },
  { code: "F79",   label: "F79 — Deficiência intelectual não especificada" },
];

export const COMORBIDADES = ["Epilepsia", "Transtorno do sono", "Transtorno alimentar", "Ansiedade", "Deficiência intelectual", "Outros"] as const;
export const GATILHOS_SENSORIAIS = ["Ruídos altos", "Luzes fortes", "Texturas específicas", "Cheiros", "Multidões", "Toque", "Transições"] as const;
export const ESTIMULOS_REGULATORIOS = ["Música", "Balanço", "Peso", "Escuro", "Objeto de apego", "Movimento"] as const;
export const COMPORTAMENTOS_RISCO = ["Autoagressão", "Heteroagressão", "Fuga / Elopement", "Automutilação", "Nenhum"] as const;
export const CONVENIOS = ["GEAP", "CASSI", "Saúde Caixa", "Cassbrapa", "Unimed", "Amil", "Outro"];
export const PARENTESCOS = ["Mãe", "Pai", "Avó", "Avô", "Tutor", "Outro"];
export const PERIODOS_ESCOLARES = ["Manhã", "Tarde", "Integral", "Não estuda"];
export const ORIGENS_LEAD = ["Instagram", "Google", "Indicação de paciente", "Indicação do convênio", "Indicação médica", "Outro"];
export const FUNIL_STATUS = [
  { value: "novo", label: "Novo" },
  { value: "avaliacao", label: "Em avaliação" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "desligado", label: "Desligado" },
];

// ─── Schemas ───
export const responsavelSchema = z.object({
  nome: z.string().trim().min(2, "Nome obrigatório").max(120),
  cpf: z.string().trim().max(14).optional().or(z.literal("")),
  rg: z.string().trim().max(20).optional().or(z.literal("")),
  telefone1: z.string().trim().min(8, "Telefone obrigatório").max(20),
  telefone1Whats: z.boolean().default(false),
  telefone2: z.string().trim().max(20).optional().or(z.literal("")),
  telefone2Whats: z.boolean().default(false),
  email: z.string().trim().email("Email inválido").max(255).optional().or(z.literal("")),
  parentesco: z.string().min(1, "Obrigatório"),
  principal: z.boolean().default(false),
  titularConvenio: z.boolean().default(false),
  recebeComunicacoes: z.boolean().default(true),
});

export const medicacaoSchema = z.object({
  nome: z.string().trim().max(120).optional().or(z.literal("")),
  dosagem: z.string().trim().max(60).optional().or(z.literal("")),
  horarios: z.array(z.string()).default([]),
  prescritor: z.string().trim().max(120).optional().or(z.literal("")),
  efeitos: z.string().trim().max(500).optional().or(z.literal("")),
});

export const especAtivaSchema = z.object({
  especialidade: z.string(),
  profissionalId: z.string().optional().or(z.literal("")),
  cargaHorariaSemanal: z.coerce.number().min(0).max(40).optional(),
  dataInicio: z.string().optional().or(z.literal("")),
});

export const patientFormSchema = z.object({
  // Aba 1
  nome: z.string().trim().min(2, "Nome obrigatório").max(120),
  dataNascimento: z.string().min(1, "Data obrigatória"),
  sexo: z.enum(["Masculino", "Feminino", "Outro"]).optional(),
  fotoUrl: z.string().optional().or(z.literal("")),
  cpf: z.string().trim().max(14).optional().or(z.literal("")),
  rgCertidao: z.string().trim().max(40).optional().or(z.literal("")),
  cep: z.string().trim().max(10).optional().or(z.literal("")),
  logradouro: z.string().trim().max(200).optional().or(z.literal("")),
  numero: z.string().trim().max(20).optional().or(z.literal("")),
  complemento: z.string().trim().max(60).optional().or(z.literal("")),
  bairro: z.string().trim().max(100).optional().or(z.literal("")),
  cidade: z.string().trim().max(100).optional().or(z.literal("")),
  uf: z.string().trim().max(2).optional().or(z.literal("")),
  escola: z.string().trim().max(120).optional().or(z.literal("")),
  periodoEscolar: z.string().optional().or(z.literal("")),
  temAT: z.boolean().default(false),

  // Aba 2
  responsaveis: z.array(responsavelSchema).min(1, "Pelo menos 1 responsável"),

  // Aba 3
  cidPrincipal: z.string().optional().or(z.literal("")),
  cidsSecundarios: z.array(z.string()).default([]),
  nivelSuporteTEA: z.enum(["1", "2", "3"]).optional(),
  dataDiagnostico: z.string().optional().or(z.literal("")),
  medicoDiagNome: z.string().trim().max(120).optional().or(z.literal("")),
  medicoDiagCRM: z.string().trim().max(40).optional().or(z.literal("")),
  medicoDiagEspecialidade: z.string().trim().max(80).optional().or(z.literal("")),
  statusLaudo: z.enum(["provisorio", "definitivo", "investigacao"]).optional(),
  laudoFile: z.string().optional().or(z.literal("")),
  comorbidades: z.array(z.string()).default([]),

  // Aba 4
  gatilhosSensoriais: z.array(z.string()).default([]),
  estimulosRegulatorios: z.array(z.string()).default([]),
  objetoApego: z.string().trim().max(120).optional().or(z.literal("")),
  comportamentosRisco: z.array(z.string()).default([]),
  comunicacao: z.enum(["verbal_fluente", "verbal_limitada", "nao_verbal", "caa", "sinais"]).optional(),
  toleraEspera: z.enum(["sim", "com_limite", "nao"]).optional(),
  necessitaAcompanhante: z.boolean().default(false),
  reageBemTroca: z.enum(["sim", "nao", "depende"]).optional(),
  restricoesAlimentares: z.string().trim().max(500).optional().or(z.literal("")),
  usaFralda: z.boolean().default(false),
  usaFraldaIdade: z.string().trim().max(20).optional().or(z.literal("")),
  observacoesRecepcao: z.string().trim().max(1000).optional().or(z.literal("")),

  // Aba 5
  tipoFinanceiro: z.enum(["convenio", "particular"]).default("convenio"),
  convenio: z.string().optional().or(z.literal("")),
  carteirinha: z.string().trim().max(40).optional().or(z.literal("")),
  validadeCarteirinha: z.string().optional().or(z.literal("")),
  planoCategoria: z.string().trim().max(80).optional().or(z.literal("")),
  titularConvenioNome: z.string().trim().max(120).optional().or(z.literal("")),
  carteirinhaFrenteFile: z.string().optional().or(z.literal("")),
  carteirinhaVersoFile: z.string().optional().or(z.literal("")),
  pedidoEmissao: z.string().optional().or(z.literal("")),
  pedidoValidade: z.string().optional().or(z.literal("")),
  pedidoMedicoNome: z.string().trim().max(120).optional().or(z.literal("")),
  pedidoMedicoCRM: z.string().trim().max(40).optional().or(z.literal("")),
  pedidoEspecialidades: z.array(z.object({ especialidade: z.string(), cargaHoraria: z.coerce.number().min(0).max(40).optional() })).default([]),
  pedidoFile: z.string().optional().or(z.literal("")),

  // Aba 6
  medicacoes: z.array(medicacaoSchema).default([]),

  // Aba 7
  especialidadesAtivas: z.array(especAtivaSchema).default([]),
  outrasTerapias: z.string().trim().max(500).optional().or(z.literal("")),
  temPEI: z.boolean().default(false),
  observacoesGerais: z.string().trim().max(1000).optional().or(z.literal("")),

  // Aba 8
  origemLead: z.string().optional().or(z.literal("")),
  detalheIndicacao: z.string().trim().max(300).optional().or(z.literal("")),
  closerId: z.string().optional().or(z.literal("")),
  dataEntrada: z.string().optional().or(z.literal("")),
  funilStatus: z.string().default("novo"),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

export const emptyResponsavel = (): z.infer<typeof responsavelSchema> => ({
  nome: "", cpf: "", rg: "", telefone1: "", telefone1Whats: true,
  telefone2: "", telefone2Whats: false, email: "",
  parentesco: "Mãe", principal: true, titularConvenio: false, recebeComunicacoes: true,
});

export const defaultPatientForm = (): PatientFormValues => ({
  nome: "", dataNascimento: "", sexo: undefined, fotoUrl: "",
  cpf: "", rgCertidao: "", cep: "", logradouro: "", numero: "",
  complemento: "", bairro: "", cidade: "", uf: "",
  escola: "", periodoEscolar: "", temAT: false,
  responsaveis: [emptyResponsavel()],
  cidPrincipal: "", cidsSecundarios: [], nivelSuporteTEA: undefined,
  dataDiagnostico: "", medicoDiagNome: "", medicoDiagCRM: "", medicoDiagEspecialidade: "",
  statusLaudo: undefined, laudoFile: "", comorbidades: [],
  gatilhosSensoriais: [], estimulosRegulatorios: [], objetoApego: "",
  comportamentosRisco: [], comunicacao: undefined, toleraEspera: undefined,
  necessitaAcompanhante: false, reageBemTroca: undefined,
  restricoesAlimentares: "", usaFralda: false, usaFraldaIdade: "",
  observacoesRecepcao: "",
  tipoFinanceiro: "convenio", convenio: "", carteirinha: "", validadeCarteirinha: "",
  planoCategoria: "", titularConvenioNome: "",
  carteirinhaFrenteFile: "", carteirinhaVersoFile: "",
  pedidoEmissao: "", pedidoValidade: "", pedidoMedicoNome: "", pedidoMedicoCRM: "",
  pedidoEspecialidades: [], pedidoFile: "",
  medicacoes: [],
  especialidadesAtivas: [], outrasTerapias: "", temPEI: false, observacoesGerais: "",
  origemLead: "", detalheIndicacao: "", closerId: "", dataEntrada: "", funilStatus: "novo",
});

// ─── LocalStorage store ───
const STORAGE_KEY = "inq:patients";
const DRAFT_KEY = "inq:patient-draft";

export function loadStoredPatients(): Record<string, PatientFormValues> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch { return {}; }
}

export function savePatient(id: string, data: PatientFormValues) {
  const all = loadStoredPatients();
  all[id] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getStoredPatient(id: string): PatientFormValues | null {
  return loadStoredPatients()[id] || null;
}

export function loadDraft(id: string): PatientFormValues | null {
  try {
    const raw = localStorage.getItem(`${DRAFT_KEY}:${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveDraft(id: string, data: PatientFormValues) {
  localStorage.setItem(`${DRAFT_KEY}:${id}`, JSON.stringify(data));
}

export function clearDraft(id: string) {
  localStorage.removeItem(`${DRAFT_KEY}:${id}`);
}

// ViaCEP
export async function fetchCEP(cep: string): Promise<{ logradouro: string; bairro: string; localidade: string; uf: string } | null> {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return data;
  } catch { return null; }
}

export const ESPECIALIDADES_LIST: Especialidade[] = [
  "Fonoaudiologia", "Terapia Ocupacional", "Fisioterapia",
  "Psicologia", "Psicopedagogia", "Neuropsicologia",
];
