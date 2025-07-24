import { fn } from "@storybook/test";
import ListContainer from "./ListContainer";
import { mockSubtasks } from "../../../.storybook/mocks/subtasks";
import SubtaskListItem from "../SubtaskListItem/SubtaskListItem";

export default {
  title: "List Container",
  component: ListContainer,
  parameters: {
    layout: "centered",
  },
};

export const ListContainerComponent = (args) => {
  const onSelectTask = (id) => console.log(`select task ${id}`);
  const onDeleteTask = (id) => console.log(`delete task ${id}`);
  return (
    <div style={{ width: "300px", height: "280px" }}>
      <ListContainer {...args}>
        {mockSubtasks.map((subtask) => (
          <SubtaskListItem
            key={subtask.id}
            onDeleteTask={onDeleteTask}
            onSelectTask={onSelectTask}
            subtask={subtask}
          />
        ))}
      </ListContainer>
    </div>
  );
};

ListContainerComponent.args = {
  label: "Subtasks",
  onClickAdd: fn(() => console.log("add")),
  emptyElementHeight: "46px",
};

export const EmptyListContainerComponent = (args) => {
  const onSelectTask = (id) => console.log(`select task ${id}`);
  const onDeleteTask = (id) => console.log(`delete task ${id}`);
  return (
    <div style={{ width: "300px", height: "280px" }}>
      <ListContainer {...args}>
        {[].map((subtask) => (
          <SubtaskListItem
            key={subtask.id}
            onDeleteTask={onDeleteTask}
            onSelectTask={onSelectTask}
            subtask={subtask}
          />
        ))}
      </ListContainer>
    </div>
  );
};

EmptyListContainerComponent.args = {
  label: "Subtasks",
  onClickAdd: fn(() => console.log("add")),
  emptyElementHeight: "46px",
};
