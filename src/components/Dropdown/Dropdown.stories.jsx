import { fn } from "@storybook/test";
import Dropdown from "./Dropdown";
import { TICKET_STATUSES } from "../../config/constants";

export default {
  title: "Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => (
  <div style={{ width: "400px" }}>
    <Dropdown {...args} />
  </div>
);

export const DropdownComponent = Template.bind({});

DropdownComponent.args = {
  value: { key: "notStarted", label: "Not started" },
  options: TICKET_STATUSES,
  onChange: fn(() => console.log("change item")),
};
