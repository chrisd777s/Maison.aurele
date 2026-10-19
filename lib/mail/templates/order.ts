import { createTranslator } from "next-intl";
import { maison } from "@/data/maison";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/format";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import type { Delivery } from "@/lib/shop/order";
import type { Mail } from "../types";
import { detailRows, emailLayout, escapeHtml, note, paragraph } from "./layout";

export type OrderSummary = {
  reference: string;
  locale: Locale;
  email: string;
  name?: string;
  pieces: string[];
  paidCad: number;
  balanceCad: number;
  delivery: Delivery;
  giftWrap: boolean;
};

/** Confirmation de commande, envoyée à la réception du paiement (webhook Stripe). */
export function orderConfirmation(order: OrderSummary): Mail {
  const { locale } = order;
  const t = createTranslator({ locale, messages: locale === "fr" ? fr : en });
  const rows: [string, string][] = [
    [t("Email.order.reference"), order.reference],
    [t("Email.order.pieces"), order.pieces.join(" · ")],
    [t("Email.order.paid"), formatPrice(order.paidCad, locale)],
  ];
  if (order.balanceCad > 0)
    rows.push([t("Email.order.balance"), formatPrice(order.balanceCad, locale)]);
  rows.push([t("Email.order.delivery"), t(`Cart.deliveries.${order.delivery}.name`)]);
  if (order.giftWrap) rows.push([t("Email.order.gift"), t("Email.order.giftValue")]);

  const greeting = order.name
    ? t("Email.appointment.greeting", { name: order.name.split(" ")[0] ?? order.name })
    : t("Email.order.greetingAnonymous");

  return {
    to: order.email,
    replyTo: maison.email,
    subject: t("Email.order.subject", { reference: order.reference }),
    html: emailLayout({
      lang: locale,
      preheader: t("Email.order.preheader"),
      eyebrow: t("Email.order.eyebrow"),
      title: t("Email.order.title"),
      body: [
        paragraph(escapeHtml(greeting)),
        paragraph(escapeHtml(t("Email.order.intro"))),
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 28px;">${detailRows(rows)}</table>`,
        paragraph(
          escapeHtml(t(order.balanceCad > 0 ? "Email.order.nextDeposit" : "Email.order.next")),
        ),
      ].join(""),
      footer: note(escapeHtml(t("Email.signature"))),
    }),
    text: [
      t("Email.order.title"),
      "",
      greeting,
      t("Email.order.intro"),
      "",
      ...rows.map(([label, value]) => `${label} : ${value}`),
      "",
      t(order.balanceCad > 0 ? "Email.order.nextDeposit" : "Email.order.next"),
      "",
      t("Email.signature"),
    ].join("\n"),
    tag: order.reference,
  };
}
