import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      const { emailNote, taskTicketText, projects } = action.payload;
      const newTask = {
        id: Date.now(),
        priority: state.length + 1,
        emailNote,
        taskTicketText,
        projects,
        status: 'not started',
      };
      state.push(newTask);
    },
    setNote: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      task.note = action.payload.text;
    },
    setEmailNote: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      task.emailNote = action.payload.text;
    },
    setProject: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      task.projects = action.payload.text;
    },
    setStatus: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      // if task was closed previously and is changed back to an active task put it to the bottom of the priority
      if(task.status === 'closed') {
        task.priority = state.filter(task => task.priority).length;
      }
      task.status = action.payload.status;
      // if task becomes closed remove priority
      if(action.payload.status === 'closed') {
        task.priority = null;
      }
    },
    setPriority: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      task.priority = action.payload.text;
    },
    setTaskTicketText: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      task.taskTicketText = action.payload.text;
    },
    toggleComplete: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask: (state, action) => {
      const index = state.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    changePriority: (state, action) => {
      const { id, increment } = action.payload;
      const task = state.find(task => task.id === id);

      if (task) {
        const newPriority = task.priority + increment;

        // Ensure the new priority is within bounds
        if (newPriority < 1 || newPriority > state.length) {
          return;
        }

        // Find the substitute task based on priority
        const substituteTask = state.find(t => t.priority === newPriority);

        if (substituteTask) {
          const substituteTaskIncrement = increment > 0 ? -1 : 1;
          substituteTask.priority += substituteTaskIncrement;
          task.priority = newPriority;
        }
      }
    },
  },
});
export const { addTask, toggleComplete, deleteTask, setEmailNote, setNote, setProject, setPriority, setTaskTicketText, setStatus, changePriority } = taskSlice.actions;
export default taskSlice.reducer;
