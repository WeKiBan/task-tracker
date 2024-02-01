export const filterTasks = (tasks, showClosed) => {
    if (showClosed) {
      // Return only closed tasks
      return tasks.filter(task => task.status === 'closed');
    } else {
      // Return tasks that aren't closed
      return tasks.filter(task => task.status !== 'closed');
    }
  };