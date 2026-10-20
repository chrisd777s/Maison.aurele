import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Prose } from "@/components/editorial/Prose";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { legalPages, type LegalSlug } from "@/data/legal";
import { Link } from "@/i18n/navigation";
import type { AppPathname, Locale } from "@/i18n/routing";
import { formatEditorialDate } from "@/lib/editorial/date";
import { anchorId } from "@/lib/editorial/types";
import { alternatesFor } from "@/lib/seo/metadata";

/** Les pages légales et leur URL interne, dans l'ordre du pied de page. */
export const LEGAL_ROUTES = {
  mentions: "/mentions-legales",
  confidentialite: "/confidentialite",
  conditions: "/conditions-de-vente",
  retours: "/retours",
  garantie: "/garantie",
} as const satisfies Record<LegalSlug, AppPathname>;

export async function legalMetadata(slug: LegalSlug): Promise<Metadata> {
  const locale = (await rootLocale()) as Locale;
  const page = legalPages[slug];
  return {
    title: page.title[locale],
    description: page.intro[locale],
    alternates: alternatesFor(LEGAL_ROUTES[slug], locale),
  };
}

/** Gabarit commun : titre, date de mise à jour, sommaire collant, texte. */
export async function LegalDocument({ slug }: { slug: LegalSlug }) {
  const t = await getTranslations("Legal");
  const locale = (await rootLocale()) as Locale;
  const page = legalPages[slug];
  const blocks = page.body[locale];
  const headings = blocks.flatMap((b) => (b.kind === "h2" ? [b.text] : []));

  return (
    <>
      <header className="grille gap-y-8 pt-16 lg:pt-24">
        <Eyebrow className="col-span-12">{t("eyebrow")}</Eyebrow>
        <h1 className="col-span-12 text-titre-1 lg:col-span-9">{page.title[locale]}</h1>
        <div className="col-span-12 sm:col-span-10 lg:col-span-6 lg:col-start-4">
          <p className="text-chapeau font-light text-encre-douce">{page.intro[locale]}</p>
          <p className="surtitre mt-6 text-encre-douce">
            {t("updated", { date: formatEditorialDate(page.updated, locale) })}
          </p>
        </div>
      </header>

      <div className="grille gap-y-12 pt-16 lg:pt-24">
        <nav aria-labelledby="sommaire" className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--entete)+2rem)]">
            <h2 id="sommaire" className="surtitre font-sans text-encre-douce">
              {t("contents")}
            </h2>
            <ol className="mt-4 space-y-2 border-l border-filet pl-4 text-petit">
              {headings.map((h) => (
                <li key={h}>
                  <a href={`#${anchorId(h)}`} className="lien-fin">
                    {h}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <Prose blocks={blocks} className="col-span-12 lg:col-span-7 lg:col-start-5" />
      </div>

      <nav aria-labelledby="autres-pages" className="grille gap-y-6 pt-section">
        <h2 id="autres-pages" className="surtitre col-span-12 font-sans text-encre-douce">
          {t("others")}
        </h2>
        <ul className="col-span-12 flex flex-wrap gap-x-8 gap-y-3">
          {(Object.keys(LEGAL_ROUTES) as LegalSlug[])
            .filter((s) => s !== slug)
            .map((s) => (
              <li key={s}>
                <Link href={LEGAL_ROUTES[s]} className="lien-fin font-display text-chapeau">
                  {legalPages[s].title[locale]}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
}
