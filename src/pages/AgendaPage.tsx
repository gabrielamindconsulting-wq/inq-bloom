import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MOCK_SESSIONS, MOCK_PROFESSIONALS, ESPECIALIDADE_BG, type Session, type Especialidade, CHECKIN_STATUS_CONFIG } from "@/data/clinicalMockData";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const HOURS = Array.from({ length: 13 }, (_, i) => `${String(7 + i).padStart(2, "0")}:00`);

function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function ptWeekday(d: Date) {
  return ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][d.getDay()];
}

export default function AgendaPage() {
  const [view, setView] = useState<"semana" | "dia">("semana");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filterProf, setFilterProf] = useState("all");
  const [filterSpec, setFilterSpec] = useState("all");

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    const monday = new Date(baseDate);
    const dow = monday.getDay();
    monday.setDate(monday.getDate() - ((dow === 0 ? 7 : dow) - 1));
    return Array.from({ length: view === "semana" ? 5 : 1 }, (_, i) => {
      const d = new Date(view === "semana" ? monday : baseDate);
      if (view === "semana") d.setDate(monday.getDate() + i);
      return d;
    });
  }, [baseDate, view]);

  const filteredSessions = useMemo(() => {
    let s = MOCK_SESSIONS;
    if (filterProf !== "all") s = s.filter(x => x.professionalId === filterProf);
    if (filterSpec !== "all") s = s.filter(x => x.especialidade === filterSpec);
    return s;
  }, [filterProf, filterSpec]);

  const dateStr = weekDays.length > 1
    ? `${weekDays[0].toLocaleDateString("pt-BR")} — ${weekDays[weekDays.length - 1].toLocaleDateString("pt-BR")}`
    : baseDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <Layout title="Agenda">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-input overflow-hidden">
            <button onClick={() => setView("dia")} className={`px-3 py-1.5 text-sm ${view === "dia" ? "bg-primary text-primary-foreground" : "bg-background"}`}>Dia</button>
            <button onClick={() => setView("semana")} className={`px-3 py-1.5 text-sm ${view === "semana" ? "bg-primary text-primary-foreground" : "bg-background"}`}>Semana</button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-medium min-w-[180px] text-center">{dateStr}</span>
            <Button variant="outline" size="icon" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Select value={filterProf} onValueChange={setFilterProf}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Profissional" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos profissionais</SelectItem>
              {MOCK_PROFESSIONALS.filter(p => p.status === "ativo").map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterSpec} onValueChange={setFilterSpec}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Especialidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas especialidades</SelectItem>
              {(Object.keys(ESPECIALIDADE_BG) as Especialidade[]).map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="ml-auto">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Sessão</Button>
          </div>
        </div>

        {/* Grid */}
        <Card className="card-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="p-2 text-left font-medium text-muted-foreground w-16 sticky left-0 bg-primary/5 border-r">Horário</th>
                    {weekDays.map(d => (
                      <th key={d.toISOString()} className="p-2 text-center font-medium text-foreground min-w-[180px]">
                        <div>{ptWeekday(d)}</div>
                        <div className="text-xs text-muted-foreground">{d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map(hour => (
                    <tr key={hour} className="border-t">
                      <td className="p-2 text-xs text-muted-foreground sticky left-0 bg-background border-r align-top">{hour}</td>
                      {weekDays.map(day => {
                        const dayStr = formatDate(day);
                        const sessions = filteredSessions.filter(s => s.dataSessao === dayStr && s.horarioInicio.startsWith(hour.split(":")[0]));
                        return (
                          <td key={dayStr} className="p-1 align-top border-l min-h-[60px]">
                            {sessions.map(s => (
                              <button
                                key={s.id}
                                onClick={() => setSelectedSession(s)}
                                className="w-full text-left p-2 rounded-md mb-1 text-xs cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: ESPECIALIDADE_BG[s.especialidade] }}
                              >
                                <div className="font-medium truncate">{s.patientNome}</div>
                                <div className="text-muted-foreground">{s.horarioInicio}-{s.horarioFim}</div>
                                <div className="text-muted-foreground truncate">{s.professionalNome} · {s.sala}</div>
                              </button>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session detail modal */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSession.patientNome} — {selectedSession.especialidade}</DialogTitle>
                <DialogDescription>
                  {new Date(selectedSession.dataSessao).toLocaleDateString("pt-BR")} · {selectedSession.horarioInicio} – {selectedSession.horarioFim}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Profissional</span><span>{selectedSession.professionalNome}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Sala</span><span>{selectedSession.sala}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span className="capitalize">{selectedSession.tipo}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize px-2 py-0.5 rounded-full text-xs font-medium" style={{
                    backgroundColor: selectedSession.status === "realizada" ? "#D1FAE5" : selectedSession.status === "cancelada" ? "#FEE2E2" : selectedSession.status === "no_show" ? "#FEE2E2" : "#FEF3C7",
                    color: selectedSession.status === "realizada" ? "#065F46" : selectedSession.status === "cancelada" ? "#991B1B" : selectedSession.status === "no_show" ? "#7F1D1D" : "#92400E"
                  }}>{selectedSession.status === "no_show" ? "No-show" : selectedSession.status}</span>
                </div>
                {selectedSession.observacoes && <div><span className="text-muted-foreground">Obs:</span> {selectedSession.observacoes}</div>}
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setSelectedSession(null)}>Fechar</Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Marcar No-show</Button>
                <Button>Registrar Evolução</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
