import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { AppointmentForm } from "@/components/appointment/AppointmentForm";
import { AppointmentFromUrl } from "@/components/appointment/AppointmentFromUrl";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Appointment");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/rendez-vous", (await rootLocale()) as Locale),
  };
}

export default async function AppointmentPage() {
  const t = await getTranslations("Appointment");
  return (
    <>
      <header className="grille gap-y-8 pt-14 pb-14 lg:pt-20 lg:pb-20">
        <Eyebrow className="col-span-12">{t("eyebrow")}</Eyebrow>
        <h1 className="col-span-12 text-titre-1 lg:col-span-7">{t("title")}</h1>
        <p className="col-span-12 self-end text-encre-douce sm:col-span-9 lg:col-span-4 lg:col-start-9">
          {t("lede")}
        </p>
      </header>
      <Suspense fallback={<AppointmentForm />}>
        <AppointmentFromUrl />
      </Suspense>
    </>
  );
}
