import { BrowserContext } from "playwright-core";
import { ScrapedLead, ScraperOptions } from "./types";

export async function scrapeEuropages(
  context: BrowserContext,
  options: ScraperOptions
): Promise<ScrapedLead[]> {
  const page = await context.newPage();
  const results: ScrapedLead[] = [];

  try {
    const querySlug = encodeURIComponent(options.query);
    const url = `https://www.europages.co.uk/companies/${querySlug}.html`;

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    await page.waitForSelector(
      '[class*="company-card"], [class*="CompanyCard"], .company-list-item, [data-cy*="company"]',
      { timeout: 10000 }
    ).catch(() => {});

    const listings = await page.evaluate((maxCount: number) => {
      const cards = Array.from(
        document.querySelectorAll(
          '[class*="company-card"], [class*="CompanyCard"], .company-list-item, [data-cy*="company"]'
        )
      ).slice(0, maxCount);

      return cards.map((card, i) => {
        // Name
        const nameEl =
          card.querySelector('[class*="company-name"], [class*="CompanyName"], h2, h3') ||
          card.querySelector('a[href*="/en/"]');
        const name = (nameEl as HTMLElement)?.textContent?.trim() || "";

        // Country / address
        const countryEl =
          card.querySelector('[class*="country"], [class*="location"], [class*="address"]') ||
          card.querySelector('[data-cy*="country"]');
        const address = (countryEl as HTMLElement)?.textContent?.trim() || "";

        // Description
        const descEl =
          card.querySelector('[class*="description"], [class*="activity"], p');
        const description = (descEl as HTMLElement)?.textContent?.trim().substring(0, 300) || "";

        // Website link shown on card
        const websiteEl = card.querySelector('a[href^="http"]:not([href*="europages"])') as HTMLAnchorElement | null;
        const website = websiteEl?.href || "";

        // Category (Europages often shows activity/sector)
        const catEl = card.querySelector('[class*="activity"], [class*="sector"], [class*="category"]');
        const category = (catEl as HTMLElement)?.textContent?.trim() || "Business";

        // Listing URL
        const linkEl = card.querySelector('a[href*="/en/"]') as HTMLAnchorElement | null
          || card.querySelector('a') as HTMLAnchorElement | null;
        const listingUrl = linkEl?.href || "";

        return { id: i + 1, name, address, description, website, category, listingUrl };
      }).filter(item => item.name.length > 0);
    }, options.count);

    for (const listing of listings) {
      results.push({
        id: listing.id,
        name: listing.name,
        category: listing.category,
        address: listing.address,
        phone: "",
        whatsapp: "",
        email: "",
        website: listing.website,
        instagram: "",
        facebook: "",
        hours: "",
        description: listing.description,
        priceLevel: "",
        mapsUrl: listing.listingUrl,
        rating: 0,
        reviews: 0,
      });
    }
  } catch (err) {
    console.warn("[europages] Scraping failed — returning empty array:", err);
  } finally {
    await page.close();
  }

  return results;
}
