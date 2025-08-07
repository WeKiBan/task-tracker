import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateMultipleTasksRequest } from '../../redux/features/tasks/tasksActions';

export const useActiveTasks = () => {
  const dispatch = useDispatch();
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const activeTasks = useSelector((state) =>
    [...state.tasks.tasks].sort((a, b) => a.order - b.order),
  )
    .filter((task) => task.status !== 'closed')
    .sort((a, b) => a.order - b.order);
  const selectedTask = useSelector((state) =>
    state.tasks.tasks.find((t) => t.id === selectedTaskId),
  );
  const [query, setQuery] = useState('');

  const handleSearch = (search) => {
    setQuery(search);
  };

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
    const index = activeTasks.findIndex((t) => t.id === taskId);

    if (index > 0) {
      const currentTask = { ...activeTasks[index] };
      const previousTask = { ...activeTasks[index - 1] };

      // Swap their order values
      const temp = currentTask.order;
      currentTask.order = previousTask.order;
      previousTask.order = temp;

      dispatch(updateMultipleTasksRequest([currentTask, previousTask]));
    }
  };

  const onClickArrowDown = (taskId) => {
    const index = activeTasks.findIndex((t) => t.id === taskId);

    if (index < activeTasks.length - 1) {
      const currentTask = { ...activeTasks[index] };
      const nextTask = { ...activeTasks[index + 1] };

      // Swap their order
      const temp = currentTask.order;
      currentTask.order = nextTask.order;
      nextTask.order = temp;

      dispatch(updateMultipleTasksRequest([currentTask, nextTask]));
    }
  };

  useEffect(() => {
    const taskStillExists = activeTasks.some((t) => t.id === selectedTaskId);

    if (!activeTasks.length) {
      setSelectedTaskId(null);
    } else if (!taskStillExists) {
      setSelectedTaskId(activeTasks[0].id || null);
    }
  }, [activeTasks, selectedTaskId]);

  return {
    activeTasks,
    selectedTaskId,
    selectedTask,
    addTaskModalOpen,
    query,
    closeTaskModal,
    openTaskModal,
    onSelectTask,
    onClickArrowUp,
    onClickArrowDown,
    handleSearch,
  };
};
