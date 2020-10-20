import React, { useEffect, useReducer, useState } from 'react';
import { Project } from './Project';
import { projectAPI } from './projectAPI';
import ProjectList from './ProjectList';

type ProjectState = {
  projects: Project[];
  loading: boolean;
  error: string | undefined;
  currentPage: number;
};

type ActionType =
  | { type: 'setLoading'; payload: boolean }
  | { type: 'setProjects'; payload: Project[] }
  | { type: 'setError'; payload: string };

function projectsReducer(
  state: ProjectState,
  action: ActionType
): ProjectState {
  switch (action.type) {
    case 'setLoading':
      return { ...state, loading: action.payload };
    case 'setProjects':
      return { ...state, projects: action.payload };
    case 'setError':
      return { ...state, error: action.payload };
    default:
      break;
  }
  return state;
}

function ProjectsPage() {
  // const [projects, setProjects] = useState<Project[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [{ projects, loading, error }, dispatch] = useReducer(
    projectsReducer,
    {
      projects: [],
      loading: false,
      error: undefined,
      currentPage: 1,
    }
    // ,(state: ProjectState) => state
  );

  useEffect(() => {
    async function loadProjects() {
      dispatch({ type: 'setLoading', payload: true });
      try {
        const data = await projectAPI.get(currentPage);
        if (currentPage === 1) {
          dispatch({ type: 'setProjects', payload: data });
        } else {
          dispatch({ type: 'setProjects', payload: [...projects, ...data] });
        }
      } catch (e) {
        dispatch({ type: 'setError', payload: e.message });
      } finally {
        dispatch({ type: 'setLoading', payload: false });
      }
    }
    loadProjects();
  }, [currentPage, projects]);

  const saveProject = (project: Project) => {
    projectAPI
      .put(project)
      .then((updatedProject) => {
        let updatedProjects = projects.map((p: Project) => {
          return p.id === project.id ? project : p;
        });
        dispatch({ type: 'setProjects', payload: updatedProjects });
      })
      .catch((e) => {
        dispatch({ type: 'setError', payload: e.message });
      });
  };

  const handleMoreClick = () => {
    setCurrentPage((currentPage: number) => currentPage + 1);
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
