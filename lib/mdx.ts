import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PlaybookFrontmatter {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}

export interface PlaybookPost {
  frontmatter: PlaybookFrontmatter;
  content: string;
  slug: string;
}

const playbookDirectory = path.join(process.cwd(), "content/playbook");

/**
 * 获取所有 Playbook 文章
 */
export function getAllPlaybookPosts(): PlaybookPost[] {
  if (!fs.existsSync(playbookDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(playbookDirectory);
  const allPostsData = fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(playbookDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        frontmatter: data as PlaybookFrontmatter,
        content,
      };
    })
    .filter((post) => post.frontmatter.slug) // 确保有 slug
    .sort((a, b) => {
      // 按发布时间倒序排列
      const dateA = new Date(a.frontmatter.publishedAt).getTime();
      const dateB = new Date(b.frontmatter.publishedAt).getTime();
      return dateB - dateA;
    });

  return allPostsData;
}

/**
 * 根据 slug 获取单篇文章
 */
export function getPlaybookPostBySlug(slug: string): PlaybookPost | null {
  const fullPath = path.join(playbookDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as PlaybookFrontmatter,
    content,
  };
}

/**
 * 根据分类获取文章列表
 */
export function getPlaybookPostsByCategory(
  category: string
): PlaybookPost[] {
  return getAllPlaybookPosts().filter(
    (post) => post.frontmatter.category === category
  );
}

/**
 * 根据标签获取文章列表
 */
export function getPlaybookPostsByTag(tag: string): PlaybookPost[] {
  return getAllPlaybookPosts().filter((post) =>
    post.frontmatter.tags.includes(tag)
  );
}

/**
 * 获取所有分类
 */
export function getAllCategories(): string[] {
  const posts = getAllPlaybookPosts();
  const categories = new Set<string>();
  posts.forEach((post) => {
    categories.add(post.frontmatter.category);
  });
  return Array.from(categories).sort();
}

/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const posts = getAllPlaybookPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}


















