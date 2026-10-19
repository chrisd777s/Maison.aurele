"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

/**
 * Panneau « Collections » de l'en-tête (bouton à divulgation, pas de survol imposé).
 * Se referme sur Échap, au clic extérieur et à chaque navigation.
 */
export function CollectionsMenu({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={root}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="group surtitre lien-fin inline-flex min-h-11 items-center gap-2 text-encre aria-expanded:bg-[length:100%_1px]"
      >
        {label}
        <Icon
          name="chevron"
          width={12}
          height={12}
          className="transition-transform duration-[var(--duree-courte)] ease-maison group-aria-expanded:rotate-180"
        />
      </button>
      <div id={panelId} hidden={!open} className="panneau-collections">
        {children}
      </div>
    </div>
  );
}
