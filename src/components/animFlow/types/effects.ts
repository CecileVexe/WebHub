export type TriggerType =
  | "click"
  | "hover"
  | "load"
  | "scroll"
  | "change";

export type EffectType =
  | "fade"
  | "blur"
  | "rotate"
  | "bgColor"
  | "scale";

export interface BaseEffect {
  effectId: string;
  type: EffectType;
  trigger: TriggerType;
  enabled: boolean;
  durationMs: number;
}

export interface FadeEffect extends BaseEffect {
  type: "fade";
  to: number; // 0–1
}

export interface BlurEffect extends BaseEffect {
  type: "blur";
  toPx: number;
}

export interface RotateEffect extends BaseEffect {
  type: "rotate";
  toDeg: number;
}

export interface BgColorEffect extends BaseEffect {
  type: "bgColor";
  toColor: string;
}

export interface ScaleEffect extends BaseEffect {
  type: "scale";
  to: number;
}

export type EffectConfig =
  | FadeEffect
  | BlurEffect
  | RotateEffect
  | BgColorEffect
  | ScaleEffect;

export type EffectsRegistry = Record<string, EffectConfig[]>;
