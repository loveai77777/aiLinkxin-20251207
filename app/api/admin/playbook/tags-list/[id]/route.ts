import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { label } = await request.json();
    const supabase = createAdminSupabaseClient();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid tag ID" },
        { status: 400 }
      );
    }

    if (!label || !label.trim()) {
      return NextResponse.json(
        { ok: false, error: "Tag label is required" },
        { status: 400 }
      );
    }

    // Generate slug from label
    const slug = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const { error } = await supabase
      .from("tags")
      .update({ label: label.trim(), slug })
      .eq("id", id);

    if (error) {
      console.error("Error updating tag:", error);
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
        { ok: false, error: "Invalid tag ID" },
        { status: 400 }
      );
    }

    // First, remove tag from all playbooks
    await supabase
      .from("playbook_tags")
      .delete()
      .eq("tag_id", id);

    // Then delete the tag
    const { error } = await supabase
      .from("tags")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting tag:", error);
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









