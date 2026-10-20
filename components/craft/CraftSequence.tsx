"use client";

import { useEffect } from "react";

const WIDE = "(min-width: 64rem)";

/**
 * Pilote la séquence épinglée du Savoir-faire sur grand écran. La scène est
 * collante (CSS `sticky`) ; GSAP et ScrollTrigger, chargés à la demande, ne font
 * qu'indiquer l'étape active (`data-actif`, fondu en CSS) et, si le mouvement est
 * permis, lier au défilement le tracé du croquis, la pose de la pierre et les éclats.
 * Sur mobile, rien n'est chargé : chaque étape porte sa propre illustration.
 */
export function CraftSequence({ targetId }: { targetId: string }) {
  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    let started = false;
    const wide = window.matchMedia(WIDE);

    async function start() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add({ wide: WIDE, motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
        const { wide: isWide, motion } = context.conditions ?? {};
        if (!isWide) {
          root.removeAttribute("data-pilote");
          return;
        }
        root.setAttribute("data-pilote", "");
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);

        // Étape active : celle qui occupe le milieu de l'écran.
        for (const step of steps) {
          ScrollTrigger.create({
            trigger: step,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive) root.dataset.actif = step.dataset.step;
            },
          });
        }

        // Fil de progression, lié au défilement de toute la séquence.
        gsap.fromTo(
          root.querySelector("[data-progression]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top 55%", end: "bottom 55%", scrub: true },
          },
        );

        if (!motion) return;
        const stage = root.querySelector("[data-scene]");
        if (!stage) return;
        const scrubbed = (trigger: Element | undefined, vars: gsap.TweenVars) => ({
          ...vars,
          ease: "none",
          scrollTrigger: { trigger, start: "top 75%", end: "center 50%", scrub: 0.6 },
        });
        const stepEl = (id: string) => steps.find((s) => s.dataset.step === id);

        // Croquis : chaque trait se dessine.
        gsap.fromTo(
          stage.querySelectorAll('[data-etape="croquis"] [data-trait]'),
          { strokeDasharray: "1 1", strokeDashoffset: 1 },
          scrubbed(stepEl("croquis"), { strokeDashoffset: 0, stagger: 0.08 }),
        );
        // Fonte : la braise s'éteint à mesure que le métal refroidit.
        gsap.fromTo(
          stage.querySelector("[data-braise]"),
          { opacity: 1 },
          scrubbed(stepEl("fonte"), { opacity: 0.35 }),
        );
        // Sertissage : la pierre descend dans son assise.
        gsap.fromTo(
          stage.querySelector("[data-pose]"),
          { y: -26 },
          scrubbed(stepEl("sertissage"), { y: 0 }),
        );
        // Polissage : les éclats s'allument.
        gsap.fromTo(
          stage.querySelectorAll("[data-eclat]"),
          { scale: 0, transformOrigin: "50% 50%" },
          scrubbed(stepEl("polissage"), { scale: 1, stagger: 0.12 }),
        );
      });
      cleanup = () => mm.revert();
    }

    // Rien à charger tant que l'écran est étroit.
    function maybeStart() {
      if (!wide.matches || started) return;
      started = true;
      void start();
    }
    maybeStart();
    wide.addEventListener("change", maybeStart);

    return () => {
      cancelled = true;
      wide.removeEventListener("change", maybeStart);
      cleanup?.();
    };
  }, [targetId]);

  return null;
}
