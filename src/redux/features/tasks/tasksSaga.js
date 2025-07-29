import { call, put, takeLatest } from 'redux-saga/effects';

import {
  ADD_TASK_REQUEST,
  UPDATE_MULTIPLE_TASKS_REQUEST,
  UPDATE_TASK_REQUEST,
} from './taskActionTypes';
import {
  addTaskSuccess,
  taskError,
  updateMultipleTasksSuccess,
  updateTaskSuccess,
} from './tasksSlice';

function updateTaskInFirebase(updatedTask) {
  console.log(updatedTask);
  // Replace with real Firebase call later
  return Promise.resolve(); // fake async
}

function* updateTaskSaga(action) {
  const updatedTask = action.payload;

  try {
    // Call Firebase (async)
    yield call(updateTaskInFirebase, updatedTask);
    // Then update Redux
    yield put(updateTaskSuccess(updatedTask));
    console.log(`Task updated: ${updatedTask.id}`, updatedTask);
  } catch (error) {
    console.log(error);
    yield put(taskError('Failed to update task'));
  }
}

export function* watchUpdateTask() {
  yield takeLatest(UPDATE_TASK_REQUEST, updateTaskSaga);
}

function* updateMultipleTasksSaga(action) {
  const tasksToUpdate = action.payload;
  try {
    yield call(
      [].concat.bind(Array),
      tasksToUpdate.map((task) => call(updateTaskInFirebase, task)),
    );
    yield put(updateMultipleTasksSuccess(tasksToUpdate));
  } catch (error) {
    console.log(error);
    yield put(taskError('Failed to update task order'));
  }
}

export function* watchUpdateMultipleTasksSaga() {
  yield takeLatest(UPDATE_MULTIPLE_TASKS_REQUEST, updateMultipleTasksSaga);
}

function addTaskInFirebase(updatedTask) {
  console.log(updatedTask);
  // Replace with real Firebase call later
  return Promise.resolve(); // fake async
}

function* addTaskSaga(action) {
  const newTask = action.payload;

  try {
    // Call Firebase (async)
    yield call(addTaskInFirebase, newTask);
    // Then update Redux
    yield put(addTaskSuccess(newTask));
    console.log(`Task updated: ${newTask.id}`, newTask);
  } catch (error) {
    console.log(error);
    yield put(taskError('Failed to add task'));
  }
}

export function* watchAddTask() {
  yield takeLatest(ADD_TASK_REQUEST, addTaskSaga);
}
