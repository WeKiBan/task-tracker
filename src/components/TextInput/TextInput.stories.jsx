import { useState } from "react";
import TextInput from "./TextInput";

export default {
  title: "Text Input",
  component: TextInput,
  parameters: {
    layout: "centered",
  },
};

const Template = (args) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div style={{ width: "400px" }}>
      <TextInput {...args} value={value} handleChange={handleChange} />
    </div>
  );
};

export const TextInputComponent = Template.bind({});
TextInputComponent.args = {
  label: "Description",
  rows: 5,
};
