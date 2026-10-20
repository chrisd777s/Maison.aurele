import { NextResponse, type NextRequest } from "next/server";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { normalizeCode } from "@/lib/provenance/code";

/** Recherche sans JS : redirige vers la page du code (le proxy répond 404 s'il est inconnu). */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const requested = params.get("locale");
  const locale = routing.locales.find((l) => l === requested) ?? routing.defaultLocale;
  const code = normalizeCode(params.get("code") ?? "");
  const href = code
    ? getPathname({ href: { pathname: "/provenance/[code]", params: { code } }, locale })
    : getPathname({ href: "/provenance", locale });
  const url = request.nextUrl.clone();
  url.pathname = href;
  url.search = "";
  return NextResponse.redirect(url, 303);
}
