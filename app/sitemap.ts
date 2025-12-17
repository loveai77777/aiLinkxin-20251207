import { MetadataRoute } from "next";
import { getAllServices } from "@/content/services";
import { getAllPlaybookPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/playbook`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/picks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // 服务详情页
  const servicePages: MetadataRoute.Sitemap = getAllServices().map(
    (service) => ({
      url: `${baseUrl}/solutions/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  // Playbook 文章页
  const playbookPages: MetadataRoute.Sitemap = getAllPlaybookPosts().map(
    (post) => ({
      url: `${baseUrl}/playbook/${post.slug}`,
      lastModified: post.frontmatter.updatedAt
        ? new Date(post.frontmatter.updatedAt)
        : new Date(post.frontmatter.publishedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [...staticPages, ...servicePages, ...playbookPages];
}














