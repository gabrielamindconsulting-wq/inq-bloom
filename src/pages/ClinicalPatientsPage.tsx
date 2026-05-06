import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_CLINICAL_PATIENTS, MOCK_PROFESSIONALS, PATIENT_STATUS_CONFIG, ESPECIALIDADE_COLORS, type Especialidade } from "@/data/clinicalMockData";
import { calcAge } from "@/data/mockData";
import { Search, Plus, Download, FileText, CalendarDays } from "lucide-react";

export default function ClinicalPatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specFilter, setSpecFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = MOCK_CLINICAL_PATIENTS;
    if (search) list = list.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") list = list.filter(p => p.status === statusFilter);
    if (specFilter !== "all") list = list.filter(p => p.especialidades.includes(specFilter as Especialidade));
    return list;
  }, [search, statusFilter, specFilter]);

  return (
    <Layout title="Pacientes">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(PATIENT_STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={specFilter} onValueChange={setSpecFilter}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Especialidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas especialidades</SelectItem>
              {Object.keys(ESPECIALIDADE_COLORS).map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1 ml-auto"><Download className="h-4 w-4" /> Exportar CSV</Button>
          <Button className="gap-1" onClick={() => navigate("/pacientes/novo")}><Plus className="h-4 w-4" /> Novo Paciente</Button>
        </div>

        {/* Table */}
        <Card className="card-shadow">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary/5 border-b">
                    <th className="text-left p-3 font-medium">Nome</th>
                    <th className="text-left p-3 font-medium">Idade</th>
                    <th className="text-left p-3 font-medium">Especialidades</th>
                    <th className="text-left p-3 font-medium">Terapeuta Principal</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const age = calcAge(p.dataNascimento);
                    const sc = PATIENT_STATUS_CONFIG[p.status];
                    return (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3">
                          <button onClick={() => navigate(`/pacientes/${p.id}`)} className="font-medium text-primary hover:underline text-left">{p.nome}</button>
                          <p className="text-xs text-muted-foreground">{p.responsavelNome} ({p.responsavelParentesco})</p>
                        </td>
                        <td className="p-3 text-muted-foreground">{age.label}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {p.especialidades.map(e => (
                              <span key={e} className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESPECIALIDADE_COLORS[e]}`}>{e}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">{p.terapeutaPrincipalNome}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => navigate(`/pacientes/${p.id}`)}>
                              <FileText className="h-3.5 w-3.5" /> Ficha
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
