import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MOCK_ROOMS, MOCK_SESSIONS, ESPECIALIDADE_BG, type Room, type Session, type RoomUnit } from "@/data/clinicalMockData";
import { ChevronLeft, ChevronRight, Plus, Info } from "lucide-react";

const START_HOUR = 7;
const END_HOUR = 19;
const SLOT_MIN = 15;
const SLOTS_PER_HOUR = 60 / SLOT_MIN;
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * SLOTS_PER_HOUR;

function timeToSlot(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h - START_HOUR) * SLOTS_PER_HOUR + Math.floor(m / SLOT_MIN);
}
function slotToTime(slot: number) {
  const total = START_HOUR * 60 + slot * SLOT_MIN;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function fmtDate(d: Date) { return d.toISOString().split("T")[0]; }

interface Assignment { session: Session; startSlot: number; endSlot: number; }

function assignSessions(sessions: Session[], rooms: Room[], dateStr: string) {
  const map = new Map<string, Assignment[][]>();
  for (const room of rooms) {
    map.set(room.id, Array.from({ length: room.capacidade }, () => []));
  }
  const dayS = sessions.filter(s => s.dataSessao === dateStr);
  // map by room name or number
  const findRoom = (sala: string) => rooms.find(r => r.nome === sala || r.numero === sala || sala.includes(r.numero));
  const sorted = [...dayS].sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));
  for (const s of sorted) {
    const room = findRoom(s.sala);
    if (!room) continue;
    const startSlot = timeToSlot(s.horarioInicio);
    const endSlot = Math.max(startSlot + 1, timeToSlot(s.horarioFim));
    const tracks = map.get(room.id)!;
    let vaga = tracks.findIndex(t => t.every(a => a.endSlot <= startSlot || a.startSlot >= endSlot));
    if (vaga === -1) vaga = 0; // overflow, still assign
    tracks[vaga].push({ session: s, startSlot, endSlot });
  }
  return map;
}

