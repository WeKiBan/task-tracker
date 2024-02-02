import { TextField, Container, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setEmailHeader, setEmailFooter } from '../redux/settingsSlice';


const Settings = () => {
  const dispatch = useDispatch();
  const { emailHeader, emailFooter } = useSelector((state) => state.settings);

  const handleHeaderChange = (event) => {
    dispatch(setEmailHeader(event.target.value));
  };

  const handleFooterChange = (event) => {
    dispatch(setEmailFooter(event.target.value));
  };

  return (
    <Container maxWidth="sm">
      <Typography sx={{marginTop: '50px'}} variant="h4" gutterBottom>
        Settings
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label="Email Header"
          variant="outlined"
          fullWidth
          value={emailHeader}
          onChange={handleHeaderChange}
          multiline
        />
        <TextField
          label="Email Footer"
          variant="outlined"
          fullWidth
          value={emailFooter}
          onChange={handleFooterChange}
          multiline
        />
      </Box>
    </Container>
  );
};

export default Settings;
