import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: null,
  authToken: null,
  emailVerified: false,
  error: null,
  isAuthLoaded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUserSuccess: (state, action) => {
      const { uid, authToken, emailVerified, error } = action.payload;
      state.uid = uid;
      state.authToken = authToken;
      state.emailVerified = emailVerified;
      state.error = error;
      state.isAuthLoaded = true;
    },
    setEmailVerified: (state, action) => {
      state.emailVerified = action.payload === true;
    },
    authError: (state, action) => {
      state.error = action.payload;
      state.isAuthLoaded = true;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { loginUserSuccess, authError, setEmailVerified, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