export default function AgendaPage() {
  const [unit, setUnit] = useState<RoomUnit>("Asa Sul");
  const [date, setDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [newSlot, setNewSlot] = useState<{ room: Room; vaga: number; slot: number } | null>(null);

  const rooms = useMemo(() => MOCK_ROOMS.filter(r => r.unidade === unit), [unit]);
  const dateStr = fmtDate(date);
  const assignments = useMemo(() => assignSessions(MOCK_SESSIONS, rooms, dateStr), [rooms, dateStr]);
  const totalCols = rooms.reduce((sum, r) => sum + r.capacidade, 0);
  const dayLabel = date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  function shiftDay(delta: number) {
    const d = new Date(date); d.setDate(d.getDate() + delta); setDate(d);
  }

  // Precompute rendering: for each (room, vaga, slot) determine cell type
  type Cell = { kind: "block"; assignment: Assignment; span: number } | { kind: "skip" } | { kind: "empty" };
  function getCell(roomId: string, vaga: number, slot: number): Cell {
    const track = assignments.get(roomId)?.[vaga] ?? [];
    const covering = track.find(a => a.startSlot <= slot && slot < a.endSlot);
    if (!covering) return { kind: "empty" };
    if (covering.startSlot === slot) return { kind: "block", assignment: covering, span: covering.endSlot - covering.startSlot };
    return { kind: "skip" };
  }

  return (
    <Layout title="Agenda por Sala">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-input overflow-hidden">
            {(["Asa Sul", "Águas Claras"] as RoomUnit[]).map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  unit === u ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                }`}>{u}</button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => shiftDay(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-medium min-w-[220px] text-center capitalize">{dayLabel}</span>
            <Button variant="outline" size="icon" onClick={() => shiftDay(1)}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setDate(new Date())} className="ml-1">Hoje</Button>
          </div>
          <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: ESPECIALIDADE_BG.Fonoaudiologia }} /> Fono</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: ESPECIALIDADE_BG["Terapia Ocupacional"] }} /> TO</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: ESPECIALIDADE_BG.Psicologia }} /> Psi</div>
            <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: ESPECIALIDADE_BG.Fisioterapia }} /> Fisio</div>
          </div>
        </div>

        {rooms.length === 0 ? (
          <Card className="card-shadow"><CardContent className="p-10 text-center">
            <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhuma sala cadastrada para <strong>{unit}</strong>. Vá em <strong>Salas</strong> para cadastrar.</p>
          </CardContent></Card>
        ) : (
          <Card className="card-shadow overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[calc(100vh-220px)]">
                <table className="border-collapse text-xs w-full">
                  <thead className="sticky top-0 z-20">
                    <tr>
                      <th rowSpan={2} className="sticky left-0 z-30 bg-primary/10 border border-border p-2 w-16 text-muted-foreground font-medium">Horário</th>
                      {rooms.map(r => (
                        <th key={r.id} colSpan={r.capacidade} className="bg-primary/10 border border-border p-2 text-foreground font-semibold whitespace-nowrap">
                          <div>{r.nome}</div>
                          <div className="text-[10px] font-normal text-muted-foreground">Sala {r.numero} · {r.capacidade} {r.capacidade === 1 ? "vaga" : "vagas"}</div>
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {rooms.flatMap(r => Array.from({ length: r.capacidade }, (_, v) => (
                        <th key={`${r.id}-${v}`} className="bg-primary/5 border border-border px-1 py-0.5 text-[10px] font-medium text-muted-foreground min-w-[95px]">V{v + 1}</th>
                      )))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: TOTAL_SLOTS }, (_, slot) => {
                      const isHourStart = slot % SLOTS_PER_HOUR === 0;
                      const isHalf = slot % SLOTS_PER_HOUR === 2;
                      return (
                        <tr key={slot} className={isHourStart ? "border-t-2 border-primary/40" : ""}>
                          <td className={`sticky left-0 z-10 bg-background border border-border px-2 py-0 text-right align-top text-muted-foreground ${
                            isHourStart ? "font-semibold text-foreground" : isHalf ? "text-[10px]" : "text-[9px] opacity-60"
                          }`}>
                            {isHourStart ? slotToTime(slot) : isHalf ? slotToTime(slot) : ""}
                          </td>
                          {rooms.flatMap(r => Array.from({ length: r.capacidade }, (_, v) => {
                            const cell = getCell(r.id, v, slot);
                            if (cell.kind === "skip") return null;
                            if (cell.kind === "block") {
                              const s = cell.assignment.session;
                              return (
                                <td key={`${r.id}-${v}-${slot}`} rowSpan={cell.span} className="border border-border p-0.5 align-top">
                                  <button
                                    onClick={() => setSelectedSession(s)}
                                    className="w-full h-full min-h-full text-left rounded p-1.5 hover:brightness-95 transition-all"
                                    style={{ background: ESPECIALIDADE_BG[s.especialidade], borderLeft: `3px solid ${ESPECIALIDADE_BG[s.especialidade]}`, filter: "saturate(1.4)" }}>
                                    <div className="font-semibold text-[11px] leading-tight text-gray-800 truncate">{s.patientNome}</div>
                                    <div className="text-[10px] text-gray-700 truncate">{s.professionalNome.replace(/^Dra?\.\s*/, "")}</div>
                                    <div className="text-[10px] text-gray-600 mt-0.5">{s.horarioInicio}–{s.horarioFim}</div>
                                  </button>
                                </td>
                              );
                            }
                            return (
                              <td key={`${r.id}-${v}-${slot}`} className={`border border-border p-0 h-[18px] ${isHourStart ? "bg-muted/20" : ""}`}>
                                <button
                                  onClick={() => setNewSlot({ room: r, vaga: v, slot })}
                                  className="w-full h-full opacity-0 hover:opacity-100 hover:bg-primary-light flex items-center justify-center transition-opacity">
                                  <Plus className="h-3 w-3 text-primary" />
                                </button>
                              </td>
                            );
                          }))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
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
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="capitalize">{selectedSession.status}</span></div>
                {selectedSession.observacoes && <div><span className="text-muted-foreground">Obs:</span> {selectedSession.observacoes}</div>}
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setSelectedSession(null)}>Fechar</Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Marcar No-show</Button>
                <Button>Substituição</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New session modal */}
      <Dialog open={!!newSlot} onOpenChange={() => setNewSlot(null)}>
        <DialogContent className="sm:max-w-md">
          {newSlot && (
            <>
              <DialogHeader>
                <DialogTitle>Nova sessão</DialogTitle>
                <DialogDescription>
                  {newSlot.room.nome} · Vaga {newSlot.vaga + 1} · {slotToTime(newSlot.slot)}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">Formulário completo de agendamento — a implementar (mock). Selecione paciente, profissional compatível e duração.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewSlot(null)}>Cancelar</Button>
                <Button onClick={() => setNewSlot(null)}>Agendar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
