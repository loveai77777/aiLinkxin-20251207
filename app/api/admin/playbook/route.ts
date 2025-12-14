import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const supabase = createAdminSupabaseClient();

    // Only include fields that exist in the payload
    const insertData: any = {
      title: payload.title,
      slug: payload.slug,
      updated_at: payload.updated_at || new Date().toISOString(),
    };

    // Add optional fields only if provided
    if (payload.subtitle !== undefined) {
      insertData.subtitle = payload.subtitle;
    }
    if (payload.summary !== undefined) {
      insertData.summary = payload.summary;
    }
    if (payload.content_markdown !== undefined) {
      insertData.content_markdown = payload.content_markdown;
    }
    if (payload.cover_image_url !== undefined) {
      insertData.cover_image_url = payload.cover_image_url;
    }
    if (payload.reading_minutes !== undefined) {
      insertData.reading_minutes = payload.reading_minutes;
    }
    // Set status (default to 'draft' if not provided)
    insertData.status = payload.status || "draft";
    
    // Set category_id if provided
    if (payload.category_id !== undefined) {
      insertData.category_id = payload.category_id;
    }
    
    // Set published_at when status is 'published'
    if (insertData.status === "published") {
      insertData.published_at = payload.published_at || new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("playbooks")
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      console.error("Error creating playbook:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    // Save tags if provided
    if (payload.tagIds && Array.isArray(payload.tagIds) && payload.tagIds.length > 0) {
      const playbookTags = payload.tagIds.map((tagId: number) => ({
        playbook_id: data.id,
        tag_id: tagId,
      }));

      await supabase.from("playbook_tags").insert(playbookTags);
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


