"use client";

import { useState } from "react";
import {
  Search, MapPin, Building2, User, Plus, Loader2, Globe, Phone, Mail, Star,
  Filter, CheckCircle2, AlertCircle, TrendingUp, Zap, Users, AtSign, Link,
  MessageCircle, Clock, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Lead {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  hours: string;
  description: string;
  priceLevel: string;
  mapsUrl: string;
  rating: number;
  reviews: number;
  hasWebsite: boolean;
  pitch: string;
}

interface SearchMeta {
  totalFound: number;
}

const BUSINESS_CATEGORIES = [
  "Todos", "Restaurante", "Salud", "Retail", "Fitness",
  "Legal", "Educación", "Tecnología", "Construcción", "Belleza",
];

const PEOPLE_CATEGORIES = [
  "Todos", "Médico", "Dentista", "Abogado", "Contador",
  "Arquitecto", "Fotógrafo", "Coach", "Psicólogo", "Agente Inmobiliario",
];

function leadScore(lead: Lead): number {
  let score = 0;
  if (lead.phone)    score += 2;
  if (lead.email)    score += 3;
  if (lead.whatsapp) score += 2;
  if (lead.instagram || lead.facebook) score += 1;
  if (!lead.hasWebsite) score += 2;
  if (lead.rating >= 4.0) score += 1;
  return score;
}

function LeadCard({
  lead,
  isAdded,
  isAdding,
  onAdd,
}: {
  lead: Lead;
  isAdded: boolean;
  isAdding: boolean;
  onAdd: (lead: Lead) => void;
}) {
  return (
    <Card className="border-border/50 transition-colors hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-foreground">{lead.name}</h3>
              {lead.category && <Badge variant="secondary" className="text-xs">{lead.category}</Badge>}
              {(() => {
                const score = leadScore(lead);
                if (score >= 8) return (
                  <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30 border">
                    <TrendingUp className="h-2.5 w-2.5 mr-1" />Caliente
                  </Badge>
                );
                if (score >= 5) return (
                  <Badge className="text-xs bg-amber-500/15 text-amber-400 border-amber-500/30 border">
                    <Zap className="h-2.5 w-2.5 mr-1" />Tibio
                  </Badge>
                );
                return null;
              })()}
              {lead.rating > 0 && (
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs">{lead.rating} ({lead.reviews})</span>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {lead.address && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />{lead.address}
                </span>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <Phone className="h-3 w-3" />{lead.phone}
                </a>
              )}
              {lead.whatsapp && (
                <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline">
                  <MessageCircle className="h-3 w-3" />{lead.whatsapp}
                </a>
              )}
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <Mail className="h-3 w-3" />{lead.email}
                </a>
              )}
              {lead.instagram && (
                <a href={`https://instagram.com/${lead.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-pink-400 hover:underline">
                  <AtSign className="h-3 w-3" />{lead.instagram}
                </a>
              )}
              {lead.facebook && (
                <a href={`https://${lead.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline">
                  <Link className="h-3 w-3" />{lead.facebook}
                </a>
              )}
              {lead.website && (
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <Globe className="h-3 w-3" />{lead.website.replace(/^https?:\/\//,"").split("/")[0]}
                </a>
              )}
              {lead.mapsUrl && (
                <a href={lead.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <ExternalLink className="h-3 w-3" />Maps
                </a>
              )}
            </div>
            {lead.hours && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 shrink-0" />{lead.hours}
              </p>
            )}
            {lead.description && (
              <p className="mt-1.5 text-xs text-muted-foreground/70 line-clamp-2">{lead.description}</p>
            )}
            {lead.pitch && (
              <p className="mt-2 text-xs text-emerald-400/80 italic">{lead.pitch}</p>
            )}
          </div>
          <Button
            size="sm"
            variant={isAdded ? "secondary" : "default"}
            onClick={() => onAdd(lead)}
            disabled={isAdded || isAdding}
            className="shrink-0"
          >
            {isAdding ? (
              <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Guardando...</>
            ) : isAdded ? (
              <><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" />Agregado</>
            ) : (
              <><Plus className="h-3.5 w-3.5 mr-1" />Al Pipeline</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SearchPanel({
  mode,
  queryPlaceholder,
  categories,
}: {
  mode: "negocios" | "personas";
  queryPlaceholder: string;
  categories: string[];
}) {
  const [query, setQuery]               = useState("");
  const [location, setLocation]         = useState("");
  const [category, setCategory]         = useState("Todos");
  const [filterHasEmail,    setFilterHasEmail]   = useState(false);
  const [filterHasPhone,    setFilterHasPhone]   = useState(false);
  const [filterHasWhatsApp, setFilterHasWA]      = useState(false);
  const [sortBy,            setSortBy]           = useState<"score"|"rating"|"reviews"|"default">("score");
  const [isSearching, setIsSearching]   = useState(false);
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [meta, setMeta]                 = useState<SearchMeta | null>(null);
  const [hasSearched, setHasSearched]   = useState(false);
  const [addingId, setAddingId]         = useState<number | null>(null);
  const [addedIds, setAddedIds]         = useState<number[]>([]);
  const [error, setError]               = useState<string | null>(null);
  const [limitError, setLimitError]     = useState<{ message: string; used: number; limit: number } | null>(null);
  const [pipelineLimitError, setPipelineLimitError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query && !location) return;
    setIsSearching(true);
    setError(null);
    setLimitError(null);
    setLeads([]);
    setMeta(null);
    setHasSearched(true);
    setAddedIds([]);

    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (location) params.set("location", location);
      params.set("count", "30");
      params.set("type", mode);
      params.set("all", "true");

      const res = await fetch(`/api/leads/search?${params}`);
      const data = await res.json();

      if (res.status === 402) {
        setLimitError({ message: data.message, used: data.searchesUsed, limit: data.searchesLimit });
        return;
      }
      if (!res.ok) throw new Error(data.error || "Error al buscar");

      setLeads(data.results ?? []);
      setMeta({ totalFound: data.totalFound ?? data.count });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsSearching(false);
    }
  };

  const filtered = leads
    .filter((l) => {
      if (category !== "Todos" && !l.category.toLowerCase().includes(category.toLowerCase())) return false;
      if (filterHasEmail    && !l.email)    return false;
      if (filterHasPhone    && !l.phone)    return false;
      if (filterHasWhatsApp && !l.whatsapp) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating")  return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      if (sortBy === "score")   return leadScore(b) - leadScore(a);
      return 0;
    });

  const addToPipeline = async (lead: Lead) => {
    if (addedIds.includes(lead.id)) return;
    setAddingId(lead.id);
    setError(null);
    setPipelineLimitError(null);

    try {
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          company: lead.name,
          email: lead.email,
          phone: lead.phone,
          website: lead.website,
          address: lead.address,
          category: lead.category,
          rating: lead.rating,
          reviews: lead.reviews,
          source: mode === "personas" ? "scraping_personas" : "scraping",
        }),
      });
      if (!leadRes.ok) throw new Error("Error guardando lead");
      const savedLead = await leadRes.json();

      const dealRes = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: savedLead.id,
          name: lead.name,
          company: lead.name,
          stage: "prospecto",
          value: 0,
        }),
      });

      if (dealRes.status === 402) {
        const err = await dealRes.json();
        setPipelineLimitError(err.message);
        return;
      }
      if (!dealRes.ok) throw new Error("Error creando deal");
      setAddedIds((prev) => [...prev, lead.id]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Errors */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}
      {limitError && (
        <div className="flex items-start justify-between gap-4 bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">{limitError.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{limitError.used}/{limitError.limit} búsquedas usadas</p>
            </div>
          </div>
          <a href="/pricing" className="text-xs font-semibold text-primary whitespace-nowrap hover:underline mt-0.5">Ver planes →</a>
        </div>
      )}
      {pipelineLimitError && (
        <div className="flex items-start justify-between gap-4 bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-foreground flex-1">{pipelineLimitError}</p>
          <a href="/pricing" className="text-xs font-semibold text-primary whitespace-nowrap hover:underline">Ver planes →</a>
        </div>
      )}

      {/* Search bar */}
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              {mode === "negocios"
                ? <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                : <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              }
              <Input
                placeholder={queryPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ciudad o zona (ej: Bogotá, CDMX...)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isSearching || (!query && !location)} className="shrink-0">
              {isSearching
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Buscando...</>
                : <><Search className="h-4 w-4 mr-2" />Buscar</>
              }
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { label: "Tiene Email",     active: filterHasEmail,    set: setFilterHasEmail },
              { label: "Tiene Teléfono",  active: filterHasPhone,    set: setFilterHasPhone },
              { label: "Tiene WhatsApp",  active: filterHasWhatsApp, set: setFilterHasWA },
            ].map(({ label, active, set }) => (
              <button
                key={label}
                onClick={() => set(!active)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-border"
                }`}
              >
                {label}
              </button>
            ))}
            <Select value={sortBy} onValueChange={(v) => v && setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="h-7 text-xs w-40 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Mas completo primero</SelectItem>
                <SelectItem value="rating">Mayor rating</SelectItem>
                <SelectItem value="reviews">Mas resenas</SelectItem>
                <SelectItem value="default">Orden original</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {hasSearched && meta && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Encontrados",  value: meta.totalFound, color: "text-emerald-400", sub: "en total" },
            { label: "Mostrando",    value: filtered.length,     color: "text-primary",     sub: "resultados" },
            { label: "Al Pipeline",  value: addedIds.length,     color: "text-blue-400",    sub: "agregados" },
          ].map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty / loading states */}
      {!hasSearched && (
        <div className="text-center py-16">
          {mode === "negocios"
            ? <TrendingUp className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            : <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          }
          <p className="text-muted-foreground text-sm">
            {mode === "negocios"
              ? "Busca negocios que necesitan tu servicio"
              : "Busca profesionales y personas para ofrecer tus servicios"}
          </p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            {mode === "negocios"
              ? "Encuentra restaurantes, talleres, clínicas y más con teléfono, email y dirección"
              : "Encuentra médicos, abogados, coaches y más con información de contacto"}
          </p>
        </div>
      )}

      {isSearching && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Buscando en Google Maps y extrayendo contactos...</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Esto puede tomar 15-25 segundos</p>
        </div>
      )}

      {hasSearched && !isSearching && filtered.length === 0 && !error && !limitError && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No se encontraron resultados para esta búsqueda</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Prueba desactivar el filtro o busca en otra zona</p>
        </div>
      )}

      {/* Results */}
      {filtered.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            {filtered.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isAdded={addedIds.includes(lead.id)}
                isAdding={addingId === lead.id}
                onAdd={addToPipeline}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Lead Discovery</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Encuentra negocios y personas que necesitan tus servicios — con teléfono, email y dirección
        </p>
      </div>

      <Tabs defaultValue="negocios">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="negocios" className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" />Negocios
          </TabsTrigger>
          <TabsTrigger value="personas" className="flex items-center gap-2">
            <User className="h-3.5 w-3.5" />Personas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="negocios" className="mt-5">
          <SearchPanel
            mode="negocios"
            queryPlaceholder="Tipo de negocio (ej: restaurante, dentista, taller...)"
            categories={BUSINESS_CATEGORIES}
          />
        </TabsContent>

        <TabsContent value="personas" className="mt-5">
          <SearchPanel
            mode="personas"
            queryPlaceholder="Profesión o nombre (ej: médico, abogado, fotógrafo...)"
            categories={PEOPLE_CATEGORIES}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
