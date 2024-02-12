import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    emailFooter: '',
    emailHeader: '',
  },
  reducers: {
    setEmailFooter: (state, action) => {
      state.emailFooter = action.payload;
    },
    setEmailHeader: (state, action) => {
      state.emailHeader = action.payload;
    },
  },
});

export const { setEmailFooter, setEmailHeader } = settingsSlice.actions;
export default settingsSlice.reducer;