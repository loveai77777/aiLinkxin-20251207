import { NextRequest, NextResponse } from "next/server";

interface ChatRequestBody {
  message: string;
  conversationId?: string;
  userId?: string;
}

interface ChatResponse {
  reply: string;
  conversationId: string;
}

/**
 * 获取当前认证用户信息
 * 这里需要根据你的认证系统实现（JWT、Session、Supabase Auth 等）
 */
async function getAuthenticatedUser(request: NextRequest) {
  // 方法 1: 从 Authorization header 获取 JWT token
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    // TODO: 验证 JWT token 并返回用户信息
    // const decoded = await verifyToken(token);
    // return { id: decoded.userId, ...decoded };
  }

  // 方法 2: 从 cookies 获取 session
  const sessionToken = request.cookies.get("session")?.value;
  if (sessionToken) {
    // TODO: 验证 session 并返回用户信息
    // const session = await verifySession(sessionToken);
    // return session.user;
  }

  // 如果使用 Supabase Auth
  // import { createServerClient } from '@supabase/ssr'
  // const supabase = createServerClient(...)
  // const { data: { user } } = await supabase.auth.getUser()
  // return user;

  return null;
}

/**
 * POST /api/chat
 * 带用户授权检查的聊天接口
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 获取当前认证用户
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // 2. 解析请求体
    const body: ChatRequestBody = await request.json();

    // 3. 验证请求参数
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // 4. 验证用户 ID（如果请求中提供了 userId）
    if (body.userId && body.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized: User ID mismatch" },
        { status: 401 }
      );
    }

    // 5. 如果需要，验证用户是否有权限访问特定的对话
    if (body.conversationId) {
      // TODO: 从数据库检查该对话是否属于当前用户
      // const conversation = await getConversation(body.conversationId);
      // if (conversation.userId !== user.id) {
      //   return NextResponse.json(
      //     { error: "Unauthorized: Conversation access denied" },
      //     { status: 403 }
      //   );
      // }
    }

    // 6. 调用 AI 服务（Dify 或其他）
    const difyApiBaseUrl = process.env.DIFY_API_BASE_URL;
    const difyApiKey = process.env.DIFY_API_KEY;

    if (!difyApiBaseUrl || !difyApiKey) {
      return NextResponse.json(
        { error: "AI service configuration incomplete" },
        { status: 500 }
      );
    }

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
          // 使用真实用户 ID，而不是固定的 "web-user"
          user: user.id,
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

      const response: ChatResponse = {
        reply:
          difyData.answer ||
          difyData.data?.answer ||
          "Sorry, I cannot understand your question.",
        conversationId:
          difyData.conversation_id || difyData.data?.conversation_id || "",
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

/**
 * GET /api/chat
 * 获取用户的聊天历史（需要授权）
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // TODO: 从数据库获取该用户的聊天历史
    // const conversations = await getUserConversations(user.id);
    // return NextResponse.json({ conversations }, { status: 200 });

    return NextResponse.json(
      { message: "Feature not implemented yet" },
      { status: 501 }
    );
  } catch (error) {
    console.error("获取聊天历史时出错:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

