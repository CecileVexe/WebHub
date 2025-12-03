import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';
import { useState } from 'react';
import Navbar from './Navbar';
import ProjectInfo from './ProjectInfo';
import CanvasArea from './CanvasArea';
import '../styles/ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject } = useProjects();
  const [activeTab, setActiveTab] = useState<'design' | 'code' | 'animation'>('design');
  const [showProjectInfo, setShowProjectInfo] = useState(true);

  const project = id ? getProject(id) : undefined;

  if (!project) {
    return (
      <div className="project-detail">
        <div className="project-not-found">
          <h1>Projet non trouvé</h1>
          <p>Le projet avec l'ID {id} n'existe pas.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <Navbar 
        projectName={project.title}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="figma-content">
        {!showProjectInfo && (
          <button 
            className="toggle-sidebar-button"
            onClick={() => setShowProjectInfo(true)}
            title="Afficher les détails du projet"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
            </svg>
          </button>
        )}
        
        {showProjectInfo && (
          <ProjectInfo 
            project={project} 
            onClose={() => setShowProjectInfo(false)}
          />
        )}
        
        <CanvasArea 
          activeTab={activeTab}
          projectName={project.title}
          projectDescription={project.description}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
