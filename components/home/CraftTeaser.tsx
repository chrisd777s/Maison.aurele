import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { CraftArt } from "@/components/craft/CraftArt";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { craftSteps } from "@/data/house";
import type { Locale } from "@/i18n/routing";

/** Accueil : les six étapes en raccourci, vers la séquence du Savoir-faire. */
export async function CraftTeaser() {
  const t = await getTranslations("Home");
  const locale = (await rootLocale()) as Locale;

  return (
    <section aria-labelledby="savoir-faire" className="grille items-center gap-y-12 pt-section">
      <div className="col-span-12 lg:col-span-5 lg:col-start-2" data-reveal>
        <Eyebrow>{t("craftEyebrow")}</Eyebrow>
        <h2 id="savoir-faire" className="mt-8 text-titre-2">
          {t("craftTitle")}
        </h2>
        <p className="mt-8 max-w-[46ch] text-encre-douce">{t("craftText")}</p>
        <ol className="mt-10 grid grid-cols-2 gap-x-gouttiere gap-y-3 sm:grid-cols-3">
          {craftSteps.map((step, i) => (
            <li key={step.id} className="flex items-baseline gap-3 border-t border-filet pt-3">
              <span className="chiffres text-petit text-encre-douce">0{i + 1}</span>
              <span className="font-display text-chapeau">{step.name[locale]}</span>
            </li>
          ))}
        </ol>
        <ButtonLink href="/savoir-faire" variant="trait" className="mt-12">
          {t("craftCta")}
        </ButtonLink>
      </div>
      <div
        className="col-span-8 col-start-3 sm:col-span-6 sm:col-start-4 lg:col-span-4 lg:col-start-8"
        data-reveal
      >
        <CraftArt id="accueil" steps={["croquis", "polissage"]} className="h-auto w-full" />
      </div>
    </section>
  );
}
