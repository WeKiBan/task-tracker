import AddTaskForm from './AddTaskForm';

export default {
  title: 'Forms/AddTaskForm',
  component: AddTaskForm,
  parameters: {
    layout: 'centered',
  },
};

function Template({ onSubmit }) {
  return <AddTaskForm onSubmit={onSubmit} />;
}

export const Default = Template.bind({});
Default.args = {
  onSubmit: (link) => {
    console.log('Task submitted:', link);
  },
};
