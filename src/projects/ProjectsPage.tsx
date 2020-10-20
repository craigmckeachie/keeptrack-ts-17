import React, { useEffect, useReducer, useState } from 'react';
import { Project } from './Project';
import { projectAPI } from './projectAPI';
import ProjectList from './ProjectList';

type ProjectState = {
  projects: Project[];
  loading: boolean;
  error: string | undefined;
};

type ActionType =
  | { type: 'setLoading'; payload: boolean }
  | { type: 'setProjects'; payload: { projects: Project[]; page: number } }
  | { type: 'setUpdatedProject'; payload: { project: Project } }
  | { type: 'setError'; payload: string };

function projectsReducer(
  state: ProjectState,
  action: ActionType
): ProjectState {
  switch (action.type) {
    case 'setLoading':
      return { ...state, loading: action.payload };
    case 'setProjects':
      let projects: Project[];
      const { page } = action.payload;
      if (page === 1) {
        projects = action.payload.projects;
      } else {
        projects = [...state.projects, ...action.payload.projects];
      }
      return {
        ...state,
        loading: false,
        projects,
        error: '',
      };

    case 'setError':
      return { ...state, error: action.payload };
    case 'setUpdatedProject':
      const { project } = action.payload;
      let updatedProjects = state.projects.map((p: Project) => {
        return p.id === project.id ? project : p;
      });
      return {
        ...state,
        projects: updatedProjects,
      };
    default:
      return state;
  }
}

function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [{ projects, loading, error }, dispatch] = useReducer(projectsReducer, {
    projects: [],
    loading: false,
    error: undefined,
  });

  useEffect(() => {
    async function loadProjects(page: number) {
      dispatch({ type: 'setLoading', payload: true });
      try {
        const data = await projectAPI.get(page);
        dispatch({
          type: 'setProjects',
          payload: { projects: data, page: page },
        });
      } catch (e) {
        dispatch({ type: 'setError', payload: e.message });
      } finally {
        dispatch({ type: 'setLoading', payload: false });
      }
    }
    loadProjects(currentPage);
  }, [currentPage]);

  const saveProject = (project: Project) => {
    projectAPI
      .put(project)
      .then((updatedProject) => {
        dispatch({
          type: 'setUpdatedProject',
          payload: { project: updatedProject },
        });
      })
      .catch((e) => {
        dispatch({ type: 'setError', payload: e.message });
      });
  };

  const handleMoreClick = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <h1>Projects</h1>

      {error && (
        <div className="row">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse "></span>
                {error}
              </p>
            </section>
          </div>
        </div>
      )}

      <ProjectList projects={projects} onSave={saveProject} />

      {!loading && !error && (
        <div className="row">
          <div className="col-sm-12">
            <div className="button-group fluid">
              <button className="button default" onClick={handleMoreClick}>
                More...
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="center-page">
          <span className="spinner primary"></span>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}

export default ProjectsPage;
