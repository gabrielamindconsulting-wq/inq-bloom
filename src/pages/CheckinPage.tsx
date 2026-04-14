import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_CHECKINS, CHECKIN_STATUS_CONFIG, ESPECIALIDADE_COLORS, type CheckinStatus } from "@/data/clinicalMockData";
import { RefreshCw, Eye } from "lucide-react";

type ViewMode = "lista" | "sala";

export default function CheckinPage() {
  const [checkins, setCheckins] = useState(MOCK_CHECKINS);
  const [filter, setFilter] = useState<CheckinStatus | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("lista");

  const filtered = filter === "all" ? checkins : checkins.filter(c => c.status === filter);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  function updateStatus(id: string, newStatus: CheckinStatus) {
    setCheckins(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, status: newStatus };
      if (newStatus === "chegou") updated.horarioChegada = timeStr;
      if (newStatus === "em_atendimento") updated.horarioInicioAtendimento = timeStr;
      if (newStatus === "finalizado") updated.horarioFimAtendimento = timeStr;
      return updated;
    }));
  }

  const rooms = [...new Set(checkins.map(c => c.sala))].sort();

  const statusFilters: (CheckinStatus | "all")[] = ["all", "aguardando", "chegou", "em_atendimento", "finalizado", "cancelado"];
  const statusLabels: Record<string, string> = { all: "Todos", ...Object.fromEntries(Object.entries(CHECKIN_STATUS_CONFIG).map(([k, v]) => [k, v.label])) };

  return (
    <Layout title="Check-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Atualizado: {timeStr}</span>
            <Button variant="outline" size="sm" className="gap-1"><RefreshCw className="h-3.5 w-3.5" /> Atualizar</Button>
          </div>
        </div>

        {/* View toggle + status filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-input overflow-hidden mr-3">
            <button onClick={() => setViewMode("lista")} className={`px-3 py-1.5 text-sm ${viewMode === "lista" ? "bg-primary text-primary-foreground" : "bg-background"}`}>Lista</button>
            <button onClick={() => setViewMode("sala")} className={`px-3 py-1.5 text-sm ${viewMode === "sala" ? "bg-primary text-primary-foreground" : "bg-background"}`}>Por Sala</button>
          </div>
          {statusFilters.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted/50"}`}>
              {statusLabels[s]}
            </button>
          ))}
        </div>

        {viewMode === "lista" ? (
          /* List view */
          <Card className="card-shadow">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary/5 border-b">
                      <th className="text-left p-3 font-medium w-16">Horário</th>
                      <th className="text-left p-3 font-medium">Paciente</th>
                      <th className="text-left p-3 font-medium">Especialidade</th>
                      <th className="text-left p-3 font-medium">Profissional</th>
                      <th className="text-left p-3 font-medium">Sala</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.sort((a, b) => a.horarioAgendado.localeCompare(b.horarioAgendado)).map(c => {
                      const sc = CHECKIN_STATUS_CONFIG[c.status];
                      return (
                        <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                          <td className="p-3 font-mono text-muted-foreground">{c.horarioAgendado}</td>
                          <td className="p-3">
                            <span className="font-medium">{c.patientNome}</span>
                            <span className="text-xs text-muted-foreground ml-1">({c.patientIdade})</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESPECIALIDADE_COLORS[c.especialidade]}`}>{c.especialidade}</span>
                          </td>
                          <td className="p-3">{c.professionalNome}</td>
                          <td className="p-3">{c.sala}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                          </td>
                          <td className="p-3">
                            {c.status === "aguardando" && (
                              <Button size="sm" className="gap-1 text-xs" onClick={() => updateStatus(c.id, "chegou")}>Chegou</Button>
                            )}
                            {c.status === "chegou" && (
                              <Button size="sm" variant="outline" className="gap-1 text-xs border-primary/30 text-primary" onClick={() => updateStatus(c.id, "em_atendimento")}>Iniciar</Button>
                            )}
                            {c.status === "em_atendimento" && (
                              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => updateStatus(c.id, "finalizado")}>Finalizar</Button>
                            )}
                            {(c.status === "aguardando" || c.status === "chegou") && (
                              <Button size="sm" variant="outline" className="gap-1 text-xs ml-1 text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus(c.id, "no_show")}>No-show</Button>
                            )}
                            {c.status === "finalizado" && (
                              <Button size="sm" variant="ghost" className="gap-1 text-xs"><Eye className="h-3.5 w-3.5" /> Ver</Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Room view */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(room => {
              const roomCheckins = filtered.filter(c => c.sala === room).sort((a, b) => a.horarioAgendado.localeCompare(b.horarioAgendado));
              return (
                <Card key={room} className="card-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">{room}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {roomCheckins.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">Sem sessões</p>
                    ) : roomCheckins.map(c => {
                      const sc = CHECKIN_STATUS_CONFIG[c.status];
                      return (
                        <div key={c.id} className="flex items-center justify-between p-2 border rounded-md text-xs">
                          <div>
                            <span className="font-mono text-muted-foreground mr-2">{c.horarioAgendado}</span>
                            <span className="font-medium">{c.patientNome}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
