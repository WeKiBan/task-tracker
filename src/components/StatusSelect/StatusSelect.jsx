import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from 'react-redux';

export default function StatusSelect({setStatus, status, id}) {
  const dispatch = useDispatch()
  const handleChange = (e) => {
    console.log(e.target.value);
    dispatch(setStatus({id, status: e.target.value}));
  }

  return (
    <Box sx={{ minWidth: 120, width: "100%" }}>
      <FormControl fullWidth>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          id="status-select"
          value={status}
          label="Status"
          onChange={handleChange}
          defaultValue='not started'
        >
          <MenuItem value='not started'>NOT STARTED</MenuItem>
          <MenuItem value='refused'>REFUSED</MenuItem>
          <MenuItem value='closed'>CLOSED</MenuItem>
          <MenuItem value='in dev'>IN DEV</MenuItem>
          <MenuItem value='in prod'>IN PROD</MenuItem>
          <MenuItem value='waiting for info'>IN DEV</MenuItem>
          <MenuItem value='in progress'>IN PROGRESS</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}