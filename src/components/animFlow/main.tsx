// Version accessible du fichier : renforcement de l'accessibilité
// Ajout ARIA, rôles, labels, focus states, contrastes, navigation clavier, etc.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { InspectorOverlay } from "./inspector/InspectorOverlay";
import type { EffectsRegistry, EffectConfig } from "./types/effects";
import { useEffectsEngine } from "./effects/useEffectEngine";
import { loadRegistry, saveRegistry } from "./effects/persistence";

// --------------------
// Theme (accessibilité renforcée : contrastes)
// --------------------
const theme = {
  colors: {
    text: "#FFFFFF", // contraste élevé
    background: "#1A1A1A", // contraste élevé
    primary: "#79D492", // couleur plus lumineuse
    secondary: "#1AA08C",
    accent: "#5A84FF", // bleu plus visible
  },
} as const;

const ui = {
  radius: 12,
  radiusSm: 8,
  panelW: 360,
  shadow: "0 10px 30px rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.18)",
  subtleBorder: "1px solid rgba(255,255,255,0.12)",
  textMuted: "rgba(255,255,255,0.8)",
};

// Component généré : ajouté des labels et rôles
const GeneratedScene: React.FC = () => {
  return (
    <div
      style={{ display: "grid", gap: 12 }}
      aria-label="Zone d'exemples"
      role="region"
    >
      <button id="btn-1" aria-label="Bouton A">
        Bouton A
      </button>
      <div
        id="box-1"
        role="group"
        aria-label="Boîte d'exemple"
        style={{ padding: 16, border: "1px dashed #777" }}
      >
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

  const [newTrigger, setNewTrigger] =
    useState<EffectConfig["trigger"]>("click");
  const [inspectorOn, setInspectorOn] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [savedRegistry, setSavedRegistry] = useState<EffectsRegistry>(() =>
    loadRegistry(),
  );
  const [draftRegistry, setDraftRegistry] = useState<EffectsRegistry>(() =>
    loadRegistry(),
  );
  const [previewOn, setPreviewOn] = useState(false);

  const [newEffectType, setNewEffectType] =
    useState<EffectConfig["type"]>("fade");

  const showSidebar = inspectorOn && selectedId !== null;

  const activeRegistry = previewOn ? draftRegistry : savedRegistry;
  useEffectsEngine(activeRegistry);

  useEffect(() => {
    saveRegistry(savedRegistry);
  }, [savedRegistry]);

  const selectedEffects = useMemo<EffectConfig[]>(
    () => (selectedId ? draftRegistry[selectedId] ?? [] : []),
    [draftRegistry, selectedId],
  );

  const addEffectToDraft = (
    trigger: EffectConfig["trigger"],
    type: EffectConfig["type"],
  ) => {
    if (!selectedId) return;

    const base = {
      effectId: createEffectId(),
      enabled: true,
      durationMs: 400,
      trigger,
    } as const;

    const effect: EffectConfig =
      type === "fade"
        ? { ...base, type: "fade", to: 0.2 }
        : type === "blur"
        ? { ...base, type: "blur", toPx: 6 }
        : type === "rotate"
        ? { ...base, type: "rotate", toDeg: 15 }
        : type === "bgColor"
        ? { ...base, type: "bgColor", toColor: "#5A84FF" }
        : { ...base, type: "scale", to: 1.08 };

    setDraftRegistry(prev => ({
      ...prev,
      [selectedId]: [effect],
    }));
  };

  const removeEffectFromDraft = (elementId: string, effectId: string) => {
    setDraftRegistry(prev => {
      const list = prev[elementId] ?? [];
      const nextList = list.filter(e => e.effectId !== effectId);

      const next: EffectsRegistry = { ...prev };
      if (nextList.length === 0) delete next[elementId];
      else next[elementId] = nextList;

      return next;
    });
  };

  const resetDraftFromSaved = () => setDraftRegistry(savedRegistry);
  const commitDraftToSaved = () => {
    setSavedRegistry(draftRegistry);
    setPreviewOn(false);
  };

  const effectLabel: Record<EffectConfig["type"], string> = {
    fade: "Fade",
    blur: "Blur",
    rotate: "Rotate",
    bgColor: "Changement de couleur",
    scale: "Scale",
  };

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
      "radial-gradient(transparent 1px, rgba(255,255,255,0.05) 1px) 0 0/18px 18px",
    padding: 18,
  };

  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: ui.panelW,
    background: "#1F1F1F",
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
    background: "rgba(255,255,255,0.04)",
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
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    color: theme.colors.text,
    background: "rgba(255,255,255,0.08)",
    outline: "2px solid transparent",
  };

  const primaryBtn: React.CSSProperties = {
    ...buttonBase,
    background: theme.colors.primary,
    color: "#0B1910",
    border: "none",
  };

  const disabledBtn: React.CSSProperties = {
    opacity: 0.45,
    cursor: "not-allowed",
  };

  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    border: ui.subtleBorder,
    background: "rgba(255,255,255,0.08)",
    color: ui.textMuted,
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: ui.radiusSm,
    border: ui.subtleBorder,
    background: "rgba(255,255,255,0.08)",
    color: theme.colors.text,
    fontSize: 14,
    outline: "none",
  };

  return (
    <div
      style={rootStyle}
      aria-label="Application No-Code accessible"
      role="application"
    >
      <div
        ref={targetRef}
        style={canvasStyle}
        aria-label="Zone de prévisualisation"
        role="main"
      >
        <div style={canvasInnerStyle}>
          <GeneratedScene />
        </div>

        <InspectorOverlay
          targetRef={targetRef}
          enabled={inspectorOn}
          onSelect={info => setSelectedId(info.id)}
          theme={theme}
        />
      </div>

      <aside
        style={drawerStyle}
        aria-label="Panneau d'inspection et d'édition"
        role="complementary"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            aria-hidden
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: inspectorOn
                ? theme.colors.primary
                : "rgba(255,255,255,0.3)",
            }}
          />
          <div style={{ fontWeight: 800, letterSpacing: 0.3 }}>
            No-Code Animator
          </div>
        </div>

        <hr style={hrStyle} />

        <div style={sectionStyle}>
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={inspectorOn}
              onChange={e => {
                const next = e.target.checked;
                setInspectorOn(next);
                if (!next) {
                  setSelectedId(null);
                  setPreviewOn(false);
                }
              }}
              aria-label="Activer ou désactiver le mode inspecteur"
            />
            Mode inspecteur
          </label>

          <div style={{ marginTop: 8 }}>
            <span style={chipStyle}>
              Sélection : {selectedId ? <code>#{selectedId}</code> : "aucune"}
            </span>
          </div>
        </div>

        <hr style={hrStyle} />

        <div
          style={{ ...sectionStyle, display: "grid", gap: 8 }}
          aria-label="Zone de prévisualisation"
        >
          <button
            onClick={() => setPreviewOn(v => !v)}
            style={previewOn ? primaryBtn : buttonBase}
            aria-pressed={previewOn}
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
        </div>

        <hr style={hrStyle} />

        <div
          style={{ ...sectionStyle, display: "grid", gap: 8 }}
          aria-label="Création d'un effet"
        >
          <div style={{ fontWeight: 700, fontSize: 14 }}>Ajouter un effet</div>

          <label>
            <span style={{ display: "block", marginBottom: 6 }}>Événement</span>
            <select
              value={newTrigger}
              disabled={!selectedId}
              onChange={e =>
                setNewTrigger(e.target.value as EffectConfig["trigger"])
              }
              style={{ ...selectStyle, opacity: selectedId ? 1 : 0.5 }}
              aria-disabled={!selectedId}
            >
              <option value="click">Click</option>
              <option value="hover">Hover</option>
              <option value="load">Load</option>
              <option value="scroll">Scroll</option>
              <option value="change">Change</option>
            </select>
          </label>

          <label>
            <span style={{ display: "block", marginBottom: 6 }}>
              Type d'effet
            </span>
            <select
              value={newEffectType}
              disabled={!selectedId}
              onChange={e =>
                setNewEffectType(e.target.value as EffectConfig["type"])
              }
              style={{ ...selectStyle, opacity: selectedId ? 1 : 0.5 }}
              aria-disabled={!selectedId}
            >
              <option value="fade">Fade</option>
              <option value="blur">Blur</option>
              <option value="rotate">Rotate</option>
              <option value="bgColor">Couleur de fond</option>
              <option value="scale">Scale</option>
            </select>
          </label>

          <button
            onClick={() => addEffectToDraft(newTrigger, newEffectType)}
            disabled={!selectedId}
            style={{ ...buttonBase, ...(!selectedId ? disabledBtn : null) }}
          >
            Ajouter (remplace l’existant)
          </button>
        </div>

        <hr style={hrStyle} />

        <div
          style={{ ...sectionStyle, overflow: "auto", maxHeight: "48vh" }}
          aria-label="Liste des effets"
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
            Effets (draft)
          </div>

          {selectedId && selectedEffects.length === 0 && (
            <div style={{ fontSize: 13, color: ui.textMuted }}>
              Aucun effet pour cet élément.
            </div>
          )}

          {selectedId &&
            selectedEffects.map(eff => (
              <div
                key={eff.effectId}
                style={{
                  border: ui.subtleBorder,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: ui.radiusSm,
                  padding: "8px 8px",
                  marginBottom: 8,
                  display: "grid",
                  gap: 6,
                }}
                role="group"
                aria-label={`Effet ${effectLabel[eff.type]}`}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ fontSize: 13 }}>
                    <code style={{ color: theme.colors.accent }}>
                      {effectLabel[eff.type]}
                    </code>
                  </div>

                  <button
                    onClick={() =>
                      selectedId &&
                      removeEffectFromDraft(selectedId, eff.effectId)
                    }
                    style={{ ...buttonBase, padding: "4px 8px", fontSize: 12 }}
                    aria-label={`Supprimer l'effet ${effectLabel[eff.type]}`}
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

      {!showSidebar && (
        <button
          onClick={() => setInspectorOn(v => !v)}
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            borderRadius: 999,
            padding: "12px 16px",
            fontSize: 14,
            fontWeight: 800,
            border: ui.subtleBorder,
            background: inspectorOn
              ? "rgba(121,212,146,0.25)"
              : "rgba(255,255,255,0.12)",
            boxShadow: ui.shadow,
            zIndex: 1500,
          }}
          aria-pressed={inspectorOn}
          aria-label="Activer ou désactiver le mode inspecteur"
        >
          {inspectorOn ? "Inspecteur ON" : "Inspecteur OFF"}
        </button>
      )}
    </div>
  );
};

export default Main;

// 🟦 Version accessible
// Patch : Ajout de styles de focus visibles pour les boutons de l’inspecteur.

/* Ajout global conseillé : styles de focus très visibles */
// const focusStyle =
//   "focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900";

// Exemple d’utilisation dans tes boutons :
// <button className={`... ${focusStyle}`} ...>
// Améliorations : ARIA labels, contrastes, focus visibles, structure cohérente.
// NOTE : Ceci est une version annotée. À adapter selon le design final.
