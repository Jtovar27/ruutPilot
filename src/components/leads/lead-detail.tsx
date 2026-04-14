"use client";

import { useState } from "react";
import {
  MessageCircle, Mail, Phone, Star, MapPin, Globe, Clock,
  ExternalLink, TrendingUp, Zap, Loader2, Copy, Check,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessProfile } from "@/lib/business-profile";

export interface Lead {
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

type Channel = "whatsapp" | "email" | "call";
type Template = "introduction" | "value_proposition" | "follow_up" | "referral";

interface GeneratedMessage {
  subject?: string;
  message: string;
  talkingPoints?: string[];
}

interface LeadDetailProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessProfile: BusinessProfile | null;
}

function leadScore(lead: Lead): number {
  let score = 0;
  if (lead.phone) score += 2;
  if (lead.email) score += 3;
  if (lead.whatsapp) score += 2;
  if (lead.instagram || lead.facebook) score += 1;
  if (!lead.hasWebsite) score += 2;
  if (lead.rating >= 4.0) score += 1;
  return score;
}

export function LeadDetail({ lead, open, onOpenChange, businessProfile }: LeadDetailProps) {
  const [selectedAction, setSelectedAction] = useState<Channel | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<GeneratedMessage | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const score = leadScore(lead);

  async function generateMessage(channel: Channel, template: Template) {
    if (!businessProfile) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/leads/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, businessProfile, channel, template }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data: GeneratedMessage = await res.json();
      setGeneratedMessage(data);
      setSubject(data.subject ?? "");
      setMessage(data.message);
    } catch {
      setGenerateError("Could not generate message. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleActionSelect(action: Channel) {
    setSelectedAction(action);
    setSelectedTemplate(null);
    setGeneratedMessage(null);
    setMessage("");
    setSubject("");
    setGenerateError(null);
  }

  function handleTemplateSelect(template: Template) {
    setSelectedTemplate(template);
    if (selectedAction) {
      generateMessage(selectedAction, template);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const actions: { key: Channel; label: string; icon: typeof MessageCircle; color: string; selectedColor: string }[] = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "border-border/50 hover:border-emerald-500/50",
      selectedColor: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
    },
    {
      key: "email",
      label: "Email",
      icon: Mail,
      color: "border-border/50 hover:border-purple-500/50",
      selectedColor: "border-purple-500 bg-purple-500/10 text-purple-400",
    },
    {
      key: "call",
      label: "Call Script",
      icon: Phone,
      color: "border-border/50 hover:border-blue-500/50",
      selectedColor: "border-blue-500 bg-blue-500/10 text-blue-400",
    },
  ];

  const templates: { key: Template; label: string }[] = [
    { key: "introduction", label: "Introduction" },
    { key: "value_proposition", label: "Value Offer" },
    { key: "follow_up", label: "Follow-up" },
    { key: "referral", label: "Referral" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle className="text-lg">{lead.name}</DialogTitle>
            {lead.category && (
              <Badge variant="secondary" className="text-xs">{lead.category}</Badge>
            )}
            {score >= 8 && (
              <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30 border">
                <TrendingUp className="h-2.5 w-2.5 mr-1" />Caliente
              </Badge>
            )}
            {score >= 5 && score < 8 && (
              <Badge className="text-xs bg-amber-500/15 text-amber-400 border-amber-500/30 border">
                <Zap className="h-2.5 w-2.5 mr-1" />Tibio
              </Badge>
            )}
          </div>
          {lead.rating > 0 && (
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{lead.rating} ({lead.reviews} reviews)</span>
            </div>
          )}
        </DialogHeader>

        {/* Contact info */}
        <div className="space-y-2 text-sm">
          {lead.address && (
            <a
              href={lead.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{lead.address}</span>
              <ExternalLink className="h-3 w-3 ml-auto shrink-0 opacity-50" />
            </a>
          )}
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{lead.phone}</span>
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-4 w-4 shrink-0" />
              <span>{lead.email}</span>
            </a>
          )}
          {lead.whatsapp && (
            <a
              href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>{lead.whatsapp}</span>
            </a>
          )}
          {lead.website && (
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span>{lead.website.replace(/^https?:\/\//, "").split("/")[0]}</span>
            </a>
          )}
          {lead.hours && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{lead.hours}</span>
            </p>
          )}
          {lead.description && (
            <p className="text-muted-foreground/80 text-xs mt-2">{lead.description}</p>
          )}
        </div>

        {/* Action selection */}
        <div className="space-y-3 mt-2">
          <p className="text-sm font-medium text-foreground">How do you want to reach out?</p>
          <div className="grid grid-cols-3 gap-3">
            {actions.map((action) => {
              const Icon = action.icon;
              const isSelected = selectedAction === action.key;
              return (
                <button
                  key={action.key}
                  onClick={() => handleActionSelect(action.key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors cursor-pointer ${
                    isSelected ? action.selectedColor : action.color
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template selector */}
        {selectedAction && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Select message template:</p>
            <div className="flex gap-2 flex-wrap">
              {templates.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleTemplateSelect(t.key)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
                    selectedTemplate === t.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isGenerating && (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Generating message...</span>
          </div>
        )}

        {/* Error state */}
        {generateError && (
          <p className="text-sm text-red-400 text-center py-2">{generateError}</p>
        )}

        {/* Generated message */}
        {generatedMessage && !isGenerating && (
          <div className="space-y-3">
            {selectedAction === "email" && generatedMessage.subject && (
              <div>
                <label className="text-xs text-muted-foreground">Subject</label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground">Message</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-1" />
            </div>
            {selectedAction === "call" && generatedMessage.talkingPoints && generatedMessage.talkingPoints.length > 0 && (
              <div>
                <label className="text-xs text-muted-foreground">Talking Points</label>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                  {generatedMessage.talkingPoints.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Send / Copy buttons */}
            <div className="flex gap-2">
              {selectedAction === "whatsapp" && lead.phone && (
                <a
                  href={`https://wa.me/${(lead.whatsapp || lead.phone).replace(/\D/g, "")}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors text-sm"
                >
                  <MessageCircle className="h-4 w-4" /> Open WhatsApp
                </a>
              )}
              {selectedAction === "email" && lead.email && (
                <a
                  href={`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" /> Send Email
                </a>
              )}
              {selectedAction === "call" && lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
              <Button variant="outline" onClick={handleCopy} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        {/* No profile warning */}
        {!businessProfile && selectedAction && (
          <p className="text-xs text-amber-400 text-center">
            Complete your business profile to generate personalized messages.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
