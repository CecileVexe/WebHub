import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SelectedInfo = {
  id: string;
  tag: string;
  classes: string;
};

type Theme = {
  colors: {
    text: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;
  };
};

interface InspectorOverlayProps {
  targetRef: React.RefObject<HTMLElement | null>;
  enabled: boolean;
  onSelect: (info: SelectedInfo) => void;
  theme: Theme;
}

export const InspectorOverlay: React.FC<InspectorOverlayProps> = ({
  targetRef,
  enabled,
  onSelect,
  theme,
}) => {
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const lastElRef = useRef<HTMLElement | null>(null);

  const getElementUnderPointer = useCallback(
    (x: number, y: number) => {
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      if (!el) return null;
      const container = targetRef.current;
      if (!container) return null;
      if (!container.contains(el)) return null;
      return el;
    },
    [targetRef],
  );

  useEffect(() => {
    if (!enabled) {
      setHoverRect(null);
      setHoverId(null);
      lastElRef.current = null;
      return;
    }

    const container = targetRef.current;
    if (!container) return;

    const onMove = (e: PointerEvent) => {
      const el = getElementUnderPointer(e.clientX, e.clientY);
      if (!el || el === lastElRef.current) return;

      lastElRef.current = el;
      setHoverRect(el.getBoundingClientRect());
      setHoverId(el.id || null);
    };

    const onClickCapture = (e: MouseEvent) => {
      const el = getElementUnderPointer(e.clientX, e.clientY);
      if (!el) return;

      e.preventDefault();
      e.stopPropagation();

      if (!el.id) return;
      onSelect({
        id: el.id,
        tag: el.tagName.toLowerCase(),
        classes: el.className,
      });
    };

    const onKeyDownCapture = (e: KeyboardEvent) => {
      if (!enabled) return;
      if (e.key !== "Enter" && e.key !== " ") return;

      const active = document.activeElement as HTMLElement | null;
      if (!active) return;

      const container = targetRef.current;
      if (!container || !container.contains(active)) return;

      if (!active.id) return;

      e.preventDefault();
      e.stopPropagation();

      onSelect({
        id: active.id,
        tag: active.tagName.toLowerCase(),
        classes: active.className,
      });
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("click", onClickCapture, true);
    container.addEventListener("keydown", onKeyDownCapture, true);

    return () => {
      container.removeEventListener("keydown", onKeyDownCapture, true);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("click", onClickCapture, true);
    };
  }, [enabled, getElementUnderPointer, onSelect, targetRef]);

  const overlayStyle = useMemo<React.CSSProperties>(() => {
    if (!hoverRect) return { display: "none" };
    return {
      position: "fixed",
      left: hoverRect.left,
      top: hoverRect.top,
      width: hoverRect.width,
      height: hoverRect.height,
      outline: `2px solid ${theme.colors.accent}`,
      background: "rgba(67,106,211,0.12)",
      boxShadow: `0 0 0 1px rgba(67,106,211,0.35), 0 0 18px rgba(67,106,211,0.35)`,
      pointerEvents: "none",
      zIndex: 9999,
      borderRadius: 6,
      transition: "all 60ms linear",
    };
  }, [hoverRect, theme.colors.accent]);

  const labelStyle: React.CSSProperties = hoverRect
    ? {
        position: "fixed",
        left: hoverRect.left,
        top: Math.max(0, hoverRect.top - 24),
        background: theme.colors.secondary,
        color: theme.colors.text,
        fontSize: 12,
        padding: "3px 8px",
        borderRadius: 999,
        zIndex: 10000,
        pointerEvents: "none",
        boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
        letterSpacing: 0.2,
      }
    : { display: "none" };

  return (
    <>
      <div style={overlayStyle} />
      {hoverRect && hoverId && <div style={labelStyle}>#{hoverId}</div>}
    </>
  );
};
