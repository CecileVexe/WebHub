import React, { useEffect, useMemo, useRef, useState } from "react";
import { InspectorOverlay } from "./inspector/InspectorOverlay";
import type { EffectsRegistry, EffectConfig } from "./types/effects";
import { useEffectsEngine } from "./effects/useEffectEngine";
import { loadRegistry, saveRegistry } from "./effects/persistence";

// --------------------
// Theme (ta charte)
// --------------------
const theme = {
  colors: {
    text: "#f8e1e2",
    background: "#242424",
    primary: "#70BA82",
    secondary: "#208676",
    accent: "#436ad3",
  },
} as const;

const ui = {
  radius: 12,
  radiusSm: 8,
  panelW: 360,
  shadow: "0 10px 30px rgba(0,0,0,0.35)",
  border: "1px solid rgba(248,225,226,0.08)",
  subtleBorder: "1px solid rgba(248,225,226,0.06)",
  textMuted: "rgba(248,225,226,0.7)",
};

// Placeholder : ton TSX généré non modifiable
const GeneratedScene: React.FC = () => {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button id="btn-1">Bouton A</button>
      <div id="box-1" style={{ padding: 16, border: "1px dashed #555" }}>
        Box
      </div>
    </div>
  );
};

const createEffectId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `eff_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const Main: React.FC = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const [inspectorOn, setInspectorOn] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [savedRegistry, setSavedRegistry] = useState<EffectsRegistry>(() =>
    loadRegistry()
  );
  const [draftRegistry, setDraftRegistry] = useState<EffectsRegistry>(() =>
    loadRegistry()
  );

  const [previewOn, setPreviewOn] = useState(false);

  // ✅ nouveau : type d’effet sélectionné dans le dropdown
  const [newEffectType, setNewEffectType] =
    useState<EffectConfig["type"]>("fade");

  const showSidebar = inspectorOn && selectedId !== null;

  // applique draft ou saved selon preview
  const activeRegistry = previewOn ? draftRegistry : savedRegistry;
  useEffectsEngine(activeRegistry);

  // persist uniquement saved
  useEffect(() => {
    saveRegistry(savedRegistry);
  }, [savedRegistry]);

  const selectedEffects = useMemo<EffectConfig[]>(
    () => (selectedId ? draftRegistry[selectedId] ?? [] : []),
    [draftRegistry, selectedId]
  );

  const addEffectToDraft = (type: EffectConfig["type"]) => {
    if (!selectedId) return;

    const base = {
      effectId: createEffectId(),
      enabled: true,
      durationMs: 400,
    } as const;

    const effect: EffectConfig =
      type === "fade"
        ? { ...base, type: "fade", to: 0.2 }
        : type === "blur"
        ? { ...base, type: "blur", toPx: 6 }
        : type === "rotate"
        ? { ...base, type: "rotate", toDeg: 15 }
        : type === "bgColor"
        ? { ...base, type: "bgColor", toColor: "#436ad3" }
        : { ...base, type: "scale", to: 1.08 };

    setDraftRegistry((prev) => ({
      ...prev,
      // ✅ un seul effet : on remplace
      [selectedId]: [effect],
    }));
  };

  const removeEffectFromDraft = (elementId: string, effectId: string) => {
    setDraftRegistry((prev) => {
      const list = prev[elementId] ?? [];
      const nextList = list.filter((e) => e.effectId !== effectId);

      const next: EffectsRegistry = { ...prev };
      if (nextList.length === 0) delete next[elementId];
      else next[elementId] = nextList;

      return next;
    });
  };

  const resetDraftFromSaved = () => {
    setDraftRegistry(savedRegistry);
  };

  const commitDraftToSaved = () => {
    setSavedRegistry(draftRegistry);
    setPreviewOn(false);
  };

  const effectLabel: Record<EffectConfig["type"], string> = {
    fade: "Fade",
    blur: "Blur",
    rotate: "Rotate",
    bgColor: "Background Color",
    scale: "Scale",
  };

  // ------------- styles -------------
  const rootStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    background: theme.colors.background,
    color: theme.colors.text,
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  };

  const canvasStyle: React.CSSProperties = {
    flex: 1,
    position: "relative",
    padding: 18,
    transition: "margin-right 220ms ease",
    overflow: "auto",
  };

  const canvasInnerStyle: React.CSSProperties = {
    minHeight: "calc(100vh - 36px)",
    borderRadius: ui.radius,
    border: ui.border,
    background:
      "radial-gradient(transparent 1px, rgba(255,255,255,0.02) 1px) 0 0/18px 18px",
    padding: 18,
  };

  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: ui.panelW,
    background: "rgba(36,36,36,0.98)",
    borderLeft: ui.border,
    padding: 14,
    boxShadow: ui.shadow,
    transform: showSidebar ? "translateX(0)" : "translateX(100%)",
    transition: "transform 220ms ease, opacity 220ms ease",
    zIndex: 2000,
    pointerEvents: showSidebar ? "auto" : "none",
    opacity: showSidebar ? 1 : 0,
    backdropFilter: "blur(6px)",
  };

  const sectionStyle: React.CSSProperties = {
    border: ui.subtleBorder,
    borderRadius: ui.radius,
    padding: 12,
    background: "rgba(255,255,255,0.02)",
  };

  const hrStyle: React.CSSProperties = {
    border: "none",
    borderTop: ui.subtleBorder,
    margin: "12px 0",
  };

  const buttonBase: React.CSSProperties = {
    borderRadius: ui.radiusSm,
    border: ui.subtleBorder,
    padding: "8px 10px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: theme.colors.text,
    background: "rgba(255,255,255,0.04)",
    transition:
      "transform 80ms ease, background 120ms ease, opacity 120ms ease",
  };

  const primaryBtn: React.CSSProperties = {
    ...buttonBase,
    background: theme.colors.primary,
    color: "#0b1910",
    border: "none",
  };

  const secondaryBtn: React.CSSProperties = {
    ...buttonBase,
    background: "rgba(32,134,118,0.18)",
    border: `1px solid rgba(32,134,118,0.6)`,
  };

  const accentBtn: React.CSSProperties = {
    ...buttonBase,
    background: "rgba(67,106,211,0.18)",
    border: `1px solid rgba(67,106,211,0.6)`,
  };

  const disabledBtn: React.CSSProperties = {
    opacity: 0.45,
    cursor: "not-allowed",
    transform: "none",
  };

  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    border: ui.subtleBorder,
    background: "rgba(255,255,255,0.03)",
    color: ui.textMuted,
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: ui.radiusSm,
    border: ui.subtleBorder,
    background: "rgba(255,255,255,0.04)",
    color: theme.colors.text,
    fontSize: 13,
    outline: "none",
  };

  // -----------------------------
  return (
    <div style={rootStyle}>
      {/* Canvas */}
      <div ref={targetRef} style={canvasStyle}>
        <div style={canvasInnerStyle}>
          <GeneratedScene />
        </div>

        <InspectorOverlay
          targetRef={targetRef}
          enabled={inspectorOn}
          onSelect={(info) => setSelectedId(info.id)}
          theme={theme}
        />
      </div>

      {/* Sidebar No-Code */}
      <aside style={drawerStyle}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: inspectorOn
                ? theme.colors.primary
                : "rgba(248,225,226,0.25)",
              boxShadow: inspectorOn
                ? `0 0 10px ${theme.colors.primary}`
                : undefined,
            }}
          />
          <div style={{ fontWeight: 800, letterSpacing: 0.3 }}>
            No-Code Animator
          </div>
        </div>

        <div style={{ marginTop: 8, fontSize: 12, color: ui.textMuted }}>
          Inspecteur actif &nbsp;•&nbsp; sélection requise
        </div>

        <hr style={hrStyle} />

        {/* Inspecteur toggle */}
        <div style={sectionStyle}>
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={inspectorOn}
              onChange={(e) => {
                const next = e.target.checked;
                setInspectorOn(next);
                if (!next) {
                  setSelectedId(null);
                  setPreviewOn(false);
                }
              }}
            />
            Mode inspecteur
          </label>

          <div style={{ marginTop: 8 }}>
            <span style={chipStyle}>
              Sélection :{" "}
              {selectedId ? (
                <code style={{ color: theme.colors.text }}>#{selectedId}</code>
              ) : (
                "aucune"
              )}
            </span>
          </div>
        </div>

        <hr style={hrStyle} />

        {/* Preview / commit */}
        <div style={{ ...sectionStyle, display: "grid", gap: 8 }}>
          <button
            onClick={() => setPreviewOn((v) => !v)}
            style={previewOn ? accentBtn : secondaryBtn}
          >
            {previewOn ? "Quitter la prévisualisation" : "Prévisualiser"}
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={resetDraftFromSaved}
              disabled={previewOn}
              style={{
                ...buttonBase,
                ...(previewOn ? disabledBtn : null),
                flex: 1,
              }}
            >
              Annuler
            </button>

            <button
              onClick={commitDraftToSaved}
              disabled={!previewOn}
              style={{
                ...primaryBtn,
                ...(!previewOn ? disabledBtn : null),
                flex: 1,
              }}
            >
              Valider
            </button>
          </div>

          <div style={{ fontSize: 12, color: ui.textMuted }}>
            Mode actif : {previewOn ? "Draft (preview)" : "Saved (prod)"}
          </div>
        </div>

        <hr style={hrStyle} />

        <div style={{ ...sectionStyle, display: "grid", gap: 8 }}>
          <div style={{ fontSize: 12, color: ui.textMuted }}>
            Cet ajout remplace l’effet existant pour cet élément.
          </div>

        <select
          value={newEffectType}
          disabled={!selectedId}
          onChange={(e) =>
            setNewEffectType(e.target.value as EffectConfig["type"])
          }
          style={{
            ...selectStyle,
            opacity: selectedId ? 1 : 0.5,
            cursor: selectedId ? "pointer" : "not-allowed",
          }}
        >
          <option value="fade">Fade</option>
          <option value="blur">Blur</option>
          <option value="rotate">Rotate</option>
          <option value="bgColor">Background Color Change</option>
          <option value="scale">Scale</option>
        </select>


          <button
            onClick={() => addEffectToDraft(newEffectType)}
            disabled={!selectedId}
            style={{
              ...buttonBase,
              ...(!selectedId ? disabledBtn : null),
            }}
          >
            Ajouter
          </button>

          <div style={{ fontSize: 12, color: ui.textMuted }}>
            L’effet est ajouté au brouillon (draft).
          </div>
        </div>

        <hr style={hrStyle} />

        {/* Effects list */}
        <div style={{ ...sectionStyle, overflow: "auto", maxHeight: "48vh" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            Effets (draft)
          </div>

          {selectedId && selectedEffects.length === 0 && (
            <div style={{ fontSize: 12, color: ui.textMuted }}>
              Aucun effet pour cet élément.
            </div>
          )}

          {selectedId &&
            selectedEffects.map((eff) => (
              <div
                key={eff.effectId}
                style={{
                  border: ui.subtleBorder,
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: ui.radiusSm,
                  padding: "8px 8px",
                  marginBottom: 8,
                  display: "grid",
                  gap: 6,
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ fontSize: 12 }}>
                    <code style={{ color: theme.colors.accent }}>
                      {effectLabel[eff.type]}
                    </code>

                    {/* {"className" in eff ? (
                      <span style={{ color: ui.textMuted }}>
                        {" "}
                        → {eff.className}
                      </span>
                    ) : null} */}
                  </div>

                  <button
                    onClick={() =>
                      selectedId &&
                      removeEffectFromDraft(selectedId, eff.effectId)
                    }
                    style={{
                      ...buttonBase,
                      padding: "4px 8px",
                      fontSize: 12,
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    Supprimer
                  </button>
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={chipStyle}>id: {eff.effectId.slice(0, 6)}…</span>
                  <span style={chipStyle}>
                    {eff.enabled ? "activé" : "désactivé"}
                  </span>
                </div>
              </div>
            ))}
        </div>

        <hr style={hrStyle} />

        {/* Deselect */}
        <button
          onClick={() => {
            setSelectedId(null);
            setPreviewOn(false);
          }}
          style={buttonBase}
        >
          Désélectionner
        </button>
      </aside>

      {/* Bouton flottant inspecteur si sidebar fermée */}
      {!showSidebar && (
        <button
          onClick={() => setInspectorOn((v) => !v)}
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            borderRadius: 999,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 800,
            border: ui.subtleBorder,
            color: theme.colors.text,
            background: inspectorOn
              ? "rgba(112,186,130,0.18)"
              : "rgba(255,255,255,0.06)",
            boxShadow: ui.shadow,
            zIndex: 1500,
          }}
        >
          {inspectorOn ? "Inspecteur ON" : "Inspecteur OFF"}
        </button>
      )}
    </div>
  );
};

export default Main;
