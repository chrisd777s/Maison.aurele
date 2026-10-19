/** Référence lisible (« RV-K3F9Q2A1 », « MA-… ») : horodatage puis trois caractères aléatoires. */
export function makeReference(prefix: "RV" | "MA", now = new Date()) {
  const stamp = now.getTime().toString(36).toUpperCase().slice(-5);
  const random = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `${prefix}-${stamp}${random}`;
}
