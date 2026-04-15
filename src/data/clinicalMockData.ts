// Clinical module mock data

export type Especialidade = "Fonoaudiologia" | "Terapia Ocupacional" | "Fisioterapia" | "Psicologia" | "Psicopedagogia" | "Neuropsicologia";

export type SessionStatus = "agendada" | "confirmada" | "realizada" | "cancelada" | "no_show";
export type CheckinStatus = "aguardando" | "chegou" | "em_atendimento" | "finalizado" | "cancelado" | "no_show";
export type SubstitutionStatus = "pendente" | "aprovada" | "recusada";
export type PatientClinicalStatus = "ativo" | "avaliacao" | "guia_pendente" | "inativo";

export const ESPECIALIDADE_COLORS: Record<Especialidade, string> = {
  Fonoaudiologia: "bg-blue-100 text-blue-800",
  "Terapia Ocupacional": "bg-amber-100 text-amber-800",
  Fisioterapia: "bg-green-100 text-green-800",
  Psicologia: "bg-purple-100 text-purple-800",
  Psicopedagogia: "bg-pink-100 text-pink-800",
  Neuropsicologia: "bg-sky-100 text-sky-800",
};

export const ESPECIALIDADE_BG: Record<Especialidade, string> = {
  Fonoaudiologia: "#DBEAFE",
  "Terapia Ocupacional": "#FEF3C7",
  Fisioterapia: "#D1FAE5",
  Psicologia: "#F3E8FF",
  Psicopedagogia: "#FEE2E2",
  Neuropsicologia: "#E0F2FE",
};

export const CHECKIN_STATUS_CONFIG: Record<CheckinStatus, { label: string; bg: string; text: string }> = {
  aguardando: { label: "Aguardando", bg: "#FEF3C7", text: "#92400E" },
  chegou: { label: "Chegou", bg: "#D1FAE5", text: "#065F46" },
  em_atendimento: { label: "Em atendimento", bg: "#DBEAFE", text: "#1E40AF" },
  finalizado: { label: "Finalizado", bg: "#F3F4F6", text: "#374151" },
  cancelado: { label: "Cancelado", bg: "#FEE2E2", text: "#991B1B" },
  no_show: { label: "No-show", bg: "#FEE2E2", text: "#7F1D1D" },
};

export const PATIENT_STATUS_CONFIG: Record<PatientClinicalStatus, { label: string; bg: string; text: string }> = {
  ativo: { label: "Ativo", bg: "#D1FAE5", text: "#065F46" },
  avaliacao: { label: "Avaliação", bg: "#FEF3C7", text: "#92400E" },
  guia_pendente: { label: "Guia Pendente", bg: "#FEE2E2", text: "#991B1B" },
  inativo: { label: "Inativo", bg: "#F3F4F6", text: "#6B7280" },
};

export interface Professional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidades: Especialidade[];
  registroProfissional: string;
  disponivelSubstituicao: boolean;
  status: "ativo" | "inativo";
}

export interface ClinicalPatient {
  id: string;
  nome: string;
  dataNascimento: string;
  sexo: "Masculino" | "Feminino";
  responsavelNome: string;
  responsavelParentesco: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  especialidades: Especialidade[];
  terapeutaPrincipalId: string;
  terapeutaPrincipalNome: string;
  status: PatientClinicalStatus;
  planoSaude?: string;
  numeroGuia?: string;
  dataCadastro: string;
}

export interface Session {
  id: string;
  patientId: string;
  patientNome: string;
  professionalId: string;
  professionalNome: string;
  dataSessao: string;
  horarioInicio: string;
  horarioFim: string;
  especialidade: Especialidade;
  tipo: "individual" | "grupo" | "avaliacao";
  sala: string;
  status: SessionStatus;
  observacoes?: string;
}

export interface Checkin {
  id: string;
  sessionId: string;
  patientId: string;
  patientNome: string;
  patientIdade: string;
  professionalNome: string;
  especialidade: Especialidade;
  sala: string;
  horarioAgendado: string;
  horarioChegada?: string;
  horarioInicioAtendimento?: string;
  horarioFimAtendimento?: string;
  status: CheckinStatus;
}

export interface Absence {
  id: string;
  professionalId: string;
  professionalNome: string;
  dataInicio: string;
  dataFim: string;
  motivo: "atestado" | "licenca" | "emergencia" | "outro";
  observacao?: string;
  sessoesAfetadas: number;
}

