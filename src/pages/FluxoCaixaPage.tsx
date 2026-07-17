import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Banknote, ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const SERIES = Array.from({ length: 30 }, (_, i) => ({
  dia: i + 1,
  entrada: 4500 + Math.round(Math.sin(i/3) * 1500 + Math.random() * 1200),
  saida:   3200 + Math.round(Math.cos(i/4) * 1000 + Math.random() * 900),
  saldo:   45000 + i * 780 + Math.round(Math.sin(i/2) * 3000),
}));

const LANC = [
  { data: "12/03/2026", desc: "Recebimento Unimed – L-2026-02-UNI", cat: "Convênio", valor: 57710, tipo: "in" },
  { data: "10/03/2026", desc: "Repasse profissionais Fev/26", cat: "Repasse", valor: 37215, tipo: "out" },
  { data: "10/03/2026", desc: "Folha administrativa", cat: "Pessoal", valor: 18200, tipo: "out" },
  { data: "05/03/2026", desc: "Aluguel Asa Sul", cat: "Ocupação", valor: 12500, tipo: "out" },
  { data: "03/03/2026", desc: "Recebimento Particular – Fev", cat: "Particular", valor: 8900, tipo: "in" },
];

export default function FluxoCaixaPage() {
  return (
    <Layout title="Fluxo de Caixa">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Saldo atual" value="R$ 68.4k" icon={Banknote} accent />
          <KpiCard label="Entradas (30d)" value="R$ 182.1k" icon={ArrowUpRight} trend={{ value: "+6.2%", positive: true }} />
          <KpiCard label="Saídas (30d)" value="R$ 149.7k" icon={ArrowDownRight} trend={{ value: "+3.1%", positive: false }} />
          <KpiCard label="Reserva operacional" value="2.4 meses" icon={PiggyBank} hint="Meta: 3 meses" />
        </div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Evolução diária (últimos 30 dias)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line dataKey="entrada" stroke="#2D6A2D" strokeWidth={2} dot={false} name="Entrada" />
                <Line dataKey="saida" stroke="#dc2626" strokeWidth={2} dot={false} name="Saída" />
                <Line dataKey="saldo" stroke="#3b82f6" strokeWidth={2} dot={false} name="Saldo acumulado" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex justify-end"><ExportBar label="Fluxo de caixa" /></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Últimos lançamentos</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5"><TableHead>Data</TableHead><TableHead>Descrição</TableHead><TableHead>Categoria</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader>
              <TableBody>
                {LANC.map((l,i)=>(
                  <TableRow key={i} className="hover:bg-muted/40">
                    <TableCell>{l.data}</TableCell>
                    <TableCell className="font-medium">{l.desc}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{l.cat}</TableCell>
                    <TableCell className={`text-right font-semibold ${l.tipo==="in"?"text-emerald-600":"text-red-600"}`}>{l.tipo==="in"?"+":"-"}R$ {l.valor.toLocaleString("pt-BR")}</TableCell>
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
