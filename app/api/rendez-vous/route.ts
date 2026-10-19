import { getProduct } from "@/lib/commerce";
import { isSlotAvailable } from "@/lib/appointment/slots";
import { appointmentSchema } from "@/lib/appointment/schema";
import { mailer } from "@/lib/mail";
import { appointmentConfirmation, appointmentNotice } from "@/lib/mail/templates/appointment";
import { makeReference } from "@/lib/reference";

/** Demande de rendez-vous : validation, contrôle du créneau, courriels (visiteur et salon). */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const locale = body?.locale === "en" ? "en" : "fr";
  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    const fields = Object.fromEntries(
      parsed.error.issues.map((i) => [i.path.join("."), i.message]),
    );
    // Champ piège rempli : réponse identique à un succès, rien n'est envoyé.
    if (fields.website) return Response.json({ reference: makeReference("RV") });
    return Response.json({ error: "invalid", fields }, { status: 400 });
  }
  const data = parsed.data;

  if (!isSlotAvailable(data.place, data.date, data.time))
    return Response.json({ error: "slotTaken" }, { status: 409 });

  const piece = data.piece ? await getProduct(data.piece, locale) : null;
  const reference = makeReference("RV");
  const context = { reference, locale, pieceName: piece?.name } as const;

  try {
    const send = mailer();
    await send.send(appointmentConfirmation(data, context));
    await send.send(appointmentNotice(data, context));
  } catch (error) {
    console.error("Rendez-vous : envoi des courriels impossible", error);
    return Response.json({ error: "mail" }, { status: 502 });
  }
  return Response.json({ reference });
}
