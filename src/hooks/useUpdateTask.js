import { useDispatch } from 'react-redux';

import { deleteTaskRequest, updateTaskRequest } from '../redux/features/tasks/tasksActions';

export const useUpdateTask = (task, setConfirmDeleteModalIsOpen) => {
  const dispatch = useDispatch();

  const handleUpdateStatus = (status) => {
    const updatedTask = { ...task, status };
    dispatch(updateTaskRequest(updatedTask));
  };

  const handleDeleteTask = () => {
    setConfirmDeleteModalIsOpen(false);
    dispatch(deleteTaskRequest(task.id));
  };

  return { handleUpdateStatus, handleDeleteTask };
};
