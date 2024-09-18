import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { loginUserSuccess } from "../../redux/features/auth/authSlice";
import { useEffect } from "react";
import { auth } from "../../config/firebase";

const AuthListener = () => {
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
};

export default AuthListener;
