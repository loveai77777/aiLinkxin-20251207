"use client";

import { useState, FormEvent, useRef } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    interestedIn: "", // Changed from array to string for dropdown
    phone: "",
    companyName: "",
    website: "",
    message: "",
    honeypot: "", // Hidden field for spam protection
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const successMessageRef = useRef<HTMLDivElement>(null);

  const interestedOptions = [
    "AI Front Desk",
    "Automation",
    "Website",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Handle honeypot field name mapping
    const fieldName = name === "hp_field" ? "honeypot" : name;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error when user types/selects
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Work Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Interested In is now optional, no validation needed

    // Honeypot check
    if (formData.honeypot) {
      // Bot detected, but don't reveal this
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.honeypot === ""
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      // If honeypot is filled, show generic error
      if (formData.honeypot) {
        setErrors({ submit: "Something went wrong. Please try again." });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission (no actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        interestedIn: "",
        phone: "",
        companyName: "",
        website: "",
        message: "",
        honeypot: "",
      });
      setErrors({});

      // Scroll success message into view
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 500);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 sm:p-5 md:p-6 pb-5 sm:pb-6 md:pb-7"
      >
        {/* Honeypot Field - Hidden */}
        <input
          type="text"
          name="hp_field"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
        />

        {/* Row 1: Full Name | Work Email - 2 Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
          {/* Full Name - Required */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="John Doe"
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] sm:min-h-[40px] ${
                errors.fullName
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-gray-300"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Work Email - Required */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
            >
              Work Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="your.email@example.com"
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] sm:min-h-[40px] ${
                errors.email
                  ? "border-red-300 focus:ring-red-300"
                  : "border-gray-200 focus:ring-gray-300"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Row 2: Phone (Optional) | Company Name (Optional) - 2 Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-2 sm:mb-2.5">
          {/* Phone - Optional */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
            >
              Phone <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] sm:min-h-[40px]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            />
          </div>

          {/* Company Name - Optional */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
            >
              Company Name{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Your Company"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] sm:min-h-[40px]"
              style={{ WebkitTapHighlightColor: "transparent" }}
            />
          </div>
        </div>

        {/* Row 3: Website (Optional) - Full Width */}
        <div className="mb-2 sm:mb-2.5">
          <label
            htmlFor="website"
            className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
          >
            Website <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="https://yourwebsite.com or no website"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-[48px]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          />
        </div>

        {/* Interested In - Optional Dropdown (Above Message) */}
        <div className="mb-2 sm:mb-2.5">
          <label
            htmlFor="interestedIn"
            className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
          >
            Interested In <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <select
            id="interestedIn"
            name="interestedIn"
            value={formData.interestedIn}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] sm:min-h-[40px]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <option value="">Select one</option>
            {interestedOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Message - Textarea (Last Field, Shorter Default) */}
        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="message"
            className="block text-xs sm:text-sm font-medium text-gray-900 mb-1"
          >
            How can we help you?
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={2}
            disabled={isSubmitting}
            placeholder="Write your message..."
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all resize-y disabled:opacity-50 disabled:cursor-not-allowed min-h-[60px]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          />
        </div>

        {/* Generic Error Message */}
        {errors.submit && (
          <div className="mb-3 text-xs sm:text-sm text-red-600">
            {errors.submit}
          </div>
        )}

        {/* Submit Button with Gradient Border */}
        <div
          className="relative rounded-lg p-[2px] w-full sm:w-fit"
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          }}
        >
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid()}
            className="relative w-full sm:w-auto py-2 sm:py-2 px-5 sm:px-6 bg-black text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 active:scale-95 focus:outline-none touch-manipulation min-h-[36px] sm:min-h-[40px]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        {/* Success Message - Below Submit Button */}
        {showSuccess && (
          <div
            ref={successMessageRef}
            className="mt-3 text-sm sm:text-base font-semibold italic text-gray-900"
          >
            Thanks! We'll reach out soon 🙂
          </div>
        )}
      </form>
    </div>
  );
}

