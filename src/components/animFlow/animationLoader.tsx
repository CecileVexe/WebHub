declare global {
  interface Window {
    animation?: (element: HTMLElement) => void;
  }
}
type InitialStyles = Partial<CSSStyleDeclaration>;

function loadAnimationScript(
  path: string
): Promise<((element: HTMLElement) => void) | undefined> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = path;

    script.onload = () => resolve(window.animation);
    script.onerror = () => reject(new Error(`Failed to load script: ${path}`));

    document.body.appendChild(script);
  });
}

async function applyAnimation(elementId: string, trigger: string, animationName: string) {
  const element = document.getElementById(elementId);
  if (element === null) return;

  let styles: InitialStyles;

  // 0. Apply initial styles if provided and load script
  switch (animationName) {
    case "fade":
      styles = { opacity: "0" };
      break;

    case "blur":
      styles = { filter: "blur(4px)" };
      break;

    case "spin":
      styles = { transform: "rotate(0deg)" };
      break;

    case "bg-color":
      styles = { backgroundColor: "auto" }
      break;

    default:
      styles = {}
      break;
  }

  Object.entries(styles).forEach(([key, value]) => {
    // @ts-ignore
    element.style[key] = value;
  });

  // 1. Load animation script dynamically
  const animationFn = await loadAnimationScript(`src/components/animFlow/animations/${animationName}.js`);

  // 2. Attach event dynamically (no React modification)
  switch (trigger) {
    case "click":
      let clicked = false; // track toggle state

      element.addEventListener("click", () => {
        if (!clicked) {
          // First click → run animation
          (animationFn as Function)(element);
          clicked = true;
        } else {
          // Second click → reset initial styles
          Object.entries(styles).forEach(([key, value]) => {
            // @ts-ignore
            element.style[key] = value;
          });
          clicked = false; // reset toggle
        }
      });
      break;

    case "change":
      let changed = false;
      element.addEventListener("change", () => {
        if (!changed) {
          (animationFn as Function)(element);
          changed = true;
        } else {
          Object.entries(styles).forEach(([key, value]) => {
            // @ts-ignore
            element.style[key] = value;
          });
          changed = false;
        }
      });
      break;

    case "hover":
      element.addEventListener("mouseover", () => (animationFn as Function)(element));
      element.addEventListener("mouseout", () => {
        // optional: reset initial styles
        Object.entries(styles).forEach(([key, value]) => {
          // @ts-ignore
          element.style[key] = value;
        });
      });
      break;

    case "onLoad":
      (animationFn as Function)(element);
      break;

    default:
      console.warn(`Unknown trigger: ${trigger}`);
  }
}

export default applyAnimation;