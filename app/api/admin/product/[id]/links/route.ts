import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { links } = await request.json();
    const supabase = createAdminSupabaseClient();
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    if (!Array.isArray(links) || links.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase
      .from("picks_product_links")
      .insert(links);

    if (error) {
      console.error("Error creating product links:", error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminSupabaseClient();
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("picks_product_links")
      .delete()
      .eq("product_id", productId);

    if (error) {
      console.error("Error deleting product links:", error);
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









