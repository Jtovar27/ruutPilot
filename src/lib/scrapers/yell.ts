import { BrowserContext } from "playwright-core";
import { ScrapedLead, ScraperOptions } from "./types";

export async function scrapeYell(
  context: BrowserContext,
  options: ScraperOptions
): Promise<ScrapedLead[]> {
  const page = await context.newPage();
  const results: ScrapedLead[] = [];

  try {
    const querySlug = encodeURIComponent(options.query.replace(/\s+/g, "-"));
    const locationSlug = encodeURIComponent(options.location.replace(/\s+/g, "-"));
    const url = `https://www.yell.com/s/${querySlug}/${locationSlug}/`;

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    await page.waitForSelector(
      '.businessCapsule--mainContent, .businessCapsule, [class*="businessCapsule"]',
      { timeout: 10000 }
    ).catch(() => {});

    const listings = await page.evaluate((maxCount: number) => {
      const cards = Array.from(
        document.querySelectorAll('.businessCapsule--mainContent, .businessCapsule, [class*="businessCapsule"]')
      ).slice(0, maxCount);

      return cards.map((card, i) => {
        // Name: try multiple selectors
        const nameEl =
          card.querySelector('.businessCapsule--name') ||
          card.querySelector('[class*="businessName"]') ||
          card.querySelector('h2') ||
          card.querySelector('h3');
        const name = (nameEl as HTMLElement)?.textContent?.trim() || "";

        // Phone
        const phoneEl =
          card.querySelector('[class*="phone"]') ||
          card.querySelector('a[href^="tel:"]');
        let phone = (phoneEl as HTMLElement)?.textContent?.trim() || "";
        if (!phone && phoneEl) {
          const href = (phoneEl as HTMLAnchorElement).href || "";
          phone = href.replace("tel:", "");
        }

        // Address
        const addrEl =
          card.querySelector('[class*="address"]') ||
          card.querySelector('[itemprop="address"]');
        const address = (addrEl as HTMLElement)?.textContent?.trim() || "";

        // Category
        const catEl =
          card.querySelector('[class*="category"]') ||
          card.querySelector('[class*="Classification"]');
        const category = (catEl as HTMLElement)?.textContent?.trim() || "Business";

        // Listing URL
        const linkEl = card.querySelector('a[href*="/biz/"]') as HTMLAnchorElement | null
          || card.closest('a') as HTMLAnchorElement | null;
        const listingUrl = linkEl?.href || "";

        return { id: i + 1, name, phone, address, category, listingUrl };
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
        website: "",
        instagram: "",
        facebook: "",
        hours: "",
        description: "",
        priceLevel: "",
        mapsUrl: listing.listingUrl,
        rating: 0,
        reviews: 0,
      });
    }
  } catch (err) {
    console.warn("[yell] Scraping failed — returning empty array:", err);
  } finally {
    await page.close();
  }

  return results;
}
