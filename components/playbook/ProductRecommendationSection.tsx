"use client";

import { useState } from "react";
import ProductCard, { type ProductData } from "./ProductCard";
import AffiliateDisclosure from "./AffiliateDisclosure";

export type ProductLinkData = {
  product: ProductData;
  placement: "hero" | "inline" | "footer";
  ctaText: string | null;
  sortOrder: number | null;
  notes: string | null;
};

interface ProductRecommendationSectionProps {
  products: ProductLinkData[];
  affiliateDisclosureOverride?: string | null;
  hasAffiliateLinks?: boolean;
  title?: string;
  collapsible?: boolean;
}

/**
 * Tools & Resources section with collapsible accordion
 * Groups products by placement and displays them in a neutral, content-first way
 */
export default function ProductRecommendationSection({
  products,
  affiliateDisclosureOverride,
  hasAffiliateLinks,
  title = "Tools & resources mentioned in this guide",
  collapsible = true,
}: ProductRecommendationSectionProps) {
  const [isOpen, setIsOpen] = useState(!collapsible);

  if (products.length === 0 && !hasAffiliateLinks) {
    return null;
  }

  // Sort by sort_order, then by product name
  const sortedProducts = [...products].sort((a, b) => {
    if (a.sortOrder !== null && b.sortOrder !== null) {
      return a.sortOrder - b.sortOrder;
    }
    if (a.sortOrder !== null) return -1;
    if (b.sortOrder !== null) return 1;
    return a.product.name.localeCompare(b.product.name);
  });

  return (
    <section className="mt-12 pt-8 border-t border-slate-800">
      {collapsible ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-left mb-4"
        >
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      ) : (
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      )}

      {isOpen && (
        <div>
          {/* Affiliate Disclosure */}
          {hasAffiliateLinks && (
            <AffiliateDisclosure customText={affiliateDisclosureOverride} />
          )}

          {/* Product Cards */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sortedProducts.map((productLink, index) => (
                <ProductCard
                  key={`${productLink.product.id}-${index}`}
                  product={productLink.product}
                  ctaText={productLink.ctaText}
                  compact={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              No resources listed yet.
            </p>
          )}
        </div>
      )}
    </section>
  );
}




