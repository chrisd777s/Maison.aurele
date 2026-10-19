import { describe, expect, it } from "vitest";
import { formatSlot } from "@/lib/appointment/format";
import { appointmentIcs, zonedToUtc } from "@/lib/appointment/ics";
import { appointmentSchema } from "@/lib/appointment/schema";
import { availableDays, isSlotAvailable, todayIn } from "@/lib/appointment/slots";
import { appointmentConfirmation, appointmentNotice } from "@/lib/mail/templates/appointment";
import { escapeHtml } from "@/lib/mail/templates/layout";

// Lundi 19 octobre 2026, 22 h à Montréal (déjà mardi à Paris).
const now = new Date("2026-10-20T02:00:00Z");

describe("créneaux du salon", () => {
  it("du mardi au samedi, à partir du lendemain, dans le fuseau du lieu", () => {
    expect(todayIn("montreal", now)).toBe("2026-10-19");
    expect(todayIn("paris", now)).toBe("2026-10-20");
    const days = availableDays("montreal", now);
    expect(days[0]!.date).toBe("2026-10-20");
    for (const d of days)
      expect([2, 3, 4, 5, 6]).toContain(new Date(`${d.date}T12:00Z`).getUTCDay());
    expect(availableDays("paris", now)[0]!.date).toBe("2026-10-21");
  });

  it("disponibilités déterministes, une partie des créneaux déjà prise", () => {
    const slots = availableDays("paris", now).flatMap((d) => d.slots);
    const taken = slots.filter((s) => !s.available).length;
    expect(taken).toBeGreaterThan(0);
    expect(taken).toBeLessThan(slots.length / 2);
    expect(availableDays("paris", now)).toEqual(availableDays("paris", now));
  });

  it("refuse un créneau passé, un dimanche ou un créneau complet", () => {
    const day = availableDays("montreal", now)[0]!;
    const free = day.slots.find((s) => s.available)!;
    expect(isSlotAvailable("montreal", day.date, free.time, now)).toBe(true);
    expect(isSlotAvailable("montreal", "2026-10-19", "10:00", now)).toBe(false);
    expect(isSlotAvailable("montreal", "2026-10-25", "10:00", now)).toBe(false);
    const full = availableDays("montreal", now)
      .flatMap((d) => d.slots.map((s) => ({ ...s, date: d.date })))
      .find((s) => !s.available)!;
    expect(isSlotAvailable("montreal", full.date, full.time, now)).toBe(false);
  });
});

describe("demande de rendez-vous", () => {
  const valid = {
    place: "paris",
    date: "2026-10-21",
    time: "14:00",
    occasion: "fiancailles",
    firstName: "Camille",
    lastName: "Roy",
    email: "camille@example.com",
    phone: "",
    consent: true,
  };

  it("accepte une demande complète", () => {
    expect(appointmentSchema.safeParse(valid).success).toBe(true);
  });

  it("messages d'erreur = clés de traduction", () => {
    const result = appointmentSchema.safeParse({
      ...valid,
      email: "x",
      consent: false,
      phone: "abc",
    });
    expect(result.success).toBe(false);
    const messages = Object.fromEntries(result.error!.issues.map((i) => [i.path[0], i.message]));
    expect(messages).toEqual({ email: "email", consent: "consent", phone: "phone" });
  });
});

describe("agenda", () => {
  it("heure murale → UTC, heure d'été comprise", () => {
    expect(zonedToUtc("2026-10-21", "14:00", "Europe/Paris").toISOString()).toBe(
      "2026-10-21T12:00:00.000Z",
    );
    expect(zonedToUtc("2026-12-01", "14:00", "America/Toronto").toISOString()).toBe(
      "2026-12-01T19:00:00.000Z",
    );
  });

  it("fichier iCalendar d'une heure", () => {
    const ics = appointmentIcs({
      reference: "RV-TEST",
      place: "paris",
      date: "2026-10-21",
      time: "14:00",
      title: "Rendez-vous",
      location: "Rue de la Paix, Paris",
      description: "Référence RV-TEST",
    });
    expect(ics).toContain("DTSTART:20261021T120000Z");
    expect(ics).toContain("DTEND:20261021T130000Z");
    expect(ics).toContain("LOCATION:Rue de la Paix\\, Paris");
  });

  it("créneau lisible dans les deux langues", () => {
    expect(formatSlot("2026-10-21", "14:00", "fr")).toBe("mercredi 21 octobre 2026 à 14 h 00");
    expect(formatSlot("2026-10-21", "14:00", "en")).toMatch(
      /^Wednesday, October 21, 2026 at 2:00\sp\.m\.$/,
    );
  });
});

describe("courriels de rendez-vous", () => {
  const data = appointmentSchema.parse({
    place: "montreal",
    date: "2026-10-21",
    time: "10:00",
    occasion: "sur-mesure",
    firstName: "<b>Alex</b>",
    lastName: "Martin",
    email: "alex@example.com",
    message: "Une émeraude, peut-être",
    creation: "v=1&forme=emeraude&carats=1.50&metal=platine&monture=halo&gravure=A+%26+M",
    consent: true,
  });

  it("confirmation : langue du visiteur, contenu échappé, création décrite", () => {
    const mail = appointmentConfirmation(data, { reference: "RV-ABC", locale: "fr" });
    expect(mail.to).toBe("alex@example.com");
    expect(mail.subject).toContain("mercredi 21 octobre 2026");
    expect(mail.html).toContain("&lt;b&gt;Alex&lt;/b&gt;");
    expect(mail.html).not.toContain("<b>Alex</b>");
    expect(mail.html).toContain("RV-ABC");
    expect(mail.text).toContain("Émeraude de 1,5 ct, halo, platine 950");
    expect(mail.text).toContain("« A &amp; M »".replace("&amp;", "&"));
    const en = appointmentConfirmation(data, { reference: "RV-ABC", locale: "en" });
    expect(en.subject).toContain("Wednesday");
  });

  it("avis au salon : coordonnées et message, réponse directe au visiteur", () => {
    const mail = appointmentNotice(data, { reference: "RV-ABC", locale: "en" });
    expect(mail.replyTo).toBe("alex@example.com");
    expect(mail.text).toContain("Une émeraude, peut-être");
    expect(mail.text).toContain("Langue : Anglais");
  });

  it("échappement HTML", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;",
    );
  });
});
