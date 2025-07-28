import AddProjectForm from "./AddProjectForm";

export default {
  title: "Forms/AddProjectForm",
  component: AddProjectForm,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => <AddProjectForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSubmit: (Project) => {
    console.log("Project submitted:", Project);
  },
};
