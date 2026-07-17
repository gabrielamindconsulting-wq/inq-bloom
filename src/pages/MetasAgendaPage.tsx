import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const SERIES = ["Set","Out","Nov","Dez","Jan","Fev","Mar"].map((m,i)=>({ mes: m, meta: 720, real: 610 + i*22 + Math.round(Math.random()*30) }));
const POR_PROF = [
  { prof: "Dra. Ana Lima", meta: 80, real: 84, ades: "105%" },
  { prof: "Dr. Pedro Ramos", meta: 70, real: 68, ades: "97%" },
  { prof: "Dra. Carla Dias", meta: 60, real: 48, ades: "80%" },
  { prof: "Dr. Marcos Vieira", meta: 75, real: 78, ades: "104%" },
  { prof: "Dra. Beatriz Rosa", meta: 55, real: 42, ades: "76%" },
  { prof: "Dr. Rafael Alves", meta: 45, real: 47, ades: "104%" },
];

export default function MetasAgendaPage() {
  return (
    <Layout title="Metas de Agenda">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Adesão global" value="95%" icon={Target} accent trend={{ value: "+3pp", positive: true }} />
          <KpiCard label="Meta mensal" value="720 sessões" icon={TrendingUp} />
          <KpiCard label="Realizadas (Mar)" value={682} icon={Users} hint="94.7% da meta" />
          <KpiCard label="Abaixo da meta" value={2} icon={AlertTriangle} hint="Ação individual" />
        </div>

        <Card className="card-shadow">
          <CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Meta × Realizado (mensal)</CardTitle><ExportBar label="Metas" /></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Legend />
                <Line dataKey="meta" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Meta" />
                <Line dataKey="real" stroke="#2D6A2D" strokeWidth={2.5} name="Realizado" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Adesão por profissional</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5">
                <TableHead>Profissional</TableHead><TableHead className="text-center">Meta</TableHead>
                <TableHead className="text-center">Realizado</TableHead><TableHead className="text-right">Adesão</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {POR_PROF.map((p,i)=>{
                  const pct = Number(p.ades.replace("%",""));
                  return (
                    <TableRow key={i} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{p.prof}</TableCell>
                      <TableCell className="text-center">{p.meta}</TableCell>
                      <TableCell className="text-center">{p.real}</TableCell>
                      <TableCell className={`text-right font-semibold ${pct>=100?"text-emerald-600":pct>=90?"text-primary":"text-red-600"}`}>{p.ades}</TableCell>
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
