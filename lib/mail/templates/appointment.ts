import { createTranslator } from "next-intl";
import { maison } from "@/data/maison";
import type { Locale } from "@/i18n/routing";
import { formatSlot } from "@/lib/appointment/format";
import type { Appointment } from "@/lib/appointment/schema";
import { decodeConfig } from "@/lib/atelier/config";
import { formatNumber } from "@/lib/format";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import type { Mail } from "../types";
import { detailRows, emailLayout, escapeHtml, note, paragraph } from "./layout";

const translator = (locale: Locale) =>
  createTranslator({ locale, messages: locale === "fr" ? fr : en });

/** Bague composée dans L'Atelier, décrite en une ligne à partir de ses paramètres d'URL. */
function creationLine(query: string, locale: Locale) {
  const t = translator(locale);
  const config = decodeConfig(new URLSearchParams(query));
  const line = t("Atelier.summaryLine", {
    shape: t(`Materials.shapes.${config.shape}`),
    carats: formatNumber(config.carats, locale),
    setting: t(`Atelier.settings.${config.setting}`).toLocaleLowerCase(locale),
    metal: t(`Materials.metals.${config.metal}`).toLocaleLowerCase(locale),
  });
  return config.engraving ? `${line} — « ${config.engraving} »` : line;
}

function placeLines(place: Appointment["place"], locale: Locale) {
  const t = translator(locale);
  if (place === "visio") return t("Email.appointment.visioDetail");
  const p = maison.places[place];
  return `${p.street}, ${p.district}, ${p.city}`;
}

type Context = { reference: string; locale: Locale; pieceName?: string };

/** Confirmation envoyée au visiteur, dans sa langue. */
export function appointmentConfirmation(
  data: Appointment,
  { reference, locale, pieceName }: Context,
): Mail {
  const t = translator(locale);
  const when = formatSlot(data.date, data.time, locale);
  const place = t(`Appointment.places.${data.place}.name`);
  const rows: [string, string][] = [
    [t("Email.appointment.reference"), reference],
    [t("Email.appointment.when"), when],
    [t("Email.appointment.place"), `${place} — ${placeLines(data.place, locale)}`],
    [t("Email.appointment.occasion"), t(`Appointment.occasions.${data.occasion}`)],
  ];
  if (pieceName) rows.push([t("Email.appointment.piece"), pieceName]);
  if (data.creation)
    rows.push([t("Email.appointment.creation"), creationLine(data.creation, locale)]);

  const html = emailLayout({
    lang: locale,
    preheader: t("Email.appointment.preheader", { when }),
    eyebrow: t("Email.appointment.eyebrow"),
    title: t("Email.appointment.title"),
    body: [
      paragraph(escapeHtml(t("Email.appointment.greeting", { name: data.firstName }))),
      paragraph(escapeHtml(t("Email.appointment.intro"))),
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 28px;">${detailRows(rows)}</table>`,
      paragraph(escapeHtml(t("Email.appointment.prepare"))),
      paragraph(escapeHtml(t("Email.appointment.change"))),
    ].join(""),
    footer: [
      note(escapeHtml(t("Email.signature"))),
      note(escapeHtml(t("Email.appointment.privacy"))),
    ].join(""),
  });

  const text = [
    t("Email.appointment.title"),
    "",
    t("Email.appointment.greeting", { name: data.firstName }),
    t("Email.appointment.intro"),
    "",
    ...rows.map(([label, value]) => `${label} : ${value}`),
    "",
    t("Email.appointment.prepare"),
    t("Email.appointment.change"),
    "",
    t("Email.signature"),
  ].join("\n");

  return {
    to: data.email,
    replyTo: maison.email,
    subject: t("Email.appointment.subject", { when }),
    html,
    text,
    tag: reference,
  };
}

/** Avis interne au salon (en français), avec les coordonnées et le message. */
export function appointmentNotice(
  data: Appointment,
  { reference, locale, pieceName }: Context,
): Mail {
  const t = translator("fr");
  const rows: [string, string][] = [
    ["Référence", reference],
    ["Créneau", formatSlot(data.date, data.time, "fr")],
    ["Lieu", t(`Appointment.places.${data.place}.name`)],
    ["Intention", t(`Appointment.occasions.${data.occasion}`)],
    ["Nom", `${data.firstName} ${data.lastName}`],
    ["Courriel", data.email],
    ["Téléphone", data.phone || "—"],
    ["Langue", locale === "fr" ? "Français" : "Anglais"],
  ];
  if (pieceName) rows.push(["Pièce", pieceName]);
  if (data.creation) rows.push(["Création Atelier", creationLine(data.creation, "fr")]);
  if (data.message) rows.push(["Message", data.message]);

  return {
    to: maison.email,
    replyTo: data.email,
    subject: `Rendez-vous ${reference} — ${t(`Appointment.places.${data.place}.name`)}`,
    html: emailLayout({
      lang: "fr",
      preheader: `${data.firstName} ${data.lastName}, ${formatSlot(data.date, data.time, "fr")}`,
      eyebrow: "Salon privé",
      title: "Nouveau rendez-vous",
      body: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailRows(rows)}</table>`,
      footer: note("Répondre à ce message écrit directement au visiteur."),
    }),
    text: rows.map(([label, value]) => `${label} : ${value}`).join("\n"),
    tag: `${reference}-salon`,
  };
}
