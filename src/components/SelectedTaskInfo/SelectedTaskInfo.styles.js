import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
}));

export const Container = styled(Box)(({ theme, flexDirection, justifyContent, padding }) => ({
  display: 'flex',
  flexDirection: flexDirection || 'row',
  justifyContent: justifyContent || 'flex-start',
  flex: '100%',
  height: '100%',
  gap: theme.spacing(2),
  padding: padding || '',
  borderRadius: theme.shape.borderRadius,
  minHeight: 0,
  minWidth: 0,
}));

export const Column = styled(Box)(({ theme, flexamount }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  flex: flexamount || 1,
  borderRadius: theme.shape.borderRadius,
}));
