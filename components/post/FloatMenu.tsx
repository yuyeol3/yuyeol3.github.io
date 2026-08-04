"use client";

import { useState } from "react";

export default function FloatMenu() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1000);
      })
      .catch((error: unknown) => console.error("Failed to copy link:", error));
  }

  return (
    <div className="float-menu">
      <button aria-label="페이지 위로 이동" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} type="button">
        ↑
      </button>
      <button
        aria-label="페이지 아래로 이동"
        onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
        type="button"
      >
        ↓
      </button>
      <button aria-label="현재 게시글 주소 복사" onClick={copyLink} type="button">
        {copied ? "✅" : "📋"}
      </button>
    </div>
  );
}
