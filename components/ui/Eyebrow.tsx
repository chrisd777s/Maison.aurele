import type { ReactNode } from "react";

/** Surtitre : capitales espacées, précédé d'un filet champagne. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`surtitre flex items-start gap-4 text-encre-douce ${className}`}>
      <span aria-hidden="true" className="mt-[0.7em] h-px w-8 shrink-0 bg-accent" />
      {children}
    </p>
  );
}
