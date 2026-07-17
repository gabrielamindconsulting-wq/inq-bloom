import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Wallet, Users, Calendar, ArrowRight } from "lucide-react";

const REPASSES = [
  { prof: "Dra. Ana Lima", especialidade: "Fono", sessoes: 68, bruto: 9860, deducoes: 986, liquido: 8874, competencia: "Fev/2026", status: "aprovado" },
  { prof: "Dr. Pedro Ramos", especialidade: "TO", sessoes: 54, bruto: 8100, deducoes: 810, liquido: 7290, competencia: "Fev/2026", status: "aprovado" },
  { prof: "Dra. Carla Dias", especialidade: "Psicologia", sessoes: 48, bruto: 8640, deducoes: 864, liquido: 7776, competencia: "Fev/2026", status: "pendente" },
  { prof: "Dr. Marcos Vieira", especialidade: "Fisio", sessoes: 62, bruto: 8990, deducoes: 899, liquido: 8091, competencia: "Fev/2026", status: "aprovado" },
  { prof: "Dra. Beatriz Rosa", especialidade: "Psicopedagogia", sessoes: 36, bruto: 5760, deducoes: 576, liquido: 5184, competencia: "Fev/2026", status: "pendente" },
];
const S: Record<string,string> = { aprovado:"bg-emerald-100 text-emerald-800", pendente:"bg-amber-100 text-amber-800", pago:"bg-blue-100 text-blue-800" };

export default function RepassesPage() {
  const totalBruto = REPASSES.reduce((s,r)=>s+r.bruto,0);
  const totalLiq = REPASSES.reduce((s,r)=>s+r.liquido,0);
  return (
    <Layout title="Repasses">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="A repassar (Fev)" value={`R$ ${(totalLiq/1000).toFixed(1)}k`} icon={Wallet} accent />
          <KpiCard label="Profissionais" value={REPASSES.length} icon={Users} />
          <KpiCard label="Bruto total" value={`R$ ${(totalBruto/1000).toFixed(1)}k`} icon={ArrowRight} hint="Antes deduções" />
          <KpiCard label="Competência" value="Fev/2026" icon={Calendar} hint="Fechamento 10/03" />
        </div>

        <div className="flex justify-end gap-2"><ExportBar label="Repasses" /><Button>Fechar competência</Button></div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Repasses por profissional</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow className="bg-primary/5">
                <TableHead>Profissional</TableHead><TableHead>Especialidade</TableHead>
                <TableHead className="text-center">Sessões</TableHead><TableHead className="text-right">Bruto</TableHead>
                <TableHead className="text-right">Deduções</TableHead><TableHead className="text-right">Líquido</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {REPASSES.map((r,i)=>(
                  <TableRow key={i} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{r.prof}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.especialidade}</TableCell>
                    <TableCell className="text-center">{r.sessoes}</TableCell>
                    <TableCell className="text-right">R$ {r.bruto.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right text-red-600">-R$ {r.deducoes.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">R$ {r.liquido.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${S[r.status]}`}>{r.status}</span></TableCell>
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
