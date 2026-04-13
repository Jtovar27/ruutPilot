import { BrowserContext } from "playwright-core";
import { ScrapedLead, ScraperOptions } from "./types";

// Scrapes Yelp search results directly — no API key required.
// Good coverage for US cities and some European ones (UK, France, Germany, Spain, Italy).
export async function scrapeYelp(
  context: BrowserContext,
  options: ScraperOptions
): Promise<ScrapedLead[]> {
  const page = await context.newPage();
  const results: ScrapedLead[] = [];

  try {
    const url = `https://www.yelp.com/search?find_desc=${encodeURIComponent(options.query)}&find_loc=${encodeURIComponent(options.location)}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    // Dismiss any modal/popup
    await page.locator('[aria-label="Close"]').first().click({ timeout: 2000 }).catch(() => {});

    await page.waitForSelector('[data-testid="serp-ia-card"], .businessName__09f24__HG_pC, h3 a[href*="/biz/"]', {
      timeout: 8000,
    }).catch(() => {});

    const businesses = await page.evaluate((maxCount: number) => {
      const items: Array<{
        name: string;
        category: string;
        address: string;
        phone: string;
        rating: number;
        reviews: number;
        href: string;
      }> = [];

      // Yelp uses obfuscated class names — target by structure and data attributes
      const cards = document.querySelectorAll(
        '[data-testid="serp-ia-card"], [class*="container__"][class*="hoverable"]'
      );

      for (const card of Array.from(cards)) {
        if (items.length >= maxCount) break;

        // Name — try multiple selectors Yelp uses
        const nameEl =
          card.querySelector('a[class*="businessName"]') ||
          card.querySelector('h3 a[href*="/biz/"]') ||
          card.querySelector('[class*="businessName"] a') ||
          card.querySelector('a[name]');
        const name = nameEl?.textContent?.trim() || "";
        if (!name || name.length < 2) continue;

        const href = (nameEl as HTMLAnchorElement)?.href || "";

        // Category
        const categoryEl =
          card.querySelector('[class*="priceCategory"] a') ||
          card.querySelector('[class*="category"] a') ||
          card.querySelector('a[href*="/c/"]');
        const category = categoryEl?.textContent?.trim() || "Business";

        // Address
        const addressEl =
          card.querySelector('address') ||
          card.querySelector('[class*="secondaryAttributes"]') ||
          card.querySelector('[class*="address"]');
        const address = addressEl?.textContent?.trim() || "";

        // Rating
        const ratingEl = card.querySelector('[aria-label*="star rating"]');
        const ratingText = ratingEl?.getAttribute("aria-label") || "";
        const ratingMatch = ratingText.match(/([\d.]+)\s*star/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

        // Reviews
        const reviewsEl = card.querySelector('[class*="reviewCount"], [href*="reviews"]');
        const reviewsText = reviewsEl?.textContent?.replace(/[^0-9]/g, "") || "0";
        const reviews = parseInt(reviewsText, 10) || 0;

        items.push({ name, category, address, phone: "", rating, reviews, href });
      }

      return items;
    }, options.count);

    businesses.forEach((b, i) => {
      results.push({
        id: i + 1,
        name: b.name,
        category: b.category,
        address: b.address,
        phone: b.phone,
        whatsapp: "",
        email: "",
        website: "",
        instagram: "",
        facebook: "",
        hours: "",
        description: "",
        priceLevel: "",
        mapsUrl: b.href,
        rating: b.rating,
        reviews: b.reviews,
      });
    });
  } catch (err) {
    console.warn("[yelp] Scraping error:", err);
  } finally {
    await page.close();
  }

  return results;
}
