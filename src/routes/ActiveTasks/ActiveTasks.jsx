import { Box } from "@mui/material";
import TaskListContainer from "../../components/TaskListContainer/TaskListContainer";
import TaskListItem from "../../components/TaskListItem/TaskListItem";
import SelectedTaskInfo from "../../components/SelectedTaskInfo/SelectedTaskInfo";
import { useActiveTasks } from "./useActiveTasks";

const ActiveTasks = () => {
  const {
    tasks,
    selectedTaskId,
    selectedTask,
    onSelectTask,
    onClickArrowUp,
    onClickArrowDown,
    onClickAdd,
  } = useActiveTasks();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        width: "100%",
        height: "100%",
        gap: "12px",
      }}
      component="main"
    >
      {selectedTask && tasks && tasks.length > 0 && (
        <TaskListContainer>
          {tasks.map((task) => (
            <TaskListItem
              key={task.id}
              onSelectTask={onSelectTask}
              onClickArrowUp={onClickArrowUp}
              onClickArrowDown={onClickArrowDown}
              onClickAdd={onClickAdd}
              task={task}
              selectedTaskId={selectedTaskId}
            />
          ))}
        </TaskListContainer>
      )}

      {selectedTask ? (
        <SelectedTaskInfo task={selectedTask} />
      ) : (
        <div>Select a task</div>
      )}
    </Box>
  );
};

export default ActiveTasks;
