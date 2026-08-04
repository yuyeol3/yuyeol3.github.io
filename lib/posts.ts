import fs from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";

import { POSTS_PER_PAGE } from "@/lib/site";

const postsDirectory = path.join(process.cwd(), "posts");

export interface Heading {
  id: string;
  level: number;
  title: string;
}

export interface PostSummary {
  category: string;
  date: string;
  description: string;
  fileName: string;
  legacyHref: string;
  slug: string;
  sourcePath: string;
  title: string;
  url: string;
}

export interface PostContent extends PostSummary {
  group?: string;
  headings: Heading[];
  markdown: string;
}

export interface CategoryGroup {
  categories: string[];
  name: string;
}

let postsCache: PostContent[] | undefined;

function getMarkdownFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(fullPath);
    }

    return entry.isFile() && path.extname(entry.name) === ".md" ? [fullPath] : [];
  });
}

function normalizeDate(value: unknown, fileName: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const dateFromFileName = fileName.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (!dateFromFileName) {
    throw new Error(`게시글 파일명에서 날짜를 찾을 수 없습니다: ${fileName}`);
  }

  return dateFromFileName;
}

function inlineMarkdownToText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, "$1")
    .trim();
}

function getDescription(markdown: string): string {
  const paragraph = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .find((block) => {
      return (
        block.length > 0 &&
        !block.startsWith("#") &&
        !block.startsWith("```") &&
        !block.startsWith("<img")
      );
    });

  if (!paragraph) {
    return "";
  }

  const text = inlineMarkdownToText(paragraph.replace(/\r?\n/g, " "));
  return text.length > 200 ? `${text.slice(0, 200)}...` : text;
}

function getHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  let isCodeBlock = false;

  return markdown.split(/\r?\n/).flatMap((line) => {
    if (line.trimStart().startsWith("```")) {
      isCodeBlock = !isCodeBlock;
      return [];
    }

    if (isCodeBlock) {
      return [];
    }

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) {
      return [];
    }

    const title = inlineMarkdownToText(match[2]);
    return [{ id: slugger.slug(title), level: match[1].length, title }];
  });
}

function parsePost(filePath: string): PostContent {
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = matter(source);
  const relativePath = path.relative(postsDirectory, filePath).replace(/\\/g, "/");
  const pathParts = relativePath.split("/");
  const fileName = pathParts.at(-1);
  const category = pathParts.at(-2);
  const group = pathParts.length === 3 ? pathParts[0] : undefined;

  if (!fileName || !category || (pathParts.length !== 2 && pathParts.length !== 3)) {
    throw new Error(
      `게시글은 posts/<category>/<file>.md 또는 posts/<group>/<category>/<file>.md 형식이어야 합니다: ${relativePath}`,
    );
  }

  const lines = parsed.content.replace(/\r\n/g, "\n").split("\n");
  const titleLineIndex = lines.findIndex((line) => /^#\s+/.test(line));
  const titleFromContent =
    titleLineIndex >= 0 ? lines[titleLineIndex].replace(/^#\s+/, "").trim() : undefined;
  const title = typeof parsed.data.title === "string" ? parsed.data.title : titleFromContent;

  if (!title) {
    throw new Error(`게시글 제목을 찾을 수 없습니다: ${relativePath}`);
  }

  const markdown =
    titleLineIndex >= 0
      ? [...lines.slice(0, titleLineIndex), ...lines.slice(titleLineIndex + 1)]
          .join("\n")
          .trimStart()
      : parsed.content.trimStart();
  const slug = path.basename(fileName, ".md");
  const sourcePath = `posts/${category}/${fileName}`;

  return {
    category,
    date: normalizeDate(parsed.data.date, fileName),
    description:
      typeof parsed.data.description === "string"
        ? parsed.data.description
        : getDescription(markdown),
    fileName,
    group,
    headings: getHeadings(markdown),
    legacyHref: `/post-view?href=${encodeURIComponent(sourcePath)}`,
    markdown,
    slug,
    sourcePath,
    title,
    url: `/posts/${encodeURIComponent(category)}/${encodeURIComponent(slug)}/`,
  };
}

export function getAllPosts(): PostContent[] {
  if (!postsCache) {
    postsCache = getMarkdownFiles(postsDirectory)
      .map(parsePost)
      .sort((left, right) => {
        return right.date.localeCompare(left.date) || left.title.localeCompare(right.title, "ko");
      });
  }

  return postsCache;
}

export function getPostSummaries(posts = getAllPosts()): PostSummary[] {
  return posts.map((post) => ({
    category: post.category,
    date: post.date,
    description: post.description,
    fileName: post.fileName,
    legacyHref: post.legacyHref,
    slug: post.slug,
    sourcePath: post.sourcePath,
    title: post.title,
    url: post.url,
  }));
}

export function decodeRouteParam(value: string): string {
  return decodeURIComponent(value);
}

export function getPost(category: string, slug: string): PostContent | undefined {
  const decodedCategory = decodeRouteParam(category);
  const decodedSlug = decodeRouteParam(slug);
  return getAllPosts().find(
    (post) => post.category === decodedCategory && post.slug === decodedSlug,
  );
}

export function getCategories(): string[] {
  return [...new Set(getAllPosts().map((post) => post.category))];
}

export function getCategoryPosts(category: string): PostContent[] {
  const decodedCategory = decodeRouteParam(category);
  return getAllPosts().filter((post) => post.category === decodedCategory);
}

export function getCategoryPageCount(category: string): number {
  return Math.max(1, Math.ceil(getCategoryPosts(category).length / POSTS_PER_PAGE));
}

export function getCategoryGroups(): CategoryGroup[] {
  const groupedCategories = new Map<string, Set<string>>();
  const ungroupedCategories = new Set<string>();

  for (const post of getAllPosts()) {
    if (!post.group) {
      ungroupedCategories.add(post.category);
      continue;
    }

    const categories = groupedCategories.get(post.group) ?? new Set<string>();
    categories.add(post.category);
    groupedCategories.set(post.group, categories);
  }

  const compareNames = (left: string, right: string) => left.localeCompare(right, "ko");
  const groups = [...groupedCategories]
    .sort(([left], [right]) => compareNames(left, right))
    .map(([name, categories]) => ({
      name,
      categories: [...categories].sort(compareNames),
    }));
  const ungrouped = [...ungroupedCategories].sort(compareNames);

  return ungrouped.length > 0 ? [...groups, { name: "noGroup", categories: ungrouped }] : groups;
}
