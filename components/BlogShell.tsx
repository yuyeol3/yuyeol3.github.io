"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

import type { CategoryGroup } from "@/lib/posts";

interface BlogShellProps {
  categoryGroups: CategoryGroup[];
  children: ReactNode;
}

export default function BlogShell({ categoryGroups, children }: BlogShellProps) {
  const [menuOpen, setMenuOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const resetMenu = () => setMenuOpen(null);

    mediaQuery.addEventListener("change", resetMenu);
    return () => mediaQuery.removeEventListener("change", resetMenu);
  }, []);

  function toggleMenu() {
    setMenuOpen((current) => {
      if (current !== null) {
        return !current;
      }

      return window.matchMedia("(max-width: 900px)").matches;
    });
  }

  const menuStateClass =
    menuOpen === null ? "side-bar--auto" : menuOpen ? "side-bar--open" : "side-bar--closed";

  return (
    <div className="App" id="App">
      <header className="header">
        <div className="header-left">
          <button
            aria-expanded={menuOpen ?? undefined}
            aria-label="카테고리 메뉴 열기 또는 닫기"
            className="menu-button"
            onClick={toggleMenu}
            type="button"
          >
            <Image alt="" aria-hidden="true" height={24} src="/menu-icon.svg" width={24} />
          </button>
          <Link className="blog-title" href="/">yuyeol3.github.io</Link>
        </div>
        <div className="header-right">
          <Link aria-label="게시글 검색" className="search-button" href="/search/">
            <Image alt="" aria-hidden="true" height={24} src="/search-icon.svg" width={24} />
          </Link>
        </div>
      </header>

      <div className="main-container">
        <aside className={`side-bar ${menuStateClass}`}>
          {categoryGroups.map((group) => (
            <div className={group.name === "noGroup" ? undefined : "sidebar-group"} key={group.name}>
              {group.name === "noGroup" ? null : <h3>{group.name}</h3>}
              {group.categories.map((category) => (
                <Link
                  className="sidebar-item"
                  href={`/categories/${encodeURIComponent(category)}/1/`}
                  key={category}
                  onClick={() => setMenuOpen(null)}
                >
                  {category}
                </Link>
              ))}
            </div>
          ))}
        </aside>
        <main className="contents">{children}</main>
      </div>

      <footer className="footer">
        <p>All rights reserved.</p>
      </footer>
    </div>
  );
}
