import type React from "react";

export type EffectType =
  | "fade"
  | "blur"
  | "rotate"
  | "bgColor"
  | "scale";

export interface BaseEffect {
  effectId: string;
  type: EffectType;
  enabled: boolean;
}

export interface FadeEffect extends BaseEffect {
  type: "fade";
  /** opacité cible (0–1) */
  to: number;
  durationMs: number;
}

export interface BlurEffect extends BaseEffect {
  type: "blur";
  /** flou en px */
  toPx: number;
  durationMs: number;
}

export interface RotateEffect extends BaseEffect {
  type: "rotate";
  /** rotation en degrés */
  toDeg: number;
  durationMs: number;
}

export interface BgColorEffect extends BaseEffect {
  type: "bgColor";
  /** couleur cible */
  toColor: string;
  durationMs: number;
}

export interface ScaleEffect extends BaseEffect {
  type: "scale";
  /** scale cible (ex 1.1) */
  to: number;
  durationMs: number;
}

export type EffectConfig =
  | FadeEffect
  | BlurEffect
  | RotateEffect
  | BgColorEffect
  | ScaleEffect;

export type EffectsRegistry = Record<string, EffectConfig[]>;
