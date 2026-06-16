import { BrowserContext } from "playwright-core";
import { ScrapedLead, ScraperOptions } from "./types";

interface CardStub {
  id: number;
  name: string;
  category: string;
  address: string;
  rating: number;
  reviews: number;
  href: string;
}

interface WebsiteData {
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
}

interface DetailResult {
  phone: string;
  address: string;
  website: string;
  hours: string;
  description: string;
  priceLevel: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  email: string;
  mapsUrl: string;
}

const DETAIL_CONCURRENCY = 2;

const PITCH_HINTS: { keywords: string[]; hint: string }[] = [
  { keywords: ["restaurante", "restaurant", "comida", "café", "cafeteria", "bar", "pizz", "sushi", "taco", "burger"],
    hint: "Los restaurantes con sitio web reciben 2x mas reservas y pedidos en linea." },
  { keywords: ["dentist", "dentista", "clínica dental", "odontolog"],
    hint: "El 77% de pacientes busca dentistas en Google antes de llamar — sin website los pierdes." },
  { keywords: ["salon", "salón", "barbería", "spa", "estética", "belleza", "nail"],
    hint: "Los salones con booking online llenan su agenda 40% mas rapido." },
  { keywords: ["gym", "gimnasio", "fitness", "yoga", "pilates", "crossfit"],
    hint: "Un sitio con inscripcion online puede duplicar las altas mensuales." },
  { keywords: ["abogado", "lawyer", "legal", "notari", "firma"],
    hint: "El 68% de clientes legales investiga al abogado online antes de contratar." },
  { keywords: ["médico", "doctor", "clínica", "clinic", "farmacia", "pharmacy", "salud", "health"],
    hint: "Pacientes nuevos buscan medicos online — sin presencia digital no apareces." },
  { keywords: ["taller", "mecánico", "autoservicio", "car", "auto"],
    hint: "Los talleres con resenas y sitio web captan 3x mas clientes por busqueda local." },
  { keywords: ["hotel", "hostal", "alojamiento", "airbnb", "posada"],
    hint: "Un sitio propio evita comisiones de OTAs y permite reservas directas." },
  { keywords: ["inmobiliaria", "real estate", "bienes raíces", "propiedad", "agente inmobiliario"],
    hint: "Agentes con sitio propio cierran ventas 2x mas rapido al mostrar listings." },
  { keywords: ["tienda", "store", "retail", "boutique", "ropa", "moda", "fashion"],
    hint: "Una tienda online complementa el punto fisico y abre ventas las 24h." },
  { keywords: ["fotógrafo", "photographer", "fotografía", "photography", "videógrafo"],
    hint: "Un portafolio online te hace aparecer en busquedas y duplica las cotizaciones." },
  { keywords: ["coach", "coaching", "consultor", "consultant", "mentor"],
    hint: "Un sitio con testimonios y formulario de contacto convierte visitantes en clientes." },
  { keywords: ["arquitecto", "architect", "diseñador", "designer", "interiorismo"],
    hint: "Un portafolio digital atrae proyectos de mayor valor y elimina clientes de bajo presupuesto." },
  { keywords: ["contador", "accountant", "contaduría", "contabilidad", "fiscal"],
    hint: "Contadores con presencia digital captan un 60% mas de clientes referidos online." },
  { keywords: ["psicólogo", "terapeuta", "therapist", "terapia"],
    hint: "El 80% de personas busca un terapeuta online antes de hacer el primer contacto." },
];

export function getPitchHint(category: string): string {
  const lower = category.toLowerCase();
  for (const { keywords, hint } of PITCH_HINTS) {
    if (keywords.some((k) => lower.includes(k))) return hint;
  }
  return "Una presencia digital profesional convierte busquedas en clientes reales.";
}

