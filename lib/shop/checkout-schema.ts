import { z } from "zod";
import { METAL_IDS } from "@/lib/commerce/metals";
import { DELIVERIES, GIFT_CARD_MAX, MAX_QUANTITY } from "./order";

/** Corps de `POST /api/checkout` : des références seulement, jamais de prix. */
export const checkoutSchema = z.object({
  locale: z.enum(["fr", "en"]),
  lines: z
    .array(
      z.object({
        slug: z.string().min(1).max(80),
        metal: z.enum(METAL_IDS),
        size: z.string().max(12).optional(),
        quantity: z.number().int().min(1).max(MAX_QUANTITY),
      }),
    )
    .min(1)
    .max(20),
  gift: z.object({ wrap: z.boolean(), card: z.string().max(GIFT_CARD_MAX) }),
  delivery: z.enum(DELIVERIES),
  /** Page à retrouver si le paiement est abandonné (chemin du site uniquement). */
  returnPath: z
    .string()
    .regex(/^\/(fr|en)(\/[^/\s][^\s]*)?$/)
    .optional(),
});

export type CheckoutRequest = z.infer<typeof checkoutSchema>;
