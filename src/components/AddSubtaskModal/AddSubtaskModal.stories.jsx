import AddSubtaskModal from './AddSubtaskModal';

export default {
  title: 'Modals/AddSubtaskModal',
  component: AddSubtaskModal,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  return <AddSubtaskModal {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  onClose: () => console.log('close'),
  handleAddNewSubtask: (id, link, title) => console.log(id, link, title),
};
