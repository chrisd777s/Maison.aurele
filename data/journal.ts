import type { Body } from "@/lib/editorial/types";
import { articleIndex, type ArticleMeta } from "./journal-index";

/* Corps des articles du Journal, rédigés dans les deux langues. */

const perle: Body = {
  fr: [
    {
      kind: "p",
      text: "Toutes les gemmes naissent de la terre, sauf une. La perle vient de l’eau, et d’un être vivant. Elle ne se taille pas, ne se polit pas, ne se corrige pas : elle sort de la nacre telle qu’elle restera. C’est sans doute pour cela qu’elle a si longtemps été la plus précieuse de toutes.",
    },
    { kind: "h2", text: "Un accident devenu trésor" },
    {
      kind: "p",
      text: "Une perle commence par une intrusion. Un grain, un parasite, une blessure : l’huître, pour s’en protéger, enveloppe l’intrus de fines couches de nacre, des milliers de lamelles d’aragonite liées par une matière organique. Ce sont ces couches, superposées comme les pages d’un livre, qui diffractent la lumière et donnent à la perle son orient, ce reflet doux qui semble venir de l’intérieur.",
    },
    {
      kind: "p",
      text: "Pendant des siècles, seules existaient les perles fines, nées sans aide humaine. Il fallait ouvrir des milliers d’huîtres pour en trouver une seule digne d’un collier. Les bancs du golfe Persique et du golfe de Mannar, entre l’Inde et Ceylan, ont fait la fortune de dynasties entières. Les plongeurs y descendaient en apnée, une pierre attachée au pied, plusieurs dizaines de fois par jour.",
    },
    {
      kind: "quote",
      text: "En 1917, à New York, un hôtel particulier de la Cinquième Avenue changea de mains contre un double rang de perles fines.",
      cite: "Une anecdote que les joailliers aiment raconter",
    },
    { kind: "h2", text: "La révolution de la patience" },
    {
      kind: "p",
      text: "Au tournant du XXᵉ siècle, des chercheurs japonais comprennent que l’on peut provoquer ce que la nature faisait au hasard. On glisse dans l’huître une petite bille de nacre et un fragment de tissu d’une autre huître ; la vie fait le reste. La perle de culture est née, et avec elle la baie d’Ago, sur la péninsule de Shima, devient l’un des berceaux de la perliculture.",
    },
    {
      kind: "p",
      text: "Le mot culture dit bien les choses. Une perle d’Akoya demande de dix-huit mois à deux ans dans l’eau, pendant lesquels les perliculteurs nettoient les paniers, surveillent la température, déplacent les huîtres au gré des saisons. La récolte a lieu en plein hiver : dans l’eau froide, la nacre se dépose plus lentement, en couches plus serrées, et l’éclat n’en est que plus vif.",
    },
    { kind: "h2", text: "Ce que nous regardons" },
    {
      kind: "p",
      text: "À l’atelier, une perle se juge à l’œil nu, sous une lumière du nord, sur un fond de velours clair. Nous regardons d’abord l’éclat : une belle Akoya renvoie le contour net d’une fenêtre, comme un miroir. Viennent ensuite la surface, la forme, l’épaisseur de nacre et, pour les perles blanches, cette teinte rosée ou argentée qui fait toute leur personnalité.",
    },
    {
      kind: "list",
      items: [
        "L’éclat, ou lustre : la netteté du reflet. C’est le critère que nous plaçons avant tous les autres.",
        "La surface : quelques marques sont la signature d’une perle vivante ; elles ne doivent simplement pas attirer l’œil.",
        "La forme : parfaitement ronde pour un rang, légèrement ovale pour un pendentif, parfois baroque par choix.",
        "La nacre : assez épaisse pour que la perle traverse les générations sans s’user.",
      ],
    },
    { kind: "h2", text: "L’appairage, un travail de semaines" },
    {
      kind: "p",
      text: "Pour un rang, il faut réunir des perles qui se ressemblent au point de paraître sœurs : même éclat, même teinte, diamètre croissant d’un dixième de millimètre en un dixième de millimètre. Nous en examinons souvent plusieurs centaines pour en retenir quarante. Pour une paire de boucles, le travail est plus délicat encore, car deux perles se comparent sans cesse l’une à l’autre.",
    },
    {
      kind: "p",
      text: "Nos rangs sont enfilés sur soie, avec un nœud entre chaque perle. Ce nœud n’est pas un ornement : il empêche les perles de se frotter et, si le fil venait à rompre, il n’en perdrait qu’une. C’est aussi pour cela qu’un rang porté souvent mérite d’être renfilé tous les deux ou trois ans. Nous le faisons à l’atelier, sans frais, pour toute pièce de la Maison.",
    },
    {
      kind: "p",
      text: "La perle se porte, et elle aime être portée. Le contact de la peau entretient son éclat. C’est la seule gemme qui, d’une certaine façon, se nourrit de celle qui la porte.",
    },
  ],
  en: [
    {
      kind: "p",
      text: "Every gem is born of the earth, except one. The pearl comes from the water, and from a living creature. It is never cut, never polished, never corrected: it leaves the shell exactly as it will remain. That is surely why, for so long, it was the most precious of all.",
    },
    { kind: "h2", text: "An accident turned treasure" },
    {
      kind: "p",
      text: "A pearl begins with an intrusion. A grain, a parasite, a wound: to protect itself, the oyster wraps the intruder in fine layers of nacre, thousands of aragonite platelets bound by organic matter. These layers, stacked like the pages of a book, diffract the light and give the pearl its orient, that soft glow which seems to come from within.",
    },
    {
      kind: "p",
      text: "For centuries, only natural pearls existed, born without any human help. Thousands of oysters had to be opened to find a single one worthy of a necklace. The banks of the Persian Gulf and of the Gulf of Mannar, between India and Ceylon, made the fortune of entire dynasties. Divers went down on a single breath, a stone tied to one foot, dozens of times a day.",
    },
    {
      kind: "quote",
      text: "In 1917, in New York, a Fifth Avenue mansion changed hands in exchange for a double strand of natural pearls.",
      cite: "A story jewellers love to tell",
    },
    { kind: "h2", text: "The revolution of patience" },
    {
      kind: "p",
      text: "At the turn of the twentieth century, Japanese researchers understood that what nature did by chance could be encouraged. A small bead of shell and a fragment of tissue from another oyster are placed inside the oyster; life does the rest. The cultured pearl was born, and with it Ago Bay, on the Shima peninsula, became one of the cradles of pearl farming.",
    },
    {
      kind: "p",
      text: "The word farming says it well. An Akoya pearl needs eighteen months to two years in the water, during which the farmers clean the baskets, watch the temperature and move the oysters with the seasons. The harvest takes place in the depths of winter: in cold water, nacre is laid down more slowly, in tighter layers, and the lustre is all the brighter for it.",
    },
    { kind: "h2", text: "What we look for" },
    {
      kind: "p",
      text: "At the atelier, a pearl is judged with the naked eye, under northern light, against pale velvet. We look first at the lustre: a fine Akoya returns the sharp outline of a window, like a mirror. Then come the surface, the shape, the thickness of nacre and, for white pearls, the rosé or silver overtone that gives each its personality.",
    },
    {
      kind: "list",
      items: [
        "Lustre: the sharpness of the reflection. This is the criterion we place before all others.",
        "Surface: a few marks are the signature of a living pearl; they simply must not catch the eye.",
        "Shape: perfectly round for a strand, slightly oval for a pendant, sometimes baroque by choice.",
        "Nacre: thick enough for the pearl to pass through generations without wearing.",
      ],
    },
    { kind: "h2", text: "Matching, a work of weeks" },
    {
      kind: "p",
      text: "A strand calls for pearls so alike they seem to be sisters: the same lustre, the same overtone, a diameter growing a tenth of a millimetre at a time. We often examine several hundred to keep forty. For a pair of earrings the work is more delicate still, because two pearls are forever being compared with each other.",
    },
    {
      kind: "p",
      text: "Our strands are strung on silk, with a knot between each pearl. The knot is not an ornament: it keeps the pearls from rubbing together and, should the thread ever break, only one would be lost. It is also why a strand worn often deserves to be restrung every two or three years. We do it at the atelier, free of charge, for any piece from the Maison.",
    },
    {
      kind: "p",
      text: "A pearl is meant to be worn, and it likes to be worn. The touch of skin keeps its lustre alive. It is the only gem that, in a way, draws life from the person who wears it.",
    },
  ],
};

