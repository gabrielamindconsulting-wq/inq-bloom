import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileSignature, Sparkles, Clock, Download } from "lucide-react";

const REL = [
  { paciente: "Lucas Mendes", tipo: "Relatório trimestral", periodo: "Jan–Mar/2026", gerado: "12/03/2026", assinado: true },
  { paciente: "Ana Beatriz",  tipo: "Relatório de alta parcial", periodo: "Fev/2026", gerado: "10/03/2026", assinado: true },
  { paciente: "Felipe Cardoso", tipo: "Relatório para convênio", periodo: "Fev/2026", gerado: "08/03/2026", assinado: false },
  { paciente: "Marina Souza", tipo: "Relatório escolar", periodo: "Jan–Mar/2026", gerado: "07/03/2026", assinado: true },
  { paciente: "Pedro Henrique", tipo: "Relatório de reavaliação", periodo: "Trimestre 1", gerado: "05/03/2026", assinado: false },
];

export default function RelatoriosPage() {
  return (
    <Layout title="Relatórios Automáticos">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Relatórios gerados (mês)" value={38} icon={FileSignature} accent />
          <KpiCard label="Com IA (rascunho)" value={26} icon={Sparkles} trend={{ value: "68% de uso", positive: true }} />
          <KpiCard label="Aguardando assinatura" value={5} icon={Clock} />
          <KpiCard label="Tempo médio geração" value="4 min" icon={Sparkles} hint="Antes: 45 min" />
        </div>

        <Card className="card-shadow bg-primary-light border-primary/20">
          <CardContent className="p-5 flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">Gerar relatório com IA</p>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione paciente e período. A IA lê evoluções, protocolos aplicados e metas do PTS,
                e gera um rascunho estruturado (Anamnese, Objetivos, Evolução, Conclusão) para revisão.
              </p>
            </div>
            <Button className="gap-2"><Sparkles className="h-4 w-4" /> Gerar rascunho</Button>
          </CardContent>
        </Card>

        <div className="flex justify-end"><ExportBar label="Relatórios" /></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Últimos relatórios</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5">
                <TableHead>Paciente</TableHead><TableHead>Tipo</TableHead><TableHead>Período</TableHead>
                <TableHead>Gerado em</TableHead><TableHead className="text-center">Assinado</TableHead><TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {REL.map((r,i)=>(
                  <TableRow key={i} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{r.paciente}</TableCell>
                    <TableCell>{r.tipo}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.periodo}</TableCell>
                    <TableCell className="text-sm">{r.gerado}</TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.assinado?"bg-emerald-100 text-emerald-800":"bg-amber-100 text-amber-800"}`}>
                        {r.assinado ? "Sim" : "Pendente"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> PDF</Button></TableCell>
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
