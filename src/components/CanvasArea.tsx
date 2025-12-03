import { useState } from 'react';
import PreviewMode from './PreviewMode';
import '../styles/Canvas.css';
import MainAnimFlow from "./animFlow/main";

interface CanvasAreaProps {
  activeTab: 'design' | 'code' | 'animation' | 'preview';
  projectName: string;
  projectDescription: string;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ activeTab, projectName, projectDescription }) => {
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [cssFile, setCssFile] = useState<File | null>(null);
  const [jsFile, setJsFile] = useState<File | null>(null);

  return (
    <main className="canvas-area" role="main" aria-label="Zone de travail principale">
      <div className="canvas-container">
        {activeTab === 'design' && (
          <div role="tabpanel" aria-labelledby="design-tab">
            <p>Mode Design - À venir</p>
          </div>
        )}
        
        {activeTab === 'code' && (
          <div role="tabpanel" aria-labelledby="code-tab">
            <p>Mode Code - À venir</p>
          </div>
        )}
        
        {activeTab === 'animation' && (
          <div role="tabpanel" aria-labelledby="animation-tab">
            <MainAnimFlow />
          </div>
        )}
        
        {activeTab === 'preview' && (
          <PreviewMode 
            htmlFile={htmlFile}
            cssFile={cssFile}
            jsFile={jsFile}
            setHtmlFile={setHtmlFile}
            setCssFile={setCssFile}
            setJsFile={setJsFile}
          />
        )}
      </div>
    </main>
  );
};

export default CanvasArea;
