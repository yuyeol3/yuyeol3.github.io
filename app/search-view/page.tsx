import type { Metadata } from "next";

import { LegacySearchRedirect } from "@/components/LegacyRedirect";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "검색 주소 이동",
};

export default function LegacySearchPage() {
  return <LegacySearchRedirect />;
}
