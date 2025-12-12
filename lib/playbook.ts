import { createSupabaseClient } from "@/lib/supabaseClient";

/**
 * 推荐 Playbook 类型
 */
export type RecommendedPlaybook = {
  id: number;
  slug: string;
  title: string;
  published_at: string | null;
  reading_minutes: number | null;
};

/**
 * 获取相关推荐的 Playbook
 * 
 * 推荐逻辑：
 * 1. 优先同 category 的文章（category_id 与当前文章相同）
 * 2. 根据 tag 重叠数排序（公共 tag 越多越靠前）
 * 3. 按 published_at desc 做次排序
 * 4. 排除当前文章
 * 5. 只显示 status='published' 且 access_type='public' 的文章
 * 6. 最多返回 4 篇
 */
export async function getRecommendedPlaybooks(
  currentPlaybookId: number,
  currentCategoryId: number | null,
  currentTagIds: number[]
): Promise<RecommendedPlaybook[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  const supabase = createSupabaseClient();

  // 首先获取所有符合条件的 playbooks（排除当前文章）
  let query = supabase
    .from("playbooks")
    .select("id, slug, title, published_at, reading_minutes, category_id")
    .eq("status", "published")
    .eq("access_type", "public")
    .neq("id", currentPlaybookId);

  // 如果有 category_id，优先查询同 category 的文章
  if (currentCategoryId) {
    query = query.eq("category_id", currentCategoryId);
  }

  const { data: candidates, error } = await query
    .order("published_at", { ascending: false })
    .limit(20); // 先取 20 条，后续再按 tag 重叠数排序

  if (error || !candidates || candidates.length === 0) {
    // 如果没有同 category 的文章，尝试获取其他文章
    if (currentCategoryId) {
      const { data: fallbackCandidates } = await supabase
        .from("playbooks")
        .select("id, slug, title, published_at, reading_minutes, category_id")
        .eq("status", "published")
        .eq("access_type", "public")
        .neq("id", currentPlaybookId)
        .order("published_at", { ascending: false })
        .limit(20);

      if (fallbackCandidates) {
        return getTopRecommendedByTags(fallbackCandidates, currentTagIds, supabase);
      }
    }
    return [];
  }

  // 如果有 tag，按 tag 重叠数排序
  if (currentTagIds.length > 0) {
    return getTopRecommendedByTags(candidates, currentTagIds, supabase);
  }

  // 如果没有 tag，直接返回前 4 条
  return candidates.slice(0, 4).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    published_at: p.published_at,
    reading_minutes: p.reading_minutes,
  }));
}

/**
 * 根据 tag 重叠数对候选文章进行排序，返回前 4 条
 */
async function getTopRecommendedByTags(
  candidates: Array<{ id: number; slug: string; title: string; published_at: string | null; reading_minutes: number | null }>,
  currentTagIds: number[],
  supabase: ReturnType<typeof createSupabaseClient>
): Promise<RecommendedPlaybook[]> {
  if (currentTagIds.length === 0) {
    return candidates.slice(0, 4).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      published_at: p.published_at,
      reading_minutes: p.reading_minutes,
    }));
  }

  // 获取所有候选文章的 tags
  // 注意：根据实际表结构，关系表可能是 playbook_tags 或 playbook_tag_links
  // 如果表名不对，请根据实际数据库表结构调整
  const candidateIds = candidates.map((c) => c.id);
  const { data: playbookTagsData } = await supabase
    .from("playbook_tags")
    .select("playbook_id, tag_id")
    .in("playbook_id", candidateIds);

  if (!playbookTagsData) {
    return candidates.slice(0, 4).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      published_at: p.published_at,
      reading_minutes: p.reading_minutes,
    }));
  }

  // 计算每个候选文章的 tag 重叠数
  const tagOverlapMap = new Map<number, number>();
  playbookTagsData.forEach((pt) => {
    if (currentTagIds.includes(pt.tag_id)) {
      const current = tagOverlapMap.get(pt.playbook_id) || 0;
      tagOverlapMap.set(pt.playbook_id, current + 1);
    }
  });

  // 按 tag 重叠数排序，然后按 published_at 排序
  const scored = candidates.map((candidate) => ({
    ...candidate,
    tagOverlap: tagOverlapMap.get(candidate.id) || 0,
  }));

  scored.sort((a, b) => {
    // 首先按 tag 重叠数降序
    if (b.tagOverlap !== a.tagOverlap) {
      return b.tagOverlap - a.tagOverlap;
    }
    // 然后按 published_at 降序
    if (a.published_at && b.published_at) {
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    }
    return 0;
  });

  return scored.slice(0, 4).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    published_at: p.published_at,
    reading_minutes: p.reading_minutes,
  }));
}

/**
 * 评论类型
 */
export type PlaybookComment = {
  id: number;
  author_name: string;
  author_email: string | null;
  content: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
};

/**
 * 获取已审核的评论列表
 */
export async function getApprovedComments(playbookId: number): Promise<PlaybookComment[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  const supabase = createSupabaseClient();

  const { data: comments, error } = await supabase
    .from("playbook_comments")
    .select("id, author_name, author_email, content, created_at, status")
    .eq("playbook_id", playbookId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return comments || [];
}

/**
 * 提交新评论
 */
export async function submitComment(
  playbookId: number,
  authorName: string,
  authorEmail: string | null,
  content: string
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { success: false, error: "Supabase not configured" };
  }

  // 验证必填字段
  if (!authorName.trim() || !content.trim()) {
    return { success: false, error: "Name and comment are required" };
  }

  const supabase = createSupabaseClient();

  const { error } = await supabase.from("playbook_comments").insert({
    playbook_id: playbookId,
    author_name: authorName.trim(),
    author_email: authorEmail?.trim() || null,
    content: content.trim(),
    status: "pending",
  });

  if (error) {
    console.error("Error submitting comment:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ========== 后台管理函数（暂时只写在 lib 里，方便未来做 /admin/comments 界面） ==========

/**
 * 获取所有待审核的评论
 */
export async function getPendingComments(): Promise<PlaybookComment[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  const supabase = createSupabaseClient();

  const { data: comments, error } = await supabase
    .from("playbook_comments")
    .select("id, author_name, author_email, content, created_at, status")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending comments:", error);
    return [];
  }

  return comments || [];
}

/**
 * 审核通过评论
 */
export async function approveComment(commentId: number): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { success: false, error: "Supabase not configured" };
  }

  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("playbook_comments")
    .update({ status: "approved" })
    .eq("id", commentId);

  if (error) {
    console.error("Error approving comment:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 拒绝评论
 */
export async function rejectComment(commentId: number): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { success: false, error: "Supabase not configured" };
  }

  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("playbook_comments")
    .update({ status: "rejected" })
    .eq("id", commentId);

  if (error) {
    console.error("Error rejecting comment:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

