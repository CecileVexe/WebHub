// effects/useEffectsEngine.ts
import { useEffect, useRef } from "react";
import type { EffectsRegistry } from "../types/effects";
import { applyEffectsToElement } from "./applyEffects";

export function useEffectsEngine(registry: EffectsRegistry) {
  const cleanupMapRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    // cleanup anciens effets
    for (const [, cleanup] of cleanupMapRef.current) cleanup();
    cleanupMapRef.current.clear();

    // applique nouveaux
    for (const [id, effects] of Object.entries(registry)) {
      const el = document.getElementById(id);
      if (!el) continue;

      const cleanup = applyEffectsToElement(el, effects);
      cleanupMapRef.current.set(id, cleanup);
    }

    return () => {
      for (const [, cleanup] of cleanupMapRef.current) cleanup();
      cleanupMapRef.current.clear();
    };
  }, [registry]);
}
