import fs from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";

interface ImageDimensions {
  height: number;
  width: number;
}

const publicDirectory = path.join(process.cwd(), "public");

export function getLocalImageDimensions(source: string | undefined): ImageDimensions | undefined {
  if (!source?.startsWith("/images/")) {
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
