import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const supabase = createAdminClient();
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("pipeline_deals")
    .update(body)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, unauthorized } = await getAuthUser();
  if (unauthorized) return unauthorized;

  const supabase = createAdminClient();
  const { id } = await params;

  const { error } = await supabase
    .from("pipeline_deals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
