import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Mailer } from "./types";

/**
 * Courriels écrits dans `.outbox/` au lieu d'être envoyés : le site fonctionne sans
 * compte d'envoi, et chaque message reste consultable dans un navigateur.
 */
export function outboxMailer(dir = process.env.MAIL_OUTBOX_DIR ?? ".outbox"): Mailer {
  return {
    name: "outbox",
    async send(mail) {
      await mkdir(dir, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const base = path.join(dir, `${stamp}-${mail.tag.replace(/[^\w-]/g, "")}`);
      const meta = { to: mail.to, replyTo: mail.replyTo, subject: mail.subject, text: mail.text };
      // Écriture atomique : fichier temporaire puis renommage.
      for (const [file, content] of [
        [`${base}.html`, mail.html],
        [`${base}.json`, JSON.stringify(meta, null, 2)],
      ] as const) {
        await writeFile(`${file}.tmp`, content, "utf8");
        await rename(`${file}.tmp`, file);
      }
    },
  };
}
