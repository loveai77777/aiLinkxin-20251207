import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const supabase = createAdminSupabaseClient();

    const insertData: any = {
      name: payload.name,
      slug: payload.slug,
      updated_at: payload.updated_at || new Date().toISOString(),
      created_at: payload.created_at || new Date().toISOString(),
    };

    // Add optional fields only if provided
    if (payload.short_description !== undefined) {
      insertData.short_description = payload.short_description;
    }
    if (payload.category !== undefined) {
      insertData.category = payload.category;
    }
    if (payload.tags !== undefined) {
      insertData.tags = payload.tags;
    }
    if (payload.content_markdown !== undefined) {
      insertData.content_markdown = payload.content_markdown;
    }
    
    // Set status (default to 'draft' if not provided)
    // Only include status if it's provided in payload (assumes column exists)
    if (payload.status !== undefined) {
      insertData.status = payload.status;
    } else {
      insertData.status = "draft";
    }

    const { data, error } = await supabase
      .from("products")
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      console.error("Error creating product:", error);
      // If error is about status column, try without it
      if (error.message && error.message.includes("status")) {
        delete insertData.status;
        const { data: retryData, error: retryError } = await supabase
          .from("products")
          .insert(insertData)
          .select("id")
          .single();
        
        if (retryError) {
          return NextResponse.json(
            { ok: false, error: retryError.message },
            { status: 500 }
          );
        }
        return NextResponse.json({ ok: true, id: retryData.id });
      }
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

