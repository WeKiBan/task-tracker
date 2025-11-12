import NoTasks from './NoTasks';

export default {
  title: 'NoTasks',
  component: NoTasks,
};

function Template(args) {
  return <NoTasks {...args} />;
}

export const Default = Template.bind({});
Default.args = {};
