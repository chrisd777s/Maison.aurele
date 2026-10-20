import type { Localized } from "@/lib/commerce/types";
import type { Body } from "@/lib/editorial/types";

/**
 * Pages légales. Maison Aurèle est une marque fictive : raison sociale, numéros
 * d'immatriculation et adresses sont des valeurs de démonstration, à remplacer et à
 * faire relire par un conseiller juridique avant toute mise en ligne (voir README).
 * Les textes décrivent le fonctionnement réel du site : stockage local sans traceur,
 * paiement par Stripe, courriels par Resend.
 */

export type LegalSlug = "mentions" | "confidentialite" | "conditions" | "retours" | "garantie";

export type LegalPage = {
  /** Date de dernière mise à jour (AAAA-MM-JJ). */
  updated: string;
  title: Localized;
  intro: Localized;
  body: Body;
};

const mentions: LegalPage = {
  updated: "2026-10-01",
  title: { fr: "Mentions légales", en: "Legal notice" },
  intro: {
    fr: "Informations sur l’éditeur et l’hébergeur du site, conformément aux lois du Québec et de la France.",
    en: "Information about the publisher and host of this website, in accordance with the laws of Québec and France.",
  },
  body: {
    fr: [
      { kind: "h2", text: "Éditeur" },
      {
        kind: "list",
        items: [
          "Maison Aurèle inc., société par actions constituée en vertu de la Loi sur les sociétés par actions du Québec.",
          "Numéro d’entreprise du Québec (NEQ) : 1179 8421 06.",
          "Siège et atelier : rue Saint-Paul Ouest, Vieux-Montréal (Québec), Canada.",
          "Établissement en France : Maison Aurèle Paris SAS, salon privé rue de la Paix, 75002 Paris. RCS Paris 912 384 506, TVA intracommunautaire FR 47 912 384 506.",
          "Courriel : salon@maison-aurele.example.",
        ],
      },
      { kind: "h2", text: "Direction de la publication" },
      {
        kind: "p",
        text: "Hélène Aurèle, présidente et fondatrice, est directrice de la publication. Elle est aussi la personne responsable de la protection des renseignements personnels (voir la politique de confidentialité).",
      },
      { kind: "h2", text: "Hébergement" },
      {
        kind: "p",
        text: "Le site est hébergé par Vercel Inc., San Francisco (Californie), États-Unis, sur des serveurs répartis en Amérique du Nord et en Europe.",
      },
      { kind: "h2", text: "Propriété intellectuelle" },
      {
        kind: "p",
        text: "Les dessins des pièces, les textes, les illustrations et les rendus en trois dimensions présentés sur ce site sont la propriété de Maison Aurèle. Toute reproduction, même partielle, est soumise à notre autorisation écrite préalable. Les noms des collections Aube, Marée et Obsidienne sont des marques de la Maison.",
      },
      {
        kind: "p",
        text: "Les caractères Cormorant Garamond et Jost sont utilisés sous licence SIL Open Font License 1.1.",
      },
      { kind: "h2", text: "Photographies et rendus" },
      {
        kind: "p",
        text: "Les visuels des pièces sont des rendus numériques fidèles aux dessins d’atelier. Les couleurs peuvent varier légèrement selon l’écran. Une pièce vue en salon, à la lumière du jour, fait toujours foi.",
      },
      { kind: "h2", text: "Nous joindre" },
      {
        kind: "p",
        text: "Pour toute question relative au site, écrivez-nous à salon@maison-aurele.example. Nous répondons sous deux jours ouvrables.",
      },
    ],
    en: [
      { kind: "h2", text: "Publisher" },
      {
        kind: "list",
        items: [
          "Maison Aurèle inc., a joint-stock company incorporated under the Québec Business Corporations Act.",
          "Québec enterprise number (NEQ): 1179 8421 06.",
          "Head office and atelier: rue Saint-Paul Ouest, Old Montréal (Québec), Canada.",
          "French establishment: Maison Aurèle Paris SAS, private salon on rue de la Paix, 75002 Paris. Paris Trade Register 912 384 506, EU VAT FR 47 912 384 506.",
          "Email: salon@maison-aurele.example.",
        ],
      },
      { kind: "h2", text: "Publication director" },
      {
        kind: "p",
        text: "Hélène Aurèle, president and founder, is the director of publication. She is also the person in charge of the protection of personal information (see the privacy policy).",
      },
      { kind: "h2", text: "Hosting" },
      {
        kind: "p",
        text: "This website is hosted by Vercel Inc., San Francisco (California), United States, on servers located in North America and Europe.",
      },
      { kind: "h2", text: "Intellectual property" },
      {
        kind: "p",
        text: "The designs of the pieces, the texts, illustrations and three-dimensional renderings on this website are the property of Maison Aurèle. Any reproduction, even partial, requires our prior written consent. The collection names Aube, Marée and Obsidienne are trademarks of the Maison.",
      },
      {
        kind: "p",
        text: "The Cormorant Garamond and Jost typefaces are used under the SIL Open Font License 1.1.",
      },
      { kind: "h2", text: "Photographs and renderings" },
      {
        kind: "p",
        text: "The images of the pieces are digital renderings faithful to the atelier drawings. Colours may vary slightly from one screen to another. A piece seen at the salon, in daylight, always prevails.",
      },
      { kind: "h2", text: "Contact" },
      {
        kind: "p",
        text: "For any question about this website, write to salon@maison-aurele.example. We reply within two business days.",
      },
    ],
  },
};

