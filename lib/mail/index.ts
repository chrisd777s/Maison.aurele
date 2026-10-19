import { maison } from "@/data/maison";
import { outboxMailer } from "./outbox";
import { resendMailer } from "./resend";
import type { Mailer } from "./types";

export type { Mail, Mailer } from "./types";

/** Expéditeur actif : Resend si une clé est fournie, sinon la boîte d'envoi locale. */
export function mailer(): Mailer {
  const key = process.env.RESEND_API_KEY;
  return key
    ? resendMailer(key, process.env.MAIL_FROM ?? `Maison Aurèle <${maison.email}>`)
    : outboxMailer();
}
