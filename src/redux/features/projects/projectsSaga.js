import { updateProjects, projectsError } from "./projectsSlice";
import { put, call, takeLatest } from "redux-saga/effects";
import { UPDATE_PROJECTS_REQUEST } from "./projectsActionTypes";

function updateProjectsInFirebase(updatedTask) {
  // Replace with real Firebase call later
  return Promise.resolve(); // fake async
}

function* updateProjectsSaga(action) {
  const updatedProjects = action.payload;

  try {
    // Call Firebase (async)
    yield call(updateProjectsInFirebase, updatedProjects);
    // Then update Redux
    yield put(updateProjects(updatedProjects));
    console.log(`Projects updated:`, updatedProjects);
  } catch (error) {
    console.log(error);
    yield put(projectsError("Failed to update projects"));
  }
}

export function* watchUpdateProjects() {
  yield takeLatest(UPDATE_PROJECTS_REQUEST, updateProjectsSaga);
}
