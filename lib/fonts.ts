import localFont from "next/font/local";

// Polices auto-hébergées, réduites aux graisses et aux caractères du site
// (scripts/fonts.sh) : 63 Ko préchargés au lieu de 102 avec les fichiers Google.
export const cormorant = localFont({
  src: [
    {
      path: "../assets/fonts/web/CormorantGaramond-300-400.woff2",
      weight: "300 400",
      style: "normal",
    },
    {
      path: "../assets/fonts/web/CormorantGaramond-Italic-300.woff2",
      weight: "300",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-cormorant",
  adjustFontFallback: "Times New Roman",
});

export const jost = localFont({
  src: "../assets/fonts/web/Jost-300-400.woff2",
  weight: "300 400",
  display: "swap",
  variable: "--font-jost",
  adjustFontFallback: "Arial",
});
