"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Un seul observateur pour toute la page : chaque élément `[data-reveal]`
 * reçoit `data-visible` à son entrée dans l'écran (fondu + montée de 16 px en CSS).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-visible])");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.setAttribute("data-visible", ""));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
