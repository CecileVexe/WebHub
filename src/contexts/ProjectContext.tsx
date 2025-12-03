import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Project } from '../types/Project';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  clearProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'webhub_projects';

// Initialiser avec des projets par défaut si le localStorage est vide
const getInitialProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored projects:', error);
      return getDefaultProjects();
    }
  }
  
  return getDefaultProjects();
};

const getDefaultProjects = (): Project[] => {
  const now = new Date().toISOString();
  return [
    {
      id: '1',
      name: 'WebHub Platform',
      description: 'Plateforme de gestion de projets web avec React et TypeScript',
      status: 'active',
      tags: ['React', 'TypeScript', 'Web', 'Platform'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '2',
      name: 'E-Commerce Dashboard',
      description: 'Tableau de bord pour la gestion d\'une boutique en ligne',
      status: 'active',
      tags: ['E-Commerce', 'Dashboard', 'Analytics'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '3',
      name: 'Mobile App Integration',
      description: 'Intégration API pour application mobile',
      status: 'completed',
      tags: ['Mobile', 'API', 'Integration'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '4',
      name: 'Analytics System',
      description: 'Système d\'analyse et de reporting en temps réel',
      status: 'active',
      tags: ['Analytics', 'Real-time', 'Reporting'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '5',
      name: 'Legacy Migration',
      description: 'Migration d\'une application legacy vers une architecture moderne',
      status: 'archived',
      tags: ['Migration', 'Legacy', 'Modernization'],
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);

  // Synchroniser avec le localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
    }
  }, [projects]);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...projectData, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find((project) => project.id === id);
  };

  const clearProjects = () => {
    setProjects([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        clearProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