const confidentialite: LegalPage = {
  updated: "2026-10-01",
  title: { fr: "Politique de confidentialité", en: "Privacy policy" },
  intro: {
    fr: "Nous recueillons le moins de renseignements possible, seulement pour vous servir, et nous ne les vendons jamais. Cette politique répond à la Loi 25 du Québec et au Règlement général sur la protection des données (RGPD) de l’Union européenne.",
    en: "We collect as little information as possible, only to serve you, and we never sell it. This policy complies with Québec’s Law 25 and the European Union’s General Data Protection Regulation (GDPR).",
  },
  body: {
    fr: [
      { kind: "h2", text: "Personne responsable" },
      {
        kind: "p",
        text: "La personne responsable de la protection des renseignements personnels est Hélène Aurèle, présidente de Maison Aurèle inc. Vous pouvez la joindre à confidentialite@maison-aurele.example ou par courrier à l’atelier, rue Saint-Paul Ouest, Montréal. Pour nos clients de l’Union européenne, Maison Aurèle Paris SAS est responsable conjointe du traitement.",
      },
      { kind: "h2", text: "Ce que nous recueillons, et pourquoi" },
      { kind: "h3", text: "Demande de rendez-vous" },
      {
        kind: "p",
        text: "Prénom, nom, courriel, téléphone si vous le donnez, lieu et créneau choisis, intention, pièce ou création consultée et message. Ces renseignements servent uniquement à préparer et confirmer votre rendez-vous. Base légale (RGPD) : votre consentement et les mesures précontractuelles prises à votre demande.",
      },
      { kind: "h3", text: "Commande" },
      {
        kind: "p",
        text: "Nom, adresse de livraison, courriel, téléphone et détail de la commande. Le paiement est traité par Stripe : vos données de carte ne transitent jamais par nos serveurs et nous n’y avons pas accès. Base légale : l’exécution du contrat et nos obligations comptables.",
      },
      { kind: "h3", text: "Correspondance" },
      {
        kind: "p",
        text: "Les échanges que vous avez avec nous par courriel, pour assurer le suivi de votre demande.",
      },
      { kind: "h2", text: "Aucun traceur, aucune bannière" },
      {
        kind: "p",
        text: "Ce site n’utilise ni témoin (cookie) publicitaire, ni outil de mesure d’audience, ni pixel de réseau social. C’est pourquoi aucune bannière ne vous demande votre consentement à l’arrivée.",
      },
      {
        kind: "p",
        text: "Votre navigateur conserve localement, sans jamais nous les transmettre, votre panier, votre Écrin, la devise d’affichage, le mode jour ou nuit et le calibrage du guide des tailles. Ces données restent sur votre appareil ; vous pouvez les effacer à tout moment depuis les réglages de votre navigateur. Lors du paiement, la page sécurisée de Stripe dépose ses propres témoins, nécessaires à la prévention de la fraude.",
      },
      { kind: "h2", text: "Liens de partage de l’Écrin" },
      {
        kind: "p",
        text: "Le lien que vous créez pour partager votre Écrin contient la liste des pièces, codée dans l’adresse elle-même. Nous n’en conservons aucune copie. Toute personne qui reçoit le lien peut voir cette sélection, sans votre nom ni vos coordonnées.",
      },
      { kind: "h2", text: "Qui y a accès" },
      {
        kind: "p",
        text: "Seules les personnes de la Maison qui en ont besoin pour vous servir : l’équipe du salon concerné et l’atelier. Nous faisons appel à quelques prestataires, liés par contrat et tenus aux mêmes exigences :",
      },
      {
        kind: "list",
        items: [
          "Stripe (États-Unis et Irlande) : paiement en ligne.",
          "Resend (États-Unis) : envoi des courriels de confirmation.",
          "Vercel (États-Unis) : hébergement du site.",
        ],
      },
      {
        kind: "p",
        text: "Ces prestataires peuvent traiter vos renseignements hors du Québec et de l’Union européenne. Avant de leur confier quoi que ce soit, nous avons évalué les facteurs relatifs à la vie privée, comme l’exige la Loi 25, et encadré les transferts par les clauses contractuelles types de la Commission européenne ou le cadre de protection des données UE–États-Unis.",
      },
      { kind: "h2", text: "Durée de conservation" },
      {
        kind: "list",
        items: [
          "Demandes de rendez-vous : vingt-quatre mois après le dernier contact.",
          "Commandes et factures : six ans au Canada, dix ans en France, comme l’exigent les lois fiscales.",
          "Correspondance : trois ans après le dernier échange.",
        ],
      },
      { kind: "h2", text: "Vos droits" },
      {
        kind: "p",
        text: "Vous pouvez à tout moment demander l’accès à vos renseignements, leur rectification, leur suppression ou leur portabilité dans un format technologique structuré, retirer votre consentement, vous opposer à un traitement ou en demander la limitation. Écrivez à confidentialite@maison-aurele.example : nous répondons dans un délai de trente jours.",
      },
      {
        kind: "p",
        text: "Si notre réponse ne vous satisfait pas, vous pouvez vous adresser à la Commission d’accès à l’information du Québec ou, dans l’Union européenne, à la Commission nationale de l’informatique et des libertés (CNIL) ou à l’autorité de votre pays.",
      },
      { kind: "h2", text: "Sécurité et incidents" },
      {
        kind: "p",
        text: "Le site est servi exclusivement en HTTPS et les accès internes sont limités et journalisés. En cas d’incident de confidentialité présentant un risque de préjudice sérieux, nous en avisons sans délai la Commission d’accès à l’information, les autorités européennes compétentes et les personnes concernées, et nous le consignons dans notre registre des incidents.",
      },
      { kind: "h2", text: "Mineurs" },
      {
        kind: "p",
        text: "Ce site ne s’adresse pas aux personnes de moins de quatorze ans, dont nous ne recueillons pas sciemment les renseignements.",
      },
      { kind: "h2", text: "Modifications" },
      {
        kind: "p",
        text: "Nous mettrons cette politique à jour si nos pratiques changent. La date de dernière mise à jour figure en tête de page ; tout changement important vous sera signalé sur le site.",
      },
    ],
    en: [
      { kind: "h2", text: "Person in charge" },
      {
        kind: "p",
        text: "The person in charge of the protection of personal information is Hélène Aurèle, president of Maison Aurèle inc. You can reach her at confidentialite@maison-aurele.example or by post at the atelier, rue Saint-Paul Ouest, Montréal. For our customers in the European Union, Maison Aurèle Paris SAS acts as joint controller.",
      },
      { kind: "h2", text: "What we collect, and why" },
      { kind: "h3", text: "Appointment requests" },
      {
        kind: "p",
        text: "First name, last name, email, telephone if you provide it, chosen place and time, purpose of the visit, piece or creation viewed, and your message. This information is used solely to prepare and confirm your appointment. Legal basis (GDPR): your consent and pre-contractual steps taken at your request.",
      },
      { kind: "h3", text: "Orders" },
      {
        kind: "p",
        text: "Name, delivery address, email, telephone and order details. Payment is processed by Stripe: your card details never pass through our servers and we have no access to them. Legal basis: performance of the contract and our accounting obligations.",
      },
      { kind: "h3", text: "Correspondence" },
      {
        kind: "p",
        text: "The emails you exchange with us, so that we can follow up on your request.",
      },
      { kind: "h2", text: "No trackers, no banner" },
      {
        kind: "p",
        text: "This website uses no advertising cookies, no audience measurement tool and no social media pixel. That is why no banner asks for your consent when you arrive.",
      },
      {
        kind: "p",
        text: "Your browser stores locally, without ever sending them to us, your cart, your Écrin, the display currency, day or night mode and the calibration of the size guide. This data stays on your device; you can clear it at any time from your browser settings. At checkout, Stripe’s secure page sets its own cookies, which are needed to prevent fraud.",
      },
      { kind: "h2", text: "Écrin share links" },
      {
        kind: "p",
        text: "The link you create to share your Écrin contains the list of pieces, encoded in the address itself. We keep no copy of it. Anyone who receives the link can see the selection, without your name or contact details.",
      },
      { kind: "h2", text: "Who has access" },
      {
        kind: "p",
        text: "Only the people at the Maison who need it to serve you: the team at the relevant salon and the atelier. We rely on a few service providers, bound by contract to the same standards:",
      },
      {
        kind: "list",
        items: [
          "Stripe (United States and Ireland): online payment.",
          "Resend (United States): sending confirmation emails.",
          "Vercel (United States): website hosting.",
        ],
      },
      {
        kind: "p",
        text: "These providers may process your information outside Québec and the European Union. Before entrusting them with anything, we carried out a privacy impact assessment as required by Law 25, and framed the transfers with the European Commission’s standard contractual clauses or the EU–US Data Privacy Framework.",
      },
      { kind: "h2", text: "Retention" },
      {
        kind: "list",
        items: [
          "Appointment requests: twenty-four months after the last contact.",
          "Orders and invoices: six years in Canada, ten years in France, as tax laws require.",
          "Correspondence: three years after the last exchange.",
        ],
      },
      { kind: "h2", text: "Your rights" },
      {
        kind: "p",
        text: "You may at any time request access to your information, its correction, deletion or portability in a structured technological format, withdraw your consent, object to processing or ask for it to be restricted. Write to confidentialite@maison-aurele.example: we reply within thirty days.",
      },
      {
        kind: "p",
        text: "If our answer does not satisfy you, you may contact the Commission d’accès à l’information du Québec or, in the European Union, the French data protection authority (CNIL) or the authority of your own country.",
      },
      { kind: "h2", text: "Security and incidents" },
      {
        kind: "p",
        text: "The website is served exclusively over HTTPS, and internal access is restricted and logged. Should a confidentiality incident present a risk of serious injury, we promptly notify the Commission d’accès à l’information, the competent European authorities and the people concerned, and record it in our incident register.",
      },
      { kind: "h2", text: "Minors" },
      {
        kind: "p",
        text: "This website is not intended for people under fourteen, whose information we do not knowingly collect.",
      },
      { kind: "h2", text: "Changes" },
      {
        kind: "p",
        text: "We will update this policy if our practices change. The date of the last update appears at the top of the page; any significant change will be announced on the website.",
      },
    ],
  },
};

