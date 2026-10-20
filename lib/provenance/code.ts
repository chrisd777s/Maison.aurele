/** Code saisi ou lu dans un QR : sans espaces, en majuscules (« au101 0187 » → « AU101-0187 »). */
export function normalizeCode(raw: string) {
  const compact = raw.trim().toUpperCase().replace(/\s+/g, "-").replace(/-+/g, "-");
  return /^[A-Z]{2}\d{3}\d{4}$/.test(compact)
    ? `${compact.slice(0, 5)}-${compact.slice(5)}`
    : compact;
}
