import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const LayoutContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  maxHeight: '100%',
  background: theme.palette.backgroundColors.mediumGrey,
}));
