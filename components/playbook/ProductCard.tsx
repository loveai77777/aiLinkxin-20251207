import Link from "next/link";

export type ProductData = {
  id: number;
  slug: string;
  name: string;
  shortDescription: string | null;
  externalUrl?: string | null;
};

interface ProductCardProps {
  product: ProductData;
  ctaText?: string | null;
  compact?: boolean;
}

/**
 * Neutral product recommendation card
 * Used in hero, inline, and footer placements
 */
export default function ProductCard({
  product,
  ctaText = "View resource",
  compact = false,
}: ProductCardProps) {
  const href = product.externalUrl || `/products/${product.slug}`;
  const isExternal = !!product.externalUrl;

  if (compact) {
    return (
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="group block p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors mb-1">
              {product.name}
            </h4>
            {product.shortDescription && (
              <p className="text-xs text-gray-400 line-clamp-2">
                {product.shortDescription}
              </p>
            )}
          </div>
          {isExternal && (
            <svg
              className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
      <h4 className="text-base font-medium text-white mb-2">{product.name}</h4>
      {product.shortDescription && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
      )}
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        {ctaText}
        {isExternal && (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </Link>
    </div>
  );
}











