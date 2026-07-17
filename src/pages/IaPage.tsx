import { useState } from "react";
import Layout from "@/components/Layout";
import { KpiCard } from "@/components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, MessageSquare, Send } from "lucide-react";

const SUGESTOES = [
  "Quais 3 pacientes estão sem evolução há mais de 15 dias?",
  "Compare margem por convênio no último trimestre.",
  "Sugira redistribuição de agenda para reduzir ociosidade na sala Psicologia.",
  "Resuma reclamações recorrentes no CRM de fev/2026.",
];

const HIST = [
  { role: "user", text: "Quais especialidades tiveram maior aumento de no-show em fevereiro?" },
  { role: "ai", text: "Em Fevereiro/2026, as maiores altas de no-show foram:\n• Psicologia — 8.1% (vs 5.4% em Jan) — sugestão: reforço de confirmação 24h antes.\n• Psicopedagogia — 6.9% (vs 5.1%). \nRecomendação: revisar agenda de sextas à tarde (maior concentração)." },
];

export default function IaPage() {
  const [q, setQ] = useState("");
  return (
    <Layout title="IA Institucional">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label="Consultas no mês" value={214} icon={MessageSquare} accent />
          <KpiCard label="Insights gerados" value={38} icon={Sparkles} />
          <KpiCard label="Ações executadas" value={12} icon={Bot} hint="A partir de sugestões" />
          <KpiCard label="Economia estimada" value="R$ 6.8k" icon={Sparkles} hint="Redução glosa + no-show" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="card-shadow lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> Assistente INQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {HIST.map((m,i)=>(
                  <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                      m.role==="user"?"bg-primary text-primary-foreground":"bg-muted"
                    }`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Pergunte sobre a operação, finanças, agenda, pacientes..." className="resize-none min-h-[56px]" />
                <Button className="self-end gap-2"><Send className="h-4 w-4" /> Enviar</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle className="text-base">Sugestões de consulta</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {SUGESTOES.map((s,i)=>(
                <button key={i} onClick={()=>setQ(s)} className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-light/40 transition-colors text-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary inline mr-2" />{s}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
