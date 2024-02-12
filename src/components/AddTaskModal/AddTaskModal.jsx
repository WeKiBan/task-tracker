import { useState } from 'react';
import {  TextField, Grid } from '@mui/material';
import Modal from '../Modal/Modal'
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/slices/taskSlice';
import { showSnackbar } from '../../redux/slices/snackbarSlice';

const AddTaskModal = ({ open, handleClose }) => {
  const [ticket, setTicket] = useState('');
  const [projects, setProjects] = useState('');
  const [emailNote, setEmailNote] = useState('');

  const dispatch = useDispatch()

  const handleCancel = () => {
    handleClose();
    handleClearInputs();
  };

  const handleClearInputs = () => {
    setTicket('');
    setProjects('');
    setEmailNote('');
  }

  const handleAddTask = () => {
    const payload = { projects, emailNote, taskTicketText: ticket}
    dispatch(addTask(payload))
    handleShowSnackbar();
    handleClose();
    handleClearInputs();
  };

  const handleShowSnackbar = () => {
    dispatch(showSnackbar({ message: 'Task added successfully',
    color: 'success',}))
  }

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Add Task"
      content={
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ticket"
              variant="outlined"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Projects"
              variant="outlined"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Note"
              variant="outlined"
              value={emailNote}
              onChange={(e) => setEmailNote(e.target.value)}
            />
          </Grid>
        </Grid>
      }
      buttons={[
        {
          label: 'Cancel',
          function: handleCancel,
          color: 'primary',
          variant: 'contained',
        },
        {
          label: 'Add',
          function: handleAddTask,
          color: 'success',
          variant: 'contained',
        },
      ]}
    />
  );
};

export default AddTaskModal;