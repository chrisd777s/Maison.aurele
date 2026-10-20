import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { RingSizer } from "@/components/sizing/RingSizer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { maison } from "@/data/maison";
import type { Locale } from "@/i18n/routing";
import { formatNumber } from "@/lib/format";
import {
  US_SIZES,
  circumferenceFromDiameter,
  diameterFromUs,
  formatUs,
  frFromUs,
  ukFromUs,
} from "@/lib/sizing/ring";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SizeGuide");
  const locale = (await rootLocale()) as Locale;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/guide-des-tailles", locale),
  };
}

export default async function SizeGuidePage() {
  const t = await getTranslations("SizeGuide");
  const locale = (await rootLocale()) as Locale;
  const n = (v: number) => formatNumber(v, locale, 1);
  const tips = ["tip1", "tip2", "tip3", "tip4"] as const;

  return (
    <>
      <header className="grille gap-y-8 pt-16 lg:pt-24">
        <Eyebrow className="col-span-12">{t("eyebrow")}</Eyebrow>
        <h1 className="col-span-12 text-titre-1 lg:col-span-9">{t("title")}</h1>
        <p className="col-span-12 text-chapeau font-light text-encre-douce sm:col-span-10 lg:col-span-5 lg:col-start-7">
          {t("lede")}
        </p>
      </header>

      <section aria-labelledby="outil" className="grille gap-y-8 pt-16">
        <h2 id="outil" className="surtitre col-span-12 font-sans text-encre-douce lg:col-span-3">
          {t("toolTitle")}
        </h2>
        <div className="col-span-12 lg:col-span-9">
          <RingSizer email={maison.email} />
        </div>
      </section>

      <section aria-labelledby="conseils" className="grille gap-y-10 pt-section">
        <h2 id="conseils" className="surtitre col-span-12 font-sans text-encre-douce lg:col-span-3">
          {t("tipsTitle")}
        </h2>
        <div className="col-span-12 lg:col-span-9">
          <p data-reveal className="max-w-[56ch] font-display text-titre-3 font-light">
            {t("tipsLede")}
          </p>
          <ol className="mt-10 grid gap-x-gouttiere gap-y-8 sm:grid-cols-2">
            {tips.map((tip, i) => (
              <li key={tip} data-reveal className="border-t border-filet pt-5">
                <span className="chiffres text-chapeau text-accent-encre">0{i + 1}</span>
                <p className="mt-2 text-encre-douce">{t(tip)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="correspondances" className="grille gap-y-10 pt-section">
        <h2
          id="correspondances"
          className="surtitre col-span-12 font-sans text-encre-douce lg:col-span-3"
        >
          {t("tableTitle")}
        </h2>
        <div className="col-span-12 lg:col-span-7">
          <table className="w-full text-left text-petit">
            <caption className="mb-6 text-left text-encre-douce">{t("tableCaption")}</caption>
            <thead>
              <tr className="border-b border-encre/40">
                <th scope="col" className="surtitre py-3 pr-2 font-normal">
                  {t("systemCaUs")}
                </th>
                <th scope="col" className="surtitre py-3 pr-2 font-normal">
                  {t("systemFr")}
                </th>
                <th scope="col" className="surtitre py-3 pr-2 font-normal">
                  {t("systemUk")}
                </th>
                <th scope="col" className="surtitre py-3 pr-2 font-normal">
                  {t("diameterShort")}
                </th>
                <th scope="col" className="surtitre py-3 font-normal">
                  {t("circumferenceShort")}
                </th>
              </tr>
            </thead>
            <tbody className="chiffres text-corps">
              {US_SIZES.map((us) => {
                const d = diameterFromUs(us);
                return (
                  <tr key={us} className="border-b border-filet">
                    <th scope="row" className="py-2 pr-2 font-normal">
                      {formatUs(us)}
                    </th>
                    <td className="py-2 pr-2">{frFromUs(us)}</td>
                    <td className="py-2 pr-2">{ukFromUs(us)}</td>
                    <td className="py-2 pr-2">{n(d)}</td>
                    <td className="py-2">{n(circumferenceFromDiameter(d))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="colliers" className="grille gap-y-10 pt-section">
        <h2 id="colliers" className="surtitre col-span-12 font-sans text-encre-douce lg:col-span-3">
          {t("otherTitle")}
        </h2>
        <div className="col-span-12 grid gap-x-gouttiere gap-y-10 sm:grid-cols-2 lg:col-span-7">
          <div data-reveal>
            <h3 className="text-titre-3">{t("necklaceTitle")}</h3>
            <p className="mt-4 text-encre-douce">{t("necklaceText")}</p>
          </div>
          <div data-reveal>
            <h3 className="text-titre-3">{t("braceletTitle")}</h3>
            <p className="mt-4 text-encre-douce">{t("braceletText")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
