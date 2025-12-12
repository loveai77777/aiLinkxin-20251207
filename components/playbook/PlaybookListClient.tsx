"use client";

import { useState, useMemo } from "react";
import PlaybookCard, { type PlaybookCardData } from "./PlaybookCard";

interface PlaybookListClientProps {
  initialPlaybooks: PlaybookCardData[];
  availableTags: string[];
}

/**
 * Client-side search and filter component for Playbook list
 * Handles search by title/excerpt and tag filtering
 */
export default function PlaybookListClient({
  initialPlaybooks,
  availableTags,
}: PlaybookListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  // Extract unique tags from all playbooks
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    initialPlaybooks.forEach((playbook) => {
      playbook.tags.forEach((tag) => {
        tagSet.add(tag.label);
      });
    });
    return Array.from(tagSet).sort();
  }, [initialPlaybooks]);

  // Filter playbooks based on search and tag
  const filteredPlaybooks = useMemo(() => {
    let filtered = [...initialPlaybooks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (playbook) =>
          playbook.title.toLowerCase().includes(query) ||
          (playbook.summary &&
            playbook.summary.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((playbook) =>
        playbook.tags.some((tag) => tag.label === selectedTag)
      );
    }

    return filtered;
  }, [initialPlaybooks, searchQuery, selectedTag]);

  return (
    <section id="all-playbooks" className="py-8">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Input */}
          <div className="mx-auto w-full max-w-3xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search playbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 pr-12 text-sm md:text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/15 transition-all"
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

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("")}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  selectedTag === ""
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-900 text-gray-400 border-slate-800 hover:border-slate-700"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? "" : tag)
                  }
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    selectedTag === tag
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-slate-900 text-gray-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredPlaybooks.length !== initialPlaybooks.length && (
          <p className="text-sm text-gray-400 mb-6">
            Showing {filteredPlaybooks.length} of {initialPlaybooks.length}{" "}
            playbooks
          </p>
        )}

        {/* Playbooks Grid */}
        {filteredPlaybooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white text-lg mb-2">No playbooks found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaybooks.map((playbook) => (
              <PlaybookCard key={playbook.id} playbook={playbook} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

