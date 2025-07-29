import { Box } from '@mui/material';

import AddTaskModal from '../../components/AddTaskModal/AddTaskModal';
import SelectedTaskInfo from '../../components/SelectedTaskInfo/SelectedTaskInfo';
import TaskListContainer from '../../components/TaskListContainer/TaskListContainer';
import TaskListItem from '../../components/TaskListItem/TaskListItem';
import { useActiveTasks } from './useActiveTasks';

function ActiveTasks() {
  const {
    tasks,
    selectedTaskId,
    selectedTask,
    addTaskModalOpen,
    closeTaskModal,
    openTaskModal,
    onSelectTask,
    onClickArrowUp,
    onClickArrowDown,
  } = useActiveTasks();

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          width: '100%',
          height: '100%',
          gap: '12px',
        }}
        component="main"
      >
        {selectedTask && tasks && tasks.length > 0 && (
          <TaskListContainer
            onClickAdd={openTaskModal}
            emptyElementHeight="90"
            onSearch={() => console.log('Search not implemented')}
          >
            {tasks.map((task) => (
              <TaskListItem
                key={task.id}
                onSelectTask={onSelectTask}
                onClickArrowUp={onClickArrowUp}
                onClickArrowDown={onClickArrowDown}
                task={task}
                selectedTaskId={selectedTaskId}
              />
            ))}
          </TaskListContainer>
        )}

        {selectedTask ? <SelectedTaskInfo task={selectedTask} /> : <div>Select a task</div>}
      </Box>
      <AddTaskModal
        isOpen={addTaskModalOpen}
        onClose={closeTaskModal}
        onSelectTask={onSelectTask}
      />
    </>
  );
}

export default ActiveTasks;
