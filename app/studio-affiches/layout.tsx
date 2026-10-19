import type { ReactNode } from "react";
import "../globals.css";

// Studio d'affiches : page technique, hors navigation, jamais indexée.
export const metadata = { robots: { index: false, follow: false } };

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="m-0 bg-transparent">{children}</body>
    </html>
  );
}
