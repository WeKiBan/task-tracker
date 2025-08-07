import { Box } from '@mui/material';

import AddTaskModal from '../../components/AddTaskModal/AddTaskModal';
import NoTasks from '../../components/NoTasks/NoTasks';
import SelectedTaskInfo from '../../components/SelectedTaskInfo/SelectedTaskInfo';
import TaskListContainer from '../../components/TaskListContainer/TaskListContainer';
import TaskListItem from '../../components/TaskListItem/TaskListItem';
import { useActiveTasks } from './useActiveTasks';

function ActiveTasks() {
  const {
    activeTasks,
    selectedTaskId,
    selectedTask,
    addTaskModalOpen,
    query,
    closeTaskModal,
    openTaskModal,
    onSelectTask,
    onClickArrowUp,
    onClickArrowDown,
    handleSearch,
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
          padding: '10px',
        }}
        component="main"
      >
        <TaskListContainer
          onClickAdd={openTaskModal}
          emptyElementHeight="90px"
          onSearch={handleSearch}
          query={query}
        >
          {activeTasks
            .filter(
              (task) =>
                task.title.toLowerCase().includes(query.toLowerCase()) ||
                task.description.toLowerCase().includes(query.toLowerCase()),
            )
            .map((task) => (
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
        {activeTasks.length === 0 && <NoTasks handleAddNewTask={openTaskModal} />}
        {activeTasks.length !== 0 && selectedTask && <SelectedTaskInfo task={selectedTask} />}
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
