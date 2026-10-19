import type { SVGProps } from "react";

type IconName = "menu" | "close" | "ecrin" | "arrow" | "chevron";

const paths: Record<IconName, string> = {
  menu: "M3 9h18M3 15h18",
  close: "M5 5l14 14M19 5L5 19",
  // Pierre facettée : couronne, rondiste, pavillon
  ecrin: "M7 4.5h10l4 4.5-9 11-9-11zM3 9h18M9.5 4.5 12 9l2.5-4.5M12 20 8.5 9M12 20l3.5-11",
  arrow: "M3 12h17M14 6l6 6-6 6",
  chevron: "M6 9l6 6 6-6",
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
