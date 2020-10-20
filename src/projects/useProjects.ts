import { useCallback, useEffect, useReducer } from 'react';
import { Project } from './Project';
import { projectAPI } from './projectAPI';
import {
  LOAD_PROJECTS_FAILURE,
  LOAD_PROJECTS_REQUEST,
  LOAD_PROJECTS_SUCCESS,
  MORE_PROJECTS,
  projectsReducer,
  SAVE_PROJECT_FAILURE,
  SAVE_PROJECT_SUCCESS,
} from './projectsReducer';

function useProjects() {
  const [{ projects, loading, error, page }, dispatch] = useReducer(
    projectsReducer,
    {
      projects: [],
      loading: false,
      error: undefined,
      page: 1,
    }
  );

  //   async function fetch(page: number) {
  //     dispatch({ type: LOAD_PROJECTS_REQUEST, payload: { page: page } });
  //     try {
  //       const data = await projectAPI.get(page);
  //       dispatch({
  //         type: LOAD_PROJECTS_SUCCESS,
  //         payload: { projects: data, page: page },
  //       });
  //     } catch (e) {
  //       dispatch({
  //         type: LOAD_PROJECTS_FAILURE,
  //         payload: { message: e.message },
  //       });
  //     }
  //   }

  //   function loadProjects(page: number) {
  //     fetch(page);
  //   }

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
    loadProjects(page);
  }, [page]);

  function moreProjects(nextPage: number) {
    dispatch({
      type: MORE_PROJECTS,
      payload: { page: nextPage },
    });
  }

  //   const loadProjects = useCallback(
  //     async (page) => {
  //       dispatch({ type: LOAD_PROJECTS_REQUEST });
  //       try {
  //         const data = await projectAPI.get(page);
  //         dispatch({
  //           type: LOAD_PROJECTS_SUCCESS,
  //           payload: { projects: data, page: 1 },
  //         });
  //       } catch (e) {
  //         dispatch({
  //           type: LOAD_PROJECTS_FAILURE,
  //           payload: { message: e.message },
  //         });
  //       }
  //     },
  //     [page]
  //   );

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

  return {
    projects,
    loading,
    error,
    page,
    moreProjects,
    saveProject,
  };
}

export default useProjects;
