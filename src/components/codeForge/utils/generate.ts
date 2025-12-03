import { saveAs } from "file-saver";
import JSZip from "jszip";

interface ElementStyle {
  [key: string]: any;
}

interface ElementAttributes {
  htmlId?: string;
  className?: string;
  alt?: string;
  [key: string]: any;
}

interface Element {
  id: string;
  type: string;
  content: string;
  description?: string;
  x: number;
  y: number;
  style?: ElementStyle;
  attributes?: ElementAttributes;
  options?: string[];
  coordinates?: { lat: number; lng: number };
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    label: string;
    color: string;
  }>;
  children?: Element[];
}

interface CanvasData {
  meta?: {
    version: string;
    date: string;
  };
  canvas?: {
    backgroundColor?: string;
    width?: number;
    height?: number;
  };
  elements: Element[];
}

/**
 * Génère un fichier HTML + CSS à partir du JSON et le compresse en ZIP
 */
export async function exportToZip(canvasData: CanvasData): Promise<{ html: string; css: string }> {
  try {
    const css = generateCSS(canvasData);
    const html = generateHTML(canvasData);

    // Créer une instance JSZip
    const zip = new JSZip();

    // Ajouter les fichiers au ZIP
    zip.file("index.html", html);
    zip.file("styles.css", css);

    // Générer le ZIP et le télécharger
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "canvas_export.zip");

    console.log("✅ ZIP téléchargé avec succès !");

    return { html, css };
  } catch (error) {
    console.error("❌ Erreur lors de la génération du ZIP:", error);
    throw error;
  }
}

/**
 * Génère le CSS basé sur les éléments
 */
export function generateCSS(canvasData: CanvasData): string {
  const elements = canvasData.elements;
  const canvas = canvasData.canvas;

  let css = `/* Style généré automatiquement */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: ${canvas?.backgroundColor || '#f5f5f5'};
  overflow-x: hidden;
}

.canvas-container {
  position: relative;
  width: ${canvas?.width || 800}px;
  min-height: ${canvas?.height || 1000}px;
  margin: 0 auto;
  background-color: ${canvas?.backgroundColor || '#cec0c0'};
}

/* Styles Leaflet */
.leaflet-map-container {
  z-index: 1;
}

.custom-marker {
  background: transparent;
  border: none;
}

`;

  // Générer les styles pour chaque élément
  elements.forEach((element) => {
    const className = `element-${element.id.substring(0, 8)}`;

    css += `.${className} {
  position: absolute;
  left: ${element.x}px;
  top: ${element.y}px;
`;

    // Ajouter uniquement les styles personnalisés de l'élément
    if (element.style) {
      Object.entries(element.style).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Convertir camelCase en kebab-case
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          css += `  ${cssKey}: ${value};\n`;
        }
      });
    }

    css += `}\n\n`;

    // Styles pour les enfants (si présents)
    if (element.children) {
      element.children.forEach((child) => {
        const childClassName = `element-${child.id.substring(0, 8)}`;
        css += `.${childClassName} {\n`;

        if (child.style) {
          Object.entries(child.style).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
              css += `  ${cssKey}: ${value};\n`;
            }
          });
        }

        css += `}\n\n`;
      });
    }
  });

  return css;
}

/**
 * Génère le HTML basé sur les éléments
 */
function generateHTML(canvasData: CanvasData): string {
  const elements = canvasData.elements;

  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page générée automatiquement">
  <title>Canvas Export</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <div class="canvas-container">
`;

  elements.forEach((element) => {
    html += generateElementHTML(element, 4);
  });

  html += `  </div>
  
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    // Initialisation des cartes Leaflet
    document.addEventListener('DOMContentLoaded', function() {
      const mapElements = document.querySelectorAll('.leaflet-map-container');
      
      mapElements.forEach(function(mapElement) {
        const mapId = mapElement.id;
        const lat = parseFloat(mapElement.dataset.lat);
        const lng = parseFloat(mapElement.dataset.lng);
        const markersData = mapElement.dataset.markers ? JSON.parse(mapElement.dataset.markers) : [];
        
        // Créer la carte
        const map = L.map(mapId).setView([lat, lng], 13);
        
        // Ajouter les tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Ajouter les marqueurs
        markersData.forEach(function(marker) {
          const icon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: ' + marker.color + '; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; white-space: nowrap;">' + marker.label + '</div>',
            iconSize: [null, null]
          });
          
          L.marker([marker.lat, marker.lng], { icon: icon }).addTo(map);
        });
      });
    });
  </script>
