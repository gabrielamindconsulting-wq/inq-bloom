import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, DollarSign, Percent, AlertCircle, Plus, Search } from "lucide-react";

const CONVENIOS = [
  { nome: "Unimed", pacientes: 42, valorSessao: 145, prazoRepasse: 45, taxaGlosa: "3.2%", contrato: "Ativo até 12/2026" },
  { nome: "Bradesco Saúde", pacientes: 28, valorSessao: 160, prazoRepasse: 60, taxaGlosa: "5.8%", contrato: "Ativo até 06/2027" },
  { nome: "Amil", pacientes: 19, valorSessao: 130, prazoRepasse: 30, taxaGlosa: "2.1%", contrato: "Ativo até 03/2026" },
  { nome: "SulAmérica", pacientes: 24, valorSessao: 155, prazoRepasse: 45, taxaGlosa: "4.5%", contrato: "Renovação pendente" },
  { nome: "Particular", pacientes: 15, valorSessao: 220, prazoRepasse: 0, taxaGlosa: "—", contrato: "—" },
];

export default function ConveniosPage() {
  return (
    <Layout title="Convênios & Valores">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Convênios ativos" value={5} icon={ShieldCheck} accent />
          <KpiCard label="Ticket médio/sessão" value="R$ 162" icon={DollarSign} hint="Média ponderada" />
          <KpiCard label="Taxa média de glosa" value="3.9%" icon={Percent} trend={{ value: "-0.6pp vs mês anterior", positive: true }} />
          <KpiCard label="Contratos p/ renovar" value={1} icon={AlertCircle} hint="SulAmérica 06/2026" />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar convênio..." className="pl-9 w-64" />
          </div>
          <div className="ml-auto flex gap-2">
            <ExportBar label="Tabela de convênios" />
            <Button className="gap-2"><Plus className="h-4 w-4" /> Novo convênio</Button>
          </div>
        </div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Tabela de convênios</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead>Convênio</TableHead>
                  <TableHead className="text-center">Pacientes</TableHead>
                  <TableHead className="text-right">Valor/sessão</TableHead>
                  <TableHead className="text-center">Prazo repasse</TableHead>
                  <TableHead className="text-center">Taxa glosa</TableHead>
                  <TableHead>Contrato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CONVENIOS.map(c => (
                  <TableRow key={c.nome} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell className="text-center">{c.pacientes}</TableCell>
                    <TableCell className="text-right">R$ {c.valorSessao},00</TableCell>
                    <TableCell className="text-center">{c.prazoRepasse ? `${c.prazoRepasse} dias` : "—"}</TableCell>
                    <TableCell className="text-center">{c.taxaGlosa}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.contrato}</TableCell>
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
