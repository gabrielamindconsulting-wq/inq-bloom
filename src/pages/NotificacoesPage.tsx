import { useState } from "react";
import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import {
  MOCK_NOTIFICACOES, SEVERIDADE_CLASS, SEVERIDADE_LABEL, STATUS_NOTIF_LABEL,
  CONTADORES, TOTAL_PENDENCIAS,
} from "@/data/notificationsData";
import { Bell, BellRing, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export default function NotificacoesPage() {
  const [modulo, setModulo] = useState("todos");
  const [status, setStatus] = useState("todos");

  const lista = MOCK_NOTIFICACOES.filter(
    n => (modulo === "todos" || n.modulo === modulo) && (status === "todos" || n.status === status),
  );

  return (
    <Layout title="Notificações">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Pendências abertas" value={TOTAL_PENDENCIAS} icon={BellRing} accent />
          <KpiCard label="Não lidas" value={MOCK_NOTIFICACOES.filter(n => n.status === "nao_lido").length} icon={Bell} />
          <KpiCard label="Críticas (prazo ≤ 15 dias)" value={MOCK_NOTIFICACOES.filter(n => n.severidade === "vermelho").length} icon={Clock} hint="Ação imediata" />
          <KpiCard label="Resolvidas no mês" value={MOCK_NOTIFICACOES.filter(n => n.status === "resolvido").length} icon={CheckCircle2} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(CONTADORES).map(([mod, qtd]) => (
            <button
              key={mod}
              onClick={() => setModulo(mod)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                modulo === mod ? "border-primary bg-primary-light" : "border-border bg-background hover:bg-muted/50"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{mod}</p>
              <p className="text-2xl font-bold text-primary mt-1">{qtd}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={modulo} onValueChange={setModulo}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Módulo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os módulos</SelectItem>
              {Object.keys(CONTADORES).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="nao_lido">Não lido</SelectItem>
              <SelectItem value="lido">Lido</SelectItem>
              <SelectItem value="resolvido">Resolvido</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto"><ExportBar label="Notificações" /></div>
        </div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Histórico de notificações</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead>Módulo</TableHead>
                  <TableHead>Gatilho</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead className="text-center">Severidade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.map(n => (
                  <TableRow key={n.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{n.modulo}</TableCell>
                    <TableCell className="text-sm">{n.gatilho}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md">{n.descricao}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {n.prazo}
                      <span className="block text-xs text-muted-foreground">
                        {n.diasRestantes < 0 ? `vencido há ${Math.abs(n.diasRestantes)} dias` : `${n.diasRestantes} dias`}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEVERIDADE_CLASS[n.severidade]}`}>
                        {SEVERIDADE_LABEL[n.severidade]}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">{STATUS_NOTIF_LABEL[n.status]}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm" className="gap-1">
                        <Link to={`${n.rota}?pendencias=1`}>Abrir <ArrowRight className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {lista.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">Nenhuma notificação para o filtro selecionado.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
