import { fn } from "@storybook/test";
import LinkListItem from "./LinkListItem";
import { mockLinks } from "../../../.storybook/mocks/links";

export default {
  title: "Link List Item",
  component: LinkListItem,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => (
  <div style={{ width: "300px" }}>
    <LinkListItem {...args} />
  </div>
);

export const LinkListItemComponent = Template.bind({});
LinkListItemComponent.args = {
  linkData: mockLinks[0],
  onDeleteLink: fn((id) => console.log(`delete link ${id}`)),
};
