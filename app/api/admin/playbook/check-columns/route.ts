import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();

    // Try to query status column
    const { error } = await supabase
      .from("playbooks")
      .select("status")
      .limit(1);

    return NextResponse.json({
      hasStatus: !error, // If no error, status column exists
    });
  } catch (error) {
    return NextResponse.json({
      hasStatus: false,
    });
  }
}




