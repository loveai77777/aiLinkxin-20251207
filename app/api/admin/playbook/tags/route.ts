import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { playbook_id, tagIds } = await request.json();
    const supabase = createAdminSupabaseClient();

    if (!playbook_id || !Array.isArray(tagIds) || tagIds.length === 0) {
      return NextResponse.json({ ok: true }); // No tags to process
    }

    // Remove existing tags for this playbook
    await supabase
      .from("playbook_tags")
      .delete()
      .eq("playbook_id", playbook_id);

    // Add new tags
    if (tagIds.length > 0) {
      const playbookTags = tagIds.map((tagId: number) => ({
        playbook_id: playbook_id,
        tag_id: tagId,
      }));

      const { error: insertError } = await supabase.from("playbook_tags").insert(playbookTags);
      
      if (insertError) {
        console.error("Error inserting tags:", insertError);
        return NextResponse.json(
          { ok: false, error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    // Don't fail the request if tags fail
    return NextResponse.json({ ok: true });
  }
}


