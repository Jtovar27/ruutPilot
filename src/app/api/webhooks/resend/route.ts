import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Resend sends webhook events — we use them to track email opens/clicks/bounces.
// Set RESEND_WEBHOOK_SECRET in .env.local (from Resend dashboard → Webhooks).
// Resend signs payloads with svix — for MVP we verify by secret header match.
export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[resend webhook] RESEND_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }
    console.warn("[resend webhook] RESEND_WEBHOOK_SECRET not set — skipping verification (dev only)");
  } else {
    const incomingSecret = req.headers.get("resend-signature") ?? req.headers.get("x-resend-signature");
    if (incomingSecret !== secret) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const body = await req.json() as { type: string; data: Record<string, unknown> };
  const { type, data } = body;

  const emailId = data?.email_id as string | undefined;
  if (!emailId) return NextResponse.json({ ok: true });

  const STATUS_MAP: Record<string, string> = {
    "email.delivered":  "delivered",
    "email.opened":     "opened",
    "email.clicked":    "clicked",
    "email.bounced":    "bounced",
    "email.complained": "spam",
  };

  const newStatus = STATUS_MAP[type];
  if (!newStatus) return NextResponse.json({ ok: true });

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("emails_sent")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("resend_id", emailId);
  if (error) {
    console.error(`[resend webhook] Failed to update email status for ${emailId}:`, error);
  }

  return NextResponse.json({ ok: true });
}
