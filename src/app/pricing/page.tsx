"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Zap, Loader2, Building2, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const FEATURES_FREE = [
  "3 busquedas / mes en Google Maps",
  "10 leads por busqueda",
  "15 deals en pipeline",
  "Sin funciones de IA",
  "Sin email outreach",
];

const FEATURES_PRO = [
  "30 busquedas / mes (Google Maps + Paginas Amarillas)",
  "30 leads por busqueda",
  "Pipeline ilimitado",
  "AI completo (Advisor, Call Prep, Email Gen)",
  "300 emails / mes",
  "Export CSV",
  "Soporte por email",
];

const FEATURES_AGENCY = [
  "Busquedas ilimitadas",
  "75 leads por busqueda",
  "Todas las fuentes (Google Maps, directorios, redes)",
  "AI sin limites",
  "Emails ilimitados",
  "Hasta 5 miembros de equipo",
  "Export CSV masivo",
  "Soporte prioritario",
];

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  planKey: "free" | "pro" | "agency";
  highlighted?: boolean;
  badge?: string;
}

function PlanCard({ name, price, period, description, features, planKey, highlighted, badge }: PlanCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelect = async () => {
    if (planKey === "free") {
      router.push("/signup");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      if (res.status === 401) {
        // Not logged in — go to signup first
        router.push(`/signup?plan=${planKey}`);
        return;
      }

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`relative flex flex-col ${highlighted ? "border-primary/60 shadow-lg shadow-primary/10" : "border-border/50"}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground border-0 px-3 py-0.5 text-xs font-semibold">
            {badge}
          </Badge>
        </div>
      )}
      <CardHeader className="pb-4 pt-6 px-6">
        <div className="flex items-center gap-2 mb-3">
          {planKey === "free" && <User className="h-4 w-4 text-muted-foreground" />}
          {planKey === "pro" && <Zap className="h-4 w-4 text-primary" />}
          {planKey === "agency" && <Building2 className="h-4 w-4 text-violet-400" />}
          <span className="font-semibold text-foreground">{name}</span>
        </div>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-4xl font-bold text-foreground">{price}</span>
          {period && <span className="text-muted-foreground text-sm mb-1">{period}</span>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 px-6 pb-6">
        <Button
          className="w-full mb-6"
          variant={highlighted ? "default" : "outline"}
          onClick={handleSelect}
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Redirigiendo...</>
          ) : planKey === "free" ? (
            "Empezar gratis"
          ) : (
            `Elegir ${name}`
          )}
        </Button>
        <ul className="space-y-2.5 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">RuutPilot</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Iniciar sesión</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Empezar gratis</Button>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center pt-16 pb-12 px-4">
        <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
          Precios simples y transparentes
        </Badge>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Cierra más clientes.<br />
          <span className="text-primary">Paga solo cuando funcione.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          RuutPilot te ayuda a encontrar, contactar y cerrar negocios locales que necesitan presencia digital.
          Si cierras un solo cliente extra, la app se paga 10x.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <PlanCard
            name="Free"
            price="$0"
            period=""
            description="Para explorar la herramienta sin compromiso."
            features={FEATURES_FREE}
            planKey="free"
          />
          <PlanCard
            name="Pro"
            price="$29"
            period="/mes"
            description="Para freelancers que quieren cerrar más clientes cada mes."
            features={FEATURES_PRO}
            planKey="pro"
            highlighted
            badge="Más popular"
          />
          <PlanCard
            name="Agencia"
            price="$69"
            period="/mes"
            description="Para equipos que manejan múltiples clientes y cuentas."
            features={FEATURES_AGENCY}
            planKey="agency"
          />
        </div>

        {/* FAQ / trust */}
        <div className="mt-16 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            ✓ Cancela cuando quieras &nbsp;·&nbsp; ✓ Sin contratos &nbsp;·&nbsp; ✓ Pago seguro con Stripe
          </p>
          <p className="text-sm text-muted-foreground">
            ¿Preguntas? Escríbenos a{" "}
            <a href="mailto:hola@ruutdev.com" className="text-primary underline underline-offset-2">
              hola@ruutdev.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
