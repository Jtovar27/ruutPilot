"use client";

import { useState, useRef } from "react";
import {
  Building2, Briefcase, MapPin, Sparkles, Check, Plus, X, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BusinessProfile,
  saveBusinessProfile,
} from "@/lib/business-profile";

const BUSINESS_TYPES = [
  "Mobile Phlebotomy", "Phlebotomy", "Home Health Care", "Physical Therapy", "Dental Practice",
  "Chiropractic", "Mental Health Counseling", "Medical Lab Services", "Nursing Services",
  "Veterinary Services", "Optometry", "Pharmacy", "Occupational Therapy", "Speech Therapy",
  "Dermatology", "Podiatry",
  "Plumbing", "Electrical Services", "HVAC", "Landscaping", "House Cleaning", "Pest Control",
  "Roofing", "Painting", "Moving Services", "Handyman Services", "Garage Door Repair",
  "Pressure Washing", "Pool Cleaning", "Locksmith", "Appliance Repair",
  "Accounting", "Legal Services", "Insurance Agency", "Real Estate", "Financial Planning",
  "Tax Preparation", "Consulting", "Notary Services", "Translation Services",
  "Web Development", "IT Support", "Digital Marketing", "SEO Services",
  "Social Media Management", "App Development", "Cybersecurity", "Graphic Design",
  "Video Production", "Data Analytics",
  "Hair Salon", "Barbershop", "Nail Salon", "Spa & Massage", "Personal Training",
  "Photography", "Tattoo Studio", "Makeup Artist", "Lash Extensions", "Skincare",
  "Catering", "Food Truck", "Bakery", "Restaurant", "Coffee Shop", "Meal Prep Services",
  "Juice Bar", "Food Delivery",
  "Auto Repair", "Auto Detailing", "Towing Services", "Car Wash", "Tire Shop",
  "General Contractor", "Interior Design", "Architecture", "Flooring",
  "Window Installation", "Fencing", "Concrete Services", "Demolition",
  "Tutoring", "Music Lessons", "Dance Studio", "Driving School", "Language School",
  "Test Prep", "Art Classes",
  "Dog Walking", "Pet Grooming", "Pet Sitting", "Dog Training", "Pet Boarding",
  "Wedding Planning", "DJ Services", "Event Catering", "Party Rentals",
  "Floral Design", "Event Photography",
];

const PRICE_RANGES = [
  "Under $500",
  "$500 - $2,000",
  "$2,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
];

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "MXN", "COP"];

const SUGGESTED_SERVICES: Record<string, string[]> = {
  "Mobile Phlebotomy": ["Blood draws", "Drug testing", "Wellness panels", "INR testing", "Glucose testing", "Cholesterol screening", "DNA testing"],
  "Phlebotomy": ["Blood draws", "Drug testing", "Wellness panels", "INR testing"],
  "Web Development": ["Website design", "E-commerce", "Landing pages", "Website maintenance", "SEO optimization", "Web hosting"],
  "Digital Marketing": ["Social media management", "Google Ads", "Facebook Ads", "Email marketing", "Content creation", "Analytics & reporting"],
  "SEO Services": ["On-page SEO", "Technical SEO", "Link building", "Local SEO", "SEO audits", "Keyword research"],
  "Plumbing": ["Drain cleaning", "Pipe repair", "Water heater install", "Leak detection", "Toilet repair", "Faucet installation"],
  "Electrical Services": ["Wiring", "Panel upgrades", "Outlet installation", "Lighting", "Generator install", "EV charger install"],
  "HVAC": ["AC repair", "Heating repair", "Installation", "Maintenance", "Duct cleaning", "Thermostat install"],
  "House Cleaning": ["Deep cleaning", "Regular cleaning", "Move-in/out cleaning", "Office cleaning", "Window cleaning", "Carpet cleaning"],
  "Landscaping": ["Lawn care", "Tree trimming", "Garden design", "Irrigation", "Hardscaping", "Snow removal"],
  "Hair Salon": ["Haircuts", "Coloring", "Highlights", "Blowouts", "Treatments", "Extensions"],
  "Photography": ["Portraits", "Events", "Weddings", "Product photography", "Headshots", "Real estate photography"],
  "Auto Repair": ["Oil change", "Brake repair", "Engine diagnostics", "Tire rotation", "Transmission repair", "AC repair"],
  "Dental Practice": ["Cleanings", "Fillings", "Root canals", "Crowns", "Whitening", "Implants"],
  "Legal Services": ["Consultation", "Document review", "Contract drafting", "Court representation", "Legal advice"],
  "Accounting": ["Bookkeeping", "Tax preparation", "Payroll", "Financial statements", "Tax planning", "Audit support"],
  "Personal Training": ["1-on-1 training", "Group classes", "Online coaching", "Nutrition planning", "Weight loss programs", "Strength training"],
  "Catering": ["Corporate events", "Weddings", "Private parties", "Meal prep", "Buffet service", "Box lunches"],
  "General Contractor": ["Renovations", "New construction", "Additions", "Kitchen remodel", "Bathroom remodel", "Roofing"],
};

