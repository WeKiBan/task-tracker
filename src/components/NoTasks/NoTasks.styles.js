import { styled } from '@mui/material/styles';

export const NoTasksContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  padding: '24px',
  borderRadius: '6px',
  backgroundColor: theme.palette.backgroundColors.darkGrey,
  color: theme.palette.textColors.darkGrey,
}));
