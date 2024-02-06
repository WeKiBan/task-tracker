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

  return filteredTasks;
};