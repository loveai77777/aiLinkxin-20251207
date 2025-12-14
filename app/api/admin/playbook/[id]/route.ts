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
      .select("id, slug, title, subtitle, summary, content_markdown, cover_image_url, status, category_id, updated_at, reading_minutes")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: "Playbook not found" },
        { status: 404 }
      );
    }

    // Get tags
    let tagIds: number[] = [];
    let tags = "";
    try {
      const { data: tagData } = await supabase
        .from("playbook_tags")
        .select("tag_id, tags!tag_id(id, label)")
        .eq("playbook_id", id);
      
      if (tagData) {
        tagIds = tagData.map((t: any) => t.tag_id).filter(Boolean);
        tags = tagData.map((t: any) => t.tags?.label || "").filter(Boolean).join(", ");
      }
    } catch (err) {
      // Tags table might not exist or have different structure
    }

    const response = NextResponse.json({
      ok: true,
      playbook: {
        ...data,
        excerpt: data.summary,
        content: data.content_markdown,
        tags,
        tagIds,
      },
    });
    
    // Disable caching to ensure fresh data
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    
    return response;
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
    if (payload.subtitle !== undefined) {
      updateData.subtitle = payload.subtitle;
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
    if (payload.reading_minutes !== undefined) {
      updateData.reading_minutes = payload.reading_minutes;
    }
    if (payload.category_id !== undefined) {
      updateData.category_id = payload.category_id;
    }
    if (payload.status !== undefined) {
      updateData.status = payload.status;
      // Set published_at when status changes to 'published'
      if (payload.status === "published" && !updateData.published_at) {
        updateData.published_at = payload.published_at || new Date().toISOString();
      }
      // Clear published_at when status changes to 'draft'
      if (payload.status === "draft") {
        updateData.published_at = null;
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

    // Update tags if provided
    if (payload.tagIds !== undefined && Array.isArray(payload.tagIds)) {
      // Remove existing tags
      await supabase.from("playbook_tags").delete().eq("playbook_id", id);
      
      // Add new tags
      if (payload.tagIds.length > 0) {
        const playbookTags = payload.tagIds.map((tagId: number) => ({
          playbook_id: id,
          tag_id: tagId,
        }));
        await supabase.from("playbook_tags").insert(playbookTags);
      }
    }

    const response = NextResponse.json({ ok: true });
    
    // Disable caching
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


