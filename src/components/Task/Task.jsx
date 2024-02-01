import { Grid, Paper, IconButton, TextField } from '@mui/material';
import StatusSelect from '../StatusSelect/StatusSelect';
import { useDispatch } from 'react-redux';
import { deleteTask, setEmailNote, setProject, setPriority, setTaskTicketText, setStatus } from '../../taskSlice';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Task({ task }) {
  const { id, priority, status, emailNote, taskTicketText, projects } = task;

  const dispatch = useDispatch();

  const handleEmailNoteChange = e => {
    dispatch(setEmailNote({text: e.target.value, id}));
  };

  const handleChangePriority = e => {
    dispatch(setPriority({text: e.target.value, id}));
  };

  const handleChangeTextTicket = e => {
    dispatch(setTaskTicketText({text: e.target.value, id}));
  };

  const handleChangeProject = e => {
    dispatch(setProject({text: e.target.value, id}));
  };

  // const handleToggleComplete = id => {
  //   dispatch(toggleComplete(id));
  // };

  const handleDeleteTask = id => {
    dispatch(deleteTask(id));
  };

  return (
    <Paper sx={{ width: '100%', border: '1px solid #274C77', display: 'flex', alignItems: 'center', padding: '10px', gap: '5px', marginBottom: "10px" }} elevation={3}>
      <Grid container spacing={2} alignItems='start'>
        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextField fullWidth value={priority} onChange={e => handleChangePriority(e)} label='priority' variant='outlined' />
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextField fullWidth value={taskTicketText} onChange={e => handleChangeTextTicket(e)} label='ticket' variant='outlined' />
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <StatusSelect setStatus={setStatus} status={status} id={id} fullWidth />
        </Grid>
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextField fullWidth label='Projects' value={projects} placeholder='...' onChange={handleChangeProject} multiline rows={2} />
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TextField fullWidth label='Email Note' value={emailNote} placeholder='...' onChange={handleEmailNoteChange} multiline rows={2} />
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton onClick={() => handleDeleteTask(id)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}
