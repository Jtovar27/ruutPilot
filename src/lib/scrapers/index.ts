import { BrowserContext } from "playwright-core";
import { ScrapedLead, ScraperOptions, SourceId } from "./types";
import { scrapeGoogleMaps } from "./google-maps";
import { scrapeYelp } from "./yelp";
import { scrapeYellowPages } from "./yellowpages";
import { scrapeYell } from "./yell";
import { scrapeEuropages } from "./europages";

export type { ScrapedLead, ScraperOptions, SourceId };
export { getPitchHint } from "./google-maps";

// All sources use Playwright — no external API keys required
const BROWSER_SCRAPERS: Partial<Record<SourceId, (ctx: BrowserContext, opts: ScraperOptions) => Promise<ScrapedLead[]>>> = {
  google_maps: scrapeGoogleMaps,
  yelp: scrapeYelp,
  yellowpages: scrapeYellowPages,
  yell: scrapeYell,
  europages: scrapeEuropages,
};

export async function runScrapers(
  sources: SourceId[],
  context: BrowserContext,
  options: ScraperOptions
): Promise<ScrapedLead[]> {
  const results = await Promise.allSettled(
    sources
      .filter(s => BROWSER_SCRAPERS[s])
      .map(s => BROWSER_SCRAPERS[s]!(context, options))
  );

  const allLeads: ScrapedLead[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") allLeads.push(...r.value);
  }

  // Deduplicate by multiple keys: name+phone, name+address, phone alone
  const seen = new Set<string>();
  return allLeads
    .filter(lead => {
      const name = lead.name.toLowerCase().trim();
      const phone = lead.phone.replace(/\D/g, "");
      const addr = (lead.address || "").toLowerCase().trim().slice(0, 20);

      const keys: string[] = [];
      keys.push(`np:${name}|${phone}`);
      if (addr) keys.push(`na:${name}|${addr}`);
      if (phone) keys.push(`p:${phone}`);

      if (keys.some(k => seen.has(k))) return false;
      keys.forEach(k => seen.add(k));
      return true;
    })
    .map((lead, i) => ({ ...lead, id: i + 1 }));
}
