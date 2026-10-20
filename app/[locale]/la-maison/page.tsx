import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { locale as rootLocale } from "next/root-params";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { founder, keyFigures, milestones, values } from "@/data/house";
import type { Locale } from "@/i18n/routing";
import { jewelryStoreJsonLd } from "@/lib/seo/jsonld";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("House");
  const locale = (await rootLocale()) as Locale;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/la-maison", locale),
  };
}

export default async function HousePage() {
  const t = await getTranslations("House");
  const locale = (await rootLocale()) as Locale;

  return (
    <>
      <JsonLd data={jewelryStoreJsonLd(locale)} />
      <header className="grille gap-y-8 pt-16 lg:pt-24">
        <Eyebrow className="col-span-12">{t("eyebrow")}</Eyebrow>
        <h1 className="col-span-12 text-titre-1 lg:col-span-10">{t("title")}</h1>
        <p className="col-span-12 text-chapeau font-light text-encre-douce sm:col-span-10 lg:col-span-5 lg:col-start-7">
          {t("lede")}
        </p>
        {/* Visuel provisoire : la lumière du nord dans les fenêtres de l'atelier */}
        <div
          aria-hidden="true"
          className="fenetre-nord col-span-12 mt-8 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
        />
      </header>

      <section aria-labelledby="fondatrice" className="grille items-start gap-y-12 pt-section">
        <div
          aria-hidden="true"
          data-reveal
          className="portrait-arche col-span-10 col-start-2 aspect-[3/4] sm:col-span-6 sm:col-start-4 lg:col-span-4 lg:col-start-2"
        >
          <span className="font-display text-titre-1 italic">H. A.</span>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:col-start-7">
          <Eyebrow>{t("founderEyebrow")}</Eyebrow>
          <h2 id="fondatrice" className="mt-8 text-titre-2">
            {founder.name}
          </h2>
          <div className="mt-8 space-y-6 text-encre-douce" data-reveal>
            {founder.bio[locale].map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <figure className="mt-12 border-l border-accent pl-6" data-reveal>
            <blockquote className="font-display text-titre-3 font-light italic">
              {founder.quote[locale]}
            </blockquote>
          </figure>
        </div>
      </section>

      <section aria-labelledby="reperes" className="grille gap-y-10 pt-section">
        <Eyebrow className="col-span-12 lg:col-span-3">{t("timelineEyebrow")}</Eyebrow>
        <h2 id="reperes" className="col-span-12 text-titre-2 lg:col-span-8">
          {t("timelineTitle")}
        </h2>
        <ol className="col-span-12 lg:col-span-9 lg:col-start-4">
          {milestones.map((m) => (
            <li
              key={m.year}
              data-reveal
              className="grid gap-x-gouttiere gap-y-2 border-t border-filet py-8 sm:grid-cols-[8rem_1fr] lg:grid-cols-[10rem_16rem_1fr]"
            >
              <span className="chiffres text-titre-3 text-accent-encre">{m.year}</span>
              <h3 className="font-display text-chapeau">{m.title[locale]}</h3>
              <p className="text-encre-douce sm:col-start-2 lg:col-start-auto">{m.text[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="valeurs" className="grille gap-y-10 pt-section">
        <Eyebrow className="col-span-12 lg:col-span-3">{t("valuesEyebrow")}</Eyebrow>
        <h2 id="valeurs" className="col-span-12 text-titre-2 lg:col-span-8">
          {t("valuesTitle")}
        </h2>
        <ul className="col-span-12 grid gap-x-gouttiere gap-y-12 sm:grid-cols-2 lg:col-span-9 lg:col-start-4">
          {values.map((v, i) => (
            <li key={v.title.fr} data-reveal style={{ "--reveal-delay": i * 120 } as CSSProperties}>
              <span className="chiffres text-chapeau text-encre-douce">0{i + 1}</span>
              <h3 className="mt-3 text-titre-3">{v.title[locale]}</h3>
              <p className="mt-4 text-encre-douce">{v.text[locale]}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="chiffres" className="scene-nuit mt-section py-section">
        <div className="grille gap-y-12">
          <h2 id="chiffres" className="surtitre col-span-12 font-sans text-encre-douce">
            {t("figuresTitle")}
          </h2>
          <dl className="col-span-12 grid grid-cols-2 gap-x-gouttiere gap-y-12 lg:grid-cols-4">
            {keyFigures.map((f) => (
              <div
                key={f.value}
                data-reveal
                className="flex flex-col-reverse border-t border-filet pt-6"
              >
                <dt className="mt-3 text-petit text-encre-douce">{f.label[locale]}</dt>
                <dd className="chiffres text-titre-1 font-light">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="visite" className="grille gap-y-8 pt-section">
        <div data-reveal className="col-span-12 lg:col-span-7 lg:col-start-4">
          <h2 id="visite" className="text-titre-2">
            {t("closingTitle")}
          </h2>
          <p className="mt-6 max-w-[52ch] text-encre-douce">{t("closingText")}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/rendez-vous">{t("closingVisit")}</ButtonLink>
            <ButtonLink href="/savoir-faire" variant="trait">
              {t("closingCraft")}
            </ButtonLink>
            <ButtonLink href="/provenance" variant="texte" className="px-2">
              {t("closingProvenance")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
