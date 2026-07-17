import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileCheck, AlertTriangle, Clock, CheckCircle2, Plus } from "lucide-react";

const GUIAS = [
  { paciente: "Lucas Mendes", convenio: "Unimed", numero: "GA-2026-0421", sessoesAutorizadas: 40, usadas: 33, vencimento: "12/04/2026", status: "vencendo" },
  { paciente: "Ana Beatriz",  convenio: "Bradesco", numero: "GA-2026-0389", sessoesAutorizadas: 24, usadas: 24, vencimento: "05/03/2026", status: "esgotada" },
  { paciente: "Felipe Cardoso", convenio: "Amil", numero: "GA-2026-0512", sessoesAutorizadas: 20, usadas: 8, vencimento: "30/09/2026", status: "ok" },
  { paciente: "Marina Souza", convenio: "Unimed", numero: "GA-2026-0498", sessoesAutorizadas: 30, usadas: 22, vencimento: "18/07/2026", status: "ok" },
  { paciente: "Pedro Henrique", convenio: "SulAmérica", numero: "GA-2026-0301", sessoesAutorizadas: 15, usadas: 14, vencimento: "22/03/2026", status: "vencendo" },
];

const STATUS: Record<string, string> = { ok: "bg-emerald-100 text-emerald-800", vencendo: "bg-amber-100 text-amber-800", esgotada: "bg-red-100 text-red-800" };
const STATUS_LABEL: Record<string, string> = { ok: "Ativa", vencendo: "Vencendo", esgotada: "Esgotada" };

export default function GuiasPage() {
  return (
    <Layout title="Guias & Autorizações">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Guias ativas" value={128} icon={FileCheck} accent />
          <KpiCard label="Vencendo em 30 dias" value={12} icon={Clock} hint="Ação preventiva" />
          <KpiCard label="Sessões esgotadas" value={4} icon={AlertTriangle} hint="Bloqueio de agenda" />
          <KpiCard label="Guias renovadas (mês)" value={22} icon={CheckCircle2} trend={{ value: "+18%", positive: true }} />
        </div>

        <div className="flex justify-end gap-2"><ExportBar label="Guias" /><Button className="gap-2"><Plus className="h-4 w-4" /> Nova guia</Button></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Guias por paciente</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead>Paciente</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Nº Guia</TableHead>
                  <TableHead className="text-center">Uso</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {GUIAS.map(g => {
                  const pct = Math.round((g.usadas / g.sessoesAutorizadas) * 100);
                  return (
                    <TableRow key={g.numero} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{g.paciente}</TableCell>
                      <TableCell>{g.convenio}</TableCell>
                      <TableCell className="font-mono text-xs">{g.numero}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px]">
                            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-16">{g.usadas}/{g.sessoesAutorizadas}</span>
                        </div>
                      </TableCell>
                      <TableCell>{g.vencimento}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS[g.status]}`}>{STATUS_LABEL[g.status]}</span>
                      </TableCell>
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
