"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { PicksProduct, PicksProductLink } from "@/lib/picks";

type PicksBrowseClientProps = {
  initialProducts: PicksProduct[];
  dbCategories: string[];
  dbTags: string[];
};

/**
 * Client component for Picks page with search, filter, and click tracking
 */
export default function PicksBrowseClient({
  initialProducts,
  dbCategories,
  dbTags,
}: PicksBrowseClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  // Use DB data if available
  const categories = dbCategories.length > 0 ? dbCategories : [];
  const tags = dbTags.length > 0 ? dbTags : [];

  // Filter products with priority: category > tag > search
  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Category filter (highest priority)
    if (selectedCategory) {
      filtered = filtered.filter((product) =>
        product.categories.includes(selectedCategory)
      );
    }

    // Tag filter (second priority)
    if (selectedTag) {
      filtered = filtered.filter((product) =>
        product.tags.includes(selectedTag)
      );
    }

    // Search filter (lowest priority, searches in name + short_description + description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const shortDescMatch = product.shortDescription?.toLowerCase().includes(query) || false;
        const descMatch = product.description?.toLowerCase().includes(query) || false;
        return nameMatch || shortDescMatch || descMatch;
      });
    }

    return filtered;
  }, [initialProducts, selectedCategory, selectedTag, searchQuery]);

  // Handle button click: record click and redirect
  // Using exact logic as specified: logClickAndGo pattern
  const handleProductClick = (
    product: PicksProduct,
    link: PicksProductLink | null
  ) => {
    // If no link, do nothing
    if (!link) {
      console.warn("No link available for product:", product.id);
      return;
    }

    // Get redirect URL: prioritize affiliate_url, then destination_url
    const url = link.affiliateUrl || link.destinationUrl;

    if (!url) {
      console.error("No redirect URL available for product:", product.id);
      return;
    }

    // Use exact logic as specified
    const payload = JSON.stringify({ 
      productId: product.id, 
      productLinkId: link.id, 
      ref: "picks_list" 
    });
    
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/picks/click", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/picks/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {
      // Silently fail
    }
    
    window.location.href = url;
  };

  // Get the default link (priority smallest = highest priority)
  const getDefaultLink = (product: PicksProduct): PicksProductLink | null => {
    if (!product.links || product.links.length === 0) {
      return null;
    }
    // Links are already sorted by priority ASC, so first one is the default
    return product.links[0];
  };

  // Get button text
  const getButtonText = (link: PicksProductLink | null): string => {
    if (link?.ctaText) {
      return link.ctaText;
    }
    return "Visit website";
  };

  // Format country codes for display
  const formatCountryCodes = (countryCodes: string[]): string => {
    if (!countryCodes || countryCodes.length === 0) {
      return "";
    }
    return countryCodes.join(" / ");
  };

  return (
    <>
      {/* Filters Section - Compact spacing */}
      <section className="border-t border-pink-200 bg-pink-50 w-full">
        <div className="w-full py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-6 px-4">
          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === ""
                      ? "border-pink-400 bg-pink-100 text-pink-600"
                      : "border-white bg-white text-slate-600 hover:border-pink-300 hover:text-pink-500"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedTag(""); // Clear tag when category is selected
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedCategory === category
                        ? "border-pink-400 bg-pink-100 text-pink-600"
                        : "border-white bg-white text-slate-600 hover:border-pink-300 hover:text-pink-500"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag("")}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedTag === ""
                      ? "border-pink-400 bg-pink-100 text-pink-600"
                      : "border-white bg-white text-slate-600 hover:border-pink-300 hover:text-pink-500"
                  }`}
                >
                  All
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setSelectedCategory(""); // Clear category when tag is selected
                    }}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedTag === tag
                        ? "border-pink-400 bg-pink-100 text-pink-600"
                        : "border-white bg-white text-slate-600 hover:border-pink-300 hover:text-pink-500"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Picks Grid Section */}
      <section className="py-6 sm:py-8 md:py-10 w-full">
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* Header with Title and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
              All Picks
            </h2>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-auto sm:max-w-xs px-4 py-2 bg-white border border-white rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-pink-300 transition-colors"
            />
          </div>

          {/* Grid - Responsive: 1 col mobile, 2 md, 3 lg */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-slate-500">No picks available yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const defaultLink = getDefaultLink(product);
                const buttonText = getButtonText(defaultLink);
                const countryCodes = defaultLink
                  ? formatCountryCodes(defaultLink.countryCodes)
                  : "";

                return (
                  <div
                    key={product.id}
                    className="flex flex-col rounded-xl border border-white bg-white/80 px-4 py-3 shadow-sm hover:shadow-md hover:border-pink-200 transition"
                  >
                    {/* Top Row: Category Badge */}
                    <div className="flex items-start justify-between mb-2">
                      {product.categories.length > 0 && (
                        <span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                          {product.categories[0]}
                        </span>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="space-y-2 flex-grow mb-3">
                      {/* Logo (if exists) */}
                      {product.heroImageUrl && (
                        <div className="mb-2">
                          <Image
                            src={product.heroImageUrl}
                            alt={product.name}
                            width={120}
                            height={32}
                            className="h-8 w-auto object-contain"
                            unoptimized
                          />
                        </div>
                      )}

                      {/* Name */}
                      <h3 className="text-sm font-semibold text-slate-800">
                        {product.name}
                      </h3>

                      {/* Summary */}
                      <p className="mt-1 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                        {product.shortDescription || product.description || ""}
                      </p>
                    </div>

                    {/* Bottom Row: Button */}
                    <div className="pt-2 border-t border-white flex items-center justify-between">
                      {/* Country codes (if available) */}
                      {countryCodes && (
                        <span className="text-[10px] text-slate-400">
                          {countryCodes}
                        </span>
                      )}
                      <button
                        onClick={() => handleProductClick(product, defaultLink)}
                        disabled={!defaultLink}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold text-white transition-colors ${
                          defaultLink
                            ? "bg-pink-400 hover:bg-pink-300"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}




