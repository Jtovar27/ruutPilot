import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { getUserPlan, getMonthlySearchCount, logSearch, PLAN_LIMITS } from "@/lib/plans";
import { runScrapers, getPitchHint } from "@/lib/scrapers";
import type { SourceId } from "@/lib/scrapers";
import { groqChat } from "@/lib/groq";

async function launchBrowser() {
  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const { chromium: pw } = await import("playwright-core");
    return pw.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
  }
  const { chromium } = await import("playwright");
  return chromium.launch({ headless: true });
}

const MAX_LEADS: Record<string, number> = { free: 10, pro: 30, agency: 75 };

function getSourcesForPlan(plan: string, sourceParam: string, location: string): SourceId[] {
  // Detect region
  const isUS = /\b(usa|united states|estados unidos|new york|miami|los angeles|chicago|houston|phoenix|dallas|san diego|denver|seattle|boston|atlanta|las vegas|philadelphia|san francisco)\b/i.test(location);
  const isUK = /\b(uk|united kingdom|england|london|manchester|birmingham|leeds|glasgow|edinburgh|bristol)\b/i.test(location);
  const isEurope = /\b(france|germany|spain|italy|netherlands|belgium|switzerland|austria|portugal|paris|berlin|madrid|rome|amsterdam|barcelona|milan|vienna|zurich|lisbon)\b/i.test(location);

  if (plan === "free") return ["google_maps"];
  if (plan === "pro") {
    if (isUS) return ["google_maps", "yelp", "yellowpages"];
    if (isUK) return ["google_maps", "yelp", "yell"];
    if (isEurope) return ["google_maps", "yelp", "europages"];
    return ["google_maps", "yelp"]; // LatAm: google_maps + yelp where available
  }
  // agency: all relevant sources
  if (isUS) return ["google_maps", "yelp", "yellowpages"];
  if (isUK) return ["google_maps", "yelp", "yell"];
  if (isEurope) return ["google_maps", "yelp", "europages"];
  return ["google_maps", "yelp"]; // LatAm
}

export async function GET(req: NextRequest) {
  const { userId, email, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const [plan, searchCount] = await Promise.all([
    getUserPlan(userId!, email),
    getMonthlySearchCount(userId!),
  ]);

  const limit = PLAN_LIMITS[plan].searchesPerMonth;
  if (searchCount >= limit) {
    return NextResponse.json({
      error: "limit_reached",
      message: `Alcanzaste el límite de ${limit} búsquedas este mes en el plan ${plan === "free" ? "gratuito" : plan}.`,
      searchesUsed: searchCount, searchesLimit: limit, plan,
    }, { status: 402 });
  }

  const url = new URL(req.url);
  const query    = url.searchParams.get("q") || "";
  const location = url.searchParams.get("location") || "";
  const type     = (url.searchParams.get("type") || "negocios") as "negocios" | "personas";
  const requestedCount = Math.min(parseInt(url.searchParams.get("count") || "20", 10), MAX_LEADS[plan] ?? 20);
  const sourceParam = url.searchParams.get("source") || "auto";

  if (!query && !location) return NextResponse.json({ error: "query or location required" }, { status: 400 });

  // For personas mode, append "profesional" to improve Maps results for individuals
  const searchQuery = type === "personas" && query ? `${query} profesional` : query;

  let browser;
  try {
    browser = await launchBrowser();
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      locale: /^\d{5}(-\d{4})?$/.test(location.trim()) ? "en-US"
        : /^[A-Z]{1,2}\d/i.test(location.trim()) ? "en-GB"
        : /\b(usa|united states|estados unidos|new york|miami|los angeles|chicago|houston|phoenix|dallas|san diego|denver|seattle|boston|atlanta|toronto|canada|montreal|vancouver)\b/i.test(location) ? "en-US"
        : "es-419",
      permissions: [],
    });

    const sources = getSourcesForPlan(plan, sourceParam, location);
    const leads = await runScrapers(sources, context, {
      query: searchQuery,
      location,
      count: requestedCount,
      type,
    });

    if (leads.length > 0) await logSearch(userId!, query, location);

    let enriched = leads.map((l) => ({
      ...l,
      hasWebsite: !!l.website,
      pitch: getPitchHint(l.category),
    }));

    // AI relevance filter: remove clearly irrelevant results
    if (enriched.length > 0 && enriched.length <= 30) {
      try {
        const leadNames = enriched.map((l, i) => `${i}: ${l.name} (${l.category})`).join("\n");
        const filterPrompt = `You are filtering Google Maps search results. The user searched for "${query}" to find potential clients for their service.

Review these businesses and mark which ones are RELEVANT (actual potential clients) vs IRRELEVANT (unrelated businesses that appeared in search by mistake).

Businesses:
${leadNames}

Respond with JSON only: { "keep": [0, 2, 5, ...], "remove": [1, 3, 4, ...] }
Only remove businesses that are clearly NOT relevant to the search intent. When in doubt, KEEP the lead.`;

        const filterResult = await groqChat(filterPrompt, { maxTokens: 500, json: true });
        const parsed = JSON.parse(filterResult);

        if (parsed.keep && Array.isArray(parsed.keep)) {
          const keepSet = new Set(parsed.keep);
          enriched = enriched.filter((_, i) => keepSet.has(i));
        }
      } catch {
        // If AI filter fails, return all results (don't block the search)
      }
    }

    return NextResponse.json({
      results: enriched,
      count: enriched.length,
      totalFound: enriched.length,
      searchesUsed: searchCount + 1,
      searchesLimit: limit,
      plan,
      sources,
    });
  } catch (err) {
    console.error("Scraping error:", err);
    return NextResponse.json({ error: "Scraping failed. Run: npx playwright install chromium" }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
