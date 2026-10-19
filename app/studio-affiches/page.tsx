import { notFound } from "next/navigation";
import { products } from "@/data/products";

/** Liste des affiches à produire, lue par le script de rendu. */
export default function PosterIndex() {
  if (process.env.POSTER_STUDIO !== "1") notFound();
  return (
    <ul>
      {products.flatMap((p) =>
        p.metals.map((m) => (
          <li key={`${p.slug}-${m.id}`}>
            <a href={`/studio-affiches/${p.slug}/${m.id}`} data-affiche={`${p.slug}--${m.id}`}>
              {p.slug} · {m.id}
            </a>
          </li>
        )),
      )}
    </ul>
  );
}
