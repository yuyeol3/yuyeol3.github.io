import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Comments from "@/components/Comments";
import FloatMenu from "@/components/post/FloatMenu";
import MarkdownContent from "@/components/post/MarkdownContent";
import TableOfContents from "@/components/post/TableOfContents";
import { getAllPosts, getPost } from "@/lib/posts";
import { SITE_DESCRIPTION } from "@/lib/site";

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ category: post.category, slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPost(category, slug);

  if (!post) {
    return {};
  }

  return {
    alternates: { canonical: post.url },
    description: post.description || SITE_DESCRIPTION,
    openGraph: {
      description: post.description || SITE_DESCRIPTION,
      title: post.title,
      type: "article",
      url: post.url,
    },
    title: post.title,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = getPost(category, slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="post-view">
      <FloatMenu />
      <header className="post-header">
        <h1>{post.title}</h1>
        <p className="posted-date">
          <i>by yuyeol3, {post.date}</i>
        </p>
      </header>
      <TableOfContents headings={post.headings} />
      <hr className="hr" />
      <MarkdownContent markdown={post.markdown} />
      <hr className="hr" />
      <section className="post-footer">
        <h2>Comments</h2>
        <Comments term={post.fileName} />
      </section>
    </article>
  );
}
