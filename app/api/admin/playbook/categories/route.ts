import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();
    
    const { data, error } = await supabase
      .from("playbook_categories")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      categories: data || [],
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
    const body = await request.json();
    const name = body?.name;
    const supabase = createAdminSupabaseClient();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Check if category already exists (by name)
    const { data: existingByName } = await supabase
      .from("playbook_categories")
      .select("id, name")
      .ilike("name", name.trim())
      .maybeSingle();

    if (existingByName) {
      return NextResponse.json({
        ok: true,
        category: existingByName,
      });
    }

    // Check if category with same slug exists
    const { data: existingBySlug } = await supabase
      .from("playbook_categories")
      .select("id, name")
      .eq("slug", slug)
      .maybeSingle();

    if (existingBySlug) {
      return NextResponse.json({
        ok: true,
        category: existingBySlug,
      });
    }

    // Create new category with slug
    const { data, error } = await supabase
      .from("playbook_categories")
      .insert({ name: name.trim(), slug })
      .select("id, name")
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      category: data,
    });
  } catch (error: any) {
    console.error("Error in POST /api/admin/playbook/categories:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

