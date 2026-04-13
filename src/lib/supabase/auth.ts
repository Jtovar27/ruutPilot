import { createClient } from "./server";
import { NextResponse } from "next/server";

export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { userId: null, email: null, unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { userId: user.id, email: user.email ?? null, unauthorized: null };
}
