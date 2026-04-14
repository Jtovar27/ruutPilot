import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/auth";

export async function GET() {
  const { userId, unauthorized } = await getAuthUser();
  if (!userId || unauthorized) return unauthorized ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("searches")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { userId, unauthorized } = await getAuthUser();
  if (!userId || unauthorized) return unauthorized ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { business_type, location, keywords, total_keywords } = body;

  if (!business_type || !location || !keywords || !total_keywords) {
    return NextResponse.json(
      { error: "Missing required fields: business_type, location, keywords, total_keywords" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("searches")
    .insert({
      user_id: userId,
      business_type,
      location,
      keywords,
      total_keywords,
      completed_keywords: 0,
      current_keyword: null,
      results: [],
      rejected_categories: [],
      status: "running",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
