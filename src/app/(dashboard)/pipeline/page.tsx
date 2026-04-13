"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreHorizontal, Plus, Phone, Mail, DollarSign, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Stage = "prospecto" | "contactado" | "propuesta" | "negociacion" | "cerrado";

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: Stage;
  created_at: string;
  lead?: { name: string; company: string; email: string; phone: string } | null;
}

const STAGES: { key: Stage; label: string; accent: string; headerBorder: string }[] = [
  { key: "prospecto",   label: "Prospecto",   accent: "text-zinc-300",   headerBorder: "border-l-2 border-zinc-500"   },
  { key: "contactado",  label: "Contactado",  accent: "text-blue-300",   headerBorder: "border-l-2 border-blue-400"   },
  { key: "propuesta",   label: "Propuesta",   accent: "text-violet-300", headerBorder: "border-l-2 border-violet-400" },
  { key: "negociacion", label: "Negociación", accent: "text-amber-300",  headerBorder: "border-l-2 border-amber-400"  },
  { key: "cerrado",     label: "Cerrado",     accent: "text-emerald-300",headerBorder: "border-l-2 border-emerald-400"},
];

const AVATAR_COLORS = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-pink-500","bg-amber-500","bg-cyan-500"];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pipeline");
      if (!res.ok) throw new Error("Error cargando deals");
      setDeals(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  const moveStage = async (dealId: string, newStage: Stage) => {
    setMovingId(dealId);
    setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, stage: newStage } : d));
    try {
      const res = await fetch(`/api/pipeline/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) throw new Error("Error actualizando etapa");
    } catch {
      fetchDeals();
    } finally {
      setMovingId(null);
    }
  };

  const getByStage = (stage: Stage) => deals.filter((d) => d.stage === stage);
  const totalValue = deals.filter(d => d.stage === "cerrado").reduce((a, d) => a + (d.value || 0), 0);
  const pipelineValue = deals.filter(d => d.stage !== "cerrado").reduce((a, d) => a + (d.value || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Pipeline CRM</h1>
          <p className="text-sm text-zinc-400 mt-1">Trackea el estado de cada prospecto</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchDeals} disabled={loading} className="border-white/[0.10] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07] hover:text-white transition-all duration-150">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.06] transition-all duration-150 backdrop-blur-sm">
          <p className="text-sm text-zinc-400">Total Deals</p>
          <p className="text-3xl font-bold text-white mt-1">{deals.length}</p>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.06] transition-all duration-150 backdrop-blur-sm">
          <p className="text-sm text-zinc-400">En Pipeline</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">${pipelineValue.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.06] transition-all duration-150 backdrop-blur-sm">
          <p className="text-sm text-zinc-400">Cerrado</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">${totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Kanban */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
          <span className="ml-2 text-sm text-zinc-400">Cargando pipeline...</span>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-3 overflow-x-auto min-h-[400px]">
          {STAGES.map((stage) => {
            const stageDeals = getByStage(stage.key);
            const stageValue = stageDeals.reduce((a, d) => a + (d.value || 0), 0);
            return (
              <div key={stage.key} className="flex flex-col gap-3 min-w-[200px]">
                {/* Column header */}
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] ${stage.headerBorder}`}>
                  <div>
                    <p className={`text-sm font-semibold ${stage.accent}`}>{stage.label}</p>
                    {stageValue > 0 && <p className="text-[10px] text-zinc-500">${stageValue.toLocaleString()}</p>}
                  </div>
                  <span className="bg-white/[0.08] text-zinc-300 text-xs px-2 py-0.5 rounded-full font-medium">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  {stageDeals.length === 0 && (
                    <div className="flex-1 border border-dashed border-white/[0.06] rounded-xl flex items-center justify-center py-8">
                      <p className="text-[11px] text-zinc-600">Sin deals</p>
                    </div>
                  )}
                  {stageDeals.map((deal, i) => (
                    <div
                      key={deal.id}
                      className={`bg-white/[0.05] border border-white/[0.08] rounded-xl p-3.5 hover:bg-white/[0.08] hover:border-white/[0.14] hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-150 cursor-grab active:cursor-grabbing ${movingId === deal.id ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className={`${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white text-[10px]`}>
                              {initials(deal.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">{deal.name}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{deal.company}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-6 w-6 shrink-0 inline-flex items-center justify-center rounded hover:bg-white/[0.08] transition-colors text-zinc-500 hover:text-white">
                            <MoreHorizontal className="h-3 w-3" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <p className="text-xs text-zinc-500 px-2 py-1">Mover a...</p>
                            {STAGES.filter(s => s.key !== stage.key).map(s => (
                              <DropdownMenuItem key={s.key} onClick={() => moveStage(deal.id, s.key)} className="text-xs">
                                <ChevronRight className="h-3 w-3 mr-1" />{s.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {deal.value > 0 && (
                        <div className="mt-2 flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold text-sm">{deal.value.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="mt-2 flex gap-1">
                        {deal.lead?.phone && <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white"><Phone className="h-3 w-3" /></Button>}
                        {deal.lead?.email && <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-white"><Mail className="h-3 w-3" /></Button>}
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full border border-dashed border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] text-xs h-8 transition-all duration-150">
                    <Plus className="h-3 w-3 mr-1" />Agregar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
