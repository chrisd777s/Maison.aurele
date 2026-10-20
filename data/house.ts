import type { Localized } from "@/lib/commerce/types";

/* Textes longs de La Maison et du Savoir-faire, lus côté serveur uniquement. */

export type Milestone = { year: number; title: Localized; text: Localized };

export const milestones: Milestone[] = [
  {
    year: 2011,
    title: { fr: "Deux établis, rue Saint-Paul", en: "Two workbenches, rue Saint-Paul" },
    text: {
      fr: "De retour de Paris, Hélène Aurèle loue un ancien entrepôt de fourrures du Vieux-Montréal. Elle y installe deux établis face aux fenêtres, pour travailler à la lumière du nord.",
      en: "Back from Paris, Hélène Aurèle rents a former fur warehouse in Old Montréal. She sets up two workbenches facing the windows, to work by northern light.",
    },
  },
  {
    year: 2014,
    title: { fr: "La première pierre tracée", en: "The first traced stone" },
    text: {
      fr: "La Maison n’achète plus que des diamants dont l’origine est connue, de la mine à la taille. Le Grand Nord canadien devient notre première source.",
      en: "The Maison now buys only diamonds whose origin is known, from mine to cutter. Canada’s Far North becomes our first source.",
    },
  },
  {
    year: 2017,
    title: { fr: "Un or qui a déjà vécu", en: "Gold that has lived before" },
    text: {
      fr: "Tout l’or et tout le platine de l’atelier sont désormais recyclés et certifiés. Aucun gramme de métal nouvellement extrait n’entre plus dans nos pièces.",
      en: "All the gold and platinum at the atelier are now recycled and certified. Not a single gram of newly mined metal enters our pieces any more.",
    },
  },
  {
    year: 2019,
    title: { fr: "Marée", en: "Marée" },
    text: {
      fr: "Après trois voyages au Japon et au Sri Lanka, Hélène dessine Marée : des perles d’Akoya et des saphirs de Ceylan, la lumière posée sur l’eau.",
      en: "After three journeys to Japan and Sri Lanka, Hélène designs Marée: Akoya pearls and Ceylon sapphires, light resting on water.",
    },
  },
  {
    year: 2022,
    title: { fr: "Un salon à Paris", en: "A salon in Paris" },
    text: {
      fr: "La Maison ouvre un salon privé rue de la Paix, sur rendez-vous seulement : un retour aux sources pour celle qui y a appris son métier.",
      en: "The Maison opens a private salon on rue de la Paix, by appointment only: a homecoming for the woman who learned her craft there.",
    },
  },
  {
    year: 2026,
    title: { fr: "Chaque écrin a son adresse", en: "Every box has its address" },
    text: {
      fr: "Un code imprimé sur chaque écrin ouvre désormais le parcours de ses pierres : la mine, la taille, le jour du sertissage et le nom de l’artisan.",
      en: "A code printed on every box now opens the journey of its stones: the mine, the cutting, the day of setting and the name of the artisan.",
    },
  },
];

export const founder = {
  name: "Hélène Aurèle",
  bio: {
    fr: [
      "Née à Québec, Hélène Aurèle découvre les pierres dans l’atelier d’horlogerie de son grand-père, où les rubis des mouvements la fascinent plus que les aiguilles. Elle étudie la gemmologie, puis part à Paris à vingt-deux ans.",
      "Elle y passe dix ans à l’établi, dans les ateliers de la place Vendôme, d’abord comme apprentie sertisseuse, puis comme dessinatrice. Elle y apprend la gouache, la patience, et cette règle qu’elle répète encore : une pièce n’est finie que lorsqu’on ne voit plus le travail.",
      "En 2011, elle rentre à Montréal avec une idée simple : une joaillerie qui ne parle que de lumière, faite avec des pierres dont on connaît l’histoire. Elle dessine toujours chaque pièce à la main.",
    ],
    en: [
      "Born in Québec City, Hélène Aurèle discovered stones in her grandfather’s watchmaking workshop, where the rubies in the movements fascinated her more than the hands. She studied gemmology, then left for Paris at twenty-two.",
      "She spent ten years at the bench there, in the ateliers of place Vendôme, first as an apprentice setter, then as a designer. She learned gouache, patience, and the rule she still repeats: a piece is only finished when the work can no longer be seen.",
      "In 2011 she returned to Montréal with a simple idea: jewellery that speaks only of light, made with stones whose story is known. She still draws every piece by hand.",
    ],
  } satisfies Localized<string[]>,
  quote: {
    fr: "Je ne dessine pas des bijoux. Je dessine l’endroit où la lumière va s’arrêter.",
    en: "I do not draw jewellery. I draw the place where light will come to rest.",
  } satisfies Localized,
};

