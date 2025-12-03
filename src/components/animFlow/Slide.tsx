import React, { useRef } from "react";
import { applySlideAnimation } from "./slide";

const Slide: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <button
        onClick={() => {
          if (contentRef.current) {
            applySlideAnimation(contentRef.current);
          }
        }}
      >
        Slide In
      </button>
      <div ref={contentRef} style={{ display: "block" }}>
        Animation Flow Content
      </div>
    </div>
  );
};

export default Slide;
