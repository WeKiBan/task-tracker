import { fn } from '@storybook/test';

import SubtaskListItem from './SubtaskListItem';

export default {
  title: 'Subtask List Item',
  component: SubtaskListItem,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  return (
    <div style={{ width: '300px' }}>
      <SubtaskListItem {...args} />
    </div>
  );
}

export const SubtaskListItemComponent = Template.bind({});
SubtaskListItemComponent.args = {
  subtask: { id: 1, title: 'Subtask 1', status: 'blocked', link: '#' },
  onDeleteTask: fn((id) => console.log(`delete task ${id}`)),
  onSelectTask: fn((id) => console.log(`select task ${id}`)),
};
