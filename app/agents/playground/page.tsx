"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function PlaygroundPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("Beauty & SPA");
  const [language, setLanguage] = useState("English");
  const [agentDescription, setAgentDescription] = useState(
    "AI front-desk agent that answers questions and helps visitors book appointments."
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I&apos;m your demo AI front-desk agent for this website. Ask me about services, pricing, or booking, and I&apos;ll show you how I would respond.",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDemo = async (e: FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;
    setIsGenerating(true);
    // Placeholder: In the future, this would call an API to generate the agent
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: Message = {
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");

    // Placeholder: In the future, this would call the AI chat API
    setTimeout(() => {
      const assistantReply: Message = {
        role: "assistant",
        content: `This is a demo response. In the full version, I would analyze your website and provide accurate answers about services, pricing, and booking. You asked: "${userInput}"`,
      };
      setMessages((prev) => [...prev, assistantReply]);
    }, 500);
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1>Instant AI agent for your website</h1>
        <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#666" }}>
          Paste your website URL and see how an AI front-desk agent could talk to
          your customers in minutes.
        </p>
        <form onSubmit={handleGenerateDemo} style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              required
              style={{
                flex: 1,
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
            <button
              type="submit"
              disabled={isGenerating}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#0066cc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {isGenerating ? "Generating..." : "Generate demo agent"}
            </button>
          </div>
        </form>
      </section>

      {/* Main Two-Column Section */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          marginBottom: "4rem",
        }}
        className="playground-main"
      >
        {/* Left Column: Configuration Panel */}
        <div>
          {/* Website */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Website</h3>
            <input
              type="text"
              value={websiteUrl || "Enter URL above"}
              readOnly
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                fontSize: "0.875rem",
              }}
            />
          </div>

          {/* Business Profile */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Business profile</h3>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="industry" style={{ display: "block", marginBottom: "0.5rem" }}>
                Industry
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              >
                <option>Beauty & SPA</option>
                <option>Coaching & Consulting</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" style={{ display: "block", marginBottom: "0.5rem" }}>
                Main language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              >
                <option>English</option>
                <option>Chinese</option>
                <option>Bilingual</option>
              </select>
            </div>
          </div>

          {/* Agent Description */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Agent description</h3>
            <textarea
              value={agentDescription}
              onChange={(e) => setAgentDescription(e.target.value)}
              rows={3}
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

          {/* Info Notice */}
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f0f7ff",
              border: "1px solid #b3d9ff",
              borderRadius: "4px",
              marginBottom: "2rem",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#333" }}>
              For a quick demo, we only use your website URL. For better accuracy, we can
              later add your FAQs, pricing, and documents and fine-tune the agent for you.
            </p>
          </div>

          {/* Upgrade Box */}
          <div
            style={{
              padding: "1.5rem",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              backgroundColor: "#fafafa",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Upgrade to a full AI front desk
            </h3>
            <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem" }}>
              <li>Custom training with your PDFs, FAQs, and scripts</li>
              <li>Connection to WhatsApp, SMS, and booking systems</li>
              <li>Dedicated setup and optimization</li>
            </ul>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                backgroundColor: "transparent",
                color: "#0066cc",
                border: "1px solid #0066cc",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Talk to us
            </Link>
          </div>
        </div>

        {/* Right Column: Chat Demo Panel */}
        <div>
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column",
              height: "600px",
              backgroundColor: "#fff",
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#f5f5f5",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Demo AI front-desk agent</h3>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      backgroundColor:
                        message.role === "user" ? "#0066cc" : "#f0f0f0",
                      color: message.role === "user" ? "white" : "#333",
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: "1rem",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#0066cc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section style={{ marginTop: "4rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          What you get when you upgrade
        </h2>
        <div className="card-list">
          <div className="card">
            <h3>Chat history & traffic analytics</h3>
            <p>
              Track all conversations, analyze customer inquiries, and understand your
              website traffic patterns to optimize your business operations.
            </p>
          </div>
          <div className="card">
            <h3>Security & content control</h3>
            <p>
              Full control over what your AI agent can say, with content moderation and
              security features to protect your brand and customers.
            </p>
          </div>
          <div className="card">
            <h3>Integrations</h3>
            <p>
              Connect to WhatsApp, SMS, booking systems, and CRM platforms to create a
              seamless customer experience across all channels.
            </p>
          </div>
          <div className="card">
            <h3>Analytics & reporting</h3>
            <p>
              Comprehensive dashboards and reports to measure performance, conversion
              rates, and ROI of your AI front-desk agent.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .playground-main {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
