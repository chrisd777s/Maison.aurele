import type { CollectionRecord } from "@/lib/commerce/types";

export const collections: CollectionRecord[] = [
  {
    slug: "aube",
    order: 1,
    name: { fr: "Aube", en: "Aube" },
    tagline: { fr: "La lumière du premier matin", en: "The light of first morning" },
    stonesLine: { fr: "Diamants · Or blanc 18 carats", en: "Diamonds · 18-carat white gold" },
    signatureMetal: "or-blanc",
    inspiration: {
      fr: [
        "Il existe une minute, avant que le jour ne se décide, où la lumière n’a pas encore de couleur. Elle effleure les toits du Vieux-Montréal, pâle et précise, sans rien réchauffer.",
        "Aube est née de cette minute. Des lignes d’une finesse extrême, des griffes réduites à l’essentiel, de l’or blanc pour ne rien teinter : chaque diamant reçoit la lumière telle qu’elle arrive, neuve.",
      ],
      en: [
        "There is a minute, before the day makes up its mind, when light has no colour yet. It brushes the rooftops of Old Montréal, pale and exact, warming nothing.",
        "Aube was born of that minute. Lines of extreme fineness, prongs reduced to the essential, white gold so that nothing is tinted: each diamond receives the light as it arrives, new.",
      ],
    },
  },
  {
    slug: "maree",
    order: 2,
    name: { fr: "Marée", en: "Marée" },
    tagline: { fr: "La lumière sur l’eau", en: "Light upon the water" },
    stonesLine: {
      fr: "Perles d’Akoya · Saphirs de Ceylan · Or jaune 18 carats",
      en: "Akoya pearls · Ceylon sapphires · 18-carat yellow gold",
    },
    signatureMetal: "or-jaune",
    inspiration: {
      fr: [
        "Sur l’eau, la lumière ne tient jamais en place. Elle se brise, se rassemble, glisse sous la surface puis revient, plus douce, comme si la mer la gardait un instant avant de la rendre.",
        "Marée unit deux matières qui ont appris ce mouvement : la perle d’Akoya, dont l’orient naît de milliers de couches de nacre, et le saphir de Ceylan, bleu de profondeur. L’or jaune leur donne la chaleur d’une fin d’après-midi.",
      ],
      en: [
        "On water, light never stays still. It breaks, gathers, slips beneath the surface and returns, softer, as if the sea kept it a moment before giving it back.",
        "Marée unites two materials that have learned this motion: the Akoya pearl, whose orient is born of thousands of layers of nacre, and the Ceylon sapphire, blue with depth. Yellow gold lends them the warmth of late afternoon.",
      ],
    },
  },
  {
    slug: "obsidienne",
    order: 3,
    name: { fr: "Obsidienne", en: "Obsidienne" },
    tagline: { fr: "La lumière qu’on retient", en: "The light one keeps" },
    stonesLine: {
      fr: "Onyx · Diamants noirs · Or 18 carats rhodié noir",
      en: "Onyx · Black diamonds · Black-rhodium 18-carat gold",
    },
    signatureMetal: "or-noir",
    inspiration: {
      fr: [
        "Tout ce qui brille ne cherche pas à être vu. Certaines matières absorbent la lumière et ne la rendent qu’à qui sait regarder : un reflet sur l’arête d’un onyx, une étincelle au cœur d’un diamant noir.",
        "Obsidienne est notre collection du soir et du silence. L’or rhodié noir efface le métal pour ne laisser que la forme ; la lumière, retenue, devient une confidence.",
      ],
      en: [
        "Not everything that shines wishes to be seen. Some materials absorb the light and return it only to those who know how to look: a gleam along the edge of onyx, a spark at the heart of a black diamond.",
        "Obsidienne is our collection of evening and of silence. Black-rhodium gold erases the metal to leave only the form; the light, held back, becomes a confidence.",
      ],
    },
  },
];
