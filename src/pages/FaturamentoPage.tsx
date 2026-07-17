import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Receipt, Send, Clock, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const LOTES = [
  { lote: "L-2026-03-UNI", convenio: "Unimed", periodo: "Fev/2026", sessoes: 412, valor: 59740, status: "pago", envio: "05/03/2026" },
  { lote: "L-2026-03-BRA", convenio: "Bradesco", periodo: "Fev/2026", sessoes: 268, valor: 42880, status: "em_analise", envio: "05/03/2026" },
  { lote: "L-2026-03-AMI", convenio: "Amil", periodo: "Fev/2026", sessoes: 189, valor: 24570, status: "enviado", envio: "05/03/2026" },
  { lote: "L-2026-02-UNI", convenio: "Unimed", periodo: "Jan/2026", sessoes: 398, valor: 57710, status: "pago", envio: "05/02/2026" },
];
const STATUS: Record<string,string> = { pago:"bg-emerald-100 text-emerald-800", em_analise:"bg-amber-100 text-amber-800", enviado:"bg-blue-100 text-blue-800", rejeitado:"bg-red-100 text-red-800" };
const STATUS_LABEL: Record<string,string> = { pago:"Pago", em_analise:"Em análise", enviado:"Enviado", rejeitado:"Rejeitado" };

const HIST = [
  { mes: "Set", faturado: 158, recebido: 149 },
  { mes: "Out", faturado: 172, recebido: 160 },
  { mes: "Nov", faturado: 180, recebido: 168 },
  { mes: "Dez", faturado: 165, recebido: 155 },
  { mes: "Jan", faturado: 190, recebido: 178 },
  { mes: "Fev", faturado: 205, recebido: 175 },
];

export default function FaturamentoPage() {
  return (
    <Layout title="Faturamento">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Faturado no mês" value="R$ 205.4k" icon={Receipt} accent trend={{ value: "+7.8%", positive: true }} />
          <KpiCard label="Aguardando envio" value={3} icon={Send} hint="Fecha em 3 dias" />
          <KpiCard label="Em análise convênio" value="R$ 42.8k" icon={Clock} />
          <KpiCard label="Recebido no mês" value="R$ 175.1k" icon={CheckCircle2} hint="85% do faturado" />
        </div>

        <Card className="card-shadow">
          <CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Faturado × Recebido (R$ mil)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={HIST}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="faturado" fill="#2D6A2D" radius={[4,4,0,0]} name="Faturado" />
                <Bar dataKey="recebido" fill="#7CB87C" radius={[4,4,0,0]} name="Recebido" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2"><ExportBar label="Lotes" /><Button className="gap-2"><Send className="h-4 w-4" /> Novo lote</Button></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Lotes de faturamento</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5">
                <TableHead>Lote</TableHead><TableHead>Convênio</TableHead><TableHead>Período</TableHead>
                <TableHead className="text-center">Sessões</TableHead><TableHead className="text-right">Valor</TableHead>
                <TableHead>Envio</TableHead><TableHead className="text-center">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {LOTES.map(l => (
                  <TableRow key={l.lote} className="hover:bg-muted/40">
                    <TableCell className="font-mono text-xs">{l.lote}</TableCell>
                    <TableCell>{l.convenio}</TableCell>
                    <TableCell>{l.periodo}</TableCell>
                    <TableCell className="text-center">{l.sessoes}</TableCell>
                    <TableCell className="text-right">R$ {l.valor.toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{l.envio}</TableCell>
                    <TableCell className="text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS[l.status]}`}>{STATUS_LABEL[l.status]}</span></TableCell>
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
