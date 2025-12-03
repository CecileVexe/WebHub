import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Project } from '../api/projects';
import * as projectsApi from '../api/projects';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les projets depuis l'API au montage
  const refreshProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProjects = await projectsApi.listProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMsg);
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newProject = await projectsApi.createProject(projectData);
      setProjects((prev) => [...prev, newProject]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMsg);
      console.error('Error creating project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProject = await projectsApi.updateProject(id, projectData);
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? updatedProject : project
        )
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMsg);
      console.error('Error updating project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await projectsApi.deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMsg);
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProject = (id: string): Project | undefined => {
    return projects.find((project) => project.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        refreshProjects,
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
