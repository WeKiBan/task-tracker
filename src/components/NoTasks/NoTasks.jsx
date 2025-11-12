import { Button, Typography } from '@mui/material';

import emptyTasksImg from '../../assets/empty-tasks-image.svg';
import { NoTasksContainer } from './NoTasks.styles';

function NoTasks({ handleAddNewTask }) {
  return (
    <NoTasksContainer>
      <img
        src={emptyTasksImg}
        alt="No tasks illustration"
        style={{ width: 200, marginBottom: 24 }}
      />
      <Typography variant="h2" gutterBottom>
        No tasks yet!
      </Typography>
      <Typography sx={{ fontSize: '16px' }} component="p" gutterBottom>
        Once you add tasks, they&apos;ll show up here.
      </Typography>
      <Button
        onClick={handleAddNewTask}
        sx={{ marginTop: '10px' }}
        size="large"
        variant="contained"
      >
        Add New Task
      </Button>
    </NoTasksContainer>
  );
}

export default NoTasks;
