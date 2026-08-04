import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoryBoard from "@/components/CategoryBoard";
import {
  decodeRouteParam,
  getCategories,
  getCategoryPageCount,
  getCategoryPosts,
  getPostSummaries,
} from "@/lib/posts";

interface CategoryPageProps {
  params: Promise<{ category: string; page: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().flatMap((category) => {
    return Array.from({ length: getCategoryPageCount(category) }, (_, index) => ({
      category,
      page: String(index + 1),
    }));
  });
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category, page } = await params;
  const decodedCategory = decodeRouteParam(category);
  const pageNumber = Number(page);

  if (
    !getCategories().includes(decodedCategory) ||
    pageNumber > getCategoryPageCount(decodedCategory)
  ) {
    return {};
  }

  const title = pageNumber === 1 ? decodedCategory : `${decodedCategory} ${pageNumber}페이지`;
  return {
    alternates: { canonical: `/categories/${encodeURIComponent(decodedCategory)}/${pageNumber}/` },
    description: `${decodedCategory} 카테고리의 게시글 목록입니다.`,
    title,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category, page } = await params;
  const decodedCategory = decodeRouteParam(category);
  const pageNumber = Number(page);
  const pageCount = getCategoryPageCount(decodedCategory);

  if (
    !getCategories().includes(decodedCategory) ||
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > pageCount
  ) {
    notFound();
  }

  return (
    <CategoryBoard
      category={decodedCategory}
      page={pageNumber}
      pageCount={pageCount}
      posts={getPostSummaries(getCategoryPosts(decodedCategory))}
    />
  );
}
