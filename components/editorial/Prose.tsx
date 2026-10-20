import { anchorId, type Block } from "@/lib/editorial/types";

/** Corps de texte éditorial : colonne de lecture d'environ 65 signes. */
export function Prose({ blocks, className = "" }: { blocks: Block[]; className?: string }) {
  return (
    <div className={`max-w-[65ch] ${className}`}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return (
              <h2 key={i} id={anchorId(block.text)} className="mt-16 mb-6 text-titre-3 first:mt-0">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="surtitre mt-10 mb-3 font-sans text-encre-douce">
                {block.text}
              </h3>
            );
          case "quote":
            return (
              <figure key={i} className="my-12 border-l border-accent pl-6 sm:pl-10">
                <blockquote className="font-display text-chapeau italic">{block.text}</blockquote>
                {block.cite && (
                  <figcaption className="surtitre mt-4 text-encre-douce">{block.cite}</figcaption>
                )}
              </figure>
            );
          case "list":
            return (
              <ul key={i} className="my-6 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden="true" className="mt-[0.85em] h-px w-4 shrink-0 bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} className="mt-6 first:mt-0">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
