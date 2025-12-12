"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PlaybookCard, { type PlaybookCardData } from "@/components/playbook/PlaybookCard";

// Fallback lists for categories and tags
const FALLBACK_CATEGORIES = [
  "Automation",
  "AI Customer Support",
  "Website",
  "Supabase",
  "n8n",
  "Marketing",
];

const FALLBACK_TAGS = [
  "Beginner",
  "Step-by-step",
  "Templates",
  "Growth",
  "Affiliate Picks",
];

interface PlaybookBrowseClientProps {
  initialPlaybooks: PlaybookCardData[];
  dbCategories: string[];
  dbTags: string[];
}

/**
 * Client component for browse-first Playbook list with chips and search
 */
export default function PlaybookBrowseClient({
  initialPlaybooks,
  dbCategories,
  dbTags,
}: PlaybookBrowseClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  // Use DB data if available, otherwise fallback
  const categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES;
  const tags = dbTags.length > 0 ? dbTags : FALLBACK_TAGS;

  // Get featured playbooks (top 3-6)
  const featuredPlaybooks = useMemo(() => {
    // TODO: Use is_featured or sort_order if available
    // For now, fallback to newest 3-6 by updated_at
    return initialPlaybooks
      .filter((p) => p.updatedAt)
      .sort((a, b) => {
        if (!a.updatedAt || !b.updatedAt) return 0;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })
      .slice(0, 6);
  }, [initialPlaybooks]);

  // Filter playbooks with priority: category > tag > search
  const filteredPlaybooks = useMemo(() => {
    let filtered = [...initialPlaybooks];

    // Priority 1: Category filter
    if (selectedCategory) {
      // TODO: Match by category name when category field is available
      // For now, filter by tags that might match category
      filtered = filtered.filter((playbook) => {
        // If playbook has tags matching category, include it
        // This is a simple fallback - should be replaced with proper category matching
        return playbook.tags.some(
          (tag) => tag.label.toLowerCase() === selectedCategory.toLowerCase()
        );
      });
    }

    // Priority 2: Tag filter
    if (selectedTag) {
      filtered = filtered.filter((playbook) =>
        playbook.tags.some((tag) => tag.label === selectedTag)
      );
    }

    // Priority 3: Search filter (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (playbook) =>
          playbook.title.toLowerCase().includes(query) ||
          (playbook.summary &&
            playbook.summary.toLowerCase().includes(query))
      );
    }

    // Exclude featured playbooks from main grid
    const featuredIds = new Set(featuredPlaybooks.map((p) => p.id));
    return filtered.filter((p) => !featuredIds.has(p.id));
  }, [initialPlaybooks, selectedCategory, selectedTag, searchQuery, featuredPlaybooks]);

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedTag("");
    setSearchQuery("");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      {/* Popular Categories Chips */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetFilters}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "" && selectedTag === "" && searchQuery === ""
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(selectedCategory === category ? "" : category);
                setSelectedTag("");
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Tags Chips */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(selectedTag === tag ? "" : tag);
                setSelectedCategory("");
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Search Bar */}
      <div className="mb-8 flex items-center gap-4">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Try: n8n, Supabase, AI front desk..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedCategory("");
              setSelectedTag("");
            }}
            className="h-12 w-full rounded-full bg-white/5 border border-white/10 px-5 pr-12 text-sm md:text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/15 transition-all"
          />
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Featured/Recommended Section */}
      {featuredPlaybooks.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPlaybooks.map((playbook) => (
              <Link
                key={playbook.id}
                href={`/playbook/${playbook.slug}`}
                className="group block p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-slate-800/50 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {playbook.title}
                </h3>
                {playbook.summary && (
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                    {playbook.summary}
                  </p>
                )}
                {playbook.hasAffiliateLinks && (
                  <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
                    Includes recommendations
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Grid */}
      {filteredPlaybooks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white text-xl mb-4">No playbooks found</p>
          <p className="text-gray-400 text-sm mb-6">
            Try adjusting your filters or search
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs text-gray-500">Suggestions:</span>
            {["n8n", "Supabase", "AI front desk", "Automation"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setSelectedCategory("");
                  setSelectedTag("");
                }}
                className="px-3 py-1 text-xs bg-white/5 text-white/60 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              Showing {filteredPlaybooks.length} playbook{filteredPlaybooks.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaybooks.map((playbook) => (
              <PlaybookCard key={playbook.id} playbook={playbook} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

