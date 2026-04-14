import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_CLINICAL_PATIENTS, MOCK_SESSIONS, MOCK_EVOLUTIONS, PATIENT_STATUS_CONFIG, ESPECIALIDADE_COLORS } from "@/data/clinicalMockData";
import { calcAge } from "@/data/mockData";
import { ArrowLeft, Phone, Mail, Calendar } from "lucide-react";

export default function ClinicalPatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = MOCK_CLINICAL_PATIENTS.find(p => p.id === id);

  if (!patient) return <Layout title="Paciente"><p>Paciente não encontrado.</p></Layout>;

  const age = calcAge(patient.dataNascimento);
  const sc = PATIENT_STATUS_CONFIG[patient.status];
  const sessions = MOCK_SESSIONS.filter(s => s.patientId === id);
  const evolutions = MOCK_EVOLUTIONS.filter(e => e.patientId === id);

  // Mock presence data
  const presenceMonths = [
    { month: "Nov", presencas: 12, faltas: 2, cancelamentos: 1 },
    { month: "Dez", presencas: 10, faltas: 1, cancelamentos: 3 },
    { month: "Jan", presencas: 8, faltas: 0, cancelamentos: 0 },
    { month: "Fev", presencas: 11, faltas: 3, cancelamentos: 1 },
    { month: "Mar", presencas: 14, faltas: 1, cancelamentos: 0 },
    { month: "Abr", presencas: 6, faltas: 0, cancelamentos: 1 },
  ];
  const totalSessions = presenceMonths.reduce((a, m) => a + m.presencas + m.faltas + m.cancelamentos, 0);
  const totalPresent = presenceMonths.reduce((a, m) => a + m.presencas, 0);
  const adherenceRate = Math.round((totalPresent / totalSessions) * 100);

  return (
    <Layout title="Ficha do Paciente">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/pacientes")} className="gap-1 mb-2 -ml-2">
              <ArrowLeft className="h-4 w-4" /> Voltar para Pacientes
            </Button>
            <h2 className="text-2xl font-bold text-foreground">{patient.nome}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
              <span>{age.label} · Nascimento: {new Date(patient.dataNascimento).toLocaleDateString("pt-BR")}</span>
              <span>{patient.sexo}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
              <span>Responsável: {patient.responsavelNome} ({patient.responsavelParentesco})</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{patient.responsavelTelefone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{patient.responsavelEmail}</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dados">
          <TabsList>
            <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="presenca">Presença</TabsTrigger>
            <TabsTrigger value="evolucoes">Evoluções</TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <Card className="card-shadow">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Especialidades em Atendimento</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.especialidades.map(e => (
                      <span key={e} className={`px-3 py-1 rounded-full text-xs font-medium ${ESPECIALIDADE_COLORS[e]}`}>{e}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Terapeuta Principal</h3>
                  <p className="text-sm">{patient.terapeutaPrincipalNome}</p>
                </div>
                {patient.planoSaude && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Plano de Saúde</h3>
                    <p className="text-sm">{patient.planoSaude} {patient.numeroGuia && `· Guia: ${patient.numeroGuia}`}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Cadastrado em</h3>
                  <p className="text-sm">{new Date(patient.dataCadastro).toLocaleDateString("pt-BR")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agenda">
            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Sessões Agendadas</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma sessão encontrada.</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{new Date(s.dataSessao).toLocaleDateString("pt-BR")} · {s.horarioInicio} – {s.horarioFim}</p>
                            <p className="text-xs text-muted-foreground">{s.especialidade} · {s.professionalNome} · {s.sala}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === "realizada" ? "bg-green-100 text-green-800" :
                          s.status === "cancelada" || s.status === "no_show" ? "bg-red-100 text-red-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>{s.status === "no_show" ? "No-show" : s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presenca">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="card-shadow">
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-bold text-primary">{adherenceRate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Taxa de Aderência Geral</p>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-bold text-foreground">{totalPresent}</p>
                  <p className="text-sm text-muted-foreground mt-1">Presenças (últimos 6 meses)</p>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-bold text-red-600">{totalSessions - totalPresent}</p>
                  <p className="text-sm text-muted-foreground mt-1">Faltas + Cancelamentos</p>
                </CardContent>
              </Card>
            </div>
            <Card className="card-shadow">
              <CardHeader className="pb-2"><CardTitle className="text-base">Presença por Mês</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {presenceMonths.map(m => {
                    const total = m.presencas + m.faltas + m.cancelamentos;
                    return (
                      <div key={m.month} className="flex items-center gap-3">
                        <span className="text-sm w-10 text-muted-foreground">{m.month}</span>
                        <div className="flex-1 flex h-5 rounded-full overflow-hidden bg-muted">
                          <div className="bg-primary h-full" style={{ width: `${(m.presencas / total) * 100}%` }} />
                          <div className="bg-red-400 h-full" style={{ width: `${(m.faltas / total) * 100}%` }} />
                          <div className="bg-amber-400 h-full" style={{ width: `${(m.cancelamentos / total) * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-20 text-right">{m.presencas}/{total}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Presença</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /> Falta</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Cancelamento</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolucoes">
            <Card className="card-shadow">
              <CardContent className="p-6">
                {evolutions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma evolução registrada.</p>
                ) : (
                  <div className="space-y-3">
                    {evolutions.map(ev => (
                      <div key={ev.id} className={`p-4 border rounded-lg ${ev.atraso ? "border-red-200 bg-red-50/50" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESPECIALIDADE_COLORS[ev.especialidade]}`}>{ev.especialidade}</span>
                            <span className="text-sm font-medium">{ev.professionalNome}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {ev.atraso && <span className="text-xs text-red-600 font-medium">Atrasada</span>}
                            <span className="text-xs text-muted-foreground">{new Date(ev.dataEvolucao).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                        <p className="text-sm text-foreground">{ev.texto}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
