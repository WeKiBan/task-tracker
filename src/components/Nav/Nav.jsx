import { useState } from 'react';
import { AppBar, Drawer, List, ListItem, ListItemText, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleOptionClick = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Material-UI AppBar */}
      <AppBar position="static">
        <Toolbar sx={{justifyContent: "space-between"}}>
          <Typography variant="h6">Task Tracker</Typography>
          <IconButton onClick={handleDrawerToggle}><MenuIcon sx={{fontSize: "50px"}}/></IconButton>
        </Toolbar>
      </AppBar>

      {/* Material-UI Drawer for Side Menu */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
        <List>
          {/* Active Tasks Option */}
          <ListItem

            onClick={() => handleOptionClick('active')}
          >
            <ListItemText primary="Active Tasks" />
          </ListItem>

          {/* Closed Tasks Option */}
          <ListItem
            onClick={() => handleOptionClick('closed')}
          >
            <ListItemText primary="Closed Tasks" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;