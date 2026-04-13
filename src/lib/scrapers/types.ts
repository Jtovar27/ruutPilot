export interface ScrapedLead {
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
}

export interface ScraperOptions {
  query: string;
  location: string;
  count: number;
  type: "negocios" | "personas";
}

export type SourceId = "google_maps" | "yelp" | "yellowpages" | "yell" | "europages";
