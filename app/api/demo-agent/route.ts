import { NextRequest, NextResponse } from "next/server";

interface DemoAgentRequestBody {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
  websiteUrl: string;
  industry: string;
}

/**
 * POST /api/demo-agent
 * Demo agent API route stub
 * This is a placeholder that can be replaced with a real LLM integration later
 */
export async function POST(request: NextRequest) {
  try {
    const body: DemoAgentRequestBody = await request.json();

    // Validate required fields
    if (!body.message || !body.industry) {
      return NextResponse.json({ error: "Message and industry are required" }, { status: 400 });
    }

    // TODO: Replace this with actual LLM/agent backend integration
    // For now, return a simple demo reply based on the industry
    const industryTemplates: Record<string, string> = {
      "beauty-spa":
        "This is a demo response from the beauty & spa front desk template. I can help with questions about facials, massages, packages, pricing, and booking appointments. Later this will be powered by your trained AI agent.",
      "hair-salon":
        "This is a demo response from the hair salon front desk template. I can help with questions about haircuts, styling, coloring, pricing, and booking appointments. Later this will be powered by your trained AI agent.",
      "massage-wellness":
        "This is a demo response from the massage & wellness front desk template. I can help with questions about massage types, wellness packages, pricing, and booking appointments. Later this will be powered by your trained AI agent.",
      "clinics-dentists":
        "This is a demo response from the clinics & dentists front desk template. I can help with questions about services, appointment scheduling, patient intake, and general inquiries. Later this will be powered by your trained AI agent.",
      "coaching-consulting":
        "This is a demo response from the coaching & consulting front desk template. I can help with questions about services, session scheduling, pricing, and lead qualification. Later this will be powered by your trained AI agent.",
    };

    const reply =
      industryTemplates[body.industry] ||
      "This is a demo response. Later this will be powered by your trained AI agent.";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("Demo agent API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}







