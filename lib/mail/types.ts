export type Mail = {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  /** Identifiant lisible (référence de rendez-vous, de commande), repris dans le nom du fichier. */
  tag: string;
};

export interface Mailer {
  readonly name: "outbox" | "resend";
  send(mail: Mail): Promise<void>;
}
