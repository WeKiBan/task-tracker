import { fn } from '@storybook/test';

import ProjectListItem from './ProjectListItem';

export default {
  title: 'Project List Item',
  component: ProjectListItem,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  return (
    <div style={{ width: '300px' }}>
      <ProjectListItem {...args} />
    </div>
  );
}

export const ProjectListItemComponent = Template.bind({});
ProjectListItemComponent.args = {
  type: 'js',
  title: 'rcs_mc_widget',
  onClickDelete: fn(() => console.log('delete')),
  onClickLink: fn(() => console.log('go to link')),
};
