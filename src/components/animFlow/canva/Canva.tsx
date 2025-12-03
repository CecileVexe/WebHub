import React, { useEffect, useMemo, useRef } from "react";

type CanvasProps = {
  html: string | null;
  cssUrl: string | null; // link href
  jsUrl: string | null;  // script src
  placeholder?: React.ReactNode;

  // ref externe pour laisser l'inspector cibler le host du shadow
  hostRef?: React.RefObject<HTMLDivElement | null>;
};

export const Canvas: React.FC<CanvasProps> = ({
  html,
  cssUrl,
  jsUrl,
  placeholder,
  hostRef,
}) => {
  const internalHostRef = useRef<HTMLDivElement | null>(null);
  const actualHostRef = hostRef ?? internalHostRef;

  const shadowRef = useRef<ShadowRoot | null>(null);

  const hasContent = useMemo(
    () => Boolean(html || cssUrl || jsUrl),
    [html, cssUrl, jsUrl]
  );

  useEffect(() => {
    const host = actualHostRef.current;
    if (!host) return;

    if (!shadowRef.current) {
      shadowRef.current = host.attachShadow({ mode: "open" });
    }

    const root = shadowRef.current;

    while (root.firstChild) root.removeChild(root.firstChild);

    if (!hasContent) return;

    // 1) CSS scoped
    if (cssUrl) {
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = cssUrl;
      root.appendChild(linkEl);
    }

    // 2) HTML
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html ?? "";
    root.appendChild(wrapper);

    // auto-id pour inspection/effets
    const all = wrapper.querySelectorAll<HTMLElement>("*");
    let i = 0;
    all.forEach((node) => {
      if (!node.id) node.id = `nocode_${i++}`;
    });

    // 3) JS scoped
    if (jsUrl) {
      const scriptEl = document.createElement("script");
      scriptEl.src = jsUrl;
      scriptEl.type = "text/javascript";
      scriptEl.defer = true;
      root.appendChild(scriptEl);
    }
  }, [html, cssUrl, jsUrl, hasContent, actualHostRef]);

  if (!hasContent) {
    return (
      <div
        style={{
          height: "100%",
          display: "grid",
          placeItems: "center",
          opacity: 0.6,
          fontSize: 14,
        }}
      >
        {placeholder ?? "Aucun dossier importé"}
      </div>
    );
  }

  return (
    <>
    <p id="tqt-ca-marche"> Vous inquiétez pas, c'est en cours de développement ! </p>
    </>
  );
};
