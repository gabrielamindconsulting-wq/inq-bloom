import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_PROFESSIONALS, MOCK_CLINICAL_PATIENTS, MOCK_EVOLUTIONS, ESPECIALIDADE_COLORS, type Especialidade } from "@/data/clinicalMockData";
import { Search, Plus, FileText } from "lucide-react";

export default function ProfessionalsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = MOCK_PROFESSIONALS;
    if (search) list = list.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));
    if (specFilter !== "all") list = list.filter(p => p.especialidades.includes(specFilter as Especialidade));
    if (statusFilter !== "all") list = list.filter(p => p.status === statusFilter);
    return list;
  }, [search, specFilter, statusFilter]);

  return (
    <Layout title="Profissionais">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={specFilter} onValueChange={setSpecFilter}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Especialidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas especialidades</SelectItem>
              {Object.keys(ESPECIALIDADE_COLORS).map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-1 ml-auto"><Plus className="h-4 w-4" /> Cadastrar Profissional</Button>
        </div>

        <Card className="card-shadow">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary/5 border-b">
                    <th className="text-left p-3 font-medium">Nome</th>
                    <th className="text-left p-3 font-medium">Especialidade(s)</th>
                    <th className="text-left p-3 font-medium">Registro</th>
                    <th className="text-left p-3 font-medium">Pacientes Ativos</th>
                    <th className="text-left p-3 font-medium">Evol. Pendentes</th>
                    <th className="text-left p-3 font-medium">Disp. Subst.</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const patientsCount = MOCK_CLINICAL_PATIENTS.filter(cp => cp.terapeutaPrincipalId === p.id && cp.status === "ativo").length;
                    const pendingEvos = MOCK_EVOLUTIONS.filter(e => e.professionalId === p.id && e.atraso).length;
                    return (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3">
                          <button onClick={() => navigate(`/profissionais/${p.id}`)} className="font-medium text-primary hover:underline text-left">{p.nome}</button>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {p.especialidades.map(e => (
                              <span key={e} className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESPECIALIDADE_COLORS[e]}`}>{e}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{p.registroProfissional}</td>
                        <td className="p-3">{patientsCount}</td>
                        <td className="p-3">
                          <span className={pendingEvos > 0 ? "text-red-600 font-semibold" : ""}>{pendingEvos}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.disponivelSubstituicao ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                            {p.disponivelSubstituicao ? "Sim" : "Não"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "ativo" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                            {p.status === "ativo" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="p-3">
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => navigate(`/profissionais/${p.id}`)}>
                            <FileText className="h-3.5 w-3.5" /> Ficha
                          </Button>
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