const diamant: Body = {
  fr: [
    {
      kind: "p",
      text: "On résume souvent le diamant à quatre lettres : taille, couleur, pureté, carat. Ces critères sont utiles, ils permettent de comparer et de nommer. Mais ils ne disent pas tout, et surtout pas dans quel ordre il faut les regarder. Voici celui que nous suivons à l’atelier, après quinze ans à choisir des pierres une à une.",
    },
    { kind: "h2", text: "La taille, d’abord et avant tout" },
    {
      kind: "p",
      text: "Un diamant brut est terne. Toute sa lumière vient du travail du tailleur : l’angle des facettes, la hauteur de la couronne, la profondeur du pavillon. Bien taillée, la pierre renvoie vers l’œil presque toute la lumière qui y entre ; mal taillée, elle la laisse fuir par le dessous et paraît vitreuse, quelle que soit sa couleur.",
    },
    {
      kind: "p",
      text: "C’est pourquoi nous ne retenons, pour nos diamants ronds, que des tailles notées « Excellente », avec un poli et une symétrie du même niveau. Une pierre de 0,90 carat parfaitement taillée paraîtra plus grande et plus vivante qu’une pierre d’un carat trop profonde, qui cache son poids là où personne ne le voit.",
    },
    {
      kind: "quote",
      text: "La couleur et la pureté disent ce que la nature a donné. La taille dit ce que l’homme en a fait.",
      cite: "Hélène Aurèle",
    },
    { kind: "h2", text: "La couleur, selon le métal" },
    {
      kind: "p",
      text: "L’échelle va de D, l’absence totale de teinte, à Z, un jaune pâle. Entre deux grades voisins, l’œil ne voit presque rien ; c’est l’environnement qui décide. Sertie sur platine ou or blanc, une pierre D à F garde une blancheur de glace. Sur or jaune ou rose, un G ou un H paraît tout aussi blanc, car le métal réchauffe l’ensemble.",
    },
    {
      kind: "p",
      text: "Nous conseillons donc de choisir le métal avant la couleur. C’est souvent là que l’on fait l’économie la plus juste, sans rien perdre à l’œil.",
    },
    { kind: "h2", text: "La pureté, à l’œil nu" },
    {
      kind: "p",
      text: "Presque tous les diamants portent des inclusions, petites traces de leur formation. Le grade va de FL, sans inclusion visible à la loupe ×10, à I, où elles se voient à l’œil nu. Pour une bague portée chaque jour, une pierre VS1 ou VS2 est parfaitement nette à distance de regard. Au-delà, on paie la certitude d’une perfection que seule la loupe révèle.",
    },
    {
      kind: "list",
      items: [
        "FL, IF : aucune inclusion visible, même pour un gemmologue à la loupe.",
        "VVS1, VVS2 : inclusions infimes, difficiles à trouver à la loupe.",
        "VS1, VS2 : inclusions mineures, invisibles à l’œil nu.",
        "SI1, SI2 : inclusions visibles à la loupe, parfois à l’œil nu selon la forme.",
      ],
    },
    { kind: "h2", text: "Le carat, et ses seuils" },
    {
      kind: "p",
      text: "Le carat est une unité de poids, deux dixièmes de gramme, pas de taille. Les prix montent par paliers aux poids ronds : un demi-carat, trois quarts, un carat. Une pierre de 0,95 carat coûte sensiblement moins qu’une pierre d’un carat, pour une différence de diamètre de quelques centièmes de millimètre. C’est un bon conseil à connaître, et nous le donnons volontiers.",
    },
    { kind: "h2", text: "Ce que les 4C ne disent pas" },
    {
      kind: "p",
      text: "Il reste deux questions que les grilles ignorent. La première est l’origine. Nos pierres principales sont accompagnées d’un certificat d’un laboratoire indépendant, et chaque pièce d’un code de provenance qui retrace le parcours de ses diamants, de la mine du Grand Nord canadien jusqu’à notre établi. Vous pouvez le consulter sur notre site, et il est imprimé sur l’écrin.",
    },
    {
      kind: "p",
      text: "La seconde est plus intime : la pierre vous plaît-elle ? Deux diamants aux grades identiques n’ont jamais tout à fait le même feu. C’est pourquoi nous préférons toujours vous en montrer plusieurs, côte à côte, à la lumière du jour, au salon de Montréal ou de Paris. Le bon diamant est souvent celui que l’on regarde une seconde de plus que les autres.",
    },
  ],
  en: [
    {
      kind: "p",
      text: "A diamond is often reduced to four letters: cut, colour, clarity, carat. These criteria are useful; they let us compare and name. But they do not tell everything, and least of all in which order to look at them. Here is the order we follow at the atelier, after fifteen years of choosing stones one by one.",
    },
    { kind: "h2", text: "Cut, first and foremost" },
    {
      kind: "p",
      text: "A rough diamond is dull. All of its light comes from the cutter’s work: the angle of the facets, the height of the crown, the depth of the pavilion. Well cut, the stone sends back to the eye almost all the light that enters it; poorly cut, it lets the light escape through the bottom and looks glassy, whatever its colour.",
    },
    {
      kind: "p",
      text: "This is why, for our round diamonds, we only accept cuts graded Excellent, with polish and symmetry of the same level. A perfectly cut 0.90-carat stone will look larger and more alive than a one-carat stone cut too deep, hiding its weight where no one can see it.",
    },
    {
      kind: "quote",
      text: "Colour and clarity tell what nature gave. Cut tells what we made of it.",
      cite: "Hélène Aurèle",
    },
    { kind: "h2", text: "Colour, depending on the metal" },
    {
      kind: "p",
      text: "The scale runs from D, the complete absence of tint, to Z, a pale yellow. Between two neighbouring grades the eye sees almost nothing; it is the setting that decides. Set in platinum or white gold, a D to F stone keeps an icy whiteness. In yellow or rose gold, a G or H looks just as white, because the metal warms the whole piece.",
    },
    {
      kind: "p",
      text: "So we suggest choosing the metal before the colour. It is often where the wisest saving is made, with nothing lost to the eye.",
    },
    { kind: "h2", text: "Clarity, to the naked eye" },
    {
      kind: "p",
      text: "Almost every diamond carries inclusions, small traces of its formation. The grade runs from FL, with no inclusion visible under ×10 magnification, to I, where they can be seen with the naked eye. For a ring worn every day, a VS1 or VS2 stone is perfectly clean at a normal viewing distance. Beyond that, one pays for the certainty of a perfection only the loupe reveals.",
    },
    {
      kind: "list",
      items: [
        "FL, IF: no visible inclusion, even to a gemmologist with a loupe.",
        "VVS1, VVS2: minute inclusions, hard to find under the loupe.",
        "VS1, VS2: minor inclusions, invisible to the naked eye.",
        "SI1, SI2: inclusions visible under the loupe, sometimes to the eye depending on the shape.",
      ],
    },
    { kind: "h2", text: "Carat, and its thresholds" },
    {
      kind: "p",
      text: "The carat is a unit of weight, two tenths of a gram, not of size. Prices climb in steps at round weights: half a carat, three quarters, one carat. A 0.95-carat stone costs noticeably less than a one-carat stone, for a difference in diameter of a few hundredths of a millimetre. It is worth knowing, and we are always glad to say so.",
    },
    { kind: "h2", text: "What the 4Cs leave out" },
    {
      kind: "p",
      text: "Two questions remain that the grading charts ignore. The first is origin. Our principal stones come with a certificate from an independent laboratory, and every piece with a provenance code that traces the journey of its diamonds, from the mine in Canada’s Far North to our workbench. You can look it up on our website, and it is printed on the jewellery box.",
    },
    {
      kind: "p",
      text: "The second is more personal: do you love the stone? Two diamonds with identical grades never have quite the same fire. That is why we always prefer to show you several, side by side, in daylight, at the Montréal or Paris salon. The right diamond is often the one you look at a second longer than the others.",
    },
  ],
};

