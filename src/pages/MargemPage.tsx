import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Percent, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const MARGEM_ESP = [
  { esp: "Fono", receita: 59740, custo: 32200, margem: 46 },
  { esp: "TO",   receita: 42880, custo: 24100, margem: 44 },
  { esp: "Fisio", receita: 38820, custo: 22800, margem: 41 },
  { esp: "Psicologia", receita: 34500, custo: 20500, margem: 41 },
  { esp: "Psicoped.", receita: 21600, custo: 14200, margem: 34 },
  { esp: "Neuro", receita: 18200, custo: 11400, margem: 37 },
];
const CONV = [
  { conv: "Unimed", ticket: 145, custo: 82, margem: 43 },
  { conv: "Bradesco", ticket: 160, custo: 88, margem: 45 },
  { conv: "Amil", ticket: 130, custo: 79, margem: 39 },
  { conv: "SulAmérica", ticket: 155, custo: 84, margem: 46 },
  { conv: "Particular", ticket: 220, custo: 92, margem: 58 },
];

export default function MargemPage() {
  return (
    <Layout title="Margem de Contribuição">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Margem média" value="42%" icon={Percent} accent trend={{ value: "+1.8pp vs Jan", positive: true }} />
          <KpiCard label="Especialidade top" value="Fono 46%" icon={TrendingUp} />
          <KpiCard label="Convênio top" value="Particular 58%" icon={Users} />
          <KpiCard label="Abaixo do alvo" value={1} icon={AlertTriangle} hint="Psicoped. 34%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-base">Margem por especialidade</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MARGEM_ESP}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="esp" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="margem" fill="#2D6A2D" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-base">Receita × Custo por especialidade</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={MARGEM_ESP}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="esp" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="receita" fill="#2D6A2D" name="Receita" radius={[4,4,0,0]} />
                  <Bar dataKey="custo" fill="#c2956b" name="Custo" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end"><ExportBar label="Margem" /></div>
        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Margem por convênio</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5"><TableHead>Convênio</TableHead><TableHead className="text-right">Ticket</TableHead><TableHead className="text-right">Custo/sessão</TableHead><TableHead className="text-right">Margem</TableHead></TableRow></TableHeader>
              <TableBody>
                {CONV.map(c => (
                  <TableRow key={c.conv} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{c.conv}</TableCell>
                    <TableCell className="text-right">R$ {c.ticket}</TableCell>
                    <TableCell className="text-right">R$ {c.custo}</TableCell>
                    <TableCell className={`text-right font-semibold ${c.margem>=45?"text-emerald-600":c.margem>=40?"text-primary":"text-amber-600"}`}>{c.margem}%</TableCell>
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
