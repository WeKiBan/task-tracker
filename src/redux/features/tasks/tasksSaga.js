import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { auth, db } from '../../../config/firebase';
import {
  ADD_TASK_REQUEST,
  DELETE_TASK_REQUEST,
  FETCH_TASKS_REQUEST,
  UPDATE_MULTIPLE_TASKS_REQUEST,
  UPDATE_TASK_REQUEST,
} from './taskActionTypes';
import {
  addTaskSuccess,
  deleteTaskSuccess,
  fetchTasksSuccess,
  taskError,
  updateMultipleTasksSuccess,
  updateTaskSuccess,
} from './tasksSlice';

// 🔧 Get the user's task collection reference
function getUserTasksCollection() {
  const { currentUser: user } = auth;
  if (!user) throw new Error('User not authenticated');
  return collection(db, 'users', user.uid, 'tasks');
}

// 📥 Fetch Tasks
export function* watchFetchTasks() {
  yield takeLatest(FETCH_TASKS_REQUEST, function* fetchTasks() {
    try {
      const tasks = yield call(() =>
        getDocs(getUserTasksCollection()).then((snapshot) =>
          snapshot.docs.map((taskDoc) => ({
            id: taskDoc.id,
            ...taskDoc.data(),
          })),
        ),
      );

      yield put(fetchTasksSuccess(tasks));
      console.log('Fetched tasks:', tasks);
    } catch (error) {
      console.error(error);
      yield put(taskError('Failed to fetch tasks'));
    }
  });
}

// 🔁 Update Single Task
function updateTaskInFirebase(updatedTask) {
  const { currentUser: user } = auth;
  if (!user) throw new Error('User not authenticated');

  const taskRef = doc(db, 'users', user.uid, 'tasks', updatedTask.id);
  return updateDoc(taskRef, updatedTask);
}

function* updateTaskSaga(action) {
  const updatedTask = action.payload;
  try {
    yield call(updateTaskInFirebase, updatedTask);
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

// 🔁 Update Multiple Tasks
function* updateMultipleTasksSaga(action) {
  const tasksToUpdate = action.payload;
  try {
    yield all(tasksToUpdate.map((task) => call(updateTaskInFirebase, task)));
    yield put(updateMultipleTasksSuccess(tasksToUpdate));
  } catch (error) {
    console.log(error);
    yield put(taskError('Failed to update task order'));
  }
}

export function* watchUpdateMultipleTasksSaga() {
  yield takeLatest(UPDATE_MULTIPLE_TASKS_REQUEST, updateMultipleTasksSaga);
}

// ➕ Add Task
function addTaskInFirebase(newTask) {
  const { currentUser: user } = auth;
  if (!user) throw new Error('User not authenticated');

  const tasksRef = collection(db, 'users', user.uid, 'tasks');
  const taskWithTimestamp = {
    ...newTask,
    createdAt: new Date().toISOString(),
  };

  return addDoc(tasksRef, taskWithTimestamp);
}

function* addTaskSaga(action) {
  const newTask = action.payload;
  try {
    const docRef = yield call(addTaskInFirebase, newTask);
    const taskWithId = { ...newTask, id: docRef.id };
    yield put(addTaskSuccess(taskWithId));
    console.log(`Task added: ${docRef.id}`, taskWithId);
  } catch (error) {
    console.log(error);
    yield put(taskError('Failed to add task'));
  }
}

export function* watchAddTask() {
  yield takeLatest(ADD_TASK_REQUEST, addTaskSaga);
}

// ❌ Delete Task
function deleteTaskInFirebase(taskId) {
  const { currentUser: user } = auth;
  if (!user) throw new Error('User not authenticated');

  const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
  return deleteDoc(taskRef);
}

function* deleteTaskSaga(action) {
  const deletedTaskId = action.payload;
  try {
    yield call(deleteTaskInFirebase, deletedTaskId);
    yield put(deleteTaskSuccess(deletedTaskId));
    console.log(`Task deleted: ${deletedTaskId}`);
  } catch (error) {
    console.log(error);
    yield put(taskError('Failed to delete task'));
  }
}

export function* watchDeleteTask() {
  yield takeLatest(DELETE_TASK_REQUEST, deleteTaskSaga);
}
