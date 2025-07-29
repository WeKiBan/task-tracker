import AddTaskModal from './AddTaskModal';

export default {
  title: 'Modals/AddTaskModal',
  component: AddTaskModal,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  return <AddTaskModal {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  onClose: () => console.log('close'),
  handleAddNewTask: (id, link, title) => console.log(id, link, title),
};
