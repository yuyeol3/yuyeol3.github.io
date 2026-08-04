import type { Metadata } from "next";

import SearchClient from "@/components/SearchClient";
import { getPostSummaries } from "@/lib/posts";

export const metadata: Metadata = {
  alternates: { canonical: "/search/" },
  description: "제목과 미리보기에서 블로그 게시글을 검색합니다.",
  title: "검색",
};

export default function SearchPage() {
  return <SearchClient posts={getPostSummaries()} />;
}
