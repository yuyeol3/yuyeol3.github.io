"use client";

import { useState } from "react";

import PostList from "@/components/PostList";
import SearchForm from "@/components/SearchForm";
import type { PostSummary } from "@/lib/posts";

interface SearchClientProps {
  posts: PostSummary[];
}

export default function SearchClient({ posts }: SearchClientProps) {
  const [results, setResults] = useState<PostSummary[]>([]);

  function search(query: string) {
    if (!query) {
      setResults([]);
      return;
    }

    const normalizedQuery = query.toLocaleLowerCase("ko");
    setResults(
      posts.filter((post) => {
        return `${post.title} ${post.description}`.toLocaleLowerCase("ko").includes(normalizedQuery);
      }),
    );
  }

  return (
    <div className="board-view">
      <SearchForm autoFocus onSearch={search} />
      <PostList posts={results} title="검색" />
    </div>
  );
}
