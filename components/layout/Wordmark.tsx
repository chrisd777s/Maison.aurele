/** Logotype typographique : capitales espacées, point de lumière champagne sur le È. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-[1.0625rem] leading-none font-normal tracking-marque uppercase sm:text-[1.25rem] ${className}`}
    >
      Maison Aur
      <span className="relative">
        è
        <span
          aria-hidden="true"
          className="absolute -top-[0.28em] left-1/2 size-[3px] -translate-x-1/2 rounded-full bg-accent"
        />
      </span>
      le
    </span>
  );
}
