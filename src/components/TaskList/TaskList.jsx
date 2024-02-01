
import Box from '@mui/material/Box';
import Task from '../Task/Task';

export default function TaskList({tasks}) {

  return (
    <Box>
        <Box boxShadow={2} sx={{height:'100%', overflowY: 'auto', flex: 1}}>
        {tasks.map(task => <Task  key={task.id} task={task} />)}
        </Box>
    </Box>
  );
}
