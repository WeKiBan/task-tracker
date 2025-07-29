import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addTaskRequest } from '../../redux/features/tasks/tasksActions';

export const useAddTaskModal = (onClose, onSelectTask) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const handleAddNewTask = () => {
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
  };

  const resetInputs = () => {
    setTimeout(() => {
      setLink('');
      setTitle('');
    }, 100);
  };

  const handleClose = () => {
    onClose();
    resetInputs();
  };

  const handleConfirm = () => {
    handleAddNewTask(title, link);
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