export interface Substitution {
  id: string;
  sessionId: string;
  absenceId: string;
  professionalOriginalNome: string;
  professionalSubstitutoNome?: string;
  professionalSubstitutoId?: string;
  pacienteNome: string;
  horario: string;
  especialidade: Especialidade;
  sala: string;
  status: SubstitutionStatus;
  dataAprovacao?: string;
}

export interface Evolution {
  id: string;
  sessionId: string;
  patientId: string;
  patientNome: string;
  professionalId: string;
  professionalNome: string;
  especialidade: Especialidade;
  texto: string;
  dataEvolucao: string;
  atraso: boolean;
}

export interface ProfessionalSchedule {
  id: string;
  professionalId: string;
  diaSemana: number;
  horarioInicio: string;
  horarioFim: string;
}

export type RoomCategory = Especialidade;
export type RoomUnit = "Asa Sul" | "Águas Claras";

export interface Room {
  id: string;
  nome: string;
  numero: string;
  unidade: RoomUnit;
  categoria: RoomCategory;
}

export const MOCK_ROOMS: Room[] = [
  { id: "room1", nome: "Sala Fono 1", numero: "101", unidade: "Asa Sul", categoria: "Fonoaudiologia" },
  { id: "room2", nome: "Sala TO 1", numero: "102", unidade: "Asa Sul", categoria: "Terapia Ocupacional" },
  { id: "room3", nome: "Sala Psicologia", numero: "103", unidade: "Asa Sul", categoria: "Psicologia" },
  { id: "room4", nome: "Sala Fisio", numero: "201", unidade: "Asa Sul", categoria: "Fisioterapia" },
  { id: "room5", nome: "Sala Psicopedagogia", numero: "202", unidade: "Asa Sul", categoria: "Psicopedagogia" },
  { id: "room6", nome: "Sala Neuro", numero: "203", unidade: "Asa Sul", categoria: "Neuropsicologia" },
  { id: "room7", nome: "Sala Fono AC", numero: "301", unidade: "Águas Claras", categoria: "Fonoaudiologia" },
  { id: "room8", nome: "Sala TO AC", numero: "302", unidade: "Águas Claras", categoria: "Terapia Ocupacional" },
];

// ─── MOCK DATA ───

