import React, { useEffect, useReducer, useState } from 'react';
import { Project } from './Project';
import { projectAPI } from './projectAPI';
import ProjectList from './ProjectList';

//action types
export const LOAD_PROJECTS_REQUEST = 'LOAD_PROJECTS_REQUEST';
export const LOAD_PROJECTS_SUCCESS = 'LOAD_PROJECTS_SUCCESS';
export const LOAD_PROJECTS_FAILURE = 'LOAD_PROJECTS_FAILURE';
export const SAVE_PROJECT_REQUEST = 'SAVE_PROJECT_REQUEST';
export const SAVE_PROJECT_SUCCESS = 'SAVE_PROJECT_SUCCESS';
export const SAVE_PROJECT_FAILURE = 'SAVE_PROJECT_FAILURE';

type ProjectActionTypes =
  | { type: typeof LOAD_PROJECTS_REQUEST }
  | {
      type: typeof LOAD_PROJECTS_SUCCESS;
      payload: { projects: Project[]; page: number };
    }
  | { type: typeof LOAD_PROJECTS_FAILURE; payload: { message: string } }
  | { type: typeof SAVE_PROJECT_REQUEST }
  | {
      type: typeof SAVE_PROJECT_SUCCESS;
      payload: Project;
    }
  | { type: typeof SAVE_PROJECT_FAILURE; payload: { message: string } };

type ProjectState = {
  projects: Project[];
  loading: boolean;
  error: string | undefined;
};

function projectsReducer(
  state: ProjectState,
  action: ProjectActionTypes
): ProjectState {
  switch (action.type) {
    case LOAD_PROJECTS_REQUEST:
      return { ...state, loading: true, error: '' };
    case LOAD_PROJECTS_SUCCESS:
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
    case LOAD_PROJECTS_FAILURE:
      return { ...state, loading: false, error: action.payload.message };
    case SAVE_PROJECT_REQUEST:
      return { ...state };
    case SAVE_PROJECT_SUCCESS:
      if (action.payload.isNew) {
        return {
          ...state,
          projects: [...state.projects, action.payload],
        };
      } else {
        return {
          ...state,
          projects: state.projects.map((project: Project) => {
            return project.id === action.payload.id
              ? Object.assign({}, project, action.payload)
              : project;
          }),
        };
      }

    case SAVE_PROJECT_FAILURE:
      return { ...state, error: action.payload.message };
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
      dispatch({ type: LOAD_PROJECTS_REQUEST });
      try {
        const data = await projectAPI.get(page);
        dispatch({
          type: LOAD_PROJECTS_SUCCESS,
          payload: { projects: data, page: page },
        });
      } catch (e) {
        dispatch({
          type: LOAD_PROJECTS_FAILURE,
          payload: { message: e.message },
        });
      }
    }
    loadProjects(currentPage);
  }, [currentPage]);

  const saveProject = (project: Project) => {
    projectAPI
      .put(project)
      .then((updatedProject) => {
        dispatch({
          type: SAVE_PROJECT_SUCCESS,
          payload: updatedProject,
        });
      })
      .catch((e) => {
        dispatch({
          type: SAVE_PROJECT_FAILURE,
          payload: { message: e.message },
        });
      });
  };

  const handleMoreClick = () => {
    setCurrentPage((previousPage) => previousPage + 1);
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
