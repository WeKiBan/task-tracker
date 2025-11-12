import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { auth } from '../../config/firebase';
import { loginUserSuccess } from '../../redux/features/auth/authSlice';
import { FETCH_TASKS_REQUEST } from '../../redux/features/tasks/taskActionTypes';

function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(
          loginUserSuccess({
            uid: user.uid,
            authToken: user.refreshToken,
            emailVerified: user.emailVerified,
            error: null,
            isAuthLoaded: true,
          }),
        );

        if (user.emailVerified) {
          dispatch({ type: FETCH_TASKS_REQUEST });
        }
      } else {
        dispatch(
          loginUserSuccess({
            uid: null,
            authToken: null,
            emailVerified: false,
            error: null,
            isAuthLoaded: true,
          }),
        );
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}

export default AuthListener;