const soin: Body = {
  fr: [
    {
      kind: "p",
      text: "Un bijou de la Maison est fait pour être porté, longtemps et souvent. Il n’a pas besoin de précautions excessives, seulement de quelques gestes réguliers. Voici ceux que nous recommandons à l’atelier, matière par matière.",
    },
    { kind: "h2", text: "Le diamant : simplement propre" },
    {
      kind: "p",
      text: "Le diamant est la matière naturelle la plus dure qui soit ; il ne se raye pas au quotidien. Mais il a une particularité méconnue : il attire les corps gras. Crème pour les mains, savon, simple contact de la peau, et la pierre perd en quelques semaines une part de son éclat, parce que la lumière ne traverse plus librement le pavillon.",
    },
    {
      kind: "list",
      items: [
        "Laissez tremper la pièce quelques minutes dans de l’eau tiède additionnée d’une goutte de savon doux.",
        "Brossez délicatement sous la pierre avec une brosse à dents très souple, là où la poussière s’accumule.",
        "Rincez à l’eau claire, puis séchez avec un chiffon non pelucheux.",
      ],
    },
    {
      kind: "p",
      text: "Une fois par mois suffit pour une bague portée chaque jour. Évitez seulement l’eau chlorée des piscines et des spas : le chlore fragilise les alliages d’or avec le temps, et l’on perd plus de bagues dans l’eau qu’on ne le croit.",
    },
    { kind: "h2", text: "La perle : la dernière mise, la première ôtée" },
    {
      kind: "p",
      text: "La perle est faite de nacre, une matière vivante et tendre. Parfum, laque, crème solaire et transpiration l’attaquent lentement. La règle est ancienne et toujours juste : on met ses perles après s’être parfumée, et on les retire avant de se démaquiller.",
    },
    {
      kind: "p",
      text: "Après chaque port, essuyez-les d’un chiffon doux légèrement humide. Ne les plongez jamais dans l’eau : la soie du rang se détendrait et se tacherait. Rangez-les à plat, jamais suspendues, dans une pochette qui leur est réservée, et faites renfiler un rang porté souvent tous les deux ou trois ans.",
    },
    { kind: "h2", text: "Le saphir et l’onyx" },
    {
      kind: "p",
      text: "Le saphir est presque aussi résistant que le diamant ; il se nettoie de la même façon. L’onyx est plus tendre et plus sensible aux chocs : un chiffon doux suffit, sans produit ni brosse. Pour l’un comme pour l’autre, évitez les appareils à ultrasons vendus pour la maison, qui peuvent desserrer un sertissage ou révéler une fragilité invisible.",
    },
    { kind: "h2", text: "Les métaux" },
    {
      kind: "p",
      text: "L’or jaune et l’or rose ne demandent qu’un chiffon de polissage de temps à autre. L’or blanc et l’or noir, eux, sont recouverts d’une fine couche de rhodium qui leur donne leur couleur ; avec les années, elle s’use aux endroits de frottement et laisse paraître la teinte naturelle de l’alliage. Ce n’est pas un défaut : il suffit de la renouveler. Le platine, enfin, se patine en douceur et prend un satiné que beaucoup apprécient.",
    },
    {
      kind: "quote",
      text: "Une pierre ne tombe presque jamais d’un coup. Une griffe s’use, se soulève, et un jour accroche un pull. Un contrôle par an suffit à l’éviter.",
      cite: "Anouk Pelletier, polisseuse",
    },
    { kind: "h2", text: "Ranger ses bijoux" },
    {
      kind: "p",
      text: "Le diamant raye tout, y compris les autres diamants. Rangez chaque pièce séparément, dans son écrin ou dans une pochette, et à l’abri de la lumière directe pour les perles. En voyage, une trousse à compartiments évite bien des chagrins.",
    },
    { kind: "h2", text: "Le rendez-vous annuel" },
    {
      kind: "p",
      text: "Une fois par an, apportez vos pièces à l’un de nos salons, ou envoyez-les-nous dans l’emballage assuré que nous vous faisons parvenir. Nous vérifions chaque griffe, resserrons ce qui doit l’être, nettoyons aux ultrasons ce qui le supporte, et repolissons si vous le souhaitez. Ce service est inclus dans notre garantie à vie, pour toute pièce de la Maison.",
    },
  ],
  en: [
    {
      kind: "p",
      text: "A piece from the Maison is made to be worn, for a long time and often. It needs no excessive precautions, only a few regular habits. Here are the ones we recommend at the atelier, material by material.",
    },
    { kind: "h2", text: "Diamond: simply clean" },
    {
      kind: "p",
      text: "Diamond is the hardest natural material there is; it does not scratch in everyday life. But it has a little-known quirk: it attracts grease. Hand cream, soap, the simple touch of skin, and within a few weeks the stone loses part of its brilliance, because light no longer travels freely through the pavilion.",
    },
    {
      kind: "list",
      items: [
        "Soak the piece for a few minutes in lukewarm water with a drop of mild soap.",
        "Gently brush beneath the stone with a very soft toothbrush, where dust collects.",
        "Rinse in clear water, then dry with a lint-free cloth.",
      ],
    },
    {
      kind: "p",
      text: "Once a month is enough for a ring worn every day. Only avoid the chlorinated water of pools and spas: over time, chlorine weakens gold alloys, and more rings are lost in the water than one might think.",
    },
    { kind: "h2", text: "Pearls: last on, first off" },
    {
      kind: "p",
      text: "A pearl is made of nacre, a soft and living material. Perfume, hairspray, sunscreen and perspiration slowly attack it. The rule is old and still true: put your pearls on after your perfume, and take them off before removing your make-up.",
    },
    {
      kind: "p",
      text: "After each wear, wipe them with a soft, slightly damp cloth. Never immerse them: the silk of the strand would stretch and stain. Store them flat, never hanging, in a pouch of their own, and have a strand worn often restrung every two or three years.",
    },
    { kind: "h2", text: "Sapphire and onyx" },
    {
      kind: "p",
      text: "Sapphire is almost as hard as diamond and is cleaned in the same way. Onyx is softer and more sensitive to knocks: a soft cloth is enough, with no product or brush. For both, avoid the ultrasonic cleaners sold for home use, which can loosen a setting or reveal an invisible weakness.",
    },
    { kind: "h2", text: "Metals" },
    {
      kind: "p",
      text: "Yellow and rose gold only need a polishing cloth from time to time. White and black gold are covered with a thin layer of rhodium that gives them their colour; over the years it wears where the piece rubs and lets the alloy’s natural shade show through. This is not a flaw: it simply needs renewing. Platinum, finally, develops a gentle patina, a satin finish many people come to love.",
    },
    {
      kind: "quote",
      text: "A stone almost never falls out all at once. A prong wears, lifts, and one day catches on a sweater. One check a year is enough to prevent it.",
      cite: "Anouk Pelletier, polisher",
    },
    { kind: "h2", text: "Storing your jewellery" },
    {
      kind: "p",
      text: "Diamond scratches everything, including other diamonds. Keep each piece separately, in its box or a pouch, and away from direct light for pearls. When travelling, a case with compartments saves a great deal of heartache.",
    },
    { kind: "h2", text: "The yearly appointment" },
    {
      kind: "p",
      text: "Once a year, bring your pieces to one of our salons, or send them to us in the insured packaging we provide. We check every prong, tighten what needs tightening, clean ultrasonically what can bear it, and repolish if you wish. This service is included in our lifetime warranty, for every piece from the Maison.",
    },
  ],
};

const bodies: Record<string, Body> = {
  "histoire-de-la-perle": perle,
  "choisir-un-diamant": diamant,
  "prendre-soin-de-ses-bijoux": soin,
};

export type Article = ArticleMeta & { body: Body };

/** Articles, du plus récent au plus ancien. */
export const articles: Article[] = articleIndex
  .map((meta) => ({ ...meta, body: bodies[meta.slug]! }))
  .sort((a, b) => b.date.localeCompare(a.date));

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null;
}
