import { useEffect, useRef } from "react";
import type { EffectsRegistry } from "../types/effects";
import { applyEffectsToElement, type CleanupFn } from "./applyEffects";

function findElementById(
  id: string,
  canvasHost: HTMLDivElement | null
): HTMLElement | null {
  if (canvasHost?.shadowRoot) {
    const inShadow = canvasHost.shadowRoot.getElementById(id);
    if (inShadow instanceof HTMLElement) return inShadow;
  }

  const inLight = document.getElementById(id);
  return inLight instanceof HTMLElement ? inLight : null;
}

export function useEffectsEngine(
  registry: EffectsRegistry,
  canvasHostRef: React.RefObject<HTMLDivElement | null>
): void {
  const cleanupMapRef = useRef<Map<string, CleanupFn>>(new Map());

  useEffect(() => {
    // cleanup anciens effets
    for (const [, cleanup] of cleanupMapRef.current) cleanup();
    cleanupMapRef.current.clear();

    const canvasHost = canvasHostRef.current;

    for (const [id, effects] of Object.entries(registry)) {
      const el = findElementById(id, canvasHost);
      if (!el) continue;

      const cleanup = applyEffectsToElement(el, effects);
      cleanupMapRef.current.set(id, cleanup);
    }

    return () => {
      for (const [, cleanup] of cleanupMapRef.current) cleanup();
      cleanupMapRef.current.clear();
    };
  }, [registry, canvasHostRef]);
}
