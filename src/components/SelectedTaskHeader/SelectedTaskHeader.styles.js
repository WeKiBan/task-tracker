import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeaderWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'status',
})(({ theme, status }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.backgroundColors.white,
  borderLeft: `1.2rem solid ${theme.palette.taskStatusColors[status]}`,
  width: '100%',
  padding: '0.5rem',
}));

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.textColors.darkGrey,
  fontSize: '1.6rem',
}));

export const StatusWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'status',
})(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  minWidth: '150px',
}));

export const StatusLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 'medium',
  color: theme.palette.textColors.lightGrey,
}));
