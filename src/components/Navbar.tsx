import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

interface NavbarProps {
  projectName: string;
  activeTab: 'design' | 'code' | 'animation' | 'preview';
  onTabChange: (tab: 'design' | 'code' | 'animation' | 'preview') => void;
}

const Navbar: React.FC<NavbarProps> = ({ projectName, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  return (
    <nav className="figma-navbar" role="navigation" aria-label="Navigation principale du projet">
      <div className="navbar-left">
        <button 
          onClick={() => navigate('/')} 
          className="nav-icon-button" 
          aria-label="Retour à la page d'accueil"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="project-title-nav">
          <h1>{projectName}</h1>
        </div>
      </div>
      
      <div className="navbar-center">
        <div className="toolbar" role="tablist" aria-label="Modes de travail">
          <button 
            className={`toolbar-button ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => onTabChange('design')}
            role="tab"
            aria-selected={activeTab === 'design'}
            aria-label="Mode Design - Créer et éditer vos composants"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M21 7.5L12 2L3 7.5M21 7.5L12 13M21 7.5V16.5L12 22M12 13L3 7.5M12 13V22M3 7.5V16.5L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Design</span>
          </button>
          
          <button 
            className={`toolbar-button ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => onTabChange('code')}
            role="tab"
            aria-selected={activeTab === 'code'}
            aria-label="Mode Design to Code - Convertir votre design en code"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Design to Code</span>
          </button>
          
          <button 
            className={`toolbar-button ${activeTab === 'animation' ? 'active' : ''}`}
            onClick={() => onTabChange('animation')}
            role="tab"
            aria-selected={activeTab === 'animation'}
            aria-label="Mode Add Animation - Ajouter des animations à votre code"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Add Animation</span>
          </button>
          
          <button 
            className={`toolbar-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => onTabChange('preview')}
            role="tab"
            aria-selected={activeTab === 'preview'}
            aria-label="Mode Preview - Visualiser vos fichiers HTML, CSS et JavaScript"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Preview</span>
          </button>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className='logo'>
            <img className='ui-web-logo' src="/UI Web.svg" alt="Logo UI Web Factory" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
