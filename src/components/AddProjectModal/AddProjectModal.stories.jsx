import AddProjectModal from "./AddProjectModal";
import { Provider } from "react-redux";
import { mockProjects } from "../../../.storybook/mocks/projects";
import { createMockStore } from "../../redux/mockStore";

export default {
  title: "Modals/AddProjectModal",
  component: AddProjectModal,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => {
  const store = createMockStore({
    projects: {
      projects: mockProjects,
    },
  });

  return (
    <Provider store={store}>
      <AddProjectModal {...args} />
    </Provider>
  );
};

export const Default = Template.bind({});

Default.args = {
  isOpen: true,
  onClose: () => console.log("close"),
};
