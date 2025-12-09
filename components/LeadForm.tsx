"use client";

import { useState, FormEvent } from "react";

export interface LeadFormProps {
  type?: "consultation" | "download" | "affiliate" | "other";
  source?: string;
  className?: string;
}

export default function LeadForm({
  type = "consultation",
  source = "",
  className = "",
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type,
          source,
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 md:p-10 ${className}`}>
      {/* Email Field */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
          Work email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Message Field */}
      <div className="mb-8">
        <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
          How can we help you?
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          disabled={isSubmitting}
          placeholder="Write your message..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Submit Button with Gradient Border */}
      <div 
        className="relative rounded-lg p-[2px] w-fit"
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        }}
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative py-2 px-6 bg-black text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 focus:outline-none"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Status Messages */}
      {submitStatus === "success" && (
        <p className="mt-4 text-sm text-green-600">Submission successful! We will contact you soon.</p>
      )}
      {submitStatus === "error" && (
        <p className="mt-4 text-sm text-red-600">Submission failed, please try again later.</p>
      )}
    </form>
  );
}













