import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";
import { getUserPlan, PLAN_LIMITS } from "@/lib/plans";

let resendClient: Resend | null = null;

function getResendClient() {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function POST(req: NextRequest) {
  const { userId, email: userEmail, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const plan = await getUserPlan(userId!, userEmail);
  if (PLAN_LIMITS[plan].emailsPerMonth === 0) {
    return NextResponse.json(
      { error: "upgrade_required", message: "El envío de emails requiere el plan Pro o Agencia." },
      { status: 402 }
    );
  }

  const { to, subject, body, leadId } = await req.json();

  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const { data, error } = await getResendClient().emails.send({
    from: "RuutPilot <noreply@ruutdev.com>",
    to: [to],
    subject,
    text: body,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const supabase = createAdminClient();
  const { error: insertError } = await supabase.from("emails_sent").insert({
    user_id: userId,
    lead_id: leadId ?? null,
    subject,
    body,
    to_email: to,
    status: "sent",
    resend_id: data?.id ?? null,
  });
  if (insertError) {
    // Email was sent — don't fail the request, but log for monitoring
    console.error("[email send] Failed to log sent email:", insertError);
  }

  return NextResponse.json({ id: data?.id });
}
