import type { CanvasFiles } from "../types/canva";

type ExportOptions = {
  /** Nom de base des fichiers exportés (ex: "scene-1") */
  baseName: string;
  /**
   * Si true, n’exporte pas les fichiers vides/inexistants.
   * Par défaut: true.
   */
  skipMissing?: boolean;
};

/** Télécharge un fichier texte côté navigateur */
function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

/** Lit une Blob URL en texte */
async function readBlobUrlText(blobUrl: string): Promise<string> {
  const res = await fetch(blobUrl);
  if (!res.ok) {
    throw new Error(`Impossible de lire ${blobUrl} (${res.status})`);
  }
  return await res.text();
}

/**
 * Export d’une scène en 3 fichiers: baseName.html / baseName.css / baseName.js
 */
export async function exportSceneFiles(
  files: CanvasFiles,
  options: ExportOptions
): Promise<void> {
  const { baseName, skipMissing = true } = options;

  // HTML
  if (files.html) {
    downloadTextFile(`${baseName}.html`, files.html, "text/html");
  } else if (!skipMissing) {
    downloadTextFile(`${baseName}.html`, "", "text/html");
  }

  // CSS
  if (files.cssUrl) {
    const cssText = await readBlobUrlText(files.cssUrl);
    downloadTextFile(`${baseName}.css`, cssText, "text/css");
  } else if (!skipMissing) {
    downloadTextFile(`${baseName}.css`, "", "text/css");
  }

  // JS
  if (files.jsUrl) {
    const jsText = await readBlobUrlText(files.jsUrl);
    downloadTextFile(`${baseName}.js`, jsText, "text/javascript");
  } else if (!skipMissing) {
    downloadTextFile(`${baseName}.js`, "", "text/javascript");
  }
}
