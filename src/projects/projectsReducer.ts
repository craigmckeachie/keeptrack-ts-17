import { Project } from './Project';

//action types
export const LOAD_PROJECTS_REQUEST = 'LOAD_PROJECTS_REQUEST';
export const LOAD_PROJECTS_SUCCESS = 'LOAD_PROJECTS_SUCCESS';
export const LOAD_PROJECTS_FAILURE = 'LOAD_PROJECTS_FAILURE';
export const SAVE_PROJECT_REQUEST = 'SAVE_PROJECT_REQUEST';
export const SAVE_PROJECT_SUCCESS = 'SAVE_PROJECT_SUCCESS';
export const SAVE_PROJECT_FAILURE = 'SAVE_PROJECT_FAILURE';
export const MORE_PROJECTS = 'MORE_PROJECTS';

type ProjectActionTypes =
  | {
      type: typeof MORE_PROJECTS;
      payload: { page: number };
    }
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
  page: number;
};

export function projectsReducer(
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
    case MORE_PROJECTS:
      return { ...state, page: action.payload.page };
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
