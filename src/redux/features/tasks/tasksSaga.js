import {
  updateTaskSuccess,
  updateMultipleTasksSuccess,
  taskError,
} from "./tasksSlice";
import { put, call, takeLatest } from "redux-saga/effects";
import {
  UPDATE_TASK_REQUEST,
  UPDATE_MULTIPLE_TASKS_REQUEST,
} from "./taskActionTypes";

function updateTaskInFirebase(updatedTask) {
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
    yield put(taskError("Failed to update task"));
  }
}

export function* watchUpdateTask() {
  yield takeLatest(UPDATE_TASK_REQUEST, updateTaskSaga);
}

function* updateMultipleTasksSaga(action) {
  const tasksToUpdate = action.payload;
  try {
    for (let task of tasksToUpdate) {
      yield call(updateTaskInFirebase, task);
    }
    yield put(updateMultipleTasksSuccess(tasksToUpdate));
  } catch (error) {
    console.log(error);
    yield put(taskError("Failed to update task order"));
  }
}

export function* watchUpdateMultipleTasksSaga() {
  yield takeLatest(UPDATE_MULTIPLE_TASKS_REQUEST, updateMultipleTasksSaga);
}
