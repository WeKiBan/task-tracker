import AddLinkModal from "./AddLinkModal";

export default {
  title: "Modals/AddLinkModal",
  component: AddLinkModal,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => <AddLinkModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  onClose: () => console.log("close"),
  handleAddNewLink: (id, link, title) => console.log(id, link, title),
};
