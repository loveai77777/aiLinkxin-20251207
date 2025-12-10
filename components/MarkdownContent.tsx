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
        // 确保 h1 不会被使用（页面中已有 h1）
        h1: ({ node, ...props }) => <h2 {...props} />,
        // 保持其他标题层级
        h2: ({ node, ...props }) => <h2 {...props} />,
        h3: ({ node, ...props }) => <h3 {...props} />,
        h4: ({ node, ...props }) => <h4 {...props} />,
        // 链接在新窗口打开
        a: ({ node, ...props }) => (
          <a target="_blank" rel="noopener noreferrer" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}




















