"use client";

import { useEffect, useRef, useState } from "react";

interface CommentsProps {
  term: string;
}

type CommentStatus = "idle" | "loading" | "ready" | "failed";

function getUtterancesTheme() {
  return document.documentElement.dataset.theme === "dark" ? "github-dark" : "github-light";
}

export default function Comments({ term }: CommentsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<CommentStatus>("idle");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || status !== "idle") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStatus("loading");
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [status]);

  useEffect(() => {
    const container = commentsRef.current;
    if (!container || status !== "loading") {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("issue-term", term);
    script.setAttribute("repo", "yuyeol3/yuyeol3.github.io");
    script.setAttribute("theme", getUtterancesTheme());
    script.onload = () => setStatus("ready");
    script.onerror = () => setStatus("failed");
    container.appendChild(script);

    return () => script.remove();
  }, [status, term]);

  useEffect(() => {
    const updateTheme = () => {
      const iframe = commentsRef.current?.querySelector("iframe");

      iframe?.contentWindow?.postMessage(
        { theme: getUtterancesTheme(), type: "set-theme" },
        "https://utteranc.es",
      );
    };
    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="comments-wrapper" ref={wrapperRef}>
      {status === "idle" || status === "loading" ? <p className="loading">댓글 불러오는 중...</p> : null}
      {status === "failed" ? <p className="not-found">댓글을 불러오지 못했습니다.</p> : null}
      <div ref={commentsRef} />
    </div>
  );
}
