import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { AppointmentCall } from "@/components/home/AppointmentCall";
import { CollectionChapters } from "@/components/home/CollectionChapters";
import { CraftTeaser } from "@/components/home/CraftTeaser";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { MasterPiece } from "@/components/home/MasterPiece";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const locale = (await rootLocale()) as Locale;
  return {
    title: { absolute: t("titleDefault") },
    alternates: alternatesFor("/", locale),
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <CollectionChapters />
      <MasterPiece />
      <CraftTeaser />
      <AppointmentCall />
    </>
  );
}
