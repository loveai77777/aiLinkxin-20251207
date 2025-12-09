import { NextRequest, NextResponse } from "next/server";

interface LeadRequestBody {
  name: string;
  email: string;
  phone?: string;
  message: string;
  type: "consultation" | "download" | "affiliate" | "other";
  source?: string;
}

/**
 * 验证邮箱格式
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/lead
 * 处理线索收集表单提交
 */
export async function POST(request: NextRequest) {
  try {
    const body: LeadRequestBody = await request.json();

    // 基础校验
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // 验证 type 字段
    const validTypes = ["consultation", "download", "affiliate", "other"];
    if (!body.type || !validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: "Invalid form type" },
        { status: 400 }
      );
    }

    // 转发到 N8N Webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...body,
            submittedAt: new Date().toISOString(),
          }),
        });

        if (!webhookResponse.ok) {
          console.error(
            "Webhook 请求失败:",
            webhookResponse.status,
            webhookResponse.statusText
          );
          // 即使 webhook 失败，也返回成功（避免用户重复提交）
          // 实际生产环境中可以根据需求调整
        }
      } catch (webhookError) {
        console.error("Webhook 请求错误:", webhookError);
        // 继续执行，返回成功响应（避免用户重复提交）
      }
    } else {
      console.warn("N8N_WEBHOOK_URL 未配置，数据未转发");
    }

    return NextResponse.json(
      { success: true, message: "Submission successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("处理表单提交时出错:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}













