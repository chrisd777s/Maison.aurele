/**
 * Créneaux du salon privé. Sans agenda réel branché, les disponibilités sont
 * calculées : du mardi au samedi, cinq créneaux par jour, sur trois semaines.
 * Quelques créneaux sont marqués « complets » de façon déterministe, pour que le
 * serveur et le navigateur s'accordent sans échange.
 */

export const PLACES = ["montreal", "paris", "visio"] as const;
export type Place = (typeof PLACES)[number];

export const TIMES = ["10:00", "11:30", "14:00", "15:30", "17:00"] as const;
export type SlotTime = (typeof TIMES)[number];

export const WINDOW_DAYS = 21;
/** Jours ouvrés : 2 (mardi) à 6 (samedi). */
const OPEN_DAYS = new Set([2, 3, 4, 5, 6]);

export const PLACE_TIMEZONE: Record<Place, string> = {
  montreal: "America/Toronto",
  paris: "Europe/Paris",
  visio: "America/Toronto",
};

export type Day = { date: string; slots: { time: SlotTime; available: boolean }[] };

/** Date du jour (AAAA-MM-JJ) dans le fuseau du lieu. */
export function todayIn(place: Place, now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PLACE_TIMEZONE[place],
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addDays(date: string, days: number) {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

const weekday = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay();

/** Petit hachage stable (FNV-1a) : environ un créneau sur quatre est déjà pris. */
function taken(place: Place, date: string, time: string) {
  let h = 0x811c9dc5;
  for (const c of `${place}${date}${time}`) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193);
  return (h >>> 0) % 4 === 0;
}

/** Jours proposés, à partir du lendemain (un rendez-vous se prépare). */
export function availableDays(place: Place, now = new Date()): Day[] {
  const today = todayIn(place, now);
  const days: Day[] = [];
  for (let i = 1; i <= WINDOW_DAYS; i++) {
    const date = addDays(today, i);
    if (!OPEN_DAYS.has(weekday(date))) continue;
    days.push({
      date,
      slots: TIMES.map((time) => ({ time, available: !taken(place, date, time) })),
    });
  }
  return days;
}

export function isSlotAvailable(place: Place, date: string, time: string, now = new Date()) {
  return availableDays(place, now).some(
    (day) => day.date === date && day.slots.some((s) => s.time === time && s.available),
  );
}
