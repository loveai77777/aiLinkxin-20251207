import { NextRequest, NextResponse } from "next/server";

interface ChatRequestBody {
  message: string;
  conversationId: string | null;
  metadata?: any;
}

interface ChatResponse {
  reply: string;
  conversationId: string;
}

/**
 * POST /api/ai-chat
 * AI 聊天代理接口，转发请求到 Dify 或其他 AI 服务
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();

    // 基础校验
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const difyApiBaseUrl = process.env.DIFY_API_BASE_URL;
    const difyApiKey = process.env.DIFY_API_KEY;

    if (!difyApiBaseUrl || !difyApiKey) {
      return NextResponse.json(
        { error: "AI service configuration incomplete" },
        { status: 500 }
      );
    }

    // 转发到 Dify API
    // 注意：这里是一个示例实现，实际 Dify API 的调用方式可能需要根据具体 API 文档调整
    try {
      const difyResponse = await fetch(`${difyApiBaseUrl}/chat-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${difyApiKey}`,
        },
        body: JSON.stringify({
          inputs: {},
          query: body.message,
          response_mode: "blocking",
          conversation_id: body.conversationId || undefined,
          user: "web-user",
        }),
      });

      if (!difyResponse.ok) {
        const errorData = await difyResponse.text();
        console.error("Dify API 错误:", difyResponse.status, errorData);
        return NextResponse.json(
          { error: "AI service temporarily unavailable" },
          { status: 500 }
        );
      }

      const difyData = await difyResponse.json();

      // 将 Dify 返回格式转换为统一格式
      // 注意：这里的转换逻辑需要根据实际 Dify API 返回格式调整
      const response: ChatResponse = {
        reply: difyData.answer || difyData.data?.answer || "Sorry, I cannot understand your question.",
        conversationId: difyData.conversation_id || difyData.data?.conversation_id || "",
      };

      return NextResponse.json(response, { status: 200 });
    } catch (difyError) {
      console.error("调用 Dify API 时出错:", difyError);
      return NextResponse.json(
        { error: "AI service connection failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("处理聊天请求时出错:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}













