"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pagePath =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    if (typeof window.gtag === "function") {
      window.gtag("config", "G-SPP14R22ER", {
        page_path: pagePath,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
