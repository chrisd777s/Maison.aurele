"use client";

import { useTranslations } from "next-intl";
import { NavLink } from "@/components/layout/NavLink";
import { Icon } from "@/components/ui/Icon";
import { useCartDrawer, useShop } from "@/lib/shop/store";

/** Pastille de compte, annoncée avec le libellé du lien. */
function Count({ value }: { value: number }) {
  if (!value) return null;
  return (
    <span
      aria-hidden="true"
      className="chiffres absolute top-1 right-0.5 inline-flex size-4 items-center justify-center rounded-full bg-encre text-[0.625rem] leading-none text-fond"
    >
      {value}
    </span>
  );
}

/** Écrin et panier, à droite de l'en-tête. */
export function HeaderShopLinks() {
  const t = useTranslations("Cart");
  const nav = useTranslations("Nav");
  const ecrinCount = useShop((s) => s.ecrin.length);
  const cartCount = useShop((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const setCartOpen = useCartDrawer((s) => s.setOpen);

  return (
    <>
      <li>
        <NavLink
          href="/ecrin"
          className="relative inline-flex size-11 items-center justify-center"
          aria-label={ecrinCount ? t("ecrinCount", { count: ecrinCount }) : nav("ecrin")}
        >
          <Icon name="ecrin" />
          <Count value={ecrinCount} />
        </NavLink>
      </li>
      <li>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-haspopup="dialog"
          aria-label={cartCount ? t("openWithCount", { count: cartCount }) : t("open")}
          className="relative -mr-2 inline-flex size-11 items-center justify-center"
          data-testid="ouvrir-panier"
        >
          <Icon name="sac" />
          <Count value={cartCount} />
        </button>
      </li>
    </>
  );
}
