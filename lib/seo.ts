import { Metadata } from "next";

export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  url?: string;
}

/**
 * 创建 SEO Metadata
 * @param metadata SEO 元数据对象
 * @returns Next.js Metadata 对象
 */
export function createSeoMetadata(metadata: SeoMetadata): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogType = "website",
    publishedTime,
    modifiedTime,
    image,
    url,
  } = metadata;

  const siteName = "新流";
  const fullTitle = `${title} | ${siteName}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      url: url || siteUrl,
      siteName,
      images: image
        ? [
            {
              url: image,
              alt: title,
            },
          ]
        : undefined,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/**
 * 创建页面标题（不含站点名称）
 */
export function createPageTitle(title: string): string {
  return title;
}

















