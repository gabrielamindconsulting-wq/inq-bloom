import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  PatientFormValues, defaultPatientForm, emptyResponsavel, patientFormSchema,
  saveDraft, loadDraft, clearDraft, savePatient, getStoredPatient,
  fetchCEP, CID_OPTIONS, COMORBIDADES, GATILHOS_SENSORIAIS, ESTIMULOS_REGULATORIOS,
  COMPORTAMENTOS_RISCO, CONVENIOS, PARENTESCOS, PERIODOS_ESCOLARES, ORIGENS_LEAD,
  FUNIL_STATUS, ESPECIALIDADES_LIST,
} from "@/data/patientFormData";
import { MOCK_CLINICAL_PATIENTS, MOCK_PROFESSIONALS } from "@/data/clinicalMockData";
import { calcAge } from "@/data/mockData";
import { MOCK_USERS } from "@/data/mockData";
import {
  ArrowLeft, Save, Plus, Trash2, Upload, AlertTriangle,
  User, Users, Stethoscope, Brain, FileText, Pill, Activity, Compass,
} from "lucide-react";

const TABS = [
  { id: "pessoais",   label: "Dados Pessoais",  icon: User },
  { id: "responsaveis", label: "Responsáveis",  icon: Users },
  { id: "diagnostico", label: "Diagnóstico",    icon: Stethoscope },
  { id: "perfil",     label: "Perfil Sensorial", icon: Brain },
  { id: "convenio",   label: "Convênio",        icon: FileText },
  { id: "medicacoes", label: "Medicações",      icon: Pill },
  { id: "historico",  label: "Histórico",       icon: Activity },
  { id: "origem",     label: "Origem & Jornada", icon: Compass },
] as const;

