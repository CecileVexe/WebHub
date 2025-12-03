import { useState } from 'react';
import '../styles/FileUploader.css';

interface FileUploaderProps {
  onRender: (htmlContent: string, cssContent: string, jsContent: string) => void;
  htmlFile: File | null;
  cssFile: File | null;
  jsFile: File | null;
  setHtmlFile: (file: File | null) => void;
  setCssFile: (file: File | null) => void;
  setJsFile: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onRender, 
  htmlFile, 
  cssFile, 
  jsFile, 
  setHtmlFile, 
  setCssFile, 
  setJsFile 
}) => {
  const [error, setError] = useState<string>('');

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileType: 'html' | 'css' | 'js'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'html' && extension !== 'html') {
      setError('Le fichier HTML doit avoir l\'extension .html');
      return;
    }
    if (fileType === 'css' && extension !== 'css') {
      setError('Le fichier CSS doit avoir l\'extension .css');
      return;
    }
    if (fileType === 'js' && extension !== 'js') {
      setError('Le fichier JS doit avoir l\'extension .js');
      return;
    }

    setError('');
    
    switch (fileType) {
      case 'html':
        setHtmlFile(file);
        break;
      case 'css':
        setCssFile(file);
        break;
      case 'js':
        setJsFile(file);
        break;
    }
  };

  const handleRender = async () => {
    if (!htmlFile) {
      setError('Le fichier HTML est obligatoire');
      return;
    }

    try {
      const htmlContent = await htmlFile.text();
      const cssContent = cssFile ? await cssFile.text() : '';
      const jsContent = jsFile ? await jsFile.text() : '';

      onRender(htmlContent, cssContent, jsContent);
      setError('');
    } catch (err) {
      setError('Erreur lors de la lecture des fichiers');
      console.error(err);
    }
  };

  const handleReset = () => {
    setHtmlFile(null);
    setCssFile(null);
    setJsFile(null);
    setError('');
  };

  return (
    <div className="file-uploader" role="region" aria-labelledby="file-uploader-title">
      <h3 id="file-uploader-title">Déposer vos fichiers</h3>
      
      <fieldset className="file-input-group">
        <legend className="sr-only">Sélection des fichiers à prévisualiser</legend>
        
        <label className="file-label required">
          <span>HTML (obligatoire)</span>
          <input
            type="file"
            accept=".html"
            onChange={(e) => handleFileChange(e, 'html')}
            id="html-file-input"
            aria-required="true"
            aria-describedby={htmlFile ? "html-file-name" : undefined}
          />
          {htmlFile && <span className="file-name" id="html-file-name" aria-live="polite">{htmlFile.name}</span>}
        </label>

        <label className="file-label">
          <span>CSS (optionnel)</span>
          <input
            type="file"
            accept=".css"
            onChange={(e) => handleFileChange(e, 'css')}
            id="css-file-input"
            aria-describedby={cssFile ? "css-file-name" : undefined}
          />
          {cssFile && <span className="file-name" id="css-file-name" aria-live="polite">{cssFile.name}</span>}
        </label>

        <label className="file-label">
          <span>JavaScript (optionnel)</span>
          <input
            type="file"
            accept=".js"
            onChange={(e) => handleFileChange(e, 'js')}
            id="js-file-input"
            aria-describedby={jsFile ? "js-file-name" : undefined}
          />
          {jsFile && <span className="file-name" id="js-file-name" aria-live="polite">{jsFile.name}</span>}
        </label>
      </fieldset>

      {error && <div className="error-message" role="alert" aria-live="assertive">{error}</div>}

      <div className="button-group">
        <button 
          type="button"
          className="render-button" 
          onClick={handleRender}
          disabled={!htmlFile}
          aria-label="Afficher le rendu des fichiers sélectionnés"
        >
          Voir le rendu
        </button>
        <button 
          type="button"
          className="reset-button" 
          onClick={handleReset}
          aria-label="Réinitialiser tous les fichiers sélectionnés"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
