import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, AlertTriangle, Activity } from "lucide-react";
import { MOCK_ROOMS } from "@/data/clinicalMockData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const OCUPACAO = MOCK_ROOMS.slice(0, 8).map((r, i) => ({
  sala: r.nome,
  unidade: r.unidade,
  ocupacao: [82, 91, 45, 78, 63, 88, 72, 55][i] ?? 70,
  ociosidade: [18, 9, 55, 22, 37, 12, 28, 45][i] ?? 30,
}));

export default function OcupacaoPage() {
  return (
    <Layout title="Ocupação de Salas">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Ocupação média" value="72%" icon={Building2} accent trend={{ value: "+4pp vs mês anterior", positive: true }} />
          <KpiCard label="Melhor sala" value="TO 1 · 91%" icon={TrendingUp} />
          <KpiCard label="Ociosa crítica" value="Psi 45%" icon={AlertTriangle} hint="Rever grade" />
          <KpiCard label="Slots totais / semana" value={640} icon={Activity} />
        </div>

        <Card className="card-shadow">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Ocupação por sala (%)</CardTitle>
            <ExportBar label="Ocupação" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={OCUPACAO} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                <YAxis type="category" dataKey="sala" tick={{ fontSize: 12 }} width={120} />
                <Tooltip />
                <Bar dataKey="ocupacao" stackId="a" fill="#2D6A2D" name="Ocupada" radius={[0,0,0,0]} />
                <Bar dataKey="ociosidade" stackId="a" fill="#e5e7eb" name="Ociosa" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Heatmap — ocupação por dia e horário (mock)</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="text-xs">
                <thead><tr>
                  <th className="p-1 w-16"></th>
                  {["Seg","Ter","Qua","Qui","Sex"].map(d=><th key={d} className="p-1 w-16 text-muted-foreground">{d}</th>)}
                </tr></thead>
                <tbody>
                  {Array.from({length:12},(_,h)=>(
                    <tr key={h}>
                      <td className="p-1 text-muted-foreground text-right pr-2">{String(7+h).padStart(2,"0")}:00</td>
                      {Array.from({length:5},(_,d)=>{
                        const v = Math.round(40 + Math.sin(h/2 + d) * 25 + Math.random()*25);
                        const alpha = v/100;
                        return <td key={d} className="p-1"><div className="h-6 rounded" title={`${v}%`} style={{ background:`rgba(45,106,45,${alpha})` }} /></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <span>Menos ocupada</span>
                <div className="flex gap-0.5">{[0.15,0.3,0.5,0.7,0.9].map(a=><div key={a} className="h-3 w-6 rounded" style={{ background:`rgba(45,106,45,${a})` }} />)}</div>
                <span>Mais ocupada</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
