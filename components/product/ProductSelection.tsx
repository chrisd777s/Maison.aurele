"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { MetalId } from "@/lib/commerce/types";

type Selection = {
  metal: MetalId;
  setMetal: (metal: MetalId) => void;
  size: string | undefined;
  setSize: (size: string) => void;
};

const SelectionContext = createContext<Selection | null>(null);

/** Métal et taille choisis, partagés entre la galerie (couleur du métal) et le bloc d'achat. */
export function ProductSelectionProvider({
  defaultMetal,
  defaultSize,
  children,
}: {
  defaultMetal: MetalId;
  defaultSize?: string;
  children: ReactNode;
}) {
  const [metal, setMetal] = useState(defaultMetal);
  const [size, setSize] = useState(defaultSize);
  return <SelectionContext value={{ metal, setMetal, size, setSize }}>{children}</SelectionContext>;
}

export function useProductSelection() {
  const value = useContext(SelectionContext);
  if (!value) throw new Error("useProductSelection hors de ProductSelectionProvider");
  return value;
}