</body>
</html>`;

  return html;
}

/**
 * Génère le HTML pour un élément spécifique
 */
function generateElementHTML(element: Element, indent: number = 0): string {
  const indentStr = ' '.repeat(indent);
  const className = `element-${element.id.substring(0, 8)}`;
  const htmlId = element.attributes?.htmlId || element.id;
  const customClass = element.attributes?.className || "";
  const fullClass = `${className} ${customClass}`.trim();

  let html = '';

  switch (element.type) {
    case "header":
      html += `${indentStr}<header class="${fullClass}" id="${htmlId}">
${indentStr}  ${escapeHtml(element.content)}
${indentStr}</header>\n`;
      break;

    case "footer":
      html += `${indentStr}<footer class="${fullClass}" id="${htmlId}">
${indentStr}  ${escapeHtml(element.content)}
${indentStr}</footer>\n`;
      break;

    case "title":
      html += `${indentStr}<h1 class="${fullClass}" id="${htmlId}">
${indentStr}  ${escapeHtml(element.content)}
${indentStr}</h1>\n`;
      break;

    case "text":
      html += `${indentStr}<p class="${fullClass}" id="${htmlId}">
${indentStr}  ${escapeHtml(element.content)}
${indentStr}</p>\n`;
      break;

    case "button":
      html += `${indentStr}<button class="${fullClass}" id="${htmlId}">
${indentStr}  ${escapeHtml(element.content)}
${indentStr}</button>\n`;
      break;

    case "image":
      const alt = element.attributes?.alt || "Image";
      html += `${indentStr}<img class="${fullClass}" id="${htmlId}" src="${element.content}" alt="${escapeHtml(alt)}">\n`;
      break;

    case "card":
      html += `${indentStr}<article class="${fullClass}" id="${htmlId}">
${indentStr}  <h3>${escapeHtml(element.content)}</h3>
${element.description ? `${indentStr}  <p>${escapeHtml(element.description)}</p>\n` : ''}${indentStr}</article>\n`;
      break;

    case "input-email":
      html += `${indentStr}<input type="email" class="${fullClass}" id="${htmlId}" placeholder="Email">\n`;
      break;

    case "input-number":
      html += `${indentStr}<input type="number" class="${fullClass}" id="${htmlId}" value="${element.content || 0}">\n`;
      break;

    case "select":
      const options = element.options || ["Option 1", "Option 2", "Option 3"];
      html += `${indentStr}<select class="${fullClass}" id="${htmlId}">\n`;
      options.forEach(opt => {
        html += `${indentStr}  <option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>\n`;
      });
      html += `${indentStr}</select>\n`;
      break;

    case "calendar":
      html += `${indentStr}<input type="date" class="${fullClass}" id="${htmlId}" value="${element.content || '2025-12-03'}">\n`;
      break;

    case "input-form":
      html += `${indentStr}<div class="${fullClass}" id="${htmlId}">\n`;
      html += `${indentStr}  <h2>${escapeHtml(element.content)}</h2>\n`;

      if (element.children && element.children.length > 0) {
        element.children.forEach(child => {
          html += generateElementHTML(child, indent + 2);
        });
      }

      html += `${indentStr}</div>\n`;
      break;

    case "map":
      const mapId = `map-${element.id.substring(0, 8)}`;
      const lat = element.coordinates?.lat || 48.8566;
      const lng = element.coordinates?.lng || 2.3522;
      const markers = element.markers || [];

      html += `${indentStr}<div class="${fullClass} leaflet-map-container" id="${mapId}" data-lat="${lat}" data-lng="${lng}" data-markers='${JSON.stringify(markers)}'>\n`;
      html += `${indentStr}</div>\n`;
      break;

    default:
      html += `${indentStr}<div class="${fullClass}" id="${htmlId}">
${indentStr}  ${escapeHtml(element.content)}
${indentStr}</div>\n`;
  }

  return html;
}

/**
 * Échappe les caractères HTML spéciaux
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.toString().replace(/[&<>"']/g, (m) => map[m]);
}

// Fonction utilitaire pour utilisation directe
export function convertJsonToHtml(jsonData: CanvasData): { html: string; css: string } {
  return {
    html: generateHTML(jsonData),
    css: generateCSS(jsonData)
  };
}