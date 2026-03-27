import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { MOCK_PATIENTS, calcAge } from "@/data/mockData";
import {
  type AgeGroup, type Domain,
  AGE_GROUP_LABELS, DOMAIN_LABELS, DOMAIN_ICONS,
  getQuestionsForAgeGroup, getQuestionsByDomain, isAlert,
} from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle } from "lucide-react";

type Step = "confirm" | "domains" | "questions" | "done";

export default function ScreeningFlow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = MOCK_PATIENTS.find((p) => p.id === id);

  const [step, setStep] = useState<Step>("confirm");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [currentDomain, setCurrentDomain] = useState<Domain | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  if (!patient) {
    return <Layout title="Triagem"><div className="text-center py-20 text-muted-foreground">Paciente não encontrado.</div></Layout>;
  }

  const age = calcAge(patient.dataNascimento);
  const questions = ageGroup ? getQuestionsForAgeGroup(ageGroup as AgeGroup) : [];
  const byDomain = ageGroup ? getQuestionsByDomain(questions) : ({} as Record<Domain, any[]>);
  const totalQ = questions.length;
  const answeredQ = Object.keys(answers).length;

  const domainList = Object.entries(byDomain) as [Domain, typeof questions][];

  const currentDomainQuestions = currentDomain ? (byDomain[currentDomain] ?? []) : [];
  const currentQuestion = currentDomainQuestions[currentQIndex];
  const domainAnswered = currentDomain ? currentDomainQuestions.filter((q) => answers[q.id] !== undefined).length : 0;

  const allCompleted = totalQ > 0 && answeredQ === totalQ;

  const handleAnswer = (answer: boolean) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    if (currentQIndex < currentDomainQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Domain complete, go back to domain selection
      setCurrentDomain(null);
      setCurrentQIndex(0);
      setStep("domains");
    }
  };

  if (step === "confirm") {
    return (
      <Layout title="Triagem">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:underline mb-4 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <div className="max-w-lg mx-auto bg-card rounded-lg border border-border p-8 card-shadow">
          <h2 className="text-xl font-bold text-foreground mb-6">Confirmar Idade da Criança</h2>
          <div className="space-y-3 mb-6 text-sm">
            <p><span className="text-muted-foreground">Nome:</span> <span className="font-medium">{patient.nome}</span></p>
            <p><span className="text-muted-foreground">Data de nascimento:</span> <span className="font-medium">{new Date(patient.dataNascimento).toLocaleDateString("pt-BR")}</span> → <span className="font-medium">{age.label}</span></p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">⚠️ Confirme a idade correta antes de iniciar.</p>
            <p className="text-sm text-muted-foreground">A triagem será personalizada conforme a faixa etária selecionada.</p>
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Faixa etária:</label>
            <Select value={ageGroup} onValueChange={(v) => setAgeGroup(v as AgeGroup)}>
              <SelectTrigger><SelectValue placeholder="Selecione a faixa etária" /></SelectTrigger>
              <SelectContent>
                {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button
              disabled={!ageGroup}
              onClick={() => setStep("domains")}
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              Confirmar e Iniciar →
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (step === "questions" && currentDomain && currentQuestion) {
    return (
      <Layout title="Triagem">
        <button onClick={() => { setCurrentDomain(null); setCurrentQIndex(0); setStep("domains"); }} className="flex items-center gap-2 text-primary hover:underline mb-4 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Voltar aos domínios
        </button>
        <div className="max-w-2xl mx-auto bg-card rounded-lg border border-border p-8 card-shadow">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{DOMAIN_ICONS[currentDomain]}</span>
            <h2 className="text-xl font-bold text-foreground">{DOMAIN_LABELS[currentDomain]}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Pergunta {currentQIndex + 1} de {currentDomainQuestions.length}</p>
          <Progress value={(domainAnswered / currentDomainQuestions.length) * 100} className="mb-8 h-2" />

          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <p className="text-lg font-medium text-foreground">{currentQuestion.text}</p>
          </div>

          <div className="flex gap-4 justify-center mb-8">
            <Button
              size="lg"
              variant={answers[currentQuestion.id] === false ? "default" : "outline"}
              onClick={() => handleAnswer(false)}
              className={`w-32 h-14 text-lg ${answers[currentQuestion.id] === false ? "bg-destructive text-destructive-foreground" : "border-border"}`}
            >
              Não
            </Button>
            <Button
              size="lg"
              variant={answers[currentQuestion.id] === true ? "default" : "outline"}
              onClick={() => handleAnswer(true)}
              className={`w-32 h-14 text-lg ${answers[currentQuestion.id] === true ? "bg-primary text-primary-foreground" : "border-border"}`}
            >
              Sim
            </Button>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex(currentQIndex - 1)}
            >
              ← Pergunta anterior
            </Button>
            <Button
              variant="outline"
              disabled={currentQIndex === currentDomainQuestions.length - 1}
              onClick={() => setCurrentQIndex(currentQIndex + 1)}
            >
              Próxima pergunta →
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Domains view
  return (
    <Layout title="Triagem">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:underline mb-4 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg border border-border p-6 card-shadow mb-6">
          <h2 className="text-xl font-bold text-foreground mb-1">Triagem — {patient.nome}</h2>
          <p className="text-sm text-muted-foreground mb-3">{answeredQ} de {totalQ} perguntas respondidas</p>
          <Progress value={totalQ > 0 ? (answeredQ / totalQ) * 100 : 0} className="h-2.5 mb-4" />
          <p className="text-sm text-foreground font-medium">Selecione um domínio para avaliar</p>
          <p className="text-sm text-muted-foreground">Você pode começar por qualquer domínio e voltar quando quiser.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {domainList.map(([domain, qs]) => {
            const answered = qs.filter((q) => answers[q.id] !== undefined).length;
            const complete = answered === qs.length;
            return (
              <button
                key={domain}
                onClick={() => { setCurrentDomain(domain); setCurrentQIndex(0); setStep("questions"); }}
                className={`bg-card rounded-lg border p-5 card-shadow text-left transition-all hover:card-shadow-md ${
                  complete ? "border-primary" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{DOMAIN_ICONS[domain]}</span>
                  {complete && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{DOMAIN_LABELS[domain]}</h3>
                <p className="text-xs text-muted-foreground mb-2">{answered}/{qs.length} perguntas</p>
                <Progress value={(answered / qs.length) * 100} className="h-1.5" />
              </button>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("confirm")}>← Voltar</Button>
          <Button
            disabled={!allCompleted}
            onClick={() => navigate(`/relatorio/${patient.id}`)}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            ✓ Finalizar Triagem
          </Button>
        </div>
      </div>
    </Layout>
  );
}
