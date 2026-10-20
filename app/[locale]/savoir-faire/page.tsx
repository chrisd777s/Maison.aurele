import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { CraftArt } from "@/components/craft/CraftArt";
import { CraftSequence } from "@/components/craft/CraftSequence";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { craftSteps } from "@/data/house";
import { artisans } from "@/data/provenance";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Craft");
  const locale = (await rootLocale()) as Locale;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/savoir-faire", locale),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function CraftPage() {
  const t = await getTranslations("Craft");
  const locale = (await rootLocale()) as Locale;
  const ids = craftSteps.map((s) => s.id);

  return (
    <>
      <header className="grille gap-y-8 pt-16 lg:pt-24">
        <Eyebrow className="col-span-12">{t("eyebrow")}</Eyebrow>
        <h1 className="col-span-12 text-titre-1 lg:col-span-9">{t("title")}</h1>
        <p className="col-span-12 text-chapeau font-light text-encre-douce sm:col-span-10 lg:col-span-5 lg:col-start-7">
          {t("lede")}
        </p>
      </header>

      <section
        id="sequence"
        aria-labelledby="sequence-titre"
        data-actif={ids[0]}
        className="sequence pt-section"
      >
        <h2 id="sequence-titre" className="sr-only">
          {t("sequenceTitle")}
        </h2>
        <div className="grille">
          {/* Scène collante (grand écran) : les six calques superposés */}
          <div className="sequence-scene col-span-6">
            <div
              data-scene=""
              className="sticky top-[calc(var(--entete)+1rem)] flex h-[calc(100dvh-var(--entete)-2rem)] items-center gap-8"
            >
              <div aria-hidden="true" className="relative h-2/3 w-px bg-filet">
                <span data-progression="" className="absolute inset-0 origin-top bg-accent-encre" />
              </div>
              <div className="relative h-full flex-1">
                <CraftArt id="scene" steps={ids} className="h-full w-full" />
                <ol aria-hidden="true" className="absolute bottom-6 left-0">
                  {craftSteps.map((step, i) => (
                    <li
                      key={step.id}
                      data-legende={step.id}
                      className="surtitre absolute bottom-0 left-0 whitespace-nowrap text-encre-douce"
                    >
                      <span className="chiffres mr-3 text-chapeau normal-case">{pad(i + 1)}</span>
                      {step.name[locale]}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <ol className="col-span-12 lg:col-span-5 lg:col-start-8">
            {craftSteps.map((step, i) => (
              <li
                key={step.id}
                data-step={step.id}
                className="sequence-etape grid gap-8 border-t border-filet py-16 first:border-t-0 sm:grid-cols-2 sm:items-center lg:flex lg:min-h-[88vh] lg:flex-col lg:items-start lg:justify-center lg:border-t-0 lg:py-0"
              >
                <CraftArt
                  id={`etape-${step.id}`}
                  steps={[step.id]}
                  className="etape-art mx-auto aspect-[32/46] w-full max-w-[17rem] sm:order-2"
                />
                <div data-reveal>
                  <p className="surtitre text-encre-douce">
                    {t("stepOf", { n: i + 1, total: craftSteps.length })}
                  </p>
                  <h3 className="mt-4 flex items-baseline gap-4 text-titre-2">
                    <span className="chiffres text-titre-3 text-accent-encre">{pad(i + 1)}</span>
                    {step.name[locale]}
                  </h3>
                  <p className="mt-6 max-w-[46ch]">{step.text[locale]}</p>
                  <dl className="mt-8 grid max-w-[46ch] grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-petit">
                    <dt className="text-encre-douce">{t("duration")}</dt>
                    <dd>{step.duration[locale]}</dd>
                    <dt className="text-encre-douce">{t("tools")}</dt>
                    <dd>{step.detail[locale]}</dd>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <CraftSequence targetId="sequence" />
      </section>

      <section aria-labelledby="mains" className="grille gap-y-10 pt-section">
        <Eyebrow className="col-span-12 lg:col-span-3">{t("handsEyebrow")}</Eyebrow>
        <div className="col-span-12 lg:col-span-8">
          <h2 id="mains" data-reveal className="text-titre-2">
            {t("handsTitle")}
          </h2>
          <p data-reveal className="mt-8 max-w-[56ch] text-encre-douce">
            {t("handsText")}
          </p>
          <ul className="mt-12 grid gap-x-gouttiere sm:grid-cols-2">
            {artisans.map((a) => (
              <li key={a.id} data-reveal className="border-t border-filet py-5">
                <p className="font-display text-chapeau">{a.name}</p>
                <p className="text-petit text-encre-douce">
                  {a.role[locale]} · {t("since", { year: a.since })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="suite" className="grille gap-y-8 pt-section">
        <div
          data-reveal
          className="col-span-12 border-t border-filet pt-12 lg:col-span-8 lg:col-start-4"
        >
          <h2 id="suite" className="text-titre-2">
            {t("closingTitle")}
          </h2>
          <p className="mt-6 max-w-[52ch] text-encre-douce">{t("closingText")}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/atelier">{t("closingAtelier")}</ButtonLink>
            <ButtonLink href="/rendez-vous" variant="trait">
              {t("closingVisit")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
