import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      const { emailNote, taskTicketText, projects } = action.payload;
      const newTask = {
        id: Date.now(),
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
      const activeTasks = state.filter(task => task.status !== 'closed' && task.status !== 'reassigned');
      
      // If task was closed previously and is changed back to an active task, put it to the bottom of the array
      if (action.payload.status !== 'closed' && action.payload.status !== 'reassigned' && task.status === 'closed' || task.status === 'reassigned') {
        const indexOfTask = state.indexOf(task);
        state.splice(indexOfTask, 1);
        state.splice(activeTasks.length, 0, task);
      }
    
      // Update task status
      task.status = action.payload.status;
    
      // If task becomes closed or reassigned, remove priority
      if (action.payload.status === 'closed' || action.payload.status === 'reassigned') {
        const indexOfTask = state.indexOf(task);
        state.splice(indexOfTask, 1);
        state.push(task);
      }
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
      const task = state.find(task => task.id === action.payload.id);
      const activeTasks = state.filter(task => task.status !== 'closed' && task.status !== 'reassigned');
      const { increment } = action.payload;
      const indexOfTask = activeTasks.indexOf(task);
      
      const newIndex = indexOfTask + increment;
      if (newIndex >= 0 && newIndex <= activeTasks.length - 1) {
        state.splice(indexOfTask, 1);
        state.splice(newIndex, 0, task);
      }
    },
    editTask: (state, action) => {
      const task = state.find(task => task.id === action.payload.id);
      task.emailNote = action.payload.emailNote;
      task.taskTicketText = action.payload.taskTicketText;
      task.projects = action.payload.projects;
    }
  },
});

export const { addTask, toggleComplete, deleteTask, setEmailNote, setNote, setProject, setPriority, setTaskTicketText, setStatus, changePriority, editTask } = taskSlice.actions;
export default taskSlice.reducer;
