import { FormControl, TextField } from '@mui/material';

function AddTaskForm({ link, setLink, title, setTitle }) {
  return (
    <FormControl
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, paddingTop: '10px' }}
    >
      <TextField
        fullWidth
        required
        label="Title"
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

export default AddTaskForm;
