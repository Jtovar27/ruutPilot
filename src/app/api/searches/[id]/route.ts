import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, unauthorized } = await getAuthUser();
  if (!userId || unauthorized) return unauthorized ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from("searches")
    .select("id, user_id, results")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Search not found" }, { status: 404 });
  }
  if (existing.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const allowedFields = ["status", "completed_keywords", "current_keyword", "rejected_categories"];
  const updatePayload: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updatePayload[field] = body[field];
    }
  }

  // For results: append new results to existing ones
  if (body.results !== undefined) {
    const existingResults = Array.isArray(existing.results) ? existing.results : [];
    const newResults = Array.isArray(body.results) ? body.results : [];
    updatePayload.results = [...existingResults, ...newResults];
  }

  updatePayload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("searches")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, unauthorized } = await getAuthUser();
  if (!userId || unauthorized) return unauthorized ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createAdminClient();

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from("searches")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Search not found" }, { status: 404 });
  }
  if (existing.user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("searches").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
