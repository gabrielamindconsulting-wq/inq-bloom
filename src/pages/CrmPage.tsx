import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as LineIcon, Users, Target, TrendingUp } from "lucide-react";
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from "recharts";

const FUNIL = [
  { name: "Leads", value: 320, fill: "#7CB87C" },
  { name: "Contato feito", value: 240, fill: "#5aa15a" },
  { name: "Triagem agendada", value: 168, fill: "#3d8a3d" },
  { name: "Triagem realizada", value: 128, fill: "#2D6A2D" },
  { name: "Cadastro clínico", value: 88, fill: "#1c541c" },
];

const ORIGEM = [
  { canal: "Indicação médica", leads: 96, conversao: "58%" },
  { canal: "Instagram", leads: 84, conversao: "22%" },
  { canal: "Google Ads", leads: 62, conversao: "31%" },
  { canal: "Site orgânico", leads: 48, conversao: "35%" },
  { canal: "Escola parceira", leads: 30, conversao: "48%" },
];

export default function CrmPage() {
  return (
    <Layout title="CRM Comercial">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Leads no mês" value={320} icon={Users} accent trend={{ value: "+12%", positive: true }} />
          <KpiCard label="Taxa conversão" value="27.5%" icon={Target} trend={{ value: "+3.1pp", positive: true }} />
          <KpiCard label="CAC (custo aquisição)" value="R$ 148" icon={LineIcon} hint="Mídia paga" />
          <KpiCard label="LTV médio" value="R$ 4.2k" icon={TrendingUp} hint="12 meses" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-base">Funil de conversão</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel dataKey="value" data={FUNIL} isAnimationActive>
                    <LabelList position="right" fill="#111" stroke="none" dataKey="name" />
                    <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={14} fontWeight={700} />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-base">Leads por canal</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="bg-primary/5 border-b">
                  <th className="text-left px-4 py-2">Canal</th>
                  <th className="text-center px-4 py-2">Leads</th>
                  <th className="text-right px-4 py-2">Conversão</th>
                </tr></thead>
                <tbody>
                  {ORIGEM.map((o,i)=>(
                    <tr key={i} className="border-b hover:bg-muted/40">
                      <td className="px-4 py-2 font-medium">{o.canal}</td>
                      <td className="px-4 py-2 text-center">{o.leads}</td>
                      <td className="px-4 py-2 text-right font-semibold text-primary">{o.conversao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end"><ExportBar label="CRM" /></div>
      </div>
    </Layout>
  );
}
