import Nav from "./Nav";

export default {
  title: "Nav Bar",
  component: Nav,
  parameters: {
    layout: "centered",
  },
};

export const NavComponent = (args) => (
  <div style={{ width: "1200px" }}>
    <Nav {...args} />
  </div>
);

NavComponent.args = {
  isStorybook: true,
};
