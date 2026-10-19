"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type Props = { openLabel: string; closeLabel: string; title: string; children: ReactNode };

/**
 * Menu plein écran sur mobile et tablette. `<dialog>` natif : piège du focus,
 * fermeture par Échap et inertie du reste de la page sans code supplémentaire.
 */
export function MobileMenu({ openLabel, closeLabel, title, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // Une navigation referme le menu.
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        className="surtitre -ml-2 inline-flex min-h-11 items-center gap-3 px-2 text-encre"
      >
        <Icon name="menu" />
        <span className="max-sm:sr-only">{openLabel}</span>
      </button>
      <dialog ref={dialog} aria-label={title} className="menu-plein">
        <div className="flex h-entete items-center px-marge">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="surtitre -ml-2 inline-flex min-h-11 items-center gap-3 px-2 text-encre"
          >
            <Icon name="close" />
            <span>{closeLabel}</span>
          </button>
        </div>
        <div className="px-marge pt-8 pb-12">{children}</div>
      </dialog>
    </>
  );
}
