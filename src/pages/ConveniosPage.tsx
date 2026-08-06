import { useState } from "react";
import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { ExportBar } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MOCK_CONVENIOS, MODELO_PAGAMENTO_LABEL, ESPECIALIDADES_CLINICA, Convenio, EspecialidadeConvenio, ModeloPagamento,
} from "@/data/financeData";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, DollarSign, Percent, AlertCircle, Plus, Search, Eye, Trash2, Upload, FileText } from "lucide-react";

const emptyConvenio = (): Convenio => ({
  id: "", nome: "", codigoClinica: "", contratos: [], modeloPagamento: "sessao",
  prazoFaturamento: 10, prazoRecursoGlosa: 60, prazoContestacao: 30, prazoPagamento: 30,
  pmr: 0, taxaAdministracao: null, aliquotaImposto: 8.15, glosaAceitavel: 3,
  senhaPorEspecialidade: false, pagamentoPorPaciente: false, pacientes: 0, especialidades: [],
});

export default function ConveniosPage() {
  const { toast } = useToast();
  const [busca, setBusca] = useState("");
  const [cadastro, setCadastro] = useState<Convenio | null>(null);
  const [visualizar, setVisualizar] = useState<Convenio | null>(null);

  const lista = MOCK_CONVENIOS.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));
  const ticket =
    Math.round(
      MOCK_CONVENIOS.flatMap(c => c.especialidades).reduce((s, e) => s + e.valor, 0) /
        MOCK_CONVENIOS.flatMap(c => c.especialidades).length,
    );

  return (
    <Layout title="Convênios & Valores">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Convênios ativos" value={MOCK_CONVENIOS.length} icon={ShieldCheck} accent />
          <KpiCard label="Ticket médio/sessão" value={`R$ ${ticket}`} icon={DollarSign} hint="Média das tabelas cadastradas" />
          <KpiCard label="PMR médio" value={`${Math.round(MOCK_CONVENIOS.reduce((s, c) => s + c.pmr, 0) / MOCK_CONVENIOS.length)} dias`} icon={Percent} hint="Últimas 6 competências" />
          <KpiCard label="Glosa aceitável média" value={`${(MOCK_CONVENIOS.reduce((s, c) => s + c.glosaAceitavel, 0) / MOCK_CONVENIOS.length).toFixed(1)}%`} icon={AlertCircle} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar convênio..." className="pl-9 w-64" value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
          <div className="ml-auto flex gap-2">
            <ExportBar label="Tabela de convênios" />
            <Button className="gap-2" onClick={() => setCadastro(emptyConvenio())}>
              <Plus className="h-4 w-4" /> Novo convênio
            </Button>
          </div>
        </div>

        <Card className="card-shadow">
          <CardHeader><CardTitle className="text-base">Convênios cadastrados</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead>Convênio</TableHead>
                  <TableHead>Código da clínica</TableHead>
                  <TableHead>Modelo de pagamento</TableHead>
                  <TableHead className="text-center">Especialidades</TableHead>
                  <TableHead className="text-center">Prazo pgto.</TableHead>
                  <TableHead className="text-center">PMR</TableHead>
                  <TableHead className="text-center">Imposto</TableHead>
                  <TableHead className="text-center">Glosa aceitável</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.map(c => (
                  <TableRow key={c.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">
                      {c.nome}
                      <div className="flex gap-1 mt-1">
                        {c.senhaPorEspecialidade && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-800">Senha por especialidade</span>}
                        {c.pagamentoPorPaciente && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">Pagamento por paciente</span>}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{c.codigoClinica}</TableCell>
                    <TableCell className="text-sm">{MODELO_PAGAMENTO_LABEL[c.modeloPagamento]}</TableCell>
                    <TableCell className="text-center">{c.especialidades.length}</TableCell>
                    <TableCell className="text-center">{c.prazoPagamento} dias</TableCell>
                    <TableCell className="text-center text-muted-foreground">{c.pmr} dias</TableCell>
                    <TableCell className="text-center">{c.aliquotaImposto}%</TableCell>
                    <TableCell className="text-center">{c.glosaAceitavel}%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1" onClick={() => setVisualizar(c)}>
                        <Eye className="h-4 w-4" /> Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {cadastro && (
        <ModalCadastro
          convenio={cadastro}
          onClose={() => setCadastro(null)}
          onSave={() => { setCadastro(null); toast({ title: "Convênio cadastrado", description: "Tabela de especialidades registrada (mock)." }); }}
        />
      )}
      {visualizar && <ModalVisualizacao convenio={visualizar} onClose={() => setVisualizar(null)} />}
    </Layout>
  );
}

/* ---------- MODAL DE CADASTRO: mostra TODAS as especialidades da clínica ---------- */
function ModalCadastro({ convenio, onClose, onSave }: { convenio: Convenio; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState<Convenio>(convenio);
  const [linhas, setLinhas] = useState<EspecialidadeConvenio[]>(convenio.especialidades);

  const disponiveis = ESPECIALIDADES_CLINICA.filter(e => !linhas.some(l => l.especialidade === e));
  const set = (k: keyof Convenio, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastro de convênio</DialogTitle>
          <DialogDescription>
            Selecione apenas as especialidades cobertas por este convênio e informe valor e código de procedimento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nome do convênio</Label>
            <Input value={form.nome} onChange={e => set("nome", e.target.value)} placeholder="Ex.: Postal Saúde" />
          </div>
          <div className="space-y-1.5">
            <Label>Código da clínica junto ao convênio</Label>
            <Input value={form.codigoClinica} onChange={e => set("codigoClinica", e.target.value)} placeholder="INQ-0000" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Contrato e aditivos (PDF)</Label>
            <Button variant="outline" className="w-full gap-2 justify-start"><Upload className="h-4 w-4" /> Anexar contrato / aditivos</Button>
          </div>
          <div className="space-y-1.5">
            <Label>Modelo de pagamento</Label>
            <Select value={form.modeloPagamento} onValueChange={v => set("modeloPagamento", v as ModeloPagamento)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(MODELO_PAGAMENTO_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Prazo de faturamento (dias)</Label>
            <Input type="number" value={form.prazoFaturamento} onChange={e => set("prazoFaturamento", +e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Prazo de recurso de glosa (dias)</Label>
            <Input type="number" value={form.prazoRecursoGlosa} onChange={e => set("prazoRecursoGlosa", +e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Prazo de contestação (dias)</Label>
            <Input type="number" value={form.prazoContestacao} onChange={e => set("prazoContestacao", +e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Prazo de pagamento contratual (dias)</Label>
            <Input type="number" value={form.prazoPagamento} onChange={e => set("prazoPagamento", +e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>PMR — prazo médio de recebimento (dias)</Label>
            <Input type="number" value={form.pmr} onChange={e => set("pmr", +e.target.value)} />
            <p className="text-xs text-muted-foreground">Calculado automaticamente após o primeiro pagamento; editável.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Taxa de administração (%)</Label>
            <Input type="number" value={form.taxaAdministracao ?? ""} onChange={e => set("taxaAdministracao", e.target.value === "" ? null : +e.target.value)} placeholder="Somente convênios via associação" />
          </div>
          <div className="space-y-1.5">
            <Label>Alíquota de imposto (%)</Label>
            <Input type="number" value={form.aliquotaImposto} onChange={e => set("aliquotaImposto", +e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Glosa aceitável / controlada (%)</Label>
            <Input type="number" value={form.glosaAceitavel} onChange={e => set("glosaAceitavel", +e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Senha por especialidade</p>
              <p className="text-xs text-muted-foreground">Gera uma guia por especialidade no mês (padrão Cassi).</p>
            </div>
            <Switch checked={form.senhaPorEspecialidade} onCheckedChange={v => set("senhaPorEspecialidade", v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Pagamento por paciente</p>
              <p className="text-xs text-muted-foreground">Baixa individual de recebimento (MHP, ASSEFAZ MHP, GEAP Judicial).</p>
            </div>
            <Switch checked={form.pagamentoPorPaciente} onCheckedChange={v => set("pagamentoPorPaciente", v)} />
          </div>
          {form.modeloPagamento === "pacote_horas" && (
            <div className="space-y-1.5 md:col-span-2">
              <Label>Equivalência do pacote de horas</Label>
              <Textarea value={form.equivalenciaPacote ?? ""} onChange={e => set("equivalenciaPacote", e.target.value)}
                placeholder="Ex.: 1 hora de pacote = 2 sessões de 30 min ou 1 sessão de 45 min pareada" />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
            <p className="text-sm font-semibold">Especialidades atendidas</p>
            <Select
              value=""
              onValueChange={esp => setLinhas(l => [...l, { especialidade: esp, codigo: "", valor: 0 }])}
              disabled={disponiveis.length === 0}
            >
              <SelectTrigger className="w-56"><SelectValue placeholder="Adicionar especialidade" /></SelectTrigger>
              <SelectContent>
                {disponiveis.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Especialidade</TableHead>
                <TableHead>Código de procedimento</TableHead>
                <TableHead className="w-40">{form.modeloPagamento === "pacote_horas" ? "Valor por hora" : "Valor por sessão"}</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhas.map((l, i) => (
                <TableRow key={l.especialidade}>
                  <TableCell className="font-medium">{l.especialidade}</TableCell>
                  <TableCell>
                    <Input value={l.codigo} placeholder="TUSS ou código do convênio"
                      onChange={e => setLinhas(ls => ls.map((x, j) => (j === i ? { ...x, codigo: e.target.value } : x)))} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={l.valor}
                      onChange={e => setLinhas(ls => ls.map((x, j) => (j === i ? { ...x, valor: +e.target.value } : x)))} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setLinhas(ls => ls.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {linhas.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">Nenhuma especialidade adicionada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onSave}>Salvar convênio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- MODAL DE VISUALIZAÇÃO: somente especialidades contratadas ---------- */
function ModalVisualizacao({ convenio, onClose }: { convenio: Convenio; onClose: () => void }) {
  const linha = (label: string, valor: React.ReactNode) => (
    <div className="flex justify-between gap-4 py-1.5 border-b border-border/60 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{valor}</span>
    </div>
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{convenio.nome}</DialogTitle>
          <DialogDescription>
            Exibindo apenas as especialidades efetivamente contratadas por este convênio.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {linha("Código da clínica", convenio.codigoClinica)}
          {linha("Modelo de pagamento", MODELO_PAGAMENTO_LABEL[convenio.modeloPagamento])}
          {linha("Prazo de faturamento", `${convenio.prazoFaturamento} dias`)}
          {linha("Prazo de pagamento contratual", `${convenio.prazoPagamento} dias`)}
          {linha("Prazo de recurso de glosa", `${convenio.prazoRecursoGlosa} dias`)}
          {linha("Prazo de contestação", `${convenio.prazoContestacao} dias`)}
          {linha("PMR (histórico)", `${convenio.pmr} dias`)}
          {linha("Taxa de administração", convenio.taxaAdministracao != null ? `${convenio.taxaAdministracao}%` : "Não se aplica")}
          {linha("Alíquota de imposto", `${convenio.aliquotaImposto}%`)}
          {linha("Glosa aceitável", `${convenio.glosaAceitavel}%`)}
          {linha("Senha por especialidade", convenio.senhaPorEspecialidade ? "Sim" : "Não")}
          {linha("Pagamento por paciente", convenio.pagamentoPorPaciente ? "Sim" : "Não")}
        </div>

        {convenio.equivalenciaPacote && (
          <div className="rounded-lg bg-primary-light px-4 py-3 text-sm">
            <span className="font-semibold">Equivalência de pacote: </span>{convenio.equivalenciaPacote}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold mb-2">Contratos anexados</p>
          <div className="flex flex-wrap gap-2">
            {convenio.contratos.map(c => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" /> {c}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border">
          <p className="px-4 py-2 text-sm font-semibold bg-primary/5 border-b border-border">Especialidades contratadas</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Especialidade</TableHead>
                <TableHead>Código do procedimento</TableHead>
                <TableHead className="text-right">{convenio.modeloPagamento === "pacote_horas" ? "Valor/hora" : "Valor/sessão"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {convenio.especialidades.map(e => (
                <TableRow key={e.especialidade}>
                  <TableCell className="font-medium">{e.especialidade}</TableCell>
                  <TableCell className="font-mono text-xs">{e.codigo}</TableCell>
                  <TableCell className="text-right">R$ {e.valor.toLocaleString("pt-BR")},00</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <ExportBar label={`Convênio ${convenio.nome}`} />
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button>Editar convênio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
