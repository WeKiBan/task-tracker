import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import NavBar from '../Nav/Nav';

export default function Layout({ children }) {
  const { authToken, emailVerified } = useSelector((state) => state.auth);
  const location = useLocation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100%',
      }}
    >
      {location.pathname === '/active-tasks' ||
        (location.pathname === '/inactive-tasks' && authToken && emailVerified && <NavBar />)}
      {location.pathname === '/' && <NavBar />}
      {children}
    </Box>
  );
}
