import { Fragment, useState } from "react";
import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MOCK_LOTES, STATUS_PAGAMENTO_CLASS, STATUS_PAGAMENTO_LABEL, liquidoLote,
} from "@/data/financeData";
import { Receipt, Send, Clock, CheckCircle2, ChevronRight, ChevronDown } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const HIST = [
  { mes: "Set", faturado: 158, recebido: 149 },
  { mes: "Out", faturado: 172, recebido: 160 },
  { mes: "Nov", faturado: 180, recebido: 168 },
  { mes: "Dez", faturado: 165, recebido: 155 },
  { mes: "Jan", faturado: 190, recebido: 178 },
  { mes: "Fev", faturado: 205, recebido: 175 },
];

export default function FaturamentoPage() {
  const [aberto, setAberto] = useState<string | null>(null);
  const [convenio, setConvenio] = useState("todos");
  const [unidade, setUnidade] = useState("todas");
  const [status, setStatus] = useState("todos");

  const lotes = MOCK_LOTES.filter(
    l =>
      (convenio === "todos" || l.convenio === convenio) &&
      (unidade === "todas" || l.unidade === unidade) &&
      (status === "todos" || l.status === status),
  );

  const bruto = lotes.reduce((s, l) => s + l.valorBruto, 0);
  const liquido = lotes.reduce((s, l) => s + liquidoLote(l), 0);
  const recebido = lotes.reduce((s, l) => s + (l.valorRecebido ?? 0), 0);
  const pendente = lotes.filter(l => l.status === "pendente" || l.status === "vencido").length;
  const convenios = Array.from(new Set(MOCK_LOTES.map(l => l.convenio)));

  return (
    <Layout title="Faturamento">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Faturado bruto" value={brl(bruto)} icon={Receipt} accent />
          <KpiCard label="Líquido previsto" value={brl(liquido)} icon={Send} hint="Bruto − glosa − taxa adm. − imposto" />
          <KpiCard label="Recebido" value={brl(recebido)} icon={CheckCircle2} hint={`${bruto ? Math.round((recebido / bruto) * 100) : 0}% do bruto`} />
          <KpiCard label="Lotes em aberto" value={pendente} icon={Clock} />
        </div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Faturado × Recebido (R$ mil)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={HIST}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="faturado" fill="#2D6A2D" radius={[4, 4, 0, 0]} name="Faturado" />
                <Bar dataKey="recebido" fill="#7CB87C" radius={[4, 4, 0, 0]} name="Recebido" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={convenio} onValueChange={setConvenio}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Convênio" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os convênios</SelectItem>
              {convenios.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={unidade} onValueChange={setUnidade}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Unidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as unidades</SelectItem>
              <SelectItem value="Asa Sul">Asa Sul</SelectItem>
              <SelectItem value="Águas Claras">Águas Claras</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {Object.entries(STATUS_PAGAMENTO_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <ExportBar label="Lotes" />
            <Button className="gap-2"><Send className="h-4 w-4" /> Novo lote</Button>
          </div>
        </div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Lotes de faturamento</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead className="w-8" />
                  <TableHead>Convênio</TableHead>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Envio</TableHead>
                  <TableHead className="text-center">Guias</TableHead>
                  <TableHead className="text-right">Bruto</TableHead>
                  <TableHead className="text-right">Glosa</TableHead>
                  <TableHead className="text-right">Taxa adm.</TableHead>
                  <TableHead className="text-right">Imposto</TableHead>
                  <TableHead className="text-right">Líquido</TableHead>
                  <TableHead>Previsto</TableHead>
                  <TableHead>PMR</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Recebido</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.map(l => (
                  <Fragment key={l.id}>
                    <TableRow
                      className="hover:bg-muted/40 cursor-pointer"
                      onClick={() => setAberto(aberto === l.id ? null : l.id)}
                    >
                      <TableCell>
                        {aberto === l.id ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{l.convenio}</TableCell>
                      <TableCell className="font-mono text-xs whitespace-nowrap">{l.protocolo}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{l.unidade}</TableCell>
                      <TableCell className="whitespace-nowrap">{l.competencia}</TableCell>
                      <TableCell className="whitespace-nowrap">{l.dataEnvio}</TableCell>
                      <TableCell className="text-center">{l.qtdGuias}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{brl(l.valorBruto)}</TableCell>
                      <TableCell className="text-right text-red-600 whitespace-nowrap">{l.glosa ? `-${brl(l.glosa)}` : "—"}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{l.taxaAdm ? `-${brl(l.taxaAdm)}` : "—"}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">-{brl(l.imposto)}</TableCell>
                      <TableCell className="text-right font-semibold text-primary whitespace-nowrap">{brl(liquidoLote(l))}</TableCell>
                      <TableCell className="whitespace-nowrap">{l.dataPrevista}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{l.dataPmr}</TableCell>
                      <TableCell className="whitespace-nowrap">{l.dataRealPagamento ?? "—"}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{l.valorRecebido != null ? brl(l.valorRecebido) : "—"}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_PAGAMENTO_CLASS[l.status]}`}>
                          {STATUS_PAGAMENTO_LABEL[l.status]}
                        </span>
                      </TableCell>
                    </TableRow>
                    {aberto === l.id && (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={17} className="p-4">
                          <p className="text-sm font-semibold mb-2">Guias do lote {l.protocolo}</p>
                          <div className="rounded-lg border border-border bg-background">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Paciente</TableHead>
                                  <TableHead>Senha / autorização</TableHead>
                                  <TableHead className="text-center">Sessões</TableHead>
                                  <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {l.guias.map(g => (
                                  <TableRow key={g.senha}>
                                    <TableCell className="font-medium">{g.paciente}</TableCell>
                                    <TableCell className="font-mono text-xs">{g.senha}</TableCell>
                                    <TableCell className="text-center">{g.sessoes}</TableCell>
                                    <TableCell className="text-right">{brl(g.valor)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {l.observacao && (
                            <p className="mt-3 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Observação: </span>{l.observacao}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
