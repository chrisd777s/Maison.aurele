import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <section className="grille min-h-[70dvh] content-center py-section">
      <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="mt-8 text-titre-2">{t("title")}</h1>
        <p className="mt-8 max-w-[46ch] text-encre-douce">{t("text")}</p>
        <ButtonLink href="/" variant="trait" className="mt-12">
          {t("home")}
        </ButtonLink>
      </div>
    </section>
  );
}
