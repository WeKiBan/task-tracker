import { fn } from "@storybook/test";
import TaskListItem from "./TaskListItem";

export default {
  title: "Task List Item",
  component: TaskListItem,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => (
  <div style={{ width: "300px" }}>
    <TaskListItem {...args} />
  </div>
);

export const TaskListItemComponent = Template.bind({});
TaskListItemComponent.args = {
  status: "inProd",
  title: "MATCHCNT-1914",
  description: "Nations League 24-25 problemi Foglie match",
  isSelected: false,
  onClickArrowUp: fn(() => console.log("arrow-up")),
  onClickArrowDown: fn(() => console.log("arrow-down")),
  onSelectTask: fn(() => console.log("select-task")),
};
