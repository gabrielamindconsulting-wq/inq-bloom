import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollText, Users, Clock, CheckCircle2 } from "lucide-react";

const GRADE = [
  { conv: "Unimed", slotsSemanais: 168, ocupados: 158, pacientes: 42, tempoEspera: "8 dias" },
  { conv: "Bradesco", slotsSemanais: 112, ocupados: 96, pacientes: 28, tempoEspera: "12 dias" },
  { conv: "Amil", slotsSemanais: 76, ocupados: 60, pacientes: 19, tempoEspera: "6 dias" },
  { conv: "SulAmérica", slotsSemanais: 96, ocupados: 88, pacientes: 24, tempoEspera: "10 dias" },
  { conv: "Particular", slotsSemanais: 60, ocupados: 45, pacientes: 15, tempoEspera: "3 dias" },
];

export default function GradeConvenioPage() {
  return (
    <Layout title="Grade por Convênio">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Slots semanais" value={512} icon={ScrollText} accent />
          <KpiCard label="Pacientes ativos" value={128} icon={Users} />
          <KpiCard label="Ocupação convênios" value="87%" icon={CheckCircle2} trend={{ value: "+5pp", positive: true }} />
          <KpiCard label="Tempo médio espera" value="8.2 dias" icon={Clock} hint="Meta: 7 dias" />
        </div>

        <div className="flex justify-end"><ExportBar label="Grade por convênio" /></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Distribuição semanal por convênio</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5">
                <TableHead>Convênio</TableHead>
                <TableHead className="text-center">Slots reservados</TableHead>
                <TableHead>Ocupação</TableHead>
                <TableHead className="text-center">Pacientes</TableHead>
                <TableHead className="text-right">Espera</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {GRADE.map((g,i)=>{
                  const pct = Math.round(g.ocupados/g.slotsSemanais*100);
                  return (
                    <TableRow key={i} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{g.conv}</TableCell>
                      <TableCell className="text-center">{g.slotsSemanais}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[160px]">
                            <div className={`h-full ${pct>=90?"bg-primary":pct>=70?"bg-emerald-500":"bg-amber-500"}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-14">{g.ocupados}/{g.slotsSemanais}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{g.pacientes}</TableCell>
                      <TableCell className="text-right">{g.tempoEspera}</TableCell>
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
