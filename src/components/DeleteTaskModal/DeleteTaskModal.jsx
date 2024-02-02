import { Typography } from '@mui/material';
import Modal from '../Modal/Modal';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../redux/taskSlice';
import { showSnackbar } from '../../redux/snackbarSlice';

const DeleteTaskModal = ({ open, handleClose, task }) => {
  const dispatch = useDispatch();

  const handleCancel = () => {
    handleClose();
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(task.id));
    handleShowSnackbar();
    handleClose();
  };

  const handleShowSnackbar = () => {
    dispatch(showSnackbar({ message: 'Task deleted successfully', color: 'success' }));
  };

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title='Edit Task'
      content={<Typography> Are you sure you want to delete this task?</Typography>}
      buttons={[
        {
          label: 'Cancel',
          function: handleCancel,
          color: 'primary',
          variant: 'contained',
        },
        {
          label: 'Delete',
          function: handleDeleteTask,
          color: 'error',
          variant: 'contained',
        },
      ]}
    />
  );
};

export default DeleteTaskModal;
