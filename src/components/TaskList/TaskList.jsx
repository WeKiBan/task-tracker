import { useSelector } from "react-redux";
import Box from '@mui/material/Box';
import Task from '../Task/Task';

export default function TaskList() {
  const tasks = useSelector((state) => state.tasks);
 
  return (
    <Box sx={{display: "flex", flexGrow: 1, flexDirection: 'column', gap: '10px' }}>
        {tasks.map(task => <Task key={task.id} task={task} />)}
    </Box>
  );
}
