import { mockTasks } from '../../../.storybook/mocks/tasks';
import SelectedTaskInfo from './SelectedTaskInfo';

export default {
  title: 'Selected Task Info',
  component: SelectedTaskInfo,
  parameters: {
    layout: 'fullscreen',
  },
};

function Template(args) {
  return <SelectedTaskInfo {...args} />;
}

export const SelectedTaskInfoComponent = Template.bind({});

SelectedTaskInfoComponent.args = {
  task: mockTasks[0],
};
