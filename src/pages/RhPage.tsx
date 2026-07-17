import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Calendar, AlertTriangle, Plus } from "lucide-react";

const COLABS = [
  { nome: "Dra. Ana Lima", cargo: "Fonoaudióloga", vinculo: "CLT", admissao: "12/04/2022", ferias: "Dez/2026", ultTreino: "Fev/2026" },
  { nome: "Dr. Pedro Ramos", cargo: "Terapeuta Ocupacional", vinculo: "PJ", admissao: "05/09/2021", ferias: "—", ultTreino: "Jan/2026" },
  { nome: "Dra. Carla Dias", cargo: "Psicóloga", vinculo: "CLT", admissao: "01/03/2023", ferias: "Mar/2026", ultTreino: "Dez/2025" },
  { nome: "Ana Recepcionista", cargo: "Recepção", vinculo: "CLT", admissao: "10/08/2024", ferias: "Ago/2026", ultTreino: "Nov/2025" },
  { nome: "Marcos Silva", cargo: "Administrativo", vinculo: "CLT", admissao: "20/01/2020", ferias: "Vencidas", ultTreino: "Mai/2025" },
];

export default function RhPage() {
  return (
    <Layout title="RH — Gestão de Pessoas">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Colaboradores" value={34} icon={Briefcase} accent hint="24 clínicos + 10 admin" />
          <KpiCard label="Turnover 12m" value="8.5%" icon={AlertTriangle} trend={{ value: "-2.1pp", positive: true }} />
          <KpiCard label="Férias vencidas" value={1} icon={Calendar} hint="Ação urgente" />
          <KpiCard label="Treinamentos ativos" value={5} icon={GraduationCap} />
        </div>

        <div className="flex justify-end gap-2"><ExportBar label="Colaboradores" /><Button className="gap-2"><Plus className="h-4 w-4" /> Novo colaborador</Button></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Quadro de colaboradores</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5">
                <TableHead>Nome</TableHead><TableHead>Cargo</TableHead><TableHead>Vínculo</TableHead>
                <TableHead>Admissão</TableHead><TableHead>Próximas férias</TableHead><TableHead>Último treinamento</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {COLABS.map((c,i)=>(
                  <TableRow key={i} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell>{c.cargo}</TableCell>
                    <TableCell><span className={`px-2 py-0.5 rounded-full text-xs ${c.vinculo==="CLT"?"bg-blue-100 text-blue-800":"bg-purple-100 text-purple-800"}`}>{c.vinculo}</span></TableCell>
                    <TableCell className="text-sm">{c.admissao}</TableCell>
                    <TableCell className={`text-sm ${c.ferias==="Vencidas"?"text-red-600 font-semibold":""}`}>{c.ferias}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.ultTreino}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
