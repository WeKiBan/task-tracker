import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import TaskTableRow from '../TaskTableRow/TaskTableRow';

const TaskTable = ({ tasks, handleFilterTasks, showActive, handleOpenCloseEditTaskModal, handleOpenCloseDeleteTaskModal }) => {
  return (
    <TableContainer component={Paper} sx={{ height: "80vh", border: "1px solid rgba(224, 224, 224, 1);"}}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{padding: '5px', textAlign: "center" }}>{showActive && 'Priority'}</TableCell>
            <TableCell sx={{padding: '5px', width: '300px'}}>Ticket</TableCell>
            <TableCell sx={{padding: '5px'}}>Status</TableCell>
            <TableCell sx={{padding: '5px', width: '200px'}}>Projects</TableCell>
            <TableCell sx={{padding: '5px'}}>Email Note</TableCell>
            <TableCell sx={{padding: '5px'}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => <TaskTableRow handleOpenCloseDeleteTaskModal={handleOpenCloseDeleteTaskModal} handleOpenCloseEditTaskModal={handleOpenCloseEditTaskModal} handleFilterTasks={handleFilterTasks} key={task.id} task={task} showActive={showActive} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;