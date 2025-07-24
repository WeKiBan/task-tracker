import TaskListContainer from "./TaskListContainer";
import { mockTasks } from "../../../.storybook/mocks/tasks";
import TaskListItem from "../TaskListItem/TaskListItem";
import { useState } from "react";

export default {
  title: "Task List Container",
  component: TaskListContainer,
  parameters: {
    layout: "centered",
  },
};

export const TaskListContainerComponent = (args) => {
  const [selectedTaskId, setSelectedtaskId] = useState(mockTasks[0]?.id);
  const [tasks, setTasks] = useState(mockTasks);

  const onSelectTask = (id) => setSelectedtaskId(id);
  const onClickArrowDown = (id) => console.log(`move task ${id} down`);
  const onClickArrowUp = (id) => console.log(`move task ${id} up`);
  const onClickAdd = () => console.log(`add task`);
  const onSearch = (value) => {
    setTasks(
      mockTasks.filter(
        (task) =>
          task.description.toLowerCase().includes(value.toLowerCase()) ||
          task.title.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  return (
    <div style={{ width: "344px", height: "450px" }}>
      <TaskListContainer onSearch={onSearch} onClickAdd={onClickAdd} {...args}>
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
    </div>
  );
};

TaskListContainerComponent.args = {
  emptyElementHeight: "8.6rem",
};

export const EmptyListContainerComponent = (args) => {
  const [selectedTaskId, setSelectedtaskId] = useState(mockTasks[0]?.id);

  const onSelectTask = (id) => setSelectedtaskId(id);
  const onClickArrowDown = (id) => console.log(`move task ${id} down`);
  const onClickArrowUp = (id) => console.log(`move task ${id} up`);
  const onClickAdd = () => console.log(`add task`);
  return (
    <div style={{ width: "344px", height: "450px" }}>
      <TaskListContainer {...args}>
        {[].map((task) => (
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
    </div>
  );
};

EmptyListContainerComponent.args = {
  emptyElementHeight: "8.6rem",
};
