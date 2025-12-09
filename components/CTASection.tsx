import Link from "next/link";

export interface CTASectionProps {
  variant?: "consultation" | "download" | "subscribe";
  className?: string;
}

export default function CTASection({
  variant = "consultation",
  className = "",
}: CTASectionProps) {
  const config = {
    consultation: {
      title: "Need help?",
      description:
        "Our team is ready to provide expert advice and a tailored AI automation intelligent agent for your business.",
      buttonText: "Talk to us →",
      buttonLink: "/contact",
    },
    download: {
      title: "Download resources",
      description:
        "Get practical tools, templates, and guides to help you implement AI automation faster.",
      buttonText: "Go to tools →",
      buttonLink: "/tools",
    },
    subscribe: {
      title: "Stay updated",
      description:
        "Be the first to receive new playbooks, tools, and product updates from AILINKXIN.",
      buttonText: "Subscribe",
      buttonLink: "/contact",
    },
  };

  const { title, description, buttonText, buttonLink } = config[variant];

  return (
    <section className={`${className} py-8 sm:py-12 md:py-16 px-4 sm:px-6`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
          {title}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
        <Link
          href={buttonLink}
          className="inline-flex items-center justify-center rounded-full
                     bg-[#38FF00]
                     px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-black
                     shadow-[0_14px_32px_rgba(56,255,0,0.6)]
                     ring-1 ring-[#38FF00]/50
                     transition-all duration-200
                     hover:-translate-y-[2px]
                     hover:shadow-[0_0_40px_rgba(56,255,0,0.8)]
                     active:translate-y-[0.5px] active:scale-95
                     active:shadow-[0_10px_24px_rgba(56,255,0,0.5)]
                     touch-manipulation min-h-[44px] sm:min-h-[48px]"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}






