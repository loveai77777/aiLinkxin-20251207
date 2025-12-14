import { NextRequest, NextResponse } from "next/server";
import { submitComment } from "@/lib/playbook";

/**
 * POST /api/playbook/comments
 * 提交新评论
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playbookId, authorName, authorEmail, content } = body;

    // 验证必填字段
    if (!playbookId || !authorName || !content) {
      return NextResponse.json(
        { success: false, error: "Playbook ID, name, and comment are required" },
        { status: 400 }
      );
    }

    // 验证 playbookId 是数字
    const playbookIdNum = Number(playbookId);
    if (isNaN(playbookIdNum)) {
      return NextResponse.json(
        { success: false, error: "Invalid playbook ID" },
        { status: 400 }
      );
    }

    // 提交评论
    const result = await submitComment(
      playbookIdNum,
      authorName,
      authorEmail || null,
      content
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to submit comment" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Comment submitted successfully. It will be displayed after approval." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing comment submission:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}






