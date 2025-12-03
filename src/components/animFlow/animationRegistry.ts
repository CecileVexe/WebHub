export type AnimationFn = (el: HTMLElement) => void;

const animationRegistry: Record<string, AnimationFn> = {};

export function registerAnimation(name: string, fn: AnimationFn) {
  animationRegistry[name] = fn;
}

export function getAnimation(name: string) {
  return animationRegistry[name];
}

export function listAnimations() {
  return Object.keys(animationRegistry);
}
