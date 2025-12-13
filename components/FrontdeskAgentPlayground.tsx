"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface LeadFormData {
  name: string;
  businessName: string;
  emailOrWhatsApp: string;
  mainGoal: string;
}

interface FrontdeskAgentPlaygroundProps {
  industryId: string;
  title: string;
  subtitle: string;
  initialMessage: string;
  chatHeaderTitle: string;
}

/**
 * Helper function to call the agent backend
 * This is the extension point for integrating a real LLM/agent backend (OpenAI, Dify, n8n, etc.)
 */
async function callDemoAgentBackend(params: {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
  websiteUrl: string;
  industry: string;
}): Promise<{ reply: string }> {
  const { message, history, websiteUrl, industry } = params;

  // Check if a real agent API URL is configured
  const agentApiUrl = process.env.NEXT_PUBLIC_AGENT_API_URL;

  if (agentApiUrl) {
    try {
      const response = await fetch(agentApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history,
          websiteUrl,
          industry,
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent API error: ${response.status}`);
      }

      const data = await response.json();
      return { reply: data.reply || data.message || "I'm sorry, I couldn't process that request." };
    } catch (error) {
      console.error("Agent API error:", error);
      // Fall back to mock response on error
    }
  }

  // Try to use internal API route if available
  try {
    const response = await fetch("/api/demo-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history,
        websiteUrl,
        industry,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { reply: data.reply || "I'm sorry, I couldn't process that request." };
    }
  } catch (error) {
    // API route not available or error, continue to mock response
  }

  // Mock response for demo
  return {
    reply: "This is a demo response. Later this will be powered by your trained AI agent.",
  };
}

/**
 * Helper function to send leads to backend webhook
 * This is the extension point for forwarding leads to n8n/WhatsApp integration
 */
async function sendLeadToBackend(lead: {
  websiteUrl: string;
  name: string;
  businessName: string;
  emailOrWhatsApp: string;
  mainGoal: string;
  industry: string;
}): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...lead,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error("Lead webhook error:", response.status, response.statusText);
        throw new Error(`Webhook error: ${response.status}`);
      }
    } catch (error) {
      console.error("Lead webhook error:", error);
      throw error;
    }
  } else {
    // Log to console if webhook URL is not configured
    console.log("Lead data:", lead);
  }
}

export default function FrontdeskAgentPlayground({
  industryId,
  title,
  subtitle,
  initialMessage,
  chatHeaderTitle,
}: FrontdeskAgentPlaygroundProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialMessage,
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    name: "",
    businessName: "",
    emailOrWhatsApp: "",
    mainGoal: "",
  });

  const MAX_DEMO_MESSAGES = 3;

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isGenerating || messageCount >= MAX_DEMO_MESSAGES) return;

    const newUserMessage: Message = {
      role: "user",
      content: userInput.trim(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsGenerating(true);
    setMessageCount((prev) => prev + 1);

    try {
      // Check if this is the 3rd message - if so, skip agent call and show lead form directly
      if (messageCount + 1 >= MAX_DEMO_MESSAGES) {
        // This is the last allowed message - show lead form prompt instead of agent reply
        setTimeout(() => {
          const leadPromptMessage: Message = {
            role: "assistant",
            content:
              "This is just a short demo. If you'd like us to build a custom AI front desk for your own website, please share your contact details so we can reach out.",
          };
          setMessages((prev) => [...prev, leadPromptMessage]);
          setShowLeadForm(true);
        }, 500);
      } else {
        // For first 2 messages, call agent backend
        const agentResponse = await callDemoAgentBackend({
          message: newUserMessage.content,
          history: [...messages, newUserMessage],
          websiteUrl: websiteUrl || "demo",
          industry: industryId,
        });

        const assistantMessage: Message = {
          role: "assistant",
          content: agentResponse.reply,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error generating reply:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmittingLead) return;

    setIsSubmittingLead(true);

    try {
      await sendLeadToBackend({
        websiteUrl: websiteUrl || "",
        name: leadFormData.name,
        businessName: leadFormData.businessName,
        emailOrWhatsApp: leadFormData.emailOrWhatsApp,
        mainGoal: leadFormData.mainGoal,
        industry: industryId,
      });

      setLeadSubmitted(true);
      const thankYouMessage: Message = {
        role: "assistant",
        content:
          "Thank you! We've received your details. We'll contact you on WhatsApp or email with a custom plan for your AI front desk.",
      };
      setMessages((prev) => [...prev, thankYouMessage]);
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("There was an error submitting your details. Please try again or contact us directly.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <article
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 1rem",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {/* Playground Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 0",
          borderBottom: "1px solid #e0e0e0",
          marginBottom: "1rem",
        }}
      >
        <div style={{ fontSize: "0.875rem", color: "#666" }}>
          Playground · {title}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            padding: "0.25rem 0.75rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "12px",
            color: "#666",
          }}
        >
          Demo only
        </div>
      </div>

      {/* Main Two-Column Playground Area */}
      <div
        className="playground-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          flex: 1,
          minHeight: "calc(100vh - 350px)",
          marginBottom: "2rem",
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 768px) {
              .playground-container {
                flex-direction: row !important;
              }
              .playground-left {
                width: 35% !important;
              }
              .playground-right {
                width: 65% !important;
              }
            }
            @media (max-width: 767px) {
              .playground-right {
                padding: 1rem !important;
              }
              .chat-card {
                max-width: 100% !important;
                min-height: 400px !important;
              }
            }
          `
        }} />
        {/* Left Column - Configuration Panel */}
        <div
          className="playground-left"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingRight: "1rem",
          }}
        >
          {/* Agent Info */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{title}</h2>
            <p style={{ fontSize: "1rem", color: "#666" }}>
              {subtitle}
            </p>
          </div>

          {/* Instruction */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "1rem" }}>
              Enter your website URL to start a simple demo chat.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <button
                onClick={() => {
                  // Optional: Could trigger something when starting chat
                  // For now, just focus on the chat input if available
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#0066cc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Start Chat
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid #e0e0e0" }}>
            <h4 style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.75rem", color: "#333" }}>
              Navigation
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link
                href="/solutions/features"
                style={{
                  fontSize: "0.875rem",
                  color: "#0066cc",
                  textDecoration: "none",
                  padding: "0.5rem 0",
                }}
              >
                Extended Features
              </Link>
              <Link
                href="/faq"
                style={{
                  fontSize: "0.875rem",
                  color: "#0066cc",
                  textDecoration: "none",
                  padding: "0.5rem 0",
                }}
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: "0.875rem",
                  color: "#0066cc",
                  textDecoration: "none",
                  padding: "0.5rem 0",
                }}
              >
                Contact Support
              </Link>
              <Link
                href="/pricing"
                style={{
                  fontSize: "0.875rem",
                  color: "#0066cc",
                  textDecoration: "none",
                  padding: "0.5rem 0",
                }}
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - Chat Panel */}
        <div
          className="playground-right"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            minHeight: "500px",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px),
              repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px)
            `,
            backgroundSize: "20px 20px",
          }}
        >
          {/* Brand Watermark */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-45deg)",
              fontSize: "8rem",
              fontWeight: "700",
              color: "rgba(0, 102, 204, 0.05)",
              letterSpacing: "0.5rem",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0,
            }}
          >
            AILINKXIN
          </div>
          {/* Inner Chat Card */}
          <div
            className="chat-card"
            style={{
              width: "100%",
              maxWidth: "560px",
              margin: "0 auto",
              backgroundColor: "#fff",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 40px)",
              minHeight: "500px",
              overflow: "hidden",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#0066cc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  AI
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: "500", lineHeight: "1.2" }}>
                    {chatHeaderTitle}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#999" }}>
                    Demo questions: {messageCount} / {MAX_DEMO_MESSAGES}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  // Refresh/restart chat functionality could go here
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  fontSize: "1rem",
                }}
                title="Refresh"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
            </div>

            {/* Chat Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "1rem",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    backgroundColor: msg.role === "user" ? "#0066cc" : "#e0e0e0",
                    color: msg.role === "user" ? "#fff" : "#333",
                    maxWidth: "80%",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div style={{ textAlign: "left", marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    backgroundColor: "#e0e0e0",
                    color: "#666",
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
            {/* Powered by footer */}
            {messages.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem 0 0.5rem 0",
                  marginTop: "auto",
                  fontSize: "0.75rem",
                  color: "#999",
                }}
              >
                Powered by AILINKXIN
              </div>
            )}
          </div>

            {/* Chat Input - Fixed at bottom */}
            <div
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
                flexShrink: 0,
              }}
            >
            {showLeadForm && !leadSubmitted ? (
              <form onSubmit={handleLeadSubmit}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", fontWeight: "500" }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadFormData.name}
                    onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", fontWeight: "500" }}>
                    Business name *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadFormData.businessName}
                    onChange={(e) => setLeadFormData({ ...leadFormData, businessName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", fontWeight: "500" }}>
                    Email or WhatsApp number *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadFormData.emailOrWhatsApp}
                    onChange={(e) => setLeadFormData({ ...leadFormData, emailOrWhatsApp: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.75rem", fontWeight: "500" }}>
                    Main goal / What you want this agent to do *
                  </label>
                  <textarea
                    required
                    value={leadFormData.mainGoal}
                    onChange={(e) => setLeadFormData({ ...leadFormData, mainGoal: e.target.value })}
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#0066cc",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    cursor: isSubmittingLead ? "not-allowed" : "pointer",
                  }}
                >
                  {isSubmittingLead ? "Submitting..." : "Submit"}
                </button>
              </form>
            ) : leadSubmitted ? (
              <div style={{ padding: "0.75rem", backgroundColor: "#e6f7e6", borderRadius: "4px", color: "#2d5a2d", fontSize: "0.875rem" }}>
                Demo finished. Thank you for your interest!
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Message..."
                    disabled={messageCount >= MAX_DEMO_MESSAGES || isGenerating || leadSubmitted}
                    style={{
                      flex: 1,
                      padding: "0.75rem 1rem",
                      border: "1px solid #e0e0e0",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      backgroundColor: messageCount >= MAX_DEMO_MESSAGES || leadSubmitted ? "#f5f5f5" : "#fff",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      fontSize: "1.125rem",
                    }}
                    title="Emoji"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </button>
                  <button
                    type="submit"
                    disabled={messageCount >= MAX_DEMO_MESSAGES || isGenerating || !userInput.trim() || leadSubmitted}
                    style={{
                      background: messageCount >= MAX_DEMO_MESSAGES || leadSubmitted ? "#ccc" : "#0066cc",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: messageCount >= MAX_DEMO_MESSAGES || leadSubmitted ? "not-allowed" : "pointer",
                      color: "white",
                      padding: 0,
                    }}
                    title="Send"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
                {messageCount >= MAX_DEMO_MESSAGES && !showLeadForm && (
                  <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#666", textAlign: "center" }}>
                    Demo finished
                  </p>
                )}
              </form>
            )}
            </div>
          </div>
        </div>
      </div>

    </article>
  );
}









