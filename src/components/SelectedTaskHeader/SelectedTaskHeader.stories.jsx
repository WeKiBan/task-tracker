import { mockTasks } from '../../../.storybook/mocks/tasks';
import SelectedTaskHeader from './SelectedTaskHeader';

export default {
  title: 'Selected Task Header',
  component: SelectedTaskHeader,
  parameters: {
    layout: 'centered',
  },
};

export function SelectedTaskHeaderComponent(args) {
  return (
    <div style={{ width: '800px' }}>
      <SelectedTaskHeader {...args} />
    </div>
  );
}

SelectedTaskHeaderComponent.args = {
  task: mockTasks[0],
};
