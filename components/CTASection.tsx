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
    <section className={className}>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href={buttonLink}>{buttonText}</Link>
    </section>
  );
}






