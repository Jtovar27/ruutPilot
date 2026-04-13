import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = (user.user_metadata?.ruutpilot ?? {}) as Record<string, unknown>;
  return NextResponse.json({ ...settings, email: user.email });
}

export async function POST(req: NextRequest) {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const body = await req.json();

  // Only allow safe settings fields
  const allowed = ["service_type", "business_name", "price_per_project", "currency", "target_country"];
  const settings: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) settings[key] = body[key];
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId!, {
    user_metadata: { ruutpilot: settings },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
