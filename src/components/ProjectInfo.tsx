import type { Project } from '../api/projects';
import '../styles/Sidebar.css';

interface ProjectInfoProps {
  project: Project;
  onClose: () => void;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project, onClose }) => {
  return (
    <aside className="left-sidebar">
      {/* Sidebar Header with Close Button */}
      <div className="sidebar-header">
        <h2 className="sidebar-main-title">Project Details</h2>
        <button onClick={onClose} className="sidebar-close-button" title="Masquer le panneau">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* Project Info Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
          </svg>
          Project Info
        </h3>
        <div className="info-list">
          <div className="info-row">
            <span className="info-label">Title</span>
            <span className="info-value">{project.title}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Category</span>
            <span className="info-value">{project.category}</span>
          </div>
          <div className="info-row">
            <span className="info-label">ID</span>
            <span className="info-value">#{project.id}</span>
          </div>
        </div>
      </div>
      
      {/* Tags Section */}
      {project.tags && project.tags.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tags
          </h3>
          <div className="tags-container">
            {project.tags.map((tag, index) => (
              <span key={index} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Description Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Description
        </h3>
        <p className="description-text">{project.description}</p>
      </div>
    </aside>
  );
};

export default ProjectInfo;
