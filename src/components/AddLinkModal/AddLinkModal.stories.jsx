import AddLinkModal from './AddLinkModal';

export default {
  title: 'Modals/AddLinkModal',
  component: AddLinkModal,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  return <AddLinkModal {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  onClose: () => console.log('close'),
  handleAddNewLink: (id, link, title) => console.log(id, link, title),
};
