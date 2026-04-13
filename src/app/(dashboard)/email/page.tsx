"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Send, Sparkles, Clock, CheckCheck, Eye, Plus, ChevronRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SEQUENCES = [
  {
    id: 1, name: "Introducción Fría", status: "active", leads: 12, sent: 34, opened: 21, replied: 5,
    steps: ["Email inicial", "Follow-up día 3", "Follow-up día 7", "Cierre día 14"],
  },
  {
    id: 2, name: "Post-Demo Follow-up", status: "active", leads: 4, sent: 8, opened: 7, replied: 3,
    steps: ["Resumen demo", "Propuesta", "Urgencia"],
  },
  {
    id: 3, name: "Re-engagement 90 días", status: "paused", leads: 8, sent: 16, opened: 9, replied: 1,
    steps: ["Reconexión", "Caso de éxito", "Oferta especial"],
  },
];

const AI_TEMPLATES = [
  { label: "Email frío B2B",          prompt: "Email frío B2B" },
  { label: "Follow-up post llamada",   prompt: "Follow-up post llamada" },
  { label: "Propuesta de valor",       prompt: "Propuesta de valor" },
  { label: "Re-activar lead frío",     prompt: "Re-activar lead frío" },
];

interface Deal {
  id: string;
  name: string;
  company: string;
  stage: string;
  lead?: { name?: string; company?: string; email?: string };
}

