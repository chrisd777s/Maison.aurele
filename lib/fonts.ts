import { Cormorant_Garamond, Jost } from "next/font/google";

// Polices auto-hébergées par next/font (aucune requête vers Google au runtime).
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

export const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});