const conditions: LegalPage = {
  updated: "2026-10-01",
  title: { fr: "Conditions générales de vente", en: "Terms of sale" },
  intro: {
    fr: "Ces conditions s’appliquent aux commandes passées sur ce site. Elles s’ajoutent aux droits que vous tenez de la loi de votre pays, sans jamais les réduire.",
    en: "These terms apply to orders placed on this website. They add to the rights you hold under the law of your country, and never reduce them.",
  },
  body: {
    fr: [
      { kind: "h2", text: "Le vendeur" },
      {
        kind: "p",
        text: "Les pièces sont vendues par Maison Aurèle inc., Montréal, et, pour les livraisons dans l’Union européenne ou le retrait au salon de Paris, par Maison Aurèle Paris SAS. Leurs coordonnées complètes figurent dans les mentions légales.",
      },
      { kind: "h2", text: "Les pièces" },
      {
        kind: "p",
        text: "Chaque fiche décrit la pièce, ses pierres et leurs caractéristiques gemmologiques, son métal et son délai de fabrication. Les pierres principales sont accompagnées d’un certificat d’un laboratoire indépendant, et chaque pièce d’un code de provenance. Les pierres naturelles et les perles étant uniques, de légères variations de teinte ou de dimension par rapport aux visuels sont possibles ; elles n’affectent jamais les caractéristiques annoncées.",
      },
      { kind: "h2", text: "Prix et devises" },
      {
        kind: "p",
        text: "Les prix sont indiqués et facturés en dollars canadiens, hors taxes. Les montants en dollars américains ou en euros sont donnés à titre indicatif, à un taux daté ; votre banque peut appliquer un taux différent. Les taxes applicables à votre adresse de livraison (TPS et TVQ ou TVH au Canada, taxes et droits à l’importation ailleurs) sont calculées et affichées avant la validation du paiement.",
      },
      { kind: "h2", text: "Commande et acompte" },
      {
        kind: "p",
        text: "La commande est conclue lorsque le paiement est accepté ; un courriel de confirmation vous est alors envoyé. Pour une pièce de 15 000 $ ou plus, seule une somme de 30 % est prélevée à la commande, à titre d’acompte : elle réserve la pierre et lance la fabrication. Le solde est réglé avant la remise, après que nous vous avons confirmé que la pièce est prête.",
      },
      { kind: "h2", text: "Paiement" },
      {
        kind: "p",
        text: "Le paiement s’effectue par carte sur la page sécurisée de Stripe. Maison Aurèle n’a jamais accès à vos données de carte. Un virement bancaire est possible pour les pièces réservées en salon.",
      },
      { kind: "h2", text: "Fabrication et livraison" },
      {
        kind: "p",
        text: "Les pièces disponibles sont expédiées sous deux jours ouvrables ; les autres sont façonnées dans le délai indiqué sur leur fiche, que nous vous confirmons après la commande. La livraison est assurée, offerte, et remise en main propre contre signature. Vous pouvez aussi retirer votre pièce à l’atelier de Montréal ou au salon de Paris. Les risques vous sont transférés à la remise ; la propriété, au paiement complet du prix.",
      },
      { kind: "h2", text: "Retours, garantie et garanties légales" },
      {
        kind: "p",
        text: "Vous disposez de trente jours après la remise pour nous retourner une pièce, selon notre politique de retours. Toutes nos pièces bénéficient de notre garantie à vie. Ces engagements s’ajoutent à la garantie légale de qualité prévue par la Loi sur la protection du consommateur du Québec et, pour l’Union européenne, à la garantie légale de conformité de deux ans et à la garantie des vices cachés.",
      },
      { kind: "h2", text: "Droit applicable et litiges" },
      {
        kind: "p",
        text: "Ces conditions sont régies par les lois du Québec. Si vous résidez dans l’Union européenne, vous conservez la protection des dispositions impératives de la loi de votre pays. En cas de désaccord, écrivez-nous d’abord : nous cherchons toujours une solution amiable. Les consommateurs européens peuvent aussi recourir gratuitement à un médiateur de la consommation, dont nous communiquons les coordonnées sur simple demande, ou à la plateforme européenne de règlement des litiges.",
      },
    ],
    en: [
      { kind: "h2", text: "The seller" },
      {
        kind: "p",
        text: "Pieces are sold by Maison Aurèle inc., Montréal, and, for deliveries within the European Union or collection at the Paris salon, by Maison Aurèle Paris SAS. Their full details appear in the legal notice.",
      },
      { kind: "h2", text: "The pieces" },
      {
        kind: "p",
        text: "Each product page describes the piece, its stones and their gemmological characteristics, its metal and its making time. Principal stones come with a certificate from an independent laboratory, and every piece with a provenance code. As natural stones and pearls are unique, slight variations in shade or size compared with the images are possible; they never affect the stated characteristics.",
      },
      { kind: "h2", text: "Prices and currencies" },
      {
        kind: "p",
        text: "Prices are shown and charged in Canadian dollars, excluding taxes. Amounts in US dollars or euros are indicative, at a dated rate; your bank may apply a different rate. Taxes applicable to your delivery address (GST and QST or HST in Canada, import taxes and duties elsewhere) are calculated and shown before you confirm payment.",
      },
      { kind: "h2", text: "Orders and deposits" },
      {
        kind: "p",
        text: "The order is concluded once payment is accepted; a confirmation email is then sent to you. For a piece of $15,000 or more, only 30% is charged at the time of order, as a deposit: it reserves the stone and starts the making. The balance is paid before handover, once we have confirmed the piece is ready.",
      },
      { kind: "h2", text: "Payment" },
      {
        kind: "p",
        text: "Payment is made by card on Stripe’s secure page. Maison Aurèle never has access to your card details. Bank transfer is available for pieces reserved at the salon.",
      },
      { kind: "h2", text: "Making and delivery" },
      {
        kind: "p",
        text: "Pieces in stock are shipped within two business days; others are made within the time shown on their page, which we confirm after your order. Delivery is insured, free of charge, and handed over in person against signature. You may also collect your piece at the Montréal atelier or the Paris salon. Risk passes to you on delivery; ownership, on payment in full.",
      },
      { kind: "h2", text: "Returns, warranty and legal guarantees" },
      {
        kind: "p",
        text: "You have thirty days after delivery to return a piece, under our returns policy. All our pieces are covered by our lifetime warranty. These commitments add to the legal warranty of quality under Québec’s Consumer Protection Act and, in the European Union, to the two-year legal guarantee of conformity and the guarantee against hidden defects.",
      },
      { kind: "h2", text: "Governing law and disputes" },
      {
        kind: "p",
        text: "These terms are governed by the laws of Québec. If you live in the European Union, you keep the protection of the mandatory provisions of the law of your country. In case of disagreement, please write to us first: we always seek an amicable solution. European consumers may also turn, free of charge, to a consumer mediator, whose details we provide on request, or to the European online dispute resolution platform.",
      },
    ],
  },
};

