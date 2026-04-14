import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { groqChat } from "@/lib/groq";
import { getUserPlan, PLAN_LIMITS, type Plan } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const { userId, email, unauthorized } = await getAuthUser();
  if (unauthorized || !userId) return unauthorized!;

  const plan: Plan = await getUserPlan(userId, email);
  const keywordLimits: Record<Plan, number> = { free: 5, pro: 15, agency: 30 };
  const keywordCount = keywordLimits[plan];

  let body: { businessType?: string; location?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { businessType, location } = body;
  if (!businessType || typeof businessType !== "string") {
    return NextResponse.json(
      { error: "businessType is required and must be a string" },
      { status: 400 },
    );
  }

  const locationContext = location
    ? `The business operates in or near "${location}". Generate keywords in the language most appropriate for that location.`
    : "Generate keywords in English by default.";

  const prompt = `You are a lead-generation expert. A user offers "${businessType}" as their service. Your job is to generate Google Maps search keywords to find their potential CUSTOMERS — the businesses and people who would PAY FOR or HIRE this service.

CRITICAL RULES:
- Do NOT generate keywords about "${businessType}" itself — that finds COMPETITORS, not clients.
- Generate keywords for the TYPES OF BUSINESSES that would NEED to hire a "${businessType}" provider.
- Think: "Who pays for ${businessType}? What kind of business or organization contracts this service?"
- Each keyword MUST be a SPECIFIC business type that would appear on Google Maps
- AVOID generic or ambiguous terms. Be as specific as possible.
- Use the full official name of business types, not abbreviations
- Include "${location || "near me"}" context where helpful to improve Google Maps accuracy

BAD EXAMPLES (too generic, will match wrong businesses):
- "centers" — too vague
- "services" — too vague
- "rehabilitation" — could match construction rehab companies
- "care" — too broad
- "facilities" — too generic, matches warehouses and storage

GOOD EXAMPLES (specific, will match correct businesses on Google Maps):
- "skilled nursing facility" instead of "nursing home"
- "assisted living community" instead of "assisted living"
- "pediatric medical clinic" instead of "clinic"
- "home health care agency" instead of "home health"
- "outpatient physical therapy center" instead of "rehabilitation"

EXAMPLE: If the service is "Mobile Phlebotomy":
- WRONG keywords: "mobile phlebotomy", "blood draw service", "phlebotomist" (these find competitors!)
- CORRECT keywords: "skilled nursing facility", "assisted living community", "home health care agency", "outpatient rehabilitation center", "family medicine practice", "urgent care clinic" (these find potential CLIENTS who need phlebotomy services!)

EXAMPLE: If the service is "Web Development":
- WRONG: "web developer", "web design agency" (competitors!)
- CORRECT: "family restaurant", "personal injury law firm", "cosmetic dental clinic", "residential real estate agency", "fitness gym", "auto body repair shop" (businesses that NEED a website!)

Business type: "${businessType}"
${locationContext}

Generate exactly ${keywordCount} B2B keywords (businesses/organizations that would hire this service) and exactly ${keywordCount} B2C keywords (individual people who would pay for this service).

Each keyword should be a VERY SPECIFIC type of business, organization, or person — NOT the service itself. These keywords will be searched on Google Maps to find leads. Use full descriptive names that Google Maps would recognize as a business category.

Also suggest 3-5 broad industry categories these clients fall into.

Respond with valid JSON only:
{
  "keywords": ["all keywords combined"],
  "b2bKeywords": ["type of business that needs this service 1", "type of business 2", ...],
  "b2cKeywords": ["type of individual who needs this service 1", ...],
  "businessType": "${businessType}",
  "suggestedCategories": ["Category1", "Category2"]
}`;

  try {
    const raw = await groqChat(prompt, { json: true, maxTokens: 1024 });
    const data = JSON.parse(raw);

    return NextResponse.json({ ...data, plan, keywordLimit: keywordCount });
  } catch (err) {
    console.error("Groq keyword generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate keywords" },
      { status: 500 },
    );
  }
}
