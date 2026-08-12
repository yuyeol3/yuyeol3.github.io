"use client";

import { useEffect, useRef, useState } from "react";

interface CommentsProps {
  term: string;
}

type CommentStatus = "loading" | "ready" | "failed";

interface CommentState {
  status: CommentStatus;
  term: string;
}

function getUtterancesTheme() {
  return document.documentElement.dataset.theme === "dark" ? "github-dark" : "github-light";
}

export default function Comments({ term }: CommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const [commentState, setCommentState] = useState<CommentState>({ status: "loading", term });
  const status = commentState.term === term ? commentState.status : "loading";

  useEffect(() => {
    const container = commentsRef.current;
    if (!container) {
      return;
    }

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector<HTMLIFrameElement>(".utterances-frame");
      iframe?.setAttribute("loading", "eager");

      const utterances = container.querySelector<HTMLElement>(".utterances");
      if (utterances?.style.height) {
        observer.disconnect();
        setCommentState({ status: "ready", term });
      }
    });

    observer.observe(container, {
      attributeFilter: ["style"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("issue-term", term);
    script.setAttribute("repo", "yuyeol3/yuyeol3.github.io");
    script.setAttribute("theme", getUtterancesTheme());
    script.onerror = () => {
      observer.disconnect();
      setCommentState({ status: "failed", term });
    };
    const loadTimer = window.setTimeout(() => container.appendChild(script));

    return () => {
      window.clearTimeout(loadTimer);
      observer.disconnect();
      container.replaceChildren();
    };
  }, [term]);

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
    <div className="comments-wrapper">
      {status === "loading" ? <p className="loading">댓글 불러오는 중...</p> : null}
      {status === "failed" ? <p className="not-found">댓글을 불러오지 못했습니다.</p> : null}
      <div ref={commentsRef} />
    </div>
  );
}
