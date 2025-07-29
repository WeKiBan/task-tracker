// src/redux/rootSaga.js
import { all } from 'redux-saga/effects';

import { watchCreateUser, watchSignInUser, watchSignInUserGoogle } from './features/auth/authSaga';
import { watchUpdateProjects } from './features/projects/projectsSaga';
import {
  watchAddTask,
  watchUpdateMultipleTasksSaga,
  watchUpdateTask,
} from './features/tasks/tasksSaga';

export default function* rootSaga() {
  yield all([
    watchSignInUser(),
    watchSignInUserGoogle(),
    watchCreateUser(),
    watchUpdateTask(),
    watchUpdateMultipleTasksSaga(),
    watchAddTask(),
    watchUpdateProjects(),
  ]);
}
