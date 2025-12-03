import type { EffectsRegistry, EffectConfig, EffectType } from "../types/effects";

const STORAGE_KEY = "noCodeEffectsRegistry_v2"; // ✅ on bump la clé pour repartir propre

const allowedTypes: ReadonlySet<EffectType> = new Set([
  "fade",
  "blur",
  "rotate",
  "bgColor",
  "scale",
]);

const ensureIdsAndFilter = (reg: EffectsRegistry): EffectsRegistry => {
  const next: EffectsRegistry = {};

  for (const [elId, effects] of Object.entries(reg)) {
    const cleaned: EffectConfig[] = [];

    for (const raw of effects ?? []) {
      if (!raw || typeof raw !== "object") continue;

      const maybeType = (raw as { type?: unknown }).type;
      if (typeof maybeType !== "string" || !allowedTypes.has(maybeType as EffectType)) {
        continue; // ✅ on skip les anciens effets
      }

      const maybeId = (raw as { effectId?: unknown }).effectId;
      const effectId =
        typeof maybeId === "string" && maybeId.length > 0
          ? maybeId
          : `legacy_${Date.now()}_${Math.random().toString(16).slice(2)}`;

      cleaned.push({ ...(raw as EffectConfig), effectId });
    }

    if (cleaned.length > 0) {
      // ✅ 1 seul effet max -> garde le dernier
      next[elId] = [cleaned[cleaned.length - 1]];
    }
  }

  return next;
};

export function loadRegistry(): EffectsRegistry {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    return ensureIdsAndFilter(parsed as EffectsRegistry);
  } catch {
    return {};
  }
}

export function saveRegistry(registry: EffectsRegistry): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
  } catch {
    // ignore
  }
}
