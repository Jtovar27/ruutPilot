import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";

export async function GET() {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("leads")
    .insert({ ...body, user_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
