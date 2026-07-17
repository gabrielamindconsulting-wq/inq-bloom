import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieIcon, TrendingUp, TrendingDown, Target } from "lucide-react";

const LINHAS = [
  { grupo: "Receita bruta", valor: 214300, tipo: "receita", nivel: 0 },
  { grupo: "  Convênios", valor: 195100, tipo: "sub", nivel: 1 },
  { grupo: "  Particular", valor: 19200, tipo: "sub", nivel: 1 },
  { grupo: "(-) Deduções (impostos + glosas)", valor: -22400, tipo: "deducao", nivel: 0 },
  { grupo: "Receita líquida", valor: 191900, tipo: "subtotal", nivel: 0 },
  { grupo: "(-) Custos diretos (repasses)", valor: -102300, tipo: "deducao", nivel: 0 },
  { grupo: "Margem de contribuição", valor: 89600, tipo: "subtotal", nivel: 0, hint: "46.7%" },
  { grupo: "(-) Despesas fixas", valor: -52800, tipo: "deducao", nivel: 0 },
  { grupo: "  Ocupação (aluguel/condomínio)", valor: -18400, tipo: "sub", nivel: 1 },
  { grupo: "  Pessoal administrativo", valor: -24600, tipo: "sub", nivel: 1 },
  { grupo: "  Tecnologia e outros", valor: -9800, tipo: "sub", nivel: 1 },
  { grupo: "EBITDA gerencial", valor: 36800, tipo: "final", nivel: 0, hint: "19.2%" },
];

export default function DrePage() {
  return (
    <Layout title="DRE Gerencial">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Receita líquida" value="R$ 191.9k" icon={PieIcon} accent />
          <KpiCard label="Margem contribuição" value="46.7%" icon={TrendingUp} trend={{ value: "+2.1pp", positive: true }} />
          <KpiCard label="Despesas fixas" value="R$ 52.8k" icon={TrendingDown} hint="27.5% da receita" />
          <KpiCard label="EBITDA" value="R$ 36.8k" icon={Target} trend={{ value: "19.2% margem", positive: true }} />
        </div>

        <div className="flex justify-end"><ExportBar label="DRE Fev/2026" /></div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="text-base">DRE — competência Fevereiro/2026</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/5 border-b">
                  <th className="text-left px-4 py-2 font-semibold">Grupo</th>
                  <th className="text-right px-4 py-2 font-semibold">Valor</th>
                  <th className="text-right px-4 py-2 font-semibold w-20">% receita</th>
                </tr>
              </thead>
              <tbody>
                {LINHAS.map((l, i) => {
                  const bold = l.tipo === "subtotal" || l.tipo === "final" || l.tipo === "receita";
                  const highlight = l.tipo === "final" ? "bg-primary-light" : l.tipo === "subtotal" ? "bg-muted/30" : "";
                  return (
                    <tr key={i} className={`border-b border-border ${highlight}`}>
                      <td className={`px-4 py-2 ${bold ? "font-semibold" : ""} ${l.nivel === 1 ? "pl-8 text-muted-foreground" : ""}`}>{l.grupo}</td>
                      <td className={`px-4 py-2 text-right tabular-nums ${bold ? "font-semibold" : ""} ${l.valor < 0 ? "text-red-600" : l.tipo==="final"?"text-primary":""}`}>
                        R$ {Math.abs(l.valor).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-2 text-right text-muted-foreground text-xs">
                        {l.hint ?? (l.tipo !== "sub" ? `${((Math.abs(l.valor)/214300)*100).toFixed(1)}%` : "")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
