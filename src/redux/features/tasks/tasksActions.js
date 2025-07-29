import {
  ADD_TASK_REQUEST,
  DELETE_TASK_REQUEST,
  UPDATE_MULTIPLE_TASKS_REQUEST,
  UPDATE_TASK_REQUEST,
} from './taskActionTypes';

export const addTaskRequest = (newTask) => ({
  type: ADD_TASK_REQUEST,
  payload: newTask,
});

export const updateTaskRequest = (updatedTask) => ({
  type: UPDATE_TASK_REQUEST,
  payload: updatedTask,
});

export const updateMultipleTasksRequest = (tasksArray) => ({
  type: UPDATE_MULTIPLE_TASKS_REQUEST,
  payload: tasksArray,
});

export const deleteTaskRequest = (taskID) => ({
  type: DELETE_TASK_REQUEST,
  payload: taskID,
});
