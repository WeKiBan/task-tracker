import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateTaskRequest } from '../../redux/features/tasks/tasksActions';

export const useAddSubtaskModal = (task, onClose) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const handleAddNewSubtask = () => {
    const id = crypto.randomUUID();
    const newSubtask = { id, title, link };
    const updatedTask = {
      ...task,
      subtasks: [...task.subtasks, newSubtask],
    };
    dispatch(updateTaskRequest(updatedTask));
    console.log(`New subtask added with Id: ${id}`);
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
    handleAddNewSubtask(title, link);
    onClose();
    resetInputs();
  };

  return {
    title,
    link,
    setTitle,
    setLink,
    handleConfirm,
    handleClose,
  };
};
