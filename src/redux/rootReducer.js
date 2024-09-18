import { combineReducers } from "redux";
import authReducer from "./features/auth/authSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
});