const retours: LegalPage = {
  updated: "2026-10-01",
  title: { fr: "Retours et échanges", en: "Returns and exchanges" },
  intro: {
    fr: "Une pièce doit vous ressembler. Si ce n’est pas le cas, vous disposez de trente jours pour nous la retourner, sans avoir à vous justifier.",
    en: "A piece should feel like yours. If it does not, you have thirty days to return it, with no need to explain why.",
  },
  body: {
    fr: [
      { kind: "h2", text: "Trente jours" },
      {
        kind: "p",
        text: "Vous pouvez retourner toute pièce de nos collections dans les trente jours suivant sa remise, y compris une pièce fabriquée à votre taille. Ce délai est plus long que le délai légal de rétractation de quatorze jours en vigueur dans l’Union européenne, qu’il inclut.",
      },
      { kind: "h2", text: "Comment faire" },
      {
        kind: "list",
        items: [
          "Écrivez-nous à salon@maison-aurele.example en indiquant votre référence de commande.",
          "Nous vous faisons parvenir un emballage et une étiquette de transport assurés, à nos frais.",
          "Vous pouvez aussi rapporter la pièce à l’atelier de Montréal ou au salon de Paris.",
        ],
      },
      { kind: "h2", text: "État de la pièce" },
      {
        kind: "p",
        text: "La pièce doit nous revenir non portée, dans son écrin, avec son certificat et sa carte de provenance. À réception, l’atelier l’examine sous la loupe ; nous vous confirmons le remboursement dans les deux jours ouvrables qui suivent.",
      },
      { kind: "h2", text: "Remboursement" },
      {
        kind: "p",
        text: "Le remboursement, acompte compris, est effectué sur le moyen de paiement utilisé, dans un délai de quatorze jours après la réception de la pièce. Il porte sur la totalité des sommes versées, livraison comprise.",
      },
      { kind: "h2", text: "Exceptions" },
      {
        kind: "p",
        text: "Les créations sur mesure dessinées pour vous, notamment celles composées avec L’Atelier, ainsi que les pièces gravées à votre demande, ne peuvent être reprises, sauf défaut. Cette exception est prévue par la loi pour les biens nettement personnalisés.",
      },
      { kind: "h2", text: "Échanges et ajustements de taille" },
      {
        kind: "p",
        text: "Une bague trop grande ou trop petite ? Nous l’ajustons gratuitement une fois dans l’année qui suit l’achat, à l’atelier ou au salon de Paris, généralement en moins d’une semaine. Vous pouvez aussi échanger une pièce contre une autre de nos collections dans le délai de trente jours ; la différence de prix est alors réglée ou remboursée.",
      },
    ],
    en: [
      { kind: "h2", text: "Thirty days" },
      {
        kind: "p",
        text: "You may return any piece from our collections within thirty days of delivery, including a piece made in your size. This period is longer than the fourteen-day legal withdrawal period in force in the European Union, which it includes.",
      },
      { kind: "h2", text: "How to return" },
      {
        kind: "list",
        items: [
          "Write to salon@maison-aurele.example with your order reference.",
          "We send you insured packaging and a shipping label, at our expense.",
          "You may also bring the piece back to the Montréal atelier or the Paris salon.",
        ],
      },
      { kind: "h2", text: "Condition of the piece" },
      {
        kind: "p",
        text: "The piece must come back unworn, in its box, with its certificate and provenance card. On receipt, the atelier examines it under the loupe; we confirm your refund within the following two business days.",
      },
      { kind: "h2", text: "Refund" },
      {
        kind: "p",
        text: "The refund, including any deposit, is made to the original means of payment within fourteen days of receiving the piece. It covers all sums paid, delivery included.",
      },
      { kind: "h2", text: "Exceptions" },
      {
        kind: "p",
        text: "Bespoke creations designed for you, including those composed with L’Atelier, and pieces engraved at your request cannot be returned, except in case of defect. The law provides for this exception for clearly personalised goods.",
      },
      { kind: "h2", text: "Exchanges and resizing" },
      {
        kind: "p",
        text: "A ring too large or too small? We resize it free of charge once in the year following purchase, at the atelier or the Paris salon, usually in less than a week. You may also exchange a piece for another from our collections within the thirty-day period; the price difference is then paid or refunded.",
      },
    ],
  },
};

