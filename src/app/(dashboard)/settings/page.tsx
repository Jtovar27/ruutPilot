"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2, User, Briefcase, DollarSign, Globe, CreditCard, Zap, ExternalLink, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const SERVICE_TYPES = [
  { value: "web_dev",       label: "Desarrollo Web" },
  { value: "social_media",  label: "Social Media / Community Manager" },
  { value: "seo",           label: "SEO / Posicionamiento" },
  { value: "marketing",     label: "Marketing Digital" },
  { value: "design",        label: "Diseño Gráfico / Branding" },
  { value: "copywriting",   label: "Copywriting / Contenido" },
  { value: "ads",           label: "Publicidad Pagada (Meta / Google Ads)" },
  { value: "other",         label: "Otro" },
];

const CURRENCIES = [
  { value: "USD", label: "USD — Dólar" },
  { value: "COP", label: "COP — Peso colombiano" },
  { value: "MXN", label: "MXN — Peso mexicano" },
  { value: "ARS", label: "ARS — Peso argentino" },
  { value: "CLP", label: "CLP — Peso chileno" },
  { value: "PEN", label: "PEN — Sol peruano" },
];

interface Settings {
  email?: string;
  business_name?: string;
  service_type?: string;
  price_per_project?: string;
  currency?: string;
  target_country?: string;
}

interface Subscription {
  plan: string;
  status: string;
  periodEnd: string | null;
  hasCustomer: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [sub, setSub]           = useState<Subscription | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/subscription").then((r) => r.json()),
    ])
      .then(([s, subscription]) => {
        setSettings(s);
        setSub(subscription);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name:     settings.business_name,
          service_type:      settings.service_type,
          price_per_project: settings.price_per_project,
          currency:          settings.currency,
          target_country:    settings.target_country,
        }),
      });
      if (!res.ok) throw new Error("Error guardando configuración");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // ignore
    } finally {
      setPortalLoading(false);
    }
  };

  const field = (key: keyof Settings) => ({
    value: settings[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setSettings((prev) => ({ ...prev, [key]: e.target.value })),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const plan = sub?.plan ?? "free";
  const isPaid = plan === "pro" || plan === "agency";
  const periodEndFormatted = sub?.periodEnd
    ? new Date(sub.periodEnd).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const planBadgeClass =
    plan === "agency"
      ? "bg-gradient-to-r from-teal-500/20 to-violet-500/20 border border-teal-500/30 text-teal-400"
      : plan === "pro"
      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400"
      : "bg-white/[0.06] border border-white/[0.10] text-zinc-400";

  const planLabel = plan === "agency" ? "Agencia" : plan === "pro" ? "Pro" : "Free";

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Configuración</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Este perfil personaliza el AI Advisor y el Lead Discovery para tu negocio
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Billing */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-zinc-400" />
          <p className="text-base font-semibold text-white">Suscripción</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${planBadgeClass}`}>
                {planLabel}
              </span>
              {sub?.status === "active" && (
                <span className="text-xs text-emerald-400">Activo</span>
              )}
              {sub?.status === "past_due" && (
                <span className="text-xs text-amber-400">Pago pendiente</span>
              )}
              {sub?.status === "canceled" && (
                <span className="text-xs text-red-400">Cancelado</span>
              )}
            </div>
            {periodEndFormatted && (
              <p className="text-xs text-zinc-500">
                {sub?.status === "canceled" ? "Vence el" : "Renueva el"} {periodEndFormatted}
              </p>
            )}
            {!isPaid && (
              <p className="text-xs text-zinc-500">
                5 búsquedas / mes · 10 deals · Sin IA
              </p>
            )}
          </div>

          {isPaid ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePortal}
              disabled={portalLoading}
              className="gap-1.5 border-white/[0.10] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07] hover:text-white transition-all duration-150"
            >
              {portalLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ExternalLink className="h-3.5 w-3.5" />
              )}
              Gestionar
            </Button>
          ) : (
            <Link href="/pricing">
              <Button size="sm" className="gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 transition-opacity border-0">
                <Zap className="h-3.5 w-3.5" />
                Upgrade
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>

        {!isPaid && (
          <div className="mt-4 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 p-3">
            <p className="text-xs text-zinc-400">
              <span className="text-emerald-400 font-semibold">Pro ($29/mes)</span> incluye búsquedas ilimitadas, pipeline ilimitado, Business Advisor AI y Call Prep AI.
            </p>
          </div>
        )}
      </div>

      {/* Account */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-zinc-400" />
          <p className="text-base font-semibold text-white">Cuenta</p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-zinc-400 mb-1.5">Email</Label>
          <Input
            value={settings.email ?? ""}
            disabled
            className="bg-white/[0.05] border border-white/[0.10] rounded-lg text-zinc-500 focus:border-emerald-500/50 focus:ring-0 transition-colors"
          />
        </div>
      </div>

      {/* Business profile */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-4 w-4 text-zinc-400" />
          <p className="text-base font-semibold text-white">Perfil de Negocio</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="business_name" className="text-sm text-zinc-400 mb-1.5">Nombre de tu agencia / freelance</Label>
            <Input
              id="business_name"
              placeholder="ej: RuutDev, Studio X..."
              {...field("business_name")}
              className="bg-white/[0.05] border border-white/[0.10] rounded-lg text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-0 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-zinc-400 mb-1.5">Tipo de servicio que ofreces</Label>
            <Select
              value={settings.service_type ?? ""}
              onValueChange={(v) => setSettings((p) => ({ ...p, service_type: v ?? undefined }))}
            >
              <SelectTrigger className="bg-white/[0.05] border border-white/[0.10] rounded-lg text-white focus:border-emerald-500/50 focus:ring-0 transition-colors">
                <SelectValue placeholder="Selecciona tu servicio principal..." />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-zinc-500">
              Esto determina qué tipo de leads son más valiosos para ti
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="target_country" className="text-sm text-zinc-400 mb-1.5">País o mercado objetivo</Label>
            <Input
              id="target_country"
              placeholder="ej: Colombia, México, USA..."
              {...field("target_country")}
              className="bg-white/[0.05] border border-white/[0.10] rounded-lg text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-0 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-zinc-400" />
          <p className="text-base font-semibold text-white">Precios</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-sm text-zinc-400 mb-1.5">Precio promedio por proyecto</Label>
              <Input
                id="price"
                type="number"
                placeholder="ej: 1500"
                {...field("price_per_project")}
                className="bg-white/[0.05] border border-white/[0.10] rounded-lg text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-0 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-zinc-400 mb-1.5">Moneda</Label>
              <Select
                value={settings.currency ?? "USD"}
                onValueChange={(v) => setSettings((p) => ({ ...p, currency: v ?? undefined }))}
              >
                <SelectTrigger className="bg-white/[0.05] border border-white/[0.10] rounded-lg text-white focus:border-emerald-500/50 focus:ring-0 transition-colors">
                  <Globe className="h-3.5 w-3.5 mr-2 text-zinc-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            El AI Advisor usa esto para calcular el valor estimado de oportunidades en tu pipeline
          </p>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 transition-opacity border-0 shadow-[0_0_16px_rgba(52,211,153,0.12)]"
      >
        {saving ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</>
        ) : saved ? (
          <><CheckCircle2 className="h-4 w-4 mr-2" />Guardado</>
        ) : (
          <><Save className="h-4 w-4 mr-2" />Guardar cambios</>
        )}
      </Button>
    </div>
  );
}
