import AddSubtaskForm from "./AddSubtaskForm";
import { useState } from "react";

export default {
  title: "Forms/AddSubtaskForm",
  component: AddSubtaskForm,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => {
  const [subtaskData, setSubtaskData] = useState({
    title: "",
    link: "",
  });

  return (
    <AddSubtaskForm
      {...args}
      onChange={setSubtaskData}
      subtaskData={subtaskData}
    />
  );
};

export const Default = Template.bind({});
