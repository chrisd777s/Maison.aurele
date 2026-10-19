"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

const ZOOM = 4;
const LENS = 176;

type Point = { x: number; y: number };

/**
 * Loupe de joaillier : un cercle qui grossit 4× l'image sous le curseur ou le doigt.
 * Souris : au survol. Tactile : après activation (le défilement est alors suspendu
 * sur l'image). Clavier : flèches pour déplacer, Échap pour sortir.
 */
export function Loupe({
  children,
  label,
  hint,
}: {
  children: ReactNode;
  label: string;
  hint: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<Point | null>(null);
  const [touchMode, setTouchMode] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [touching, setTouching] = useState(false);

  function locate(event: PointerEvent<HTMLDivElement>) {
    const rect = stage.current?.getBoundingClientRect();
    if (!rect) return;
    setSize({ w: rect.width, h: rect.height });
    setPoint({
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    });
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || event.pointerType === "pen" || touching) locate(event);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch" || !touchMode) return;
    setTouching(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    locate(event);
  }

  function release() {
    setTouching(false);
    setPoint(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = 0.04;
    const moves: Record<string, Point> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    if (event.key === "Escape") return setPoint(null);
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const rect = stage.current?.getBoundingClientRect();
    if (rect) setSize({ w: rect.width, h: rect.height });
    setPoint((p) => {
      const from = p ?? { x: 0.5, y: 0.5 };
      return {
        x: Math.min(1, Math.max(0, from.x + move.x)),
        y: Math.min(1, Math.max(0, from.y + move.y)),
      };
    });
  }

  // Au doigt, la lentille se place au-dessus du point de contact pour rester visible.
  const lift = touching ? LENS * 0.75 : 0;

  return (
    <div className="relative">
      <div
        ref={stage}
        role="group"
        aria-roledescription={label}
        aria-label={label}
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerLeave={() => !touching && setPoint(null)}
        onPointerDown={onPointerDown}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={onKeyDown}
        onBlur={() => setPoint(null)}
        className={`relative overflow-hidden ${touchMode ? "touch-none" : ""} ${point ? "cursor-none" : "cursor-zoom-in"}`}
      >
        {children}
        {point && size.w > 0 && (
          <div
            aria-hidden="true"
            className="loupe-lentille pointer-events-none absolute z-10 overflow-hidden rounded-full"
            style={{
              width: LENS,
              height: LENS,
              left: point.x * size.w - LENS / 2,
              top: point.y * size.h - LENS / 2 - lift,
            }}
          >
            <div
              className="absolute"
              style={{
                width: size.w * ZOOM,
                height: size.h * ZOOM,
                left: -(point.x * size.w * ZOOM - LENS / 2),
                top: -(point.y * size.h * ZOOM - LENS / 2),
              }}
            >
              {children}
            </div>
          </div>
        )}
      </div>
      <p className="sr-only">{hint}</p>
      <button
        type="button"
        aria-pressed={touchMode}
        onClick={() => setTouchMode((v) => !v)}
        className="surtitre absolute right-3 bottom-3 z-20 inline-flex min-h-11 items-center gap-2 bg-voile px-4 text-encre backdrop-blur-sm aria-pressed:bg-encre aria-pressed:text-fond [@media(hover:hover)]:hidden"
      >
        <Icon name="loupe" width={16} height={16} />
        {label}
      </button>
    </div>
  );
}
