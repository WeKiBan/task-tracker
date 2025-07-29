import { Provider } from 'react-redux';

import { mockProjects } from '../../../.storybook/mocks/projects';
import { mockTasks } from '../../../.storybook/mocks/tasks';
import { createMockStore } from '../../redux/mockStore';
import ActiveTasks from './ActiveTasks';

export default {
  title: 'Active Tasks',
  component: ActiveTasks,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  const store = createMockStore({
    tasks: {
      tasks: mockTasks,
    },
    projects: {
      projects: mockProjects,
    },
  });

  return (
    <Provider store={store}>
      <ActiveTasks {...args} />
    </Provider>
  );
}

export const ActiveTasksComponent = Template.bind({});
ActiveTasksComponent.args = {
  isStorybook: true,
};
