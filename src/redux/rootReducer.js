import { combineReducers } from 'redux';

import authReducer from './features/auth/authSlice';
import projectsReducer from './features/projects/projectsSlice';
import tasksReducer from './features/tasks/tasksSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
  projects: projectsReducer,
});
