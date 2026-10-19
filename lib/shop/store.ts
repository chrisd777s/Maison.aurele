import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { MetalId } from "@/lib/commerce/types";
import { CURRENCIES, type Currency } from "@/lib/currency";
import {
  DELIVERIES,
  GIFT_CARD_MAX,
  MAX_QUANTITY,
  lineId,
  type CartLine,
  type Delivery,
} from "./order";

export type EcrinItem = { slug: string; metal: MetalId };

type ShopState = {
  /** Vrai une fois l'état relu depuis le stockage local (évite d'afficher un panier vide à tort). */
  hydrated: boolean;
  lines: CartLine[];
  gift: { wrap: boolean; card: string };
  delivery: Delivery;
  ecrin: EcrinItem[];
  currency: Currency;

  addLine: (line: Omit<CartLine, "quantity">) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
  setGift: (gift: Partial<ShopState["gift"]>) => void;
  setDelivery: (delivery: Delivery) => void;
  toggleEcrin: (item: EcrinItem) => void;
  removeEcrin: (slug: string) => void;
  setCurrency: (currency: Currency) => void;
};

/**
 * Ouverture du tiroir : état d'interface, hors du magasin persisté. (Toute écriture
 * dans ce dernier avant sa relecture écraserait le stockage local.)
 */
export const useCartDrawer = create<{ open: boolean; setOpen: (open: boolean) => void }>()(
  (set) => ({ open: false, setOpen: (open) => set({ open }) }),
);

const clampQuantity = (n: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.round(n)));

/**
 * Panier, Écrin et devise, conservés dans le navigateur (localStorage).
 * Les prix n'y figurent pas : ils sont recalculés depuis le catalogue.
 */
export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      hydrated: false,
      lines: [],
      gift: { wrap: true, card: "" },
      delivery: "domicile",
      ecrin: [],
      currency: "CAD",

      addLine: (line) =>
        set((state) => {
          const id = lineId(line);
          const existing = state.lines.find((l) => lineId(l) === id);
          const lines = existing
            ? state.lines.map((l) =>
                lineId(l) === id ? { ...l, quantity: clampQuantity(l.quantity + 1) } : l,
              )
            : [...state.lines, { ...line, quantity: 1 }];
          useCartDrawer.setState({ open: true });
          return { lines };
        }),
      setQuantity: (id, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            lineId(l) === id ? { ...l, quantity: clampQuantity(quantity) } : l,
          ),
        })),
      removeLine: (id) => set((state) => ({ lines: state.lines.filter((l) => lineId(l) !== id) })),
      clearCart: () => set({ lines: [], gift: { wrap: true, card: "" } }),
      setGift: (gift) =>
        set((state) => ({
          gift: {
            ...state.gift,
            ...gift,
            card: (gift.card ?? state.gift.card).slice(0, GIFT_CARD_MAX),
          },
        })),
      setDelivery: (delivery) => set({ delivery }),
      toggleEcrin: (item) =>
        set((state) => ({
          ecrin: state.ecrin.some((i) => i.slug === item.slug)
            ? state.ecrin.filter((i) => i.slug !== item.slug)
            : [...state.ecrin, item],
        })),
      removeEcrin: (slug) =>
        set((state) => ({ ecrin: state.ecrin.filter((i) => i.slug !== slug) })),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "aurele-boutique",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Relu après le montage (ShopProvider) : le rendu serveur et le premier rendu client coïncident.
      skipHydration: true,
      partialize: ({ lines, gift, delivery, ecrin, currency }) => ({
        lines,
        gift,
        delivery,
        ecrin,
        currency,
      }),
      // Valeurs relues prudemment : le stockage local peut contenir n'importe quoi.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ShopState>;
        return {
          ...current,
          lines: Array.isArray(p.lines) ? p.lines : current.lines,
          gift: p.gift && typeof p.gift.wrap === "boolean" ? p.gift : current.gift,
          delivery: p.delivery && DELIVERIES.includes(p.delivery) ? p.delivery : current.delivery,
          ecrin: Array.isArray(p.ecrin) ? p.ecrin : current.ecrin,
          currency: p.currency && CURRENCIES.includes(p.currency) ? p.currency : current.currency,
        };
      },
    },
  ),
);
