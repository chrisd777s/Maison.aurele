import { PLACE_TIMEZONE, type Place } from "./slots";

/** Heure murale d'un fuseau → instant UTC (deux passes : juste aux changements d'heure). */
export function zonedToUtc(date: string, time: string, timeZone: string) {
  const wall = Date.parse(`${date}T${time}:00Z`);
  const offset = (instant: number) => {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
        .formatToParts(instant)
        .map((p) => [p.type, p.value]),
    );
    const asUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    return asUtc - instant;
  };
  let guess = wall - offset(wall);
  guess = wall - offset(guess);
  return new Date(guess);
}

const stamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const escape = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

/** Fichier iCalendar d'un rendez-vous (une heure), en UTC pour éviter tout bloc VTIMEZONE. */
export function appointmentIcs({
  reference,
  place,
  date,
  time,
  title,
  location,
  description,
}: {
  reference: string;
  place: Place;
  date: string;
  time: string;
  title: string;
  location: string;
  description: string;
}) {
  const start = zonedToUtc(date, time, PLACE_TIMEZONE[place]);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Maison Aurele//Rendez-vous//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${reference}@maison-aurele`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(title)}`,
    `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
