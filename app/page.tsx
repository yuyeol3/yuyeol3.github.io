import type { Metadata } from "next";

import Comments from "@/components/Comments";
import PostList from "@/components/PostList";
import { getAllPosts, getPostSummaries } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: SITE_DESCRIPTION,
  title: { absolute: SITE_NAME },
};

export default function HomePage() {
  const recentPosts = getPostSummaries(getAllPosts().slice(0, 5));

  return (
    <>
      <h1>yuyeol3.github.io</h1>
      <p>블로그 방문을 환영합니다! 이 블로그는 Next.js와 GitHub Pages를 기반으로 합니다.</p>
      <PostList posts={recentPosts} title="최근 게시글" />
      <section className="main-comments">
        <h2>Comments</h2>
        <Comments term="main" />
      </section>
    </>
  );
}
