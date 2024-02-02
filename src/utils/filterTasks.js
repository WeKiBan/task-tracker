export const filterTasks = (tasks, showActive, searchValue) => {
  const filteredTasks = showActive
    ? tasks.filter(
        (task) =>
          task.status !== 'closed' && task.status !== 'reassigned' &&
          task.taskTicketText.toLowerCase().includes(searchValue.toLowerCase())
      )
    : tasks.filter(
        (task) =>
          task.status === 'closed' || task.status === 'reassigned' &&
          task.taskTicketText.toLowerCase().includes(searchValue.toLowerCase())
      );

      if(showActive) {
        // Sort the active filtered tasks by priority in ascending order (lowest to highest)
        filteredTasks.sort((a, b) => a.priority - b.priority);
      }

  return filteredTasks;
};