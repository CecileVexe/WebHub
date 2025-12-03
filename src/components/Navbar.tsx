import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

interface NavbarProps {
  projectName: string;
  projectStatus: 'active' | 'completed' | 'archived';
  activeTab: 'design' | 'code' | 'animation';
  onTabChange: (tab: 'design' | 'code' | 'animation') => void;
}

const Navbar: React.FC<NavbarProps> = ({ projectName, projectStatus, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  return (
    <nav className="figma-navbar">
      <div className="navbar-left">
        <button onClick={() => navigate('/')} className="nav-icon-button" title="Retour à l'accueil">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="project-title-nav">
          <h1>{projectName}</h1>
          <span className={`status-badge status-${projectStatus}`}>
            {projectStatus}
          </span>
        </div>
      </div>
      
      <div className="navbar-center">
        <div className="toolbar">
          <button 
            className={`toolbar-button ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => onTabChange('design')}
            title="Mode Design - Créer et éditer vos composants"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 7.5L12 2L3 7.5M21 7.5L12 13M21 7.5V16.5L12 22M12 13L3 7.5M12 13V22M3 7.5V16.5L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Design</span>
          </button>
          
          <button 
            className={`toolbar-button ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => onTabChange('code')}
            title="Design to Code - Convertir votre design en code"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Design to Code</span>
          </button>
          
          <button 
            className={`toolbar-button ${activeTab === 'animation' ? 'active' : ''}`}
            onClick={() => onTabChange('animation')}
            title="Add Animation - Ajouter des animations à votre code"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Add Animation</span>
          </button>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className='logo'>
            <img className='ui-web-logo' src="/UI Web.svg" alt="UI WEB FACTORY" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
