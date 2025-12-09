import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPlaybookPostBySlug,
  getAllPlaybookPosts,
  getPlaybookPostsByCategory,
} from "@/lib/mdx";
import { createSeoMetadata } from "@/lib/seo";
import CTASection from "@/components/CTASection";
import MarkdownContent from "@/components/MarkdownContent";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPlaybookPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPlaybookPostBySlug(slug);

  if (!post) {
    return {};
  }

  return createSeoMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags,
    ogType: "article",
    publishedTime: post.frontmatter.publishedAt,
    modifiedTime: post.frontmatter.updatedAt,
  });
}

export default async function PlaybookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPlaybookPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 获取同类文章（同一分类）
  const relatedPosts = getPlaybookPostsByCategory(
    post.frontmatter.category
  ).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      <h1>{post.frontmatter.title}</h1>
      <div>
        <time dateTime={post.frontmatter.publishedAt}>
        Published:{" "}
          {new Date(post.frontmatter.publishedAt).toLocaleDateString("zh-CN")}
        </time>
        {post.frontmatter.updatedAt && (
          <time dateTime={post.frontmatter.updatedAt}>
            {" | Updated: "}
            {new Date(post.frontmatter.updatedAt).toLocaleDateString("zh-CN")}
          </time>
        )}
      </div>
      <div>
        <span>Category: {post.frontmatter.category}</span>
        {post.frontmatter.tags.length > 0 && (
          <span>
            {" | Tags: "}
            {post.frontmatter.tags.join(", ")}
          </span>
        )}
      </div>

      <section>
        <MarkdownContent content={post.content} />
      </section>

      <CTASection variant="consultation" />

      {relatedPosts.length > 0 && (
        <section>
          <h2>Related Articles</h2>
          <ul>
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.slug}>
                <Link href={`/playbook/${relatedPost.slug}`}>
                  {relatedPost.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
