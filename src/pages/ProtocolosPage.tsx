import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle2, Clock, Plus } from "lucide-react";

const PROT = [
  { nome: "ABC", desc: "Autism Behavior Checklist – triagem TEA", esp: "Psi/Fono", aplicacoes: 42, ultimaAplicacao: "Fev/2026", ativo: true },
  { nome: "M-CHAT-R/F", desc: "Rastreio autismo 16–30 meses", esp: "Fono/Neuro", aplicacoes: 88, ultimaAplicacao: "Mar/2026", ativo: true },
  { nome: "PEP-3", desc: "Perfil Psicoeducacional", esp: "Psicologia", aplicacoes: 24, ultimaAplicacao: "Fev/2026", ativo: true },
  { nome: "PECS – Fase 1 a 6", desc: "Sistema de Comunicação por Troca de Figuras", esp: "Fono/TO", aplicacoes: 36, ultimaAplicacao: "Mar/2026", ativo: true },
  { nome: "Perfil Sensorial 2", desc: "Perfil sensorial Dunn", esp: "TO", aplicacoes: 58, ultimaAplicacao: "Mar/2026", ativo: true },
  { nome: "Vineland-3", desc: "Comportamento adaptativo", esp: "Psi", aplicacoes: 18, ultimaAplicacao: "Jan/2026", ativo: true },
  { nome: "ADI-R", desc: "Entrevista para diagnóstico de autismo", esp: "Psi", aplicacoes: 12, ultimaAplicacao: "Fev/2026", ativo: false },
];

export default function ProtocolosPage() {
  return (
    <Layout title="Protocolos & Avaliações">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Protocolos ativos" value={6} icon={ClipboardList} accent />
          <KpiCard label="Aplicações no mês" value={82} icon={CheckCircle2} trend={{ value: "+14%", positive: true }} />
          <KpiCard label="Pendentes de leitura" value={7} icon={Clock} hint="Aguardando profissional" />
          <KpiCard label="Tempo médio análise" value="2.4 dias" icon={Clock} />
        </div>

        <div className="flex justify-end gap-2"><ExportBar label="Protocolos" /><Button className="gap-2"><Plus className="h-4 w-4" /> Novo protocolo</Button></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Biblioteca de protocolos</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5">
                <TableHead>Instrumento</TableHead><TableHead>Descrição</TableHead><TableHead>Especialidade</TableHead>
                <TableHead className="text-center">Aplicações</TableHead><TableHead>Última</TableHead><TableHead className="text-center">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {PROT.map(p => (
                  <TableRow key={p.nome} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">{p.nome}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.desc}</TableCell>
                    <TableCell className="text-sm">{p.esp}</TableCell>
                    <TableCell className="text-center">{p.aplicacoes}</TableCell>
                    <TableCell className="text-sm">{p.ultimaAplicacao}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.ativo?"bg-emerald-100 text-emerald-800":"bg-gray-100 text-gray-600"}`}>
                        {p.ativo ? "Ativo" : "Arquivado"}
                      </span>
                    </TableCell>
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
