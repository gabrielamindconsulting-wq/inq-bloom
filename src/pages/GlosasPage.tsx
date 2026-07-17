import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertOctagon, TrendingDown, RotateCcw, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const GLOSAS = [
  { lote: "L-2026-02-BRA", paciente: "Ana Beatriz", motivo: "Guia vencida", valor: 320, status: "recorrida" },
  { lote: "L-2026-02-UNI", paciente: "Lucas Mendes", motivo: "Sessão fora da autorização", valor: 145, status: "aceita" },
  { lote: "L-2026-02-SUL", paciente: "Marina Souza", motivo: "Código TUSS incorreto", valor: 155, status: "recorrida" },
  { lote: "L-2026-01-BRA", paciente: "Felipe Cardoso", motivo: "Falta assinatura profissional", valor: 130, status: "recuperada" },
  { lote: "L-2026-01-UNI", paciente: "Pedro Henrique", motivo: "Duplicidade", valor: 145, status: "aceita" },
];
const MOTIVOS = [
  { name: "Guia vencida", value: 32, color: "#dc2626" },
  { name: "Autorização", value: 28, color: "#f59e0b" },
  { name: "TUSS incorreto", value: 18, color: "#2D6A2D" },
  { name: "Assinatura", value: 12, color: "#3b82f6" },
  { name: "Duplicidade", value: 10, color: "#8b5cf6" },
];
const S: Record<string,string> = { aceita:"bg-red-100 text-red-800", recorrida:"bg-amber-100 text-amber-800", recuperada:"bg-emerald-100 text-emerald-800" };
const SL: Record<string,string> = { aceita:"Aceita", recorrida:"Em recurso", recuperada:"Recuperada" };

export default function GlosasPage() {
  return (
    <Layout title="Glosas">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Taxa de glosa" value="3.9%" icon={TrendingDown} accent trend={{ value: "-0.6pp", positive: true }} />
          <KpiCard label="Valor glosado (mês)" value="R$ 8.2k" icon={AlertOctagon} />
          <KpiCard label="Em recurso" value={14} icon={RotateCcw} hint="R$ 3.1k pleiteados" />
          <KpiCard label="Recuperado (YTD)" value="R$ 12.4k" icon={CheckCircle2} trend={{ value: "62% de sucesso", positive: true }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="card-shadow lg:col-span-1">
            <CardHeader><CardTitle className="text-base">Motivos de glosa</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={MOTIVOS} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {MOTIVOS.map(m => <Cell key={m.name} fill={m.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2 text-xs">
                {MOTIVOS.map(m => (
                  <div key={m.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                    <span className="flex-1 text-muted-foreground">{m.name}</span>
                    <span className="font-medium">{m.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Ocorrências de glosa</CardTitle>
              <div className="flex gap-2"><ExportBar label="Glosas" /><Button variant="outline" size="sm">Novo recurso</Button></div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-primary/5"><TableHead>Lote</TableHead><TableHead>Paciente</TableHead><TableHead>Motivo</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="text-center">Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {GLOSAS.map((g,i)=>(
                    <TableRow key={i} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs">{g.lote}</TableCell>
                      <TableCell>{g.paciente}</TableCell>
                      <TableCell className="text-sm">{g.motivo}</TableCell>
                      <TableCell className="text-right">R$ {g.valor},00</TableCell>
                      <TableCell className="text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${S[g.status]}`}>{SL[g.status]}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
