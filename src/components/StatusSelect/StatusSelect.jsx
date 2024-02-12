import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import { setStatus } from '../../redux/slices/taskSlice';

export default function StatusSelect({status, id}) {
  const dispatch = useDispatch()
  const handleChange = (e) => {
    dispatch(setStatus({id, status: e.target.value}));
  }

  return (
    <Box sx={{ minWidth: 120, width: "100%" }}>
      <FormControl fullWidth size="small">
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
          <MenuItem value='in dev'>IN DEV</MenuItem>
          <MenuItem value='in prod'>IN PROD</MenuItem>
          <MenuItem value='in progress'>IN PROGRESS</MenuItem>
          <MenuItem value='waiting for info'>WAITING FOR INFO</MenuItem>
          <MenuItem value='closed'>CLOSED</MenuItem>
          <MenuItem value='reassigned'>REASSIGNED</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}