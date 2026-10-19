import { Fragment, type CSSProperties } from "react";

/**
 * Texte révélé lettre par lettre (CSS pur, aucun JS).
 * Le texte entier est lu une seule fois par les lecteurs d'écran ; les lettres sont masquées.
 */
export function SplitLetters({ text }: { text: string }) {
  let index = 0;
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={w}>
            {/* L'espace reste hors du bloc du mot, sinon il est absorbé. */}
            {w > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char) => {
                const i = index++;
                return (
                  <span key={i} className="lettre" style={{ "--i": i } as CSSProperties}>
                    {char}
                  </span>
                );
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}
