import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_SESSIONS, MOCK_CHECKINS, MOCK_EVOLUTIONS, MOCK_PROFESSIONALS, MOCK_SUBSTITUTIONS } from "@/data/clinicalMockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { CalendarCheck, Clock, Users, FileText, AlertTriangle } from "lucide-react";

const today = new Date().toISOString().split("T")[0];
const sessionsToday = MOCK_SESSIONS.filter(s => s.dataSessao === today);
const realized = sessionsToday.filter(s => s.status === "realizada").length;
const cancelled = sessionsToday.filter(s => s.status === "cancelada").length;
const noShow = sessionsToday.filter(s => s.status === "no_show").length;
const awaitingCheckin = MOCK_CHECKINS.filter(c => c.status === "aguardando").length;
const activeProfessionals = MOCK_PROFESSIONALS.filter(p => p.status === "ativo").length;
const pendingEvolutions = MOCK_EVOLUTIONS.filter(e => e.atraso).length;
const pendingSubstitutions = MOCK_SUBSTITUTIONS.filter(s => s.status === "pendente").length;

const sessionsBySpecialty = [
  { name: "Fono", realizadas: 3, agendadas: 5 },
  { name: "T.O.", realizadas: 2, agendadas: 3 },
  { name: "Psicologia", realizadas: 2, agendadas: 4 },
  { name: "Fisioterapia", realizadas: 3, agendadas: 3 },
  { name: "Psicoped.", realizadas: 1, agendadas: 2 },
  { name: "Neuropsi.", realizadas: 1, agendadas: 2 },
];

const presenceData = [
  { name: "Realizadas", value: realized + 5, color: "#2D6A2D" },
  { name: "Canceladas", value: cancelled + 1, color: "#F59E0B" },
  { name: "No-show", value: noShow + 1, color: "#EF4444" },
];

const trendData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return { date: `${d.getDate()}/${d.getMonth() + 1}`, sessoes: Math.floor(Math.random() * 8) + 6 };
});

const adherenceData = MOCK_PROFESSIONALS.filter(p => p.status === "ativo").map(p => ({
  name: p.nome.split(" ").slice(0, 2).join(" "),
  taxa: Math.floor(Math.random() * 25) + 75,
}));

const alerts = [
  ...(pendingEvolutions > 0 ? [{ level: "critico" as const, icon: "red", text: `Evoluções atrasadas — ${MOCK_EVOLUTIONS.filter(e => e.atraso).map(e => e.professionalNome).join(", ")}` }] : []),
  ...(pendingSubstitutions > 0 ? [{ level: "atencao" as const, icon: "yellow", text: `${pendingSubstitutions} substituição(ões) pendente(s) aguardando confirmação` }] : []),
];

export default function ClinicalDashboard() {
  return (
    <Layout title="Dashboard Clínico">
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessões do Dia</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{sessionsToday.length}</p>
                  <div className="flex gap-2 mt-1 text-xs">
                    <span className="text-green-700">{realized} realizadas</span>
                    <span className="text-amber-600">{cancelled} cancel.</span>
                    <span className="text-red-600">{noShow} no-show</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aguardando Check-in</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{awaitingCheckin}</p>
                  <p className="text-xs text-muted-foreground mt-1">pacientes ainda não chegaram</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profissionais Presentes</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{activeProfessionals - 2} / {activeProfessionals}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div className="bg-primary rounded-full h-1.5" style={{ width: `${((activeProfessionals - 2) / activeProfessionals) * 100}%` }} />
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`card-shadow ${pendingEvolutions > 0 ? "border-red-300" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Evoluções Pendentes</p>
                  <p className={`text-2xl font-bold mt-1 ${pendingEvolutions > 0 ? "text-red-600" : "text-foreground"}`}>{pendingEvolutions}</p>
                  <p className="text-xs text-muted-foreground mt-1">{pendingEvolutions > 0 ? "registros atrasados >24h" : "tudo em dia"}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${pendingEvolutions > 0 ? "bg-red-100" : "bg-primary/10"}`}>
                  <FileText className={`h-5 w-5 ${pendingEvolutions > 0 ? "text-red-600" : "text-primary"}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Sessões por Especialidade</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sessionsBySpecialty}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="agendadas" fill="#7CB87C" name="Agendadas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="realizadas" fill="#2D6A2D" name="Realizadas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Presença vs Faltas vs Cancelamentos</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={presenceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {presenceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 ml-4">
                {presenceData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tendência — Últimos 30 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sessoes" stroke="#7CB87C" fill="#7CB87C" fillOpacity={0.2} name="Sessões" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Taxa de Aderência por Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={adherenceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="taxa" fill="#2D6A2D" radius={[0, 4, 4, 0]} name="Aderência %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="card-shadow border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg text-sm ${a.level === "critico" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800"}`}>
                  <div className={`h-2 w-2 rounded-full ${a.level === "critico" ? "bg-red-500" : "bg-amber-500"}`} />
                  {a.text}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
