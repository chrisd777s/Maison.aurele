"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { CatalogueEntry } from "@/lib/shop/catalogue";
import { useShop } from "@/lib/shop/store";

const CatalogueContext = createContext<CatalogueEntry[]>([]);

/**
 * Catalogue réduit (pour le panier et l'Écrin) et relecture de l'état local après
 * le montage. Un changement fait dans un autre onglet est repris ici.
 */
export function ShopProvider({
  catalogue,
  children,
}: {
  catalogue: CatalogueEntry[];
  children: ReactNode;
}) {
  useEffect(() => {
    const rehydrate = () =>
      Promise.resolve(useShop.persist.rehydrate()).then(() => useShop.setState({ hydrated: true }));
    void rehydrate();
    const onStorage = (event: StorageEvent) => {
      if (event.key === useShop.persist.getOptions().name) void rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <CatalogueContext value={catalogue}>{children}</CatalogueContext>;
}

export function useCatalogue() {
  return useContext(CatalogueContext);
}

export function useCatalogueEntry(slug: string) {
  return useCatalogue().find((entry) => entry.slug === slug);
}
