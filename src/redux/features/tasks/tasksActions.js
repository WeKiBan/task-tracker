import { UPDATE_TASK_REQUEST } from "./taskActionTypes";

export const updateTaskRequest = (updatedTask) => ({
  type: UPDATE_TASK_REQUEST,
  payload: updatedTask,
});
