// components/AddLinkForm.jsx
import { TextField, FormControl } from "@mui/material";

const AddLinkForm = ({ onChange, linkData }) => {
  const handleChange = (field, e) => {
    onChange((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <FormControl
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        fullWidth
        required
        label="Title"
        value={linkData.title}
        onChange={(e) => handleChange("title", e)}
        autoFocus
      />
      <TextField
        fullWidth
        required
        label="Link"
        value={linkData.link}
        onChange={(e) => handleChange("link", e)}
      />
    </FormControl>
  );
};

export default AddLinkForm;
