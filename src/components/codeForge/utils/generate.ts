
import { saveAs } from "file-saver";
import JSZip from "jszip";

/**
 * Génère un fichier HTML + CSS à partir du JSON et le compresse en ZIP
 * @param {Array} elementsData - Le tableau d'objets JSON contenant les éléments
 * @returns {Promise<void>}
 */
export async function exportToZip(elementsData: any[]) {
  try {
    
    
    const css = generateCSS(elementsData);
    const html = generateHTML(elementsData);

    // Créer une instance JSZip
    const zip = new JSZip();
    
    // Ajouter les fichiers au ZIP
    zip.file("index.html", html);
    zip.file("styles.css", css);
    
    // Générer le ZIP et le télécharger
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "canvas_export.zip");
    
    console.log("✅ ZIP téléchargé avec succès !");
    
    // Retourner les deux fichiers séparés
    return {
      html,
      css
    };
  } catch (error) {
    console.error("❌ Erreur lors de la génération du ZIP:", error);
  }
}

/**
 * Génère le CSS basé sur les éléments
 * @param {Array} elementsData - Le tableau des éléments
 * @returns {string} - The CSS content
 */
export function generateCSS(elementsData: any[]) {
  let css = `/* Style généré automatiquement */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  overflow-x: hidden;
}

/* Lien d'évitement pour lecteurs d'écran */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}

.canvas-container {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background-color: white;
}

/* Styles pour les boutons accessibles */
button {
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.05);
}

button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Styles pour les liens accessibles */
a:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Styles pour les inputs accessibles */
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Styles par défaut pour les vidéos */
video {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Styles par défaut pour les images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Animations communes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

`;

  // Générer les styles pour chaque élément
  elementsData.forEach((element) => {
    const className = `element-${element.id.substring(0, 8)}`;

    css += `.${className} {
  position: absolute;
  left: ${element.x}px;
  top: ${element.y}px;
`;

    // Styles spécifiques par type
    switch (element.type) {
      case "header":
        css += `  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  z-index: 100;
`;
        break;

      case "footer":
        css += `  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  z-index: 100;
`;
        break;

      case "title":
      case "h1":
      case "h2":
      case "h3":
      case "h4":
        css += `  font-size: 32px;
  font-weight: bold;
  line-height: 1.2;
`;
        break;

      case "button":
        css += `  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  background-color: #0066cc;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
`;
        break;

      case "link":
      case "a":
        css += `  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
`;
        break;

      case "input":
      case "textarea":
      case "select":
        css += `  display: flex;
  flex-direction: column;
  gap: 5px;
`;
        break;

      case "text":
      case "paragraph":
        css += `  font-size: 16px;
  line-height: 1.6;
`;
        break;

      case "video":
      case "audio":
        css += `  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
        break;

      case "image":
        css += `  overflow: hidden;
  border-radius: 4px;
`;
        break;

      case "card":
        css += `  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
        break;

      case "list":
        css += `  padding-left: 20px;
  line-height: 1.8;
`;
        break;

      case "nav":
      case "navigation":
        css += `  display: flex;
  align-items: center;
  gap: 20px;
`;
        break;

      case "section":
        css += `  padding: 20px;
`;
        break;

      case "form":
        css += `  display: flex;
  flex-direction: column;
  gap: 15px;
`;
        break;
    }

    // Ajouter les styles personnalisés
    if (element.style) {
      if (element.style.width) css += `  width: ${element.style.width};\n`;
      if (element.style.height) css += `  height: ${element.style.height};\n`;
      if (element.style.backgroundColor)
        css += `  background-color: ${element.style.backgroundColor};\n`;
      if (element.style.color) css += `  color: ${element.style.color};\n`;
      if (element.style.padding) css += `  padding: ${element.style.padding};\n`;
      if (element.style.fontFamily)
        css += `  font-family: ${element.style.fontFamily};\n`;
      if (element.style.fontSize)
        css += `  font-size: ${element.style.fontSize};\n`;
      if (element.style.fontWeight)
        css += `  font-weight: ${element.style.fontWeight};\n`;
      if (element.style.borderRadius)
        css += `  border-radius: ${element.style.borderRadius};\n`;
      if (element.style.boxShadow)
        css += `  box-shadow: ${element.style.boxShadow};\n`;
    }

    // Animations CSS
    if (element.animation && element.animation.type !== "none") {
      css += `  animation: ${element.animation.type} ${element.animation.duration}s ease-in-out ${element.animation.delay}s infinite;\n`;
    }

    css += `}\n\n`;
  });

  return css;
}

