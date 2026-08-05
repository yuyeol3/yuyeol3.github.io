import fs from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";

export interface ImageDimensions {
  height: number;
  width: number;
}

const publicDirectory = path.join(process.cwd(), "public");
const remoteCachePath = path.join(process.cwd(), ".cache", "remote-image-dimensions.json");
const githubAttachmentPattern = /^\/user-attachments\/assets\/[0-9a-f-]+$/i;
let remoteImageDimensions: Record<string, ImageDimensions> | undefined;

function isImageDimensions(value: unknown): value is ImageDimensions {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const dimensions = value as Partial<ImageDimensions>;
  return (
    Number.isInteger(dimensions.width) &&
    Number(dimensions.width) > 0 &&
    Number.isInteger(dimensions.height) &&
    Number(dimensions.height) > 0
  );
}

function normalizeGithubAttachmentUrl(source: string): string | undefined {
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

function getRemoteImageDimensions(): Record<string, ImageDimensions> {
  if (remoteImageDimensions) {
    return remoteImageDimensions;
  }

  remoteImageDimensions = {};

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(remoteCachePath, "utf8"));

    if (typeof parsed !== "object" || parsed === null) {
      return remoteImageDimensions;
    }

    const cache = parsed as { images?: unknown; version?: unknown };
    if (cache.version !== 1 || typeof cache.images !== "object" || cache.images === null) {
      return remoteImageDimensions;
    }

    for (const [url, dimensions] of Object.entries(cache.images)) {
      if (normalizeGithubAttachmentUrl(url) !== url || !isImageDimensions(dimensions)) {
        remoteImageDimensions = {};
        return remoteImageDimensions;
      }

      remoteImageDimensions[url] = dimensions;
    }
  } catch {
    // Missing or invalid metadata is intentionally equivalent to an empty cache.
  }

  return remoteImageDimensions;
}

function getLocalImageDimensions(source: string): ImageDimensions | undefined {
  if (!source.startsWith("/images/")) {
    return undefined;
  }

  const sourcePath = source.split(/[?#]/, 1)[0];
  let decodedPath: string;

  try {
    decodedPath = decodeURIComponent(sourcePath);
  } catch {
    return undefined;
  }

  const imagePath = path.resolve(publicDirectory, decodedPath.replace(/^\/+/, ""));
  const relativePath = path.relative(publicDirectory, imagePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath) || !fs.existsSync(imagePath)) {
    return undefined;
  }

  const dimensions = imageSize(fs.readFileSync(imagePath));
  if (!dimensions.width || !dimensions.height) {
    return undefined;
  }

  return { height: dimensions.height, width: dimensions.width };
}

export function getImageDimensions(source: string | undefined): ImageDimensions | undefined {
  if (!source) {
    return undefined;
  }

  const localDimensions = getLocalImageDimensions(source);
  if (localDimensions) {
    return localDimensions;
  }

  const normalizedUrl = normalizeGithubAttachmentUrl(source);
  return normalizedUrl ? getRemoteImageDimensions()[normalizedUrl] : undefined;
}
