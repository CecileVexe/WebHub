import { getAnimation } from "./animationRegistry";

export function applyScrollAnimation(
  el: HTMLElement | null,
  animationName: string,
  triggerRatio: number = 0.7,
) {
  if (!el) return;

  const animation = getAnimation(animationName);
  if (!animation) {
    console.warn(`Animation "${animationName}" not found.`);
    return;
  }

  const onScroll = () => {
    const rect = el.getBoundingClientRect();
    const triggerPoint = window.innerHeight * triggerRatio;

    if (rect.top < triggerPoint) {
      animation(el);
      window.removeEventListener("scroll", onScroll);
    }
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  return () => window.removeEventListener("scroll", onScroll);
}
