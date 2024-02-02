import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DraggableTableRow from "../DraggableTableRow/DraggableTableRow"

const DraggableTable = ({ tasks }) => {
  const onDragEnd = (result) => {
    // TODO: Handle the reorder logic here
    // result.source.index gives the source index
    // result.destination.index gives the destination index
    // Update the order of tasks accordingly

  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="taskTable" type="TASK">
        {(provided) => (
          <TableContainer
            {...provided.droppableProps}
            component={Paper}
            ref={provided.innerRef}
            sx={{ height: '80vh', border: '1px solid rgba(224, 224, 224, 1);' }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: '5px', textAlign: 'center' }}>Priority</TableCell>
                  <TableCell sx={{ padding: '5px', width: '300px' }}>Ticket</TableCell>
                  <TableCell sx={{ padding: '5px' }}>Status</TableCell>
                  <TableCell sx={{ padding: '5px', width: '200px' }}>Projects</TableCell>
                  <TableCell sx={{ padding: '5px' }}>Email Note</TableCell>
                  <TableCell sx={{ padding: '5px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <DraggableTableRow
                        key={task.id}
                        task={task}
                        provided={provided}
                        // Pass the dragHandleProps to the TaskTableRow component
                        dragHandleProps={provided.dragHandleProps}
                        index={index}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableTable;
