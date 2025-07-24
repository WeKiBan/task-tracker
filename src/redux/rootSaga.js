// src/redux/rootSaga.js
import { all } from "redux-saga/effects";
import {
  watchSignInUser,
  watchSignInUserGoogle,
  watchCreateUser,
} from "./features/auth/authSaga";
import { watchUpdateTask } from "./features/tasks/tasksSaga";

export default function* rootSaga() {
  yield all([
    watchSignInUser(),
    watchSignInUserGoogle(),
    watchCreateUser(),
    watchUpdateTask(),
  ]);
}
