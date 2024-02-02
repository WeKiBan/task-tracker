// TaskTableRow.js
import { DeleteForever, Edit, Link } from '@mui/icons-material';
import { TableCell, TableRow, IconButton, Box } from '@mui/material';
import StatusSelect from '../StatusSelect/StatusSelect';
import TextArea from '../TextArea/TextArea';
import { useDispatch } from 'react-redux';
import { deleteTask, setEmailNote } from '../../redux/taskSlice';
import { Draggable } from 'react-beautiful-dnd';

const TaskTableRow = ({ task, provided, dragHandleProps }) => {
  const dispatch = useDispatch();
  const { id, priority, taskTicketText, status, projects, emailNote } = task;

  const handleTextAreaChange = (e) => {
    dispatch(setEmailNote({ text: e.target.value, id }));
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(id));
  };

  const handleGoToTicket = () => {
    const ticketNumber = taskTicketText.split(' ')[0];
    const address = `http://jira.internet.int/browse/${ticketNumber}`;
    window.open(address, '_blank');
  };

  return (
    <Draggable draggableId={id.toString()} index={provided.index} {...provided.draggableProps} {...provided.dragHandleProps}>
      {(provided) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          key={id}
          sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)', height: '100%' }}
        >
          <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{priority}</TableCell>
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
              <IconButton {...dragHandleProps}>
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
      )}
    </Draggable>
  );
};

export default TaskTableRow;
