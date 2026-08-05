import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

const CACHE_VERSION = 1;
const MAX_CONCURRENCY = 4;
const REQUEST_TIMEOUT_MS = 10_000;
const repositoryRoot = process.cwd();
const postsDirectory = path.join(repositoryRoot, "posts");
const cachePath = path.join(repositoryRoot, ".cache", "remote-image-dimensions.json");
const githubAttachmentPattern = /^\/user-attachments\/assets\/[0-9a-f-]+$/i;
const githubAttachmentUrlPattern = /https:\/\/github\.com\/user-attachments\/assets\/[0-9a-f-]+(?:[?#][^\s"'<>)]*)?/gi;

function isImageDimensions(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    Number.isInteger(value.width) &&
    value.width > 0 &&
    Number.isInteger(value.height) &&
    value.height > 0
  );
}

function normalizeGithubAttachmentUrl(value) {
  try {
    const url = new URL(value);

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

function readCache() {
  try {
    const parsed = JSON.parse(fs.readFileSync(cachePath, "utf8"));

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      parsed.version !== CACHE_VERSION ||
      typeof parsed.images !== "object" ||
      parsed.images === null ||
      Array.isArray(parsed.images)
    ) {
      throw new Error("unsupported cache structure");
    }

    for (const [url, dimensions] of Object.entries(parsed.images)) {
      if (normalizeGithubAttachmentUrl(url) !== url || !isImageDimensions(dimensions)) {
        throw new Error(`invalid cache entry: ${url}`);
      }
    }

    return parsed;
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.warn(`[remote-images] Ignoring invalid cache: ${error.message}`);
    }

    return { version: CACHE_VERSION, images: {} };
  }
}

function findMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return findMarkdownFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function collectGithubAttachmentUrls() {
  const urls = new Set();

  for (const markdownPath of findMarkdownFiles(postsDirectory)) {
    const markdown = fs.readFileSync(markdownPath, "utf8");

    for (const match of markdown.matchAll(githubAttachmentUrlPattern)) {
      const normalizedUrl = normalizeGithubAttachmentUrl(match[0]);

      if (normalizedUrl) {
        urls.add(normalizedUrl);
      }
    }
  }

  return [...urls].sort();
}

async function fetchImageDimensions(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "yuyeol3-blog-image-metadata/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const dimensions = imageSize(Buffer.from(await response.arrayBuffer()));

  if (!isImageDimensions(dimensions)) {
    throw new Error("image dimensions are unavailable");
  }

  return { width: dimensions.width, height: dimensions.height };
}

async function collectMissingDimensions(cache, missingUrls) {
  let nextIndex = 0;
  let fetchedCount = 0;
  let failedCount = 0;

  async function worker() {
    while (nextIndex < missingUrls.length) {
      const url = missingUrls[nextIndex];
      nextIndex += 1;

      try {
        cache.images[url] = await fetchImageDimensions(url);
        fetchedCount += 1;
        console.log(
          `[remote-images] ${url} -> ${cache.images[url].width}x${cache.images[url].height}`,
        );
      } catch (error) {
        failedCount += 1;
        console.warn(`[remote-images] Failed to inspect ${url}: ${error.message}`);
      }
    }
  }

  const workerCount = Math.min(MAX_CONCURRENCY, missingUrls.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return { fetchedCount, failedCount };
}

function writeCache(cache) {
  const cacheDirectory = path.dirname(cachePath);
  const temporaryPath = `${cachePath}.${process.pid}.tmp`;

  fs.mkdirSync(cacheDirectory, { recursive: true });
  fs.writeFileSync(temporaryPath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");

  try {
    fs.renameSync(temporaryPath, cachePath);
  } finally {
    if (fs.existsSync(temporaryPath)) {
      fs.unlinkSync(temporaryPath);
    }
  }
}

async function main() {
  const urls = collectGithubAttachmentUrls();
  const cache = readCache();
  const missingUrls = urls.filter((url) => !cache.images[url]);
  const cachedCount = urls.length - missingUrls.length;
  const { fetchedCount, failedCount } = await collectMissingDimensions(cache, missingUrls);

  writeCache(cache);
  console.log(
    `[remote-images] ${urls.length} images: ${cachedCount} cached, ${fetchedCount} fetched, ${failedCount} failed.`,
  );
}

await main();
