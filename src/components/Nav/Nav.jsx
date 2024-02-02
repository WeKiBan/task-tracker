import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';

const Nav = () => {
  let navigate = useNavigate();

  const handleOptionClick = page => {
    navigate(page);
  };

  return (
    <>
      {/* Material-UI AppBar */}
      <AppBar position='static'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant='h6'>Task Tracker</Typography>
          <Box sx={{display: "flex", gap: '10px'}}>
            <Button sx={{fontSize: "20px"}} fullWidth color='success' variant='secondary' onClick={() => handleOptionClick('/task-tracker/')}>
              Tasks
            </Button>
            <IconButton onClick={() => handleOptionClick('/task-tracker/settings')}>
              <SettingsIcon sx={{fontSize: '40px'}} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
