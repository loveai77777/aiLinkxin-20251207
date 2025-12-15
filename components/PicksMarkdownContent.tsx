"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PicksMarkdownContentProps {
  content: string;
}

/**
 * Markdown content renderer for Picks articles with light pink theme
 * Includes anti-copy protection: limits selection to 200 characters
 */
export default function PicksMarkdownContent({ content }: PicksMarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Disable Cmd/Ctrl + A inside the container
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Limit selection length to 200 characters (only for selections within container)
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      // Check if selection is within our container
      const range = selection.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) return;

      const selectedText = selection.toString();
      if (selectedText.length > 200) {
        selection.removeAllRanges();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    document.addEventListener("selectionchange", handleSelection);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="prose prose-pink max-w-none"
      style={{ userSelect: "text" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-8 first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 mt-6" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 mt-4" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 mt-4" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-4" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-pink-600 hover:text-pink-700 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded text-sm"
                  {...props}
                />
              );
            }
            return (
              <code
                className="block bg-pink-50 text-gray-800 p-4 rounded-lg overflow-x-auto mb-4 border border-pink-200"
                {...props}
              />
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-pink-400 pl-4 italic text-gray-600 my-4"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}






