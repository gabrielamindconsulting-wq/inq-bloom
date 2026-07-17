import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, FileText, AlertTriangle, ClipboardCheck } from "lucide-react";

const POLITICAS = [
  { nome: "Política de Privacidade & LGPD", versao: "3.2", atualizada: "05/02/2026", responsavel: "DPO", status: "vigente" },
  { nome: "Prontuário eletrônico — retenção", versao: "1.1", atualizada: "12/12/2025", responsavel: "Diretoria clínica", status: "vigente" },
  { nome: "Consentimento de imagem / dados", versao: "2.0", atualizada: "20/01/2026", responsavel: "Jurídico", status: "vigente" },
  { nome: "Plano de continuidade (backup)", versao: "1.4", atualizada: "10/03/2026", responsavel: "TI", status: "vigente" },
  { nome: "Código de ética profissional", versao: "1.0", atualizada: "01/07/2024", responsavel: "RH", status: "revisar" },
];
const AUDIT = [
  { data: "12/03/2026", tipo: "Acesso indevido a prontuário", severidade: "alta", status: "resolvido" },
  { data: "05/03/2026", tipo: "Falha backup diário", severidade: "media", status: "resolvido" },
  { data: "28/02/2026", tipo: "Exportação em massa dados", severidade: "alta", status: "investigando" },
];

export default function GovernancaPage() {
  return (
    <Layout title="Governança & Compliance">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Políticas vigentes" value={12} icon={FileText} accent />
          <KpiCard label="Conformidade LGPD" value="96%" icon={ShieldCheck} trend={{ value: "+2pp", positive: true }} />
          <KpiCard label="Incidentes abertos" value={1} icon={AlertTriangle} hint="Investigação em curso" />
          <KpiCard label="Auditorias no ano" value={4} icon={ClipboardCheck} />
        </div>

        <div className="flex justify-end"><ExportBar label="Governança" /></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-base">Políticas institucionais</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-primary/5"><TableHead>Documento</TableHead><TableHead>Versão</TableHead><TableHead>Atualizada</TableHead><TableHead className="text-center">Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {POLITICAS.map((p,i)=>(
                    <TableRow key={i} className="hover:bg-muted/40">
                      <TableCell className="font-medium text-sm">{p.nome}</TableCell>
                      <TableCell className="text-sm">{p.versao}</TableCell>
                      <TableCell className="text-sm">{p.atualizada}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status==="vigente"?"bg-emerald-100 text-emerald-800":"bg-amber-100 text-amber-800"}`}>
                          {p.status==="vigente"?"Vigente":"Revisar"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-base">Trilha de auditoria</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="bg-primary/5"><TableHead>Data</TableHead><TableHead>Evento</TableHead><TableHead className="text-center">Sev.</TableHead><TableHead className="text-center">Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {AUDIT.map((a,i)=>(
                    <TableRow key={i} className="hover:bg-muted/40">
                      <TableCell className="text-sm">{a.data}</TableCell>
                      <TableCell className="text-sm">{a.tipo}</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.severidade==="alta"?"bg-red-100 text-red-800":"bg-amber-100 text-amber-800"}`}>{a.severidade}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status==="resolvido"?"bg-emerald-100 text-emerald-800":"bg-blue-100 text-blue-800"}`}>{a.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
