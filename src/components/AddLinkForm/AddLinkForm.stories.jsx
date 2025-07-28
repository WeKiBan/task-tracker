import AddLinkForm from "./AddLinkForm";

export default {
  title: "Forms/AddLinkForm",
  component: AddLinkForm,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => <AddLinkForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSubmit: (link) => {
    console.log("Link submitted:", link);
  },
};
