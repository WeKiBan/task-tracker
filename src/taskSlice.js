import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    addTask: (state) => {
      console.log('test fired');
      const newTask = {
        id: Date.now(),
        priority: "",
        note: "",
        emailNote: "",
        completed: false,
        taskTicketText: "",
        projects: "",
        status: "not started"
      };
      state.push(newTask);
    },
    setNote: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      task.note = action.payload.text;
    },
    setEmailNote: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      task.emailNote =action.payload.text;
    },
    setProject: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      task.projects =action.payload.text;
    },
    setStatus: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      console.log(action.payload.status)
      task.status = action.payload.status;
    },
    setPriority: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      task.priority = action.payload.text;
    },
    setTaskTicketText: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      task.taskTicketText = action.payload.text;
    },
    toggleComplete: (state, action) => {
      const task = state.find((task) => task.id === action.payload.id);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      const index = state.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});
export const { addTask, toggleComplete, deleteTask, setEmailNote, setNote, setProject, setPriority, setTaskTicketText, setStatus } = taskSlice.actions;
export default taskSlice.reducer;