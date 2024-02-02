// TableRowComponent.js
import { DeleteForever, Edit, Link, ExpandMore, ExpandLess  } from '@mui/icons-material';
import { TableCell, TableRow, IconButton, Box  } from '@mui/material';
import StatusSelect from '../StatusSelect/StatusSelect';
import TextArea from '../TextArea/TextArea';
import { useDispatch } from 'react-redux';
import { deleteTask, setEmailNote, changePriority } from '../../taskSlice';
import { getStatusColor } from '../../utils/getStatusColor';

const TaskTableRow = ({ task, handleFilterTasks }) => {
  const dispatch = useDispatch();
  const { id, taskTicketText, status, projects, emailNote } = task;

  const handleTextAreaChange = e => {
    dispatch(setEmailNote({ text: e.target.value, id }));
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(id));
  }

  const handlePriorityChange = (increment) => {
    dispatch(changePriority({ id, increment }));
    handleFilterTasks();
  };

  const statusColor = getStatusColor(status);

  const handleGoToTicket = () => {
    const ticketNumber = taskTicketText.split(' ')[0]
    const address = `http://jira.internet.int/browse/${ticketNumber}`
    window.open(address, '_blank');
  };

  return (
    <TableRow key={id} sx={{ height: '100%' }}>
        <TableCell sx={{ padding: '5px', textAlign: 'center', borderLeft: `15px solid ${statusColor}` }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '-10px' }}>
          <IconButton onClick={() => handlePriorityChange(-1)}>
            <ExpandLess />
          </IconButton>
          <IconButton onClick={() => handlePriorityChange(1)}>
            <ExpandMore />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell sx={{ padding: '5px', width: '300px' }}>{taskTicketText}</TableCell>
      <TableCell sx={{ padding: '5px' }}>
        <StatusSelect status={status} id={id} />
      </TableCell>
      <TableCell sx={{ padding: '5px', width: '150px' }}>{projects}</TableCell>
      <TableCell sx={{ padding: '5px' }}>
        <TextArea rows={1} text={emailNote} handleChange={handleTextAreaChange} />
      </TableCell>
      <TableCell sx={{ padding: '5px' }}>
        <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'no wrap' }}>
          <IconButton>
            <Edit />
          </IconButton>
          <IconButton onClick={handleGoToTicket}>
            <Link />
          </IconButton>
          <IconButton onClick={handleDeleteTask}>
            <DeleteForever />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TaskTableRow;