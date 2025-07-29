import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTaskSuccess: (state, action) => {
      state.tasks = [...state.tasks, action.payload];
    },
    updateTaskSuccess: (state, action) => {
      const updatedTask = action.payload;
      state.tasks = state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    },
    updateMultipleTasksSuccess: (state, action) => {
      const updated = action.payload;
      updated.forEach((updatedTask) => {
        const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      });
    },
    taskError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  addTaskSuccess,
  updateTaskSuccess,
  updateMultipleTasksSuccess,
  addSubtaskSuccess,
  taskError,
} = taskSlice.actions;

export default taskSlice.reducer;
