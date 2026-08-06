import { useState } from "react";
import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MOCK_GLOSAS, MOCK_CONTESTACOES, STATUS_GLOSA_CLASS, STATUS_GLOSA_LABEL,
} from "@/data/financeData";
import { AlertOctagon, TrendingDown, RotateCcw, CheckCircle2, Clock } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR")}`;

// Verde > 30 dias, amarelo <= 30 dias, vermelho <= 15 dias ou vencido
function prazoClass(dias: number) {
  if (dias <= 15) return "bg-red-100 text-red-800";
  if (dias <= 30) return "bg-amber-100 text-amber-800";
  return "bg-emerald-100 text-emerald-800";
}
const prazoTexto = (dias: number) => (dias < 0 ? `Vencido há ${Math.abs(dias)} dias` : `${dias} dias`);

export default function GlosasPage() {
  const [tab, setTab] = useState("glosas");

  const totalGlosado = MOCK_GLOSAS.reduce((s, g) => s + g.valorGlosado, 0);
  const totalFaturado = MOCK_GLOSAS.reduce((s, g) => s + g.valorFaturado, 0);
  const emRecurso = MOCK_GLOSAS.filter(g => g.status === "recurso_enviado" || g.status === "correcao");
  const recuperado = MOCK_GLOSAS.reduce((s, g) => s + g.valorAceito, 0);

  const motivos = Object.values(
    MOCK_GLOSAS.reduce<Record<string, { name: string; value: number }>>((acc, g) => {
      acc[g.motivoCodigo] = acc[g.motivoCodigo] ?? { name: `${g.motivoCodigo} · ${g.motivoDescricao}`, value: 0 };
      acc[g.motivoCodigo].value += g.valorGlosado;
      return acc;
    }, {}),
  );
  const cores = ["#dc2626", "#f59e0b", "#2D6A2D", "#3b82f6", "#8b5cf6", "#0891b2"];

  return (
    <Layout title="Glosas & Contestações">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Taxa de glosa" value={`${((totalGlosado / totalFaturado) * 100).toFixed(1)}%`} icon={TrendingDown} accent hint="Valor glosado / faturado" />
          <KpiCard label="Valor glosado" value={brl(totalGlosado)} icon={AlertOctagon} />
          <KpiCard label="Em recurso" value={emRecurso.length} icon={RotateCcw} hint={`${brl(emRecurso.reduce((s, g) => s + g.valorSolicitado, 0))} pleiteados`} />
          <KpiCard label="Recuperado" value={brl(recuperado)} icon={CheckCircle2} trend={{ value: `${Math.round((recuperado / totalGlosado) * 100)}% de sucesso`, positive: true }} />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="glosas">Glosas ({MOCK_GLOSAS.length})</TabsTrigger>
            <TabsTrigger value="contestacoes">Contestações ({MOCK_CONTESTACOES.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="glosas" className="space-y-5 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card className="card-shadow lg:col-span-1">
                <CardHeader><CardTitle className="text-base">Motivos de glosa (R$)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={motivos} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={2}>
                        {motivos.map((m, i) => <Cell key={m.name} fill={cores[i % cores.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => brl(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2 text-xs">
                    {motivos.map((m, i) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: cores[i % cores.length] }} />
                        <span className="flex-1 text-muted-foreground truncate">{m.name}</span>
                        <span className="font-medium">{brl(m.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow lg:col-span-2">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">Prazos de recurso</CardTitle>
                  <ExportBar label="Glosas" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {MOCK_GLOSAS.filter(g => g.status !== "recuperada" && g.status !== "perdida").map(g => (
                    <div key={g.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{g.convenio} · {g.protocoloOriginal}</p>
                        <p className="text-xs text-muted-foreground truncate">{g.motivoCodigo} · {g.motivoDescricao}</p>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap">{brl(g.valorGlosado)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${prazoClass(g.diasParaPrazo)}`}>
                        {prazoTexto(g.diasParaPrazo)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="card-shadow">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Controle de glosas</CardTitle>
                <Button variant="outline" size="sm">Registrar recurso</Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Convênio</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Mês faturamento</TableHead>
                      <TableHead>Protocolo original</TableHead>
                      <TableHead className="text-right">Faturado</TableHead>
                      <TableHead className="text-right">Glosado</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Identificação</TableHead>
                      <TableHead className="text-center">Prazo recurso</TableHead>
                      <TableHead>Envio recurso</TableHead>
                      <TableHead>Protocolo recurso</TableHead>
                      <TableHead className="text-right">Solicitado</TableHead>
                      <TableHead className="text-right">Aceito</TableHead>
                      <TableHead className="text-right">Negado</TableHead>
                      <TableHead>Pgto. recurso</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_GLOSAS.map(g => (
                      <TableRow key={g.id} className="hover:bg-muted/40">
                        <TableCell className="font-medium whitespace-nowrap">{g.convenio}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{g.unidade}</TableCell>
                        <TableCell className="whitespace-nowrap">{g.competencia}</TableCell>
                        <TableCell className="whitespace-nowrap">{g.mesFaturamento}</TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{g.protocoloOriginal}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{brl(g.valorFaturado)}</TableCell>
                        <TableCell className="text-right text-red-600 whitespace-nowrap">{brl(g.valorGlosado)}</TableCell>
                        <TableCell className="text-sm max-w-56">
                          <span className="font-mono text-xs text-muted-foreground">{g.motivoCodigo}</span> {g.motivoDescricao}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{g.dataIdentificacao}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prazoClass(g.diasParaPrazo)}`}>{g.prazoRecurso}</span>
                          <span className="block text-[11px] text-muted-foreground mt-0.5">{prazoTexto(g.diasParaPrazo)}</span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{g.dataEnvioRecurso ?? "—"}</TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{g.protocoloRecurso ?? "—"}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{g.valorSolicitado ? brl(g.valorSolicitado) : "—"}</TableCell>
                        <TableCell className="text-right text-emerald-700 whitespace-nowrap">{g.valorAceito ? brl(g.valorAceito) : "—"}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{g.valorNegado ? brl(g.valorNegado) : "—"}</TableCell>
                        <TableCell className="whitespace-nowrap">{g.dataPagamentoRecurso ?? "—"}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_GLOSA_CLASS[g.status]}`}>
                            {STATUS_GLOSA_LABEL[g.status]}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contestacoes" className="space-y-5 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard label="Em disputa" value={brl(MOCK_CONTESTACOES.filter(c => c.recuperou == null).reduce((s, c) => s + c.valorEmDisputa, 0))} icon={AlertOctagon} accent />
              <KpiCard label="Recuperado em contestação" value={brl(MOCK_CONTESTACOES.reduce((s, c) => s + c.valorRecuperado, 0))} icon={CheckCircle2} />
              <KpiCard label="Perda definitiva" value={brl(MOCK_CONTESTACOES.filter(c => c.recuperou === "nao").reduce((s, c) => s + c.valorEmDisputa, 0))} icon={TrendingDown} hint="Relatório de perda definitiva" />
            </div>

            <Card className="card-shadow">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Contestações após recurso negado</CardTitle>
                <div className="flex gap-2"><ExportBar label="Contestações" /><Button variant="outline" size="sm">Nova contestação</Button></div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Contestação</TableHead>
                      <TableHead>Glosa de origem</TableHead>
                      <TableHead>Convênio</TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Data da negativa</TableHead>
                      <TableHead className="text-right">Valor em disputa</TableHead>
                      <TableHead className="text-center">Prazo de contestação</TableHead>
                      <TableHead>Envio</TableHead>
                      <TableHead>Observação</TableHead>
                      <TableHead className="text-center">Recuperou?</TableHead>
                      <TableHead className="text-right">Recuperado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_CONTESTACOES.map(c => (
                      <TableRow key={c.id} className="hover:bg-muted/40">
                        <TableCell className="font-mono text-xs whitespace-nowrap">{c.id}</TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{c.glosaId}</TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{c.convenio}</TableCell>
                        <TableCell className="whitespace-nowrap">{c.competencia}</TableCell>
                        <TableCell className="whitespace-nowrap">{c.dataNegativa}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">{brl(c.valorEmDisputa)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prazoClass(c.diasParaPrazo)}`}>{c.prazoContestacao}</span>
                          <span className="block text-[11px] text-muted-foreground mt-0.5">{prazoTexto(c.diasParaPrazo)}</span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{c.dataEnvioContestacao ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-sm">{c.observacao}</TableCell>
                        <TableCell className="text-center text-sm">
                          {c.recuperou === "sim" ? "Sim" : c.recuperou === "nao" ? "Não" : c.recuperou === "negociacao" ? "Negociação" : "Em análise"}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">{c.valorRecuperado ? brl(c.valorRecuperado) : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
