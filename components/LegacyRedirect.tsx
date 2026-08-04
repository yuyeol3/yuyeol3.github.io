"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

interface LegacyPostRedirectProps {
  routes: Record<string, string>;
}

interface LegacyBoardRedirectProps {
  pageCounts: Record<string, number>;
}

function RedirectMessage({ target }: { target?: string }) {
  return target ? (
    <p>
      새 주소로 이동합니다. 이동하지 않으면 <Link href={target}>여기를 눌러주세요.</Link>
    </p>
  ) : (
    <div className="not-found">
      <h1>404</h1>
      <p>요청한 페이지를 찾을 수 없습니다.</p>
    </div>
  );
}

export function LegacyPostRedirect({ routes }: LegacyPostRedirectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = useMemo(() => {
    const href = searchParams.get("href")?.replace(/^\//, "");
    return href ? routes[href] : undefined;
  }, [routes, searchParams]);

  useEffect(() => {
    if (target) {
      router.replace(target);
    }
  }, [router, target]);

  return <RedirectMessage target={target} />;
}

export function LegacyBoardRedirect({ pageCounts }: LegacyBoardRedirectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = useMemo(() => {
    const category = searchParams.get("name");
    const page = Number(searchParams.get("page"));
    const pageCount = category ? pageCounts[category] : undefined;

    if (!category || !pageCount || !Number.isInteger(page) || page < 1 || page > pageCount) {
      return undefined;
    }

    return `/categories/${encodeURIComponent(category)}/${page}/`;
  }, [pageCounts, searchParams]);

  useEffect(() => {
    if (target) {
      router.replace(target);
    }
  }, [router, target]);

  return <RedirectMessage target={target} />;
}

export function LegacySearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/search/");
  }, [router]);

  return <RedirectMessage target="/search/" />;
}
