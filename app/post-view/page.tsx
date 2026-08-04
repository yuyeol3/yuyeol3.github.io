import type { Metadata } from "next";
import { Suspense } from "react";

import { LegacyPostRedirect } from "@/components/LegacyRedirect";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "게시글 주소 이동",
};

export default function LegacyPostPage() {
  const routes = Object.fromEntries(getAllPosts().map((post) => [post.sourcePath, post.url]));

  return (
    <Suspense fallback={<p>새 게시글 주소를 확인하는 중...</p>}>
      <LegacyPostRedirect routes={routes} />
    </Suspense>
  );
}
