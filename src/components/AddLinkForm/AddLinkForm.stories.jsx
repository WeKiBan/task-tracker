import AddLinkForm from './AddLinkForm';

export default {
  title: 'Forms/AddLinkForm',
  component: AddLinkForm,
  parameters: {
    layout: 'centered',
  },
};

function Template({ onSubmit }) {
  return <AddLinkForm onSubmit={onSubmit} />;
}

export const Default = Template.bind({});
Default.args = {
  onSubmit: (link) => {
    console.log('Link submitted:', link);
  },
};
