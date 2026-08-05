import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDirectory = path.join(root, "out");
const postsDirectory = path.join(root, "posts");
const remoteCachePath = path.join(root, ".cache", "remote-image-dimensions.json");
const postsPerPage = 10;
const githubAttachmentPattern = /^\/user-attachments\/assets\/[0-9a-f-]+$/i;

function getMarkdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return getMarkdownFiles(fullPath);
    }
    return entry.isFile() && path.extname(entry.name) === ".md" ? [fullPath] : [];
  });
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing exported file: ${path.relative(root, filePath)}`);
  }
}

function normalizeGithubAttachmentUrl(source) {
  try {
    const url = new URL(source);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "github.com" ||
      !githubAttachmentPattern.test(url.pathname)
    ) {
      return undefined;
    }

    return `https://github.com${url.pathname}`;
  } catch {
    return undefined;
  }
}

function getCachedRemoteImages() {
  try {
    const parsed = JSON.parse(fs.readFileSync(remoteCachePath, "utf8"));
    if (parsed?.version !== 1 || typeof parsed.images !== "object" || parsed.images === null) {
      return new Set();
    }

    for (const [url, dimensions] of Object.entries(parsed.images)) {
      if (
        normalizeGithubAttachmentUrl(url) !== url ||
        !Number.isInteger(dimensions?.width) ||
        dimensions.width <= 0 ||
        !Number.isInteger(dimensions?.height) ||
        dimensions.height <= 0
      ) {
        return new Set();
      }
    }

    return new Set(Object.keys(parsed.images));
  } catch {
    return new Set();
  }
}

function getImageTags(exportedPost) {
  return [...exportedPost.matchAll(/<img\b[^>]*>/gi)];
}

function requirePrerenderedImage(imageMatch, exportedPost, relativePath, imageType) {
  const imageTag = imageMatch[0];
  if (!/\bwidth="\d+"/.test(imageTag) || !/\bheight="\d+"/.test(imageTag)) {
    const imageSource = imageTag.match(/\bsrc="([^"]+)"/i)?.[1] ?? "unknown image";
    throw new Error(
      `${imageType} is missing prerendered dimensions: ${relativePath} (${imageSource})`,
    );
  }

  const imageIndex = imageMatch.index;
  const frameIndex = exportedPost.lastIndexOf('<span class="post-image-frame', imageIndex);
  const frameEndIndex = frameIndex >= 0 ? exportedPost.indexOf("</span>", frameIndex) : -1;

  if (frameIndex < 0 || frameEndIndex < imageIndex) {
    const imageSource = imageTag.match(/\bsrc="([^"]+)"/i)?.[1] ?? "unknown image";
    throw new Error(`${imageType} is missing its skeleton frame: ${relativePath} (${imageSource})`);
  }
}

function getPostLocation(filePath) {
  const relativePath = path.relative(postsDirectory, filePath);
  const pathParts = relativePath.split(path.sep);
  const fileName = pathParts.at(-1);
  const category = pathParts.at(-2);
  const group = pathParts.length === 3 ? pathParts[0] : undefined;

  if (!fileName || !category || (pathParts.length !== 2 && pathParts.length !== 3)) {
    throw new Error(`Invalid post path: ${relativePath}`);
  }

  return { category, fileName, group, relativePath };
}

for (const relativePath of ["index.html", "404.html", "sitemap.xml", "robots.txt", ".nojekyll"]) {
  requireFile(path.join(outDirectory, relativePath));
}

const markdownFiles = getMarkdownFiles(postsDirectory);
const categoryCounts = new Map();
const groupedCategories = new Map();
const cachedRemoteImages = getCachedRemoteImages();
let verifiedImageCount = 0;

for (const filePath of markdownFiles) {
  const { category, fileName, group, relativePath } = getPostLocation(filePath);
  const slug = path.basename(fileName, ".md");
  const exportedPostPath = path.join(outDirectory, "posts", category, slug, "index.html");

  requireFile(exportedPostPath);
  const exportedPost = fs.readFileSync(exportedPostPath, "utf8");
  if (!exportedPost.includes('class="post-header"')) {
    throw new Error(`Exported post is missing its rendered content: ${relativePath}`);
  }

  for (const imageMatch of getImageTags(exportedPost)) {
    const imageSource = imageMatch[0].match(/\bsrc="([^"]+)"/i)?.[1];
    const normalizedRemoteSource = imageSource
      ? normalizeGithubAttachmentUrl(imageSource)
      : undefined;

    if (imageSource?.startsWith("/images/")) {
      requirePrerenderedImage(imageMatch, exportedPost, relativePath, "Local image");
      verifiedImageCount += 1;
    } else if (normalizedRemoteSource && cachedRemoteImages.has(normalizedRemoteSource)) {
      requirePrerenderedImage(imageMatch, exportedPost, relativePath, "Cached remote image");
      verifiedImageCount += 1;
    }
  }
  categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);

  if (group) {
    const categories = groupedCategories.get(group) ?? new Set();
    categories.add(category);
    groupedCategories.set(group, categories);
  }
}

for (const [category, count] of categoryCounts) {
  const pageCount = Math.ceil(count / postsPerPage);
  for (let page = 1; page <= pageCount; page += 1) {
    requireFile(path.join(outDirectory, "categories", category, String(page), "index.html"));
  }
}

const exportedIndex = fs.readFileSync(path.join(outDirectory, "index.html"), "utf8");
if (!/<html\b[^>]*\bdata-scroll-behavior="smooth"/.test(exportedIndex)) {
  throw new Error('Exported root HTML is missing data-scroll-behavior="smooth".');
}

for (const [group, categories] of groupedCategories) {
  const groupHeading = `<h3>${group}</h3>`;
  const groupStart = exportedIndex.indexOf(groupHeading);
  const groupEnd = exportedIndex.indexOf("</div>", groupStart);
  const groupMarkup = groupStart >= 0 && groupEnd >= 0 ? exportedIndex.slice(groupStart, groupEnd) : "";

  for (const category of categories) {
    if (!groupMarkup.includes(`>${category}</a>`)) {
      throw new Error(`Exported sidebar is missing category group: ${group}/${category}`);
    }
  }
}

console.log(
  `Verified static export for ${markdownFiles.length} posts, ${categoryCounts.size} categories, and ${verifiedImageCount} sized images.`,
);
