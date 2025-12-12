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
      className="group block bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-200"
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
        {playbook.title}
      </h3>

      {/* Summary / Excerpt */}
      {playbook.summary && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {playbook.summary}
        </p>
      )}

      {/* Meta: Date, Reading Time, Affiliate Badge */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
        {displayDate && (
          <time className="whitespace-nowrap">{formatDate(displayDate)}</time>
        )}
        {playbook.readingMinutes && (
          <span className="whitespace-nowrap">
            {formatReadingTime(playbook.readingMinutes)}
          </span>
        )}
        {playbook.hasAffiliateLinks && (
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs">
            Includes recommendations
          </span>
        )}
      </div>

      {/* Tags */}
      {playbook.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
          {playbook.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-0.5 bg-slate-800 text-gray-400 text-xs rounded border border-slate-700"
            >
              {tag.label}
            </span>
          ))}
          {playbook.tags.length > 3 && (
            <span className="px-2 py-0.5 text-gray-500 text-xs">
              +{playbook.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

