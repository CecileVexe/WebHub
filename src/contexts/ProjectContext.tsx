import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Project } from '../types/Project';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  getProject: (id: number) => Project | undefined;
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
  return [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A modern online shopping experience with seamless checkout and product browsing.",
      category: "E-Commerce",
      imageUrl:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      tags: ["React", "TypeScript", "Tailwind"],
      color: "purple",
    },
    {
      id: 2,
      title: "Portfolio Website",
      description:
        "Clean and minimalist portfolio showcasing creative work and professional experience.",
      category: "Portfolio",
      imageUrl:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      tags: ["Next.js", "Design", "Animation"],
      color: "pink",
    },
    {
      id: 3,
      title:
        "Dashboard Analytics",
      description:
        "Data visualization dashboard with real-time metrics and interactive charts.",
      category: "Dashboard",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      tags: ["React", "Charts", "Analytics"],
      color: "orange",
    },
    {
      id: 4,
      title: "Social Media App",
      description:
        "Connect with friends and share moments through an engaging social platform.",
      category: "Social",
      imageUrl:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      tags: ["Mobile", "Social", "React Native"],
      color: "pink",
    },
    {
      id: 5,
      title: "Blog Platform",
      description:
        "Content management system for writers with markdown support and SEO optimization.",
      category: "Content",
      imageUrl:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
      tags: ["CMS", "SEO", "Publishing"],
      color: "purple",
    },
    {
      id: 6,
      title: "Booking System",
      description:
        "Streamlined reservation and scheduling system for service-based businesses.",
      category: "Business",
      imageUrl:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
      tags: ["Booking", "Calendar", "Payments"],
      color: "orange",
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

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now(),
    };

    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: number, projectData: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...projectData }
          : project
      )
    );
  };

  const deleteProject = (id: number) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const getProject = (id: number): Project | undefined => {
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
