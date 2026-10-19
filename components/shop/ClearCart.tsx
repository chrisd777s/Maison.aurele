"use client";

import { useEffect } from "react";
import { useShop } from "@/lib/shop/store";

/** Vide le panier une fois la commande confirmée (après relecture de l'état local). */
export function ClearCart() {
  const hydrated = useShop((s) => s.hydrated);
  const clearCart = useShop((s) => s.clearCart);
  useEffect(() => {
    if (hydrated) clearCart();
  }, [hydrated, clearCart]);
  return null;
}
