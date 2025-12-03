export interface ZoomOptions {
  duration?: number;
  easing?: string;
}

/**
 * Applique un zoom ou dézoom
 */
export function zoom(
  el: HTMLElement | null,
  amount: number = 1.1,
  options: ZoomOptions = {},
) {
  if (!el) return;

  const { duration = 250, easing = "ease-out" } = options;

  return el.animate(
    [{ transform: "scale(1)" }, { transform: `scale(${amount})` }],
    {
      duration,
      easing,
      fill: "forwards",
    },
  );
}
