import { getProducts } from "@/lib/commerce";
import { mailer } from "@/lib/mail";
import { orderConfirmation } from "@/lib/mail/templates/order";
import { DELIVERIES, type Delivery } from "@/lib/shop/order";
import { verifyWebhook, type CheckoutSession } from "@/lib/stripe";

/** Paiement confirmé par Stripe → courriel de confirmation de commande. */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook non configuré", { status: 501 });

  const payload = await request.text();
  if (!verifyWebhook(payload, request.headers.get("stripe-signature"), secret))
    return new Response("Signature invalide", { status: 400 });

  const event = JSON.parse(payload) as { type: string; data: { object: CheckoutSession } };
  if (event.type !== "checkout.session.completed") return Response.json({ received: true });

  const session = event.data.object;
  const meta = session.metadata;
  const email = session.customer_details?.email;
  if (!email) return Response.json({ received: true });

  const locale = meta.locale === "en" ? "en" : "fr";
  const names = new Map((await getProducts(locale)).map((p) => [p.slug, p.name]));
  const pieces = (meta.lines ?? "")
    .split(",")
    .map((line) => line.split("~"))
    .map(([slug, , , quantity]) => {
      const name = names.get(slug ?? "") ?? slug ?? "";
      return Number(quantity) > 1 ? `${name} ×${quantity}` : name;
    });

  await mailer().send(
    orderConfirmation({
      reference: meta.reference ?? session.id,
      locale,
      email,
      name: session.customer_details?.name ?? undefined,
      pieces,
      paidCad: (session.amount_total ?? 0) / 100,
      balanceCad: Number(meta.balance_cad ?? 0),
      delivery: DELIVERIES.includes(meta.delivery as Delivery)
        ? (meta.delivery as Delivery)
        : "domicile",
      giftWrap: meta.gift_wrap === "oui",
    }),
  );
  return Response.json({ received: true });
}
