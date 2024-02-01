export const filterTasks = (tasks, showActive, searchValue) => {
  if (showActive) {
    return tasks.filter(
      (task) =>
        task.status !== 'closed' &&
        task.taskTicketText.toLowerCase().includes(searchValue.toLowerCase())
    );
  } else {
    return tasks.filter(
      (task) =>
        task.status === 'closed' &&
        task.taskTicketText.toLowerCase().includes(searchValue.toLowerCase())
    );
  }
};