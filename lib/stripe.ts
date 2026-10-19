import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stripe Checkout par l'API REST (deux appels, une vérification de signature :
 * le SDK n'apporterait qu'un poids supplémentaire). Actif si `STRIPE_SECRET_KEY` est défini ;
 * sinon la commande passe en mode démonstration.
 */
const API = "https://api.stripe.com/v1";

export const stripeKey = () => process.env.STRIPE_SECRET_KEY || null;

type Params = {
  [key: string]: string | number | boolean | undefined | Params | Params[] | string[];
};

/** Objet imbriqué → corps `application/x-www-form-urlencoded` à la manière de Stripe (a[b][0][c]=…). */
export function toForm(params: Params, prefix = "", out = new URLSearchParams()) {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    const name = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item, i) =>
        typeof item === "object"
          ? toForm(item, `${name}[${i}]`, out)
          : out.append(`${name}[${i}]`, item),
      );
    } else if (typeof value === "object") {
      toForm(value, name, out);
    } else {
      out.append(name, String(value));
    }
  }
  return out;
}

async function call<T>(path: string, init: { method: "GET" | "POST"; body?: Params }) {
  const key = stripeKey();
  if (!key) throw new Error("Stripe non configuré");
  const response = await fetch(`${API}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2025-09-30.clover",
    },
    body: init.body ? toForm(init.body) : undefined,
    cache: "no-store",
  });
  const json = (await response.json()) as T & { error?: { message: string } };
  if (!response.ok) throw new Error(`Stripe : ${json.error?.message ?? response.status}`);
  return json;
}

export type CheckoutSession = {
  id: string;
  url: string | null;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  customer_details: { email: string | null; name: string | null } | null;
  metadata: Record<string, string>;
};

export const createCheckoutSession = (body: Params) =>
  call<CheckoutSession>("/checkout/sessions", { method: "POST", body });

export const retrieveCheckoutSession = (id: string) =>
  call<CheckoutSession>(`/checkout/sessions/${encodeURIComponent(id)}`, { method: "GET" });

/**
 * Vérifie l'en-tête `Stripe-Signature` d'un webhook (HMAC-SHA256 de « horodatage.corps »),
 * avec une tolérance de cinq minutes contre le rejeu.
 */
export function verifyWebhook(
  payload: string,
  header: string | null,
  secret: string,
  now = Date.now(),
) {
  if (!header) return false;
  const parts = header.split(",").map((p) => p.split("=") as [string, string]);
  const timestamp = Number(parts.find(([k]) => k === "t")?.[1]);
  if (!Number.isFinite(timestamp) || Math.abs(now / 1000 - timestamp) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest();
  return parts
    .filter(([k]) => k === "v1")
    .some(([, v]) => {
      const given = Buffer.from(v ?? "", "hex");
      return given.length === expected.length && timingSafeEqual(given, expected);
    });
}
