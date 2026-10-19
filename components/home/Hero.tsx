import type { CSSProperties } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { SplitLetters } from "@/components/motion/SplitLetters";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getProduct } from "@/lib/commerce";
import type { Locale } from "@/i18n/routing";
import { HeroJewel } from "./HeroJewel";

export async function Hero() {
  const t = await getTranslations("Home");
  const ring = await getProduct("aube-premiere", (await getLocale()) as Locale);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Halo de lumière : future scène 3D */}
      <div aria-hidden="true" className="halo absolute inset-0 -z-10" />
      <div className="grille min-h-[calc(100svh-var(--entete))] grid-rows-[auto_auto_auto_auto] content-between gap-y-8 pt-8 pb-12 lg:grid-rows-[auto_1fr_auto] lg:content-stretch lg:gap-y-6 lg:gap-y-10 lg:pt-14 lg:pb-16">
        <Eyebrow className="col-span-12 row-start-1 lg:col-span-6">{t("heroEyebrow")}</Eyebrow>

        <div className="col-span-12 row-start-2 flex items-center justify-center lg:col-span-6 lg:col-start-7 lg:row-start-2">
          {ring && <HeroJewel product={ring} />}
        </div>

        <div className="col-span-12 row-start-3 self-end">
          <h1 className="text-titre-1 tracking-[-0.01em]">
            <SplitLetters text={t("heroTitle")} />
          </h1>
        </div>
        <div
          className="col-span-12 row-start-4 self-end sm:col-span-8 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-center"
          data-reveal
          style={{ "--reveal-delay": 900 } as CSSProperties}
        >
          <p className="max-w-[40ch] text-encre-douce">{t("heroLede")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink
              href={{ pathname: "/collections/[collection]", params: { collection: "aube" } }}
            >
              {t("heroCta")}
            </ButtonLink>
            <ButtonLink href="/rendez-vous" variant="texte">
              {t("heroCtaSecondary")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
