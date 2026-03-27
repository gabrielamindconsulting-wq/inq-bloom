export type ScreeningStatus = "nao_iniciada" | "em_andamento" | "concluida";

export interface Patient {
  id: string;
  nome: string;
  dataNascimento: string;
  sexo: "Masculino" | "Feminino";
  responsavelNome: string;
  responsavelParentesco: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  dataCadastro: string;
  statusTriagem: ScreeningStatus;
  profissionalId: string | null;
  profissionalNome: string | null;
}

export interface SystemUser {
  id: string;
  nome: string;
  email: string;
  tipo: "admin" | "padrao" | "medico" | "responsavel";
  status: "ativo" | "inativo";
  crm?: string;
  telefone?: string;
  patientId?: string;
  createdAt: string;
}

export interface Observation {
  id: string;
  patientId: string;
  professionalId: string;
  professionalName: string;
  text: string;
  createdAt: string;
}

export const MOCK_USERS: SystemUser[] = [
  { id: "u1", nome: "Dra. Nadja Quadros", email: "nadja@inqsaude.com.br", tipo: "admin", status: "ativo", telefone: "(61) 99999-0001", createdAt: "2025-01-10" },
  { id: "u2", nome: "Dr. Carlos Mendes", email: "carlos@inqsaude.com.br", tipo: "medico", status: "ativo", crm: "CRM-DF 12345", telefone: "(61) 99999-0002", createdAt: "2025-02-15" },
  { id: "u3", nome: "Ana Paula Souza", email: "ana@inqsaude.com.br", tipo: "padrao", status: "ativo", telefone: "(61) 99999-0003", createdAt: "2025-03-01" },
  { id: "u4", nome: "Dra. Mariana Costa", email: "mariana@inqsaude.com.br", tipo: "medico", status: "ativo", crm: "CRM-DF 54321", telefone: "(61) 99999-0004", createdAt: "2025-04-10" },
  { id: "u5", nome: "João Silva", email: "joao@email.com", tipo: "responsavel", status: "ativo", telefone: "(61) 98888-0001", patientId: "p1", createdAt: "2025-06-01" },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: "p1", nome: "Miguel Silva", dataNascimento: "2023-03-15", sexo: "Masculino", responsavelNome: "João Silva", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98888-0001", responsavelEmail: "joao@email.com", dataCadastro: "2026-01-10", statusTriagem: "concluida", profissionalId: "u2", profissionalNome: "Dr. Carlos Mendes" },
  { id: "p2", nome: "Sofia Oliveira", dataNascimento: "2024-07-22", sexo: "Feminino", responsavelNome: "Maria Oliveira", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98888-0002", responsavelEmail: "maria@email.com", dataCadastro: "2026-01-15", statusTriagem: "em_andamento", profissionalId: "u4", profissionalNome: "Dra. Mariana Costa" },
  { id: "p3", nome: "Arthur Santos", dataNascimento: "2022-11-05", sexo: "Masculino", responsavelNome: "Pedro Santos", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98888-0003", responsavelEmail: "pedro@email.com", dataCadastro: "2026-02-01", statusTriagem: "nao_iniciada", profissionalId: null, profissionalNome: null },
  { id: "p4", nome: "Helena Costa", dataNascimento: "2023-09-10", sexo: "Feminino", responsavelNome: "Ana Costa", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98888-0004", responsavelEmail: "ana.costa@email.com", dataCadastro: "2026-02-10", statusTriagem: "nao_iniciada", profissionalId: "u2", profissionalNome: "Dr. Carlos Mendes" },
  { id: "p5", nome: "Theo Pereira", dataNascimento: "2021-05-18", sexo: "Masculino", responsavelNome: "Lucas Pereira", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98888-0005", responsavelEmail: "lucas@email.com", dataCadastro: "2026-02-20", statusTriagem: "em_andamento", profissionalId: "u2", profissionalNome: "Dr. Carlos Mendes" },
  { id: "p6", nome: "Laura Ferreira", dataNascimento: "2024-01-30", sexo: "Feminino", responsavelNome: "Juliana Ferreira", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98888-0006", responsavelEmail: "juliana@email.com", dataCadastro: "2026-03-01", statusTriagem: "concluida", profissionalId: "u4", profissionalNome: "Dra. Mariana Costa" },
  { id: "p7", nome: "Bernardo Lima", dataNascimento: "2022-08-12", sexo: "Masculino", responsavelNome: "Fernanda Lima", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98888-0007", responsavelEmail: "fernanda@email.com", dataCadastro: "2026-03-05", statusTriagem: "nao_iniciada", profissionalId: null, profissionalNome: null },
  { id: "p8", nome: "Valentina Rocha", dataNascimento: "2023-12-25", sexo: "Feminino", responsavelNome: "Roberto Rocha", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98888-0008", responsavelEmail: "roberto@email.com", dataCadastro: "2026-03-10", statusTriagem: "em_andamento", profissionalId: "u4", profissionalNome: "Dra. Mariana Costa" },
  { id: "p9", nome: "Davi Almeida", dataNascimento: "2020-06-08", sexo: "Masculino", responsavelNome: "Carla Almeida", responsavelParentesco: "Mãe", responsavelTelefone: "(61) 98888-0009", responsavelEmail: "carla@email.com", dataCadastro: "2026-03-15", statusTriagem: "concluida", profissionalId: "u2", profissionalNome: "Dr. Carlos Mendes" },
  { id: "p10", nome: "Alice Martins", dataNascimento: "2024-04-14", sexo: "Feminino", responsavelNome: "Paulo Martins", responsavelParentesco: "Pai", responsavelTelefone: "(61) 98888-0010", responsavelEmail: "paulo@email.com", dataCadastro: "2026-03-20", statusTriagem: "nao_iniciada", profissionalId: null, profissionalNome: null },
];

export const MOCK_OBSERVATIONS: Observation[] = [
  { id: "o1", patientId: "p1", professionalId: "u2", professionalName: "Dr. Carlos Mendes", text: "Criança apresenta bom desenvolvimento motor. Manter acompanhamento semestral.", createdAt: "2026-02-15T14:30:00" },
  { id: "o2", patientId: "p2", professionalId: "u4", professionalName: "Dra. Mariana Costa", text: "Observados sinais leves de atraso na comunicação. Recomendado fonoaudiólogo.", createdAt: "2026-03-01T10:15:00" },
];

export function calcAge(dataNascimento: string): { years: number; months: number; label: string } {
  const birth = new Date(dataNascimento);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (now.getDate() < birth.getDate()) { months--; if (months < 0) { years--; months += 12; } }
  const totalMonths = years * 12 + months;
  if (totalMonths < 12) return { years: 0, months: totalMonths, label: `${totalMonths} meses` };
  return { years, months, label: months > 0 ? `${years} anos e ${months} meses` : `${years} anos` };
}

export const STATUS_LABELS: Record<ScreeningStatus, string> = {
  nao_iniciada: "Não iniciada",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};
