// ScrollAnimatedBlock.tsx
import React, { useEffect, useRef } from "react";
import { getAnimation } from "./animationRegistry";

interface ScrollAnimatedBlockProps {
  animation: string;
  triggerRatio?: number;
  children: React.ReactNode;
}

export const ScrollAnimatedBlock: React.FC<ScrollAnimatedBlockProps> = ({
  animation,
  triggerRatio = 0.5,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animFn = getAnimation(animation);
    if (!animFn) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          animFn(el);
          observer.disconnect();
        }
      },
      { threshold: triggerRatio },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, triggerRatio]);

  return <div ref={ref}>{children}</div>;
};
