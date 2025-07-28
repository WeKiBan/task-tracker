import { combineReducers } from "redux";
import authReducer from "./features/auth/authSlice";
import tasksReducer from "./features/tasks/tasksSlice";
import projectsReducer from "./features/projects/projectsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
  projects: projectsReducer,
});