export const MOCK_PROFESSIONALS: Professional[] = [
  { id: "prof1", nome: "Dra. Ana Lima", email: "ana.lima@inqsaude.com.br", telefone: "(61) 99999-1001", especialidades: ["Fonoaudiologia"], registroProfissional: "CRFa-DF 1234", disponivelSubstituicao: true, status: "ativo" },
  { id: "prof2", nome: "Dr. Pedro Ramos", email: "pedro.ramos@inqsaude.com.br", telefone: "(61) 99999-1002", especialidades: ["Terapia Ocupacional"], registroProfissional: "CREFITO-DF 5678", disponivelSubstituicao: true, status: "ativo" },
  { id: "prof3", nome: "Dra. Carla Dias", email: "carla.dias@inqsaude.com.br", telefone: "(61) 99999-1003", especialidades: ["Psicologia"], registroProfissional: "CRP-DF 9012", disponivelSubstituicao: true, status: "ativo" },
  { id: "prof4", nome: "Dr. Marcos Vieira", email: "marcos.vieira@inqsaude.com.br", telefone: "(61) 99999-1004", especialidades: ["Fisioterapia"], registroProfissional: "CREFITO-DF 3456", disponivelSubstituicao: false, status: "ativo" },
  { id: "prof5", nome: "Dra. Beatriz Souza", email: "beatriz.souza@inqsaude.com.br", telefone: "(61) 99999-1005", especialidades: ["Psicopedagogia"], registroProfissional: "ABPp 7890", disponivelSubstituicao: true, status: "ativo" },
  { id: "prof6", nome: "Dr. Rafael Alves", email: "rafael.alves@inqsaude.com.br", telefone: "(61) 99999-1006", especialidades: ["Neuropsicologia"], registroProfissional: "CRP-DF 2345", disponivelSubstituicao: true, status: "ativo" },
  { id: "prof7", nome: "Dra. Fernanda Castro", email: "fernanda.castro@inqsaude.com.br", telefone: "(61) 99999-1007", especialidades: ["Fonoaudiologia", "Terapia Ocupacional"], registroProfissional: "CRFa-DF 6789", disponivelSubstituicao: true, status: "inativo" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}

export const MOCK_CLINICAL_PATIENTS: ClinicalPatient[] = [
  { id: "cp1", nome: "Lucas Mendes", dataNascimento: "2019-02-10", sexo: "Masculino", responsavelNome: "Patrícia Mendes", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98877-0001", responsavelEmail: "patricia@email.com", especialidades: ["Fonoaudiologia", "Psicologia"], terapeutaPrincipalId: "prof1", terapeutaPrincipalNome: "Dra. Ana Lima", status: "ativo", planoSaude: "Unimed", numeroGuia: "12345", dataCadastro: "2025-08-15" },
  { id: "cp2", nome: "Marina Souza", dataNascimento: "2021-06-22", sexo: "Feminino", responsavelNome: "Carlos Souza", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98877-0002", responsavelEmail: "carlos.s@email.com", especialidades: ["Terapia Ocupacional"], terapeutaPrincipalId: "prof2", terapeutaPrincipalNome: "Dr. Pedro Ramos", status: "ativo", dataCadastro: "2025-09-01" },
  { id: "cp3", nome: "João Carlos", dataNascimento: "2021-03-05", sexo: "Masculino", responsavelNome: "Renata Carlos", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98877-0003", responsavelEmail: "renata@email.com", especialidades: ["Psicologia", "Fonoaudiologia"], terapeutaPrincipalId: "prof3", terapeutaPrincipalNome: "Dra. Carla Dias", status: "ativo", dataCadastro: "2025-10-10" },
  { id: "cp4", nome: "Ana Beatriz", dataNascimento: "2022-12-20", sexo: "Feminino", responsavelNome: "Marcos Beatriz", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98877-0004", responsavelEmail: "marcos.b@email.com", especialidades: ["Fonoaudiologia"], terapeutaPrincipalId: "prof1", terapeutaPrincipalNome: "Dra. Ana Lima", status: "avaliacao", dataCadastro: "2026-01-05" },
  { id: "cp5", nome: "Pedro Henrique", dataNascimento: "2020-07-14", sexo: "Masculino", responsavelNome: "Débora Henrique", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98877-0005", responsavelEmail: "debora@email.com", especialidades: ["Fisioterapia", "Terapia Ocupacional"], terapeutaPrincipalId: "prof4", terapeutaPrincipalNome: "Dr. Marcos Vieira", status: "ativo", planoSaude: "Amil", dataCadastro: "2025-11-20" },
  { id: "cp6", nome: "Isabella Torres", dataNascimento: "2019-09-30", sexo: "Feminino", responsavelNome: "Fábio Torres", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98877-0006", responsavelEmail: "fabio.t@email.com", especialidades: ["Psicopedagogia"], terapeutaPrincipalId: "prof5", terapeutaPrincipalNome: "Dra. Beatriz Souza", status: "guia_pendente", dataCadastro: "2026-02-01" },
  { id: "cp7", nome: "Gabriel Nunes", dataNascimento: "2020-01-18", sexo: "Masculino", responsavelNome: "Luciana Nunes", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98877-0007", responsavelEmail: "luciana@email.com", especialidades: ["Neuropsicologia", "Psicologia"], terapeutaPrincipalId: "prof6", terapeutaPrincipalNome: "Dr. Rafael Alves", status: "ativo", dataCadastro: "2025-12-10" },
  { id: "cp8", nome: "Manuela Ferraz", dataNascimento: "2022-04-05", sexo: "Feminino", responsavelNome: "André Ferraz", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98877-0008", responsavelEmail: "andre.f@email.com", especialidades: ["Fonoaudiologia", "Terapia Ocupacional"], terapeutaPrincipalId: "prof1", terapeutaPrincipalNome: "Dra. Ana Lima", status: "ativo", dataCadastro: "2026-01-20" },
  { id: "cp9", nome: "Enzo Rodrigues", dataNascimento: "2018-11-12", sexo: "Masculino", responsavelNome: "Vanessa Rodrigues", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98877-0009", responsavelEmail: "vanessa@email.com", especialidades: ["Psicologia"], terapeutaPrincipalId: "prof3", terapeutaPrincipalNome: "Dra. Carla Dias", status: "inativo", dataCadastro: "2025-06-01" },
  { id: "cp10", nome: "Clara Monteiro", dataNascimento: "2021-08-25", sexo: "Feminino", responsavelNome: "Diego Monteiro", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98877-0010", responsavelEmail: "diego@email.com", especialidades: ["Fisioterapia"], terapeutaPrincipalId: "prof4", terapeutaPrincipalNome: "Dr. Marcos Vieira", status: "ativo", dataCadastro: "2026-03-01" },
  { id: "cp11", nome: "Lara Bastos", dataNascimento: "2020-05-16", sexo: "Feminino", responsavelNome: "Thiago Bastos", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98877-0011", responsavelEmail: "thiago@email.com", especialidades: ["Psicopedagogia", "Fonoaudiologia"], terapeutaPrincipalId: "prof5", terapeutaPrincipalNome: "Dra. Beatriz Souza", status: "ativo", dataCadastro: "2026-02-15" },
  { id: "cp12", nome: "Felipe Cardoso", dataNascimento: "2019-03-08", sexo: "Masculino", responsavelNome: "Camila Cardoso", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98877-0012", responsavelEmail: "camila@email.com", especialidades: ["Neuropsicologia"], terapeutaPrincipalId: "prof6", terapeutaPrincipalNome: "Dr. Rafael Alves", status: "ativo", dataCadastro: "2025-07-20" },
];

const td = today();

export const MOCK_SESSIONS: Session[] = [
  { id: "s1", patientId: "cp1", patientNome: "Lucas Mendes", professionalId: "prof1", professionalNome: "Dra. Ana Lima", dataSessao: td, horarioInicio: "09:00", horarioFim: "09:50", especialidade: "Fonoaudiologia", tipo: "individual", sala: "Sala 3", status: "agendada" },
  { id: "s2", patientId: "cp2", patientNome: "Marina Souza", professionalId: "prof2", professionalNome: "Dr. Pedro Ramos", dataSessao: td, horarioInicio: "09:00", horarioFim: "09:50", especialidade: "Terapia Ocupacional", tipo: "individual", sala: "Sala 1", status: "confirmada" },
  { id: "s3", patientId: "cp3", patientNome: "João Carlos", professionalId: "prof3", professionalNome: "Dra. Carla Dias", dataSessao: td, horarioInicio: "09:30", horarioFim: "10:20", especialidade: "Psicologia", tipo: "individual", sala: "Sala 5", status: "agendada" },
  { id: "s4", patientId: "cp4", patientNome: "Ana Beatriz", professionalId: "prof1", professionalNome: "Dra. Ana Lima", dataSessao: td, horarioInicio: "10:00", horarioFim: "10:50", especialidade: "Fonoaudiologia", tipo: "avaliacao", sala: "Sala 3", status: "agendada" },
  { id: "s5", patientId: "cp5", patientNome: "Pedro Henrique", professionalId: "prof4", professionalNome: "Dr. Marcos Vieira", dataSessao: td, horarioInicio: "10:00", horarioFim: "10:50", especialidade: "Fisioterapia", tipo: "individual", sala: "Sala 2", status: "realizada" },
  { id: "s6", patientId: "cp6", patientNome: "Isabella Torres", professionalId: "prof5", professionalNome: "Dra. Beatriz Souza", dataSessao: td, horarioInicio: "11:00", horarioFim: "11:50", especialidade: "Psicopedagogia", tipo: "individual", sala: "Sala 4", status: "agendada" },
  { id: "s7", patientId: "cp7", patientNome: "Gabriel Nunes", professionalId: "prof6", professionalNome: "Dr. Rafael Alves", dataSessao: td, horarioInicio: "11:00", horarioFim: "11:50", especialidade: "Neuropsicologia", tipo: "avaliacao", sala: "Sala 6", status: "cancelada", observacoes: "Paciente solicitou remarcação" },
  { id: "s8", patientId: "cp8", patientNome: "Manuela Ferraz", professionalId: "prof2", professionalNome: "Dr. Pedro Ramos", dataSessao: td, horarioInicio: "14:00", horarioFim: "14:50", especialidade: "Terapia Ocupacional", tipo: "individual", sala: "Sala 1", status: "agendada" },
  { id: "s9", patientId: "cp1", patientNome: "Lucas Mendes", professionalId: "prof3", professionalNome: "Dra. Carla Dias", dataSessao: td, horarioInicio: "14:00", horarioFim: "14:50", especialidade: "Psicologia", tipo: "individual", sala: "Sala 5", status: "agendada" },
  { id: "s10", patientId: "cp10", patientNome: "Clara Monteiro", professionalId: "prof4", professionalNome: "Dr. Marcos Vieira", dataSessao: td, horarioInicio: "14:30", horarioFim: "15:20", especialidade: "Fisioterapia", tipo: "individual", sala: "Sala 2", status: "agendada" },
  { id: "s11", patientId: "cp11", patientNome: "Lara Bastos", professionalId: "prof5", professionalNome: "Dra. Beatriz Souza", dataSessao: td, horarioInicio: "15:00", horarioFim: "15:50", especialidade: "Psicopedagogia", tipo: "individual", sala: "Sala 4", status: "agendada" },
  { id: "s12", patientId: "cp12", patientNome: "Felipe Cardoso", professionalId: "prof6", professionalNome: "Dr. Rafael Alves", dataSessao: td, horarioInicio: "15:00", horarioFim: "15:50", especialidade: "Neuropsicologia", tipo: "individual", sala: "Sala 6", status: "no_show" },
];

export const MOCK_CHECKINS: Checkin[] = [
  { id: "ck1", sessionId: "s1", patientId: "cp1", patientNome: "Lucas Mendes", patientIdade: "7a 2m", professionalNome: "Dra. Ana Lima", especialidade: "Fonoaudiologia", sala: "Sala 3", horarioAgendado: "09:00", status: "aguardando" },
  { id: "ck2", sessionId: "s2", patientId: "cp2", patientNome: "Marina Souza", patientIdade: "4a 9m", professionalNome: "Dr. Pedro Ramos", especialidade: "Terapia Ocupacional", sala: "Sala 1", horarioAgendado: "09:00", horarioChegada: "08:52", horarioInicioAtendimento: "09:02", status: "em_atendimento" },
  { id: "ck3", sessionId: "s3", patientId: "cp3", patientNome: "João Carlos", patientIdade: "5a 1m", professionalNome: "Dra. Carla Dias", especialidade: "Psicologia", sala: "Sala 5", horarioAgendado: "09:30", status: "aguardando" },
  { id: "ck4", sessionId: "s4", patientId: "cp4", patientNome: "Ana Beatriz", patientIdade: "3a 3m", professionalNome: "Dra. Ana Lima", especialidade: "Fonoaudiologia", sala: "Sala 3", horarioAgendado: "10:00", horarioChegada: "09:48", status: "chegou" },
  { id: "ck5", sessionId: "s5", patientId: "cp5", patientNome: "Pedro Henrique", patientIdade: "5a 8m", professionalNome: "Dr. Marcos Vieira", especialidade: "Fisioterapia", sala: "Sala 2", horarioAgendado: "10:00", horarioChegada: "09:55", horarioInicioAtendimento: "10:00", horarioFimAtendimento: "10:48", status: "finalizado" },
  { id: "ck6", sessionId: "s6", patientId: "cp6", patientNome: "Isabella Torres", patientIdade: "6a 6m", professionalNome: "Dra. Beatriz Souza", especialidade: "Psicopedagogia", sala: "Sala 4", horarioAgendado: "11:00", status: "aguardando" },
  { id: "ck7", sessionId: "s8", patientId: "cp8", patientNome: "Manuela Ferraz", patientIdade: "3a 11m", professionalNome: "Dr. Pedro Ramos", especialidade: "Terapia Ocupacional", sala: "Sala 1", horarioAgendado: "14:00", status: "aguardando" },
  { id: "ck8", sessionId: "s9", patientId: "cp1", patientNome: "Lucas Mendes", patientIdade: "7a 2m", professionalNome: "Dra. Carla Dias", especialidade: "Psicologia", sala: "Sala 5", horarioAgendado: "14:00", status: "aguardando" },
];

export const MOCK_ABSENCES: Absence[] = [
  { id: "abs1", professionalId: "prof1", professionalNome: "Dra. Ana Lima", dataInicio: td, dataFim: td, motivo: "atestado", observacao: "Atestado médico - gripe", sessoesAfetadas: 2 },
  { id: "abs2", professionalId: "prof6", professionalNome: "Dr. Rafael Alves", dataInicio: td, dataFim: td, motivo: "emergencia", observacao: "Emergência familiar", sessoesAfetadas: 1 },
];

export const MOCK_SUBSTITUTIONS: Substitution[] = [
  { id: "sub1", sessionId: "s1", absenceId: "abs1", professionalOriginalNome: "Dra. Ana Lima", professionalSubstitutoNome: "Dra. Fernanda Castro", professionalSubstitutoId: "prof7", pacienteNome: "Lucas Mendes", horario: "09:00 - 09:50", especialidade: "Fonoaudiologia", sala: "Sala 3", status: "aprovada", dataAprovacao: td },
  { id: "sub2", sessionId: "s4", absenceId: "abs1", professionalOriginalNome: "Dra. Ana Lima", pacienteNome: "Ana Beatriz", horario: "10:00 - 10:50", especialidade: "Fonoaudiologia", sala: "Sala 3", status: "pendente" },
  { id: "sub3", sessionId: "s12", absenceId: "abs2", professionalOriginalNome: "Dr. Rafael Alves", pacienteNome: "Felipe Cardoso", horario: "15:00 - 15:50", especialidade: "Neuropsicologia", sala: "Sala 6", status: "pendente" },
];

export const MOCK_EVOLUTIONS: Evolution[] = [
  { id: "ev1", sessionId: "s5", patientId: "cp5", patientNome: "Pedro Henrique", professionalId: "prof4", professionalNome: "Dr. Marcos Vieira", especialidade: "Fisioterapia", texto: "Paciente apresentou boa evolução nos exercícios de equilíbrio. Conseguiu realizar a marcha tandem por 3 metros sem apoio. Manter protocolo atual e aumentar complexidade gradualmente.", dataEvolucao: new Date().toISOString(), atraso: false },
  { id: "ev2", sessionId: "s2", patientId: "cp2", patientNome: "Marina Souza", professionalId: "prof2", professionalNome: "Dr. Pedro Ramos", especialidade: "Terapia Ocupacional", texto: "Trabalhamos coordenação motora fina com atividades de recorte e colagem. Marina demonstrou melhora significativa na preensão da tesoura. Incluir atividades de escrita na próxima sessão.", dataEvolucao: new Date(Date.now() - 86400000 * 3).toISOString(), atraso: true },
  { id: "ev3", sessionId: "s3", patientId: "cp3", patientNome: "João Carlos", professionalId: "prof3", professionalNome: "Dra. Carla Dias", especialidade: "Psicologia", texto: "Sessão focada em regulação emocional. João participou ativamente das atividades lúdicas propostas. Demonstrou progresso no reconhecimento de emoções em figuras.", dataEvolucao: new Date(Date.now() - 86400000).toISOString(), atraso: false },
];

export const MOCK_SCHEDULES: ProfessionalSchedule[] = [
  // Dra. Ana Lima - Segunda a Sexta, 08h-12h e 14h-18h
  { id: "sch1", professionalId: "prof1", diaSemana: 1, horarioInicio: "08:00", horarioFim: "12:00" },
  { id: "sch2", professionalId: "prof1", diaSemana: 1, horarioInicio: "14:00", horarioFim: "18:00" },
  { id: "sch3", professionalId: "prof1", diaSemana: 2, horarioInicio: "08:00", horarioFim: "12:00" },
  { id: "sch4", professionalId: "prof1", diaSemana: 3, horarioInicio: "08:00", horarioFim: "12:00" },
  { id: "sch5", professionalId: "prof1", diaSemana: 3, horarioInicio: "14:00", horarioFim: "18:00" },
  { id: "sch6", professionalId: "prof1", diaSemana: 4, horarioInicio: "08:00", horarioFim: "12:00" },
  { id: "sch7", professionalId: "prof1", diaSemana: 5, horarioInicio: "08:00", horarioFim: "12:00" },
  // Dr. Pedro Ramos
  { id: "sch8", professionalId: "prof2", diaSemana: 1, horarioInicio: "09:00", horarioFim: "12:00" },
  { id: "sch9", professionalId: "prof2", diaSemana: 1, horarioInicio: "14:00", horarioFim: "17:00" },
  { id: "sch10", professionalId: "prof2", diaSemana: 3, horarioInicio: "09:00", horarioFim: "12:00" },
  { id: "sch11", professionalId: "prof2", diaSemana: 5, horarioInicio: "09:00", horarioFim: "12:00" },
  // Dra. Carla Dias
  { id: "sch12", professionalId: "prof3", diaSemana: 1, horarioInicio: "09:00", horarioFim: "12:00" },
  { id: "sch13", professionalId: "prof3", diaSemana: 2, horarioInicio: "14:00", horarioFim: "18:00" },
  { id: "sch14", professionalId: "prof3", diaSemana: 4, horarioInicio: "09:00", horarioFim: "12:00" },
  { id: "sch15", professionalId: "prof3", diaSemana: 4, horarioInicio: "14:00", horarioFim: "18:00" },
];
