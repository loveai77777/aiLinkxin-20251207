import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from("tags")
      .select("id, label")
      .order("label");

    if (error) {
      console.error("Error fetching tags:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      tags: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { label } = await request.json();
    const supabase = createAdminSupabaseClient();

    if (!label || !label.trim()) {
      return NextResponse.json(
        { ok: false, error: "Tag label is required" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const { data: existing } = await supabase
      .from("tags")
      .select("id, label")
      .ilike("label", label.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        ok: true,
        tag: existing,
      });
    }

    // Generate slug from label
    const slug = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Create new tag
    const { data, error } = await supabase
      .from("tags")
      .insert({ label: label.trim(), slug })
      .select("id, label")
      .single();

    if (error) {
      console.error("Error creating tag:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      tag: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

