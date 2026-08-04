import Link from "next/link";

import type { PostSummary } from "@/lib/posts";

interface PostListProps {
  posts: PostSummary[];
  title: string;
}

export default function PostList({ posts, title }: PostListProps) {
  return (
    <section className="board">
      <h1>{title}</h1>
      <div className="post-previews">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link className="post-preview" href={post.url} key={post.sourcePath}>
              <h3>{post.title}</h3>
              <time dateTime={post.date}>{post.date}</time>
              <p>{post.description}</p>
            </Link>
          ))
        ) : (
          <p>결과가 없습니다.</p>
        )}
      </div>
    </section>
  );
}
