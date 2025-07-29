import { useDispatch } from 'react-redux';

import { updateTaskRequest } from '../redux/features/tasks/tasksActions';

export const useUpdateTask = (task) => {
  const dispatch = useDispatch();

  const handleUpdateStatus = (status) => {
    const updatedTask = { ...task, status };
    dispatch(updateTaskRequest(updatedTask));
  };

  return { handleUpdateStatus };
};
