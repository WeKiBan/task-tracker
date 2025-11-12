import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { call, put, takeLatest } from 'redux-saga/effects';

import { auth, db, googleProvider } from '../../../config/firebase';
import { getFirebaseErrorMessage } from '../../../utils/getFirebaseErrorMessage';
import { LOGIN_REQUEST, LOGIN_REQUEST_GOOGLE, REGISTER_REQUEST } from '../../constants';
import { authError, loginUserSuccess } from './authSlice';

function* saveUserToFirestore(user) {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = yield call(getDoc, userRef);

  if (!userDoc.exists()) {
    // 📝 Create main user doc
    yield call(setDoc, userRef, {
      email: user.email,
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'light',
        notifications: true,
      },
    });
  }
}

// 🔐 Email/Password Login
function* signInUser(action) {
  const { email, password, navigate } = action.payload;

  try {
    yield call(signInWithEmailAndPassword, auth, email, password);
    navigate('/active-tasks');
  } catch (error) {
    yield put(authError(getFirebaseErrorMessage(error.code)));
  }
}

export function* watchSignInUser() {
  yield takeLatest(LOGIN_REQUEST, signInUser);
}

// 🔐 Google Login
function* signInUserGoogle(action) {
  const { navigate } = action.payload;

  try {
    const result = yield call(signInWithPopup, auth, googleProvider);
    const { user } = result;

    // 🧠 Create user doc in Firestore if needed
    yield call(saveUserToFirestore, user);

    // 🧠 Update Redux
    yield put(
      loginUserSuccess({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
      }),
    );

    navigate('/active-tasks');
  } catch (error) {
    yield put(authError(getFirebaseErrorMessage(error.code)));
  }
}

export function* watchSignInUserGoogle() {
  yield takeLatest(LOGIN_REQUEST_GOOGLE, signInUserGoogle);
}

// 📝 Email/Password Registration
function* createUser(action) {
  const { email, password, navigate } = action.payload;

  try {
    const userCredential = yield call(createUserWithEmailAndPassword, auth, email, password);
    const { user } = userCredential;

    yield call(saveUserToFirestore, user);
    yield call(sendEmailVerification, user);
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
