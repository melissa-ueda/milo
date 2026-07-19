"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { MiloState, MiloStore } from "./milo-store";

const StoreContext = createContext<MiloStore | null>(null);

export function StoreProvider({
  store,
  children,
}: {
  store: MiloStore;
  children: React.ReactNode;
}) {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useStore(): MiloStore {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used within a StoreProvider");
  return store;
}

/** Subscribe to a slice of state; re-renders when the selected value changes. */
export function useStoreState<T>(selector: (state: MiloState) => T): T {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}
