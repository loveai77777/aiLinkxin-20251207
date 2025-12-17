import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

/**
 * Markdown 内容渲染组件
 * 用于渲染 Playbook 文章的 MDX 内容
 */
export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Allow single H1 in markdown content
        h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-8 first:mt-0" {...props} />,
        // Keep other heading levels
        h2: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 mt-6" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 mt-4" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-lg md:text-xl font-semibold text-white mb-2 mt-4" {...props} />,
        // Paragraphs
        p: ({ node, ...props }) => <p className="text-white leading-relaxed mb-4" {...props} />,
        // Links open in new window
        a: ({ node, ...props }) => (
          <a className="text-emerald-400 hover:text-emerald-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        // Lists
        ul: ({ node, ...props }) => <ul className="list-disc list-inside text-white mb-4 space-y-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-white mb-4 space-y-2" {...props} />,
        li: ({ node, ...props }) => <li className="text-white" {...props} />,
        // Code blocks
        code: ({ node, inline, ...props }: any) => {
          if (inline) {
            return <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm" {...props} />;
          }
          return <code className="block bg-slate-900 text-white p-4 rounded-lg overflow-x-auto mb-4" {...props} />;
        },
        // Blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-300 my-4" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}































