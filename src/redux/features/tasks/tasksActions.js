import {
  UPDATE_TASK_REQUEST,
  UPDATE_MULTIPLE_TASKS_REQUEST,
} from "./taskActionTypes";

export const updateTaskRequest = (updatedTask) => ({
  type: UPDATE_TASK_REQUEST,
  payload: updatedTask,
});

export const updateMultipleTasksRequest = (tasksArray) => ({
  type: UPDATE_MULTIPLE_TASKS_REQUEST,
  payload: tasksArray,
});
