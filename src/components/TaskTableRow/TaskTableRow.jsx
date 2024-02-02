// TableRowComponent.js
import { DeleteForever, Edit, Link, ExpandMore, ExpandLess } from '@mui/icons-material';
import { TableCell, TableRow, IconButton, Box } from '@mui/material';
import StatusSelect from '../StatusSelect/StatusSelect';
import TextArea from '../TextArea/TextArea';
import { useDispatch } from 'react-redux';
import { setEmailNote, changePriority } from '../../redux/taskSlice';
import { getStatusColor } from '../../utils/getStatusColor';

const TaskTableRow = ({ task, handleFilterTasks, showActive, handleOpenCloseEditTaskModal, handleOpenCloseDeleteTaskModal }) => {
  const dispatch = useDispatch();
  const { id, taskTicketText, status, projects, emailNote } = task;

  const handleTextAreaChange = e => {
    dispatch(setEmailNote({ text: e.target.value, id }));
  };

  const handleDeleteTask = () => {
    handleOpenCloseDeleteTaskModal(task);
  };

  const handlePriorityChange = increment => {
    dispatch(changePriority({ id, increment }));
    handleFilterTasks();
  };

  const statusColor = getStatusColor(status);

  const handleGoToTicket = () => {
    const ticketNumber = taskTicketText.split(' ')[0];
    const address = `http://jira.internet.int/browse/${ticketNumber}`;
    window.open(address, '_blank');
  };

  return (
    <TableRow key={id} sx={{ height: '100%' }}>
        <TableCell sx={{ padding: '5px', textAlign: 'center', borderLeft: `15px solid ${statusColor}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '-10px' }}>
            <IconButton disabled={!showActive} onClick={() => handlePriorityChange(-1)}>
              <ExpandLess sx={{opacity: showActive ? 1 : 0}}  />
            </IconButton>
            <IconButton disabled={!showActive} onClick={() => handlePriorityChange(1)}>
              <ExpandMore sx={{opacity: showActive ? 1 : 0}} />
            </IconButton>
          </Box>
        </TableCell>
      <TableCell sx={{ padding: '5px', width: '300px'}}>{taskTicketText}</TableCell>
      <TableCell sx={{ padding: '5px', width:'200px' }}>
        <StatusSelect status={status} id={id} />
      </TableCell>
      <TableCell sx={{ padding: '5px', width: '150px' }}>{projects}</TableCell>
      <TableCell sx={{ padding: '5px' }}>
        <TextArea rows={1} text={emailNote} handleChange={handleTextAreaChange} />
      </TableCell>
      <TableCell sx={{ padding: '5px' }}>
        <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'no wrap' }}>
          <IconButton color='primary' onClick={() => handleOpenCloseEditTaskModal(task)}>
            <Edit />
          </IconButton>
          <IconButton color='primary' onClick={handleGoToTicket}>
            <Link />
          </IconButton>
          <IconButton color='primary' onClick={handleDeleteTask}>
            <DeleteForever />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TaskTableRow;
