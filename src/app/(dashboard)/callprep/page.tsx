"use client";

import { useState, useEffect } from "react";
import { Phone, Loader2, User, Building2, Clock, Star, MessageSquare, Target, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Deal {
  id: string;
  name: string;
  company: string;
  stage: string;
  value: number;
  lead?: { name?: string; company?: string };
}

interface Briefing {
  summary: string;
  callGoal: string;
  objections: string[];
  talkingPoints: string[];
  openQuestions: string[];
  leadName: string;
  leadCompany: string;
  stage: string;
  value: number;
  daysSince: number;
}

const STAGE_COLORS: Record<string, string> = {
  prospecto: "bg-gray-500/20 text-gray-400",
  contactado: "bg-blue-500/20 text-blue-400",
  propuesta: "bg-violet-500/20 text-violet-400",
  negociacion: "bg-amber-500/20 text-amber-400",
  cerrado: "bg-emerald-500/20 text-emerald-400",
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export default function CallPrepPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pipeline")
      .then((r) => {
        if (!r.ok) throw new Error(`Pipeline error: ${r.status}`);
        return r.json();
      })
      .then((data: unknown) => {
        if (!Array.isArray(data)) return;
        setDeals((data as Deal[]).filter((d) => d.stage !== "cerrado"));
      })
      .catch(console.error);
  }, []);

  const generateBriefing = async () => {
    if (!selectedDealId) return;
    setIsGenerating(true);
    setBriefing(null);
    setError(null);
    try {
      const res = await fetch("/api/callprep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal_id: selectedDealId }),
      });
      if (!res.ok) throw new Error("Error generando briefing");
      const data: Briefing = await res.json();
      setBriefing(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedDeal = deals.find((d) => d.id === selectedDealId);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Call Prep</h1>
        <p className="text-sm text-muted-foreground mt-1">Briefing completo antes de cada llamada con IA</p>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Selector */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Select value={selectedDealId ?? ""} onValueChange={(v) => { setSelectedDealId(v); setBriefing(null); }}>
              <SelectTrigger className="flex-1">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder={deals.length === 0 ? "Cargando pipeline..." : "Selecciona un lead del pipeline..."} />
              </SelectTrigger>
              <SelectContent>
                {deals.map((d) => {
                  const name = d.lead?.name || d.name || d.company;
                  const company = d.lead?.company || d.company;
                  return (
                    <SelectItem key={d.id} value={d.id}>
                      <div className="flex items-center gap-2">
                        <span>{name}</span>
                        {company && <span className="text-muted-foreground text-xs">— {company}</span>}
                        <Badge variant="secondary" className="text-xs ml-1">{d.stage}</Badge>
                      </div>
                    </SelectItem>
                  );
                })}
                {deals.length === 0 && (
                  <SelectItem value="__empty__" disabled>No hay deals activos en el pipeline</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button onClick={generateBriefing} disabled={!selectedDealId || isGenerating}>
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Preparando...</>
              ) : (
                <><Phone className="h-4 w-4 mr-2" />Preparar Llamada</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Briefing */}
      {briefing && !isGenerating && (
        <div className="space-y-4">
          {/* Lead Header */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/30 text-primary font-semibold">
                    {initials(briefing.leadName || briefing.leadCompany)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold text-foreground">{briefing.leadName}</h2>
                    <Badge className={`border-0 ${STAGE_COLORS[briefing.stage] || "bg-gray-500/20 text-gray-400"}`}>{briefing.stage}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />{briefing.leadCompany}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />{briefing.daysSince}d en pipeline
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">${briefing.value.toLocaleString()} potencial</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* Context */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />Contexto del Lead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{briefing.summary}</p>
              </CardContent>
            </Card>

            {/* Goal */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />Meta de la Llamada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm text-foreground font-medium">{briefing.callGoal}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Preguntas clave:</p>
                  <div className="space-y-2">
                    {briefing.openQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Objections */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400" />Objeciones Esperadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {briefing.objections.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 bg-amber-400/5 border border-amber-400/20 rounded-lg p-2.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{obj}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Talking Points */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />Talking Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {briefing.talkingPoints.map((tp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{tp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button className="w-full" size="lg">
            <Phone className="h-4 w-4 mr-2" />Iniciar Llamada con {briefing.leadName}
          </Button>
        </div>
      )}

      {!briefing && !isGenerating && (
        <div className="text-center py-16">
          <Phone className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Selecciona un lead para preparar tu llamada</p>
          <p className="text-muted-foreground/60 text-xs mt-1">La IA analiza el historial y te da un briefing completo</p>
        </div>
      )}
    </div>
  );
}
