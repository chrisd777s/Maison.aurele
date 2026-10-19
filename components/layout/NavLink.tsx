"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";

type Props = ComponentProps<typeof Link> & { matchPrefix?: string };

/** Lien de navigation qui porte `aria-current="page"` sur la page active. */
export function NavLink({ matchPrefix, href, ...rest }: Props) {
  const pathname = usePathname();
  const target = typeof href === "string" ? href : href.pathname;
  const active = matchPrefix ? pathname.startsWith(matchPrefix) : pathname === target;
  return <Link href={href} aria-current={active ? "page" : undefined} {...rest} />;
}
