// components/AddSubtaskForm.jsx
import { TextField, FormControl } from "@mui/material";

const AddSubtaskForm = ({ onChange, subtaskData }) => {
  const handleChange = (field, e) => {
    onChange((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <FormControl
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingTop: "10px",
      }}
    >
      <TextField
        fullWidth
        required
        label="Subtask"
        value={subtaskData.title}
        onChange={(e) => handleChange("title", e)}
        autoFocus
      />
      <TextField
        fullWidth
        required
        label="Link"
        value={subtaskData.link}
        onChange={(e) => handleChange("link", e)}
      />
    </FormControl>
  );
};

export default AddSubtaskForm;
