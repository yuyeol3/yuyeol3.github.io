import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDirectory = path.join(root, "out");
const postsDirectory = path.join(root, "posts");
const postsPerPage = 10;

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

function getLocalImageTags(exportedPost) {
  return exportedPost.match(/<img\b(?=[^>]*\bsrc="\/images\/)[^>]*>/gi) ?? [];
}

function requirePrerenderedImageSize(imageTag, relativePath) {
  if (!/\bwidth="\d+"/.test(imageTag) || !/\bheight="\d+"/.test(imageTag)) {
    const imageSource = imageTag.match(/\bsrc="([^"]+)"/i)?.[1] ?? "unknown image";
    throw new Error(`Local image is missing prerendered dimensions: ${relativePath} (${imageSource})`);
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

for (const filePath of markdownFiles) {
  const { category, fileName, group, relativePath } = getPostLocation(filePath);
  const slug = path.basename(fileName, ".md");
  const exportedPostPath = path.join(outDirectory, "posts", category, slug, "index.html");

  requireFile(exportedPostPath);
  const exportedPost = fs.readFileSync(exportedPostPath, "utf8");
  if (!exportedPost.includes('class="post-header"')) {
    throw new Error(`Exported post is missing its rendered content: ${relativePath}`);
  }

  for (const imageTag of getLocalImageTags(exportedPost)) {
    requirePrerenderedImageSize(imageTag, relativePath);
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

console.log(`Verified static export for ${markdownFiles.length} posts and ${categoryCounts.size} categories.`);
