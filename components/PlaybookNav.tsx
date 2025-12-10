"use client";

import Link from "next/link";
import { useState } from "react";

interface CategoryWithTags {
  category: string;
  tags: string[];
}

interface PlaybookNavProps {
  categoriesWithTags: CategoryWithTags[];
}

export default function PlaybookNav({ categoriesWithTags }: PlaybookNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMouseEnter = (category: string) => {
    setOpenDropdown(category);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <>
      <nav className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-end h-16">
            {/* Right side - Categories with dropdown */}
            <div className="flex items-center gap-8">
            {categoriesWithTags.map(({ category, tags }) => {
              const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
              const isOpen = openDropdown === category;

              return (
                <div
                  key={category}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={`/playbook/category/${encodeURIComponent(categorySlug)}`}
                    className="text-white hover:text-emerald-400 transition-colors relative block pb-1"
                  >
                    {category}
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white opacity-0 hover:opacity-100 transition-opacity" />
                  </Link>

                  {/* Dropdown menu */}
                  {isOpen && tags.length > 0 && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        {tags.map((tag) => {
                          const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
                          return (
                            <Link
                              key={tag}
                              href={`/playbook/tag/${encodeURIComponent(tagSlug)}`}
                              className="block px-4 py-2.5 text-white hover:bg-slate-800 transition-colors"
                              onClick={() => setOpenDropdown(null)}
                            >
                              #{tag}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

