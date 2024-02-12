import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { saveUser } from '../../redux/slices/authSlice';
import { useEffect } from 'react';
import { auth } from '../../config/firebase'

const AuthListener = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(saveUser(user.refreshToken));
      } else {
        dispatch(saveUser(undefined));
      }
    });
    
    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, [ dispatch ]);

  return null;
};

export default AuthListener;
