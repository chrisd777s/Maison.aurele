import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";

export async function Manifesto() {
  const t = await getTranslations("Home");

  return (
    <section aria-labelledby="manifeste" className="grille gap-y-10 pt-section">
      <Eyebrow className="col-span-12 lg:col-span-3">{t("manifestoEyebrow")}</Eyebrow>
      <h2 id="manifeste" data-reveal className="col-span-12 text-titre-2 lg:col-span-8">
        {t("manifestoTitle")}
      </h2>
      <div
        data-reveal
        className="col-span-12 space-y-6 text-chapeau font-light sm:col-span-10 lg:col-span-5 lg:col-start-6"
      >
        <p>{t("manifesto1")}</p>
        <p className="text-corps text-encre-douce">{t("manifesto2")}</p>
        <p className="text-corps text-encre-douce">{t("manifesto3")}</p>
        <p className="pt-4 font-display text-chapeau italic">— {t("manifestoSignature")}</p>
      </div>
    </section>
  );
}