export default function EmailPage() {
  const [activeTab, setActiveTab] = useState("sequences");
  const [isGenerating, setIsGenerating]     = useState(false);
  const [isSending, setIsSending]           = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [subject, setSubject]   = useState("");
  const [toEmail, setToEmail]   = useState("");
  const [deals, setDeals]       = useState<Deal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>("");
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pipeline")
      .then((r) => {
        if (!r.ok) throw new Error("pipeline error");
        return r.json();
      })
      .then((data: Deal[]) => {
        if (!Array.isArray(data)) return;
        setDeals(data.filter((d) => d.stage !== "cerrado"));
      })
      .catch(console.error);
  }, []);

  // Auto-fill "Para" when a deal is selected
  const handleDealSelect = (dealId: string | null) => {
    setSelectedDealId(dealId ?? "");
    const deal = deals.find((d) => d.id === dealId);
    if (deal?.lead?.email) setToEmail(deal.lead.email);
  };

  const selectedDeal = deals.find((d) => d.id === selectedDealId);
  const leadName    = selectedDeal?.lead?.name    || selectedDeal?.name    || "";
  const leadCompany = selectedDeal?.lead?.company || selectedDeal?.company || "";

  const generateEmail = async (template: string) => {
    setSelectedTemplate(template);
    setIsGenerating(true);
    setGenerateError(null);
    setUpgradeRequired(false);
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          leadName,
          leadCompany,
          leadCategory: "",
        }),
      });

      if (res.status === 402) { setUpgradeRequired(true); return; }
      if (!res.ok) throw new Error("Error generando email");

      const data = await res.json();
      setGeneratedEmail(data.body || "");
      if (data.subject && !subject) setSubject(data.subject);
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsGenerating(false);
    }
  };

  const useThisEmail = () => {
    setActiveTab("compose");
  };

  const sendEmail = async () => {
    if (!toEmail || !subject || !generatedEmail) return;
    setIsSending(true);
    setSendStatus("idle");
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toEmail,
          subject,
          body: generatedEmail,
          leadId: selectedDeal?.lead ? selectedDealId : null,
        }),
      });
      if (!res.ok) throw new Error("Error enviando");
      setSendStatus("success");
      setTimeout(() => setSendStatus("idle"), 3000);
    } catch {
      setSendStatus("error");
      setTimeout(() => setSendStatus("idle"), 3000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Email Outreach AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Genera y envía emails personalizados con IA</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />Nueva Secuencia
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="sequences">Secuencias</TabsTrigger>
          <TabsTrigger value="compose">Redactar con AI</TabsTrigger>
        </TabsList>

        {/* Sequences Tab */}
        <TabsContent value="sequences" className="space-y-4 mt-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Secuencias Activas", value: "2",  icon: Mail,       color: "text-primary" },
              { label: "Emails Enviados",    value: "58", icon: Send,       color: "text-blue-400" },
              { label: "Tasa Apertura",      value: "64%",icon: Eye,        color: "text-violet-400" },
              { label: "Respuestas",         value: "9",  icon: CheckCheck, color: "text-emerald-400" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-3">
            {SEQUENCES.map((seq) => (
              <Card key={seq.id} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{seq.name}</h3>
                        <Badge
                          variant="secondary"
                          className={seq.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-0 text-xs" : "bg-muted text-muted-foreground text-xs"}
                        >
                          {seq.status === "active" ? "Activa" : "Pausada"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {seq.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{step}</span>
                            {i < seq.steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-center">
                      <div><p className="text-sm font-semibold text-foreground">{seq.sent}</p><p className="text-[10px] text-muted-foreground">Enviados</p></div>
                      <div><p className="text-sm font-semibold text-violet-400">{seq.opened}</p><p className="text-[10px] text-muted-foreground">Abiertos</p></div>
                      <div><p className="text-sm font-semibold text-emerald-400">{seq.replied}</p><p className="text-[10px] text-muted-foreground">Respondieron</p></div>
                      <Button variant="ghost" size="sm" className="text-xs">Ver</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compose Tab */}
        <TabsContent value="compose" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* AI Generator */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Generar con AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Deal selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Personalizar para (opcional)</Label>
                  <Select value={selectedDealId} onValueChange={handleDealSelect}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Selecciona un lead del pipeline..." />
                    </SelectTrigger>
                    <SelectContent>
                      {deals.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.lead?.name || d.name} — {d.lead?.company || d.company}
                        </SelectItem>
                      ))}
                      {deals.length === 0 && (
                        <SelectItem value="__empty__" disabled>Sin deals en pipeline</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />
                <p className="text-xs text-muted-foreground">Elige el tipo de email:</p>
                <div className="grid grid-cols-2 gap-2">
                  {AI_TEMPLATES.map((t) => (
                    <Button
                      key={t.label}
                      variant="outline"
                      size="sm"
                      className={`text-xs text-left h-auto py-2 px-3 justify-start ${selectedTemplate === t.label ? "border-primary text-primary" : ""}`}
                      onClick={() => generateEmail(t.label)}
                      disabled={isGenerating}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>

                {upgradeRequired && (
                  <div className="rounded-lg bg-amber-400/10 border border-amber-400/20 p-3 text-xs text-amber-400">
                    Esta función requiere plan Pro o Agencia.{" "}
                    <a href="/pricing" className="underline font-semibold">Ver planes →</a>
                  </div>
                )}

                {generateError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {generateError}
                  </div>
                )}

                <Separator />
                {isGenerating ? (
                  <div className="flex items-center gap-2 py-4 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Generando con AI...</p>
                  </div>
                ) : generatedEmail ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Email generado:</p>
                    <Textarea
                      value={generatedEmail}
                      onChange={(e) => setGeneratedEmail(e.target.value)}
                      className="text-xs min-h-[200px] font-mono"
                    />
                    <Button size="sm" className="w-full text-xs" onClick={useThisEmail}>
                      <Send className="h-3.5 w-3.5 mr-2" />Usar este email →
                    </Button>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Sparkles className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Selecciona una plantilla para generar</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compose form */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Enviar Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Para</Label>
                  <Input
                    placeholder="email@empresa.com"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Asunto</Label>
                  <Input
                    placeholder="Asunto del email"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mensaje</Label>
                  <Textarea
                    placeholder="Escribe tu email aquí o genera uno con AI..."
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                    className="text-sm min-h-[200px]"
                  />
                </div>

                {sendStatus === "success" && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Email enviado correctamente
                  </div>
                )}
                {sendStatus === "error" && (
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" /> Error al enviar. Intenta de nuevo.
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1 text-sm"
                    onClick={sendEmail}
                    disabled={isSending || !toEmail || !subject || !generatedEmail}
                  >
                    {isSending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</>
                    ) : (
                      <><Send className="h-4 w-4 mr-2" />Enviar Ahora</>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" title="Programar">
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
