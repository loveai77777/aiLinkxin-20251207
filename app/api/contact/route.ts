import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface ContactRequestBody {
  fullName: string;
  email: string;
  interestedIn?: string;
  phone?: string;
  companyName?: string;
  website?: string;
  message?: string;
}

/**
 * POST /api/contact
 * Handle contact form submission: insert to Supabase, then trigger n8n webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();

    // Compatible field name reading with fallback
    const fullName = (body.fullName ?? body.name ?? "").trim();
    const email = (body.email ?? body.workEmail ?? "").trim();
    const message = (body.message ?? body.notes ?? "").trim();

    // Basic validation - fullName, email, message are required (after trim)
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full Name, Email, and Message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Convert interestedIn to array format if provided
    let interestedInArray: string[] | null = null;
    if (body.interestedIn && typeof body.interestedIn === "string" && body.interestedIn.trim()) {
      interestedInArray = [body.interestedIn.trim()];
    }

    // Insert into Supabase using admin client to bypass RLS
    const supabase = createAdminSupabaseClient();
    const { data: insertedData, error: insertError } = await supabase
      .from("connect_contact_submissions")
      .insert({
        full_name: fullName,
        work_email: email, // Changed from email to work_email
        phone: body.phone || null,
        company_name: body.companyName || null,
        website: body.website || null, // No URL validation - accept any string
        message: message,
        interested_in: interestedInArray, // Convert to array format
        role_title: body.roleTitle || null,
        status: "new", // Default status
        notify_status: "pending", // Default notify_status
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save submission: " + insertError.message },
        { status: 500 }
      );
    }

    const recordId = insertedData?.id;

    if (!recordId) {
      console.error("Supabase insert succeeded but no record_id returned");
      return NextResponse.json(
        { error: "Failed to get record ID after insert" },
        { status: 500 }
      );
    }

    // Trigger n8n webhook (non-blocking with timeout)
    // Support both N8N_WEBHOOK_URL and N8N_CONTACT_WEBHOOK_URL
    const N8N_WEBHOOK_URL =
      process.env.N8N_WEBHOOK_URL ||
      process.env.N8N_CONTACT_WEBHOOK_URL ||
      "https://n8n.ailinkxin.com/webhook/ailinkxin-contact-lead";

    if (N8N_WEBHOOK_URL) {
      try {
        console.log("n8n webhook triggered for record_id:", recordId);
        
        // Create AbortController for timeout (5-8 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        // Prepare webhook payload with all form data
        const webhookPayload = {
          record_id: recordId,
          // Include all form fields from the inserted record
          full_name: insertedData.full_name,
          work_email: insertedData.work_email,
          phone: insertedData.phone,
          company_name: insertedData.company_name,
          website: insertedData.website,
          message: insertedData.message,
          interested_in: insertedData.interested_in,
          role_title: insertedData.role_title,
          status: insertedData.status,
          notify_status: insertedData.notify_status,
          created_at: insertedData.created_at,
          // 商户区分
          shop_id: "ART_SPA_001",
          // Also include original form field names for compatibility
          fullName: fullName,
          email: email,
          phoneNumber: body.phone || null,
          companyName: body.companyName || null,
          websiteUrl: body.website || null,
          messageText: message,
          interestedIn: body.interestedIn || null,
        };

        console.log("n8n webhook payload:", JSON.stringify(webhookPayload, null, 2));

        const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("n8n webhook status:", webhookResponse.status);

        if (webhookResponse.ok) {
          // Update notify_status to 'sent' and set notified_at
          await supabase
            .from("connect_contact_submissions")
            .update({ 
              notify_status: "sent",
              notified_at: new Date().toISOString(),
            })
            .eq("id", recordId);
          console.log("n8n webhook sent successfully for record_id:", recordId);
        } else {
          const errorText = await webhookResponse.text().catch(() => "");
          console.error(
            "n8n webhook error:",
            webhookResponse.status,
            webhookResponse.statusText,
            errorText
          );
          // Update notify_status to 'failed'
          await supabase
            .from("connect_contact_submissions")
            .update({ notify_status: "failed" })
            .eq("id", recordId);
        }
      } catch (webhookError: any) {
        if (webhookError.name === "AbortError") {
          console.error("n8n webhook timeout after 8 seconds for record_id:", recordId);
        } else {
          console.error("n8n webhook error for record_id:", recordId, webhookError);
        }
        // Update notify_status to 'failed' on error
        await supabase
          .from("connect_contact_submissions")
          .update({ notify_status: "failed" })
          .eq("id", recordId);
        // Don't fail the request if webhook fails - continue to return success
      }
    } else {
      console.warn("N8N_WEBHOOK_URL is not configured, webhook not triggered.");
    }

    return NextResponse.json(
      { ok: true, id: recordId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

