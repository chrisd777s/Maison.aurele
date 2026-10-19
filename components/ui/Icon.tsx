import type { SVGProps } from "react";

type IconName =
  "menu" | "close" | "ecrin" | "arrow" | "chevron" | "loupe" | "sac" | "plus" | "moins" | "partage";

const paths: Record<IconName, string> = {
  menu: "M3 9h18M3 15h18",
  close: "M5 5l14 14M19 5L5 19",
  // Pierre facettée : couronne, rondiste, pavillon
  ecrin: "M7 4.5h10l4 4.5-9 11-9-11zM3 9h18M9.5 4.5 12 9l2.5-4.5M12 20 8.5 9M12 20l3.5-11",
  arrow: "M3 12h17M14 6l6 6-6 6",
  chevron: "M6 9l6 6 6-6",
  loupe: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.2 15.2 21 21",
  // Sac de boutique à anses
  sac: "M5 8h14l-1.2 12.5H6.2zM9 10.5V6.5a3 3 0 0 1 6 0v4",
  plus: "M12 6v12M6 12h12",
  moins: "M6 12h12",
  partage: "M12 15V3.5M8 7.5l4-4 4 4M6 11H5v9.5h14V11h-1",
};

/** Pictogrammes au trait fin (1 px), décoratifs : le libellé est porté par le parent. */
export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
