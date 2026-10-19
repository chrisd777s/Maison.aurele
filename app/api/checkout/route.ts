import { siteUrl } from "@/data/maison";
import { getPathname } from "@/i18n/navigation";
import { getProducts } from "@/lib/commerce";
import { makeReference } from "@/lib/reference";
import { toCatalogueEntry } from "@/lib/shop/catalogue";
import { checkoutSchema } from "@/lib/shop/checkout-schema";
import { DEPOSIT_RATE, priceOrder } from "@/lib/shop/order";
import { createCheckoutSession, stripeKey } from "@/lib/stripe";
import { createTranslator } from "next-intl";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

/**
 * Création du paiement. Le navigateur envoie des références (pièce, métal, taille) ;
 * les prix sont relus ici dans le catalogue. Sans clé Stripe : mode démonstration.
 */
export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });
  const { locale, lines, gift, delivery, returnPath } = parsed.data;

  const catalogue = (await getProducts(locale)).map(toCatalogueEntry);
  const order = priceOrder(lines, catalogue);
  // Panier périmé (pièce retirée, taille changée) : le navigateur doit le corriger.
  if (order.invalid.length || !order.lines.length)
    return Response.json({ error: "stale", invalid: order.invalid }, { status: 409 });

  const reference = makeReference("MA");
  const thankYou = getPathname({ href: "/commande/merci", locale });

  if (!stripeKey()) {
    return Response.json({ url: `${thankYou}?ref=${reference}&demo=1`, mode: "demo" });
  }

  const t = createTranslator({ locale, messages: locale === "fr" ? fr : en });
  const origin = process.env.NEXT_PUBLIC_SITE_URL ? siteUrl : new URL(request.url).origin;
  const session = await createCheckoutSession({
    mode: "payment",
    locale,
    client_reference_id: reference,
    success_url: `${origin}${thankYou}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${returnPath ?? `/${locale}`}`,
    line_items: order.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "cad",
        unit_amount: line.unitDueNow * 100,
        product_data: {
          name: line.deposit
            ? t("Cart.stripeDepositName", { name: line.entry.name, rate: DEPOSIT_RATE * 100 })
            : line.entry.name,
          description: [t(`Materials.metals.${line.metal}`), line.size].filter(Boolean).join(" · "),
        },
      },
    })),
    ...(delivery === "domicile"
      ? {
          shipping_address_collection: { allowed_countries: ["CA", "US", "FR", "BE", "CH", "GB"] },
          shipping_options: [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 0, currency: "cad" },
                display_name: t("Cart.deliveries.domicile.name"),
              },
            },
          ],
        }
      : {}),
    phone_number_collection: { enabled: true },
    ...(order.balance > 0
      ? { custom_text: { submit: { message: t("Cart.stripeDepositNote") } } }
      : {}),
    metadata: {
      reference,
      locale,
      delivery,
      gift_wrap: gift.wrap ? "oui" : "non",
      gift_card: gift.card.slice(0, 480),
      balance_cad: order.balance,
      lines: order.lines
        .map((l) => [l.slug, l.metal, l.size ?? "", l.quantity].join("~"))
        .join(",")
        .slice(0, 480),
    },
  });

  return Response.json({ url: session.url, mode: "stripe" });
}
