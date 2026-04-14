import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_ABSENCES, MOCK_SUBSTITUTIONS, MOCK_PROFESSIONALS, ESPECIALIDADE_COLORS } from "@/data/clinicalMockData";
import { Plus, AlertTriangle, CheckCircle2, Clock, UserCheck } from "lucide-react";

const MOTIVO_LABELS: Record<string, string> = { atestado: "Atestado", licenca: "Licença", emergencia: "Emergência", outro: "Outro" };

const suggestedSubstitutes = [
  { id: "prof7", nome: "Dra. Fernanda Castro", horarioLivre: true, mesmaEspecialidade: true, preferenciaFamilia: true },
  { id: "prof2", nome: "Dr. Pedro Ramos", horarioLivre: true, mesmaEspecialidade: false, preferenciaFamilia: false },
];

export default function SubstitutionsPage() {
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showSubstituteModal, setShowSubstituteModal] = useState<string | null>(null);

  const pendingCount = MOCK_SUBSTITUTIONS.filter(s => s.status === "pendente").length;

  return (
    <Layout title="Substituições">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ausências Hoje</p>
                <p className="text-2xl font-bold">{MOCK_ABSENCES.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`card-shadow ${pendingCount > 0 ? "border-amber-300" : ""}`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Substituições Pendentes</p>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Substituições Aprovadas</p>
                <p className="text-2xl font-bold">{MOCK_SUBSTITUTIONS.filter(s => s.status === "aprovada").length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Absences */}
        <Card className="card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Ausências do Dia</CardTitle>
            <Button size="sm" className="gap-1" onClick={() => setShowAbsenceModal(true)}>
              <Plus className="h-4 w-4" /> Registrar Ausência
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-primary/5">
                    <th className="text-left p-3 font-medium">Profissional</th>
                    <th className="text-left p-3 font-medium">Motivo</th>
                    <th className="text-left p-3 font-medium">Período</th>
                    <th className="text-left p-3 font-medium">Sessões Afetadas</th>
                    <th className="text-left p-3 font-medium">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ABSENCES.map(a => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium">{a.professionalNome}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {MOTIVO_LABELS[a.motivo]}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{new Date(a.dataInicio).toLocaleDateString("pt-BR")} — {new Date(a.dataFim).toLocaleDateString("pt-BR")}</td>
                      <td className="p-3"><span className="font-semibold text-red-600">{a.sessoesAfetadas}</span></td>
                      <td className="p-3 text-muted-foreground">{a.observacao || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pending substitutions */}
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Substituições</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-primary/5">
                    <th className="text-left p-3 font-medium">Paciente</th>
                    <th className="text-left p-3 font-medium">Horário</th>
                    <th className="text-left p-3 font-medium">Especialidade</th>
                    <th className="text-left p-3 font-medium">Profissional Original</th>
                    <th className="text-left p-3 font-medium">Substituto</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SUBSTITUTIONS.map(s => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 font-medium">{s.pacienteNome}</td>
                      <td className="p-3 text-muted-foreground">{s.horario}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESPECIALIDADE_COLORS[s.especialidade]}`}>
                          {s.especialidade}
                        </span>
                      </td>
                      <td className="p-3">{s.professionalOriginalNome}</td>
                      <td className="p-3">{s.professionalSubstitutoNome || <span className="text-red-500 font-medium">Sem substituto</span>}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === "aprovada" ? "bg-green-100 text-green-800" :
                          s.status === "pendente" ? "bg-amber-100 text-amber-800" :
                          "bg-red-100 text-red-800"
                        }`}>{s.status === "aprovada" ? "Aprovada" : s.status === "pendente" ? "Pendente" : "Recusada"}</span>
                      </td>
                      <td className="p-3">
                        {s.status === "pendente" && (
                          <Button size="sm" variant="outline" className="gap-1 text-primary border-primary/30 hover:bg-primary/5" onClick={() => setShowSubstituteModal(s.id)}>
                            <UserCheck className="h-3.5 w-3.5" /> Buscar Substituto
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Absence modal */}
      <Dialog open={showAbsenceModal} onOpenChange={setShowAbsenceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Ausência</DialogTitle>
            <DialogDescription>Informe os dados da ausência do profissional.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Profissional</label>
              <Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>{MOCK_PROFESSIONALS.filter(p => p.status === "ativo").map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Motivo</label>
              <Select><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="atestado">Atestado</SelectItem>
                  <SelectItem value="licenca">Licença</SelectItem>
                  <SelectItem value="emergencia">Emergência</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium">Data Início</label><Input type="date" /></div>
              <div><label className="text-sm font-medium">Data Fim</label><Input type="date" /></div>
            </div>
            <div><label className="text-sm font-medium">Observação</label><Textarea placeholder="Detalhes..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAbsenceModal(false)}>Cancelar</Button>
            <Button onClick={() => setShowAbsenceModal(false)}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Substitute suggestion modal */}
      <Dialog open={!!showSubstituteModal} onOpenChange={() => setShowSubstituteModal(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sugestão de Substitutos</DialogTitle>
            <DialogDescription>Selecione o profissional substituto mais adequado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {suggestedSubstitutes.map((sub, i) => (
              <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{["🥇", "🥈", "🥉"][i]}</span>
                    <span className="font-medium text-sm">{sub.nome}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs ${sub.horarioLivre ? "text-green-600" : "text-red-600"}`}>{sub.horarioLivre ? "Horário livre" : "Horário ocupado"}</span>
                    <span className={`text-xs ${sub.mesmaEspecialidade ? "text-green-600" : "text-amber-600"}`}>{sub.mesmaEspecialidade ? "Mesma especialidade" : "Especialidade próxima"}</span>
                    <span className={`text-xs ${sub.preferenciaFamilia ? "text-green-600" : "text-muted-foreground"}`}>{sub.preferenciaFamilia ? "Pref. família" : "Sem preferência"}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowSubstituteModal(null)}>Selecionar</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
