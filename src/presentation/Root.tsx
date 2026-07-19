"use client";

import { useEffect, useState } from "react";
import { bootstrap } from "@/src/composition-root";
import { App } from "./App";
import { StoreProvider } from "./store/store-context";
import type { MiloStore } from "./store/milo-store";

/**
 * Client entry point: wires the composition root in the browser only (after
 * mount, so IndexedDB/the AI SDK are never touched during static export), then
 * provides the store to the app.
 */
export function Root() {
  const [store, setStore] = useState<MiloStore | null>(null);

  // Bootstrap the composition root in the browser only, AFTER mount — it opens
  // IndexedDB and the AI SDK, which must not run during static export. First
  // client render must match the server (both null), so this is intentionally a
  // mount effect rather than a lazy initializer (which would hydration-mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate one-time client-only init
    setStore(bootstrap());
  }, []);

  if (!store) return null;

  return (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  );
}