function getSuggestedServices(businessType: string): string[] {
  if (!businessType.trim()) return [];
  const exactMatch = SUGGESTED_SERVICES[businessType];
  if (exactMatch) return exactMatch;
  const lowerType = businessType.toLowerCase();
  for (const [key, values] of Object.entries(SUGGESTED_SERVICES)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes(lowerType) || lowerType.includes(lowerKey)) {
      return values;
    }
  }
  return [];
}

const DIFFERENTIATOR_EXAMPLES = [
  "24/7 availability",
  "Licensed & insured",
  "10+ years experience",
  "Free consultation",
  "Same-day service",
  "Bilingual (EN/ES)",
  "Mobile / on-site",
  "Satisfaction guaranteed",
];

const SUGGESTED_DIFFERENTIATORS: Record<string, string[]> = {
  "Mobile Phlebotomy": ["CLIA certified", "Same-day results", "Mobile service", "Insurance accepted", "Bilingual staff", "Flexible scheduling", "Weekend availability"],
  "Web Development": ["Custom designs", "SEO included", "Fast delivery", "Responsive design", "Free hosting setup", "Ongoing support", "E-commerce ready"],
  "Plumbing": ["24/7 emergency", "Licensed & insured", "Free estimates", "Same-day service", "Senior discount", "Warranty included"],
  "Dental Practice": ["Accepting new patients", "Insurance accepted", "Sedation available", "Weekend hours", "Family-friendly", "Emergency appointments"],
  "Photography": ["Same-day editing", "Drone photography", "Print packages", "Digital gallery", "Travel available", "Unlimited shots"],
  "House Cleaning": ["Eco-friendly products", "Background checked", "Same-day booking", "Satisfaction guaranteed", "Flexible scheduling"],
  "Auto Repair": ["Free diagnostics", "ASE certified", "Warranty on parts", "Loaner car available", "Same-day service"],
  "Landscaping": ["Free estimates", "Weekly maintenance", "Licensed & insured", "Design services", "Seasonal cleanup"],
  "HVAC": ["24/7 emergency", "Free estimates", "Energy efficient", "Maintenance plans", "Licensed & insured"],
  "Catering": ["Custom menus", "Dietary accommodations", "Full service", "Setup & cleanup", "Tastings available"],
};

function getSuggestedDifferentiators(businessType: string): string[] {
  if (!businessType.trim()) return [];
  const exactMatch = SUGGESTED_DIFFERENTIATORS[businessType];
  if (exactMatch) return exactMatch;
  const lowerType = businessType.toLowerCase();
  for (const [key, values] of Object.entries(SUGGESTED_DIFFERENTIATORS)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes(lowerType) || lowerType.includes(lowerKey)) {
      return values;
    }
  }
  return [];
}

interface BusinessSetupProps {
  onComplete: (profile: BusinessProfile) => void;
}

