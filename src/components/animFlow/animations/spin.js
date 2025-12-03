window.animation = (element) => {
  // Reset transform to allow retrigger
  element.style.transition = "none";
  element.style.transform = "rotate(0deg)";

  // Force reflow to make the browser apply the reset
  void element.offsetWidth;

  // Now trigger the real animation
  element.style.transition = "transform 0.5s linear";
  element.style.transform = "rotate(1080deg)";
};
