"use client";

import { useState, type FormEvent } from "react";

interface SearchFormProps {
  autoFocus?: boolean;
  onSearch: (query: string) => void;
}

export default function SearchForm({ autoFocus = false, onSearch }: SearchFormProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query.trim());
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} role="search">
        <label className="visually-hidden" htmlFor="post-search">
          게시글 검색어
        </label>
        <input
          autoFocus={autoFocus}
          className="search-bar-input"
          id="post-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          type="search"
          value={query}
        />
        <button type="submit">검색</button>
      </form>
    </div>
  );
}
