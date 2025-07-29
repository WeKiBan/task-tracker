import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { auth } from '../../config/firebase';
import { loginUserSuccess } from '../../redux/features/auth/authSlice';

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
          }),
        );
      } else {
        dispatch(
          loginUserSuccess({
            authToken: null,
            uid: null,
            emailVerified: false,
            error: null,
          }),
        );
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}

export default AuthListener;
