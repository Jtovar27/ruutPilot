"use client";

import { useState } from "react";
import { Brain, Loader2, ChevronRight, TrendingUp, AlertCircle, Lightbulb, Target, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type Priority = "alta" | "media" | "baja";

interface Action {
  title: string;
  description: string;
  impact: string;
  priority: Priority;
  category: string;
}

interface AnalysisResult {
  summary: string;
  urgentCount: number;
  estimatedValue: number;
  actions: Action[];
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  alta: { label: "Alta", color: "text-red-400", bg: "bg-red-400/10", Icon: AlertCircle },
  media: { label: "Media", color: "text-amber-400", bg: "bg-amber-400/10", Icon: TrendingUp },
  baja: { label: "Baja", color: "text-blue-400", bg: "bg-blue-400/10", Icon: Lightbulb },
};

export default function AdvisorPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [completedTitles, setCompletedTitles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  const analyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    setUpgradeRequired(false);
    try {
      const res = await fetch("/api/advisor", { method: "POST" });
      if (res.status === 402) { setUpgradeRequired(true); return; }
      if (!res.ok) throw new Error("Error al analizar");
      const data: AnalysisResult = await res.json();
      setResult(data);
      setCompletedTitles([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setIsAnswering(true);
    setError(null);
    try {
      const res = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("Error al procesar pregunta");
      const data = await res.json();
      setAnswer(data.answer);
      setQuestion("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsAnswering(false);
    }
  };

  const today = new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Business Advisor AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Tu coach de ventas personalizado con IA</p>
        </div>
        <Button size="sm" variant="outline" onClick={analyze} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analizando...</>
          ) : (
            <><RefreshCw className="h-4 w-4 mr-2" />{result ? "Re-analizar" : "Analizar mi negocio"}</>
          )}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Summary */}
      {result && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Análisis de hoy — {todayCapitalized}</p>
                <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>
                {result.estimatedValue > 0 && (
                  <p className="text-xs text-emerald-400 mt-1 font-medium">
                    ${result.estimatedValue.toLocaleString()} en pipeline activo · {result.urgentCount} acción(es) urgente(s)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {upgradeRequired && (
        <Card className="border-amber-400/30 bg-amber-400/5">
          <CardContent className="p-6 text-center">
            <Brain className="h-10 w-10 text-amber-400/50 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Business Advisor AI requiere plan Pro</p>
            <p className="text-xs text-muted-foreground mb-4">Analiza tu pipeline con IA y recibe acciones prioritarias cada día.</p>
            <a href="/pricing">
              <button className="text-xs font-semibold text-primary border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary/10 transition-colors">
                Ver planes — desde $29/mes →
              </button>
            </a>
          </CardContent>
        </Card>
      )}

      {!result && !isAnalyzing && !upgradeRequired && (
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-8 text-center">
            <Brain className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Haz clic en "Analizar mi negocio" para que la IA revise tu pipeline real y te dé acciones concretas para hoy.</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {result && result.actions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Próximas Acciones Recomendadas</h2>
          {result.actions
            .filter((a) => !completedTitles.includes(a.title))
            .map((action) => {
              const p = PRIORITY_CONFIG[action.priority] ?? PRIORITY_CONFIG.media;
              const Icon = p.Icon;
              return (
                <Card key={action.title} className="border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${p.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${p.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">{action.title}</p>
                          <Badge variant="secondary" className={`text-xs border-0 ${p.bg} ${p.color}`}>{p.label}</Badge>
                          <Badge variant="secondary" className="text-xs">{action.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                        <p className="text-xs text-emerald-400 mt-1 font-medium">{action.impact}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="shrink-0 text-xs" onClick={() => setCompletedTitles((p) => [...p, action.title])}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          {completedTitles.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">{completedTitles.length} acción(es) completada(s) hoy</p>
          )}
        </div>
      )}

      <Separator />

      {/* Chat */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Pregúntale al Advisor</h2>
        {answer && (
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground whitespace-pre-line">{answer}</p>
              </div>
            </CardContent>
          </Card>
        )}
        <Textarea
          placeholder="¿Cómo puedo acelerar mis cierres este mes? ¿En qué lead debo enfocarme?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[80px] text-sm resize-none"
          onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) askQuestion(); }}
        />
        <Button onClick={askQuestion} disabled={isAnswering || !question.trim()} className="w-full">
          {isAnswering ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analizando tu negocio...</>
          ) : (
            <><Send className="h-4 w-4 mr-2" />Preguntar al Advisor</>
          )}
        </Button>
      </div>
    </div>
  );
}
