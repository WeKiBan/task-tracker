import { fn } from "@storybook/test";
import EmptyListItem from "./EmptyListItem";

export default {
  title: "Empty List Item",
  component: EmptyListItem,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => (
  <div style={{ width: "400px" }}>
    <EmptyListItem {...args} />
  </div>
);

export const EmptyListItemComponent = Template.bind({});
EmptyListItemComponent.args = {
  height: "86px",
  iconSize: "36px",
  onClickAdd: fn(() => console.log("add")),
};
