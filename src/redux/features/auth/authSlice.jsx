import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authToken: null,
  uid: null,
  error: null,
  emailVerified: false,
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUserSuccess: (state, action) => {
      state.uid = action.payload.uid;
      state.authToken = action.payload.authToken;
      state.error = null;
      state.emailVerified = action.payload.emailVerified;
    },
    authError: (state, action) => {
      state.error = action.payload;
    },
    setEmailVerified: (state) => {
      state.emailVerified = true;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { loginUserSuccess, authError, setEmailVerified, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;
