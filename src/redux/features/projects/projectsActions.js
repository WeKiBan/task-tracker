import { UPDATE_PROJECTS_REQUEST } from "./projectsActionTypes";

export const updateProjectsRequest = (updatedProjects) => ({
  type: UPDATE_PROJECTS_REQUEST,
  payload: updatedProjects,
});
