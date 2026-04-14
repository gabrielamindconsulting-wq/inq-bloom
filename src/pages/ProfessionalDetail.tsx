import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_PROFESSIONALS, MOCK_CLINICAL_PATIENTS, MOCK_SCHEDULES, MOCK_EVOLUTIONS, MOCK_SUBSTITUTIONS, ESPECIALIDADE_COLORS } from "@/data/clinicalMockData";
import { ArrowLeft, Phone, Mail, Calendar } from "lucide-react";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function ProfessionalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const prof = MOCK_PROFESSIONALS.find(p => p.id === id);

  if (!prof) return <Layout title="Profissional"><p>Profissional não encontrado.</p></Layout>;

  const patients = MOCK_CLINICAL_PATIENTS.filter(p => p.terapeutaPrincipalId === id);
  const schedules = MOCK_SCHEDULES.filter(s => s.professionalId === id);
  const evolutions = MOCK_EVOLUTIONS.filter(e => e.professionalId === id);
  const subs = MOCK_SUBSTITUTIONS.filter(s => s.professionalOriginalNome === prof.nome || s.professionalSubstitutoNome === prof.nome);
  const pendingEvos = evolutions.filter(e => e.atraso).length;

  return (
    <Layout title="Ficha do Profissional">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/profissionais")} className="gap-1 mb-2 -ml-2">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <h2 className="text-2xl font-bold text-foreground">{prof.nome}</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {prof.especialidades.map(e => (
                <span key={e} className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESPECIALIDADE_COLORS[e]}`}>{e}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span>Registro: {prof.registroProfissional}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{prof.telefone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{prof.email}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${prof.status === "ativo" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
            {prof.status === "ativo" ? "Ativo" : "Inativo"}
          </span>
        </div>

        <Tabs defaultValue="dados">
          <TabsList>
            <TabsTrigger value="dados">Dados</TabsTrigger>
            <TabsTrigger value="agenda">Agenda Padrão</TabsTrigger>
            <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
            <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <Card className="card-shadow">
              <CardContent className="p-6 space-y-4">
                <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Email</h3><p className="text-sm">{prof.email}</p></div>
                <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Telefone</h3><p className="text-sm">{prof.telefone}</p></div>
                <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Registro Profissional</h3><p className="text-sm">{prof.registroProfissional}</p></div>
                <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Disponível para Substituições</h3><p className="text-sm">{prof.disponivelSubstituicao ? "Sim" : "Não"}</p></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agenda">
            <Card className="card-shadow">
              <CardHeader className="pb-2"><CardTitle className="text-base">Grade Horária Semanal</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map((d, i) => {
                    const daySchedules = schedules.filter(s => s.diaSemana === i);
                    return (
                      <div key={i} className="text-center">
                        <p className="text-xs font-medium mb-1">{d}</p>
                        <div className="min-h-[60px] rounded-md bg-muted/30 p-1 space-y-1">
                          {daySchedules.length === 0 ? (
                            <p className="text-xs text-muted-foreground mt-4">—</p>
                          ) : daySchedules.map(s => (
                            <div key={s.id} className="text-xs bg-primary/10 rounded px-1 py-0.5 text-primary font-medium">
                              {s.horarioInicio}-{s.horarioFim}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pacientes">
            <Card className="card-shadow">
              <CardContent className="p-6">
                {patients.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum paciente vinculado.</p>
                ) : (
                  <div className="space-y-2">
                    {patients.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                        <div>
                          <button onClick={() => navigate(`/pacientes/${p.id}`)} className="text-sm font-medium text-primary hover:underline">{p.nome}</button>
                          <div className="flex gap-1 mt-1">
                            {p.especialidades.map(e => <span key={e} className={`px-2 py-0.5 rounded-full text-xs ${ESPECIALIDADE_COLORS[e]}`}>{e}</span>)}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">{p.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indicadores">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-shadow">
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-bold text-primary">{patients.filter(p => p.status === "ativo").length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Pacientes Ativos</p>
                </CardContent>
              </Card>
              <Card className={`card-shadow ${pendingEvos > 0 ? "border-red-300" : ""}`}>
                <CardContent className="p-5 text-center">
                  <p className={`text-3xl font-bold ${pendingEvos > 0 ? "text-red-600" : "text-foreground"}`}>{pendingEvos}</p>
                  <p className="text-sm text-muted-foreground mt-1">Evoluções Pendentes</p>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-bold text-foreground">{subs.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Substituições (registro)</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
