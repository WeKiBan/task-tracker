import AddProjectForm from './AddProjectForm';

export default {
  title: 'Forms/AddProjectForm',
  component: AddProjectForm,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  return <AddProjectForm {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  onSubmit: (Project) => {
    console.log('Project submitted:', Project);
  },
};
