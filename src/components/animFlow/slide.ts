export function applySlideAnimation(element: HTMLElement, duration: number = 300) {
  if (!element) return;

  // S'assurer que l'élément peut être transformé visuellement
  element.style.display = element.style.display || "block";
  element.style.visibility = "visible";
  element.style.willChange = "transform";

  // Reset transition pour éviter les effets cumulés
  element.style.transition = "none";
  element.style.transform = "translateX(-100%)";

  // Force reflow
  void element.offsetHeight;

  // Double rAF pour garantir la prise en compte du point de départ
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.style.transition = `transform ${duration}ms ease`;
      element.style.transform = "translateX(0)";
    });
  });
}
