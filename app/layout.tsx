import type { Metadata } from "next";
import type { ReactNode } from "react";
import "katex/dist/katex.min.css";

import BlogShell from "@/components/BlogShell";
import { getCategoryGroups } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "@/styles/index.css";
import "@/styles/app.css";
import "@/styles/board.css";
import "@/styles/markdown.css";
import "@/styles/post.css";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <BlogShell categoryGroups={getCategoryGroups()}>{children}</BlogShell>
      </body>
    </html>
  );
}
