import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { MOCK_PATIENTS, MOCK_OBSERVATIONS, calcAge, type Observation } from "@/data/mockData";
import { DOMAIN_LABELS, DOMAIN_ICONS, type Domain } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Phone, Mail, User, Clock } from "lucide-react";

// Mock form responses for demo
const MOCK_RESPONSES: Record<string, { domain: Domain; question: string; answer: boolean }[]> = {
  p1: [
    { domain: "sensoriomotor", question: "Apresenta o sorriso social até o final do primeiro trimestre?", answer: true },
    { domain: "sensoriomotor", question: "Apresenta o olhar vago com pouco interesse?", answer: false },
    { domain: "sensoriomotor", question: "Observa e acompanha os movimentos dos objetos?", answer: true },
    { domain: "funcao_manual", question: "Leva a mão à boca?", answer: true },
    { domain: "comunicacao", question: "Responde ou reage aos sons?", answer: true },
    { domain: "socioemocional", question: "Demonstra afeto por seus cuidadores?", answer: true },
  ],
};

const MOCK_HISTORY = [
  { date: "2026-01-10T09:00:00", action: "Cadastro realizado", user: "Ana Paula Souza", icon: "📋" },
  { date: "2026-01-20T14:30:00", action: "Triagem iniciada", user: "Dr. Carlos Mendes", icon: "▶️" },
  { date: "2026-02-01T16:00:00", action: "Triagem concluída", user: "Dr. Carlos Mendes", icon: "✅" },
];

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = MOCK_PATIENTS.find((p) => p.id === id);
  const [observations] = useState<Observation[]>(MOCK_OBSERVATIONS.filter((o) => o.patientId === id));
  const [newObs, setNewObs] = useState("");

  if (!patient) {
    return (
      <Layout title="Paciente">
        <div className="text-center py-20 text-muted-foreground">Paciente não encontrado.</div>
      </Layout>
    );
  }

  const age = calcAge(patient.dataNascimento);
  const birthFormatted = new Date(patient.dataNascimento).toLocaleDateString("pt-BR");
  const cadastroFormatted = new Date(patient.dataCadastro).toLocaleDateString("pt-BR");
  const responses = MOCK_RESPONSES[patient.id] ?? [];

  // Group responses by domain
  const grouped: Record<string, typeof responses> = {};
  responses.forEach((r) => {
    if (!grouped[r.domain]) grouped[r.domain] = [];
    grouped[r.domain].push(r);
  });

  return (
    <Layout title="Detalhe do Paciente">
      {/* Back + Header */}
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary hover:underline mb-4 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Voltar para Leads
      </button>

      <div className="bg-card rounded-lg border border-border p-6 card-shadow mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground">{patient.nome}</h2>
              <StatusBadge status={patient.statusTriagem} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Nascimento: {birthFormatted} · {age.label}</p>
              <p className="flex items-center gap-2"><User className="h-4 w-4" /> Sexo: {patient.sexo}</p>
              <p className="flex items-center gap-2"><User className="h-4 w-4" /> Responsável: {patient.responsavelNome} ({patient.responsavelParentesco})</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {patient.responsavelTelefone}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {patient.responsavelEmail}</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> Cadastrado em: {cadastroFormatted}</p>
              <p className="flex items-center gap-2"><User className="h-4 w-4" /> Profissional: {patient.profissionalNome ?? "—"}</p>
            </div>
          </div>
          <div>
            {patient.statusTriagem === "nao_iniciada" && (
              <Button onClick={() => navigate(`/triagem/${patient.id}`)} className="bg-primary text-primary-foreground hover:bg-primary-hover">
                Iniciar Triagem
              </Button>
            )}
            {patient.statusTriagem === "em_andamento" && (
              <Button onClick={() => navigate(`/triagem/${patient.id}`)} variant="outline" className="border-primary text-primary">
                Continuar Triagem
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="respostas" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="respostas">Respostas do Formulário</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="triagem">Triagem</TabsTrigger>
        </TabsList>

        <TabsContent value="respostas">
          <div className="bg-card rounded-lg border border-border p-6 card-shadow space-y-6">
            {Object.keys(grouped).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma resposta de formulário registrada.</p>
            ) : (
              Object.entries(grouped).map(([domain, qs]) => (
                <div key={domain}>
                  <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3 pb-2 border-b border-border">
                    <span>{DOMAIN_ICONS[domain as Domain]}</span>
                    {DOMAIN_LABELS[domain as Domain]}
                  </h3>
                  <div className="space-y-2">
                    {qs.map((q, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
                        <span className="text-sm">{q.question}</span>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded ${q.answer ? "text-primary bg-status-progress-bg" : "text-destructive bg-red-50"}`}>
                          {q.answer ? "Sim" : "Não"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="observacoes">
          <div className="bg-card rounded-lg border border-border p-6 card-shadow space-y-4">
            <Textarea
              placeholder="Adicione uma observação..."
              value={newObs}
              onChange={(e) => setNewObs(e.target.value)}
              rows={3}
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover" disabled={!newObs.trim()}>
              Salvar Observação
            </Button>
            <div className="space-y-3 mt-4">
              {observations.length === 0 && <p className="text-muted-foreground text-center py-4">Nenhuma observação registrada.</p>}
              {observations.map((o) => (
                <div key={o.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{o.professionalName}</span>
                    <span className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString("pt-BR")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{o.text}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <div className="bg-card rounded-lg border border-border p-6 card-shadow">
            <div className="space-y-4">
              {MOCK_HISTORY.map((h, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-2xl">{h.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{h.action}</p>
                    <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleString("pt-BR")} · {h.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="triagem">
          <div className="bg-card rounded-lg border border-border p-6 card-shadow text-center">
            {patient.statusTriagem === "concluida" ? (
              <div>
                <p className="text-muted-foreground mb-4">Relatório de triagem disponível.</p>
                <Button onClick={() => navigate(`/relatorio/${patient.id}`)} className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  Ver Relatório
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-4">A triagem ainda não foi concluída.</p>
                <Button onClick={() => navigate(`/triagem/${patient.id}`)} className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  {patient.statusTriagem === "em_andamento" ? "Continuar Triagem" : "Iniciar Triagem"}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
