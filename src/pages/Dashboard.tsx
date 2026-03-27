import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { MOCK_PATIENTS, calcAge, STATUS_LABELS, type ScreeningStatus } from "@/data/mockData";
import { Users, Clock, Play, CheckCircle, Search, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const statusData = [
  { name: "Não iniciada", value: MOCK_PATIENTS.filter((p) => p.statusTriagem === "nao_iniciada").length },
  { name: "Em andamento", value: MOCK_PATIENTS.filter((p) => p.statusTriagem === "em_andamento").length },
  { name: "Concluída", value: MOCK_PATIENTS.filter((p) => p.statusTriagem === "concluida").length },
];

const weeklyData = [
  { week: "Sem 1", leads: 2 },
  { week: "Sem 2", leads: 3 },
  { week: "Sem 3", leads: 1 },
  { week: "Sem 4", leads: 4 },
  { week: "Sem 5", leads: 2 },
];

const genderData = [
  { name: "Masculino", value: MOCK_PATIENTS.filter((p) => p.sexo === "Masculino").length },
  { name: "Feminino", value: MOCK_PATIENTS.filter((p) => p.sexo === "Feminino").length },
];

const ageRangeData = (() => {
  const ranges = ["0-2 anos", "2-4 anos", "4-6 anos", "6-8 anos", "8-10 anos", "+10 anos"];
  return ranges.map((range) => {
    let count = 0;
    MOCK_PATIENTS.forEach((p) => {
      const age = calcAge(p.dataNascimento).years;
      if (range === "0-2 anos" && age < 2) count++;
      else if (range === "2-4 anos" && age >= 2 && age < 4) count++;
      else if (range === "4-6 anos" && age >= 4 && age < 6) count++;
      else if (range === "6-8 anos" && age >= 6 && age < 8) count++;
      else if (range === "8-10 anos" && age >= 8 && age < 10) count++;
      else if (range === "+10 anos" && age >= 10) count++;
    });
    return { range, count };
  });
})();

const COLORS = ["#2D6A2D", "#7CB87C"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [profFilter, setProfFilter] = useState<string>("todos");
  const [sexFilter, setSexFilter] = useState<string>("todos");

  const professionals = useMemo(() => {
    const set = new Set<string>();
    MOCK_PATIENTS.forEach((p) => { if (p.profissionalNome) set.add(p.profissionalNome); });
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_PATIENTS.filter((p) => {
      if (search && !p.nome.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "todos" && p.statusTriagem !== statusFilter) return false;
      if (profFilter !== "todos" && p.profissionalNome !== profFilter) return false;
      if (sexFilter !== "todos" && p.sexo !== sexFilter) return false;
      return true;
    });
  }, [search, statusFilter, profFilter, sexFilter]);

  const total = MOCK_PATIENTS.length;
  const naoIniciada = MOCK_PATIENTS.filter((p) => p.statusTriagem === "nao_iniciada").length;
  const emAndamento = MOCK_PATIENTS.filter((p) => p.statusTriagem === "em_andamento").length;
  const concluida = MOCK_PATIENTS.filter((p) => p.statusTriagem === "concluida").length;

  const bigNumbers = [
    { label: "Total de Leads", value: total, icon: Users, color: "text-foreground" },
    { label: "Triagens Não Iniciadas", value: naoIniciada, icon: Clock, color: "text-status-pending-text" },
    { label: "Triagens Em Andamento", value: emAndamento, icon: Play, color: "text-primary" },
    { label: "Triagens Concluídas", value: concluida, icon: CheckCircle, color: "text-status-done-text" },
  ];

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Layout title="Rastreio – Triagem">
      {/* Big Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {bigNumbers.map((item) => (
          <div key={item.label} className="bg-card rounded-lg border border-border p-5 card-shadow flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-card rounded-lg border border-border p-5 card-shadow">
          <h3 className="font-semibold text-foreground mb-4">Leads por Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2D6A2D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 card-shadow">
          <h3 className="font-semibold text-foreground mb-4">Leads por Semana</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#7CB87C" strokeWidth={2} dot={{ fill: "#7CB87C" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-5 card-shadow">
          <h3 className="font-semibold text-foreground mb-4">Leads por Sexo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-lg border border-border p-5 card-shadow">
          <h3 className="font-semibold text-foreground mb-4">Distribuição por Faixa Etária</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageRangeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="range" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#7CB87C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card rounded-lg border border-border p-4 card-shadow mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Todos os status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="nao_iniciada">Não iniciada</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
          <Select value={profFilter} onValueChange={setProfFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Todos os profissionais" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os profissionais</SelectItem>
              {professionals.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sexFilter} onValueChange={setSexFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Todos os sexos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os sexos</SelectItem>
              <SelectItem value="Masculino">Masculino</SelectItem>
              <SelectItem value="Feminino">Feminino</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary-light">
            <Download className="h-4 w-4 mr-2" />Exportar CSV
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />Adicionar Lead
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Nome</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Idade</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Sexo</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Responsável</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Telefone</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Cadastro</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Profissional</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => navigate(`/paciente/${p.id}`)} className="text-primary font-medium hover:underline">
                      {p.nome}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{calcAge(p.dataNascimento).label}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.sexo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.responsavelNome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.responsavelTelefone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(p.dataCadastro)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.statusTriagem} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.profissionalNome ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/paciente/${p.id}`)} className="text-xs border-border">
                        Detalhes
                      </Button>
                      {p.statusTriagem === "nao_iniciada" && (
                        <Button size="sm" onClick={() => navigate(`/triagem/${p.id}`)} className="text-xs bg-primary text-primary-foreground hover:bg-primary-hover">
                          Iniciar
                        </Button>
                      )}
                      {p.statusTriagem === "em_andamento" && (
                        <Button size="sm" variant="outline" onClick={() => navigate(`/triagem/${p.id}`)} className="text-xs border-primary text-primary">
                          Continuar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhum lead encontrado com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
