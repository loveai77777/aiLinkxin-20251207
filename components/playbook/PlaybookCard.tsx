import Link from "next/link";

export type PlaybookCardData = {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  tags: { id: number; label: string; slug: string }[];
  readingMinutes: number | null;
  hasAffiliateLinks?: boolean;
  categoryName?: string | null;
};

interface PlaybookCardProps {
  playbook: PlaybookCardData;
}

/**
 * Compact Playbook card component for list view
 */
export default function PlaybookCard({ playbook }: PlaybookCardProps) {
  const displayDate = playbook.updatedAt || playbook.publishedAt;

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatReadingTime = (minutes: number | null): string => {
    if (!minutes) return "";
    return `${minutes} min`;
  };

  return (
    <Link
      href={`/playbook/${playbook.slug}`}
      className="group block bg-slate-900 border border-slate-800 rounded-lg p-2.5 md:p-3 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-200"
    >
      {/* Category Badge */}
      {playbook.categoryName && (
        <div className="mb-1.5 md:mb-2">
          <span className="inline-block px-1.5 md:px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {playbook.categoryName}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-sm md:text-base font-semibold text-white mb-1.5 md:mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
        {playbook.title}
      </h3>

      {/* Tags (up to 3) */}
      {playbook.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 md:gap-1.5">
          {playbook.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="inline-block px-1 md:px-1.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-gray-400"
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}




