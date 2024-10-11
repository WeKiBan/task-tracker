import { fn } from "@storybook/test";
import SubtaskListItem from "./SubtaskListItem";

export default {
  title: "Subtask List Item",
  component: SubtaskListItem,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => (
  <div style={{ width: "300px" }}>
    <SubtaskListItem {...args} />
  </div>
);

export const SubtaskListItemComponent = Template.bind({});
SubtaskListItemComponent.args = {
  color: "blocked",
  title: "MATCHCNT-1914",
  onClickDelete: fn(() => console.log("delete")),
  onClickLink: fn(() => console.log("go to link")),
};
