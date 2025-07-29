// src/redux/sagas/authSaga.js
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { call, put, takeLatest } from 'redux-saga/effects';

import { auth, googleProvider } from '../../../config/firebase';
import { getFirebaseErrorMessage } from '../../../utils/getFirebaseErrorMessage';
import { LOGIN_REQUEST, LOGIN_REQUEST_GOOGLE, REGISTER_REQUEST } from '../../constants';
import { authError, loginUserSuccess } from './authSlice';

function* signInUser(action) {
  const { email, password, navigate } = action.payload;
  try {
    yield signInWithEmailAndPassword(auth, email, password);
    navigate('/active-tasks');
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
    navigate('/active-tasks');
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
    const userCredential = yield call(createUserWithEmailAndPassword, auth, email, password);

    const { user } = userCredential;

    // Send verification email
    yield call(sendEmailVerification, user);

    // Optionally: Set a flag in the user's profile to indicate that a verification email was sent
    yield call(updateProfile, user, { displayName: 'Pending Verification' });

    yield put(
      loginUserSuccess({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      }),
    );

    navigate('/verify-email');
  } catch (error) {
    yield put(authError(getFirebaseErrorMessage(error.code)));
  }
}

export function* watchCreateUser() {
  yield takeLatest(REGISTER_REQUEST, createUser);
}
