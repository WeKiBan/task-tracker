import { useEffect, useState } from 'react';
import {  TextField, Grid } from '@mui/material';
import Modal from '../Modal/Modal'
import { useDispatch} from 'react-redux';
import { editTask } from '../../redux/taskSlice';



const EditTaskModal = ({ open, handleClose, task }) => {
  const [ticket, setTicket] = useState('');
  const [projects, setProjects] = useState('');
  const [emailNote, setEmailNote] = useState('');
  const dispatch = useDispatch()

  useEffect(() => {
    if (task) {
      setTicket(task.taskTicketText || '');
      setProjects(task.projects || '');
      setEmailNote(task.emailNote || '');
    }
  }, [task]);

  const handleCancel = () => {
    handleClose();
  };

  const handleEditTask = () => {
    const payload = { id: task.id, projects, emailNote, taskTicketText: ticket}
    dispatch(editTask(payload))
    handleClose();
  };

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Edit Task"
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
          label: 'Submit',
          function: handleEditTask,
          color: 'success',
          variant: 'contained',
        },
      ]}
    />
  );
};

export default EditTaskModal;