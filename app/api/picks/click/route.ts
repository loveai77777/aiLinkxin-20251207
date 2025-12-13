import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

/**
 * POST /api/picks/click
 * 
 * Records a click event in picks_product_clicks table
 * 
 * Body:
 * - productId: number
 * - productLinkId: number
 * - ref: string (e.g., "picks_list")
 */
export async function POST(request: NextRequest) {
  try {
    // Handle both JSON and Blob (from sendBeacon) formats
    let body;
    
    try {
      // Try to parse as JSON first (for fetch requests)
      body = await request.json();
    } catch {
      // If that fails, try as Blob (for sendBeacon requests)
      try {
        const blob = await request.blob();
        const text = await blob.text();
        body = JSON.parse(text);
      } catch (parseError) {
        return NextResponse.json(
          { error: "Invalid request body" },
          { status: 400 }
        );
      }
    }
    
    const { productId, productLinkId, ref } = body;

    // Validate required fields
    if (!productId || !productLinkId) {
      return NextResponse.json(
        { error: "productId and productLinkId are required" },
        { status: 400 }
      );
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const supabase = createSupabaseClient();

    // Insert into picks_product_clicks table
    const { error } = await supabase
      .from("picks_product_clicks")
      .insert({
        product_id: productId,
        product_link_id: productLinkId,
        ref: ref || "picks_list",
      });

    if (error) {
      console.error("Error recording click:", error);
      return NextResponse.json(
        { error: "Failed to record click", details: error.message },
        { status: 500 }
      );
    }

    // Return success
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in /api/picks/click:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

