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
    if (payload.summary !== undefined) {
      insertData.summary = payload.summary;
    }
    if (payload.content_markdown !== undefined) {
      insertData.content_markdown = payload.content_markdown;
    }
    if (payload.cover_image_url !== undefined) {
      insertData.cover_image_url = payload.cover_image_url;
    }
    if (payload.status !== undefined) {
      insertData.status = payload.status;
      if (payload.status === "published" && payload.published_at) {
        insertData.published_at = payload.published_at;
      }
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

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

