import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid playbook ID" },
        { status: 400 }
      );
    }

    // Try to fetch all possible columns, but handle missing ones gracefully
    const { data, error } = await supabase
      .from("playbooks")
      .select("id, slug, title, summary, content_markdown, cover_image_url, status, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: "Playbook not found" },
        { status: 404 }
      );
    }

    // Try to get tags
    let tags = "";
    try {
      const { data: tagData } = await supabase
        .from("playbook_tags")
        .select("tags!tag_id(label)")
        .eq("playbook_id", id);
      
      if (tagData) {
        tags = tagData.map((t: any) => t.tags?.label || "").filter(Boolean).join(", ");
      }
    } catch (err) {
      // Tags table might not exist or have different structure
    }

    return NextResponse.json({
      ok: true,
      playbook: {
        ...data,
        excerpt: data.summary,
        content: data.content_markdown,
        tags,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await request.json();
    const supabase = createAdminSupabaseClient();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "Invalid playbook ID" },
        { status: 400 }
      );
    }

    // Only include fields that exist in the payload
    const updateData: any = {
      updated_at: payload.updated_at || new Date().toISOString(),
    };

    if (payload.title !== undefined) {
      updateData.title = payload.title;
    }
    if (payload.slug !== undefined) {
      updateData.slug = payload.slug;
    }
    if (payload.summary !== undefined) {
      updateData.summary = payload.summary;
    }
    if (payload.content_markdown !== undefined) {
      updateData.content_markdown = payload.content_markdown;
    }
    if (payload.cover_image_url !== undefined) {
      updateData.cover_image_url = payload.cover_image_url;
    }
    if (payload.status !== undefined) {
      updateData.status = payload.status;
      if (payload.status === "published" && payload.published_at) {
        updateData.published_at = payload.published_at;
      }
    }

    const { error } = await supabase
      .from("playbooks")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating playbook:", error);
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

