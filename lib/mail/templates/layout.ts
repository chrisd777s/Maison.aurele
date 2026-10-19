import { mailTheme as c } from "../theme";

/** Échappe le texte saisi par un visiteur avant de l'insérer dans le HTML. */
export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const serif = "'Cormorant Garamond', Garamond, 'Times New Roman', serif";
const sans = "Jost, 'Helvetica Neue', Arial, sans-serif";

/** Tableau de détails : libellé en petites capitales, valeur en dessous. */
export function detailRows(rows: [label: string, value: string][]) {
  return rows
    .map(
      ([label, value]) => `<tr><td style="padding:14px 0;border-bottom:1px solid ${c.filet};">
<div style="font-family:${sans};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${c.pierreEncre};">${escapeHtml(label)}</div>
<div style="font-family:${serif};font-size:19px;line-height:1.4;color:${c.onyx};padding-top:4px;">${escapeHtml(value)}</div>
</td></tr>`,
    )
    .join("");
}

export const paragraph = (html: string) =>
  `<p style="margin:0 0 18px;font-family:${sans};font-size:15px;line-height:1.7;color:${c.onyx};">${html}</p>`;

export const note = (html: string) =>
  `<p style="margin:0 0 12px;font-family:${sans};font-size:12px;line-height:1.6;color:${c.pierreEncre};">${html}</p>`;

/**
 * Gabarit commun : tableaux et styles en ligne (seule mise en page fiable dans
 * les messageries), 600 px de large, lisible en mode sombre.
 */
export function emailLayout({
  lang,
  preheader,
  eyebrow,
  title,
  body,
  footer,
}: {
  lang: string;
  preheader: string;
  eyebrow: string;
  title: string;
  body: string;
  footer: string;
}) {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${c.nacre};">
<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.nacre};">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${c.ivoire};">
<tr><td align="center" style="padding:44px 40px 28px;border-bottom:1px solid ${c.filet};">
<div style="font-family:${serif};font-size:22px;letter-spacing:0.32em;color:${c.onyx};">MAISON AURÈLE</div>
<div style="font-family:${serif};font-style:italic;font-size:15px;color:${c.champagneEncre};padding-top:6px;">La lumière, captive.</div>
</td></tr>
<tr><td style="padding:40px 40px 8px;">
<div style="font-family:${sans};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${c.champagneEncre};">${escapeHtml(eyebrow)}</div>
<h1 style="margin:12px 0 24px;font-family:${serif};font-weight:300;font-size:34px;line-height:1.15;color:${c.onyx};">${escapeHtml(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:24px 40px 40px;border-top:1px solid ${c.filet};">${footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
