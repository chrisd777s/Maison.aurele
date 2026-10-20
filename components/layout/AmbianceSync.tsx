"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { ambianceFor, applyAmbiance } from "@/lib/ambiance";

/** Tient l'ambiance de `<html>` à jour lors des navigations côté client. */
export function AmbianceSync({ pieces }: { pieces: Record<string, string> }) {
  const pathname = usePathname();
  useLayoutEffect(() => applyAmbiance(ambianceFor(pathname, pieces)), [pathname, pieces]);
  return null;
}
