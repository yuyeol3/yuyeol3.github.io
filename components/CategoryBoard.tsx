"use client";

import Link from "next/link";
import { useState } from "react";

import PostList from "@/components/PostList";
import SearchForm from "@/components/SearchForm";
import type { PostSummary } from "@/lib/posts";
import { POSTS_PER_PAGE } from "@/lib/site";

interface CategoryBoardProps {
  category: string;
  page: number;
  pageCount: number;
  posts: PostSummary[];
}

export default function CategoryBoard({ category, page, pageCount, posts }: CategoryBoardProps) {
  const [searchResults, setSearchResults] = useState<PostSummary[] | null>(null);
  const firstPostIndex = (page - 1) * POSTS_PER_PAGE;
  const visiblePosts = searchResults ?? posts.slice(firstPostIndex, firstPostIndex + POSTS_PER_PAGE);

  function search(query: string) {
    if (!query) {
      setSearchResults(null);
      return;
    }

    const normalizedQuery = query.toLocaleLowerCase("ko");
    setSearchResults(
      posts.filter((post) => {
        return `${post.title} ${post.description}`.toLocaleLowerCase("ko").includes(normalizedQuery);
      }),
    );
  }

  return (
    <div className="board-view">
      <SearchForm onSearch={search} />
      <PostList posts={visiblePosts} title={searchResults === null ? category : `${category} 검색`} />
      {searchResults === null ? (
        <nav aria-label={`${category} 페이지 이동`} className="button-area">
          {page > 1 ? (
            <Link href={`/categories/${encodeURIComponent(category)}/${page - 1}/`}>prev</Link>
          ) : (
            <span aria-disabled="true">prev</span>
          )}
          <span aria-current="page">{page}</span>
          {page < pageCount ? (
            <Link href={`/categories/${encodeURIComponent(category)}/${page + 1}/`}>next</Link>
          ) : (
            <span aria-disabled="true">next</span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
