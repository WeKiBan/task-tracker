// components/AddSubtaskForm.jsx
import { FormControl, TextField } from '@mui/material';

function AddSubtaskForm({ title, setTitle, link, setLink }) {
  return (
    <FormControl
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingTop: '10px',
      }}
    >
      <TextField
        fullWidth
        required
        label="Subtask"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <TextField
        fullWidth
        required
        label="Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
    </FormControl>
  );
}

export default AddSubtaskForm;
