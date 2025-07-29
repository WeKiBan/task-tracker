// redux/features/projects/projectsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    updateProjects: (state, action) => {
      state.projects = action.payload;
    },
    projectsError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { projectsError, updateProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
