"use client";

import { useEffect } from "react";

/** Registers the PWA service worker on mount (moved out of the page shell). */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    navigator.serviceWorker
      .register(`${basePath}/sw.js`)
      .catch((err) =>
        console.error("Service worker registration failed:", err),
      );
  }, []);
  return null;
}
