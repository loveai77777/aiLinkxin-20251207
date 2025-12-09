import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceBySlug, getAllServices } from "@/content/services";
import { createSeoMetadata } from "@/lib/seo";
import { getAllPlaybookPosts } from "@/lib/mdx";
import CTASection from "@/components/CTASection";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const services = getAllServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return createSeoMetadata({
    title: service.name,
    description: service.description || service.summary,
    keywords: service.keywords,
    ogType: "website",
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // 获取相关的 Playbook 文章
  const relatedPosts = getAllPlaybookPosts()
    .filter(
      (post) =>
        post.frontmatter.category === service.category ||
        post.frontmatter.tags.some((tag) => service.keywords.includes(tag))
    )
    .slice(0, 3);

  // Special layout for AI Front Desk service
  if (slug === "ai-frontdesk") {
    return (
      <article>
        <h1>{service.name}</h1>
        <p>{service.summary}</p>

        <section>
          <h2>Overview</h2>
          <p>
            Our AI Front Desk agent answers questions, handles bookings, and supports your customers in multiple languages — 24/7, across web chat and future voice channels.
          </p>
        </section>

        <section>
          <h2>Who this agent is for</h2>
          <ul>
            <li>Beauty salons and spas</li>
            <li>Local service businesses</li>
            <li>Coaches and consultants who need help handling inbound inquiries</li>
          </ul>
        </section>

        <section>
          <h2>What this AI agent can do</h2>
          <ul>
            <li>AI customer service for common questions</li>
            <li>Automated booking and rescheduling</li>
            <li>Multilingual front desk (English + other languages)</li>
            <li>Lead capture and basic customer qualification</li>
            <li>Future integrations with WhatsApp, SMS, and CRM</li>
          </ul>
        </section>

        <section>
          <h2>Try the AI front-desk demo</h2>
          <div className="card" style={{ padding: "1.5rem", marginTop: "1rem" }}>
            <p style={{ marginBottom: "1rem" }}>
              Soon you'll be able to enter your website URL here and instantly test a demo AI front-desk agent.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                disabled
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  backgroundColor: "#f5f5f5",
                }}
              />
              <button
                disabled
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#ccc",
                  color: "#666",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  cursor: "not-allowed",
                }}
              >
                Generate demo (coming soon)
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2>Upgrade to a full AI front desk</h2>
          <p>
            When you're ready, we can fully set up this agent for your business — including custom training with your FAQs and scripts, integration with your booking system, and connections to WhatsApp, SMS, and your customer database.
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#0066cc",
              color: "white",
              border: "none",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "1rem",
              marginTop: "1rem",
            }}
          >
            Talk to us about setup
          </Link>
        </section>
      </article>
    );
  }

  // Default layout for other services
  return (
    <article>
      <h1>{service.name}</h1>
      <p>{service.summary}</p>

      {service.description && (
        <section>
          <h2>Detailed Description</h2>
          <p>{service.description}</p>
        </section>
      )}

      <section>
        <h2>Target Audience</h2>
        <ul>
          {service.target.map((target, index) => (
            <li key={index}>{target}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Key Features</h2>
        <ul>
          {service.keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </section>

      <CTASection variant="consultation" />

      {relatedPosts.length > 0 && (
        <section>
          <h2>Related Articles</h2>
          <ul>
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/playbook/${post.slug}`}>
                  {post.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}













