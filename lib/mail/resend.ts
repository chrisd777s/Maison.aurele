import type { Mailer } from "./types";

/** Envoi réel par l'API Resend (REST, sans SDK), si `RESEND_API_KEY` est défini. */
export function resendMailer(apiKey: string, from: string): Mailer {
  return {
    name: "resend",
    async send(mail) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [mail.to],
          reply_to: mail.replyTo,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          tags: [{ name: "ref", value: mail.tag.replace(/[^\w-]/g, "") }],
        }),
      });
      if (!response.ok) throw new Error(`Resend : ${response.status} ${await response.text()}`);
    },
  };
}
