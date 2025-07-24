import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    updateTaskSuccess: (state, action) => {
      const updatedTask = action.payload;
      state.tasks = state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      );
    },
    taskError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  updateTaskSuccess,
  addSubtaskSuccess,
  addProjectSuccess,
  taskError,
} = taskSlice.actions;

export default taskSlice.reducer;
