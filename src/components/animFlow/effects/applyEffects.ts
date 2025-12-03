import type { EffectConfig } from "../types/effects";

type CleanupFn = () => void;

export function applyEffectsToElement(
  el: HTMLElement,
  effects: EffectConfig[]
): CleanupFn {
  const cleanups: CleanupFn[] = [];

  for (const eff of effects) {
    if (!eff.enabled) continue;

    switch (eff.type) {
      case "fade": {
        const prevOpacity = el.style.opacity;
        const prevTransition = el.style.transition;

        el.style.transition = `opacity ${eff.durationMs}ms ease`;
        el.style.opacity = String(eff.to);

        cleanups.push(() => {
          el.style.opacity = prevOpacity;
          el.style.transition = prevTransition;
        });
        break;
      }

      case "blur": {
        const prevFilter = el.style.filter;
        const prevTransition = el.style.transition;

        el.style.transition = `filter ${eff.durationMs}ms ease`;
        el.style.filter = `blur(${eff.toPx}px)`;

        cleanups.push(() => {
          el.style.filter = prevFilter;
          el.style.transition = prevTransition;
        });
        break;
      }

      case "rotate": {
        const prevTransform = el.style.transform;
        const prevTransition = el.style.transition;

        el.style.transition = `transform ${eff.durationMs}ms ease`;
        el.style.transform = `rotate(${eff.toDeg}deg)`;

        cleanups.push(() => {
          el.style.transform = prevTransform;
          el.style.transition = prevTransition;
        });
        break;
      }

      case "bgColor": {
        const prevBg = el.style.backgroundColor;
        const prevTransition = el.style.transition;

        el.style.transition = `background-color ${eff.durationMs}ms ease`;
        el.style.backgroundColor = eff.toColor;

        cleanups.push(() => {
          el.style.backgroundColor = prevBg;
          el.style.transition = prevTransition;
        });
        break;
      }

      case "scale": {
        const prevTransform = el.style.transform;
        const prevTransition = el.style.transition;

        el.style.transition = `transform ${eff.durationMs}ms ease`;
        el.style.transform = `scale(${eff.to})`;

        cleanups.push(() => {
          el.style.transform = prevTransform;
          el.style.transition = prevTransition;
        });
        break;
      }

      default: {
        const _exhaustive: never = eff;
        throw new Error(`Unknown effect: ${_exhaustive}`);
      }
    }
  }

  return () => {
    cleanups.forEach((c) => c());
  };
}
