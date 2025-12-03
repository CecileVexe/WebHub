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
 * Télécharge un fichier
 */
async function downloadFile(html: string, css: string) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  // Ajouter les fichiers au ZIP
  zip.file('index.html', html);
  zip.file('styles.css', css);
  
  // Générer le ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Télécharger le ZIP
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'canvas-export.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Génère un fichier HTML + CSS et crée un ZIP téléchargeable
 */
export async function exportToZip(canvasData: CanvasData): Promise<{ html: string; css: string }> {
  try {
    const css = generateCSS(canvasData);
    const html = generateHTML(canvasData);

    // Télécharger les fichiers séparément
    await downloadFile(html, css);

    console.log('✅ Fichiers téléchargés avec succès !');

    return { html, css };
  } catch (error) {
    console.error('❌ Erreur lors de la génération des fichiers:', error);
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
  width: ${canvas?.width }px;
  min-height: ${canvas?.height}px;
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

/* Styles de base pour les inputs et selects */
input[type="email"],
input[type="number"],
input[type="date"],
select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  background-color: white;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="email"]:focus,
input[type="number"]:focus,
input[type="date"]:focus,
select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Style des boutons par défaut */
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
  font-family: Arial, sans-serif;
}

button:hover {
  opacity: 0.9;
}

button:active {
  transform: translateY(1px);
}

/* Style des cartes */
article {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

article h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

article p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* Style des titres */
h1, h2 {
  font-weight: bold;
  margin: 0;
}

/* Style des paragraphes */
p {
  line-height: 1.6;
  margin: 0;
}

/* Style des images */
img {
  display: block;
  max-width: 100%;
  height: auto;
}

`;

  // Générer les styles pour chaque élément
  elements.forEach((element) => {
    css += generateElementCSS(element);
  });

  return css;
}

/**
 * Génère le CSS pour un élément et ses enfants
 */
function generateElementCSS(element: Element, isChild: boolean = false): string {
  const className = `element-${element.id.substring(0, 8)}`;
  let css = '';

  css += `.${className} {\n`;
  
  // Position absolue seulement si ce n'est pas un enfant
  if (!isChild) {
    css += `  position: absolute;\n`;
    css += `  left: ${element.x}px;\n`;
    css += `  top: ${element.y}px;\n`;
  }

  // Ajouter les styles personnalisés de l'élément
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

  // Styles pour les enfants
  if (element.children) {
    element.children.forEach((child) => {
      css += generateElementCSS(child, true);
    });
  }

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
      html += `${indentStr}<header class="${fullClass}" id="${htmlId}">${escapeHtml(element.content)}</header>\n`;
      break;

    case "footer":
      html += `${indentStr}<footer class="${fullClass}" id="${htmlId}">${escapeHtml(element.content)}</footer>\n`;
      break;

    case "title":
      html += `${indentStr}<h1 class="${fullClass}" id="${htmlId}">${escapeHtml(element.content)}</h1>\n`;
      break;

    case "text":
      html += `${indentStr}<p class="${fullClass}" id="${htmlId}">${escapeHtml(element.content)}</p>\n`;
      break;

    case "button":
      html += `${indentStr}<button class="${fullClass}" id="${htmlId}" type="button">${escapeHtml(element.content)}</button>\n`;
      break;

    case "image":
      const alt = element.attributes?.alt || "Image";
      html += `${indentStr}<img class="${fullClass}" id="${htmlId}" src="${escapeHtml(element.content)}" alt="${escapeHtml(alt)}" />\n`;
      break;

    case "card":
      html += `${indentStr}<article class="${fullClass}" id="${htmlId}">\n`;
      html += `${indentStr}  <h3>${escapeHtml(element.content)}</h3>\n`;
      if (element.description) {
        html += `${indentStr}  <p>${escapeHtml(element.description)}</p>\n`;
      }
      html += `${indentStr}</article>\n`;
      break;

    case "input-email":
      const placeholder = element.description || element.attributes?.placeholder || 'Email';
      html += `${indentStr}<input type="email" class="${fullClass}" id="${htmlId}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(element.content || '')}" />\n`;
      break;

    case "input-number":
      html += `${indentStr}<input type="number" class="${fullClass}" id="${htmlId}" value="${element.content || 0}" />\n`;
      break;

    case "select":
      const options = element.options || ["Option 1", "Option 2", "Option 3"];
      html += `${indentStr}<select class="${fullClass}" id="${htmlId}">\n`;
      options.forEach(opt => {
        const selected = opt === element.content ? ' selected' : '';
        html += `${indentStr}  <option value="${escapeHtml(opt)}"${selected}>${escapeHtml(opt)}</option>\n`;
      });
      html += `${indentStr}</select>\n`;
      break;

    case "calendar":
      html += `${indentStr}<input type="date" class="${fullClass}" id="${htmlId}" value="${element.content || '2025-12-03'}" />\n`;
      break;

    case "input-form":
      html += `${indentStr}<form class="${fullClass}" id="${htmlId}">\n`;
      html += `${indentStr}  <h2>${escapeHtml(element.content)}</h2>\n`;

      if (element.children && element.children.length > 0) {
        element.children.forEach(child => {
          html += `${indentStr}  ` + generateElementHTML(child, 0).trim() + '\n';
        });
      }

      html += `${indentStr}  <button type="submit" style="margin-top: 15px; width: 100%;">Envoyer</button>\n`;
      html += `${indentStr}</form>\n`;
      break;

    case "map":
      const mapId = `map-${element.id.substring(0, 8)}`;
      const lat = element.coordinates?.lat || 48.8566;
      const lng = element.coordinates?.lng || 2.3522;
      const markers = element.markers || [];
      const markersJson = JSON.stringify(markers).replace(/'/g, '&apos;');

      html += `${indentStr}<div class="${fullClass} leaflet-map-container" id="${mapId}" data-lat="${lat}" data-lng="${lng}" data-markers='${markersJson}'></div>\n`;
      break;

    default:
      html += `${indentStr}<div class="${fullClass}" id="${htmlId}">${escapeHtml(element.content)}</div>\n`;
  }

  return html;
}

/**
 * Échappe les caractères HTML spéciaux
 */
function escapeHtml(text: string | number): string {
  if (text === null || text === undefined) return '';
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.toString().replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Fonction utilitaire pour conversion directe
 */
export function convertJsonToHtml(jsonData: CanvasData): { html: string; css: string } {
  return {
    html: generateHTML(jsonData),
    css: generateCSS(jsonData)
  };
}