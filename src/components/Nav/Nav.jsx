import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const Nav = () => {
  let navigate = useNavigate();

  const handleOptionClick = page => {
    navigate(page);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('signed out');
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log('An error has occured: ', errorCode, errorMessage);
    }
  };

  return (
    <>
      {/* Material-UI AppBar */}
      <AppBar position='static'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h6'>Task Tracker</Typography>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button sx={{ fontSize: '20px' }} fullWidth color='success' variant='secondary' onClick={() => handleOptionClick('/task-tracker/')}>
              Tasks
            </Button>
            <IconButton onClick={() => handleOptionClick('/task-tracker/settings')}>
              <SettingsIcon sx={{ fontSize: '40px' }} />
            </IconButton>
            <IconButton onClick={handleLogout}>
              <LogoutIcon sx={{ fontSize: '40px' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
