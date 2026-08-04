import type { Metadata } from "next";
import { Suspense } from "react";

import { LegacyBoardRedirect } from "@/components/LegacyRedirect";
import { getCategories, getCategoryPageCount } from "@/lib/posts";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "카테고리 주소 이동",
};

export default function LegacyBoardPage() {
  const pageCounts = Object.fromEntries(
    getCategories().map((category) => [category, getCategoryPageCount(category)]),
  );

  return (
    <Suspense fallback={<p>새 카테고리 주소를 확인하는 중...</p>}>
      <LegacyBoardRedirect pageCounts={pageCounts} />
    </Suspense>
  );
}
