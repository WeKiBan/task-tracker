import Container from '@mui/material/Container';
import TaskList from '../components/TaskList/TaskList';
import { IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { addTask } from '../taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import { filterTasks } from '../utils/filterTasks';

export default function ClosedTasks() {
  const tasks = useSelector((state) => state.tasks);
  const filteredTasks = filterTasks(tasks, true)
  const dispatch = useDispatch();
  const handleAddTask = () => {
    dispatch(addTask());
  };

  return (
    <Container maxWidth='lg' sx={{ display: 'grid', gridTemplateRows: '85% 15%', height: 'calc(100vh - 66px)', gap: '20px', padding: '20px 0' }}>
      <IconButton onClick={handleAddTask} sx={{ position: 'absolute', top: '100px', right: '25px', zIndex: 1 }}>
        <Add sx={{ fontSize: '50px' }} />
      </IconButton>
      <IconButton onClick={handleAddTask} sx={{ position: 'absolute', top: '180px', right: '25px', zIndex: 1 }}>
        <ContentCopyIcon sx={{ fontSize: '50px' }} />
      </IconButton>
      <TaskList tasks={filteredTasks} />
    </Container>
  );
}
