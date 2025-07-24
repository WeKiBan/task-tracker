import { Box } from "@mui/material";
import TaskListContainer from "../../components/TaskListContainer/TaskListContainer";
import TaskListItem from "../../components/TaskListItem/TaskListItem";
import SelectedTaskInfo from "../../components/SelectedTaskInfo/SelectedTaskInfo";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

const ActiveTasks = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const selectedTask = useSelector((state) =>
    state.tasks.tasks.find((t) => t.id === selectedTaskId),
  );
  const tasks = useSelector((state) => state.tasks.tasks);

  const onSelectTask = (task) => {
    console.log(`Selected task: ${task.id}`);
    setSelectedTaskId(task.id);
  };

  const onClickArrowUp = () => {
    console.log("Arrow up clicked");
  };

  const onClickArrowDown = () => {
    console.log("Arrow down clicked");
  };

  const onClickAdd = () => {
    console.log("Add task clicked");
  };

  useEffect(() => {
    if (tasks.length > 0 && !selectedTaskId) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks, selectedTaskId]);

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
