import SelectedTaskHeader from "./SelectedTaskHeader";
import { mockTasks } from "../../../.storybook/mocks/tasks";

export default {
  title: "Selected Task Header",
  component: SelectedTaskHeader,
  parameters: {
    layout: "centered",
  },
};

export const SelectedTaskHeaderComponent = (args) => (
  <div style={{ width: "800px" }}>
    <SelectedTaskHeader {...args} />
  </div>
);

SelectedTaskHeaderComponent.args = {
  task: mockTasks[0],
};
