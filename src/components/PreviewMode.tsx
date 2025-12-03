import { useState, useRef } from 'react';
import FileUploader from './FileUploader';
import '../styles/Canvas.css';

interface PreviewModeProps {
  htmlFile: File | null;
  cssFile: File | null;
  jsFile: File | null;
  setHtmlFile: (file: File | null) => void;
  setCssFile: (file: File | null) => void;
  setJsFile: (file: File | null) => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({ 
  htmlFile, 
  cssFile, 
  jsFile, 
  setHtmlFile, 
  setCssFile, 
  setJsFile 
}) => {
  const [renderedContent, setRenderedContent] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleRender = (htmlContent: string, cssContent: string, jsContent: string) => {
    let processedHtml = htmlContent;
    
    // Vérifier si le HTML contient déjà une structure complète
    const hasHtmlTag = /<html/i.test(htmlContent);
    const hasHeadTag = /<head/i.test(htmlContent);
    const hasBodyTag = /<body/i.test(htmlContent);
    
    let fullDocument = '';
    
    if (hasHtmlTag && hasHeadTag && hasBodyTag) {
      // Le HTML est déjà complet, on l'injecte directement
      processedHtml = htmlContent;
      
      // Injecter le CSS uploadé dans le head s'il existe
      if (cssContent) {
        const styleTag = `<style>\n${cssContent}\n</style>`;
        if (/<\/head>/i.test(processedHtml)) {
          processedHtml = processedHtml.replace(/<\/head>/i, `${styleTag}\n</head>`);
        }
      }
      
      // Injecter le JS uploadé avant la fermeture du body s'il existe
      if (jsContent) {
        const scriptTag = `<script>\ntry {\n${jsContent}\n} catch (error) {\nconsole.error('JavaScript Error:', error);\n}\n</script>`;
        if (/<\/body>/i.test(processedHtml)) {
          processedHtml = processedHtml.replace(/<\/body>/i, `${scriptTag}\n</body>`);
        }
      }
      
      fullDocument = processedHtml;
    } else {
      // Créer une structure HTML complète
      fullDocument = `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rendu</title>
            <style>
                {
                    margin: 0;
                    padding: 0;
                }
                ${cssContent}
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              try {
                ${jsContent}
              } catch (error) {
                console.error('JavaScript Error:', error);
              }
            </script>
          </body>
        </html>
      `;
    }
    
    // Traiter les liens relatifs vers les fichiers CSS et JS externes
    // Remplacer les liens relatifs par le contenu inline
    fullDocument = fullDocument.replace(
      /<link\s+[^>]*href=["']([^"']+\.css)["'][^>]*>/gi,
      (match, href) => {
        // Si c'est un lien externe (http/https), le garder tel quel
        if (/^https?:\/\//i.test(href)) {
          return match;
        }
        // Sinon, commenter le lien (le CSS uploadé sera utilisé)
        return `<!-- ${match} - Lien CSS relatif désactivé, utilisez l'upload CSS -->`;
      }
    );
    
    fullDocument = fullDocument.replace(
      /<script\s+[^>]*src=["']([^"']+\.js)["'][^>]*><\/script>/gi,
      (match, src) => {
        // Si c'est un lien externe (http/https), le garder tel quel
        if (/^https?:\/\//i.test(src)) {
          return match;
        }
        // Sinon, commenter le script (le JS uploadé sera utilisé)
        return `<!-- ${match} - Lien JS relatif désactivé, utilisez l'upload JS -->`;
      }
    );
    
    setRenderedContent(fullDocument);
    
    // Forcer le rechargement de l'iframe avec le nouveau contenu
    setTimeout(() => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.srcdoc = fullDocument;
      }
      
      // Scroll automatique vers l'aperçu
      if (previewRef.current) {
        previewRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  return (
    <div className="code-view" role="region" aria-labelledby="preview-mode-title">
      <h2 id="preview-mode-title" className="sr-only">Mode prévisualisation</h2>
      <FileUploader 
        onRender={handleRender}
        htmlFile={htmlFile}
        cssFile={cssFile}
        jsFile={jsFile}
        setHtmlFile={setHtmlFile}
        setCssFile={setCssFile}
        setJsFile={setJsFile}
      />
      {renderedContent && (
        <section className="render-preview" ref={previewRef} aria-labelledby="preview-title">
          <h3 id="preview-title" className='render-preview-title'>Aperçu du rendu</h3>
          <div role="status" aria-live="polite" className="sr-only">
            Aperçu chargé avec succès
          </div>
          <iframe
            ref={iframeRef}
            className="preview-iframe"
            title="Aperçu du rendu HTML, CSS et JavaScript"
            sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
            srcDoc={renderedContent}
            aria-label="Fenêtre de prévisualisation du code"
          />
        </section>
      )}
    </div>
  );
};

export default PreviewMode;
