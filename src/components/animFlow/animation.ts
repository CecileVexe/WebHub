// animations.ts
import { registerAnimation } from "./animationRegistry";
import { zoom } from "./zoom";

// --- Zoom ---
registerAnimation("zoom", el => zoom(el, 1.2, { duration: 400 }));

// --- Fade In ---
registerAnimation("fadeIn", el => {
  el.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 500,
    easing: "ease-out",
    fill: "forwards",
  });
});

// --- Slide Up ---
registerAnimation("slideUp", el => {
  el.animate(
    [
      { opacity: 0, transform: "translateY(30px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 500, easing: "ease-out", fill: "forwards" },
  );
});

// --- Slide Left ---
registerAnimation("slideLeft", el => {
  el.animate(
    [
      { opacity: 0, transform: "translateX(30px)" },
      { opacity: 1, transform: "translateX(0)" },
    ],
    { duration: 500, easing: "ease-out", fill: "forwards" },
  );
});

// --- Spin ---
registerAnimation("spin", el => {
  el.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
    duration: 700,
    easing: "ease-in-out",
    fill: "forwards",
  });
});