async function scrapeWebsite(context: BrowserContext, websiteUrl: string): Promise<WebsiteData> {
  const page = await context.newPage();
  const result: WebsiteData = { email: "", whatsapp: "", instagram: "", facebook: "" };

  try {
    await page.goto(websiteUrl, { waitUntil: "domcontentloaded", timeout: 7000 });

    const SKIP_EMAIL = ["example.com", "sentry.io", "wixpress", "wordpress", "schema.org", "w3.org"];

    const extractFromPage = async (): Promise<Partial<WebsiteData>> =>
      page.evaluate((skipList: string[]) => {
        const data: Partial<{ email: string; whatsapp: string; instagram: string; facebook: string }> = {};

        for (const a of Array.from(document.querySelectorAll('a[href^="mailto:"]'))) {
          const e = (a as HTMLAnchorElement).href.replace("mailto:", "").split("?")[0].trim();
          if (e.includes("@") && !skipList.some((s) => e.includes(s))) { data.email = e; break; }
        }
        if (!data.email) {
          const text = (document.body as HTMLElement).innerText || "";
          const matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
          for (const m of matches) {
            if (!skipList.some((s) => m.includes(s))) { data.email = m; break; }
          }
        }

        for (const a of Array.from(document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com/send"], a[href*="api.whatsapp"]'))) {
          const href = (a as HTMLAnchorElement).href;
          const match = href.match(/wa\.me\/(\d+)|phone=(\d+)/);
          if (match) { data.whatsapp = "+" + (match[1] || match[2]); break; }
        }

        for (const a of Array.from(document.querySelectorAll('a[href*="instagram.com"]'))) {
          const href = (a as HTMLAnchorElement).href;
          if (!href.includes("instagram.com/p/") && !href.includes("instagram.com/reel")) {
            const match = href.match(/instagram\.com\/([^/?#]+)/);
            if (match && match[1] !== "accounts" && match[1] !== "explore") {
              data.instagram = "@" + match[1].replace(/\/$/, ""); break;
            }
          }
        }

        for (const a of Array.from(document.querySelectorAll('a[href*="facebook.com"]'))) {
          const href = (a as HTMLAnchorElement).href;
          if (!href.includes("facebook.com/sharer") && !href.includes("facebook.com/share")) {
            const match = href.match(/facebook\.com\/([^/?#]+)/);
            if (match && !["login", "home", "watch", "groups", "events", "pages"].includes(match[1])) {
              data.facebook = "fb.com/" + match[1].replace(/\/$/, ""); break;
            }
          }
        }

        return data;
      }, SKIP_EMAIL);

    const pageData = await extractFromPage();
    Object.assign(result, pageData);

    if (!result.email) {
      for (const path of ["/contacto", "/contact"]) {
        try {
          await page.goto(new URL(path, websiteUrl).href, { waitUntil: "domcontentloaded", timeout: 5000 });
          const contactData = await extractFromPage();
          if (contactData.email) { result.email = contactData.email; break; }
        } catch { /* continue */ }
      }
    }
  } catch { /* ignore */ } finally {
    await page.close();
  }
  return result;
}

async function fetchDetail(context: BrowserContext, href: string): Promise<DetailResult> {
  const page = await context.newPage();
  try {
    await page.goto(href, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);

    const detail = await page.evaluate(() => {
      // ── Phone ──────────────────────────────────────────────────────────
      let phone = "";
      // data-item-id="phone" is stable
      const phoneContainer = document.querySelector('[data-item-id="phone"]');
      if (phoneContainer) {
        phone = phoneContainer.textContent?.trim().match(/[+\d][\d\s\-(). ]{5,20}/)?.[0]?.trim() || "";
      }
      if (!phone) {
        // aria-label on buttons often contains "Phone: +1 234..."
        for (const btn of Array.from(document.querySelectorAll("button[aria-label], [role='button'][aria-label]"))) {
          const label = btn.getAttribute("aria-label") || "";
          if (/phone|teléfono|telefono/i.test(label)) {
            const m = label.match(/([+\d][\d\s\-(). ]{5,20})/);
            if (m) { phone = m[1].trim(); break; }
          }
        }
      }
      if (!phone) {
        // Last resort: any button whose visible text looks like a phone number
        for (const btn of Array.from(document.querySelectorAll("button"))) {
          const txt = btn.textContent?.trim() || "";
          if (/^[+\d][\d\s\-(). ]{6,}$/.test(txt)) { phone = txt; break; }
        }
      }

      // ── Address ────────────────────────────────────────────────────────
      let address = "";
      const addrContainer = document.querySelector('[data-item-id^="oh-"] [class]');
      if (addrContainer) {
        address = addrContainer.textContent?.trim() || "";
      }
      if (!address) {
        for (const btn of Array.from(document.querySelectorAll("button[aria-label], [role='button'][aria-label]"))) {
          const label = btn.getAttribute("aria-label") || "";
          if (/address|dirección|direccion/i.test(label)) {
            address = label.replace(/^(address|dirección|direccion):\s*/i, "").trim();
            if (address.length > 5) break;
          }
        }
      }

      // ── Website ────────────────────────────────────────────────────────
      let website = "";
      // data-item-id="authority" is the most reliable for the official website link
      const wsLink = document.querySelector('a[data-item-id="authority"]') as HTMLAnchorElement | null;
      if (wsLink) {
        website = wsLink.href;
      }
      if (!website) {
        for (const btn of Array.from(document.querySelectorAll("a[aria-label], button[aria-label]"))) {
          const label = btn.getAttribute("aria-label") || "";
          if (/website|sitio web|web site/i.test(label)) {
            const a = btn.tagName === "A" ? btn as HTMLAnchorElement : btn.querySelector("a") as HTMLAnchorElement | null;
            if (a?.href && !a.href.includes("google.com")) { website = a.href; break; }
          }
        }
      }

      // ── Hours ──────────────────────────────────────────────────────────
      let hours = "";
      for (const el of Array.from(document.querySelectorAll("[aria-label]"))) {
        const label = el.getAttribute("aria-label") || "";
        if (/open|close|abierto|cierra|horario|hours/i.test(label) && label.length > 5 && label.length < 200) {
          hours = label.substring(0, 100);
          break;
        }
      }

      // ── Description ────────────────────────────────────────────────────
      let description = "";
      const aboutSection = document.querySelector('[aria-label*="About" i] [class], [aria-label*="Acerca" i] [class]');
      if (aboutSection) {
        description = ((aboutSection as HTMLElement).innerText || "").trim().substring(0, 300);
      }

      // ── Price level ────────────────────────────────────────────────────
      let priceLevel = "";
      for (const el of Array.from(document.querySelectorAll("[aria-label]"))) {
        const label = el.getAttribute("aria-label") || "";
        const m = label.match(/[\$€£]{1,4}/);
        if (m && label.length < 30) { priceLevel = m[0]; break; }
      }

      // ── Social links ───────────────────────────────────────────────────
      let instagram = "";
      let facebook = "";
      for (const a of Array.from(document.querySelectorAll("a[href*='instagram.com']"))) {
        const h = (a as HTMLAnchorElement).href;
        const m = h.match(/instagram\.com\/([^/?#]+)/);
        if (m && !["p", "reel", "accounts", "explore"].includes(m[1])) {
          instagram = "@" + m[1].replace(/\/$/, ""); break;
        }
      }
      for (const a of Array.from(document.querySelectorAll("a[href*='facebook.com']"))) {
        const h = (a as HTMLAnchorElement).href;
        if (!h.includes("sharer") && !h.includes("share.php")) {
          const m = h.match(/facebook\.com\/([^/?#]+)/);
          if (m && !["login","home","watch","groups","events","pages","profile.php"].includes(m[1])) {
            facebook = "fb.com/" + m[1].replace(/\/$/, ""); break;
          }
        }
      }

      return { phone, address, website, hours, description, priceLevel, instagram, facebook };
    });

    // WhatsApp from Maps
    let whatsapp = "";
    const waHrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"]'))
        .map((a) => (a as HTMLAnchorElement).href)
    );
    if (waHrefs.length > 0) {
      const match = waHrefs[0].match(/wa\.me\/(\d+)|phone=(\d+)/);
      if (match) whatsapp = "+" + (match[1] || match[2]);
    }

    // Scrape website for more data
    let email = "";
    let websiteData: WebsiteData = { email: "", whatsapp: "", instagram: "", facebook: "" };
    if (detail.website) {
      websiteData = await scrapeWebsite(context, detail.website);
      email = websiteData.email;
      if (!whatsapp && websiteData.whatsapp) whatsapp = websiteData.whatsapp;
      if (!detail.instagram && websiteData.instagram) detail.instagram = websiteData.instagram;
      if (!detail.facebook && websiteData.facebook) detail.facebook = websiteData.facebook;
    }

    return { ...detail, email, whatsapp, mapsUrl: href };
  } catch {
    return { phone: "", address: "", website: "", email: "", whatsapp: "", instagram: "", facebook: "", hours: "", description: "", priceLevel: "", mapsUrl: href };
  } finally {
    await page.close();
  }
}

export async function scrapeGoogleMaps(
  context: BrowserContext,
  options: ScraperOptions
): Promise<ScrapedLead[]> {
  const { query, location, count, type } = options;

  const searchQuery = type === "personas" && query ? `${query} profesional` : query;
  const searchTerm = [searchQuery, location].filter(Boolean).join(" ");

  const naKeywords = /\b(usa|united states|estados unidos|new york|miami|los angeles|chicago|houston|phoenix|dallas|san diego|denver|seattle|boston|atlanta|toronto|canada|montreal|vancouver)\b/i;
  const locale = naKeywords.test(location) ? "en-US" : "es-419";
  const lang = locale === "en-US" ? "en" : "es";

  const page = await context.newPage();
  try {
    await page.goto(
      `https://www.google.com/maps/search/${encodeURIComponent(searchTerm)}?hl=${lang}`,
      { waitUntil: "domcontentloaded", timeout: 30000 }
    );

    // Dismiss cookie/consent dialog — try all known Google variants
    const consentSelectors = [
      'button:has-text("Accept all")',
      'button:has-text("Aceptar todo")',
      'button:has-text("Accept")',
      'button:has-text("Aceptar")',
      'button:has-text("Agree")',
      'button:has-text("I agree")',
      '[aria-label="Accept all"]',
      'form[action*="consent"] button',
    ];
    for (const sel of consentSelectors) {
      const clicked = await page.locator(sel).first()
        .click({ timeout: 2000 }).then(() => true).catch(() => false);
      if (clicked) { await page.waitForTimeout(500); break; }
    }

    // Wait for results feed — if it never appears, the scraper bails cleanly
    const feedHandle = await page.waitForSelector('[role="feed"]', { timeout: 15000 }).catch(() => null);
    if (!feedHandle) {
      console.warn("[google-maps] Feed not found after 15s — possible consent wall or block. Query:", searchTerm);
      return [];
    }
    await page.waitForTimeout(1000);

    // Scroll to load more results
    const feed = page.locator('[role="feed"]');
    for (let i = 0; i < 8; i++) {
      const prevCount = await page.locator('[role="feed"] a[href*="/maps/place/"]').count();
      await feed.evaluate((el) => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; }).catch(() => {});
      await page.waitForTimeout(800);
      const newCount = await page.locator('[role="feed"] a[href*="/maps/place/"]').count();
      if (newCount === prevCount || newCount >= count * 2 + 10) break;
    }

    // Extract stubs using stable selectors
    const stubs: CardStub[] = await page.evaluate((maxCount: number) => {
      const results: CardStub[] = [];
      const feed = document.querySelector('[role="feed"]');
      if (!feed) return results;

      const seenHrefs = new Set<string>();
      // Each result card has an <a> linking to the place — aria-label = business name
      const anchors = Array.from(feed.querySelectorAll('a[href*="/maps/place/"]')) as HTMLAnchorElement[];

      let idx = 1;
      for (const anchor of anchors) {
        if (results.length >= maxCount) break;
        const href = anchor.href.split("?")[0]; // normalize
        if (!href || seenHrefs.has(href)) continue;
        seenHrefs.add(href);

        // Name: prefer aria-label on the anchor, else first non-empty heading text inside card
        const name = anchor.getAttribute("aria-label")?.trim() ||
                     anchor.querySelector('[role="heading"]')?.textContent?.trim() ||
                     anchor.textContent?.trim().split("\n")[0] || "";
        if (!name || name.length < 2) continue;

        // Walk up to the card container
        const card = anchor.closest('[role="article"]') || anchor.closest("li") || anchor.parentElement || anchor;

        let rating = 0;
        let reviews = 0;
        let category = "Business";
        let address = "";

        // Rating from aria-label like "4.5 stars" / "4.5 estrellas"
        const ratingEl = (card as Element).querySelector('[aria-label*="star" i],[aria-label*="estrella" i]');
        if (ratingEl) {
          const m = (ratingEl.getAttribute("aria-label") || "").match(/(\d+[.,]\d*|\d+)/);
          if (m) rating = parseFloat(m[1].replace(",", "."));
        }
        // Reviews count in parentheses
        const reviewsEl = (card as Element).querySelector('[aria-label*="review" i],[aria-label*="reseña" i],[aria-label*="opiniones" i]');
        if (reviewsEl) {
          const m = (reviewsEl.getAttribute("aria-label") || reviewsEl.textContent || "").match(/(\d[\d,\.]*)/);
          if (m) reviews = parseInt(m[1].replace(/[,\.]/g, ""), 10);
        }

        // Category & address from visible text lines (split by "·")
        const allText = (card as HTMLElement).innerText || "";
        const lines = allText.split("\n").map((s) => s.trim()).filter(Boolean);
        // First line is usually the name; look for category in subsequent lines
        for (const line of lines.slice(1)) {
          const parts = line.split("·").map((s) => s.trim()).filter(Boolean);
          for (const part of parts) {
            if (!category || category === "Business") {
              if (!/^\d/.test(part) && part.length > 2 && part.length < 50 && !/open|close|abierto|cierra/i.test(part)) {
                category = part;
              }
            }
            if (!address && /\d/.test(part) && part.length > 5) {
              address = part;
            }
          }
        }

        results.push({ id: idx++, name, category, address, rating, reviews, href: anchor.href });
      }
      return results;
    }, count);

    if (stubs.length === 0) {
      // Fallback: try old class-based extraction
      const fallback: CardStub[] = await page.evaluate((maxCount: number) => {
        const results: CardStub[] = [];
        const cards = document.querySelectorAll('[role="feed"] > div');
        let idx = 1;
        for (const card of Array.from(cards)) {
          if (results.length >= maxCount) break;
          const anchor = card.querySelector("a[href*='/maps/place/']") as HTMLAnchorElement | null;
          if (!anchor?.href) continue;
          const name = card.querySelector(".fontHeadlineSmall, [class*='fontHeadline'], .qBF1Pd")?.textContent?.trim() ||
                       anchor.getAttribute("aria-label")?.trim() || "";
          if (!name || name.length < 2) continue;
          const rating = parseFloat((card.querySelector(".MW4etd, [class*='stars']")?.textContent || "0").replace(",", ".")) || 0;
          const reviews = parseInt((card.querySelector(".UY7F9")?.textContent || "0").replace(/\D/g, ""), 10) || 0;
          let category = "Business";
          const address = "";
          const lines = card.querySelectorAll(".W4Efsd, [class*='fontBody']");
          if (lines.length > 0) {
            const parts = (lines[0]?.textContent?.trim() || "").split("·").map((s) => s.trim()).filter(Boolean);
            if (parts.length > 0 && !/^\d/.test(parts[0])) category = parts[0];
          }
          results.push({ id: idx++, name, category, address, rating, reviews, href: anchor.href });
        }
        return results;
      }, count);
      stubs.push(...fallback);
    }

    const leads: ScrapedLead[] = stubs.map((s) => ({
      ...s, phone: "", email: "", website: "", whatsapp: "",
      instagram: "", facebook: "", hours: "", description: "", priceLevel: "", mapsUrl: s.href,
    }));

    // Enrich details in batches
    for (let i = 0; i < leads.length; i += DETAIL_CONCURRENCY) {
      const batch = leads.slice(i, i + DETAIL_CONCURRENCY);
      await Promise.all(batch.map(async (lead, bi) => {
        const href = stubs[i + bi]?.href;
        if (!href) return;
        const d = await fetchDetail(context, href);
        lead.phone       = d.phone;
        lead.website     = d.website;
        lead.email       = d.email;
        lead.whatsapp    = d.whatsapp;
        lead.instagram   = d.instagram;
        lead.facebook    = d.facebook;
        lead.hours       = d.hours;
        lead.description = d.description;
        lead.priceLevel  = d.priceLevel;
        lead.mapsUrl     = d.mapsUrl || href;
        if (d.address && d.address.length > lead.address.length) lead.address = d.address;
      }));
    }

    return leads;
  } finally {
    await page.close();
  }
}
