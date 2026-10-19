import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { ClearCart } from "@/components/shop/ClearCart";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/format";
import { retrieveCheckoutSession, stripeKey } from "@/lib/stripe";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Order");
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

type Search = { session_id?: string; ref?: string; demo?: string };

async function OrderDetails({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const locale = (await rootLocale()) as Locale;
  const t = await getTranslations("Order");

  let reference = /^MA-[A-Z0-9]{5,12}$/.test(params.ref ?? "") ? params.ref : undefined;
  let email: string | null = null;
  let paid: number | null = null;
  let balance = 0;

  if (params.session_id && stripeKey()) {
    try {
      const session = await retrieveCheckoutSession(params.session_id);
      if (session.payment_status !== "unpaid") {
        reference = session.metadata.reference;
        email = session.customer_details?.email ?? null;
        paid = (session.amount_total ?? 0) / 100;
        balance = Number(session.metadata.balance_cad ?? 0);
      }
    } catch {
      // Session illisible : message générique, sans détail.
    }
  }

  if (!reference)
    return (
      <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4">
        <h1 className="text-titre-1">{t("unknownTitle")}</h1>
        <p className="mt-6 text-chapeau text-encre-douce">{t("unknownText")}</p>
      </div>
    );

  return (
    <div
      className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4"
      data-testid="commande-confirmee"
    >
      <ClearCart />
      <p className="surtitre text-accent-encre">{t("eyebrow")}</p>
      <h1 className="mt-4 text-titre-1">{t("title")}</h1>
      <p className="mt-6 text-chapeau">{email ? t("textEmail", { email }) : t("text")}</p>
      <dl className="mt-10 divide-y divide-filet border-y border-filet">
        <div className="flex justify-between gap-6 py-4">
          <dt className="surtitre text-encre-douce">{t("reference")}</dt>
          <dd className="chiffres font-display text-chapeau">{reference}</dd>
        </div>
        {paid !== null && (
          <div className="flex justify-between gap-6 py-4">
            <dt className="surtitre text-encre-douce">{t("paid")}</dt>
            <dd className="chiffres font-display text-chapeau">{formatPrice(paid, locale)}</dd>
          </div>
        )}
        {balance > 0 && (
          <div className="flex justify-between gap-6 py-4">
            <dt className="surtitre text-encre-douce">{t("balance")}</dt>
            <dd className="chiffres font-display text-chapeau">{formatPrice(balance, locale)}</dd>
          </div>
        )}
      </dl>
      {params.demo === "1" && (
        <p className="mt-6 border-l border-accent pl-4 text-petit text-encre-douce">{t("demo")}</p>
      )}
      <h2 className="surtitre mt-12 text-encre-douce">{t("nextTitle")}</h2>
      <ol className="mt-4 space-y-3 text-petit">
        {(["next1", "next2", "next3"] as const).map((key, i) => (
          <li key={key} className="flex gap-4">
            <span className="chiffres text-accent-encre">0{i + 1}</span>
            {t(key)}
          </li>
        ))}
      </ol>
      <div className="mt-12 flex flex-wrap gap-6">
        <ButtonLink href="/">{t("home")}</ButtonLink>
        <ButtonLink href="/rendez-vous" variant="trait">
          {t("appointment")}
        </ButtonLink>
      </div>
    </div>
  );
}

export default function ThankYouPage({ searchParams }: PageProps<"/[locale]/commande/merci">) {
  return (
    <section className="grille pt-14 pb-14 lg:pt-24">
      <Suspense fallback={<div className="col-span-12 min-h-[50vh]" aria-busy="true" />}>
        <OrderDetails searchParams={searchParams as Promise<Search>} />
      </Suspense>
    </section>
  );
}
