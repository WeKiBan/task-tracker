import SelectedTaskInfo from "./SelectedTaskInfo";
import { mockTasks } from "../../../.storybook/mocks/tasks";

export default {
  title: "Selected Task Info",
  component: SelectedTaskInfo,
  parameters: {
    layout: "fullscreen",
  },
};

const Template = (args) => <SelectedTaskInfo {...args} />;

export const SelectedTaskInfoComponent = Template.bind({});

SelectedTaskInfoComponent.args = {
  task: mockTasks[0],
};
