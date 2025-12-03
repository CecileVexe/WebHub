import type { EffectConfig, TriggerType } from "../types/effects";

type CleanupFn = () => void;

function runEffect(el: HTMLElement, eff: EffectConfig): void {
  switch (eff.type) {
    case "fade": {
      el.style.transition = `opacity ${eff.durationMs}ms ease`;
      el.style.opacity = String(eff.to);
      break;
    }
    case "blur": {
      el.style.transition = `filter ${eff.durationMs}ms ease`;
      el.style.filter = `blur(${eff.toPx}px)`;
      break;
    }
    case "rotate": {
      el.style.transition = `transform ${eff.durationMs}ms ease`;
      el.style.transform = `rotate(${eff.toDeg}deg)`;
      break;
    }
    case "bgColor": {
      el.style.transition = `background-color ${eff.durationMs}ms ease`;
      el.style.backgroundColor = eff.toColor;
      break;
    }
    case "scale": {
      el.style.transition = `transform ${eff.durationMs}ms ease`;
      el.style.transform = `scale(${eff.to})`;
      break;
    }
    default: {
      const _exhaustive: never = eff;
      throw new Error(`Unknown effect: ${_exhaustive}`);
    }
  }
}

/** Attache le trigger à l’élément et renvoie le cleanup */
function attachTrigger(
  el: HTMLElement,
  trigger: TriggerType,
  handler: () => void
): CleanupFn {
  if (trigger === "load") {
    handler();
    return () => {};
  }

  if (trigger === "click") {
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }

  if (trigger === "hover") {
    el.addEventListener("mouseenter", handler);
    return () => el.removeEventListener("mouseenter", handler);
  }

  if (trigger === "change") {
    // pour inputs/select/textarea : change + input
    const onInput = handler;
    el.addEventListener("change", handler);
    el.addEventListener("input", onInput);
    return () => {
      el.removeEventListener("change", handler);
      el.removeEventListener("input", onInput);
    };
  }

  // trigger scroll : on exécute une fois quand l’élément entre dans le viewport
  if (trigger === "scroll") {
    let done = false;

    const onScroll = () => {
      if (done) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        done = true;
        handler();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // check initial
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }

  // exhaustive
  const _never: never = trigger;
  throw new Error(`Unknown trigger: ${_never}`);
}

export function applyEffectsToElement(
  el: HTMLElement,
  effects: EffectConfig[]
): CleanupFn {
  const cleanups: CleanupFn[] = [];

  for (const eff of effects) {
    if (!eff.enabled) continue;

    // sauvegarde état initial pour revert au cleanup
    const prev = {
      opacity: el.style.opacity,
      filter: el.style.filter,
      transform: el.style.transform,
      bg: el.style.backgroundColor,
      transition: el.style.transition,
    };

    const apply = () => runEffect(el, eff);

    const cleanupTrigger = attachTrigger(el, eff.trigger, apply);
    cleanups.push(cleanupTrigger);

    cleanups.push(() => {
      el.style.opacity = prev.opacity;
      el.style.filter = prev.filter;
      el.style.transform = prev.transform;
      el.style.backgroundColor = prev.bg;
      el.style.transition = prev.transition;
    });
  }

  return () => cleanups.forEach((c) => c());
}
