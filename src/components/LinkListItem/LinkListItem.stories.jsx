import { fn } from '@storybook/test';

import { mockLinks } from '../../../.storybook/mocks/links';
import LinkListItem from './LinkListItem';

export default {
  title: 'Link List Item',
  component: LinkListItem,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  return (
    <div style={{ width: '300px' }}>
      <LinkListItem {...args} />
    </div>
  );
}

export const LinkListItemComponent = Template.bind({});
LinkListItemComponent.args = {
  linkData: mockLinks[0],
  onDeleteLink: fn((id) => console.log(`delete link ${id}`)),
};
