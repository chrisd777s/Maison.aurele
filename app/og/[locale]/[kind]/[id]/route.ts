import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { allShareImages, renderShareImage, SHARE_KINDS, type ShareKind } from "@/lib/og/share";

// Images de partage (Open Graph) générées au build, une par page partageable.
export async function generateStaticParams() {
  return allShareImages();
}

export async function GET(_request: Request, ctx: RouteContext<"/og/[locale]/[kind]/[id]">) {
  const { locale, kind, id } = await ctx.params;
  const known = SHARE_KINDS.includes(kind as ShareKind) && hasLocale(routing.locales, locale);
  const image = known ? await renderShareImage(locale, kind as ShareKind, id) : null;
  return image ?? new Response("Introuvable", { status: 404 });
}
