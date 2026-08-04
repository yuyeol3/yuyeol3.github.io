import React, { isValidElement, type CSSProperties, type ReactNode } from "react";
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

const syntaxColorVariables: Record<string, string> = {
  "#07a": "var(--syntax-keyword)",
  "#690": "var(--syntax-string)",
  "#905": "var(--syntax-number)",
  "#999": "var(--syntax-punctuation)",
  "#9a6e3a": "var(--syntax-operator)",
  "#DD4A68": "var(--syntax-function)",
  "#e90": "var(--syntax-variable)",
  black: "var(--code-text)",
  slategray: "var(--syntax-comment)",
};

const customCodeStyle = Object.fromEntries(
  Object.entries(codeStyle).map(([token, style]) => {
    const color = typeof style.color === "string" ? syntaxColorVariables[style.color] : undefined;
    const transparentBackground = style.background === "hsla(0, 0%, 100%, .5)";

    return [
      token,
      {
        ...style,
        ...(color ? { color } : {}),
        ...(transparentBackground ? { background: "transparent" } : {}),
      },
    ];
  }),
) as Record<string, CSSProperties>;

customCodeStyle['pre[class*="language-"]'] = {
  ...customCodeStyle['pre[class*="language-"]'],
  background: "var(--code-block-background)",
  color: "var(--code-text)",
  textShadow: "none",
};
customCodeStyle['code[class*="language-"]'] = {
  ...customCodeStyle['code[class*="language-"]'],
  color: "var(--code-text)",
  textShadow: "none",
};

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
