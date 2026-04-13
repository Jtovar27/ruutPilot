import { BrowserContext } from "playwright-core";
import { ScrapedLead, ScraperOptions } from "./types";

export async function scrapeYellowPages(
  context: BrowserContext,
  options: ScraperOptions
): Promise<ScrapedLead[]> {
  const page = await context.newPage();
  const results: ScrapedLead[] = [];

  try {
    const url = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(options.query)}&geo_location_terms=${encodeURIComponent(options.location)}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    // Wait for either possible selector
    await page.waitForSelector('.search-results .result, .organic .srp-listing', { timeout: 10000 }).catch(() => {});

    const listings = await page.evaluate((maxCount: number) => {
      const cards = Array.from(
        document.querySelectorAll('.search-results .result, .organic .srp-listing')
      ).slice(0, maxCount);

      return cards.map((card, i) => {
        const nameEl = card.querySelector('.business-name span') || card.querySelector('h2.n');
        const name = (nameEl as HTMLElement)?.textContent?.trim() || "";

        const phoneEl = card.querySelector('.phones.phone.primary');
        const phone = (phoneEl as HTMLElement)?.textContent?.trim() || "";

        const streetEl = card.querySelector('.street-address');
        const localityEl = card.querySelector('.locality');
        const street = (streetEl as HTMLElement)?.textContent?.trim() || "";
        const locality = (localityEl as HTMLElement)?.textContent?.trim() || "";
        const address = [street, locality].filter(Boolean).join(", ");

        const categoryEl = card.querySelector('.categories a');
        const category = (categoryEl as HTMLElement)?.textContent?.trim() || "Business";

        const websiteEl = card.querySelector('.track-visit-website') as HTMLAnchorElement | null;
        const website = websiteEl?.href || "";

        const listingEl = card.querySelector('a[href*="/"]') as HTMLAnchorElement | null;
        const listingUrl = listingEl?.href || "";

        return { id: i + 1, name, phone, address, category, website, mapsUrl: listingUrl };
      }).filter(item => item.name.length > 0);
    }, options.count);

    for (const listing of listings) {
      results.push({
        id: listing.id,
        name: listing.name,
        category: listing.category,
        address: listing.address,
        phone: listing.phone,
        whatsapp: "",
        email: "",
        website: listing.website,
        instagram: "",
        facebook: "",
        hours: "",
        description: "",
        priceLevel: "",
        mapsUrl: listing.mapsUrl,
        rating: 0,
        reviews: 0,
      });
    }
  } catch (err) {
    console.warn("[yellowpages] Scraping failed — returning empty array:", err);
  } finally {
    await page.close();
  }

  return results;
}
