import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "plein" | "trait" | "texte";

const variants: Record<Variant, string> = {
  plein:
    "bg-encre text-fond hover:bg-[color-mix(in_oklab,var(--encre)_86%,var(--accent))] px-8 py-4",
  trait:
    "border border-encre/70 text-encre hover:border-encre hover:bg-encre hover:text-fond px-8 py-4",
  texte: "text-encre lien-fin",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant };

/** Lien d'action à l'allure de bouton. Cible tactile ≥ 44 px pour les variantes encadrées. */
export function ButtonLink({ variant = "plein", className = "", children, ...rest }: Props) {
  return (
    <Link
      className={`surtitre inline-flex min-h-11 items-center justify-center gap-3 transition-colors duration-[var(--duree-courte)] ease-maison ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
