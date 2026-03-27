import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { MOCK_PATIENTS, calcAge } from "@/data/mockData";
import { DOMAIN_LABELS, DOMAIN_ICONS, type Domain } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Share2, FileDown } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from "recharts";
import logo from "@/assets/logo-inq.png";

// Mock screening results for demo
const MOCK_RESULTS: Record<Domain, { alerts: number; total: number }> = {
  sensoriomotor: { alerts: 1, total: 8 },
  funcao_manual: { alerts: 0, total: 3 },
  comunicacao: { alerts: 2, total: 3 },
  linguagem: { alerts: 0, total: 1 },
  cognitivo: { alerts: 0, total: 0 },
  socioemocional: { alerts: 1, total: 4 },
};

function getLevel(score: number): { label: string; color: string } {
  if (score <= 30) return { label: "leves", color: "#2D6A2D" };
  if (score <= 60) return { label: "moderados", color: "#F59E0B" };
  return { label: "significativos", color: "#EF4444" };
}

export default function ScreeningReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = MOCK_PATIENTS.find((p) => p.id === id);

  if (!patient) {
    return <Layout title="Relatório"><div className="text-center py-20 text-muted-foreground">Paciente não encontrado.</div></Layout>;
  }

  const age = calcAge(patient.dataNascimento);
  const totalAlerts = Object.values(MOCK_RESULTS).reduce((s, d) => s + d.alerts, 0);
  const totalQuestions = Object.values(MOCK_RESULTS).reduce((s, d) => s + d.total, 0);
  const generalScore = totalQuestions > 0 ? (totalAlerts / totalQuestions) * 100 : 0;
  const level = getLevel(generalScore);

  const radarData = (Object.entries(MOCK_RESULTS) as [Domain, typeof MOCK_RESULTS.sensoriomotor][]).map(([domain, data]) => ({
    domain: DOMAIN_LABELS[domain].split(" ")[0],
    fullLabel: DOMAIN_LABELS[domain],
    score: data.total > 0 ? 100 - (data.alerts / data.total) * 100 : 100,
  }));

  const alertDomains = (Object.entries(MOCK_RESULTS) as [Domain, typeof MOCK_RESULTS.sensoriomotor][])
    .filter(([, d]) => d.total > 0 && (d.alerts / d.total) > 0.3)
    .map(([domain]) => DOMAIN_LABELS[domain]);

  const goodDomains = (Object.entries(MOCK_RESULTS) as [Domain, typeof MOCK_RESULTS.sensoriomotor][])
    .filter(([, d]) => d.total > 0 && (d.alerts / d.total) <= 0.3)
    .map(([domain]) => DOMAIN_LABELS[domain]);

  const interpretiveText = generalScore === 0
    ? `Excelente resultado! ${patient.nome} apresenta desenvolvimento dentro dos padrões esperados para sua faixa etária.`
    : `Após a análise e avaliação do(a) profissional ${patient.profissionalNome ?? "—"}, ${patient.nome} apresenta indicadores ${level.label} observados. ${alertDomains.length > 0 ? `Os domínios que merecem maior atenção são ${alertDomains.join(", ")}, onde foram identificados sinais de alerta.` : ""} ${goodDomains.length > 0 ? `Nas áreas de ${goodDomains.join(", ")}, a criança apresenta ótimo desempenho.` : ""} Recomenda-se ${generalScore > 60 ? "encaminhamento urgente para avaliação especializada" : generalScore > 30 ? "avaliação especializada" : "observação e acompanhamento"} especialmente nos domínios destacados.`;

  return (
    <Layout title="Relatório de Triagem">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:underline mb-4 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border border-border p-6 card-shadow">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <img src={logo} alt="INQ" className="h-12" />
            <div className="text-right text-sm text-muted-foreground">
              <p>Paciente: <span className="font-medium text-foreground">{patient.nome}</span></p>
              <p>Nascimento: {new Date(patient.dataNascimento).toLocaleDateString("pt-BR")} ({age.label})</p>
              <p>Profissional: {patient.profissionalNome ?? "—"}</p>
              <p>Data da triagem: {new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-4 mb-2">Relatório de Triagem Neurodivergente</h2>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">⚠️ Este relatório é resultado de uma triagem preliminar e NÃO constitui diagnóstico clínico. Encaminhe para avaliação especializada.</p>
          </div>
        </div>

        {/* Interpretive text */}
        <div className="bg-card rounded-lg border border-border p-6 card-shadow">
          <p className="text-sm text-muted-foreground italic leading-relaxed">{interpretiveText}</p>
        </div>

        {/* Gauge + Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border border-border p-6 card-shadow text-center">
            <h3 className="font-semibold text-foreground mb-4">Indicador Geral</h3>
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                <circle
                  cx="50" cy="50" r="40"
                  stroke={level.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(generalScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: level.color }}>{Math.round(generalScore)}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Indicadores <strong>{level.label}</strong> observados</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 card-shadow">
            <h3 className="font-semibold text-foreground mb-4">Perfil por Domínio</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                <Radar dataKey="score" stroke="#2D6A2D" fill="#7CB87C" fillOpacity={0.4} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.entries(MOCK_RESULTS) as [Domain, typeof MOCK_RESULTS.sensoriomotor][]).map(([domain, data]) => {
            if (data.total === 0) return null;
            const score = (data.alerts / data.total) * 100;
            const dl = getLevel(score);
            return (
              <div key={domain} className="bg-card rounded-lg border border-border p-5 card-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{DOMAIN_ICONS[domain]}</span>
                    <h4 className="font-semibold text-sm text-foreground">{DOMAIN_LABELS[domain]}</h4>
                  </div>
                  <span className="text-sm font-bold" style={{ color: dl.color }}>{Math.round(score)}%</span>
                </div>
                <Progress value={score} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {data.alerts === 0
                    ? "Este domínio apresenta desenvolvimento adequado."
                    : score > 30
                    ? "Este domínio apresenta indicadores relevantes que recomendam avaliação especializada."
                    : `Neste domínio foram observados ${data.alerts} indicador(es) de atenção.`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>← Voltar</Button>
          <div className="flex gap-3">
            <Button variant="outline" className="border-primary text-primary"><Share2 className="h-4 w-4 mr-2" />Compartilhar</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover"><FileDown className="h-4 w-4 mr-2" />Exportar PDF</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
