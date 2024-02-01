import { Box } from '@mui/material';
import NavBar from '../Nav/Nav';


export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%', maxHeight: '100%' }}>
    <NavBar />
    {children}
    </Box>
  )
}