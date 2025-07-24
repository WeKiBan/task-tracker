// src/redux/sagas/authSaga.js
import { takeLatest, put, call } from "redux-saga/effects";
import { getFirebaseErrorMessage } from "../../../utils/getFirebaseErrorMessage";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { authError, loginUserSuccess } from "../auth/authSlice";
import {
  LOGIN_REQUEST,
  LOGIN_REQUEST_GOOGLE,
  REGISTER_REQUEST,
} from "../../constants";

import { auth, googleProvider } from "../../../config/firebase";

function* signInUser(action) {
  const { email, password, navigate } = action.payload;
  try {
    yield signInWithEmailAndPassword(auth, email, password);
    navigate("/active-tasks");
  } catch (error) {
    yield put(authError(getFirebaseErrorMessage(error.code)));
  }
}

export function* watchSignInUser() {
  yield takeLatest(LOGIN_REQUEST, signInUser);
}

function* signInUserGoogle(action) {
  try {
    const { navigate } = action.payload;
    yield signInWithPopup(auth, googleProvider);
    navigate("/active-tasks");
  } catch (error) {
    yield put(authError(getFirebaseErrorMessage(error.code)));
  }
}

export function* watchSignInUserGoogle() {
  yield takeLatest(LOGIN_REQUEST_GOOGLE, signInUserGoogle);
}

function* createUser(action) {
  const { email, password, navigate } = action.payload;
  try {
    // Register the user
    const userCredential = yield call(
      createUserWithEmailAndPassword,
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    // Send verification email
    yield call(sendEmailVerification, user);

    // Optionally: Set a flag in the user's profile to indicate that a verification email was sent
    yield call(updateProfile, user, { displayName: "Pending Verification" });

    yield put(
      loginUserSuccess({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      }),
    );

    navigate("/verify-email");
  } catch (error) {
    yield put(authError(getFirebaseErrorMessage(error.code)));
  }
}

export function* watchCreateUser() {
  yield takeLatest(REGISTER_REQUEST, createUser);
}
