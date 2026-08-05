"use client";

import { useCallback, useState, type CSSProperties, type ImgHTMLAttributes } from "react";

interface PostImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  intrinsicHeight: number;
  intrinsicWidth: number;
  src: string;
}

export default function PostImage({
  alt,
  className,
  height: authoredHeight,
  intrinsicHeight,
  intrinsicWidth,
  onError,
  onLoad,
  src,
  style,
  width: authoredWidth,
  ...props
}: PostImageProps) {
  void authoredHeight;
  const [settled, setSettled] = useState(false);
  const {
    display: authoredDisplay,
    maxWidth: authoredMaxWidth,
    width: authoredStyleWidth,
    ...imageStyle
  } = style ?? {};
  const frameStyle: CSSProperties = {
    aspectRatio: `${intrinsicWidth} / ${intrinsicHeight}`,
    display: authoredDisplay === "inline" ? "inline-block" : (authoredDisplay ?? "block"),
    maxWidth: authoredMaxWidth ?? "100%",
    width: authoredStyleWidth ?? authoredWidth ?? `min(100%, ${intrinsicWidth}px)`,
  };
  const imageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) {
      setSettled(true);
    }
  }, []);

  return (
    <span
      className={`post-image-frame${settled ? " post-image-frame--settled" : ""}`}
      style={frameStyle}
    >
      {/* The static export intentionally keeps regular img behavior for Markdown content. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        ref={imageRef}
        alt={alt ?? ""}
        className={`post-image${className ? ` ${className}` : ""}`}
        height={intrinsicHeight}
        onError={(event) => {
          setSettled(true);
          onError?.(event);
        }}
        onLoad={(event) => {
          setSettled(true);
          onLoad?.(event);
        }}
        src={src}
        style={imageStyle}
        width={intrinsicWidth}
      />
    </span>
  );
}