export type Value = { title: Localized; text: Localized };

export const values: Value[] = [
  {
    title: { fr: "La lumière d’abord", en: "Light, first" },
    text: {
      fr: "Chaque dessin commence par une question : d’où vient la lumière, et où doit-elle aller ? Les griffes s’affinent, les corbeilles s’ajourent, le métal s’efface pour qu’elle circule.",
      en: "Every drawing begins with one question: where does the light come from, and where should it go? Prongs grow finer, baskets open up, metal steps aside so that it can move.",
    },
  },
  {
    title: { fr: "Une pierre, une histoire", en: "One stone, one story" },
    text: {
      fr: "Nous savons d’où vient chacune de nos pierres principales, qui l’a taillée et qui l’a sertie. Vous aussi : il suffit de lire le code inscrit sur l’écrin.",
      en: "We know where each of our principal stones comes from, who cut it and who set it. So can you: simply read the code printed on the box.",
    },
  },
  {
    title: { fr: "Un or qui a déjà vécu", en: "Gold that has lived before" },
    text: {
      fr: "Notre or et notre platine sont recyclés et certifiés. Le métal précieux ne s’use pas : il attend simplement une nouvelle forme.",
      en: "Our gold and platinum are recycled and certified. Precious metal does not wear out: it simply waits for a new form.",
    },
  },
  {
    title: { fr: "Le temps de la main", en: "The time of the hand" },
    text: {
      fr: "Quatorze artisans, un seul atelier. Une pièce passe par six étapes et autant de mains, sans jamais quitter Montréal avant de vous être remise.",
      en: "Fourteen artisans, a single atelier. A piece passes through six stages and as many hands, never leaving Montréal before it is handed to you.",
    },
  },
];

export const keyFigures = [
  { value: "2011", label: { fr: "Fondation, Vieux-Montréal", en: "Founded, Old Montréal" } },
  { value: "14", label: { fr: "Artisans à l’atelier", en: "Artisans at the atelier" } },
  {
    value: "100 %",
    label: { fr: "D’or et de platine recyclés", en: "Recycled gold and platinum" },
  },
  { value: "120 h", label: { fr: "En moyenne pour une bague", en: "On average for a ring" } },
] satisfies { value: string; label: Localized }[];

/* ── Savoir-faire : les six étapes ──────────────────────────── */

export type CraftStepId = "croquis" | "gouache" | "cire" | "fonte" | "sertissage" | "polissage";

export type CraftStep = {
  id: CraftStepId;
  name: Localized;
  duration: Localized;
  text: Localized;
  detail: Localized;
};

