import { call, put, takeLatest } from 'redux-saga/effects';

import { UPDATE_PROJECTS_REQUEST } from './projectsActionTypes';
import { projectsError, updateProjects } from './projectsSlice';

function updateProjectsInFirebase(updatedProjects) {
  console.log('wes:', updatedProjects);
  // Replace with real Firebase call later
  return Promise.resolve(); // fake async
}

function* updateProjectsSaga(action) {
  const updatedProjects = action.payload;
  console.log(`Updating projects:`, updatedProjects);

  try {
    // Call Firebase (async)
    yield call(updateProjectsInFirebase, updatedProjects);
    // Then update Redux
    yield put(updateProjects(updatedProjects));
    console.log(`Projects updated:`, updatedProjects);
  } catch (error) {
    console.log(error);
    yield put(projectsError('Failed to update projects'));
  }
}

export function* watchUpdateProjects() {
  yield takeLatest(UPDATE_PROJECTS_REQUEST, updateProjectsSaga);
}
