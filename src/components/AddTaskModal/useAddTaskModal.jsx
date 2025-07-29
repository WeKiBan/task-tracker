import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addTaskRequest, updateTaskRequest } from '../../redux/features/tasks/tasksActions';

export const useAddTaskModal = (onClose, onSelectTask, task) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

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
      const id = crypto.randomUUID();
      const newTask = {
        id,
        order: 5,
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
