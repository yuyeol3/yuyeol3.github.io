import React, { isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import GithubSlugger from "github-slugger";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { getLocalImageDimensions } from "@/lib/image-dimensions";

interface MarkdownContentProps {
  markdown: string;
}

function nodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(nodeToText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return nodeToText(node.props.children);
  }

  return "";
}

function heading(level: 1 | 2 | 3 | 4 | 5 | 6, slugger: GithubSlugger) {
  return function MarkdownHeading({ children }: { children?: ReactNode }) {
    const id = slugger.slug(nodeToText(children));
    return React.createElement(`h${level}`, { id }, children);
  };
}

export default function MarkdownContent({ markdown }: MarkdownContentProps) {
  const slugger = new GithubSlugger();
  const customCodeStyle = {
    ...codeStyle,
    'pre[class*="language-"]': {
      ...codeStyle['pre[class*="language-"]'],
      background: "#f6f8fa",
    },
  };
  const components: Components = {
    code({ children, className }) {
      const language = /language-(\w+)/.exec(className ?? "")?.[1];

      return language ? (
        <SyntaxHighlighter language={language} PreTag="div" style={customCodeStyle}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    },
    img({ alt, node, src, ...props }) {
      void node;
      const dimensions = getLocalImageDimensions(typeof src === "string" ? src : undefined);

      // Markdown supports arbitrary remote URLs, which cannot always use next/image safely.
      // eslint-disable-next-line @next/next/no-img-element
      return <img alt={alt ?? ""} {...props} {...dimensions} src={src} />;
    },
    h1: heading(1, slugger),
    h2: heading(2, slugger),
    h3: heading(3, slugger),
    h4: heading(4, slugger),
    h5: heading(5, slugger),
    h6: heading(6, slugger),
  };

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        remarkPlugins={[remarkMath, remarkGfm]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
