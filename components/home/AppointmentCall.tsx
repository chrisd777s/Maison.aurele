import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";

export async function AppointmentCall() {
  const t = await getTranslations("Home");

  return (
    <section aria-labelledby="salon" className="grille items-center gap-y-12 pt-section">
      {/* Visuel provisoire : la pénombre du salon, une lampe */}
      <div
        aria-hidden="true"
        data-reveal
        className="salon col-span-12 aspect-[4/5] sm:aspect-[16/11] lg:col-span-7 lg:aspect-[7/8]"
      />
      <div data-reveal className="col-span-12 sm:col-span-9 lg:col-span-4 lg:col-start-9">
        <Eyebrow>{t("appointmentEyebrow")}</Eyebrow>
        <h2 id="salon" className="mt-8 text-titre-2">
          {t("appointmentTitle")}
        </h2>
        <p className="mt-8 text-encre-douce">{t("appointmentText")}</p>
        <ButtonLink href="/rendez-vous" className="mt-12">
          {t("appointmentCta")}
        </ButtonLink>
      </div>
    </section>
  );
}