/**
 * Génère le HTML basé sur les éléments avec accessibilité complète
 * @param {Array} elementsData - Le tableau des éléments
 * @returns {string} - Le contenu HTML
 */
function generateHTML(elementsData: any[]) {
  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page générée automatiquement">
  <title>Canvas Export</title>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Aller au contenu principal</a>
  <div class="canvas-container" role="main" id="main-content">
`;

  elementsData.forEach((element) => {
    const className = `element-${element.id.substring(0, 8)}`;
    const htmlId = element.attributes?.htmlId || element.id;
    const customClass = element.attributes?.className || "";
    const ariaLabel = element.attributes?.ariaLabel || element.attributes?.alt || element.content;
    const ariaDescribedBy = element.attributes?.ariaDescribedBy || "";

    switch (element.type) {
      case "header":
        html += `    <header class="${className} ${customClass}" id="${htmlId}" role="banner">
      ${escapeHtml(element.content)}
    </header>\n`;
        break;

      case "footer":
        html += `    <footer class="${className} ${customClass}" id="${htmlId}" role="contentinfo">
      ${escapeHtml(element.content)}
    </footer>\n`;
        break;

      case "nav":
      case "navigation":
        html += `    <nav class="${className} ${customClass}" id="${htmlId}" role="navigation" aria-label="${escapeHtml(ariaLabel)}">
      ${escapeHtml(element.content)}
    </nav>\n`;
        break;

      case "title":
      case "h1":
        html += `    <h1 class="${className} ${customClass}" id="${htmlId}">
      ${escapeHtml(element.content)}
    </h1>\n`;
        break;

      case "h2":
        html += `    <h2 class="${className} ${customClass}" id="${htmlId}">
      ${escapeHtml(element.content)}
    </h2>\n`;
        break;

      case "h3":
        html += `    <h3 class="${className} ${customClass}" id="${htmlId}">
      ${escapeHtml(element.content)}
    </h3>\n`;
        break;

      case "h4":
        html += `    <h4 class="${className} ${customClass}" id="${htmlId}">
      ${escapeHtml(element.content)}
    </h4>\n`;
        break;

      case "button":
        const buttonType = element.attributes?.buttonType || "button";
        const disabled = element.attributes?.disabled ? "disabled" : "";
        const ariaPressed = element.attributes?.ariaPressed !== undefined ? `aria-pressed="${element.attributes.ariaPressed}"` : "";
        html += `    <button class="${className} ${customClass}" id="${htmlId}" type="${buttonType}" ${disabled} ${ariaPressed} aria-label="${escapeHtml(ariaLabel)}">
      ${escapeHtml(element.content)}
    </button>\n`;
        break;

      case "link":
      case "a":
        const href = element.attributes?.href || "#";
        const target = element.attributes?.target || "";
        const rel = target === "_blank" ? 'rel="noopener noreferrer"' : "";
        html += `    <a class="${className} ${customClass}" id="${htmlId}" href="${href}" ${target ? `target="${target}"` : ""} ${rel} aria-label="${escapeHtml(ariaLabel)}">
      ${escapeHtml(element.content)}
    </a>\n`;
        break;

      case "input":
        const inputType = element.attributes?.inputType || "text";
        const placeholder = element.attributes?.placeholder || "";
        const required = element.attributes?.required ? "required" : "";
        const inputLabel = element.attributes?.label || element.content;
        html += `    <div class="${className} ${customClass}">
      <label for="${htmlId}">${escapeHtml(inputLabel)}</label>
      <input type="${inputType}" id="${htmlId}" name="${htmlId}" placeholder="${escapeHtml(placeholder)}" ${required} aria-label="${escapeHtml(ariaLabel)}">
    </div>\n`;
        break;

      case "textarea":
        const rows = element.attributes?.rows || 4;
        const textareaLabel = element.attributes?.label || element.content;
        html += `    <div class="${className} ${customClass}">
      <label for="${htmlId}">${escapeHtml(textareaLabel)}</label>
      <textarea id="${htmlId}" name="${htmlId}" rows="${rows}" aria-label="${escapeHtml(ariaLabel)}"></textarea>
    </div>\n`;
        break;

      case "select":
        const options = element.attributes?.options || [];
        const selectLabel = element.attributes?.label || element.content;
        html += `    <div class="${className} ${customClass}">
      <label for="${htmlId}">${escapeHtml(selectLabel)}</label>
      <select id="${htmlId}" name="${htmlId}" aria-label="${escapeHtml(ariaLabel)}">
        ${options.map((opt: any) => `<option value="${escapeHtml(opt.value || opt)}">${escapeHtml(opt.label || opt)}</option>`).join('\n        ')}
      </select>
    </div>\n`;
        break;

      case "card":
        html += `    <article class="${className} ${customClass}" id="${htmlId}" role="article" aria-label="${escapeHtml(ariaLabel)}">
      <h3>${escapeHtml(element.content)}</h3>
      ${element.description ? `<p>${escapeHtml(element.description)}</p>` : ''}
    </article>\n`;
        break;

      case "video":
        const videoSrc = element.content;
        const videoAttrs = [
          'controls',
          element.attributes?.autoplay ? 'autoplay' : '',
          element.attributes?.loop ? 'loop' : '',
          element.attributes?.muted ? 'muted' : ''
        ].filter(Boolean).join(' ');
        
        html += `    <video class="${className} ${customClass}" id="${htmlId}" ${videoAttrs} aria-label="${escapeHtml(ariaLabel)}">
      <source src="${videoSrc}" type="video/mp4">
      <source src="${videoSrc}" type="video/webm">
      <track kind="captions" src="${element.attributes?.captionsUrl || ''}" srclang="fr" label="Français" ${element.attributes?.captionsUrl ? '' : 'style="display:none;"'}>
      Votre navigateur ne supporte pas la balise vidéo.
    </video>\n`;
        break;

      case "audio":
        const audioSrc = element.content;
        html += `    <audio class="${className} ${customClass}" id="${htmlId}" controls aria-label="${escapeHtml(ariaLabel)}">
      <source src="${audioSrc}" type="audio/mpeg">
      <source src="${audioSrc}" type="audio/ogg">
      Votre navigateur ne supporte pas la balise audio.
    </audio>\n`;
        break;

      case "image":
        const imageSrc = element.content;
        const alt = element.attributes?.alt || "Image";
        const isDecorative = element.attributes?.decorative || false;
        html += `    <img class="${className} ${customClass}" id="${htmlId}" src="${imageSrc}" alt="${isDecorative ? '' : escapeHtml(alt)}" ${isDecorative ? 'role="presentation"' : ''}>\n`;
        break;

      case "text":
      case "paragraph":
        html += `    <p class="${className} ${customClass}" id="${htmlId}">
      ${escapeHtml(element.content)}
    </p>\n`;
        break;

      case "list":
        const listItems = element.attributes?.items || [];
        const listType = element.attributes?.ordered ? "ol" : "ul";
        html += `    <${listType} class="${className} ${customClass}" id="${htmlId}" role="list">
      ${listItems.map((item: string) => `<li role="listitem">${escapeHtml(item)}</li>`).join('\n      ')}
    </${listType}>\n`;
        break;

      case "section":
        html += `    <section class="${className} ${customClass}" id="${htmlId}" aria-labelledby="${htmlId}-heading">
      ${element.attributes?.heading ? `<h2 id="${htmlId}-heading">${escapeHtml(element.attributes.heading)}</h2>` : ''}
      ${escapeHtml(element.content)}
    </section>\n`;
        break;

      case "form":
        const formAction = element.attributes?.action || "#";
        const formMethod = element.attributes?.method || "post";
        html += `    <form class="${className} ${customClass}" id="${htmlId}" action="${formAction}" method="${formMethod}" aria-label="${escapeHtml(ariaLabel)}">
      ${escapeHtml(element.content)}
    </form>\n`;
        break;

      default:
        html += `    <div class="${className} ${customClass}" id="${htmlId}" role="region" aria-label="${escapeHtml(ariaLabel)}">
      ${escapeHtml(element.content)}
    </div>\n`;
    }
  });

  html += `  </div>
</body>
</html>`;

  return html;
}

/**
 * Échappe les caractères HTML spéciaux
 * @param {string} text - Le texte à échapper
 * @returns {string} - Le texte échappé
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}