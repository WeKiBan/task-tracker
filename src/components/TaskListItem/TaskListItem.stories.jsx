import { fn } from '@storybook/test';

import TaskListItem from './TaskListItem';

export default {
  title: 'Task List Item',
  component: TaskListItem,
  parameters: {
    layout: 'centered',
  },
};

export function TaskListItemSelected(args) {
  return (
    <div style={{ width: '400px' }}>
      <TaskListItem {...args} />
    </div>
  );
}

TaskListItemSelected.args = {
  task: {
    id: 1,
    title: 'GAZZAMOTOR-1667',
    status: 'inProgress',
    link: '#',
    description:
      'This task involves updating the motor section with the latest articles and reviews.',
    notes:
      'Waiting for the final approval from the content team. Ensure to follow the motor guidelines.',
    emailNotes: 'Sent an update to the client regarding the changes. Awaiting feedback.',
  },
  selectedTaskId: 2,
  onClickArrowUp: fn(() => console.log('arrow-up')),
  onClickArrowDown: fn(() => console.log('arrow-down')),
  onSelectTask: fn(() => console.log('select-task')),
};

export function TaskListItemNotSelected(args) {
  return (
    <div style={{ width: '400px' }}>
      <TaskListItem {...args} />
    </div>
  );
}

TaskListItemNotSelected.args = {
  task: {
    id: 1,
    title: 'GAZZAMOTOR-1667',
    status: 'inProgress',
    link: '#',
    description:
      'This task involves updating the motor section with the latest articles and reviews.',
    notes:
      'Waiting for the final approval from the content team. Ensure to follow the motor guidelines.',
    emailNotes: 'Sent an update to the client regarding the changes. Awaiting feedback.',
  },
  selectedTaskId: 1,
  onClickArrowUp: fn(() => console.log('arrow-up')),
  onClickArrowDown: fn(() => console.log('arrow-down')),
  onSelectTask: fn(() => console.log('select-task')),
};
