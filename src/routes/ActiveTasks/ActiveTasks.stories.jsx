import React from "react";
import { Provider } from "react-redux";
import ActiveTasks from "./ActiveTasks";
import { mockTasks } from "../../../.storybook/mocks/tasks";
import { createMockStore } from "../../redux/mockStore";

export default {
  title: "Active Tasks",
  component: ActiveTasks,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => {
  const store = createMockStore({
    tasks: {
      tasks: mockTasks,
    },
  });

  return (
    <Provider store={store}>
      <ActiveTasks {...args} />
    </Provider>
  );
};

export const ActiveTasksComponent = Template.bind({});
ActiveTasksComponent.args = {
  isStorybook: true,
};
