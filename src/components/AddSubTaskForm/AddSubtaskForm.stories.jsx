import { useState } from 'react';

import AddSubtaskForm from './AddSubtaskForm';

export default {
  title: 'Forms/AddSubtaskForm',
  component: AddSubtaskForm,
  parameters: {
    layout: 'centered',
  },
};

function Template(args) {
  const [subtaskData, setSubtaskData] = useState({
    title: '',
    link: '',
  });

  return <AddSubtaskForm {...args} onChange={setSubtaskData} subtaskData={subtaskData} />;
}

export const Default = Template.bind({});
