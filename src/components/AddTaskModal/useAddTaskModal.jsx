import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addTaskRequest, updateTaskRequest } from '../../redux/features/tasks/tasksActions';

export const useAddTaskModal = (onClose, onSelectTask, task) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const activeTasks = useSelector((state) =>
    state.tasks.tasks.filter((t) => t.status !== 'closed'),
  );

  useEffect(() => {
    setTitle(task?.title || '');
    setLink(task?.link || '');
  }, [task]);

  const handleAddNewTask = () => {
    if (task) {
      const updatedTask = {
        ...task,
        title,
        link,
      };
      dispatch(updateTaskRequest(updatedTask));
      console.log(`Task edited with Id: ${updatedTask.id}`);
    } else {
      const maxOrder = Math.max(...activeTasks.map((t) => t.order), 0);
      const nextOrder = maxOrder + 1;
      const id = crypto.randomUUID();
      const newTask = {
        id,
        order: nextOrder,
        title,
        status: 'notStarted',
        link,
        description: '',
        notes: '',
        emailNotes: '',
        subtasks: [],
        links: [],
        projects: [],
      };
      dispatch(addTaskRequest(newTask));
      onSelectTask(newTask);
      console.log(`New task added with Id: ${id}`);
    }
  };

  const resetInputs = () => {
    setTimeout(() => {
      setLink('');
      setTitle('');
    }, 100);
  };

  const handleClose = () => {
    onClose();
    if (!task) {
      resetInputs();
    }
  };

  const handleConfirm = () => {
    handleAddNewTask();
    handleClose();
  };

  return {
    link,
    title,
    setLink,
    setTitle,
    handleConfirm,
    handleClose,
  };
};
