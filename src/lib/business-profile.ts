export interface BusinessProfile {
  businessType: string;
  services: string[];
  priceRange: string;
  currency: string;
  serviceArea: string;
  website?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  businessName: string;
  differentiators: string[];
  setupComplete: boolean;
  createdAt: string;
}

const PROFILE_KEY = "ruutpilot_business_profile";

export function getBusinessProfile(): BusinessProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return null;
    const profile = JSON.parse(data);
    return profile.setupComplete ? profile : null;
  } catch {
    return null;
  }
}

export function saveBusinessProfile(profile: BusinessProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return false;
    return JSON.parse(data).setupComplete === true;
  } catch {
    return false;
  }
}
