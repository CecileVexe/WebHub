
import JSZip from 'jszip';

/**
 * Génère un fichier HTML + CSS à partir du JSON et le compresse en ZIP
 * @param {Array} elementsData - Le tableau d'objets JSON contenant les éléments
 * @returns {Promise<void>}
 */
export async function generateAndDownloadZip(elementsData: any[]) {
  try {
    const css = generateCSS(elementsData);

    const html = generateHTML(elementsData, css);

    console.log("Généré HTML:", html);
    console.log("Généré CSS:", css);

    // 3. Créer le ZIP avec JSZip
    const zip = new JSZip();
    zip.file("index.html", html);
    zip.file("style.css", css);

    // 4. Générer le fichier ZIP
    const zipContent = await zip.generateAsync({ type: "blob" });

    // 5. Déclencher le téléchargement
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipContent);
    link.download = "canvas-export.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log("✅ ZIP téléchargé avec succès !");
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
  overflow: hidden;
}

.canvas-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: white;
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

    // Ajouter les styles spécifiques
    if (element.style) {
      if (element.style.width) css += `  width: ${element.style.width};\n`;
      if (element.style.height) css += `  height: ${element.style.height};\n`;
      if (element.style.backgroundColor)
        css += `  background-color: ${element.style.backgroundColor};\n`;
      if (element.style.color) css += `  color: ${element.style.color};\n`;
      if (element.style.padding) css += `  padding: ${element.style.padding};\n`;
      if (element.style.fontFamily)
        css += `  font-family: ${element.style.fontFamily};\n`;
    }

    // Animations CSS
    if (element.animation && element.animation.type !== "none") {
      css += `  animation: ${element.animation.type} ${element.animation.duration}s ease-in-out ${element.animation.delay}s infinite;\n`;
    }

    css += `}\n\n`;
  });

  // Ajouter les animations keyframes
  css += `/* Animations */
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
  50% { transform: translateY(-10px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

  return css;
}

/**
 * Génère le HTML basé sur les éléments
 * @param {Array} elementsData - Le tableau des éléments
 * @param {string} css - Le contenu CSS
 * @returns {string} - Le contenu HTML
 */
function generateHTML(elementsData: any[], css: string) {
  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas Export</title>
  <style>
${css}
  </style>
</head>
<body>
  <div class="canvas-container">
`;

  // Générer les éléments HTML
  elementsData.forEach((element) => {
    const className = `element-${element.id.substring(0, 8)}`;
    const htmlId = element.attributes?.htmlId || element.id;
    const customClass = element.attributes?.className || "";

    switch (element.type) {
      case "card":
        html += `    <div class="${className} ${customClass}" id="${htmlId}">
      <h3>${escapeHtml(element.content)}</h3>
      <p>${escapeHtml(element.description)}</p>
    </div>\n`;
        break;

      case "image":
        // Gérer les images (URL ou base64)
        const imageSrc = element.content;
        html += `    <img class="${className} ${customClass}" id="${htmlId}" src="${imageSrc}" alt="Image element">\n`;
        break;

      case "text":
        html += `    <div class="${className} ${customClass}" id="${htmlId}">
      ${escapeHtml(element.content)}
    </div>\n`;
        break;

      default:
        html += `    <div class="${className} ${customClass}" id="${htmlId}">
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
function escapeHtml(text : string) : string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}



