import { z } from "zod";
import { PLACES, TIMES } from "./slots";

/**
 * Demande de rendez-vous, validée à l'identique dans le formulaire et la route.
 * Les messages d'erreur sont des clés de traduction (`Appointment.errors.*`).
 */
export const OCCASIONS = [
  "fiancailles",
  "mariage",
  "cadeau",
  "pour-soi",
  "sur-mesure",
  "entretien",
] as const;
export type Occasion = (typeof OCCASIONS)[number];

const text = (max: number) => z.string().trim().max(max, { error: "tooLong" });

export const appointmentSchema = z.object({
  place: z.enum(PLACES, { error: "required" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "chooseSlot" }),
  time: z.enum(TIMES, { error: "chooseSlot" }),
  occasion: z.enum(OCCASIONS, { error: "required" }),
  piece: text(80).optional(),
  creation: text(300).optional(),
  firstName: text(80).min(1, { error: "required" }),
  lastName: text(80).min(1, { error: "required" }),
  email: z.email({ error: "email" }).max(160, { error: "tooLong" }),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[\d\s().-]{7,20}$/, { error: "phone" })
    .optional(),
  message: text(1000).optional(),
  consent: z.literal(true, { error: "consent" }),
  /** Champ piège invisible : un robot le remplit, une personne non. */
  website: z.string().max(0).optional(),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type Appointment = z.output<typeof appointmentSchema>;
