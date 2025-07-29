import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateTaskRequest } from '../../redux/features/tasks/tasksActions';

export const useAddLinkModal = (task, onClose) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');

  const handleAddNewLink = () => {
    const id = crypto.randomUUID();
    const newLink = { id, title, link };
    const updatedTask = {
      ...task,
      links: [...task.links, newLink],
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
    handleAddNewLink(title, link);
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