export const craftSteps: CraftStep[] = [
  {
    id: "croquis",
    name: { fr: "Croquis", en: "Sketch" },
    duration: { fr: "Quelques heures à plusieurs semaines", en: "A few hours to several weeks" },
    text: {
      fr: "Tout commence au crayon, sur papier calque. Hélène Aurèle trace d’abord l’axe, puis la course de la lumière, et seulement ensuite le bijou. Une pièce naît souvent d’une centaine d’esquisses, dont une seule sera retenue.",
      en: "Everything begins in pencil, on tracing paper. Hélène Aurèle first draws the axis, then the path of light, and only then the jewel. A piece is often born of a hundred sketches, only one of which is kept.",
    },
    detail: { fr: "Crayon HB, papier calque, compas", en: "HB pencil, tracing paper, compass" },
  },
  {
    id: "gouache",
    name: { fr: "Gouache", en: "Gouache" },
    duration: { fr: "Un à trois jours", en: "One to three days" },
    text: {
      fr: "Le dessin retenu est mis en couleur à la gouache, à l’échelle exacte, sur papier gris. Les reflets du métal et le feu de la pierre y sont peints touche par touche : c’est la promesse que l’atelier devra tenir.",
      en: "The chosen drawing is painted in gouache, at exact scale, on grey paper. The gleam of the metal and the fire of the stone are painted stroke by stroke: it is the promise the atelier will have to keep.",
    },
    detail: {
      fr: "Pinceau martre n° 0, gouache sur papier gris",
      en: "No. 0 sable brush, gouache on grey paper",
    },
  },
  {
    id: "cire",
    name: { fr: "Cire", en: "Wax" },
    duration: { fr: "Deux à quatre jours", en: "Two to four days" },
    text: {
      fr: "Le modeleur sculpte la pièce dans un bloc de cire, à la lime et au scalpel, au dixième de millimètre. On la pèse pour connaître le poids de métal qu’elle demandera, et on la retouche jusqu’à ce qu’elle tombe parfaitement au doigt.",
      en: "The modeller carves the piece from a block of wax, with file and scalpel, to a tenth of a millimetre. It is weighed to know how much metal it will need, and refined until it sits perfectly on the finger.",
    },
    detail: { fr: "Cire de sculpture, limes, scalpel", en: "Carving wax, files, scalpel" },
  },
  {
    id: "fonte",
    name: { fr: "Fonte", en: "Casting" },
    duration: { fr: "Une journée", en: "One day" },
    text: {
      fr: "La cire est prise dans un moule de plâtre réfractaire, puis fondue et évacuée au four. Dans l’empreinte laissée vide, on coule l’or recyclé à plus de mille degrés. Le métal prend exactement la place de la cire : c’est la fonte à cire perdue, telle qu’on la pratique depuis l’Antiquité.",
      en: "The wax is encased in a refractory plaster mould, then melted out in the kiln. Into the empty imprint, recycled gold is poured at over a thousand degrees. The metal takes exactly the place of the wax: this is lost-wax casting, as it has been practised since antiquity.",
    },
    detail: {
      fr: "Or 18 carats recyclé, plus de 1 000 °C",
      en: "Recycled 18-carat gold, over 1,000 °C",
    },
  },
  {
    id: "sertissage",
    name: { fr: "Sertissage", en: "Setting" },
    duration: { fr: "Trois à quinze jours", en: "Three to fifteen days" },
    text: {
      fr: "Sous le binoculaire, le sertisseur ajuste chaque griffe à la pierre qu’elle doit tenir. Il creuse l’assise, pose la pierre, rabat le métal par petites pressions. Trop serrée, la pierre risque de se fendre ; trop lâche, elle se perdra. Tout se joue au centième de millimètre.",
      en: "Under the microscope, the setter fits each prong to the stone it must hold, cuts the seat, places the stone and folds the metal over in small presses. Too tight, the stone may crack; too loose, it will be lost. Everything happens to a hundredth of a millimetre.",
    },
    detail: { fr: "Échoppes, binoculaire ×10", en: "Gravers, ×10 microscope" },
  },
  {
    id: "polissage",
    name: { fr: "Polissage", en: "Polishing" },
    duration: { fr: "Un à deux jours", en: "One to two days" },
    text: {
      fr: "Le polisseur efface toute trace d’outil, jusque dans les ajours que personne ne verra. Puis la pièce passe sous la loupe une dernière fois, à la lumière du nord. Elle est terminée lorsque l’on ne voit plus le travail, seulement la lumière.",
      en: "The polisher erases every trace of the tools, even in openings no one will ever see. Then the piece goes under the loupe one last time, in northern light. It is finished when the work can no longer be seen, only the light.",
    },
    detail: {
      fr: "Brosses de soie, pâtes de polissage, loupe ×10",
      en: "Silk brushes, polishing compounds, ×10 loupe",
    },
  },
];
