import { createSlice } from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    open: false,
    message: '',
    duration: 3000, // Default duration in milliseconds
    color: ''
  },
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message || '';
      state.duration = action.payload.duration || 3000;
      state.color = action.payload.color || 'success';
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.message = 'task added successfully';
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
