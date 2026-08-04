import type { MetadataRoute } from "next";

import { getAllPosts, getCategories, getCategoryPageCount } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categoryPages = getCategories().flatMap((category) => {
    const categoryPosts = posts.filter((post) => post.category === category);
    const lastModified = categoryPosts[0]?.date;

    return Array.from({ length: getCategoryPageCount(category) }, (_, index) => ({
      lastModified,
      url: `${SITE_URL}/categories/${encodeURIComponent(category)}/${index + 1}/`,
    }));
  });

  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/search/` },
    ...categoryPages,
    ...posts.map((post) => ({
      lastModified: post.date,
      url: `${SITE_URL}${post.url}`,
    })),
  ];
}
