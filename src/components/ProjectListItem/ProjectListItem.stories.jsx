import { fn } from "@storybook/test";
import ProjectListItem from "./ProjectListItem";

export default {
  title: "Project List Item",
  component: ProjectListItem,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => (
  <div style={{ width: "300px" }}>
    <ProjectListItem {...args} />
  </div>
);

export const ProjectListItemComponent = Template.bind({});
ProjectListItemComponent.args = {
  color: "js",
  title: "rcs_mc_widget",
  onClickDelete: fn(() => console.log("delete")),
  onClickLink: fn(() => console.log("go to link")),
};
