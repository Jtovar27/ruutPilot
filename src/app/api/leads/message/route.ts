import { NextRequest, NextResponse } from "next/server";
import { groqChat } from "@/lib/groq";
import { getAuthUser } from "@/lib/supabase/auth";

export async function POST(req: NextRequest) {
  const { unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const { lead, businessProfile, channel, template } = await req.json();

  const channelInstructions: Record<string, string> = {
    whatsapp:
      "Write a short WhatsApp message (max 100 words). Casual but professional tone. No subject line needed.",
    email:
      "Write a professional email with subject line and body. Max 150 words for the body.",
    call: "Write a phone call script with: opening line, key talking points (3-4 bullets), and a closing/ask. Max 200 words total.",
  };

  const templateInstructions: Record<string, string> = {
    introduction:
      "This is a first-time introduction. Present yourself and your service briefly.",
    value_proposition:
      "Focus on the specific value you can bring to this type of business. Mention concrete benefits.",
    follow_up:
      "This is a follow-up message. Reference a previous contact attempt and offer something new.",
    referral:
      "Mention that someone referred you or that you noticed their business in the area.",
  };

  const prompt = `You are writing a ${channel} message for a business outreach.

SENDER INFO:
- Business: ${businessProfile.businessName}
- Service: ${businessProfile.businessType}
- Services offered: ${businessProfile.services?.join(", ") || businessProfile.businessType}
- Differentiators: ${businessProfile.differentiators?.join(", ") || "Professional service"}

RECIPIENT INFO:
- Business name: ${lead.name}
- Category: ${lead.category}
- Location: ${lead.address || "N/A"}
- Rating: ${lead.rating || "N/A"} (${lead.reviews || 0} reviews)

CHANNEL: ${channelInstructions[channel] || channelInstructions.email}
TEMPLATE: ${templateInstructions[template] || templateInstructions.introduction}

Write the message in English. Be specific about how the sender's service helps THIS type of business.

Respond with JSON:
{
  "subject": "email subject (only for email channel, empty string for others)",
  "message": "the complete message ready to send",
  "talkingPoints": ["point 1", "point 2"]
}

Only include talkingPoints for the call channel. For whatsapp and email, set talkingPoints to an empty array.`;

  try {
    const result = await groqChat(prompt, { maxTokens: 500, json: true });
    return NextResponse.json(JSON.parse(result));
  } catch {
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}
