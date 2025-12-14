import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();
    const supabase = createAdminSupabaseClient();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid category ID" },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const { error } = await supabase
      .from("playbook_categories")
      .update({ name: name.trim(), slug })
      .eq("id", id);

    if (error) {
      console.error("Error updating category:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // First, remove category from all playbooks
    await supabase
      .from("playbooks")
      .update({ category_id: null })
      .eq("category_id", id);

    // Then delete the category
    const { error } = await supabase
      .from("playbook_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

