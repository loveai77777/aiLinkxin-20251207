import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await request.json();
    const supabase = createAdminSupabaseClient();
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: payload.updated_at || new Date().toISOString(),
    };

    if (payload.name !== undefined) {
      updateData.name = payload.name;
    }
    if (payload.slug !== undefined) {
      updateData.slug = payload.slug;
    }
    if (payload.short_description !== undefined) {
      updateData.short_description = payload.short_description;
    }
    if (payload.category !== undefined) {
      updateData.category = payload.category;
    }
    if (payload.tags !== undefined) {
      updateData.tags = payload.tags;
    }
    if (payload.content_markdown !== undefined) {
      updateData.content_markdown = payload.content_markdown;
    }
    if (payload.status !== undefined) {
      updateData.status = payload.status;
    }

    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId);

    if (error) {
      console.error("Error updating product:", error);
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

