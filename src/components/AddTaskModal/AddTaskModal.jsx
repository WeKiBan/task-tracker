import { useState } from 'react';
import {  TextField, Grid } from '@mui/material';
import Modal from '../Modal/Modal'
import { useDispatch } from 'react-redux';
import { addTask } from '../../taskSlice';

const AddTaskModal = ({ open, handleClose }) => {
  const [priority, setPriority] = useState('');
  const [ticket, setTicket] = useState('');
  const [projects, setProjects] = useState('');
  const [emailNote, setEmailNote] = useState('');

  const dispatch = useDispatch()

  const handleCancel = () => {
    handleClose();
  };

  const handleAddTask = () => {
    const payload = {priority, ticket, projects, emailNote, taskTicketText: ticket}
    dispatch(addTask(payload))
    handleClose();
  };

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
              label="Priority"
              variant="outlined"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </Grid>
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
          color: 'default',
          variant: 'outlined',
        },
        {
          label: 'Add',
          function: handleAddTask,
          color: 'primary',
          variant: 'contained',
        },
      ]}
    />
  );
};

export default AddTaskModal;