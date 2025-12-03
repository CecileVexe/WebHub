import '../styles/Canvas.css';

interface CanvasAreaProps {
  activeTab: 'design' | 'code' | 'animation';
  projectName: string;
  projectDescription: string;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ activeTab, projectName, projectDescription }) => {
  return (
    <main className="canvas-area">
      <div className="canvas-container">
        {activeTab === 'design' && (
          <div>design</div>
        )}
        
        {activeTab === 'code' && (
          <div>code</div>
        )}
        
        {activeTab === 'animation' && (
          <div>animation</div>
        )}
      </div>
    </main>
  );
};

export default CanvasArea;