const garantie: LegalPage = {
  updated: "2026-10-01",
  title: { fr: "Garantie à vie", en: "Lifetime warranty" },
  intro: {
    fr: "Une pièce de la Maison est faite pour durer plus longtemps que nous. Nous nous engageons à l’entretenir tant qu’elle existe.",
    en: "A piece from the Maison is made to outlast us. We commit to caring for it for as long as it exists.",
  },
  body: {
    fr: [
      { kind: "h2", text: "Ce que couvre la garantie" },
      {
        kind: "p",
        text: "Tout défaut de fabrication, sans limite de durée : porosité de fonte, soudure, sertissage défaillant, fermoir qui cède sans choc. Nous réparons la pièce ou, si cela n’est pas possible, la refaisons à l’identique, à nos frais, transport assuré compris.",
      },
      { kind: "h2", text: "Ce qu’elle inclut, chaque année" },
      {
        kind: "list",
        items: [
          "Un contrôle complet sous la loupe : griffes, sertis, fermoirs, anneaux.",
          "Le resserrage des pierres et le remplacement des griffes usées.",
          "Un nettoyage professionnel adapté à chaque matière.",
          "Le rhodiage de l’or blanc et de l’or noir lorsque la couleur s’est estompée.",
          "Le renfilage sur soie des rangs de perles.",
        ],
      },
      { kind: "h2", text: "Ce qu’elle ne couvre pas" },
      {
        kind: "p",
        text: "L’usure normale (rayures, patine), les dommages accidentels (choc, écrasement), la perte et le vol, ainsi que les pièces modifiées ou réparées par un autre atelier. Une pierre perdue n’est remplacée au titre de la garantie que si la pièce a été contrôlée par nos soins au cours des vingt-quatre mois précédents. Pour les dommages accidentels, nous établissons volontiers un devis et un certificat d’expertise pour votre assureur.",
      },
      { kind: "h2", text: "Une garantie qui se transmet" },
      {
        kind: "p",
        text: "La garantie est attachée à la pièce, non à son premier propriétaire. Elle suit le bijou lorsqu’il est offert ou transmis : le code de provenance inscrit sur l’écrin suffit à l’identifier.",
      },
      { kind: "h2", text: "Comment en bénéficier" },
      {
        kind: "p",
        text: "Prenez rendez-vous à l’atelier de Montréal ou au salon de Paris, ou écrivez-nous à salon@maison-aurele.example : nous vous adressons un emballage assuré. La plupart des interventions sont faites en moins de deux semaines.",
      },
      { kind: "h2", text: "Vos garanties légales" },
      {
        kind: "p",
        text: "Cette garantie commerciale s’ajoute aux garanties légales, qu’elle ne remplace pas : la garantie de qualité et de durabilité prévue par la Loi sur la protection du consommateur du Québec et, dans l’Union européenne, la garantie légale de conformité de deux ans et la garantie des vices cachés.",
      },
    ],
    en: [
      { kind: "h2", text: "What the warranty covers" },
      {
        kind: "p",
        text: "Any manufacturing defect, with no time limit: casting porosity, soldering, faulty setting, a clasp that gives way without impact. We repair the piece or, if that is not possible, remake it identically, at our expense, insured shipping included.",
      },
      { kind: "h2", text: "What it includes, every year" },
      {
        kind: "list",
        items: [
          "A full inspection under the loupe: prongs, settings, clasps, bands.",
          "Tightening of stones and replacement of worn prongs.",
          "Professional cleaning suited to each material.",
          "Rhodium plating of white and black gold when the colour has faded.",
          "Restringing of pearl strands on silk.",
        ],
      },
      { kind: "h2", text: "What it does not cover" },
      {
        kind: "p",
        text: "Normal wear (scratches, patina), accidental damage (impact, crushing), loss and theft, and pieces altered or repaired by another workshop. A lost stone is replaced under the warranty only if the piece was inspected by us within the previous twenty-four months. For accidental damage, we will gladly provide a quote and a valuation certificate for your insurer.",
      },
      { kind: "h2", text: "A warranty that is passed on" },
      {
        kind: "p",
        text: "The warranty belongs to the piece, not to its first owner. It follows the jewel when it is given or handed down: the provenance code printed on the box is enough to identify it.",
      },
      { kind: "h2", text: "How to use it" },
      {
        kind: "p",
        text: "Book an appointment at the Montréal atelier or the Paris salon, or write to salon@maison-aurele.example: we will send you insured packaging. Most services are completed in under two weeks.",
      },
      { kind: "h2", text: "Your legal guarantees" },
      {
        kind: "p",
        text: "This commercial warranty adds to the legal guarantees and does not replace them: the warranty of quality and durability under Québec’s Consumer Protection Act and, in the European Union, the two-year legal guarantee of conformity and the guarantee against hidden defects.",
      },
    ],
  },
};

export const legalPages: Record<LegalSlug, LegalPage> = {
  mentions,
  confidentialite,
  conditions,
  retours,
  garantie,
};
