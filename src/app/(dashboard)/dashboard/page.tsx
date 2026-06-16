"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DollarSign, Users, Target, Mail, BarChart2, Loader2, Zap, ArrowRight, Search, Kanban, Settings, CheckCircle2, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const revenueData = [
  { mes: "Nov", revenue: 3200, meta: 4000 },
  { mes: "Dic", revenue: 4100, meta: 4000 },
  { mes: "Ene", revenue: 3800, meta: 4500 },
  { mes: "Feb", revenue: 5200, meta: 4500 },
  { mes: "Mar", revenue: 4900, meta: 5000 },
  { mes: "Abr", revenue: 6100, meta: 5000 },
];

const sourceData = [
  { name: "Lead Discovery", value: 45, color: "oklch(0.6 0.24 264)" },
  { name: "Referidos", value: 28, color: "oklch(0.65 0.18 180)" },
  { name: "LinkedIn", value: 17, color: "oklch(0.7 0.2 130)" },
  { name: "Otros", value: 10, color: "oklch(0.65 0 0)" },
];

const STAGE_LABELS: Record<string, string> = {
  prospecto: "Prospectos",
  contactado: "Contactados",
  propuesta: "Propuestas",
  negociacion: "Negociación",
  cerrado: "Cerrados",
};

interface DashboardData {
  closedRevenue: number;
  pipelineValue: number;
  totalLeads: number;
  totalDeals: number;
  closedDeals: number;
  emailsSent: number;
  openRate: number;
  stageCounts: Record<string, number>;
}

function MetaProgress({ label, current, goal }: { label: string; current: number; goal: number }) {
  const pct = Math.min(Math.round((current / Math.max(goal, 1)) * 100), 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-medium text-white">{current} / {goal}</span>
      </div>
      <Progress value={pct} className="h-1.5" />
      <p className="text-xs text-zinc-500 text-right">{pct}% completado</p>
    </div>
  );
}

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissedUpgradeBanner, setDismissedUpgradeBanner] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const upgraded = searchParams.get("upgraded") === "1";
  const showUpgradeBanner = upgraded && !dismissedUpgradeBanner;

  useEffect(() => {
    if (upgraded) {
      router.replace("/dashboard", { scroll: false });
    }
  }, [upgraded, router]);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = data
    ? [
        { label: "Revenue Cerrado", value: `$${data.closedRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", sub: data.pipelineValue > 0 ? `+$${data.pipelineValue.toLocaleString()} en pipeline` : null, subColor: "text-emerald-400" },
        { label: "Total Leads", value: String(data.totalLeads), icon: Users, color: "text-blue-400", sub: null, subColor: "" },
        { label: "Deals Cerrados", value: String(data.closedDeals), icon: Target, color: "text-violet-400", sub: null, subColor: "" },
        { label: "Emails Enviados", value: String(data.emailsSent), icon: Mail, color: "text-amber-400", sub: `${data.openRate}% tasa de apertura`, subColor: "text-zinc-500" },
      ]
    : [];

  const funnelData = data
    ? Object.entries(STAGE_LABELS).map(([key, label]) => ({
        stage: label,
        count: data.stageCounts[key] || 0,
      }))
    : [];

  const isEmpty = !loading && data && data.totalLeads === 0 && data.totalDeals === 0;

  const ONBOARDING_STEPS = [
    {
      icon: Settings,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      title: "Configura tu perfil",
      desc: "Dile al AI qué servicio ofreces y cuánto cobras",
      href: "/settings",
      cta: "Configurar",
    },
    {
      icon: Search,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      title: "Encuentra tu primer lead",
      desc: "Busca negocios sin website en tu ciudad",
      href: "/leads",
      cta: "Buscar leads",
    },
    {
      icon: Kanban,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      title: "Agrega un deal al pipeline",
      desc: "Trackea tus prospectos y cierra más contratos",
      href: "/pipeline",
      cta: "Ver pipeline",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Revenue Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Métricas reales de tu negocio</p>
      </div>

      {/* Banner de upgrade exitoso */}
      {showUpgradeBanner && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-white">
              Bienvenido a Pro — todas las funciones están desbloqueadas.
            </p>
          </div>
          <button onClick={() => setDismissedUpgradeBanner(true)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Onboarding banner */}
      {isEmpty && (
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-semibold text-white">Empieza en 3 pasos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ONBOARDING_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <a
                  key={step.href}
                  href={step.href}
                  className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 hover:bg-white/[0.07] hover:border-emerald-500/30 transition-all duration-150"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md ${step.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-3.5 w-3.5 ${step.color}`} />
                    </div>
                    <span className="text-xs font-medium text-zinc-500">Paso {i + 1}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="text-xs text-zinc-400">{step.desc}</p>
                  <span className={`text-xs font-semibold ${step.color} flex items-center gap-1 mt-auto`}>
                    {step.cta} <ArrowRight className="h-3 w-3" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.06] transition-all duration-150 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-zinc-400">{kpi.label}</p>
                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-white">{kpi.value}</p>
                  {kpi.sub && (
                    <p className={`text-xs mt-1.5 ${kpi.subColor}`}>{kpi.sub}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Revenue Chart */}
            <div className="col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-semibold text-white">Revenue vs Meta</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.6 0.24 264)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.6 0.24 264)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: "#0d0d10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`$${v}`, ""]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.6 0.24 264)" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                  <Area type="monotone" dataKey="meta" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Meta" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Metas */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-semibold text-white">Progreso Real</p>
              </div>
              <div className="space-y-4">
                <MetaProgress label="Leads captados" current={data?.totalLeads ?? 0} goal={60} />
                <MetaProgress label="Deals activos" current={data?.totalDeals ?? 0} goal={20} />
                <MetaProgress label="Deals cerrados" current={data?.closedDeals ?? 0} goal={10} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Funnel real */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white mb-4">Funnel de Conversión</p>
              {funnelData.every((d) => d.count === 0) ? (
                <p className="text-sm text-zinc-500 text-center py-8">Sin deals en pipeline todavía</p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={funnelData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ background: "#0d0d10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="oklch(0.6 0.24 264)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Source */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white mb-4">Fuente de Leads</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                      {sourceData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {sourceData.map((s) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-xs text-zinc-400 flex-1">{s.name}</span>
                      <span className="text-xs font-medium text-white">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
