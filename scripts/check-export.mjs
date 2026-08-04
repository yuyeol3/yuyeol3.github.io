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

for (const relativePath of ["index.html", "404.html", "sitemap.xml", "robots.txt", ".nojekyll"]) {
  requireFile(path.join(outDirectory, relativePath));
}

const markdownFiles = getMarkdownFiles(postsDirectory);
const categoryCounts = new Map();

for (const filePath of markdownFiles) {
  const relativePath = path.relative(postsDirectory, filePath);
  const [category, fileName] = relativePath.split(path.sep);
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
}

for (const [category, count] of categoryCounts) {
  const pageCount = Math.ceil(count / postsPerPage);
  for (let page = 1; page <= pageCount; page += 1) {
    requireFile(path.join(outDirectory, "categories", category, String(page), "index.html"));
  }
}

console.log(`Verified static export for ${markdownFiles.length} posts and ${categoryCounts.size} categories.`);
