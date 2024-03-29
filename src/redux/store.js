import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import tasksReducer from './slices/taskSlice'; 
import snackbarReducer from './slices/snackbarSlice';
import settingsReducer from './slices/settingsSlice'
import authReducer from './slices/authSlice';

// Load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('tasks');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error('Error loading state from local storage:', error);
    return undefined;
  }
};

// Save state to local storage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('tasks', serializedState);
  } catch (error) {
    console.error('Error saving state to local storage:', error);
  }
};

const rootReducer = combineReducers({
  tasks: tasksReducer,
  snackbar: snackbarReducer,
  settings: settingsReducer,
  auth: authReducer
});

const preloadedState = loadState();

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

// Subscribe to store changes and save to local storage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;