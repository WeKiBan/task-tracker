import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateMultipleTasksRequest } from '../../redux/features/tasks/tasksActions';

export const useActiveTasks = () => {
  const dispatch = useDispatch();
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const tasks = useSelector((state) => [...state.tasks.tasks].sort((a, b) => a.order - b.order));
  const selectedTask = useSelector((state) =>
    state.tasks.tasks.find((t) => t.id === selectedTaskId),
  );

  const openTaskModal = () => {
    setAddTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setAddTaskModalOpen(false);
  };

  const onSelectTask = (task) => {
    setSelectedTaskId(task.id);
  };

  const onClickArrowUp = (taskId) => {
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index > 0) {
      const currentTask = { ...tasks[index] };
      const previousTask = { ...tasks[index - 1] };

      // Swap their order values
      const temp = currentTask.order;
      currentTask.order = previousTask.order;
      previousTask.order = temp;

      dispatch(updateMultipleTasksRequest([currentTask, previousTask]));
    }
  };

  const onClickArrowDown = (taskId) => {
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index < tasks.length - 1) {
      const currentTask = { ...tasks[index] };
      const nextTask = { ...tasks[index + 1] };

      // Swap their order
      const temp = currentTask.order;
      currentTask.order = nextTask.order;
      nextTask.order = temp;

      dispatch(updateMultipleTasksRequest([currentTask, nextTask]));
    }
  };

  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks, selectedTaskId]);

  return {
    tasks,
    selectedTaskId,
    selectedTask,
    addTaskModalOpen,
    closeTaskModal,
    openTaskModal,
    onSelectTask,
    onClickArrowUp,
    onClickArrowDown,
  };
};
