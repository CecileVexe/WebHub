import React, { useRef } from "react";
import { zoom } from "./zoom";

export const ZoomCard: React.FC = () => {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        onMouseEnter={e => zoom(e.currentTarget, 1.1)}
        onMouseLeave={e => zoom(e.currentTarget, 1)}
        style={{
          display: "inline-block",
          padding: "20px",
          background: "red",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "box-shadow 0.2s",
        }}
      >
        Survole-moi pour zoomer
      </div>
      <button
        ref={ref}
        onClick={() => zoom(ref.current, 2.0)}
        onMouseLeave={() => zoom(ref.current, 1)}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Clique pour zoomer
      </button>
    </div>
  );
};
