import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle2, Clock, AlertTriangle, Plus } from "lucide-react";

const PTS = [
  { paciente: "Lucas Mendes", equipe: "Fono, TO, Psi", objetivos: 8, cumpridos: 5, revisao: "15/04/2026", status: "em_curso" },
  { paciente: "Ana Beatriz", equipe: "Fono, Psi", objetivos: 6, cumpridos: 6, revisao: "01/04/2026", status: "revisao" },
  { paciente: "Felipe Cardoso", equipe: "Neuro, Psi", objetivos: 5, cumpridos: 2, revisao: "20/03/2026", status: "atrasado" },
  { paciente: "Marina Souza", equipe: "TO, Fisio", objetivos: 7, cumpridos: 4, revisao: "22/04/2026", status: "em_curso" },
  { paciente: "Pedro Henrique", equipe: "Fisio, TO", objetivos: 4, cumpridos: 4, revisao: "05/04/2026", status: "revisao" },
];
const S: Record<string,string> = { em_curso:"bg-blue-100 text-blue-800", revisao:"bg-amber-100 text-amber-800", atrasado:"bg-red-100 text-red-800", concluido:"bg-emerald-100 text-emerald-800" };
const SL: Record<string,string> = { em_curso:"Em curso", revisao:"Revisão", atrasado:"Atrasado", concluido:"Concluído" };

export default function PtsPage() {
  return (
    <Layout title="Plano Terapêutico Singular (PTS)">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="PTS ativos" value={128} icon={Target} accent />
          <KpiCard label="Objetivos cumpridos" value="64%" icon={CheckCircle2} trend={{ value: "+4pp", positive: true }} />
          <KpiCard label="Revisões próximas" value={9} icon={Clock} hint="Próximos 15 dias" />
          <KpiCard label="Atrasados" value={3} icon={AlertTriangle} hint="Sem revisão >90d" />
        </div>

        <div className="flex justify-end gap-2"><ExportBar label="PTS" /><Button className="gap-2"><Plus className="h-4 w-4" /> Novo PTS</Button></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Planos terapêuticos ativos</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5">
                <TableHead>Paciente</TableHead><TableHead>Equipe</TableHead>
                <TableHead>Objetivos</TableHead><TableHead>Próxima revisão</TableHead><TableHead className="text-center">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {PTS.map((p, i) => {
                  const pct = Math.round((p.cumpridos/p.objetivos)*100);
                  return (
                    <TableRow key={i} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{p.paciente}</TableCell>
                      <TableCell className="text-sm">{p.equipe}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[130px]">
                            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-14">{p.cumpridos}/{p.objetivos}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{p.revisao}</TableCell>
                      <TableCell className="text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${S[p.status]}`}>{SL[p.status]}</span></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