export function BusinessSetup({ onComplete }: BusinessSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Step 1
  const [businessType, setBusinessType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Step 2
  const [services, setServices] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [currency, setCurrency] = useState("USD");

  // Step 3
  const [serviceArea, setServiceArea] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Step 4
  const [differentiators, setDifferentiators] = useState<string[]>([]);
  const [diffInput, setDiffInput] = useState("");

  // Success
  const [showSuccess, setShowSuccess] = useState(false);

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

  const addService = () => {
    const trimmed = serviceInput.trim();
    if (trimmed && !services.includes(trimmed)) {
      setServices((prev) => [...prev, trimmed]);
      setServiceInput("");
    }
  };

  const removeService = (s: string) => {
    setServices((prev) => prev.filter((x) => x !== s));
  };

  const addDifferentiator = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !differentiators.includes(trimmed)) {
      setDifferentiators((prev) => [...prev, trimmed]);
    }
    setDiffInput("");
  };

  const removeDifferentiator = (d: string) => {
    setDifferentiators((prev) => prev.filter((x) => x !== d));
  };

  const handleComplete = () => {
    const profile: BusinessProfile = {
      businessType,
      businessName,
      services,
      priceRange,
      currency,
      serviceArea,
      website: website || undefined,
      phone: phone || undefined,
      whatsapp: whatsapp || undefined,
      email: email || undefined,
      differentiators,
      setupComplete: true,
      createdAt: new Date().toISOString(),
    };
    saveBusinessProfile(profile);
    setShowSuccess(true);
    setTimeout(() => {
      onComplete(profile);
    }, 1500);
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1: return businessType.trim().length > 0 && businessName.trim().length > 0;
      case 2: return services.length > 0 && priceRange.length > 0;
      case 3: return serviceArea.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md border-green-500/30 bg-green-500/5">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">You&apos;re all set!</h2>
            <p className="text-sm text-muted-foreground">
              Your business profile is configured. Lead Discovery is loading...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Business Type */}
        {currentStep === 1 && (
          <Card className="border-border/50">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">What&apos;s your business?</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us about your business so we can find the right leads for you
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Business Name</label>
                  <Input
                    placeholder="e.g. Smith Mobile Phlebotomy"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-foreground">Business Type</label>
                  <Input
                    placeholder="Start typing... e.g. Plumbing, Dental, Photography"
                    value={businessType}
                    onChange={(e) => handleBusinessTypeChange(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      blurTimeout.current = setTimeout(() => setShowSuggestions(false), 150);
                    }}
                  />
                  {showSuggestions && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 text-foreground transition-colors"
                          onMouseDown={() => {
                            if (blurTimeout.current) clearTimeout(blurTimeout.current);
                          }}
                          onClick={() => selectSuggestion(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!canProceed(1)}
                onClick={() => setCurrentStep(2)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Services & Pricing */}
        {currentStep === 2 && (
          <Card className="border-border/50">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Services & Pricing</h2>
                <p className="text-sm text-muted-foreground">
                  Select the services you offer — we&apos;ll use this to personalize your outreach
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Your Services</label>

                  {/* Suggested services chips */}
                  {getSuggestedServices(businessType).length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Click to add:</p>
                      <div className="flex flex-wrap gap-2">
                        {getSuggestedServices(businessType)
                          .filter((s) => !services.includes(s))
                          .map((s) => (
                            <button
                              key={s}
                              type="button"
                              className="px-2.5 py-1 text-xs rounded-full border border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => {
                                if (!services.includes(s)) {
                                  setServices((prev) => [...prev, s]);
                                }
                              }}
                            >
                              + {s}
                            </button>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Type your main services below</p>
                  )}

                  {/* Selected services */}
                  {services.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {services.map((s) => (
                        <Badge key={s} variant="secondary" className="gap-1 pr-1">
                          {s}
                          <button
                            type="button"
                            onClick={() => removeService(s)}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Custom service input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a custom service..."
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addService();
                        }
                      }}
                    />
                    <Button variant="outline" size="icon" onClick={addService} disabled={!serviceInput.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Average price per service/project</label>
                  <p className="text-xs text-muted-foreground">This helps us personalize your outreach messages</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {PRICE_RANGES.map((pr) => (
                      <button
                        key={pr}
                        type="button"
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                          priceRange === pr
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setPriceRange(pr)}
                      >
                        {pr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Currency</label>
                  <div className="flex flex-wrap gap-2">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                          currency === c
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setCurrency(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" disabled={!canProceed(2)} onClick={() => setCurrentStep(3)}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location & Contact */}
        {currentStep === 3 && (
          <Card className="border-border/50">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Location & Contact</h2>
                <p className="text-sm text-muted-foreground">
                  Where do you operate? Your contact info helps leads reach you back
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Service Area</label>
                  <Input
                    placeholder="City, state, zip code, or 'Remote'"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">We&apos;ll search for clients in this area</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Website <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    placeholder="https://yoursite.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Helps build trust when contacting leads</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">For leads to call you back directly</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    WhatsApp <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    placeholder="+1 555 123 4567"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Your WhatsApp number for direct messaging leads</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email for Outreach <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    placeholder="you@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Used for sending outreach emails to leads</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button className="flex-1" disabled={!canProceed(3)} onClick={() => setCurrentStep(4)}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Differentiators */}
        {currentStep === 4 && (
          <Card className="border-border/50">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">What makes you different?</h2>
                <p className="text-sm text-muted-foreground">
                  Tell leads why they should choose YOU — click to add or type your own
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Your Differentiators</label>

                  {/* Suggested differentiators chips */}
                  {getSuggestedDifferentiators(businessType).length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Click to add:</p>
                      <div className="flex flex-wrap gap-2">
                        {getSuggestedDifferentiators(businessType)
                          .filter((d) => !differentiators.includes(d))
                          .map((d) => (
                            <button
                              key={d}
                              type="button"
                              className="px-2.5 py-1 text-xs rounded-full border border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => addDifferentiator(d)}
                            >
                              + {d}
                            </button>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Quick add:</p>
                      <div className="flex flex-wrap gap-2">
                        {DIFFERENTIATOR_EXAMPLES.filter((d) => !differentiators.includes(d)).map((d) => (
                          <button
                            key={d}
                            type="button"
                            className="px-2.5 py-1 text-xs rounded-full border border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => addDifferentiator(d)}
                          >
                            + {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected differentiators */}
                  {differentiators.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {differentiators.map((d) => (
                        <Badge key={d} variant="secondary" className="gap-1 pr-1">
                          {d}
                          <button
                            type="button"
                            onClick={() => removeDifferentiator(d)}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Custom differentiator input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a custom differentiator..."
                      value={diffInput}
                      onChange={(e) => setDiffInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addDifferentiator(diffInput);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addDifferentiator(diffInput)}
                      disabled={!diffInput.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">You can skip this and add later in Settings</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(3)}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleComplete}>
                  Complete Setup <Check className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
