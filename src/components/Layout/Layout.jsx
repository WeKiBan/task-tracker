import { useDispatch } from 'react-redux';
import { addTask } from '../../taskSlice';

import Container from '@mui/material/Container';
import TaskList from '../TaskList/TaskList';
import { IconButton, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailOutput from '../EmailOutput/EmailOutput';


export default function Layout() {
  const dispatch = useDispatch();

  const handleAddTask = () => {
    dispatch(addTask());
  };
  return (
    <>
       <Container maxWidth="lg" sx={{height: '100%', paddingTop: '40px', paddingBottom: '40px', display: "flex", justifyContent:"space-between", flexDirection: "column"}}>
        <IconButton onClick={handleAddTask} sx={{position: 'fixed', top: '20px', right: '30px'}}><Add sx={{fontSize: '50px'}}/></IconButton>
        <IconButton onClick={handleAddTask} sx={{position: 'fixed', bottom: '280px', right: '30px'}}><ContentCopyIcon  sx={{fontSize: '50px'}}/></IconButton>
        <Box boxShadow={2} sx={{overflow: "auto", height: "70vh", border: "1px solid grey", padding: "5px" }}>
          <TaskList/>
        </Box>
        <EmailOutput />
      </Container>
    </>
  )
}