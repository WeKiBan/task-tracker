import { Provider } from 'react-redux';

import { mockProjects } from '../../../.storybook/mocks/projects';
import { createMockStore } from '../../redux/mockStore';
import AddProjectModal from './AddProjectModal';

export default {
  title: 'Modals/AddProjectModal',
  component: AddProjectModal,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  const store = createMockStore({
    projects: {
      projects: mockProjects,
    },
  });

  return (
    <Provider store={store}>
      <AddProjectModal {...args} />
    </Provider>
  );
}

export const Default = Template.bind({});

Default.args = {
  isOpen: true,
  onClose: () => console.log('close'),
};
