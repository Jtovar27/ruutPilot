"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, MapPin, Building2, User, Plus, Loader2, Globe, Phone, Mail, Star,
  Filter, CheckCircle2, AlertCircle, TrendingUp, Zap, Users, AtSign, Link,
  MessageCircle, Clock, ExternalLink, ArrowLeft, Sparkles, ChevronRight, Hash, X, Check, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BusinessSetup } from "@/components/onboarding/business-setup";
import { getBusinessProfile, type BusinessProfile } from "@/lib/business-profile";
import { LeadDetail } from "@/components/leads/lead-detail";

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

interface KeywordResult {
  keywords: string[];
  b2bKeywords: string[];
  b2cKeywords: string[];
  businessType: string;
  suggestedCategories: string[];
}

interface KeywordBreakdown {
  keyword: string;
  count: number;
}

interface SavedSearch {
  id: string;
  businessType: string;
  location: string;
  keywords: string[];
  results: Lead[];
  rejectedCategories: string[];
  keywordBreakdown: KeywordBreakdown[];
  status: "running" | "completed";
  totalKeywords: number;
  completedKeywords: number;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const BUSINESS_CATEGORIES = [
  "Todos", "Restaurante", "Salud", "Retail", "Fitness",
  "Legal", "Educación", "Tecnología", "Construcción", "Belleza",
];

const PEOPLE_CATEGORIES = [
  "Todos", "Médico", "Dentista", "Abogado", "Contador",
  "Arquitecto", "Fotógrafo", "Coach", "Psicólogo", "Agente Inmobiliario",
];

const BUSINESS_TYPES = [
  // Healthcare
  "Mobile Phlebotomy", "Phlebotomy", "Home Health Care", "Physical Therapy", "Dental Practice",
  "Chiropractic", "Mental Health Counseling", "Medical Lab Services", "Nursing Services",
  "Veterinary Services", "Optometry", "Pharmacy", "Occupational Therapy", "Speech Therapy",
  "Dermatology", "Podiatry",
  // Home Services
  "Plumbing", "Electrical Services", "HVAC", "Landscaping", "House Cleaning", "Pest Control",
  "Roofing", "Painting", "Moving Services", "Handyman Services", "Garage Door Repair",
  "Pressure Washing", "Pool Cleaning", "Locksmith", "Appliance Repair",
  // Professional
  "Accounting", "Legal Services", "Insurance Agency", "Real Estate", "Financial Planning",
  "Tax Preparation", "Consulting", "Notary Services", "Translation Services",
  // Tech
  "Web Development", "IT Support", "Digital Marketing", "SEO Services",
  "Social Media Management", "App Development", "Cybersecurity", "Graphic Design",
  "Video Production", "Data Analytics",
  // Beauty / Personal
  "Hair Salon", "Barbershop", "Nail Salon", "Spa & Massage", "Personal Training",
  "Photography", "Tattoo Studio", "Makeup Artist", "Lash Extensions", "Skincare",
  // Food
  "Catering", "Food Truck", "Bakery", "Restaurant", "Coffee Shop", "Meal Prep Services",
  "Juice Bar", "Food Delivery",
  // Auto
  "Auto Repair", "Auto Detailing", "Towing Services", "Car Wash", "Tire Shop",
  // Construction
  "General Contractor", "Interior Design", "Architecture", "Flooring",
  "Window Installation", "Fencing", "Concrete Services", "Demolition",
  // Education
  "Tutoring", "Music Lessons", "Dance Studio", "Driving School", "Language School",
  "Test Prep", "Art Classes",
  // Pet
  "Dog Walking", "Pet Grooming", "Pet Sitting", "Dog Training", "Pet Boarding",
  // Events
  "Wedding Planning", "DJ Services", "Event Catering", "Party Rentals",
  "Floral Design", "Event Photography",
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
  onReject,
  onDelete,
  isSelected,
  onToggleSelect,
  onViewDetail,
}: {
  lead: Lead;
  isAdded: boolean;
  isAdding: boolean;
  onAdd: (lead: Lead) => void;
  onReject?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  isSelected?: boolean;
  onToggleSelect?: (lead: Lead) => void;
  onViewDetail?: (lead: Lead) => void;
}) {
  return (
    <Card className="border-border/50 transition-colors hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {onToggleSelect && (
            <button
              onClick={() => onToggleSelect(lead)}
              className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors mt-0.5 ${
                isSelected
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              {isSelected && <Check className="h-3 w-3" />}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {onViewDetail ? (
                <button
                  onClick={() => onViewDetail(lead)}
                  className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors text-left cursor-pointer"
                >
                  {lead.name}
                </button>
              ) : (
                <h3 className="font-medium text-foreground">{lead.name}</h3>
              )}
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
            {/* Action buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  Call
                </a>
              )}
              {lead.whatsapp && (
                <a
                  href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                >
                  <MessageCircle className="h-3 w-3" />
                  WhatsApp
                </a>
              )}
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  Email
                </a>
              )}
              {lead.website && (
                <a
                  href={lead.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/30 hover:bg-zinc-500/20 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  Website
                </a>
              )}
            </div>
            {lead.description && (
              <p className="mt-1.5 text-xs text-muted-foreground/70 line-clamp-2">{lead.description}</p>
            )}
            {lead.pitch && (
              <p className="mt-2 text-xs text-emerald-400/80 italic">{lead.pitch}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(lead)}
                className="shrink-0 text-muted-foreground hover:text-red-400 h-8 w-8 p-0"
                title="Delete this lead"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {onReject && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onReject(lead)}
                className="shrink-0 text-muted-foreground hover:text-red-400 h-8 w-8 p-0"
                title="Reject — hide this type of lead"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
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
        </div>
      </CardContent>
    </Card>
  );
}

const SEARCHES_KEY = "ruutpilot_searches";

function loadSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SEARCHES_KEY) || "[]");
  } catch { return []; }
}

function saveSavedSearches(searches: SavedSearch[]) {
  localStorage.setItem(SEARCHES_KEY, JSON.stringify(searches));
}

function SmartSearchPanel({ profile }: { profile?: BusinessProfile | null }) {
  const [step, setStep] = useState<"setup" | "keywords" | "results">("setup");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Search history (localStorage)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const currentSearchId = useRef<string | null>(null);

  useEffect(() => {
    setSavedSearches(loadSavedSearches());
  }, []);

  const deleteSearch = (id: string) => {
    const updated = loadSavedSearches().filter(s => s.id !== id);
    saveSavedSearches(updated);
    setSavedSearches(updated);
  };

  // Step 1: Setup state — pre-fill from profile if available
  const [businessType, setBusinessType] = useState(profile?.businessType ?? "");
  const [location, setLocation] = useState(profile?.serviceArea ?? "");

  // Autocomplete for business type
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Zip code lookup
  const [zipInfo, setZipInfo] = useState<string | null>(null);
  const [zipError, setZipError] = useState(false);
  const zipFetchRef = useRef<AbortController | null>(null);

  const handleBusinessTypeChange = (value: string) => {
    setBusinessType(value);
    if (value.trim().length > 0) {
      const query = value.toLowerCase();
      const matched = BUSINESS_TYPES.filter((bt) =>
        bt.toLowerCase().includes(query)
      ).slice(0, 8);
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (value: string) => {
    setBusinessType(value);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!/^\d{5}$/.test(location)) {
      setZipInfo(null);
      setZipError(false);
      return;
    }
    if (zipFetchRef.current) zipFetchRef.current.abort();
    const controller = new AbortController();
    zipFetchRef.current = controller;

    fetch(`https://api.zippopotam.us/us/${location}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        const place = data.places?.[0];
        if (place) {
          setZipInfo(`${place["place name"]}, ${place.state}`);
          setZipError(false);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setZipInfo(null);
        setZipError(true);
      });

    return () => controller.abort();
  }, [location]);

  // Step 2: Keywords state
  const [keywordData, setKeywordData] = useState<KeywordResult | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [customKeyword, setCustomKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Step 3: Results state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState({ current: 0, total: 0, currentKeyword: "" });
  const [keywordBreakdown, setKeywordBreakdown] = useState<KeywordBreakdown[]>([]);
  const [totalBeforeDedup, setTotalBeforeDedup] = useState(0);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [pipelineLimitError, setPipelineLimitError] = useState<string | null>(null);

  // Bulk selection
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());

  // Reject filtering
  const [rejectedCategories, setRejectedCategories] = useState<Set<string>>(new Set());
  const [rejectedLeadIds, setRejectedLeadIds] = useState<Set<number>>(new Set());

  const handleReject = (lead: Lead) => {
    if (lead.category) {
      setRejectedCategories((prev) => {
        const next = new Set(prev).add(lead.category);
        // Persist rejected categories to localStorage
        if (currentSearchId.current) {
          const searches = loadSavedSearches();
          const idx = searches.findIndex(s => s.id === currentSearchId.current);
          if (idx !== -1) {
            searches[idx].rejectedCategories = Array.from(next);
            saveSavedSearches(searches);
          }
        }
        return next;
      });
    }
    setRejectedLeadIds((prev) => new Set(prev).add(lead.id));
  };

  const handleDelete = (lead: Lead) => {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));

    // Also update localStorage
    if (currentSearchId.current) {
      const searches = loadSavedSearches();
      const idx = searches.findIndex(s => s.id === currentSearchId.current);
      if (idx !== -1) {
        searches[idx].results = searches[idx].results.filter(l => l.name.toLowerCase() !== lead.name.toLowerCase());
        saveSavedSearches(searches);
      }
    }
  };

  // Plan-based leads limit — Agency=75, Pro=30, Free=10
  const leadsLimit = 75; // Agency plan — will be dynamic based on user plan later

  // Filters and sort for results
  const [filterHasEmail, setFilterHasEmail] = useState(false);
  const [filterHasPhone, setFilterHasPhone] = useState(false);
  const [filterHasWhatsApp, setFilterHasWA] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "rating" | "reviews" | "default">("score");

  const loadSearch = (search: SavedSearch) => {
    setBusinessType(search.businessType);
    setLocation(search.location);
    setLeads(search.results);
    setRejectedCategories(new Set(search.rejectedCategories));
    setKeywordBreakdown(search.keywordBreakdown?.length ? search.keywordBreakdown : search.keywords.map(kw => ({ keyword: kw, count: 0 })));
    setTotalBeforeDedup(search.results.length);
    setStep("results");
    setIsSearching(false);
    currentSearchId.current = search.id;
  };

  const generateKeywords = async () => {
    if (!businessType || !location) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/leads/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, location }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generating keywords");
      setKeywordData(data);
      const allKw = new Set([...(data.b2bKeywords ?? [])]);
      setSelectedKeywords(allKw);
      setStep("keywords");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) next.delete(kw);
      else next.add(kw);
      return next;
    });
  };

  const addCustomKeyword = () => {
    const trimmed = customKeyword.trim();
    if (!trimmed) return;
    if (keywordData) {
      setKeywordData({
        ...keywordData,
        b2bKeywords: [...keywordData.b2bKeywords, trimmed],
      });
    }
    setSelectedKeywords((prev) => new Set(prev).add(trimmed));
    setCustomKeyword("");
  };

  const searchWithKeywords = async () => {
    const keywords = Array.from(selectedKeywords);
    if (keywords.length === 0) return;

    setStep("results");
    setIsSearching(true);
    setError(null);
    setLeads([]);
    setAddedIds(new Set());
    setSelectedLeads(new Set());
    setKeywordBreakdown([]);
    setTotalBeforeDedup(0);

    // Create a localStorage search record
    const searchId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    currentSearchId.current = searchId;
    const newSearch: SavedSearch = {
      id: searchId,
      businessType,
      location,
      keywords,
      results: [],
      rejectedCategories: [],
      keywordBreakdown: [],
      status: "running",
      totalKeywords: keywords.length,
      completedKeywords: 0,
      createdAt: new Date().toISOString(),
    };
    const allSearches = loadSavedSearches();
    allSearches.unshift(newSearch);
    saveSavedSearches(allSearches);
    setSavedSearches(allSearches);

    const seenNames = new Set<string>();
    let totalRaw = 0;
    let idCounter = 1;

    for (let i = 0; i < keywords.length; i++) {
      const kw = keywords[i];
      setSearchProgress({ current: i + 1, total: keywords.length, currentKeyword: kw });

      try {
        const params = new URLSearchParams();
        params.set("q", `${kw} ${location}`);
        params.set("location", location);
        params.set("count", "10");
        params.set("type", "negocios");
        params.set("all", "true");

        const res = await fetch(`/api/leads/search?${params}`);
        const data = await res.json();

        if (res.ok && data.results) {
          totalRaw += data.results.length;
          setTotalBeforeDedup(totalRaw);

          // Deduplicate and add new leads progressively
          const newLeads: Lead[] = [];
          for (const lead of data.results as Lead[]) {
            const key = lead.name.toLowerCase().trim();
            if (!seenNames.has(key)) {
              seenNames.add(key);
              newLeads.push(lead);
            }
          }

          // Assign unique IDs to avoid collisions across keyword searches
          for (const lead of newLeads) {
            lead.id = idCounter++;
          }

          if (newLeads.length > 0) {
            setLeads((prev) => {
              const combined = [...prev, ...newLeads];
              combined.sort((a, b) => leadScore(b) - leadScore(a));
              return combined;
            });
          }

          setKeywordBreakdown((prev) => [...prev, { keyword: kw, count: data.results.length }]);

          // Persist progress to localStorage
          {
            const searches = loadSavedSearches();
            const idx = searches.findIndex(s => s.id === searchId);
            if (idx !== -1) {
              searches[idx].results = [...searches[idx].results, ...newLeads];
              searches[idx].completedKeywords = i + 1;
              searches[idx].keywordBreakdown = [...(searches[idx].keywordBreakdown || []), { keyword: kw, count: data.results.length }];
              saveSavedSearches(searches);
            }
          }
        } else {
          setKeywordBreakdown((prev) => [...prev, { keyword: kw, count: 0 }]);
        }
      } catch {
        setKeywordBreakdown((prev) => [...prev, { keyword: kw, count: 0 }]);
      }
    }

    // Mark search as completed in localStorage
    {
      const searches = loadSavedSearches();
      const idx = searches.findIndex(s => s.id === searchId);
      if (idx !== -1) {
        searches[idx].status = "completed";
        saveSavedSearches(searches);
      }
      setSavedSearches(searches);
    }

    setIsSearching(false);
  };

  const rerunSearch = async () => {
    const keywords = Array.from(selectedKeywords);
    if (keywords.length === 0) return;

    setIsSearching(true);

    // Get existing lead names to skip duplicates
    const existingNames = new Set(leads.map(l => l.name.toLowerCase().trim()));
    let idCounter = leads.length + 1;

    for (let i = 0; i < keywords.length; i++) {
      const kw = keywords[i];
      setSearchProgress({ current: i + 1, total: keywords.length, currentKeyword: kw });

      try {
        const params = new URLSearchParams();
        params.set("q", `${kw} ${location}`);
        params.set("location", location);
        params.set("count", "10");
        params.set("type", "negocios");
        params.set("all", "true");

        const res = await fetch(`/api/leads/search?${params}`);
        const data = await res.json();

        if (res.ok && data.results) {
          const newLeads: Lead[] = [];
          for (const lead of data.results as Lead[]) {
            const key = lead.name.toLowerCase().trim();
            if (!existingNames.has(key)) {
              existingNames.add(key);
              lead.id = idCounter++;
              newLeads.push(lead);
            }
          }

          if (newLeads.length > 0) {
            setLeads((prev) => {
              const combined = [...newLeads, ...prev]; // NEW leads first
              return combined;
            });
          }

          // Update breakdown
          setKeywordBreakdown((prev) => {
            const existing = prev.find(kb => kb.keyword === kw);
            if (existing) {
              return prev.map(kb => kb.keyword === kw ? { ...kb, count: kb.count + (data.results?.length || 0) } : kb);
            }
            return [...prev, { keyword: kw, count: data.results.length }];
          });

          // Update localStorage
          if (currentSearchId.current) {
            const searches = loadSavedSearches();
            const idx = searches.findIndex(s => s.id === currentSearchId.current);
            if (idx !== -1) {
              searches[idx].results = [...newLeads, ...searches[idx].results];
              saveSavedSearches(searches);
            }
          }
        }
      } catch { /* continue */ }
    }

    setIsSearching(false);
    setSavedSearches(loadSavedSearches());
  };

  const addToPipeline = async (lead: Lead) => {
    const nameKey = lead.name.toLowerCase();
    if (addedIds.has(nameKey)) return;
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
          source: "smart_search",
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
      setAddedIds((prev) => new Set(prev).add(nameKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setAddingId(null);
    }
  };

  // Bulk action handlers
  const handleToggleSelect = (lead: Lead) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev);
      if (next.has(lead.id)) next.delete(lead.id);
      else next.add(lead.id);
      return next;
    });
  };

  const handleBulkAdd = async () => {
    const leadsToAdd = leads.filter((l) => selectedLeads.has(l.id) && !addedIds.has(l.name.toLowerCase()));
    for (const lead of leadsToAdd) {
      await addToPipeline(lead);
    }
    setSelectedLeads(new Set());
  };

  const handleBulkReject = () => {
    const leadsToReject = leads.filter((l) => selectedLeads.has(l.id));
    setRejectedCategories((prev) => {
      const next = new Set(prev);
      for (const lead of leadsToReject) {
        if (lead.category) next.add(lead.category);
      }
      // Persist rejected categories to localStorage
      if (currentSearchId.current) {
        const searches = loadSavedSearches();
        const idx = searches.findIndex(s => s.id === currentSearchId.current);
        if (idx !== -1) {
          searches[idx].rejectedCategories = Array.from(next);
          saveSavedSearches(searches);
        }
      }
      return next;
    });
    setSelectedLeads(new Set());
  };

  const handleSelectAll = () => {
    if (selectedLeads.size === filtered.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filtered.map((l) => l.id)));
    }
  };

  const filtered = leads
    .filter((l) => {
      if (rejectedCategories.has(l.category)) return false;
      if (rejectedLeadIds.has(l.id)) return false;
      if (filterHasEmail && !l.email) return false;
      if (filterHasPhone && !l.phone) return false;
      if (filterHasWhatsApp && !l.whatsapp) return false;
      return true;
    })
    .sort((a, b) => {
      const aUsed = addedIds.has(a.name.toLowerCase());
      const bUsed = addedIds.has(b.name.toLowerCase());
      if (aUsed !== bUsed) return aUsed ? 1 : -1; // used leads go last
      // within same group, sort by selected criteria
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      if (sortBy === "score") return leadScore(b) - leadScore(a);
      return 0;
    });

  return (
    <div className="space-y-5">
      {/* Errors */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}
      {pipelineLimitError && (
        <div className="flex items-start justify-between gap-4 bg-amber-400/10 border border-amber-400/30 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-foreground flex-1">{pipelineLimitError}</p>
          <a href="/pricing" className="text-xs font-semibold text-primary whitespace-nowrap hover:underline">Ver planes →</a>
        </div>
      )}

      {/* ========== STEP 1: SETUP ========== */}
      {step === "setup" && (
        <>
          {/* Search history */}
          {savedSearches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Recent Searches</h3>
              {savedSearches.map((search) => (
                <Card key={search.id} className="border-border/50">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => loadSearch(search)}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{search.businessType}</span>
                        <Badge variant="secondary" className="text-xs">{search.location}</Badge>
                        <Badge variant={search.status === "completed" ? "default" : "secondary"} className="text-xs">
                          {search.status === "completed" ? `${search.results.length} leads` : `${search.completedKeywords}/${search.totalKeywords} keywords`}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(search.createdAt).toLocaleDateString()} — {search.keywords.length} keywords
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-red-400 h-8 w-8 p-0 shrink-0"
                      onClick={(e) => { e.stopPropagation(); deleteSearch(search.id); }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="border-border/50 overflow-visible">
            <CardContent className="p-6 space-y-4 overflow-visible">
              <div className="space-y-1">
                <h3 className="text-base font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  What service do you offer?
                </h3>
                <p className="text-xs text-muted-foreground">
                  We will generate keywords for the types of businesses and people who would need your service.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pb-5">
                <div className="flex-1 relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    placeholder="Your service (e.g. Mobile Phlebotomy, Web Design, Catering...)"
                    value={businessType}
                    onChange={(e) => handleBusinessTypeChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setShowSuggestions(false);
                        generateKeywords();
                      }
                    }}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      blurTimeoutRef.current = setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    className="pl-9"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-50 top-full left-0 right-0 mt-1 rounded-lg border border-border/50 bg-card shadow-xl overflow-hidden"
                    >
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors cursor-pointer"
                          onMouseDown={() => {
                            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                            selectSuggestion(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="City, area or zip code (e.g. Miami FL, 33101...)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generateKeywords()}
                    className="pl-9"
                  />
                  {zipInfo && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 pointer-events-none">
                      {zipInfo}
                    </span>
                  )}
                  {zipError && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400 pointer-events-none">
                      Not found
                    </span>
                  )}
                </div>
                <Button
                  onClick={generateKeywords}
                  disabled={isGenerating || !businessType || !location}
                  className="shrink-0"
                >
                  {isGenerating ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" />Generate Keywords</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isGenerating && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/60 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Analyzing your service and generating smart keywords...</p>
              <p className="text-xs text-muted-foreground/60 mt-1">This may take a few seconds</p>
            </div>
          )}

          {!isGenerating && (
            <div className="text-center py-16">
              <Sparkles className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                Tell us your service and location to find potential clients
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Instead of searching for competitors, we find the businesses and people who need YOUR service
              </p>
            </div>
          )}
        </>
      )}

      {/* ========== STEP 2: KEYWORDS ========== */}
      {step === "keywords" && keywordData && (
        <>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setStep("setup")} className="shrink-0">
              <ArrowLeft className="h-4 w-4 mr-1" />Back
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Keywords for <span className="text-primary">{businessType}</span> in <span className="text-primary">{location}</span>
              </p>
            </div>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-5 space-y-5">
              {/* Keywords (B2B only) */}
              {keywordData.b2bKeywords.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-400" />
                    <h4 className="text-sm font-medium text-foreground">Keywords</h4>
                    <Badge variant="secondary" className="text-xs">
                      {keywordData.b2bKeywords.filter((kw) => selectedKeywords.has(kw)).length}/{keywordData.b2bKeywords.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywordData.b2bKeywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => toggleKeyword(kw)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedKeywords.has(kw)
                            ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                            : "border-border/50 text-muted-foreground hover:border-border line-through opacity-50"
                        }`}
                      >
                        {selectedKeywords.has(kw) && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Custom keyword input */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Add custom keyword</h4>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Type a custom keyword..."
                      value={customKeyword}
                      onChange={(e) => setCustomKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomKeyword()}
                      className="pl-9 h-8 text-sm"
                    />
                  </div>
                  <Button size="sm" variant="secondary" onClick={addCustomKeyword} disabled={!customKeyword.trim()}>
                    <Plus className="h-3.5 w-3.5 mr-1" />Add
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {selectedKeywords.size} keyword{selectedKeywords.size !== 1 ? "s" : ""} selected
                </p>
                <Button onClick={searchWithKeywords} disabled={selectedKeywords.size === 0}>
                  <Search className="h-4 w-4 mr-2" />
                  Search with {selectedKeywords.size} keyword{selectedKeywords.size !== 1 ? "s" : ""}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ========== STEP 3: RESULTS ========== */}
      {step === "results" && (
        <>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setStep("keywords"); setIsSearching(false); }} className="shrink-0">
              <ArrowLeft className="h-4 w-4 mr-1" />Back to keywords
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={rerunSearch}
              disabled={isSearching || selectedKeywords.size === 0}
              className="shrink-0"
            >
              {isSearching ? (
                <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Searching...</>
              ) : (
                <><Search className="h-3.5 w-3.5 mr-1" />Search Again</>
              )}
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Results for <span className="text-primary">{businessType}</span> in <span className="text-primary">{location}</span>
              </p>
            </div>
          </div>

          {/* Search progress */}
          {isSearching && (
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Searching keyword {searchProgress.current} of {searchProgress.total}...
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((searchProgress.current / searchProgress.total) * 100)}%
                  </span>
                </div>
                <Progress value={(searchProgress.current / searchProgress.total) * 100} className="h-2" />
                <p className="text-xs text-primary font-medium truncate">
                  <Search className="h-3 w-3 inline mr-1" />
                  {searchProgress.currentKeyword}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          {!isSearching && leads.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total found", value: totalBeforeDedup, color: "text-muted-foreground", sub: "before dedup" },
                  { label: "Unique leads", value: leads.length, color: "text-emerald-400", sub: "after dedup" },
                  { label: "Showing", value: filtered.length, color: "text-primary", sub: "with filters" },
                  { label: "Added", value: addedIds.size, color: "text-blue-400", sub: "to pipeline" },
                ].map((s) => (
                  <Card key={s.label} className="border-border/50">
                    <CardContent className="p-3 text-center">
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Keyword breakdown */}
              {keywordBreakdown.length > 0 && (
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Results by keyword</h4>
                    <div className="flex flex-wrap gap-2">
                      {keywordBreakdown.map((kb) => (
                        <Badge key={kb.keyword} variant="secondary" className="text-xs">
                          {kb.keyword}: {kb.count}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Filters */}
              <Card className="border-border/50">
                <CardContent className="p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: "Has Email", active: filterHasEmail, set: setFilterHasEmail },
                      { label: "Has Phone", active: filterHasPhone, set: setFilterHasPhone },
                      { label: "Has WhatsApp", active: filterHasWhatsApp, set: setFilterHasWA },
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
                        <SelectItem value="score">Most complete first</SelectItem>
                        <SelectItem value="rating">Highest rating</SelectItem>
                        <SelectItem value="reviews">Most reviews</SelectItem>
                        <SelectItem value="default">Original order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Rejected categories banner */}
          {rejectedCategories.size > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
              <span>Filtered out:</span>
              {Array.from(rejectedCategories).map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs cursor-pointer hover:bg-destructive/20"
                  onClick={() => {
                    setRejectedCategories((prev) => {
                      const next = new Set(prev);
                      next.delete(cat);
                      return next;
                    });
                  }}
                >
                  {cat} ✕
                </Badge>
              ))}
            </div>
          )}

          {/* No results */}
          {!isSearching && leads.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No results found</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Try adjusting your keywords or search in a different area</p>
            </div>
          )}

          {/* Bulk actions bar */}
          {selectedLeads.size > 0 && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-lg px-4 py-2">
              <span className="text-sm font-medium">{selectedLeads.size} selected</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleBulkAdd}>
                  <Plus className="h-3.5 w-3.5 mr-1" />Add to Pipeline
                </Button>
                <Button size="sm" variant="ghost" onClick={handleBulkReject} className="text-red-400 hover:text-red-300">
                  <X className="h-3.5 w-3.5 mr-1" />Reject
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedLeads(new Set())}>
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Results list */}
          {filtered.length > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between mb-2">
                <Button size="sm" variant="ghost" onClick={handleSelectAll} className="text-xs">
                  {selectedLeads.size === filtered.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
              <div className="space-y-3">
                {filtered.slice(0, leadsLimit).map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    isAdded={addedIds.has(lead.name.toLowerCase())}
                    isAdding={addingId === lead.id}
                    onAdd={addToPipeline}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    isSelected={selectedLeads.has(lead.id)}
                    onToggleSelect={handleToggleSelect}
                    onViewDetail={setSelectedLead}
                  />
                ))}

                {filtered.length > leadsLimit && (
                  <div className="relative">
                    <div className="space-y-3 blur-sm pointer-events-none select-none" aria-hidden="true">
                      {filtered.slice(leadsLimit, leadsLimit + 3).map((lead) => (
                        <LeadCard key={lead.id} lead={lead} isAdded={false} isAdding={false} onAdd={() => {}} />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-background/80 to-background">
                      <div className="text-center space-y-3 p-6">
                        <p className="text-lg font-semibold text-foreground">
                          +{filtered.length - leadsLimit} more leads available
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Upgrade your plan to see all {filtered.length} leads
                        </p>
                        <a href="/pricing" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                          Upgrade Plan
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(open) => { if (!open) setSelectedLead(null); }}
          businessProfile={profile ?? null}
        />
      )}
    </div>
  );
}

function SearchPanel({
  mode,
  queryPlaceholder,
  categories,
  profile,
}: {
  mode: "negocios" | "personas";
  queryPlaceholder: string;
  categories: string[];
  profile?: BusinessProfile | null;
}) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
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
  const [addedIds, setAddedIds]         = useState<Set<string>>(new Set());
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
    setAddedIds(new Set());

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
    const nameKey = lead.name.toLowerCase();
    if (addedIds.has(nameKey)) return;
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
      setAddedIds((prev) => new Set(prev).add(nameKey));
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
                placeholder="City, area or zip code (e.g. Miami FL, 33101, London...)"
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
            { label: "Al Pipeline",  value: addedIds.size,     color: "text-blue-400",    sub: "agregados" },
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
                isAdded={addedIds.has(lead.name.toLowerCase())}
                isAdding={addingId === lead.id}
                onAdd={addToPipeline}
                onViewDetail={setSelectedLead}
              />
            ))}
          </div>
        </>
      )}

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(open) => { if (!open) setSelectedLead(null); }}
          businessProfile={profile ?? null}
        />
      )}
    </div>
  );
}

export default function LeadsPage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (cancelled) return;
      setProfile(getBusinessProfile());
      setProfileLoaded(true);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!profileLoaded) return null;

  if (!profile) {
    return (
      <div className="p-6">
        <BusinessSetup onComplete={(p) => setProfile(p)} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Lead Discovery</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Encuentra negocios y personas que necesitan tus servicios
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
          <SmartSearchPanel profile={profile} />
        </TabsContent>

        <TabsContent value="personas" className="mt-5">
          <SearchPanel
            mode="personas"
            queryPlaceholder="Profesión o nombre (ej: médico, abogado, fotógrafo...)"
            categories={PEOPLE_CATEGORIES}
            profile={profile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