export default function PatientFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const formId = id || "new";

  const initial = useMemo<PatientFormValues>(() => {
    const draft = loadDraft(formId);
    if (draft) return draft;
    if (isEdit) {
      const stored = getStoredPatient(formId);
      if (stored) return stored;
      const mock = MOCK_CLINICAL_PATIENTS.find(p => p.id === id);
      if (mock) {
        const d = defaultPatientForm();
        return {
          ...d,
          nome: mock.nome,
          dataNascimento: mock.dataNascimento,
          sexo: mock.sexo as any,
          responsaveis: [{
            ...emptyResponsavel(),
            nome: mock.responsavelNome,
            telefone1: mock.responsavelTelefone,
            email: mock.responsavelEmail,
            parentesco: mock.responsavelParentesco,
          }],
          convenio: mock.planoSaude || "",
          carteirinha: mock.numeroGuia || "",
        };
      }
    }
    return defaultPatientForm();
  }, [formId, id, isEdit]);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema) as any,
    defaultValues: initial,
    mode: "onBlur",
  });

  const [tab, setTab] = useState<string>("pessoais");
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);

  // Auto-save draft
  const watched = form.watch();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => {
      saveDraft(formId, watched);
      setDraftSavedAt(new Date());
    }, 800);
    return () => clearTimeout(t);
  }, [watched, formId]);

  const age = useMemo(() => {
    if (!watched.dataNascimento) return null;
    try { return calcAge(watched.dataNascimento); } catch { return null; }
  }, [watched.dataNascimento]);

  const cidPrincipal = watched.cidPrincipal || "";
  const showNivelTEA = cidPrincipal.startsWith("F84");

  async function onCEPBlur(value: string) {
    const data = await fetchCEP(value);
    if (data) {
      form.setValue("logradouro", data.logradouro);
      form.setValue("bairro", data.bairro);
      form.setValue("cidade", data.localidade);
      form.setValue("uf", data.uf);
      toast.success("Endereço preenchido pelo CEP");
    }
  }

  function onSubmit(data: PatientFormValues) {
    const pid = id || `cp_${Date.now()}`;
    savePatient(pid, data);
    clearDraft(formId);
    toast.success(isEdit ? "Paciente atualizado" : "Paciente cadastrado");
    navigate(`/pacientes`);
  }

  function onInvalid() {
    toast.error("Há campos obrigatórios não preenchidos");
  }

  // Aba 2 - responsaveis
  const responsaveisFA = useFieldArray({ control: form.control, name: "responsaveis" });
  const medicacoesFA = useFieldArray({ control: form.control, name: "medicacoes" });
  const especAtivasFA = useFieldArray({ control: form.control, name: "especialidadesAtivas" });
  const pedidoEspecsFA = useFieldArray({ control: form.control, name: "pedidoEspecialidades" });

  // Set responsavel principal exclusivity
  function setPrincipal(idx: number) {
    responsaveisFA.fields.forEach((_, i) => {
      form.setValue(`responsaveis.${i}.principal`, i === idx);
    });
  }

  function toggleArrayValue(field: keyof PatientFormValues, value: string) {
    const cur = (form.getValues(field) as string[]) || [];
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
    form.setValue(field as any, next as any, { shouldDirty: true });
  }

  function ChipMulti({ field, options }: { field: keyof PatientFormValues; options: readonly string[] | string[] }) {
    const cur = (watched[field] as string[]) || [];
    return (
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = cur.includes(opt);
          return (
            <button type="button" key={opt}
              onClick={() => toggleArrayValue(field, opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"
              }`}>
              {opt}
            </button>
          );
        })}
      </div>
    );
  }

  function FileField({ name, label }: { name: keyof PatientFormValues; label: string }) {
    const value = watched[name] as string;
    return (
      <div className="space-y-1.5">
        <Label>{label}</Label>
        <label className="flex items-center gap-2 px-3 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted/40 text-sm">
          <Upload className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{value || "Selecionar arquivo..."}</span>
          <input type="file" className="hidden"
            onChange={e => form.setValue(name as any, (e.target.files?.[0]?.name || "") as any, { shouldDirty: true })}
          />
        </label>
      </div>
    );
  }

  const closers = MOCK_USERS.filter(u => u.tipo === "padrao" || u.tipo === "admin");

  return (
    <Layout title={isEdit ? "Editar Paciente" : "Novo Paciente"}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="pb-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            {draftSavedAt && (
              <span className="text-xs text-muted-foreground">
                Rascunho salvo às {draftSavedAt.toLocaleTimeString("pt-BR")}
              </span>
            )}
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full h-auto flex-wrap justify-start bg-muted p-1">
              {TABS.map(t => (
                <TabsTrigger key={t.id} value={t.id} className="gap-1.5">
                  <t.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ───── ABA 1 ───── */}
            <TabsContent value="pessoais">
              <Card><CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3 flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={watched.fotoUrl} />
                      <AvatarFallback>{(watched.nome || "?").slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <FileField name="fotoUrl" label="Foto do paciente" />
                  </div>
                  <Field label="Nome completo *" error={form.formState.errors.nome?.message}>
                    <Input {...form.register("nome")} />
                  </Field>
                  <Field label="Data de nascimento *" error={form.formState.errors.dataNascimento?.message}>
                    <Input type="date" {...form.register("dataNascimento")} />
                    {age && <p className="text-xs text-muted-foreground mt-1">{age.label}</p>}
                  </Field>
                  <Field label="Sexo">
                    <Controller control={form.control} name="sexo" render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    )}/>
                  </Field>
                  <Field label="CPF (opcional)"><Input {...form.register("cpf")} placeholder="000.000.000-00" /></Field>
                  <Field label="RG / Certidão"><Input {...form.register("rgCertidao")} /></Field>
                  <div />
                  <Field label="CEP">
                    <Input {...form.register("cep")} onBlur={e => onCEPBlur(e.target.value)} placeholder="00000-000" />
                  </Field>
                  <Field label="Logradouro" className="md:col-span-2"><Input {...form.register("logradouro")} /></Field>
                  <Field label="Número"><Input {...form.register("numero")} /></Field>
                  <Field label="Complemento"><Input {...form.register("complemento")} /></Field>
                  <Field label="Bairro"><Input {...form.register("bairro")} /></Field>
                  <Field label="Cidade"><Input {...form.register("cidade")} /></Field>
                  <Field label="UF"><Input maxLength={2} {...form.register("uf")} /></Field>
                  <div />
                  <Field label="Escola"><Input {...form.register("escola")} /></Field>
                  <Field label="Período escolar">
                    <Controller control={form.control} name="periodoEscolar" render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {PERIODOS_ESCOLARES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}/>
                  </Field>
                  <div className="flex items-center gap-3 pt-6">
                    <Controller control={form.control} name="temAT" render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}/>
                    <Label>Possui AT na escola</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───── ABA 2 ───── */}
            <TabsContent value="responsaveis">
              <Card><CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Responsáveis</CardTitle>
                <Button type="button" size="sm" onClick={() => responsaveisFA.append(emptyResponsavel())}>
                  <Plus className="h-4 w-4" /> Adicionar
                </Button>
              </CardHeader>
                <CardContent className="space-y-4">
                  {responsaveisFA.fields.map((field, idx) => (
                    <Card key={field.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3 flex justify-between items-center">
                          <h4 className="font-semibold text-sm">Responsável {idx + 1}</h4>
                          {responsaveisFA.fields.length > 1 && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button type="button" variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover responsável?</AlertDialogTitle>
                                  <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => responsaveisFA.remove(idx)}>Remover</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                        <Field label="Nome completo *" error={form.formState.errors.responsaveis?.[idx]?.nome?.message}>
                          <Input {...form.register(`responsaveis.${idx}.nome`)} />
                        </Field>
                        <Field label="CPF"><Input {...form.register(`responsaveis.${idx}.cpf`)} /></Field>
                        <Field label="RG"><Input {...form.register(`responsaveis.${idx}.rg`)} /></Field>
                        <Field label="Telefone principal *">
                          <div className="flex gap-2">
                            <Input {...form.register(`responsaveis.${idx}.telefone1`)} />
                            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                              <Controller control={form.control} name={`responsaveis.${idx}.telefone1Whats`} render={({ field }) => (
                                <Checkbox checked={field.value} onCheckedChange={v => field.onChange(!!v)} />
                              )}/>
                              WhatsApp
                            </label>
                          </div>
                        </Field>
                        <Field label="Telefone secundário">
                          <div className="flex gap-2">
                            <Input {...form.register(`responsaveis.${idx}.telefone2`)} />
                            <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                              <Controller control={form.control} name={`responsaveis.${idx}.telefone2Whats`} render={({ field }) => (
                                <Checkbox checked={field.value} onCheckedChange={v => field.onChange(!!v)} />
                              )}/>
                              WhatsApp
                            </label>
                          </div>
                        </Field>
                        <Field label="Email"><Input type="email" {...form.register(`responsaveis.${idx}.email`)} /></Field>
                        <Field label="Parentesco">
                          <Controller control={form.control} name={`responsaveis.${idx}.parentesco`} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {PARENTESCOS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}/>
                        </Field>
                        <div className="md:col-span-3 flex flex-wrap gap-6 pt-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="radio" name="principal" checked={!!watched.responsaveis?.[idx]?.principal}
                              onChange={() => setPrincipal(idx)} />
                            Responsável principal
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Controller control={form.control} name={`responsaveis.${idx}.titularConvenio`} render={({ field }) => (
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}/>
                            Titular do convênio
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Controller control={form.control} name={`responsaveis.${idx}.recebeComunicacoes`} render={({ field }) => (
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            )}/>
                            Recebe comunicações
                          </label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───── ABA 3 ───── */}
            <TabsContent value="diagnostico">
              <Card><CardHeader><CardTitle>Diagnóstico Clínico</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="CID principal">
                    <Controller control={form.control} name="cidPrincipal" render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Buscar CID" /></SelectTrigger>
                        <SelectContent>
                          {CID_OPTIONS.map(c => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}/>
                  </Field>
                  {showNivelTEA && (
                    <Field label="Nível de suporte TEA">
                      <Controller control={form.control} name="nivelSuporteTEA" render={({ field }) => (
                        <RadioGroup value={field.value || ""} onValueChange={field.onChange} className="flex gap-4 pt-2">
                          {["1","2","3"].map(n => (
                            <label key={n} className="flex items-center gap-2 text-sm">
                              <RadioGroupItem value={n} /> Nível {n}
                            </label>
                          ))}
                        </RadioGroup>
                      )}/>
                    </Field>
                  )}
                  <div className="md:col-span-2">
                    <Label>CIDs secundários</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {CID_OPTIONS.map(c => {
                        const active = (watched.cidsSecundarios || []).includes(c.code);
                        return (
                          <button type="button" key={c.code}
                            onClick={() => toggleArrayValue("cidsSecundarios", c.code)}
                            className={`px-2.5 py-1 rounded text-xs border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-muted"}`}>
                            {c.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Field label="Data do diagnóstico"><Input type="date" {...form.register("dataDiagnostico")} /></Field>
                  <Field label="Status do laudo">
                    <Controller control={form.control} name="statusLaudo" render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="provisorio">Provisório</SelectItem>
                          <SelectItem value="definitivo">Definitivo</SelectItem>
                          <SelectItem value="investigacao">Em investigação</SelectItem>
                        </SelectContent>
                      </Select>
                    )}/>
                  </Field>
                  <Field label="Médico diagnosticador"><Input {...form.register("medicoDiagNome")} /></Field>
                  <Field label="CRM"><Input {...form.register("medicoDiagCRM")} /></Field>
                  <Field label="Especialidade do médico"><Input {...form.register("medicoDiagEspecialidade")} /></Field>
                  <FileField name="laudoFile" label="Laudo (PDF)" />
                  <div className="md:col-span-2">
                    <Label>Comorbidades</Label>
                    <div className="mt-2"><ChipMulti field="comorbidades" options={COMORBIDADES as any} /></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───── ABA 4 ───── */}
            <TabsContent value="perfil">
              <Card><CardHeader><CardTitle>Perfil Sensorial e Comportamental</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label>Gatilhos sensoriais</Label>
                    <div className="mt-2"><ChipMulti field="gatilhosSensoriais" options={GATILHOS_SENSORIAIS as any} /></div>
                  </div>
                  <div>
                    <Label>Estímulos regulatórios</Label>
                    <div className="mt-2"><ChipMulti field="estimulosRegulatorios" options={ESTIMULOS_REGULATORIOS as any} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Objeto de apego"><Input {...form.register("objetoApego")} placeholder="Ex: ursinho azul" /></Field>
                  </div>
                  <div>
                    <Label>Comportamentos de risco</Label>
                    <div className="mt-2"><ChipMulti field="comportamentosRisco" options={COMPORTAMENTOS_RISCO as any} /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Comunicação">
                      <Controller control={form.control} name="comunicacao" render={({ field }) => (
                        <Select value={field.value || ""} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verbal_fluente">Verbal fluente</SelectItem>
                            <SelectItem value="verbal_limitada">Verbal limitada</SelectItem>
                            <SelectItem value="nao_verbal">Não-verbal</SelectItem>
                            <SelectItem value="caa">Usa CAA</SelectItem>
                            <SelectItem value="sinais">Usa sinais</SelectItem>
                          </SelectContent>
                        </Select>
                      )}/>
                    </Field>
                    <Field label="Tolera espera?">
                      <Controller control={form.control} name="toleraEspera" render={({ field }) => (
                        <RadioGroup value={field.value || ""} onValueChange={field.onChange} className="flex gap-4 pt-2">
                          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="sim" /> Sim</label>
                          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="com_limite" /> Com limite</label>
                          <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="nao" /> Não</label>
                        </RadioGroup>
                      )}/>
                    </Field>
                    <Field label="Reage bem a troca de profissional?">
                      <Controller control={form.control} name="reageBemTroca" render={({ field }) => (
                        <Select value={field.value || ""} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sim">Sim</SelectItem>
                            <SelectItem value="nao">Não</SelectItem>
                            <SelectItem value="depende">Depende</SelectItem>
                          </SelectContent>
                        </Select>
                      )}/>
                    </Field>
                    <div className="flex items-center gap-3 pt-6">
                      <Controller control={form.control} name="necessitaAcompanhante" render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}/>
                      <Label>Necessita acompanhante na sessão</Label>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Controller control={form.control} name="usaFralda" render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}/>
                      <Label>Usa fralda</Label>
                    </div>
                    {watched.usaFralda && (
                      <Field label="Idade que justifica uso de fralda"><Input {...form.register("usaFraldaIdade")} /></Field>
                    )}
                  </div>
                  <Field label="Restrições alimentares / seletividade">
                    <Textarea rows={3} {...form.register("restricoesAlimentares")} />
                  </Field>

                  <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold">
                      <AlertTriangle className="h-4 w-4" /> Observações para a recepção
                    </div>
                    <p className="text-xs text-amber-800 mb-2">Este texto aparecerá em destaque no momento do check-in.</p>
                    <Textarea rows={4} {...form.register("observacoesRecepcao")}
                      className="bg-white border-amber-300" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───── ABA 5 ───── */}
            <TabsContent value="convenio">
              <Card><CardHeader><CardTitle>Convênio e Documentação</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <Controller control={form.control} name="tipoFinanceiro" render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="convenio" /> Convênio</label>
                      <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="particular" /> Particular</label>
                    </RadioGroup>
                  )}/>

                  {watched.tipoFinanceiro === "convenio" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Convênio">
                          <Controller control={form.control} name="convenio" render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                              <SelectContent>
                                {CONVENIOS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}/>
                        </Field>
                        <Field label="Carteirinha"><Input {...form.register("carteirinha")} /></Field>
                        <Field label="Validade"><Input type="date" {...form.register("validadeCarteirinha")} /></Field>
                        <Field label="Plano / categoria"><Input {...form.register("planoCategoria")} /></Field>
                        <Field label="Titular do convênio">
                          <Controller control={form.control} name="titularConvenioNome" render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                              <SelectContent>
                                {(watched.responsaveis || []).map(r => r.nome).filter(Boolean).map(n => (
                                  <SelectItem key={n} value={n}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}/>
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FileField name="carteirinhaFrenteFile" label="Carteirinha (frente)" />
                        <FileField name="carteirinhaVersoFile" label="Carteirinha (verso)" />
                      </div>
                    </>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Pedido médico atual</h4>
                      {watched.pedidoValidade && (() => {
                        const days = Math.floor((new Date(watched.pedidoValidade).getTime() - Date.now()) / 86400000);
                        if (days < 30) return <Badge variant="destructive">Vence em {days} dias</Badge>;
                        return null;
                      })()}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="Data de emissão">
                        <Input type="date" {...form.register("pedidoEmissao")} onChange={e => {
                          form.setValue("pedidoEmissao", e.target.value);
                          if (e.target.value && !watched.pedidoValidade) {
                            const d = new Date(e.target.value);
                            d.setMonth(d.getMonth() + 6);
                            form.setValue("pedidoValidade", d.toISOString().split("T")[0]);
                          }
                        }}/>
                      </Field>
                      <Field label="Data de validade"><Input type="date" {...form.register("pedidoValidade")} /></Field>
                      <div />
                      <Field label="Médico solicitante"><Input {...form.register("pedidoMedicoNome")} /></Field>
                      <Field label="CRM"><Input {...form.register("pedidoMedicoCRM")} /></Field>
                      <FileField name="pedidoFile" label="PDF do pedido" />
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Especialidades solicitadas</Label>
                        <Button type="button" size="sm" variant="outline" onClick={() => pedidoEspecsFA.append({ especialidade: "Fonoaudiologia", cargaHoraria: 1 })}>
                          <Plus className="h-3.5 w-3.5" /> Adicionar
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {pedidoEspecsFA.fields.map((f, idx) => (
                          <div key={f.id} className="flex gap-2 items-center">
                            <Controller control={form.control} name={`pedidoEspecialidades.${idx}.especialidade`} render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {ESPECIALIDADES_LIST.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            )}/>
                            <Input type="number" min={0} max={40} step={0.5}
                              {...form.register(`pedidoEspecialidades.${idx}.cargaHoraria`)}
                              className="w-28" placeholder="h/sem" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => pedidoEspecsFA.remove(idx)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───── ABA 6 ───── */}
            <TabsContent value="medicacoes">
              <Card><CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Medicações</CardTitle>
                <Button type="button" size="sm" onClick={() => medicacoesFA.append({ nome: "", dosagem: "", horarios: [], prescritor: "", efeitos: "" })}>
                  <Plus className="h-4 w-4" /> Adicionar
                </Button>
              </CardHeader>
                <CardContent>
                  {medicacoesFA.fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">Nenhuma medicação cadastrada.</p>
                  )}
                  <div className="space-y-3">
                    {medicacoesFA.fields.map((f, idx) => {
                      const horarios = (watched.medicacoes?.[idx]?.horarios as string[]) || [];
                      return (
                        <Card key={f.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Field label="Medicamento"><Input {...form.register(`medicacoes.${idx}.nome`)} /></Field>
                            <Field label="Dosagem"><Input {...form.register(`medicacoes.${idx}.dosagem`)} /></Field>
                            <div className="md:col-span-2">
                              <Label>Horários</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {["Manhã", "Tarde", "Noite"].map(h => {
                                  const active = horarios.includes(h);
                                  return (
                                    <button key={h} type="button"
                                      onClick={() => {
                                        const next = active ? horarios.filter(v => v !== h) : [...horarios, h];
                                        form.setValue(`medicacoes.${idx}.horarios`, next);
                                      }}
                                      className={`px-3 py-1 rounded-full text-xs border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input"}`}>
                                      {h}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <Field label="Médico prescritor"><Input {...form.register(`medicacoes.${idx}.prescritor`)} /></Field>
                            <Field label="Efeitos relevantes"><Input {...form.register(`medicacoes.${idx}.efeitos`)} /></Field>
                            <div className="md:col-span-2 flex justify-end">
                              <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => medicacoesFA.remove(idx)}>
                                <Trash2 className="h-4 w-4" /> Remover
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───── ABA 7 ───── */}
            <TabsContent value="historico">
              <Card><CardHeader><CardTitle>Histórico Terapêutico</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Especialidades ativas na clínica</Label>
                      <Button type="button" size="sm" variant="outline" onClick={() => especAtivasFA.append({ especialidade: "Fonoaudiologia", profissionalId: "", cargaHorariaSemanal: 1, dataInicio: "" })}>
                        <Plus className="h-3.5 w-3.5" /> Adicionar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {especAtivasFA.fields.map((f, idx) => (
                        <div key={f.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                          <Controller control={form.control} name={`especialidadesAtivas.${idx}.especialidade`} render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {ESPECIALIDADES_LIST.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}/>
                          <Controller control={form.control} name={`especialidadesAtivas.${idx}.profissionalId`} render={({ field }) => (
                            <Select value={field.value || ""} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue placeholder="Profissional" /></SelectTrigger>
                              <SelectContent>
                                {MOCK_PROFESSIONALS.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}/>
                          <Input type="number" step={0.5} placeholder="h/sem" {...form.register(`especialidadesAtivas.${idx}.cargaHorariaSemanal`)} />
                          <div className="flex gap-2">
                            <Input type="date" {...form.register(`especialidadesAtivas.${idx}.dataInicio`)} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => especAtivasFA.remove(idx)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Field label="Outras terapias externas">
                    <Textarea rows={3} {...form.register("outrasTerapias")} placeholder="Ex: equoterapia em outra clínica" />
                  </Field>
                  <div className="flex items-center gap-3">
                    <Controller control={form.control} name="temPEI" render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}/>
                    <Label>Possui PEI na escola</Label>
                  </div>
                  <Field label="Observações gerais"><Textarea rows={3} {...form.register("observacoesGerais")} /></Field>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ───── ABA 8 ───── */}
            <TabsContent value="origem">
              <Card><CardHeader><CardTitle>Origem e Jornada</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Origem do lead">
                    <Controller control={form.control} name="origemLead" render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {ORIGENS_LEAD.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}/>
                  </Field>
                  <Field label="Detalhe da indicação"><Input {...form.register("detalheIndicacao")} /></Field>
                  <Field label="Closer responsável">
                    <Controller control={form.control} name="closerId" render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {closers.map(u => <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}/>
                  </Field>
                  <Field label="Data de entrada"><Input type="date" {...form.register("dataEntrada")} /></Field>
                  <Field label="Status no funil">
                    <Controller control={form.control} name="funilStatus" render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {FUNIL_STATUS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}/>
                  </Field>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer fixo */}
          <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-background border-t z-30">
            <div className="px-6 py-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground hidden sm:block">
                {Object.keys(form.formState.errors).length > 0 && (
                  <span className="text-destructive">Existem campos inválidos</span>
                )}
              </p>
              <div className="flex gap-2 ml-auto">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
                <Button type="submit" className="gap-1">
                  <Save className="h-4 w-4" /> Salvar paciente
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Layout>
  );
}

function Field({ label, children, error, className }: { label: string; children: React.ReactNode; error?: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className || ""}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
