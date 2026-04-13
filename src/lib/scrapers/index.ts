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

  // Deduplicate by name + phone similarity
  const seen = new Set<string>();
  return allLeads
    .filter(lead => {
      const key = `${lead.name.toLowerCase().trim()}|${lead.phone.replace(/\D/g, "")}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((lead, i) => ({ ...lead, id: i + 1 }));
}
